# LIVE M1 checklist — **fail-fast** (Memnetor 2026-09-12)

`proof_pass_claimed: false`. Edison: **FAIL** on silent drop + nested absent. No H2H.

Parser gold: `fixtures/foam-gold/gold.json` @ `76459224e6afbe74612cca9b37ffe0b3503bda85`.

## Filled (Memnetor)

Session `mn_b05a9869`. Engine 0.19.8 + TCP.

| # | Cue | Result |
|---|------|--------|
| P0 | empty-cue outline | session loaded (2922 rows prior) |
| P1 | `cue=TSK_model_vfdl2` `depth=2` `max_rows=50` | **ego = TSK only** (non-empty TSK, no walk to tips) |
| P2–P5 | `backgroundSetIndicator` / `linkFoamDetectionToVideoDisplay` | nested **ABSENT**; **CON=0** session-wide |
| `read_list` | kinds | **PRT 1390**, **POR 385**, **CON 0**, **orphans 2008** |

## Compare

| Parser gold | LIVE |
|-------------|------|
| connections_parsed **200** | CON **0** — silent drop |
| `backgroundSetIndicator` AUTO (2 qnames) | **ABSENT** |
| parts 663 | PRT 1390 |
| ports 1400 | POR 385 |
| — | orphans 2008 |

ShapeWalk from TSK does not reach keyword-findable tips. Remaining operator boxes (SysMLEdge `gql_*` on Pi) do not override this fail-fast.

## Out

H2H, bounce-as-pass, P1 claim.
