# RUNLOG — 2026-09-12 — Edison **LIVE rev bind** (Devicor Pi)

**CEO Core:** [#23](https://github.com/chouswei/SysMLEdge/pull/23) M1 narrow published → LIVE bind **unlocked**. [#18](https://github.com/chouswei/SysMLEdge/pull/18) FAKE bind remains scaffold. [#21](https://github.com/chouswei/SysMLEdge/pull/21) FAKE ego ≠ LIVE bind. [#26](https://github.com/chouswei/SysMLEdge/pull/26) lock **(g)** — graph = SaaS working SSOT; SysML = machine-kept mirror. **No `one_way` product flag.**

`proof_pass_claimed: false`. **Not M1 pass.** Not P1. Not H2H. Not cold. H2H (later) scores **narrow 124+nested**, not gold-200.

## Kill theater

| Not bind | Why |
|---------|-----|
| Tip Path-B / `pin_map` | MemNet wire has **no** `rev` / STALE. Non-empty `pin_map` ≠ `project@rev`. |
| `mn_0d4f6178` | Published M1 **narrow** (CON find \|Q\|=**124**, nested qname ego YES @ **0.19.9+TCP**). **≠** SysMLEdge `rev.sha`. **Refused attach.** |
| Path A AFTER on `mn_b05a9869` | CON=**29** + nested in TSK ego **via ops**. **≠** bind. **Refused attach.** |
| [#21] FAKE ego | SysML-grounded FAKE neighbourhood. Does not change MemNet rows. **≠** LIVE bind. |
| leftover `--map` TAG wire | 0.19.9 rejects leftover `--map` (`PKG qname,path` …). Product open is SCHEMA `--map-file`. |

## Engine wire (Devicor local patch → this repo)

`memnet session open` on **0.19.9** must send SCHEMA `--map-file` (absolute path on the serve host). leftover `--map` TAG lines fail. Default map: `fixtures/memnet-schema.sysml.txt`. Override: `MEMNET_MAP_FILE`.

## This cloud VM — TCP blocker (still true for Cursor cloud)

Host: Cursor cloud agent. Date: 2026-09-12.

| Probe | Result |
|-------|--------|
| TCP `10.0.0.10:18765` | typically **FAIL** from this VM |
| TCP `127.0.0.1:18765` | **FAIL** unless serve is local |

Cursor **memnet-pi** `serve_status` / `session_list` prove Pi is up — **not** bind.

## LIVE bind meters (Devicor on Pi) — smoke green, H2H held

Operator ran LIVE bind on Pi (local `--map-file` patch). Desk = **`fixtures/p1-tiny`** (not Foam gold ingest).

| Field | Value |
|-------|--------|
| Date / host | 2026-09-12 / Pi (`memnet serve` localhost) |
| Engine | memnet-llm **0.19.9** + TCP |
| Desk | `fixtures/p1-tiny` |
| `rev.sha` | `1664f20a41320b8ceba81340ea237d8c19245894` |
| `rev.stale` after import | **false** |
| MemNet session (`bind.json` `memnetSession`) | **`mn_27ce8714`** |
| Attach `mn_0d4f6178` / `mn_b05a9869` | **refused** |
| smoke | **LIVE_TCP green** (`npm run bind:live` / STALE sequence) |
| `working_ssot` / `sysml_role` | `graph` / `machine_mirror` (lock **(g)**; no `one_way`) |
| H2H | **held** (not run) |
| cold | **not run** |
| `proof_pass_claimed` | **false** |
| M1 pass | **not claimed** (p1-tiny desk ≠ Foam Path-B gold / CON 124) |

### STALE smoke (LIVE path)

Same SysMLEdge sequence as FAKE: import → 40-hex `rev.sha` + `rev.stale=false` → mutate `.sysml` → `rev.stale=true` → `gql_read` default `code: STALE` → `propose` refused → `reproject` live.

Honesty: TCP `ingest sysml` is LIVE Path-B ingest into a **new** session. SysMLEdge `gql_*` still overlays the grounded projection (adapter fallback). That overlay is **not** a claim that MemNet GQL is dual-write SSOT. P1 this week still **reprojects from imported SysML**.

## FAKE bind (this repo, still green)

```bash
export MEMNET_BACKEND=fake
npm run bind:smoke
```

**≠** LIVE TCP bind.

## Operator command (Pi)

```bash
export MEMNET_MAP_FILE="$(pwd)/fixtures/memnet-schema.sysml.txt"
npm run bind:live
```

## Explicit non-claims

- Not full P1 / M1–M5 pass
- Not H2H / cold operator
- Not inventing CON; not Neo4j / dual-engine / dual-write editor
- Not migrating other repos
- Not attaching bind to `mn_0d4f6178` / `mn_b05a9869`
- Not treating `mn_27ce8714` p1-tiny smoke as Foam M1 gold
