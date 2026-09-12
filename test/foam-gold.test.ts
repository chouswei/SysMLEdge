import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { assertGoldShape, type FoamGoldList } from "../src/sysml/gold.js";

const goldPath = fileURLToPath(new URL("../fixtures/foam-gold/gold.json", import.meta.url));

test("frozen Foam gold lists nested backgroundSetIndicator and does not claim pass", async () => {
  const gold = JSON.parse(await readFile(goldPath, "utf8")) as FoamGoldList;
  assert.equal(gold.proof_executed, false);
  assert.equal(gold.source.repo, "chouswei/modelbasedPrj-itri-vedan-foam-detection");
  assert.match(gold.source.sha, /^[0-9a-f]{40}$/);
  assert.ok(gold.counts.parts >= 1, "publish part count");
  assert.ok(gold.counts.ports >= 1, "publish port count");
  assert.ok(gold.counts.nested_parts >= 1);
  const err = assertGoldShape(gold);
  assert.deepEqual(err, []);
  const nested = gold.nested_hand_create.find((n) => n.hint === "backgroundSetIndicator");
  assert.ok(nested?.qnames.some((q) => q.includes("CoreVideoMonitorToolbar")));
  assert.ok(nested?.qnames.some((q) => q.includes("CoreMonitorConfigPanel")));
  assert.ok(gold.unknown.length >= 1, "UNKNOWN nested/connection cases must be explicit");
});
