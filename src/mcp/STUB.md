# MemNet MCP (not in this seed)

Future SysMLEdge MCP lives here. Implement [docs/P0-contracts.md](../../docs/P0-contracts.md) §4 against **MemNet GQL** (`rev_status`, `gql_read`, `gql_context`, `gql_impact`, `list_scope`, `propose`, `reproject`).

Do not add `kuzu` as a dependency. Do not copy `codebase-sysmledgraph` `src/worker` (Kuzu TCP lock daemon) or Cypher tools.
