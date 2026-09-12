# RUNLOG — 2026-09-12 — Edison **LIVE rev bind** (Memnetor verified)

**CEO Core:** [#23](https://github.com/chouswei/SysMLEdge/pull/23) M1 narrow published → LIVE bind **unlocked**. [#18](https://github.com/chouswei/SysMLEdge/pull/18) FAKE bind remains scaffold. [#21](https://github.com/chouswei/SysMLEdge/pull/21) FAKE ego ≠ LIVE bind. [#26](https://github.com/chouswei/SysMLEdge/pull/26) lock **(g)** — graph = SaaS working SSOT; SysML = machine-kept mirror. **Strip `one_way` product pitch.**

**CEO Core exact (user GO + Memnetor):** lock **(f)** clean session = **`mn_be03c1a9`** @ **`rev.sha` `f6768b1108b20c15212f0895f41fb7a27b6a408d`**. Dirty **`mn_27ce8714`** = honesty archive only. MUST NOT sell continuous same-session **(g)** until **(r)**. H2H on **p1-tiny / `mn_be03c1a9` = plumbing only**. `proof_pass_claimed` stays **false** until timed H2H + cold on Foam narrow (`mn_0d4f6178` CON **124** + nested), unless Core re-locks P1 desk to tiny. **Not Foam M1.** Not P1. Cold **held**. **(g) provisional.** **(r)** deferred.

## Kill theater

| Not this bind | Why |
|---------------|-----|
| Tip Path-B / `pin_map` | MemNet wire has **no** `rev` / STALE. Non-empty `pin_map` ≠ `project@rev`. |
| `mn_0d4f6178` | Published M1 **narrow** (CON find \|Q\|=**124**). **≠** SysMLEdge `rev.sha`. **Refused attach.** |
| Path A AFTER on `mn_b05a9869` | CON=**29** via ops. **≠** bind. **Refused attach.** |
| Foam CON=124 | Desk is **p1-tiny**. Housekeep **56** rows ≠ Foam ingest. |
| leftover `--map PKG qname,path` | 0.19.9 rejects leftover `--map`. Operator patch = SCHEMA `--map-file`. |
| `mn_27ce8714` | **Dirty honesty archive** (append). **≠** live **(f)** bind. |
| Continuous same-session **(g)** | Deferred until **(r)**. Mirror-lie PASS ≠ sell. |

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

## SysMLEdge bind (exact) — lock **(f)** clean

| Field | Value |
|-------|--------|
| `memnetSession` | **`mn_be03c1a9`** (CEO Core **(f)** clean; **not** dirty archive `mn_27ce8714`; **not** Path A/B) |
| `rev.sha` | `f6768b1108b20c15212f0895f41fb7a27b6a408d` |
| Desk | **`fixtures/p1-tiny`** |
| Operator | new-sid reproject (ops-only). **(r)** deferred |

## Archive — dirty `mn_27ce8714` (honesty only; not live **(f)**)

| Field | Value |
|-------|--------|
| `memnetSession` | **`mn_27ce8714`** (**not** Path A `mn_b05a9869`, **not** Path B `mn_0d4f6178`) |
| `rev.sha` (first bind) | `1664f20a41320b8ceba81340ea237d8c19245894` |
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
| H2H | **plumbing** on `mn_be03c1a9` ([RUNLOG-2026-09-12-h2h-plumbing.md](RUNLOG-2026-09-12-h2h-plumbing.md)). Foam **tip** Track A Devicor `wall_pass` **0/3** (A **307.745ms** vs B **1286.676ms**); context **3/3** · no_drop **3/3** — [RUNLOG-2026-09-12-h2h-foam-tip.md](RUNLOG-2026-09-12-h2h-foam-tip.md). **≠** Foam M5 / ≠ bind. Product bind H2H **held** |
| cold | **held** (not run) |
| `proof_pass_claimed` | **false** |

## Housekeep on dirty archive `mn_27ce8714` — **not** Foam CON=124; **not** live **(f)**

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

Duplicate **qnames** after append. **Lock (f)** clean = **`mn_be03c1a9`** @ **`f6768b1108b20c15212f0895f41fb7a27b6a408d`**. This dirty sid is **honesty archive only**. **(r)** replace-ingest is **deferred** — **no MemNet API change this cut**. MUST NOT sell continuous same-session **(g)** until **(r)**. MUST NOT treat 116/24/10 as gold 13/13/6. Tiny H2H = plumbing. `proof_pass_claimed: false`.

## Operator command (Pi)

```bash
export MEMNET_MAP_FILE="$(pwd)/fixtures/memnet-session.map"
BIND_SMOKE_LIVE=1 npm run bind:live
```

## Explicit non-claims

- Not Foam M1 pass on `mn_27ce8714` or `mn_be03c1a9`
- Not treat dirty `mn_27ce8714` as live **(f)** (honesty archive only)
- Not sell continuous same-session **(g)** until **(r)**
- Not `proof_pass_claimed` (tiny H2H ≠ Foam wedge; invent meter ≠ P1)
- Not Foam wedge H2H / cold (tiny H2H = plumbing only). Exact table: [RUNLOG-2026-09-12-h2h-plumbing.md](RUNLOG-2026-09-12-h2h-plumbing.md).
- Not Neo4j / dual-engine / dual-write editor
- Not attach to `mn_0d4f6178` / `mn_b05a9869` / dirty `mn_27ce8714`
- Not treat same-session append (rows 56→116) as replace-on-reproject (**(r)** deferred)
