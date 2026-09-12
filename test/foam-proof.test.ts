import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { extractFoamGold, assertGoldShape } from "../src/sysml/gold.js";
import { parseSysmlTree } from "../src/sysml/parse.js";
import {
  MEMNET_LLM_FLOOR,
  MemNetEnvError,
  assertLiveMemNetEnv,
  parseMemnetVersion,
  MEMNET_PATH_B_CON_FLOOR,
  versionAtLeastFloor,
} from "../src/memnet/env.js";
import { emptyHeadToHead, runProofHarness, smokeBind } from "../src/proof/harness.js";
import { FOAM_QUESTIONS } from "../src/proof/questions.js";
import { SysMLEdgeProject } from "../src/bind/project.js";
import { FakeMemNet } from "../src/memnet/fake.js";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const fixtureRoot = fileURLToPath(new URL("../fixtures/p1-tiny", import.meta.url));

test("live env fails closed without TCP share or 0.19.8", () => {
  assert.equal(parseMemnetVersion("memnet-llm==0.19.8"), "0.19.8");
  assert.throws(
    () => assertLiveMemNetEnv({ MEMNET_BACKEND: "tcp" }),
    (e: unknown) => e instanceof MemNetEnvError && String(e.message).includes("MEMNET_MCP_TRANSPORT"),
  );
  assert.throws(
    () =>
      assertLiveMemNetEnv({
        MEMNET_BACKEND: "tcp",
        MEMNET_MCP_TRANSPORT: "tcp",
        MEMNET_LLM_VERSION: "0.19.7",
      }),
    (e: unknown) => e instanceof MemNetEnvError && String(e.message).includes("0.19.7"),
  );
  const ok = assertLiveMemNetEnv({
    MEMNET_BACKEND: "tcp",
    MEMNET_MCP_TRANSPORT: "tcp",
    MEMNET_LLM_VERSION: MEMNET_LLM_FLOOR,
  });
  assert.equal(ok.servePort, 18765);
  assert.equal(ok.mcpPort, 18766);
  assert.equal(versionAtLeastFloor("0.19.9", MEMNET_PATH_B_CON_FLOOR), true);
  assert.equal(versionAtLeastFloor("0.19.8", MEMNET_PATH_B_CON_FLOOR), false);
});

test("gold extract on p1-tiny has nested usage; proof not claimed", async () => {
  const gold = await extractFoamGold(join(fixtureRoot, "sysml-models"), "fixture");
  assert.equal(gold.proof_executed, false);
  assert.ok(gold.counts.parts >= 1);
  assert.ok(gold.nested_parts.some((n) => n.qname.endsWith("nestedDetector")));
  assert.ok(gold.unknown.some((u) => u.kind === "submodule"));
});

test("proof harness on fake bind is shape-only and does not claim pass", async () => {
  const dir = await mkdtemp(join(tmpdir(), "sysmledge-proof-"));
  const project = new SysMLEdgeProject(dir, new FakeMemNet());
  await project.importTree(fixtureRoot);
  const report = await runProofHarness({ project, live: false });
  assert.equal(report.proof_executed, false);
  assert.equal(report.proof_pass_claimed, false);
  assert.equal(report.lines.M1?.status, "PASS_SHAPE");
  assert.equal(report.lines.M4?.status, "SKIPPED_NO_LIVE_MEMNET");
  assert.equal(report.lines.M5?.status, "NOT_EXECUTED");
  assert.equal(report.head_to_head.status, "NOT_EXECUTED");
  for (const q of FOAM_QUESTIONS) {
    const row = report.head_to_head.questions.find((x) => x.id === q.id);
    assert.ok(row);
    assert.equal(row?.arm_A_grep.wall_clock_ms, null);
    assert.equal(row?.arm_B_sysmledge.context_tokens, null);
  }
  const h2h = emptyHeadToHead();
  assert.equal(h2h.questions.length, 3);
});

test("smokeBind FAKE: bound stale=false then mutate → STALE → propose refused → reproject live", async () => {
  const dir = await mkdtemp(join(tmpdir(), "sysmledge-smoke-"));
  const project = new SysMLEdgeProject(dir, new FakeMemNet());
  await project.importTree(fixtureRoot);
  const report = await smokeBind(project, { mcp: false });
  assert.equal(report.proof_pass_claimed, false);
  assert.equal(report.scaffold_not_p1, true);
  assert.equal(report.memnet_mode, "FAKE");
  assert.equal(report.cited_memnet_session, "mn_b05a9869");
  assert.equal(report.path_b_con_ingest, "parallel_B_not_waited");
  assert.equal(report.ok, true);
  assert.equal(report.stale["rev.stale"], true);
  assert.equal(report.stale.gql_read_fail_closed, true);
  assert.equal(report.stale.propose_refused, true);
  assert.equal(report.reproject["rev.stale"], false);
  assert.equal(report.reproject.gql_read_live, true);
});

test("p1-tiny nestedDetector still parsed after Foam brace-depth fix", async () => {
  const parsed = await parseSysmlTree(join(fixtureRoot, "sysml-models"));
  assert.ok(parsed.nodes.some((n) => n.qname === "P1Tiny::SensorHub::nestedDetector"));
});
