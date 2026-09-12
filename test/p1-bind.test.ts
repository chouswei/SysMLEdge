import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { SysMLEdgeProject, StaleError } from "../src/bind/project.js";
import { FakeMemNet } from "../src/memnet/fake.js";
import { parseSysmlTree } from "../src/sysml/parse.js";

const fixtureRoot = fileURLToPath(new URL("../fixtures/p1-tiny", import.meta.url));

async function freshProject(): Promise<SysMLEdgeProject> {
  const dir = await mkdtemp(join(tmpdir(), "sysmledge-p1-"));
  return new SysMLEdgeProject(dir, new FakeMemNet());
}

test("nested nestedDetector is parsed without hand CREATE", async () => {
  const parsed = await parseSysmlTree(join(fixtureRoot, "sysml-models"));
  const qnames = parsed.nodes.map((n) => n.qname);
  assert.ok(qnames.includes("P1Tiny"));
  assert.ok(qnames.includes("P1Tiny::SensorHub"));
  assert.ok(
    qnames.includes("P1Tiny::SensorHub::nestedDetector"),
    `missing nested usage, got ${qnames.join(", ")}`,
  );
  assert.ok(parsed.edges.some((e) => e.qname.endsWith("powerFeed")));
});

test("import binds rev.sha; gql_read is live-SSOT", async () => {
  const p = await freshProject();
  const st = await p.importTree(fixtureRoot);
  assert.equal(st["rev.stale"], false);
  assert.match(st["rev.sha"] as string, /^[0-9a-f]{40}$/);
  assert.equal(st["current.sha"], st["rev.sha"]);
  assert.equal(st.one_way, true);
  assert.equal(st.proof_pass_claimed, false);
  const slice = await p.gqlRead({ keyword: "nestedDetector" });
  assert.equal(slice["rev.stale"], false);
  assert.equal(slice["rev.sha"], st["rev.sha"]);
  assert.ok(
    slice.nodes.some((n) => n.qname.endsWith("nestedDetector")),
    "nested part must be in projection without hand CREATE",
  );
});

test("mutate SysML → STALE fail-closed; propose refused; reproject live", async () => {
  const p = await freshProject();
  await p.importTree(fixtureRoot);
  const sysml = join(p.ssotDir(), "P1Tiny.sysml");
  const body = await readFile(sysml, "utf8");
  await writeFile(sysml, body.replace("SH-001", "SH-002"));
  const st = await p.revStatus();
  assert.equal(st["rev.stale"], true);
  assert.notEqual(st["current.sha"], st["rev.sha"]);

  await assert.rejects(() => p.gqlRead({}), (e: unknown) => {
    assert.ok(e instanceof StaleError);
    assert.equal(e.shape.code, "STALE");
    assert.equal(e.shape["rev.sha"], st["rev.sha"]);
    return true;
  });

  const staleRead = await p.gqlRead({ staleOk: true, keyword: "SensorHub" });
  assert.equal(staleRead["rev.stale"], true);

  await assert.rejects(() => p.propose({ intent: "nope", deltaSysml: "part x;" }), (e: unknown) => {
    assert.ok(e instanceof StaleError);
    return true;
  });

  const live = await p.reproject();
  assert.equal(live["rev.stale"], false);
  const again = await p.gqlRead({ keyword: "SH-002" });
  assert.equal(again["rev.stale"], false);
  assert.equal(again["rev.sha"], live["rev.sha"]);
});

test("propose writes only under proposals/; SSOT unchanged", async () => {
  const p = await freshProject();
  await p.importTree(fixtureRoot);
  const before = await readFile(join(p.ssotDir(), "P1Tiny.sysml"), "utf8");
  const out = await p.propose({
    intent: "rename note",
    deltaSysml: "// delta only\n",
    affected: ["P1Tiny::SensorHub"],
    id: "prop-test-1",
  });
  assert.equal(out.path, "sysml-models/proposals/prop-test-1/");
  assert.match(out["base.sha"], /^[0-9a-f]{40}$/);
  const patch = await readFile(join(p.ssotDir(), "proposals", "prop-test-1", "PATCH.md"), "utf8");
  assert.match(patch, /base\.sha:/);
  assert.match(patch, /GQL never invents SysML back/);
  const delta = await readFile(join(p.ssotDir(), "proposals", "prop-test-1", "delta.sysml"), "utf8");
  assert.equal(delta, "// delta only\n");
  const after = await readFile(join(p.ssotDir(), "P1Tiny.sysml"), "utf8");
  assert.equal(after, before);
});

test("human save new sha; previous zip downloadable; current zip is SysML only", async () => {
  const p = await freshProject();
  const first = await p.importTree(fixtureRoot);
  const firstSha = first["rev.sha"] as string;
  const sysml = join(p.ssotDir(), "P1Tiny.sysml");
  await writeFile(sysml, (await readFile(sysml, "utf8")).replace("PS-001", "PS-099"));
  const second = await p.humanSave("human whole-tree save");
  assert.notEqual(second["rev.sha"], firstSha);
  assert.equal(second["rev.stale"], false);
  const zip = await p.downloadZip(firstSha);
  assert.ok(zip.length > 22);
  assert.equal(zip.readUInt32LE(0), 0x04034b50);
  const currentZip = await p.downloadZip("current");
  const asText = currentZip.toString("binary");
  assert.ok(asText.includes("P1Tiny.sysml") || asText.includes("sysml-models"));
  assert.ok(!asText.includes("graph.kuzu"));
  assert.ok(!asText.includes("proposals/prop"));
});
