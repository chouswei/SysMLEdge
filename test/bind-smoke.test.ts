import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { SysMLEdgeProject } from "../src/bind/project.js";
import { FakeMemNet } from "../src/memnet/fake.js";
import { smokeBind } from "../src/proof/harness.js";

const fixtureRoot = fileURLToPath(new URL("../fixtures/p1-tiny", import.meta.url));

test("FAKE bind smoke via MCP: STALE fail-closed then reproject live", async () => {
  const dir = await mkdtemp(join(tmpdir(), "sysmledge-bind-mcp-"));
  const project = new SysMLEdgeProject(dir, new FakeMemNet());
  await project.importTree(fixtureRoot);
  const report = await smokeBind(project, { mcp: true });
  assert.equal(report.ok, true, report.notes.join(" | "));
  assert.equal(report.proof_pass_claimed, false);
  assert.equal(report.scaffold_not_p1, true);
  assert.ok(report.notes.some((n) => n.includes("pin_map")));
  assert.ok(report.mcp);
  for (const t of ["rev_status", "gql_read", "propose", "reproject"]) {
    assert.ok(report.mcp?.tools.includes(t), `missing ${t}`);
  }
  assert.equal(report.mcp?.rev_status_ok, true);
  assert.equal(report.mcp?.gql_read_stale_refused, true);
  assert.equal(report.mcp?.propose_stale_refused, true);
  assert.equal(report.mcp?.reproject_live, true);
  assert.equal(report.mcp?.gql_read_live, true);
  assert.equal(report.reproject["rev.stale"], false);
});
