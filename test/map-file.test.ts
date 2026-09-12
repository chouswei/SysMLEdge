import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  NARROW_OPERATOR_PRT_FIELDS,
  assertSchemaMapFile,
  assertSysmlLocatorSchema,
  defaultSysmlSchemaMapPath,
  sessionOpenArgs,
  usesLeftoverMapFlag,
} from "../src/memnet/schema.js";

test("0.19.9 session open uses SCHEMA --map-file, never leftover --map", () => {
  const map = defaultSysmlSchemaMapPath();
  const args = sessionOpenArgs(map);
  assert.ok(map.endsWith("fixtures/memnet-session.map"));
  assert.deepEqual(args, ["session", "open", "--map-file", map]);
  assert.equal(usesLeftoverMapFlag(args), false);
  const body = readFileSync(map, "utf8");
  assert.match(body, /^SCHEMA PKG /m);
  assert.match(body, /^SCHEMA PRT /m);
  assert.match(body, /^SCHEMA POR /m);
  assert.match(body, /^SCHEMA CON /m);
  assert.doesNotMatch(body, /^PKG qname,path$/m);
  assert.doesNotMatch(body, /^PORT /m);
  assert.doesNotMatch(body, /^CONN /m);
  assert.equal(assertSchemaMapFile(map), map);
});

test("checked-in map keeps qname/path/sysml_kind on PKG/PRT/POR/CON", () => {
  const map = defaultSysmlSchemaMapPath();
  const body = readFileSync(map, "utf8");
  assertSysmlLocatorSchema(body, map);
  for (const kind of ["PKG", "PRT", "POR", "CON"]) {
    const line = body.split(/\n/).find((l) => l.startsWith(`SCHEMA ${kind} `));
    assert.ok(line, `missing SCHEMA ${kind}`);
    assert.match(line!, /\bqname\b/);
    assert.match(line!, /\bpath\b/);
    assert.match(line!, /\bsysml_kind\b/);
  }
  assert.match(body, /SCHEMA PRT ; fields=id name qname path partNumber sysml_kind recycle/);
  assert.doesNotMatch(body, new RegExp(`SCHEMA PRT ; fields=${NARROW_OPERATOR_PRT_FIELDS}`));
});

test("narrow operator SCHEMA without qname is refused (keep-id hydrate)", () => {
  const narrow = [
    "SCHEMA PKG ; fields=id name kind status recycle",
    `SCHEMA PRT ; fields=${NARROW_OPERATOR_PRT_FIELDS}`,
    "SCHEMA POR ; fields=id name kind dir typeRef status recycle",
    "SCHEMA CON ; fields=id name kind ends status recycle",
  ].join("\n");
  assert.throws(() => assertSysmlLocatorSchema(narrow, "operator.patch"), /omits qname|narrow operator/);
});

test("PRT-only overwrite to kind/role/status is refused even if other kinds keep qname", () => {
  const mixed = [
    "SCHEMA PKG ; fields=id name qname path sysml_kind recycle",
    `SCHEMA PRT ; fields=${NARROW_OPERATOR_PRT_FIELDS}`,
    "SCHEMA POR ; fields=id name qname path sysml_kind recycle",
    "SCHEMA CON ; fields=id name qname path sysml_kind kind recycle",
  ].join("\n");
  assert.throws(() => assertSysmlLocatorSchema(mixed, "operator.patch"), /narrow operator/);
});
