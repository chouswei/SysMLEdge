import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { parseSysmlTree } from "../src/sysml/parse.js";
import { extractFoamGold } from "../src/sysml/gold.js";

const fixtureRoot = fileURLToPath(new URL("../fixtures/p1-tiny", import.meta.url));

test("Foam-shape connections: end port ::>, connection def, connect A to B", async () => {
  const parsed = await parseSysmlTree(join(fixtureRoot, "sysml-models"));
  const q = parsed.nodes.map((n) => n.qname);
  assert.ok(q.includes("FoamShape::SurvivesMarkdownComment"));
  const names = parsed.edges.map((e) => e.qname);
  assert.ok(
    names.some((n) => n.endsWith("::linkBindingToAcquire")),
    `missing linkBindingToAcquire, got ${names.join(", ")}`,
  );
  assert.ok(
    names.some((n) => n.endsWith("::afterEscapedQuote")),
    `backslash-quote must not swallow later connections, got ${names.join(", ")}`,
  );
  assert.ok(!names.some((n) => n.endsWith("::EthernetHostToSwitchPort")), "connection def is not a usage edge");
  assert.ok(names.some((n) => n.endsWith("::powerFeedNamed")));
  assert.ok(parsed.edges.some((e) => e.qname.endsWith("powerFeed")));
});

test("gold extract counts connections_parsed > 0 on fixture", async () => {
  const gold = await extractFoamGold(join(fixtureRoot, "sysml-models"), "fixture");
  assert.ok(gold.counts.connections_parsed >= 3, String(gold.counts.connections_parsed));
  assert.ok(gold.counts.files >= 2);
});
