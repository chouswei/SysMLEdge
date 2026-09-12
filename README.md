# SysMLEdge

**SysMLEdge** is the bilingual bus for textual SysML v2 + agents: humans author **SysML** as the single source of truth; Cursor agents query and represent the same structure as **GQL/MCP** instead of grepping the tree. The graph is a **MemNet** projection of that tree. It is not a Kuzu port, not a SysON/Cameo/graphic SysML IDE, not a GitHub clone, and it does not ship SaaS or tenancy in this cut.

**Bilingual** here means SysML (author SSOT) + GQL (query and represent). It does not mean a zh/EN product UI. Market pin: [docs/PRODUCT-LOCKS.md](docs/PRODUCT-LOCKS.md#market-position-pin).

**This cut is P1 Foam proof scaffolding** on the runtime from #11. It does **not** make SysMLEdge ready to serve real projects. Plan ≠ product. Foam proof (`docs/P1-acceptance.md` rows 9–12 and M1–M5) is **not** claimed and **not** executed.

**CEO Core:** [#11](https://github.com/chouswei/SysMLEdge/pull/11) = scaffold only — **fake CI ≠ P1 pass**. Gate remains **live Foam M1–M5 + beat-grep** on **memnet-llm==0.19.8+TCP**.

## Stack (this cut)

| Layer | Role |
|-------|------|
| **SysML** zip or multi-file `sysml-models/` tree | Author SSOT |
| **Git revision** | Identity of a saved tree (`graph = model @ <git commit SHA>`) |
| **MemNet** | Projected graph index only. **No Kuzu.** TCP backend (`serve` + MCP TCP-shared); not the agent wedge once SysMLEdge MCP binds. |
| **GQL** | Read/represent the projection. MUST NOT invent structure beside SysML. |
| **MCP** | Agent face: **streamable HTTP** (Cursor Bearer, memnet-pi pattern). Read GQL; **propose** only; no silent SSOT overwrite |
| **Git / GitHub** | VCS backbone — repo @ SHA. We own projection, STALE, propose — not a GitHub rebuild. |
| **CLI** | `import` / `import-foam` / `gold` / `proof` / `head-to-head` / `memnet-check` / `status` / `save` / `download` / `reproject` / `mcp` |

Normative contracts: [docs/P0-contracts.md](docs/P0-contracts.md). Product locks (2026-09-11, **NARROW**): [docs/PRODUCT-LOCKS.md](docs/PRODUCT-LOCKS.md). Living plan: [docs/PRODUCT-PLAN.md](docs/PRODUCT-PLAN.md). Business plan (gated GTM + buyer roots): [docs/BUSINESS-PLAN.md](docs/BUSINESS-PLAN.md). P1 Foam acceptance + proof: [docs/P1-acceptance.md](docs/P1-acceptance.md). Agent rules: [AGENTS.md](AGENTS.md).

## P1 runtime (fixture)

Implementation language: **TypeScript on Node ≥ 20** (matches this `package.json`). The live MemNet path speaks the 0.19.8 TCP frame to `memnet serve`; it does not rewrite MemNet in C.

Synthetic tree: [`fixtures/p1-tiny/`](fixtures/p1-tiny/) — parts, ports, one connection, **one nested part usage**. Not a second desk.

### Fake MemNet (CI / default)

Use this when Pi / `memnet serve` is unreachable. Bind, STALE, propose, and reproject run against an in-memory projection parsed from SysML.

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
bash scripts/foam-import.sh
npx tsx src/cli.ts gold /tmp/foam-soi/sysml-models --sha "$(git -C /tmp/foam-soi rev-parse HEAD)"
npx tsx src/cli.ts proof --project /tmp/foam-desk --foam-ssot /tmp/foam-soi/sysml-models
npx tsx src/cli.ts head-to-head   # timings stay null until a timed run
```

### Live Pi (memnet-llm==0.19.8 + TCP)

Proof env lock: **memnet-llm==0.19.8** and TCP-shared (`MEMNET_MCP_TRANSPORT=tcp`). SysMLEdge still owns `rev` / STALE / reproject.

```bash
# Terminal 1 — MemNet serve (backend only)
memnet serve   # 127.0.0.1:18765

# optional: memnet MCP TCP-shared on :18766 for P1 pin_map proof (M1–M4), not the product agent face
export MEMNET_MCP_TRANSPORT=tcp

# Terminal 2 — SysMLEdge MCP (agent face)
export MEMNET_BACKEND=tcp
export MEMNET_SERVE_HOST=127.0.0.1
export MEMNET_SERVE_PORT=18765
export SYSMLEDGE_MCP_TOKEN=replace-me   # Cursor Authorization: Bearer
export SYSMLEDGE_PROJECT=/tmp/p1-desk
export MEMNET_MCP_TRANSPORT=tcp
export MEMNET_MCP_PORT=18766
export MEMNET_LLM_VERSION=0.19.8
npx tsx src/cli.ts memnet-check
npm run mcp
# streamable HTTP: http://127.0.0.1:18776/mcp
```

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

SysMLEdge keeps those *roles* and **replaces the engine**: MemNet + GQL, SysML tree as SSOT, human save as whole-tree overwrite with revision history. Do not vendor Kuzu or copy that stack wholesale.

## Status

**NARROW** (Elon / Horcrux, 2026-09-11) — Foam proof scaffolding (gold, import docs, live 0.19.8 TCP floor, M1–M5 harness stubs). **CEO Core:** [#11](https://github.com/chouswei/SysMLEdge/pull/11) = scaffold only — **fake CI ≠ P1 pass**. Gate remains live Foam M1–M5 + beat-grep on memnet-llm==0.19.8+TCP. **Not a Foam/MemNet proof pass.** Not ready to serve real projects.
