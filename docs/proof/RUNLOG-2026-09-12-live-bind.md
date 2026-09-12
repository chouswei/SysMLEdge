# RUNLOG — 2026-09-12 — Edison **LIVE rev bind** (Memnetor verified)

**CEO Core:** [#23](https://github.com/chouswei/SysMLEdge/pull/23) M1 narrow published → LIVE bind **unlocked**. [#18](https://github.com/chouswei/SysMLEdge/pull/18) FAKE bind remains scaffold. [#21](https://github.com/chouswei/SysMLEdge/pull/21) FAKE ego ≠ LIVE bind. [#26](https://github.com/chouswei/SysMLEdge/pull/26) lock **(g)** — graph = SaaS working SSOT; SysML = machine-kept mirror. **Strip `one_way` product pitch.**

`proof_pass_claimed: false`. **Not Foam M1.** Not P1. H2H **held**. Cold **held**. This session is **p1-tiny**, **not** Foam CON=124.

## Kill theater

| Not this bind | Why |
|---------------|-----|
| Tip Path-B / `pin_map` | MemNet wire has **no** `rev` / STALE. Non-empty `pin_map` ≠ `project@rev`. |
| `mn_0d4f6178` | Published M1 **narrow** (CON find \|Q\|=**124**). **≠** SysMLEdge `rev.sha`. **Refused attach.** |
| Path A AFTER on `mn_b05a9869` | CON=**29** via ops. **≠** bind. **Refused attach.** |
| Foam CON=124 | Desk is **p1-tiny**. Housekeep **56** rows ≠ Foam ingest. |
| leftover `--map PKG qname,path` | 0.19.9 rejects leftover `--map`. Operator patch = SCHEMA `--map-file`. |
| `one_way: true` | Lock **(g)** — not product truth. |

## Floor (Memnetor)

| Item | Value |
|------|--------|
| Engine | **memnet-llm==0.19.9** |
| Serve | TCP **`:18765`** |
| MemNet MCP (TCP-shared) | **`:18766`** |
| Transport | `tcp` |

## memnet-check (exact)

```json
{
  "ok": true,
  "memnet_llm": "0.19.9",
  "transport": "tcp",
  "proof_pass_claimed": false
}
```

Serve/MCP ports on the floor row (`:18765` / `:18766`). `proof_pass_claimed` stays **false**.

## SysMLEdge bind (exact)

| Field | Value |
|-------|--------|
| `memnetSession` | **`mn_27ce8714`** (**not** Path A `mn_b05a9869`, **not** Path B `mn_0d4f6178`) |
| `rev.sha` | `1664f20a41320b8ceba81340ea237d8c19245894` |
| `rev.stale` | **false** |
| Desk | **`fixtures/p1-tiny`** (`FOAM_DIR` **absent**) |
| Operator patch | `TcpMemNet` SCHEMA **`--map-file` `fixtures/memnet-session.map`** (replaces leftover `--map PKG qname,path`) |

## smoke (`BIND_SMOKE_LIVE=1`)

| Gate | Result |
|------|--------|
| `ok` | **true** |
| STALE fail-closed | **true** (`gql_read` default / `propose` refused while stale) |
| `reproject` live | **true** |
| MCP gates (`rev_status` / `gql_read` / `propose` / `reproject`) | **true** |
| H2H | **held** (not run) |
| cold | **held** (not run) |
| `proof_pass_claimed` | **false** |

## Housekeep on `mn_27ce8714` — **not** Foam CON=124

| Meter | Value |
|-------|------:|
| rows | **56 / 5000** |
| edges | **30** |
| orphans | **26** |

These are **p1-tiny** ingest sizes. MUST NOT treat them as Foam Path-B CON **124** (`mn_0d4f6178`) or gold **200**.

## Operator command (Pi)

```bash
export MEMNET_MAP_FILE="$(pwd)/fixtures/memnet-session.map"
BIND_SMOKE_LIVE=1 npm run bind:live
```

## Explicit non-claims

- Not Foam M1 pass on `mn_27ce8714`
- Not `proof_pass_claimed`
- Not H2H / cold
- Not Neo4j / dual-engine / dual-write editor
- Not attach to `mn_0d4f6178` / `mn_b05a9869`
