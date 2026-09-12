# SysMLEdge MCP

Agent-facing **streamable HTTP** face (Cursor Bearer), same pattern as memnet-pi.

MemNet is the **TCP backend** (`memnet serve` `:18765` + MCP TCP-shared `:18766`, `MEMNET_MCP_TRANSPORT=tcp`, memnet-llm==0.19.8). Agents call this face, not MemNet, once bound. Live floor: [docs/proof/MEMNET-LIVE.md](../../docs/proof/MEMNET-LIVE.md).

## Tools

| Tool | SSOT mutate? | Behaviour |
|------|----------------|-----------|
| `rev_status` | No | `current.sha`, `rev.sha`, `rev.stale` |
| `gql_read` | No | Bounded read; STALE unless `staleOk=true` |
| `gql_context` | No | Neighbourhood of one qname |
| `gql_impact` | No | Connection neighbourhood / usage (not Foam-closure claimed) |
| `list_scope` | No | Package/part qnames |
| `propose` | No | `sysml-models/proposals/<id>/{PATCH.md,delta.sysml}` only; refused while STALE |
| `reproject` | No | Rebuild projection from current SysML; bind `rev.sha` |

Forbidden: agent `save` / `import` / merge onto current. Human save is CLI.

Do not add `kuzu`. Do not rewrite MemNet in C. Proof harness: `sysmledge proof` is shape-only (`proof_executed: false`).
