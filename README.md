# SysMLEdge

**SysMLEdge** (this cut) is Foam desk proof. **One-liner:** Two faces at one `model@rev` — ask/propose GQL, author/view the SysML mirror. After upload, **graph is live working SSOT** **(g)**; SysML is the machine-kept mirror. **Buyer gut:** *I ask the live model at this rev — no grep dump, no ghost tree.* **Kill smells:** IDE / canvas / MemNet tip = product. Not a Kuzu port, not a GitHub clone, and it does not ship SaaS or tenancy in this cut.

**Internal architecture name** (not brand): bilingual = ask/propose GQL + author/view SysML mirror. Org SysML-first still applies **before** upload. Not a zh/EN UI. Exact product-story locks: [docs/PRODUCT-LOCKS.md](docs/PRODUCT-LOCKS.md#ceo-core--steve-taste-2026-09-12) (Steve Jobs + CEO Core 2026-09-12 lock **(g)**).

**This cut is P1 Foam proof scaffolding** on the runtime from #11. It does **not** make SysMLEdge ready to serve real projects. Plan ≠ product. Foam proof (`docs/P1-acceptance.md` rows 9–12 and M1–M5) is **not** claimed and **not** executed.

**CEO Core:** [#11](https://github.com/chouswei/SysMLEdge/pull/11) = scaffold only — **fake CI ≠ P1 pass**. Gate remains **live Foam M1–M5 + beat-grep** on **memnet-llm==0.19.8+TCP**.

## Stack (this cut)

| Layer | Role |
|-------|------|
| **SysML** zip or multi-file `sysml-models/` tree | Machine-kept full-fidelity **mirror** @ rev (invent SSOT *before* upload) |
| **Git revision** | Identity of a saved mirror (`graph = model @ <git commit SHA>`) |
| **MemNet** | After upload: live working **graph** **(g)** + P1 projected index. **No Kuzu.** TCP backend (`serve` + MCP TCP-shared); not the agent wedge once SysMLEdge MCP binds. |
| **GQL** | Read/represent the bound model. MUST NOT invent **(b)**. Typed machine ops ≡ SysML constructs (Jon). |
| **MCP** | Agent face: **streamable HTTP** (Cursor Bearer, memnet-pi pattern). Read GQL; **propose** only; no silent SSOT overwrite |
| **Git / GitHub** | VCS backbone — repo @ SHA. We own projection, STALE, propose — not a GitHub rebuild. |
| **CLI** | `import` / `import-foam` / `gold` / `proof` / `head-to-head` / `memnet-check` / `live-probe` / `status` / `save` / `download` / `reproject` / `mcp` |

Normative contracts: [docs/P0-contracts.md](docs/P0-contracts.md). Product locks (**NARROW product story**, Steve Jobs + CEO Core 2026-09-12): [docs/PRODUCT-LOCKS.md](docs/PRODUCT-LOCKS.md). Living plan: [docs/PRODUCT-PLAN.md](docs/PRODUCT-PLAN.md). Business plan (Foam desk only until cold Foam yes): [docs/BUSINESS-PLAN.md](docs/BUSINESS-PLAN.md). P1 Foam acceptance + proof: [docs/P1-acceptance.md](docs/P1-acceptance.md). Agent rules: [AGENTS.md](AGENTS.md).

## P1 runtime (fixture)

Implementation language: **TypeScript on Node ≥ 20** (matches this `package.json`). The live MemNet path speaks the 0.19.8 TCP frame to `memnet serve`; it does not rewrite MemNet in C.

Synthetic tree: [`fixtures/p1-tiny/`](fixtures/p1-tiny/) — parts, ports, one connection, **one nested part usage**. Not a second desk.

### Fake MemNet (CI / default)

Use this when Pi / `memnet serve` is unreachable. Bind, STALE, propose, and reproject run against an in-memory projection parsed from SysML (parts/ports/connections + nested usages, **contains/owns/ends** neighbourhood). MUST NOT invent mission-TSK owns. LIVE attach plan: [`docs/proof/LIVE-0199-ATTACH.md`](docs/proof/LIVE-0199-ATTACH.md).

```bash
npm install
export MEMNET_BACKEND=fake   # default
npx tsx src/cli.ts import fixtures/p1-tiny --project /tmp/p1-desk
npx tsx src/cli.ts status --project /tmp/p1-desk
npm test
```

### Foam import + gold (proof scaffolding)

Foam is the **one** SoI. Import the whole `sysml-models/` tree (all `.sysml`). Do not spend hours on Foam VI. Frozen gold: [`fixtures/foam-gold/`](fixtures/foam-gold/). Runbooks: [`docs/proof/FOAM-IMPORT.md`](docs/proof/FOAM-IMPORT.md), [`docs/proof/MEMNET-LIVE.md`](docs/proof/MEMNET-LIVE.md), [`docs/proof/M1-M5.md`](docs/proof/M1-M5.md).

```bash
# operator: clone Foam (private) + submodule, then bind
FOAM_DIR=/tmp/foam-soi SYSMLEDGE_PROJECT=/tmp/foam-desk npm run bind:smoke   # FAKE bind; not M1–M5 / P1 pass
npx tsx src/cli.ts gold /tmp/foam-soi/sysml-models --sha "$(git -C /tmp/foam-soi rev-parse HEAD 2>/dev/null || echo UNKNOWN)"
npx tsx src/cli.ts proof --project /tmp/foam-desk --foam-ssot /tmp/foam-soi/sysml-models
npx tsx src/cli.ts head-to-head   # null scaffold; plumbing meters in docs/proof/RUNLOG-2026-09-12-h2h-plumbing.md
```

### Live Pi (memnet-llm ≥0.19.9 + TCP; bounce 0.19.8)

Proof env: bounce **0.19.8** + TCP-shared. LIVE bind ingest **≥0.19.9** with SCHEMA **`--map-file`** (`fixtures/memnet-session.map`, **qname** on PRT/POR/CON). leftover `--map` TAG wire is rejected. MUST NOT overwrite that map with narrow `fields=id name kind role status recycle`. SysMLEdge still owns `rev` / STALE / reproject. Path-B `mn_0d4f6178` CON **124** is **not** bind.

```bash
# Terminal 1 — MemNet serve (backend only)
memnet serve   # 127.0.0.1:18765

# optional: memnet MCP TCP-shared on :18766 for P1 pin_map proof (M1–M4), not the product agent face
export MEMNET_MCP_TRANSPORT=tcp

# Terminal 2 — SysMLEdge (on the Pi; cloud VM often cannot reach 10.0.0.10)
export MEMNET_BACKEND=tcp
export MEMNET_SERVE_HOST=127.0.0.1
export MEMNET_SERVE_PORT=18765
export SYSMLEDGE_MCP_TOKEN=replace-me   # Cursor Authorization: Bearer
export SYSMLEDGE_PROJECT=/tmp/p1-desk
export MEMNET_MCP_TRANSPORT=tcp
export MEMNET_MCP_PORT=18766
export MEMNET_LLM_VERSION=0.19.9
export MEMNET_MAP_FILE="$(pwd)/fixtures/memnet-session.map"
npx tsx src/cli.ts live-probe
npx tsx src/cli.ts memnet-check
npm run bind:live   # same bind rules; Path A CON=29 ≠ bind; Path-B 124 ≠ bind; not M1 pass
npm run mcp
# streamable HTTP: http://127.0.0.1:18776/mcp
```

LIVE operator boxes: [docs/proof/LIVE-BIND-CHECKLIST.md](docs/proof/LIVE-BIND-CHECKLIST.md). Meters: [docs/proof/RUNLOG-2026-09-12-live-bind.md](docs/proof/RUNLOG-2026-09-12-live-bind.md). Tiny H2H = plumbing ([docs/proof/RUNLOG-2026-09-12-h2h-plumbing.md](docs/proof/RUNLOG-2026-09-12-h2h-plumbing.md)). Foam **tip** H2H Track A ([#31](https://github.com/chouswei/SysMLEdge/pull/31); CEO Core narrow tip: must-win **PASS** context **3/3** · no_drop **3/3**; wall **FAIL** **0/3** log-only A **307.745ms** vs B **1286.676ms**; ≠ product / ≠ bind): [docs/proof/RUNLOG-2026-09-12-h2h-foam-tip.md](docs/proof/RUNLOG-2026-09-12-h2h-foam-tip.md). Cut 1 Memnetor exact: [docs/proof/RUNLOG-2026-09-12-cut1-tip-wall.md](docs/proof/RUNLOG-2026-09-12-cut1-tip-wall.md). **A1 green** @ **`mn_0d395e61` only** (d=1 ego; CueConflict none; wall **F log-only**; H1 = Pi restore GitHub map / [#39](https://github.com/chouswei/SysMLEdge/pull/39); **≠** `proof_pass` / ≠ Foam full green): [docs/proof/RUNLOG-2026-09-12-a1-h4-mn_0d395e61.md](docs/proof/RUNLOG-2026-09-12-a1-h4-mn_0d395e61.md). **(f)** clean = `mn_be03c1a9` @ `f6768b1108b20c15212f0895f41fb7a27b6a408d`. Dirty `mn_27ce8714` = honesty archive only. Wedge H2H = Foam SysMLEdge bind on `mn_0d4f6178` (**Track B unlocked**). Core GO **(F)** **STOP** then GO **(S)** **STOP** — Semiconductors PKG×2 **cleared**; only-inter remains; bind held for Core Items **(S)/(M)** ([docs/proof/RUNLOG-2026-09-12-gos-ads1274-only-inter.md](docs/proof/RUNLOG-2026-09-12-gos-ads1274-only-inter.md); bind not attempted). `proof_pass_claimed` stays **false** until that bind H2H + cold. `mn_b05a9869` / `mn_0d4f6178` / `pin_map` are **not** bind.

Cursor: HTTP MCP URL `http://127.0.0.1:18776/mcp` with `Authorization: Bearer ${SYSMLEDGE_MCP_TOKEN}`.

Human/operator (not agent tools): `sysmledge import`, `save`, `download`. Agents: `rev_status`, `gql_*`, `propose`, `reproject` only.

## Plan (not shipping here)

1. **P0** — contracts (this repository seed).
2. **P1** — Foam slice on pilot SoI [`chouswei/modelbasedPrj-itri-vedan-foam-detection`](https://github.com/chouswei/modelbasedPrj-itri-vedan-foam-detection) — [acceptance](docs/P1-acceptance.md). Runtime + **proof scaffolding** in this cut; **proof not yet run or passed**.
3. **P2** — single-tenant SaaS on the existing droplet (Devicor); InvenTree untouched. **Spend frozen** until Foam proof passes.
4. **P3** — tenancy.

P2/P3 are plan phases only. This cut does not claim they are implemented. ClickUp and InvenTree are not SysMLEdge product features.

## What you can download

Downloadable source is the **SysML zip of a revision** (all `.sysml` in the tree, excluding `proposals/`). Never the graph dump. Never parts-only SSOT.

## Lineage

Patterns (path index, MCP for agents, CLI) resume from **[codebase-sysmledgraph](https://github.com/chouswei/codebase-sysmledgraph)** — npm package **sysmledgraph** 0.8.2: SysML path indexer via LSP into a **Kuzu** knowledge graph, MCP (`indexDbGraph`, `query`, `context`, `impact`, Cypher, …), and CLI (`analyze`, `list`, `clean`, TCP worker for the Kuzu file lock).

SysMLEdge keeps those *roles* and **replaces the engine**: MemNet + GQL; after upload lock **(g)** (graph = working SSOT, SysML = machine-kept mirror); human/policy apply with revision history. Do not vendor Kuzu or copy that stack wholesale.

## Status

**NARROW** (Elon / Horcrux, 2026-09-11) — Foam proof scaffolding (gold, import docs, live 0.19.8 TCP floor, M1–M5 harness stubs). **CEO Core:** [#11](https://github.com/chouswei/SysMLEdge/pull/11) = scaffold only — **fake CI ≠ P1 pass**. Gate remains live Foam M1–M5 + beat-grep on memnet-llm==0.19.8+TCP. **Not a Foam/MemNet proof pass.** Not ready to serve real projects.
