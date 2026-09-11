# SysMLEdge

**SysMLEdge** is the bilingual bus for textual SysML v2 + agents: humans author **SysML** as the single source of truth; Cursor agents query and represent the same structure as **GQL/MCP** instead of grepping the tree. The graph is a **MemNet** projection of that tree. It is not a Kuzu port, not a SysON/Cameo/graphic SysML IDE, not a GitHub clone, and it does not ship SaaS or tenancy in this cut.

**Bilingual** here means SysML (author SSOT) + GQL (query and represent). It does not mean a zh/EN product UI. Market pin: [docs/PRODUCT-LOCKS.md](docs/PRODUCT-LOCKS.md#market-position-pin).

## Stack (this cut)

| Layer | Role |
|-------|------|
| **SysML** zip or multi-file `sysml-models/` tree | Author SSOT |
| **Git revision** | Identity of a saved tree (`graph = model @ <git commit SHA>`) |
| **MemNet** | Projected graph index only. **No Kuzu.** |
| **GQL** | Read/represent the projection. MUST NOT invent structure beside SysML. |
| **MCP** | Agent surface: read GQL; **propose** only; no silent SSOT overwrite |
| **Git / GitHub** | VCS backbone — repo @ SHA. We own projection, STALE, propose — not a GitHub rebuild. |
| **CLI** (planned) | Path index / project, list, freshness — same *patterns* as the prior indexer, new engine |

Normative contracts: [docs/P0-contracts.md](docs/P0-contracts.md). Product locks (2026-09-11): [docs/PRODUCT-LOCKS.md](docs/PRODUCT-LOCKS.md). Living plan: [docs/PRODUCT-PLAN.md](docs/PRODUCT-PLAN.md). Business plan (Core GTM + buyer roots): [docs/BUSINESS-PLAN.md](docs/BUSINESS-PLAN.md). P1 Foam acceptance: [docs/P1-acceptance.md](docs/P1-acceptance.md). Agent rules: [AGENTS.md](AGENTS.md).

## Plan (not shipping here)

1. **P0** — contracts (this repository seed).
2. **P1** — Foam slice on pilot SoI [`chouswei/modelbasedPrj-itri-vedan-foam-detection`](https://github.com/chouswei/modelbasedPrj-itri-vedan-foam-detection) — [acceptance docs](docs/P1-acceptance.md) done; runtime not in this cut.
3. **P2** — single-tenant SaaS on the existing droplet (Devicor); InvenTree untouched.
4. **P3** — tenancy.

P2/P3 are plan phases only. This cut does not claim they are implemented. ClickUp and InvenTree are not SysMLEdge product features.

## What you can download

Downloadable source is the **SysML zip of a revision**. Never the graph dump.

## Lineage

Patterns (path index, MCP for agents, CLI) resume from **[codebase-sysmledgraph](https://github.com/chouswei/codebase-sysmledgraph)** — npm package **sysmledgraph** 0.8.2: SysML path indexer via LSP into a **Kuzu** knowledge graph, MCP (`indexDbGraph`, `query`, `context`, `impact`, Cypher, …), and CLI (`analyze`, `list`, `clean`, TCP worker for the Kuzu file lock).

SysMLEdge keeps those *roles* and **replaces the engine**: MemNet + GQL, SysML tree as SSOT, human save as whole-tree overwrite with revision history. Do not vendor Kuzu or copy that stack wholesale.

## Status

Docs-first seed. Runtime MCP/CLI against MemNet is specified in P0, not implemented here.
