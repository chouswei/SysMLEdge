# RUNLOG — 2026-09-12 — Edison LIVE M1 (fail-fast **then** Path A) + FAKE ego

| Gate | Status |
|------|--------|
| **LIVE env** | unlocked (`memnet-llm==0.19.8` + TCP; `mn_b05a9869`) |
| **LIVE M1 BEFORE Path A** | **fail-fast** — CON=0 session-wide / nested absent |
| **LIVE M1 AFTER Path A** | TSK ego CON=29; nested in ego via ops; **not SysMLEdge bind**; Path-B 0.19.9 pending Pi |
| **FAKE** bind / STALE | **ok** (SysMLEdge desk) |
| **FAKE M1 ego** | **invent progress** — SysML-grounded contains/owns/ends; fixture + gold reconstruction. **Not LIVE meters.** |
| H2H | **not run** |
| `proof_pass_claimed` | **false** |
| P1 / M1–M5 pass | **not claimed** |
| near_cap | **~4294/5000** (Memnetor) |

## BEFORE — Edison fail-fast (Memnetor LIVE, `mn_b05a9869`)

Kill smells: silent drop of graph edges; nested ingest without the nested row.

| Meter | SysML parser gold (`gold.json`) | LIVE **before** Path A |
|-------|--------------------------------:|-------------------------|
| Session rows | n/a | 2922 (operator, prior) |
| Connections | **200** `connections_parsed` | **CON=0** session-wide |
| Nested `backgroundSetIndicator` | **AUTO** (2 qnames: toolbar + config panel) | **ABSENT** |
| Parts | 663 | **PRT 1390** (`read_list`) |
| Ports | 1400 | **POR 385** (`read_list`) |
| `pin_map` `TSK_model_vfdl2` | n/a | non-empty but **ego = TSK only** |
| Orphans | n/a | **2008** |

**Verdict then:** LIVE M1 **FAIL**. Env-unlock / non-empty TSK pin ≠ gold fidelity. ShapeWalk from TSK did not reach keyword-findable tips.

## AFTER — Path A (Memnetor, same day)

**owns + CON mutate** on `mn_b05a9869`. Operator meters only. Not a pass.

| Meter | After Path A (TSK ego) |
|-------|------------------------|
| CON | **29** |
| PRT | **≈21** |
| POR | **≥3** |
| Truncation | **false** |
| `backgroundSetIndicator` | **in TSK ego** via panel **owns** (`contains` / `HAS_PART`) |
| Durable Path-B ingest | **0.19.9 shipped** (MemNet **#158**); **pending Pi roll**. Ops mutate ≠ bind |
| `proof_pass_claimed` | **false** |
| near_cap | **~4294/5000** |

Parser gold still **200** connections / nested **AUTO**. Path A TSK ego CON=29 is a **slice**, not session-wide gold parity, and **not SysMLEdge bind**.

## Parser gold matrix (this PR)

Frozen: `fixtures/foam-gold/gold.json` @ Foam `76459224e6afbe74612cca9b37ffe0b3503bda85`. `proof_executed: false`. `tree_files`: 7 `models/` (including `connections.sysml` + `root.sysml`) + `libs/common/**` + `outputs/diagrams/foam-lite-demo.sysml`. `libs/omg` UNKNOWN.

| Meter | Count |
|-------|------:|
| files | 26 |
| packages | 27 |
| parts | 663 |
| ports | 1400 |
| connections_parsed | 200 |
| nested_parts | 388 |
| unknown | 1 (`libs/omg`) |

Cloud VM cannot reach `10.0.0.10` (timeout). LIVE numbers are **Memnetor**.

## FAKE=ok (SysMLEdge bind only)

`npm run bind:smoke` (FAKE): import → `rev.stale=false` → mutate → STALE fail-closed → `propose` refused → reproject live. Path A CON=29 / nested-in-ego is **not** that bind. See [RUNLOG-2026-09-12-rev-bind.md](RUNLOG-2026-09-12-rev-bind.md). `proof_pass_claimed: false`.

## FAKE M1 ego — invent progress (published narrow + counts)

SysMLEdge reproject (FAKE) now emits **SysML-grounded** `contains` (nested part usage), `owns` (part→port), `ends` (connection→endpoints) plus connection usages. `gql_context` / `gql_impact` BFS that graph. **MUST NOT** invent `TSK_*` / `USR_*` owns.

| Meter | Parser gold | FAKE projection (this cut) | LIVE |
|-------|------------:|----------------------------:|------|
| parts | **663** | **663** (gold reconstruct) | FAIL / gated |
| ports | **1400** freeze / **1392** unique list | **1392** unique (MUST NOT invent 8) | FAIL / gated |
| connections | **200** | **200** | CON=0 then Path A ego 29 ≠ gold |
| nested `backgroundSetIndicator` | **AUTO** (2 qnames) | in owner ego via **contains** | Path A via TSK owns ≠ product |
| TSK owns invented | n/a | **0** | Path A ops — do not copy |
| `proof_pass_claimed` | false | **false** | **false** |

Proof commands: `npm test` (`test/ego-neighbourhood.test.ts`) on `fixtures/p1-tiny` + `fixtures/foam-gold/gold.json`. Foam tree on disk is not required for the reconstruct arm.

LIVE attach without tip-as-bind: [LIVE-0199-ATTACH.md](LIVE-0199-ATTACH.md). Path-B CON ingest on **≥0.19.9+TCP** (`mn_0d4f6178` durable CON). Ops mutate on `mn_b05a9869` remains **not** the product path.

## Not this cut

H2H (M5). Claiming M1 pass / LIVE bind. Treating Path A ops meters (CON=29, nested in TSK ego) as SysMLEdge bind. Claiming Path-B CON on Pi before **0.19.9** is rolled. Neo4j / dual-engine.
