# Live MemNet TCP client

Length-prefixed JSON argv frames to `memnet serve` (memnet-llm **0.19.8**).

SysMLEdge still owns `rev` / STALE / reproject. This adapter must not pretend those fields exist on the MemNet wire.

## Env (live)

See [docs/proof/MEMNET-LIVE.md](../../docs/proof/MEMNET-LIVE.md).

| Name | Required when `MEMNET_BACKEND=tcp` |
|------|----------------------------------------|
| `MEMNET_BACKEND` | `tcp` |
| `MEMNET_MCP_TRANSPORT` | **must be `tcp`** |
| `MEMNET_SERVE_HOST` | default `127.0.0.1` |
| `MEMNET_SERVE_PORT` | **must be `18765`** |
| `MEMNET_MCP_PORT` | **must be `18766`** |
| `MEMNET_LLM_VERSION` | `0.19.8` if serve does not print a version |

`createMemNetAdapter()` and `TcpMemNet.assertEngineFloor()` fail with `MemNetEnvError` when the floor is wrong. Default backend remains **fake** for CI.
