import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  defaultSysmlSchemaMapPath,
  sessionOpenArgs,
  usesLeftoverMapFlag,
} from "../src/memnet/schema.js";

/** CTO Core lock 2026-09-12: CI-pin map hash / PRT.qname — update only with an intentional fixture change in the same PR. */
const EXPECTED_MAP_SHA256 =
  "c2f16136e6f09f9a6c1ddf0026a15676f731575f1d2a1da6ccc2c464aa727bc3";

const EXPECTED_SCHEMA_PRT =
  "SCHEMA PRT ; fields=id name qname path partNumber sysml_kind recycle";

const QNAME_KINDS = ["PKG", "PRT", "POR", "CON"] as const;

function schemaFieldTokens(body: string, kind: string): string[] {
  const prefix = `SCHEMA ${kind} ; fields=`;
  const line = body.split(/\r?\n/).find((row) => row.startsWith(prefix));
  assert.ok(line, `SCHEMA ${kind} line missing`);
  return line.slice(prefix.length).trim().split(/\s+/).filter(Boolean);
}

test("0.19.9 session open uses SCHEMA --map-file, never leftover --map", () => {
  const map = defaultSysmlSchemaMapPath();
  const args = sessionOpenArgs(map);
  assert.ok(map.endsWith("fixtures/memnet-session.map"));
  assert.deepEqual(args, ["session", "open", "--map-file", map]);
  assert.equal(usesLeftoverMapFlag(args), false);
  const bytes = readFileSync(map);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  assert.equal(sha256, EXPECTED_MAP_SHA256);
  const body = bytes.toString("utf8");
  assert.match(body, /^SCHEMA PKG /m);
  assert.match(body, /^SCHEMA PRT /m);
  assert.match(body, /^SCHEMA POR /m);
  assert.match(body, /^SCHEMA CON /m);
  assert.doesNotMatch(body, /^PKG qname,path$/m);
  assert.doesNotMatch(body, /^PORT /m);
  assert.doesNotMatch(body, /^CONN /m);
  assert.ok(
    body.split(/\r?\n/).includes(EXPECTED_SCHEMA_PRT),
    "SCHEMA PRT must keep qname (operator-narrow fields=id name kind role status recycle is a CI fail)",
  );
  for (const kind of QNAME_KINDS) {
    const fields = schemaFieldTokens(body, kind);
    assert.ok(
      fields.includes("qname"),
      `SCHEMA ${kind} fields= must include qname as a field token (not a comment substring); got ${fields.join(" ")}`,
    );
    assert.ok(fields.includes("path"), `SCHEMA ${kind} fields= must include path`);
    assert.ok(fields.includes("sysml_kind"), `SCHEMA ${kind} fields= must include sysml_kind`);
  }
});
