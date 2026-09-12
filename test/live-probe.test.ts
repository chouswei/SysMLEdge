import assert from "node:assert/strict";
import { test } from "node:test";
import { BIND_SMOKE_THEATER } from "../src/proof/harness.js";
import { LAN_PI_HOST, probeLiveTcp } from "../src/memnet/probe.js";
import { isProtectedMemnetSession, PATH_B_SESSION, PATH_A_OPS_SESSION } from "../src/memnet/sessions.js";

test("LIVE TCP probe: this host cannot invent a bind; 10.0.0.10 is the LAN Pi", async () => {
  const report = await probeLiveTcp();
  assert.equal(report.proof_pass_claimed, false);
  assert.ok(report.probes.some((p) => p.host === LAN_PI_HOST && p.port === 18765));
  assert.ok(report.probes.some((p) => p.host === "127.0.0.1"));
  assert.ok(report.note.includes("pin_map"));
  // Cloud agents typically cannot reach the Pi LAN; refuse live-SSOT pretence either way.
  if (!report.ok) {
    assert.ok(report.blocker?.includes("10.0.0.10"));
  }
});

test("cited Path-A/Path-B sessions are protected from attach-as-bind", () => {
  assert.equal(isProtectedMemnetSession(PATH_B_SESSION), true);
  assert.equal(isProtectedMemnetSession(PATH_A_OPS_SESSION), true);
  assert.equal(isProtectedMemnetSession("mn_new"), false);
  assert.ok(BIND_SMOKE_THEATER.includes("pin_map"));
  assert.ok(BIND_SMOKE_THEATER.includes("#21"));
  assert.ok(BIND_SMOKE_THEATER.includes("124"));
});
