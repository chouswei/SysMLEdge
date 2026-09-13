import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { parseAntlrFile } from "../src/sysml/parse-antlr.js";
import { parseSysmlTreeWithMeta } from "../src/sysml/parse.js";

const pinPath = fileURLToPath(new URL("../src/sysml/grammar-pin.json", import.meta.url));
const fixtureRoot = fileURLToPath(new URL("../fixtures/p1-tiny", import.meta.url));
const submoduleDir = fileURLToPath(new URL("../vendor/sysml-v2-grammar", import.meta.url));

test("grammar pin is daltskin/sysml-v2-grammar v2026.05.0 submodule", async () => {
  const pin = JSON.parse(await readFile(pinPath, "utf8")) as {
    source: string;
    submodule: string;
    tag: string;
    sha: string;
    grammar_version: string;
    files: string[];
    product_claim: string;
  };
  assert.equal(pin.source, "https://github.com/daltskin/sysml-v2-grammar");
  assert.equal(pin.submodule, "vendor/sysml-v2-grammar");
  assert.equal(pin.tag, "v2026.05.0");
  assert.equal(pin.sha, "7292dc39983a6d263d14f8f6689de0f3b35db5eb");
  assert.equal(pin.grammar_version, "2026.05.0");
  assert.match(pin.product_claim, /Foam-complete/);
  assert.ok(pin.product_claim.includes("Not a P1 proof pass"));
  for (const f of pin.files) {
    const abs = join(submoduleDir, f);
    const body = await readFile(abs);
    assert.ok(body.length > 0, f);
    assert.equal(createHash("sha256").update(body).digest("hex").length, 64);
  }
  const head = execFileSync("git", ["-C", submoduleDir, "rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
  assert.equal(head, pin.sha);
});

test("ANTLR parses P1Tiny.sysml without fallback", async () => {
  const src = await readFile(join(fixtureRoot, "sysml-models/P1Tiny.sysml"), "utf8");
  const parsed = parseAntlrFile(src, "P1Tiny.sysml");
  assert.equal(parsed.ok, true, parsed.errors.join("; "));
  const q = parsed.nodes.map((n) => n.qname);
  assert.ok(q.includes("P1Tiny"));
  assert.ok(q.includes("P1Tiny::SensorHub"));
  assert.ok(q.includes("P1Tiny::SensorHub::nestedDetector"));
  assert.ok(parsed.edges.some((e) => e.qname.endsWith("powerFeed")));
});

test("tree parse uses ANTLR on P1Tiny and does not silent-drop FoamShape", async () => {
  const { tree, meta } = await parseSysmlTreeWithMeta(join(fixtureRoot, "sysml-models"));
  const tiny = meta.files.find((f) => f.path.endsWith("P1Tiny.sysml"));
  assert.equal(tiny?.engine, "antlr", JSON.stringify(tiny));
  const q = tree.nodes.map((n) => n.qname);
  assert.ok(q.includes("P1Tiny::SensorHub::nestedDetector"));
  assert.ok(tree.edges.some((e) => e.qname.endsWith("powerFeed")));
  assert.ok(tree.edges.some((e) => e.qname.endsWith("linkBindingToAcquire")));
  assert.ok(tree.edges.some((e) => e.qname.endsWith("afterEscapedQuote")));
  const foam = meta.files.find((f) => f.path.endsWith("FoamShape.sysml"));
  assert.equal(foam?.engine, "regex", "ungrammatical quote fixture must not silent-drop");
});
