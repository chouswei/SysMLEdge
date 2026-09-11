# SysMLEdge

**SysMLEdge** is a project service for SysML v2 models: humans author **SysML** as the single source of truth; agents query and represent the same structure as **GQL**. The graph is a **MemNet** projection of that tree. It is not a Kuzu port, not a graphic SysML IDE, and it does not ship SaaS or tenancy in this cut.

**Bilingual** here means SysML (author SSOT) + GQL (query and represent). It does not mean a zh/EN product UI.

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

Normative contracts: [docs/P0-contracts.md](docs/P0-contracts.md). Product locks (2026-09-11, **NARROW**): [docs/PRODUCT-LOCKS.md](docs/PRODUCT-LOCKS.md). Living plan: [docs/PRODUCT-PLAN.md](docs/PRODUCT-PLAN.md). P1 Foam acceptance + proof: [docs/P1-acceptance.md](docs/P1-acceptance.md). Business / beachhead (gated): [docs/BUSINESS-PLAN.md](docs/BUSINESS-PLAN.md). Agent rules: [AGENTS.md](AGENTS.md).

## Plan (not shipping here)

1. **P0** — contracts (this repository seed).
2. **P1** — Foam slice on pilot SoI [`chouswei/modelbasedPrj-itri-vedan-foam-detection`](https://github.com/chouswei/modelbasedPrj-itri-vedan-foam-detection) — [acceptance + Foam proof](docs/P1-acceptance.md) (docs done; proof not yet run). Runtime not in this cut.
3. **P2** — single-tenant SaaS on the existing droplet (Devicor); InvenTree untouched. **Spend frozen** until Foam proof passes.
4. **P3** — tenancy.

P2/P3 are plan phases only. This cut does not claim they are implemented. ClickUp and InvenTree are not SysMLEdge product features.

## What you can download

Downloadable source is the **SysML zip of a revision**. Never the graph dump.

## Lineage

Patterns (path index, MCP for agents, CLI) resume from **[codebase-sysmledgraph](https://github.com/chouswei/codebase-sysmledgraph)** — npm package **sysmledgraph** 0.8.2: SysML path indexer via LSP into a **Kuzu** knowledge graph, MCP (`indexDbGraph`, `query`, `context`, `impact`, Cypher, …), and CLI (`analyze`, `list`, `clean`, TCP worker for the Kuzu file lock).

SysMLEdge keeps those *roles* and **replaces the engine**: MemNet + GQL, SysML tree as SSOT, human save as whole-tree overwrite with revision history. Do not vendor Kuzu or copy that stack wholesale.

## Status

**NARROW** (Elon / Horcrux, 2026-09-11) — Foam proof in progress. Docs-first seed. Runtime MCP/CLI against MemNet is specified in P0, not implemented here.
