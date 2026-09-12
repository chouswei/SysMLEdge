# Live MemNet runbook (0.19.8 + TCP)

Proof env lock: **memnet-llm==0.19.8** + TCP-shared MCP. Bounce **FAIL** on 0.19.7. SysMLEdge owns `rev.sha` / STALE / reproject — those fields are **absent** on the MemNet wire.

This runbook does **not** record a proof pass. **Cite:** Sysmler **KEEP / NARROW** + [CEO Core P1 gate](../PRODUCT-LOCKS.md#ceo-core-p1-gate-2026-09-12). **Must-fix:** timed H2H on 0.19.8+TCP after `rev` bind. **Kill:** tip Path-B sold as bind. **OK:** scaffold ≠ P1.

## Floor

| Item | Value |
|------|--------|
| Engine | `memnet-llm==0.19.8` |
| Serve | `127.0.0.1:18765` |
| MemNet MCP (proof `pin_map` only) | `:18766` |
| Transport | `MEMNET_MCP_TRANSPORT=tcp` |
| SysMLEdge MCP (agent face) | `:18776/mcp` streamable HTTP + Bearer |

In-process MemNet MCP → `session_not_found`. Serve death without `session_save` loses in-process sessions.

## Environment

```bash
export MEMNET_BACKEND=tcp
export MEMNET_MCP_TRANSPORT=tcp
export MEMNET_SERVE_HOST=127.0.0.1
export MEMNET_SERVE_PORT=18765
export MEMNET_MCP_PORT=18766
export MEMNET_LLM_VERSION=0.19.8   # required if `memnet serve` omits version on the wire
export SYSMLEDGE_MCP_TOKEN=replace-me
export SYSMLEDGE_PROJECT=/tmp/foam-desk
```

`sysmledge` **fails closed** when backend is `tcp` and any of: transport ≠ `tcp`, ports ≠ 18765/18766, version below 0.19.8, version UNKNOWN, or serve unreachable.

```bash
npx tsx src/cli.ts memnet-check
```

## Start

```bash
# Terminal 1 — MemNet backend
memnet serve          # 127.0.0.1:18765

# Terminal 2 — MemNet MCP TCP-shared (M1–M4 pin_map proof only; not the product agent face)
export MEMNET_MCP_TRANSPORT=tcp
memnet mcp            # :18766 — command name may vary; must share TCP with serve

# Terminal 3 — SysMLEdge
export MEMNET_BACKEND=tcp
export MEMNET_MCP_TRANSPORT=tcp
npx tsx src/cli.ts import-foam /tmp/foam-soi --project /tmp/foam-desk
npm run mcp
# http://127.0.0.1:18776/mcp
```

## Bounce (M4) — operator, not this harness

1. `session_save` on the live session
2. Restart **serve and MCP together**
3. Load session
4. Gold `pin_map` must be **non-empty**
5. Record `memnet-llm` version. Fail if MCP `session_list` ≠ serve

Harness `sysmledge proof --live` only asserts the env. It does **not** restart processes.

## Fake vs live

| | Fake | Live |
|--|------|------|
| CI | default `MEMNET_BACKEND=fake` | skip |
| Bind / STALE / propose / reproject | **FAKE green** (`npm run bind:smoke`) | same SysMLEdge bind when TCP up ([LIVE-BIND-CHECKLIST.md](LIVE-BIND-CHECKLIST.md)) |
| M1 ingest fidelity | FAKE ego: SysML contains/owns/ends; gold reconstruct counts | Path A AFTER: TSK ego CON=29 + nested via ops — **not bind**. Path-B CON = **0.19.9 (#158) pending Pi roll**. Attach: [LIVE-0199-ATTACH.md](LIVE-0199-ATTACH.md) |

## LIVE M1 (Memnetor 2026-09-12) — **not SysMLEdge bind**

Session `mn_b05a9869`. **BEFORE:** CON=0, nested ABSENT, TSK ego = TSK only. **AFTER Path A (ops):** TSK ego **CON=29**, nested `backgroundSetIndicator` in ego via panel owns, Truncation=false. **Still not `rev.sha` bind.** Path-B CON ingest shipped as **memnet-llm 0.19.9** (MemNet **#158**), **pending Pi roll**. `proof_pass_claimed: false`. near_cap ~4294/5000. [M1 RUNLOG](RUNLOG-2026-09-12-m1-bind.md). Bind smoke: [RUNLOG-2026-09-12-rev-bind.md](RUNLOG-2026-09-12-rev-bind.md).
