# LIVE attach to MemNet 0.19.9 TCP (measure plan)

**Not a LIVE bind claim.** `proof_pass_claimed: false`. Tip Path-B / `pin_map` ≠ `project@rev`. Path A ops mutate on `mn_b05a9869` ≠ this path.

Durable Path-B CON from ingest is proven on MemNet **0.19.9** (`mn_0d4f6178`). Bounce remains **0.19.8**. SysMLEdge owns `rev.sha` / STALE / reproject in `.sysmledge/bind.json`. MemNet stays a **bounded pin_map** over the projection.

## What attaches

```text
SysML zip / sysml-models/     SysML mirror (invent SSOT before upload)
        |  human Save / import (git SHA)
        v
SysMLEdge reproject
        |  session open --map-file fixtures/memnet-session.map  (0.19.9 SCHEMA; leftover --map PKG qname,path rejected)
        |  parse + ground contains/owns/ends (FAKE always)
        |  LIVE: memnet ingest sysml --path <mirror> --session <sid>
        v
MemNet session (TCP :18765)  Path-B ingest ≥0.19.9  (SaaS working SSOT after upload = graph)
        |
        v
pin_map locator qname=<SysML qname>   bounded neighbourhood
SysMLEdge MCP gql_context / gql_impact wraps that + rev.sha
```

| Must | Must not |
|------|----------|
| `ingest sysml` on the **current SSOT path** into a **new** session (lock **(f)**) | `mutate` owns onto `TSK_*` / `USR_*`; same-sid replace-ingest **(r)** |
| Cue `qname=FoamDetectionLiteVer2::…` (SysML) | Cue `TSK_model_*` as ego / bind |
| Record SysMLEdge `rev.sha` (40 hex git) **and** MemNet `mn_…` separately | Treat session id as `rev.sha` |
| Compare CON / nested / ego to [foam-gold](../../fixtures/foam-gold/gold.json) | Claim gold because `pin_map` is non-empty |
| Engine `memnet-llm>=0.19.9` + `MEMNET_MCP_TRANSPORT=tcp` | Pin below 0.19.8; claim Path-B CON on 0.19.8 |

## Operator sequence (Pi after 0.19.9; LIVE bind)

Cloud VM often **cannot** TCP `10.0.0.10:18765`. Then Memnetor/Devicor run this **on the Pi**. MUST NOT ingest into `mn_0d4f6178` / `mn_b05a9869`. leftover `--map` is **not** the wire.

```bash
export MEMNET_MAP_FILE="$(pwd)/fixtures/memnet-session.map"
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

Until LIVE `rev.sha` is recorded from **SysMLEdge** `rev_status` on a **new** session, do not treat Path-B `pin_map` as bind. **(f)** clean (Memnetor): `mn_be03c1a9` @ `f6768b1108b20c15212f0895f41fb7a27b6a408d`. Dirty `mn_27ce8714` = honesty archive only (housekeep **56→116**). `proof_pass_claimed: false`. **Not Foam M1.** **Not CON=124.** MUST NOT sell continuous same-session **(g)** until **(r)**.

## Kill theater

- Tip Path-B sold as bind
- Path A CON=29 / nested-in-TSK-ego as SysMLEdge bind
- Claiming M1 / P1 pass from FAKE tests or from Path-B `pin_map`
- H2H before timed Foam **bind** run, or treating p1-tiny / `mn_be03c1a9` H2H as wedge pass (plumbing only; score Foam `mn_0d4f6178` CON **124** + nested, not gold-200). Tip Track A meters: [RUNLOG-2026-09-12-h2h-foam-tip.md](RUNLOG-2026-09-12-h2h-foam-tip.md) — **≠ bind**. Cut 1 Memnetor exact: [RUNLOG-2026-09-12-cut1-tip-wall.md](RUNLOG-2026-09-12-cut1-tip-wall.md)
- Neo4j / dual-engine because CON=0 was a projection/ego gap
- Attaching bind to `mn_0d4f6178` / `mn_b05a9869`
- leftover `--map` TAG wire; `one_way: true` as product truth
