# RUNLOG — 2026-09-12 — M1 meters + bind smoke

**Must not read as M1–M5 pass.** Live memnet-llm 0.19.8 + TCP ingest was not the bind backend.

| Field | Value |
|-------|--------|
| Date (UTC) | 2026-09-12 |
| Foam source | `chouswei/modelbasedPrj-itri-vedan-foam-detection` @ `76459224e6afbe74612cca9b37ffe0b3503bda85` |
| Foam fetch | **LIVE source via GitHub MCP** (agent `git clone` 404 on private repo). Tree assembled under `/tmp/foam-soi/sysml-models/` (models/ 7 files + `libs/common/**/*.sysml`). Nested `libs/omg` gitlink **not** on disk. |
| Bind / STALE smoke | **FAKE** (`MEMNET_BACKEND=fake`). `memnet_mode=FAKE`. |
| Command | `FOAM_DIR=/tmp/foam-soi SYSMLEDGE_PROJECT=/tmp/foam-desk npm run m1:smoke` |
| `proof_pass_claimed` | `false` |

## Gold counts (parser, not ingest pass)

Frozen at `fixtures/foam-gold/gold.json`. `proof_executed: false`.

| Meter | Count |
|-------|------:|
| files | 25 |
| packages | 26 |
| parts | 647 |
| ports | 1400 |
| connections_parsed | 186 |
| nested_parts | 380 |
| unknown | 1 (`libs/omg` KerML gitlink) |

`connections_parsed:0` was a parser bug: quote pairing after `doc` strip swallowed later `connection` usages in `deploy.sysml`. Fix: same-line strings only; parse `end port … ::>` usages; do not emit `connection def` as usage edges.

Nested `backgroundSetIndicator`: **AUTO** (toolbar + config panel). Parser + FakeMemNet copy nested usages with **no hand CREATE**. Live MemNet CREATE / ingest fidelity: **UNPROVEN**.

## Bind smoke (FAKE)

1. `import` Foam tree → `rev.sha` 40-hex, `rev.stale=false`.
2. Mutate `models/root.sysml` → `rev.stale=true`.
3. `propose` refused with `code: STALE`.

Desk SHA on this run: `ccde8cb6b562778502a2fa42b8c41f1a733755ab` (content git commit of `/tmp/foam-desk`, not Foam upstream SHA).

## Gaps still blocking a claimed M1–M5 pass

- Live **memnet-llm==0.19.8** TCP-shared serve `:18765` + MCP `:18766` ingest of this Foam tree (CREATE / pin_map gold).
- Operator `git clone --recurse-submodules` of Foam (private) including `libs/omg`.
- Timed H2H (M5) — not run; must wait until M1+bind on live MemNet.
- KerML/OMG library kinds not on disk.

## Not this cut

H2H timings, P2 UI, Kuzu, other-repo migrate, Foam VI, product-ready claim.
