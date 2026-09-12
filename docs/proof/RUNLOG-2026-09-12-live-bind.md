# RUNLOG — 2026-09-12 — Edison **LIVE rev bind** (Memnetor verified)

**CEO Core:** [#23](https://github.com/chouswei/SysMLEdge/pull/23) M1 narrow published → LIVE bind **unlocked**. [#18](https://github.com/chouswei/SysMLEdge/pull/18) FAKE bind remains scaffold. [#21](https://github.com/chouswei/SysMLEdge/pull/21) FAKE ego ≠ LIVE bind. [#26](https://github.com/chouswei/SysMLEdge/pull/26) lock **(g)** — graph = SaaS working SSOT; SysML = machine-kept mirror. **Strip `one_way` product pitch.**

`proof_pass_claimed: false`. **Not Foam M1.** Not P1. H2H **held** until a clean **(f)** path. Cold **held**. This session is **p1-tiny**, **not** Foam CON=124. **(g) provisional.** **(r)** deferred.

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

These are **p1-tiny** ingest sizes **before** the lock **(g)** invent probe. MUST NOT treat them as Foam Path-B CON **124** (`mn_0d4f6178`) or gold **200**.

## Lock (g) invent meter (Devicor, same session)

Typed SysML mutate on desk **`fixtures/p1-tiny`**, session **`mn_27ce8714`**. **Not** LLM invent. **Not** a new-sid reproject: Path-B ingest into the **same** session.

Added in `P1Tiny.sysml`:

- `part def InventProbeBar`
- `part inventProbe`
- `port probeOut`

| Axis | Pre | Post |
|------|------|------|
| `rev.sha` | `1664f20a41320b8ceba81340ea237d8c19245894` | `1c1e3e50769cc23d8111548d19277cdbddfd1ce5` |
| `rev.stale` | **false** | **false** |
| gold parts | **11** | **13** |
| gold ports | **12** | **13** |
| `connections_parsed` | **6** | **6** |
| zip sha256 | (pre) | **changed** |
| zip ≡ disk SSOT | — | **PASS** |
| InventProbe in MemNet | — | **yes** (def + usage + port) |
| mirror-lie (silent drop) | — | **PASS** (no silent drop) |
| `proof_pass_claimed` | **false** | **false** |
| H2H / cold | **held** | **held** |

### CAVEAT — same-session re-ingest **appends** (honesty; pre-**(f)**)

Path-B ingest on an already-open session **does not replace**. Gold/zip/rev are honest; MemNet row counts **are not** replace-on-reproject.

| Meter | Pre (bind smoke) | Post (same-sid ingest) |
|-------|------------------:|------------------------:|
| housekeep rows | **56 / 5000** | **116 / 5000** |
| `find` PRT | **11** | **24** |
| `find` CON | **5** | **10** |

Duplicate **qnames** after append. **Lock (f)** (user GO 2026-09-12 + Memnetor): on reproject, open a **new MemNet session id** (ops-only). **(r)** replace-ingest is **deferred** — **no MemNet API change this cut**. MUST NOT treat 116/24/10 as gold 13/13/6. H2H next after a clean **(f)** path. `proof_pass_claimed: false`.

## Operator command (Pi)

```bash
export MEMNET_MAP_FILE="$(pwd)/fixtures/memnet-session.map"
BIND_SMOKE_LIVE=1 npm run bind:live
```

## Explicit non-claims

- Not Foam M1 pass on `mn_27ce8714`
- Not `proof_pass_claimed` (invent meter ≠ P1 / H2H)
- Not H2H / cold
- Not Neo4j / dual-engine / dual-write editor
- Not attach to `mn_0d4f6178` / `mn_b05a9869`
- Not treat same-session append (rows 56→116) as replace-on-reproject (**(r)** deferred)
- Not skip lock **(f)** (reproject must open a **new** MemNet session id)
