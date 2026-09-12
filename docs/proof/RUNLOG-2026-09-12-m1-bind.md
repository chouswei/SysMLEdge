# RUNLOG — 2026-09-12 — Edison LIVE M1 (fail-fast **then** Path A)

| Gate | Status |
|------|--------|
| **LIVE env** | unlocked (`memnet-llm==0.19.8` + TCP; `mn_b05a9869`) |
| **LIVE M1 BEFORE Path A** | **fail-fast** — CON=0 session-wide / nested absent |
| **LIVE M1 AFTER Path A** | TSK ego CON=29; nested in ego via panel **owns**; **not** durable Path-B ingest |
| **FAKE** bind / STALE | **ok** (SysMLEdge desk) |
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
| Durable Path-B ingest | **still required** — ops mutate ≠ Path-B CON map |
| `proof_pass_claimed` | **false** |
| near_cap | **~4294/5000** |

Parser gold still **200** connections / nested **AUTO**. Path A TSK ego CON=29 is a **slice**, not session-wide gold parity. **B CON map still required.**

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

`npm run m1:smoke` forces fake: import → `rev.stale=false` → mutate → STALE → `propose` refused. That does **not** make LIVE M1 a pass.

## Not this cut

H2H (M5). Claiming M1 pass. Treating Path A ops mutate as Path-B ingest.
