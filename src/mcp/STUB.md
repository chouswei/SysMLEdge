# SysMLEdge MCP (not in this seed)

Future **SysMLEdge MCP** lives here: **streamable HTTP** (Cursor Bearer), same pattern as memnet-pi. Agents use `rev_status` / `gql_*` / `propose` per [docs/P0-contracts.md](../../docs/P0-contracts.md) §4. MemNet is the **TCP backend** (serve + MCP TCP-shared), not this agent face once bound.

Do not add `kuzu` as a dependency. Do not copy `codebase-sysmledgraph` `src/worker` (Kuzu TCP lock daemon) or Cypher tools. Do not reopen **no C rewrite now**.
