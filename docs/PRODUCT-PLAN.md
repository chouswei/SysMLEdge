# SysMLEdge product plan

Core locks: name **SysMLEdge**; bilingual = SysML (author SSOT) + GQL (query/represent); SSOT = SysML zip / `sysml-models/` tree; MemNet = projected index (**no Kuzu**); GQL never invents; agents propose only; human save = whole-tree overwrite of current + git rev history; download = SysML zip only; pilot SoI = `chouswei/modelbasedPrj-itri-vedan-foam-detection`.

This document is a skeleton. **P0 is contracts only.** P2/P3 are not shipping in the P0 cut.

| Phase | Name | Ships? (this repo seed) | Intent |
|-------|------|-------------------------|--------|
| **P0** | Contracts | **Yes — docs** | Normative sheet so implementers do not rebuild a Kuzu indexer. See [P0-contracts.md](P0-contracts.md). |
| **P1** | Foam slice | No | One real SoI: import/project the foam-detection SysML tree, GQL read of part/port/connection, STALE, propose path, zip download @ rev. |
| **P2** | Single-tenant SaaS | No | Hosted project service for **one** tenant: identity, import/save/download, MemNet per project, MCP for that tenant’s agents. |
| **P3** | Tenancy | No | Isolation, authz, and billing-shaped tenancy. Not implied by P2. |

## P0 — Contracts

- [x] Product README (MemNet-only, lineage to codebase-sysmledgraph).
- [x] This plan skeleton.
- [x] [P0-contracts.md](P0-contracts.md): rev identity, STALE, whole-tree import/save/download, MCP, mapping v1, proposal path, reject list.
- [x] [AGENTS.md](../AGENTS.md).
- [ ] Runtime MCP/CLI (out of P0 seed).

## P1 — Foam slice

Pilot: **https://github.com/chouswei/modelbasedPrj-itri-vedan-foam-detection** (`sysml-models/` as SSOT).

Must prove:

1. Import zip or clone tree → bind `graph = model @ SHA`.
2. MemNet projection of mapping v1 only (part / port / connection + `partNumber` + known ClickUp/Inventree ids).
3. STALE shown and live-SSOT pretence refused; `staleOk` read-only.
4. MCP `gql_read` / context / impact; `propose` → `sysml-models/proposals/<id>/`.
5. Human save overwrites current; download SysML zip @ rev; never download the graph.

Out of P1: multi-tenant SaaS, Kuzu compatibility, full SysML language coverage.

## P2 — Single-tenant SaaS

One organisation, hosted SysMLEdge: accounts, one (or few) projects, MCP endpoint, MemNet behind the service. Still SysML zip SSOT. Still no graph-as-download.

## P3 — Tenancy

Hard isolation between tenants (data, MemNet sessions, MCP credentials). Do not start P3 shapes in P0/P1 APIs.

## Lineage vs this plan

[codebase-sysmledgraph](https://github.com/chouswei/codebase-sysmledgraph) planned Modelbase publisher + codebase Subscriber around **one Kuzu file** and a TCP worker. SysMLEdge plan replaces that with **MemNet projection per saved rev** and human-gated whole-tree SSOT. Do not carry Kuzu lock/worker phases into this product.
