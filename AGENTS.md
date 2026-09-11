# Agent rules — SysMLEdge

SysML is the author **SSOT**. MemNet/GQL is the **trail** (projected index). Do not invent structure beside SysML.

## MUST

- Treat `sysml-models/` (or the SysML zip at a git SHA) as the only source of parts, ports, connections, `partNumber`, and ClickUp/Inventree ids.
- Read the graph only as `graph = model @ <git commit SHA>`. If STALE, show it and refuse live-SSOT pretence (`staleOk` is read-only).
- Propose via `sysml-models/proposals/<id>/{PATCH.md, delta.sysml}`. Humans save: whole-tree overwrite of current; git keeps history.
- Use GQL to query/represent what SysML already says. Bounded reads; no full-tree dump as the only merge story.

## MUST NOT

- Write the graph back as SSOT, or serve MemNet/GQL dumps as downloadable source (download = SysML zip only).
- Use **Kuzu**, Cypher, or `graph.kuzu` in this product.
- Invent qnames, parts, ports, connections, or PLM ids not in SysML at `rev.sha`.
- Silently overwrite `sysml-models/` SSOT files. MCP has no silent save and **no agent write-SSOT tool** (agent merge banned).
- Claim P2 SaaS or P3 tenancy is shipping in this repository seed.
- Treat ClickUp or InvenTree as SysMLEdge features (ids in SysML may project; that is not a PLM product).
- Add a graphic SysML canvas or modeler.

Contracts: [docs/P0-contracts.md](docs/P0-contracts.md). Locks: [docs/PRODUCT-LOCKS.md](docs/PRODUCT-LOCKS.md). Plan: [docs/PRODUCT-PLAN.md](docs/PRODUCT-PLAN.md).
