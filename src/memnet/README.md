# Live MemNet TCP client

Length-prefixed JSON argv frames to `memnet serve` (bounce **0.19.8**; Path-B CON **≥0.19.9**).

SysMLEdge still owns `rev` / STALE / reproject. This adapter must not pretend those fields exist on the MemNet wire. LIVE attach (ingest + SysML `qname=` pin_map, no TSK owns): [docs/proof/LIVE-0199-ATTACH.md](../../docs/proof/LIVE-0199-ATTACH.md).

## Env (live)

See [docs/proof/MEMNET-LIVE.md](../../docs/proof/MEMNET-LIVE.md).

| Name | Required when `MEMNET_BACKEND=tcp` |
|------|----------------------------------------|
| `MEMNET_BACKEND` | `tcp` |
| `MEMNET_MCP_TRANSPORT` | **must be `tcp`** |
| `MEMNET_SERVE_HOST` | default `127.0.0.1` |
| `MEMNET_SERVE_PORT` | **must be `18765`** |
| `MEMNET_MCP_PORT` | **must be `18766`** |
| `MEMNET_LLM_VERSION` | bounce `0.19.8`; LIVE bind / Path-B CON ingest `0.19.9` if serve does not print a version |
| `MEMNET_MAP_FILE` | SCHEMA `--map-file` on the **serve host**. Default: `fixtures/memnet-session.map`. leftover `--map` TAG lines are **not** sent. |

`createMemNetAdapter()` and `TcpMemNet.assertEngineFloor()` fail with `MemNetEnvError` when the floor is wrong. Default backend remains **fake** for CI.

