# LIVE attach to MemNet 0.19.9 TCP (measure plan)

**LIVE bind unlocked** after [#23](https://github.com/chouswei/SysMLEdge/pull/23) Path-B narrow publish. This file is the **ingest attach** plan: new session, SysML `qname=` cue. `proof_pass_claimed: false` until bind + H2H + cold.

Tip Path-B / `pin_map` ≠ `project@rev`. Path A ops mutate on `mn_b05a9869` ≠ this path. [#21](https://github.com/chouswei/SysMLEdge/pull/21) FAKE ego ≠ LIVE bind.

Durable Path-B CON from ingest is proven on MemNet **0.19.9** (`mn_0d4f6178`). Bounce remains **0.19.8**. SysMLEdge owns `rev.sha` / STALE / reproject in `.sysmledge/bind.json`. MemNet stays a **bounded pin_map** over the projection.

## What attaches

```text
SysML zip / sysml-models/     SSOT
        |  human Save / import (git SHA)
        v
SysMLEdge reproject  (one-way; GQL never invents SysML back)
        |  parse + ground contains/owns/ends (FAKE always)
        |  LIVE: memnet ingest sysml --path <ssot> --session <sid>
        v
MemNet session (TCP :18765)  Path-B ingest ≥0.19.9
        |
        v
pin_map locator qname=<SysML qname>   bounded neighbourhood
SysMLEdge MCP gql_context / gql_impact wraps that + rev.sha
```

| Must | Must not |
|------|----------|
| `ingest sysml` on the **current SSOT path** into a **new** session | `mutate` owns onto `TSK_*` / `USR_*` |
| Cue `qname=FoamDetectionLiteVer2::…` (SysML) | Cue `TSK_model_*` as ego / bind |
| Record SysMLEdge `rev.sha` (40 hex git) **and** MemNet `mn_…` separately | Treat session id as `rev.sha` |
| Compare CON / nested / ego to [foam-gold](../../fixtures/foam-gold/gold.json) | Claim gold because `pin_map` is non-empty |
| Engine `memnet-llm>=0.19.9` + `MEMNET_MCP_TRANSPORT=tcp` | Pin below 0.19.8; claim Path-B CON on 0.19.8 |

## Operator sequence (Pi after 0.19.9; LIVE bind)

Cloud VM often **cannot** TCP `10.0.0.10:18765`. Then Memnetor runs this **on the Pi**. MUST NOT ingest into `mn_0d4f6178` / `mn_b05a9869`.

```bash
export MEMNET_BACKEND=tcp
export MEMNET_MCP_TRANSPORT=tcp
export MEMNET_SERVE_HOST=127.0.0.1
export MEMNET_SERVE_PORT=18765
export MEMNET_MCP_PORT=18766
export MEMNET_LLM_VERSION=0.19.9
export FOAM_DIR=/tmp/foam-soi
export SYSMLEDGE_PROJECT=/tmp/foam-desk

npm run bind:live
# or: memnet serve; npx tsx src/cli.ts memnet-check
# npx tsx src/cli.ts import-foam "$FOAM_DIR" --project "$SYSMLEDGE_PROJECT"
# npx tsx src/cli.ts status --project "$SYSMLEDGE_PROJECT"
# BIND_SMOKE_LIVE=1 npm run bind:smoke
```

Then measure (fill [LIVE-M1-CHECKLIST.md](LIVE-M1-CHECKLIST.md)):

1. `rev_status`: 40-hex `rev.sha`, `rev.stale=false`. Session id is **not** this field.
2. `read_list` / ingest meters vs gold: parts **663**, ports **1400**, `connections_parsed` **200**, nested `backgroundSetIndicator` **AUTO** (two qnames).
3. `pin_map` / `gql_context` on `FoamDetectionLiteVer2::CoreVideoMonitorToolbar::backgroundSetIndicator` — owner + contains in ego. Truncation recorded. **TSK-only ego = FAIL.**
4. Same for config-panel nested usage.
5. `gql_impact` on `…::foamDetection` — neighbourhood/usage only until closure is measured.

Until LIVE `rev.sha` is recorded from **SysMLEdge** `rev_status` on that new session, LIVE bind is **operator-ready, not executed from a blocked cloud VM**. FAKE neighbourhood counts in [RUNLOG-2026-09-12-m1-bind.md](RUNLOG-2026-09-12-m1-bind.md) are **not** LIVE bind. Attempt log: [RUNLOG-2026-09-12-live-bind.md](RUNLOG-2026-09-12-live-bind.md).

## Kill theater

- Tip Path-B sold as bind
- Path A CON=29 / nested-in-TSK-ego as SysMLEdge bind
- Claiming M1 / P1 pass from FAKE tests or from Path-B `pin_map`
- H2H before LIVE `rev` bind (H2H scores **124 + nested ego**, not gold-200)
- Neo4j / dual-engine because CON=0 was a projection/ego gap
- Attaching bind to `mn_0d4f6178` / `mn_b05a9869`
