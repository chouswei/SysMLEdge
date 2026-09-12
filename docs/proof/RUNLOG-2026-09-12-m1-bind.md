# RUNLOG — 2026-09-12 — Edison LIVE M1 **fail-fast**

| Gate | Status |
|------|--------|
| **LIVE env** | unlocked (`memnet-llm==0.19.8` + TCP; `mn_b05a9869`) |
| **LIVE M1** | **fail-fast** — silent drop (CON=0) / nested absent |
| **FAKE** bind / STALE | **ok** (SysMLEdge desk; not live ingest) |
| H2H | **not run** |
| `proof_pass_claimed` | `false` |
| P1 / M1–M5 pass | **not claimed** |

## Edison fail-fast (Memnetor LIVE, `mn_b05a9869`)

Kill smells from [P1-acceptance M1](../P1-acceptance.md): silent drop (`connections_parsed:0` / omitted graph edges); nested ingest without the nested row.

| Meter | SysML parser gold (`gold.json`) | LIVE MemNet (`mn_b05a9869`) |
|-------|--------------------------------:|-----------------------------|
| Session rows | n/a | 2922 (operator, prior) |
| Connections | **200** `connections_parsed` | **CON=0** session-wide |
| Nested `backgroundSetIndicator` | **AUTO** (2 qnames: toolbar + config panel) | **ABSENT** |
| Parts | 663 | **PRT 1390** (`read_list`) |
| Ports | 1400 | **POR 385** (`read_list`) |
| `pin_map` `TSK_model_vfdl2` | n/a | non-empty but **ego = TSK only** |
| Orphans | n/a | **2008** |

**Verdict:** LIVE M1 **FAIL**. SysML-side gold still has 200 connection usages and nested `backgroundSetIndicator`. The live session has **no CON edges** and **no** that nested tip. Do not treat env-unlock or a non-empty TSK pin as gold fidelity.

### Orphan / tip (optional)

ShapeWalk from `TSK_model_vfdl2` stays on the TSK ego (TSK only). It does **not** reach keyword-findable tips (`backgroundSetIndicator`, named `connection` usages). **2008 orphans** matches a graph where ingest left parts/ports unhooked from the mission TSK. Fix is MemNet ingest / CREATE / walk — not H2H, not a parser recount.

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

Cloud VM still cannot reach `10.0.0.10` (timeout). LIVE numbers above are **Memnetor**, not invented here.

## FAKE=ok (SysMLEdge bind only)

`npm run m1:smoke` forces fake: import → `rev.stale=false` → mutate → STALE → `propose` refused. That does **not** clear LIVE M1 fail-fast.

## Not this cut

H2H (M5). P2 UI. Kuzu. Product-ready. Claiming M1 pass while CON=0 / nested absent.
