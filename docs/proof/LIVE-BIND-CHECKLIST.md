# LIVE bind checklist — Pi when TCP reachable

SysMLEdge **bind** on live `memnet serve`. **Not** Path-B CON ingest. **Not** `pin_map` as `project@rev`.

`proof_pass_claimed: false`. scaffold/bind smoke ≠ P1 pass.

Cite MemNet session **`mn_b05a9869`** Path A AFTER meters (CON=29, nested in TSK ego via ops) from [RUNLOG-2026-09-12-m1-bind.md](RUNLOG-2026-09-12-m1-bind.md) as **engine ops**, separate from the `rev.sha` you record below. Path-B CON is **memnet-llm 0.19.9** (MemNet #158), **pending Pi roll**.

## Floor (must)

| Item | Value |
|------|--------|
| Engine on Pi today | `memnet-llm==0.19.8` until **0.19.9** is rolled |
| Path-B CON | **0.19.9** shipped (#158); **not** on Pi until roll |
| Serve | `127.0.0.1:18765` |
| MemNet MCP (pin_map proof only) | `:18766`, `MEMNET_MCP_TRANSPORT=tcp` |
| SysMLEdge MCP | `:18776/mcp` Bearer |

## Steps

```bash
# Terminal 1
memnet serve

# Terminal 2 (optional; M1 pin_map only — not bind)
export MEMNET_MCP_TRANSPORT=tcp
memnet mcp

# Terminal 3
export MEMNET_BACKEND=tcp
export MEMNET_MCP_TRANSPORT=tcp
export MEMNET_SERVE_HOST=127.0.0.1
export MEMNET_SERVE_PORT=18765
export MEMNET_MCP_PORT=18766
export MEMNET_LLM_VERSION=0.19.8
export FOAM_DIR=/tmp/foam-soi          # or documented desk
export SYSMLEDGE_PROJECT=/tmp/foam-desk
npx tsx src/cli.ts memnet-check
BIND_SMOKE_LIVE=1 npm run bind:smoke
```

Record (operator):

| Field | Fill |
|-------|------|
| Date / host | |
| `memnet-check` version | |
| Desk (Foam SHA or `fixtures/p1-tiny`) | |
| SysMLEdge `rev.sha` after import | 40 hex from `rev_status` — **not** a MemNet session id |
| Mutate → STALE `gql_read` / `propose` | pass / fail |
| MCP `reproject` → live | pass / fail |
| `proof_pass_claimed` | **false** |

## Refuse

- Treating Path A AFTER meters (CON=29, nested in TSK ego) or any `pin_map` ego as bind
- Claiming M1 pass
- Starting H2H from this checklist
- Claiming Path-B CON on Pi before **memnet-llm 0.19.9** is rolled
