# RUNLOG — 2026-09-12 — Edison LIVE M1 (fail-fast **then** Path A) + FAKE ego

**CEO Core 2026-09-12:** [#21](https://github.com/chouswei/SysMLEdge/pull/21) FAKE ego ≠ M1 pass. Gate = Memnetor LIVE re-measure vs gold.

| Gate | Status |
|------|--------|
| **LIVE env** | unlocked (`memnet-llm==0.19.8` + TCP; `mn_b05a9869`) |
| **LIVE M1 BEFORE Path A** | **fail-fast** — CON=0 session-wide / nested absent |
| **LIVE M1 AFTER Path A** | TSK ego CON=29; nested in ego via ops; **not SysMLEdge bind** |
| **LIVE Path-B re-measure** | `mn_0d4f6178` @ **0.19.9+TCP** (Memnetor, SysML qname cue, **no** owns mutate). CON find \|Q\|=**124**. Nested qname ego **YES**. **≠ gold 200.** Not SysMLEdge LIVE re-ingest. |
| **FAKE** bind / STALE | **ok** (SysMLEdge desk) |
| **FAKE M1 ego** | **invent progress** — SysML-grounded contains/owns/ends; fixture + gold reconstruction. **Does not change MemNet rows.** **≠ M1 pass.** |
| H2H | **not run** |
| `proof_pass_claimed` | **false** |
| P1 / M1–M5 pass | **not claimed** |
| housekeep (Path-B session) | **1673/5000** edges **923** orphans **750** (`mn_0d4f6178`) |

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
| Durable Path-B ingest | **0.19.9+TCP** measured on Memnetor (`mn_0d4f6178`); see Path-B LIVE below. Ops mutate ≠ bind |
| `proof_pass_claimed` | **false** |
| near_cap (this session) | **~4294/5000** |

Parser gold still **200** connections / nested **AUTO**. Path A TSK ego CON=29 is a **slice**, not session-wide gold parity, and **not SysMLEdge bind**.

## LIVE Path-B re-measure (Memnetor, `mn_0d4f6178`)

**0.19.9+TCP.** SysML **qname** cue. **No** owns mutate. Path-B ingest **alone**. Not a pass.

| Meter | Gold (`gold.json`) | LIVE Path-B |
|-------|-------------------:|--------------|
| Connections | **200** `connections_parsed` | CON find \|Q\|=**124** (ingest alone; **def+usage split**) |
| Nested `backgroundSetIndicator` | **AUTO** (2 qnames) | **YES** — both gold qnames close via `pin_map` **qname** + `contains` to owner; Truncation=**false** on tip ego |
| find keyword `backgroundSetIndicator` | n/a | \|Q\|=**2** |
| TSK-only ego | n/a | still **wrong cue** |
| housekeep | n/a | **1673/5000** edges **923** orphans **750** |
| `proof_pass_claimed` | **false** | **false** |

**Caveat:** this Path-B session is **not** SysMLEdge LIVE re-ingest. [#21](https://github.com/chouswei/SysMLEdge/pull/21) FAKE ego does **not** change MemNet rows.

**vs gold:** `connections_parsed` **200** vs LIVE CON **124** (def+usage split). Nested AUTO vs LIVE qname ego **YES**. M1 still **FAIL** on CON parity.

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

## FAKE M1 ego — invent progress (**≠ M1 pass**)

SysMLEdge reproject (FAKE) emits **SysML-grounded** `contains` (nested part usage), `owns` (part→port), `ends` (connection→endpoints) plus connection usages. `gql_context` / `gql_impact` BFS that graph. **MUST NOT** invent `TSK_*` / `USR_*` owns. **MUST NOT** treat FAKE neighbourhood counts as M1 pass. Gate = Memnetor LIVE re-measure vs gold (Path-B section above).

| Meter | Parser gold | FAKE projection | LIVE Path-B (`mn_0d4f6178`) |
|-------|------------:|----------------:|------------------------------|
| parts | **663** | **663** (gold reconstruct) | not re-ingested by SysMLEdge |
| ports | **1400** freeze / **1392** unique list | **1392** unique (MUST NOT invent 8) | not re-ingested by SysMLEdge |
| connections | **200** | **200** | CON find \|Q\|=**124** (def+usage split) |
| nested `backgroundSetIndicator` | **AUTO** (2 qnames) | in owner ego via **contains** | **YES** (qname + contains); TSK-only ego still wrong cue |
| TSK owns invented | n/a | **0** | Path A ops — do not copy; Path-B: **no** owns mutate |
| `proof_pass_claimed` | false | **false** | **false** |

Proof commands: `npm test` (`test/ego-neighbourhood.test.ts`) on `fixtures/p1-tiny` + `fixtures/foam-gold/gold.json`. Foam tree on disk is not required for the reconstruct arm.

LIVE attach without tip-as-bind: [LIVE-0199-ATTACH.md](LIVE-0199-ATTACH.md). Path-B CON ingest on **≥0.19.9+TCP** (`mn_0d4f6178`). Ops mutate on `mn_b05a9869` remains **not** the product path.

## Not this cut

H2H (M5). Claiming M1 pass / LIVE bind. Treating [#21](https://github.com/chouswei/SysMLEdge/pull/21) FAKE ego as M1 pass. Treating Path A ops meters (CON=29, nested in TSK ego) as SysMLEdge bind. Treating Path-B CON **124** as gold **200**. Treating this Path-B session as SysMLEdge LIVE re-ingest. Neo4j / dual-engine.
