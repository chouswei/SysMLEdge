# SysMLEdge

**SysMLEdge** is a project service for SysML v2 models: humans author **SysML** as the single source of truth; agents query and represent the same structure as **GQL**. The graph is a **MemNet** projection of that tree. It is not a Kuzu port and it does not ship SaaS or tenancy in this cut.

**Bilingual** here means SysML (author SSOT) + GQL (query and represent). It does not mean a zh/EN product UI.

## Stack (this cut)

| Layer | Role |
|-------|------|
| **SysML** zip or multi-file `sysml-models/` tree | Author SSOT |
| **Git revision** | Identity of a saved tree (`graph = model @ <git commit SHA>`) |
| **MemNet** | Projected graph index only. **No Kuzu.** |
| **GQL** | Read/represent the projection. MUST NOT invent structure beside SysML. |
| **MCP** | Agent surface: read GQL; **propose** only; no silent SSOT overwrite |
| **CLI** (planned) | Path index / project, list, freshness — same *patterns* as the prior indexer, new engine |

Normative contracts: [docs/P0-contracts.md](docs/P0-contracts.md). Phases: [docs/PRODUCT-PLAN.md](docs/PRODUCT-PLAN.md). Agent rules: [AGENTS.md](AGENTS.md).

## Plan (not shipping here)

1. **P0** — contracts (this repository seed).
2. **P1** — Foam slice on pilot SoI [`chouswei/modelbasedPrj-itri-vedan-foam-detection`](https://github.com/chouswei/modelbasedPrj-itri-vedan-foam-detection).
3. **P2** — single-tenant SaaS.
4. **P3** — tenancy.

P2/P3 are plan phases only. This cut does not claim they are implemented.

## What you can download

Downloadable source is the **SysML zip of a revision**. Never the graph dump.

## Lineage

Patterns (path index, MCP for agents, CLI) resume from **[codebase-sysmledgraph](https://github.com/chouswei/codebase-sysmledgraph)** — npm package **sysmledgraph** 0.8.2: SysML path indexer via LSP into a **Kuzu** knowledge graph, MCP (`indexDbGraph`, `query`, `context`, `impact`, Cypher, …), and CLI (`analyze`, `list`, `clean`, TCP worker for the Kuzu file lock).

SysMLEdge keeps those *roles* and **replaces the engine**: MemNet + GQL, SysML tree as SSOT, human save as whole-tree overwrite with revision history. Do not vendor Kuzu or copy that stack wholesale.

## Status

Docs-first seed. Runtime MCP/CLI against MemNet is specified in P0, not implemented here.
