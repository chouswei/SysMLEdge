# LIVE bind checklist — Pi when TCP reachable

SysMLEdge **bind** on live `memnet serve`. **Not** Path-B CON ingest. **Not** `pin_map` as `project@rev`.

[#23](https://github.com/chouswei/SysMLEdge/pull/23) published M1 **narrow** (CON **124** + nested qname ego on `mn_0d4f6178` @ **0.19.9+TCP**) and **cleared** the LIVE-bind gate. This checklist is the next Edison step.

`proof_pass_claimed: false` until LIVE bind **and** timed H2H **and** cold. H2H scores **narrow 124+nested**, not gold-200.

Cite Path-B **`mn_0d4f6178`** as published M1 meters **only**. Cite Path A **`mn_b05a9869`** AFTER (CON=29, nested in TSK ego via ops) as **engine ops**. Neither session id is `rev.sha`. LIVE bind **opens a new ingest session** ([LIVE-0199-ATTACH.md](LIVE-0199-ATTACH.md)).

## Floor (must)

| Item | Value |
|------|--------|
| Engine on Pi | **memnet-llm ≥0.19.9** + TCP (bounce still proven on **0.19.8**) |
| Path-B CON | **on Pi** — published narrow on `mn_0d4f6178` (MemNet #158). **≠ bind** |
| Serve | `127.0.0.1:18765` (operator on Pi). Cloud VM **`10.0.0.10:18765` often unreachable** |
| MemNet MCP (`pin_map` proof only) | `:18766`, `MEMNET_MCP_TRANSPORT=tcp` |
| SysMLEdge MCP | `:18776/mcp` Bearer |

## Cloud VM blocker

If `npm run live:probe` cannot TCP `127.0.0.1:18765` or `10.0.0.10:18765`, **do not claim LIVE bind**. Cursor **memnet-pi** `session_list` / `pin_map` still ≠ bind. Memnetor/Devicor run the operator script **on the Pi**.

```bash
npm run live:probe
# exit 2 → fill RUNLOG blocker + ask-back; operator continues on Pi
```

## Steps (operator on Pi)

```bash
# Terminal 1 — already running on Pi
memnet serve          # 127.0.0.1:18765

# Terminal 2 (optional; M1 pin_map only — not bind)
export MEMNET_MCP_TRANSPORT=tcp
memnet mcp

# Terminal 3 — this repo
export FOAM_DIR=/tmp/foam-soi          # or omit → fixtures/p1-tiny
export SYSMLEDGE_PROJECT=/tmp/foam-desk
npm run bind:live
# same as: BIND_SMOKE_LIVE=1 npm run bind:smoke after memnet-check
```

MUST NOT set `MEMNET_ATTACH_SESSION=mn_0d4f6178` or `mn_b05a9869`.

Record (operator):

| Field | Fill |
|-------|------|
| Date / host | |
| `live:probe` | reachable / **blocked** (host:port) |
| `memnet-check` version | ≥0.19.9 |
| Desk (Foam SHA or `fixtures/p1-tiny`) | |
| SysMLEdge `rev.sha` after import | 40 hex from `rev_status` — **not** a MemNet session id |
| New MemNet session (`bind.json` `memnetSession`) | `mn_…` **not** `mn_0d4f6178` / `mn_b05a9869` |
| Mutate → STALE `gql_read` / `propose` | pass / fail |
| MCP `reproject` → live | pass / fail |
| `proof_pass_claimed` | **false** |

Template: [RUNLOG-2026-09-12-live-bind.md](RUNLOG-2026-09-12-live-bind.md).

## Ask-back (Memnetor) — if this cloud VM is blocked

1. Confirm `memnet --version` ≥ **0.19.9** on the Pi and `memnet serve` is up on `:18765`.
2. Confirm Foam `sysml-models/` path (`FOAM_DIR`) **or** accept `fixtures/p1-tiny` as the documented desk.
3. Run `npm run bind:live` **on the Pi**. Paste `memnet-check` JSON + `status` (`rev.sha` 40 hex, `rev.stale=false`) + smoke-bind JSON.
4. Confirm the new `memnetSession` is **not** `mn_0d4f6178` / `mn_b05a9869`.
5. Do **not** start H2H or cold operator. Do **not** ingest into the cited Path-B session.

## Refuse

- Treating Path-B / `pin_map` / `mn_0d4f6178` as bind
- Treating Path A AFTER meters (CON=29, nested in TSK ego) as bind
- Claiming [#21](https://github.com/chouswei/SysMLEdge/pull/21) FAKE ego is LIVE bind
- Claiming M1 / P1 / `proof_pass_claimed` from this checklist
- Starting H2H from this checklist (H2H later scores **124+nested**)
- Inventing CON / Neo4j / dual-engine
