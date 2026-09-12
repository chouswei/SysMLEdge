import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  defaultSysmlSchemaMapPath,
  sessionOpenArgs,
  usesLeftoverMapFlag,
} from "../src/memnet/schema.js";

test("0.19.9 session open uses SCHEMA --map-file, never leftover --map", () => {
  const map = defaultSysmlSchemaMapPath();
  const args = sessionOpenArgs(map);
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
});
