# RUNLOG — 2026-09-12 — parser gold + FAKE bind; LIVE env unlocked on Pi

| Gate | Status |
|------|--------|
| **LIVE env** (Memnetor) | **unlocked**: `memnet-llm==0.19.8` + TCP; session `mn_b05a9869`; **2922** rows (operator); `pin_map` `TSK_model_vfdl2` **non-empty** |
| **LIVE M1 compare** from this cloud VM | **not executed** — `10.0.0.10:18765` / `:18766` / `:22` **timeout**. **No LIVE counts invented.** |
| **FAKE** bind / STALE | **ok** |
| `proof_pass_claimed` | `false` |
| P1 / M1–M5 pass | **not claimed** |

## LIVE env (Memnetor — operator, not this VM)

Do **not** treat this table as SysMLEdge-measured ingest fidelity.

| Item | Memnetor |
|------|----------|
| Engine | `memnet-llm==0.19.8` |
| Transport | TCP-shared |
| Session | `mn_b05a9869` loaded |
| Rows | 2922 (session total; **not** equated to parser parts/ports/CONN) |
| `pin_map` `TSK_model_vfdl2` | non-empty |

Queries Memnetor must run to finish LIVE M1 compare: [LIVE-M1-CHECKLIST.md](LIVE-M1-CHECKLIST.md).

## This cloud VM (2026-09-12)

| Probe | Result |
|-------|--------|
| `10.0.0.10:18765` | timeout |
| `10.0.0.10:18766` | timeout |
| `10.0.0.10:22` | timeout |
| `127.0.0.1:18765` | connection refused |
| `git clone` Foam | blocked (private; agent token 404) |

`npm run m1:smoke` stays **FAKE**. `MEMNET_BACKEND=tcp` is not used from this VM.

## FAKE=ok (SysMLEdge bind)

| Field | Value |
|-------|--------|
| Foam source SHA | `76459224e6afbe74612cca9b37ffe0b3503bda85` |
| Foam fetch | GitHub MCP (clone blocked). Whole `.sysml` under `sysml-models/` that could be fetched: 7 `models/` + `libs/common/**` + `outputs/diagrams/foam-lite-demo.sysml`. Nested `libs/omg` **not** on disk. |
| Bind / STALE | **FAKE** (`npm run m1:smoke` forces fake) |

1. `import` → `rev.sha` 40-hex, `rev.stale=false`
2. Mutate `models/root.sysml` → `rev.stale=true`
3. `propose` refused `code: STALE`

## Parser gold matrix (this PR)

Frozen at `fixtures/foam-gold/gold.json`. `proof_executed: false`. `tree_files` lists every parsed path.

`connections_parsed:0` was a parser bug; current freeze is **200** (7 `models/` + `libs/common` + `outputs/diagrams/foam-lite-demo.sysml`). Nested `backgroundSetIndicator`: **AUTO**.

| Meter | Count |
|-------|------:|
| files | 26 |
| packages | 27 |
| parts | 663 |
| ports | 1400 |
| connections_parsed | 200 |
| nested_parts | 388 |
| unknown | 1 (`libs/omg`) |

## Not this cut

LIVE pin_map vs gold **counts** (checklist only). H2H. P2 UI. Kuzu. Product-ready / P1 pass.
