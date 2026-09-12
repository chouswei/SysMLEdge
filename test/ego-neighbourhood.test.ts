import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { SysMLEdgeProject } from "../src/bind/project.js";
import { FakeMemNet } from "../src/memnet/fake.js";
import { MEMNET_PATH_B_CON_FLOOR, versionAtLeastFloor } from "../src/memnet/env.js";
import { parseSysmlTree } from "../src/sysml/parse.js";
import type { FoamGoldList } from "../src/sysml/gold.js";
import {
  assertNoMissionTsk,
  parsedTreeFromGold,
  projectionCounts,
} from "../src/sysml/ground.js";

const fixtureRoot = fileURLToPath(new URL("../fixtures/p1-tiny", import.meta.url));
const goldPath = fileURLToPath(new URL("../fixtures/foam-gold/gold.json", import.meta.url));

test("p1-tiny reproject ego: nested + ports + connection via contains/owns/ends", async () => {
  const parsed = await parseSysmlTree(join(fixtureRoot, "sysml-models"));
  assert.deepEqual(assertNoMissionTsk(parsed), []);
  assert.ok(parsed.edges.some((e) => e.kind === "contains" && e.to.endsWith("nestedDetector")));
  assert.ok(parsed.edges.some((e) => e.kind === "owns" && e.to.endsWith("powerIn")));
  assert.ok(parsed.edges.some((e) => e.kind === "ends" && e.qname.includes("powerFeed")));

  const dir = await mkdtemp(join(tmpdir(), "sysmledge-ego-"));
  const mem = new FakeMemNet();
  const p = new SysMLEdgeProject(dir, mem);
  await p.importTree(fixtureRoot);

  const ctx = await p.gqlContext({ qname: "P1Tiny::SensorHub", maxRows: 50 });
  const q = ctx.nodes.map((n) => n.qname);
  assert.ok(q.includes("P1Tiny::SensorHub"));
  assert.ok(q.some((n) => n.endsWith("nestedDetector")), `nested missing in ${q.join(",")}`);
  assert.ok(q.some((n) => n.endsWith("powerIn")), "owns port missing");
  assert.ok(
    ctx.nodes.some((n) => n.kind === "connection" && n.qname.endsWith("powerFeed")) ||
      ctx.edges.some((e) => e.kind === "connection" && e.qname.endsWith("powerFeed")),
    "powerFeed not in neighbourhood",
  );
  assert.ok(ctx.edges.some((e) => e.kind === "contains"));
  assert.ok(ctx.edges.some((e) => e.kind === "owns"));
  assert.ok(!q.some((n) => n.startsWith("TSK_")));

  const nestedEgo = await p.gqlContext({
    qname: "P1Tiny::SensorHub::nestedDetector",
    maxRows: 50,
  });
  assert.ok(nestedEgo.nodes.some((n) => n.qname === "P1Tiny::SensorHub"));
  assert.equal(nestedEgo["rev.stale"], false);

  const impact = await p.gqlImpact({ qname: "P1Tiny::SensorHub", maxRows: 50 });
  assert.ok(impact.nodes.some((n) => n.qname.includes("PowerSupply") || n.qname.includes("powerSupply")));
});

test("Foam gold reconstructed projection: counts + nested ego without TSK owns", async () => {
  const gold = JSON.parse(await readFile(goldPath, "utf8")) as FoamGoldList;
  const tree = parsedTreeFromGold(gold);
  assert.deepEqual(assertNoMissionTsk(tree), []);
  const counts = projectionCounts(tree);
  assert.equal(counts.parts, gold.parts.length);
  assert.equal(counts.ports, gold.ports.length);
  assert.equal(counts.connections, gold.connections.length);
  assert.equal(counts.nested_parts, gold.nested_parts.length);
  assert.equal(gold.counts.parts, 663);
  assert.equal(gold.counts.ports, 1400);
  assert.equal(gold.counts.connections_parsed, 200);
  // Unique port list is 1392; freeze count 1400. MUST NOT invent 8 ports.
  assert.ok(counts.contains >= gold.counts.nested_parts);
  assert.ok(counts.ends >= gold.counts.connections_parsed * 2);
  assert.ok(versionAtLeastFloor(MEMNET_PATH_B_CON_FLOOR, "0.19.9"));

  const mem = new FakeMemNet();
  await mem.reproject("gold", tree);

  for (const qname of [
    "FoamDetectionLiteVer2::CoreVideoMonitorToolbar::backgroundSetIndicator",
    "FoamDetectionLiteVer2::CoreMonitorConfigPanel::backgroundSetIndicator",
  ]) {
    const ctx = await mem.gqlContext({ qname, maxRows: 80 });
    assert.ok(
      ctx.nodes.some((n) => n.qname === qname),
      `seed missing ${qname}`,
    );
    const owner = qname.includes("Toolbar")
      ? "FoamDetectionLiteVer2::CoreVideoMonitorToolbar"
      : "FoamDetectionLiteVer2::CoreMonitorConfigPanel";
    assert.ok(
      ctx.nodes.some((n) => n.qname === owner),
      `owner ${owner} missing from ego (TSK-isolated would fail this)`,
    );
    assert.ok(ctx.edges.some((e) => e.kind === "contains" && e.to === qname));
    assert.ok(!ctx.nodes.some((n) => n.qname.startsWith("TSK_")));
  }

  const foam = await mem.gqlImpact({
    qname: "FoamDetectionLiteVer2::FoamLiteVer2EdgePcSoftware::foamDetection",
    maxRows: 80,
  });
  assert.ok(
    foam.nodes.some(
      (n) => n.qname === "FoamDetectionLiteVer2::FoamLiteVer2EdgePcSoftware::foamDetection",
    ),
  );
  assert.ok(foam.nodes.some((n) => n.qname === "FoamDetectionLiteVer2::FoamLiteVer2EdgePcSoftware"));
});
