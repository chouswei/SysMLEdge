# RUNLOG — 2026-09-12 — Edison LIVE M1 (fail-fast **then** Path A) + published Path-B **narrow+counts**

**Cite:** Core GO 2026-09-12 + advisors Jon / Edison / Steve / Elon + CEO: prefer **narrow+counts**. MUST NOT invent CON to chase gold **200**. [#21](https://github.com/chouswei/SysMLEdge/pull/21) FAKE ego still ≠ pass; this publish is the **LIVE** narrow.

| Gate | Status |
|------|--------|
| **LIVE env** | unlocked (`memnet-llm==0.19.8` + TCP; `mn_b05a9869`) |
| **LIVE M1 BEFORE Path A** | **fail-fast** — CON=0 session-wide / nested absent |
| **LIVE M1 AFTER Path A** | TSK ego CON=29; nested in ego via ops; **not SysMLEdge bind** |
| **Published M1 narrow (Path-B LIVE)** | `mn_0d4f6178` @ **memnet-llm==0.19.9+TCP**. CON find \|Q\|=**124** (**29** `connection_def` + **95** `connectionUsage`) — ingest alone, **no** owns mutate. Nested both gold `backgroundSetIndicator` qnames via SysML `qname=` `pin_map` + `contains` (Truncation=false on tip ego). TSK-only ego = wrong cue (not claimed). Parser gold **200** = **reference only**, **not** the M1 fail bar. Not SysMLEdge LIVE re-ingest. |
| **M1 FAIL LIVE-bind gate** | **cleared** by this publish. Next Edison step = **LIVE bind**. |
| **FAKE** bind / STALE | **ok** (SysMLEdge desk) |
| **FAKE M1 ego** | **invent progress** — SysML-grounded contains/owns/ends; fixture + gold reconstruction. **Does not change MemNet rows.** **≠ pass.** |
| H2H | Plumbing on `mn_be03c1a9` — [RUNLOG-2026-09-12-h2h-plumbing.md](RUNLOG-2026-09-12-h2h-plumbing.md). Foam **tip** Track A Devicor: context **3/3** · no_drop **3/3** · `wall_pass` **0/3** (A **307.745ms/23604B** · B **1286.676ms/19042B**); **≠ product / ≠ bind**. [RUNLOG-2026-09-12-h2h-foam-tip.md](RUNLOG-2026-09-12-h2h-foam-tip.md). Track B Foam bind **held**. |
| `proof_pass_claimed` | **false** (full P1 until Foam bind H2H + cold unless desk re-locked to tiny) |
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

## LIVE Path-B narrow (Memnetor, `mn_0d4f6178`) — **published**

**memnet-llm==0.19.9+TCP.** SysML **`qname=`** cue. **No** owns mutate. Path-B ingest **alone**. This is the M1 bar for this cut (Core GO 2026-09-12). Not full P1.

| Meter | Gold (`gold.json`) — **reference** | LIVE Path-B **narrow** |
|-------|--------------------------------:|------------------------|
| Connections | **200** `connections_parsed` (parser; **not** the fail bar) | CON find \|Q\|=**124** (**29** `connection_def` + **95** `connectionUsage`) |
| Nested `backgroundSetIndicator` | **AUTO** (2 qnames: toolbar + config panel) | **YES** — both gold qnames close via `pin_map` **`qname=`** + `contains` to owner; Truncation=**false** on tip ego |
| find keyword `backgroundSetIndicator` | n/a | \|Q\|=**2** |
| TSK-only ego | n/a | still **wrong cue** (not claimed) |
| housekeep | n/a | **1673/5000** edges **923** orphans **750** |
| `proof_pass_claimed` | **false** | **false** until bind + H2H + cold |

**Caveat:** this Path-B session is **not** SysMLEdge LIVE re-ingest. [#21](https://github.com/chouswei/SysMLEdge/pull/21) FAKE ego does **not** change MemNet rows.

**vs gold:** parser `connections_parsed` **200** remains **reference**. LIVE CON **124** (29+95) is the **published narrow**. MUST NOT invent CON to chase 200. Nested AUTO vs LIVE qname ego **YES**. M1 FAIL **LIVE-bind gate cleared**.

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

`npm run bind:smoke` (FAKE): import → `rev.stale=false` → mutate → STALE fail-closed → `propose` refused → reproject live. Path A CON=29 / nested-in-ego is **not** that bind. See [RUNLOG-2026-09-12-rev-bind.md](RUNLOG-2026-09-12-rev-bind.md). LIVE operator: `npm run bind:live` — [RUNLOG-2026-09-12-live-bind.md](RUNLOG-2026-09-12-live-bind.md). `proof_pass_claimed: false`.

## FAKE M1 ego — invent progress (**≠ M1 pass**)

SysMLEdge reproject (FAKE) emits **SysML-grounded** `contains` (nested part usage), `owns` (part→port), `ends` (connection→endpoints) plus connection usages. `gql_context` / `gql_impact` BFS that graph. **MUST NOT** invent `TSK_*` / `USR_*` owns. **MUST NOT** treat FAKE neighbourhood counts as the LIVE narrow. The published bar is Path-B LIVE above.

| Meter | Parser gold | FAKE projection | LIVE Path-B (`mn_0d4f6178`) |
|-------|------------:|----------------:|------------------------------|
| parts | **663** | **663** (gold reconstruct) | not re-ingested by SysMLEdge |
| ports | **1400** freeze / **1392** unique list | **1392** unique (MUST NOT invent 8) | not re-ingested by SysMLEdge |
| connections | **200** (reference) | **200** (FAKE reconstruct; ≠ LIVE) | CON find \|Q\|=**124** (**29** def + **95** usage) |
| nested `backgroundSetIndicator` | **AUTO** (2 qnames) | in owner ego via **contains** | **YES** (qname + contains); TSK-only ego still wrong cue |
| TSK owns invented | n/a | **0** | Path A ops — do not copy; Path-B: **no** owns mutate |
| `proof_pass_claimed` | false | **false** | **false** |

Proof commands: `npm test` (`test/ego-neighbourhood.test.ts`) on `fixtures/p1-tiny` + `fixtures/foam-gold/gold.json`. Foam tree on disk is not required for the reconstruct arm.

LIVE attach without tip-as-bind: [LIVE-0199-ATTACH.md](LIVE-0199-ATTACH.md). Path-B CON ingest on **≥0.19.9+TCP** (`mn_0d4f6178`). Ops mutate on `mn_b05a9869` remains **not** the product path.

## Not this cut

Claiming full P1 / `proof_pass_claimed`. Treating tip Track A H2H as product M5 (`wall_pass` **0/3**; context **3/3** ≠ product). Selling p1-tiny plumbing H2H as Foam beat-grep. Treating [#21](https://github.com/chouswei/SysMLEdge/pull/21) FAKE ego as pass. Treating Path A ops meters (CON=29, nested in TSK ego) as SysMLEdge bind. Inventing CON to chase gold **200**. Treating Path-B CON **124** as gold **200**. Treating this Path-B session as SysMLEdge LIVE re-ingest. Neo4j / dual-engine. Foam bind invent (Track B **held**).
