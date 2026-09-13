import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { censusSysmlTree } from "../src/sysml/projection-census.js";
import { parseSysmlTreeWithMeta } from "../src/sysml/parse.js";

const fixtureRoot = fileURLToPath(new URL("../fixtures/projection-census", import.meta.url));

test("projection census uses ANTLR on grammatical SysML and regex on silent-drop quotes", async () => {
  const ssot = join(fixtureRoot, "sysml-models");
  const { meta } = await parseSysmlTreeWithMeta(ssot);
  const projected = meta.files.find((f) => f.path.endsWith("Projected.sysml"));
  const bad = meta.files.find((f) => f.path.endsWith("BadQuote.sysml"));
  const omitted = meta.files.find((f) => f.path.endsWith("Omitted.sysml"));
  assert.equal(projected?.engine, "antlr", JSON.stringify(projected));
  assert.equal(projected?.fallbackReason, "none");
  assert.equal(bad?.engine, "regex", "escaped-quote fixture must not silent-drop");
  assert.ok(bad?.fallbackReason === "antlr_fail" || bad?.fallbackReason === "silent_drop", JSON.stringify(bad));
  assert.equal(omitted?.engine, "antlr", JSON.stringify(omitted));
});

test("projection census publishes omitted kinds and does not claim a proof pass", async () => {
  const census = await censusSysmlTree(join(fixtureRoot, "sysml-models"), {
    sourceSha: "fixture",
    repo: "sysmledge/projection-census-fixture",
  });
  assert.equal(census.proof_pass_claimed, false);
  assert.equal(census.proof_executed, false);
  assert.ok(census.engines.antlr >= 1);
  assert.ok(census.engines.regex >= 1);
  const kinds = Object.fromEntries(census.omitted_kinds.map((k) => [k.kind, k]));
  assert.ok((kinds.requirement_def?.antlr_hits ?? 0) >= 1, JSON.stringify(census.omitted_kinds));
  assert.ok((kinds.item_def?.antlr_hits ?? 0) >= 1);
  assert.ok((kinds.action_def?.antlr_hits ?? 0) >= 1);
  assert.ok((kinds.connection_def?.antlr_hits ?? 0) >= 1);
  assert.ok(kinds.requirement_def?.files.some((f) => f.endsWith("Omitted.sysml")));
  assert.ok(census.projected.parts >= 1);
  assert.equal(census.frozen_gold, null);
});
