# RUNLOG — 2026-09-12 — Edison **LIVE rev bind** attempt

**CEO Core:** [#23](https://github.com/chouswei/SysMLEdge/pull/23) M1 narrow published → LIVE bind **unlocked**. [#18](https://github.com/chouswei/SysMLEdge/pull/18) FAKE bind remains scaffold. [#21](https://github.com/chouswei/SysMLEdge/pull/21) FAKE ego ≠ LIVE bind.

`proof_pass_claimed: false`. Not P1. Not H2H. Not cold. H2H (later) scores **narrow 124+nested**, not gold-200.

## Kill theater

| Not bind | Why |
|---------|-----|
| Tip Path-B / `pin_map` | MemNet wire has **no** `rev` / STALE. Non-empty `pin_map` ≠ `project@rev`. |
| `mn_0d4f6178` | Published M1 **narrow** (CON find \|Q\|=**124**, nested qname ego YES @ **0.19.9+TCP**). **≠** SysMLEdge `rev.sha`. |
| Path A AFTER on `mn_b05a9869` | CON=**29** + nested in TSK ego **via ops**. **≠** bind. |
| [#21] FAKE ego | SysML-grounded FAKE neighbourhood. Does not change MemNet rows. **≠** LIVE bind. |
| Cloud Cursor memnet-pi MCP | `serve_status` / `session_list` / `housekeep_stats` prove Pi is up — **not** bind. |

## This cloud VM — TCP blocker (executed)

Host: Cursor cloud agent. Date: 2026-09-12.

```bash
npm run live:probe
# also: timeout TCP 10.0.0.10:18765 / 127.0.0.1:18765
```

| Probe | Result |
|-------|--------|
| ping `10.0.0.10` | 100% packet loss |
| TCP `10.0.0.10:18765` | **FAIL** (timeout / no route) |
| TCP `127.0.0.1:18765` | **FAIL** (connection refused) |
| `MEMNET_BACKEND=tcp` `memnet-check` | **not run to green** — serve unreachable from this VM |

**Verdict:** cannot execute SysMLEdge LIVE import/reproject against Pi TCP from this VM. Operator path: `npm run bind:live` on the Pi ([LIVE-BIND-CHECKLIST.md](LIVE-BIND-CHECKLIST.md)).

## Cursor memnet-pi MCP (not bind)

Same agent turn. **Do not treat as bind.**

| Call | Result |
|-------|--------|
| `serve_status` | `running=true` host `127.0.0.1` port **18765** (Pi-local) |
| `session_list` | `mn_0d4f6178` (Path-B), `mn_b05a9869` (Path A ops) |
| `housekeep_stats` `mn_0d4f6178` | rows **1673/5000** edges **923** orphans **750** |
| `find` keyword `backgroundSetIndicator` | CueConflict \|Q\|=**2** (both gold qnames) |
| `pin_map` locator `qname=FoamDetectionLiteVer2::CoreVideoMonitorToolbar::backgroundSetIndicator` | nested PRT in owner via **contains**; Truncation not set on this emit |

These meters match the published Path-B **narrow**. They are **not** `rev.sha` + `rev.stale=false` from SysMLEdge `rev_status`.

## FAKE bind (this repo, still green)

```bash
export MEMNET_BACKEND=fake
npm run bind:smoke
```

Same sequence as [#18](https://github.com/chouswei/SysMLEdge/pull/18): import → 40-hex `rev.sha` `stale=false` → mutate → STALE fail-closed → `propose` refused → `reproject` live. **≠** LIVE TCP bind.

## LIVE bind (operator — not executed here)

Fill when Memnetor/Devicor runs `npm run bind:live` on the Pi:

| Field | Fill |
|-------|------|
| Date / host | |
| `memnet-check` `memnet_llm` | |
| Desk | Foam SHA / `fixtures/p1-tiny` |
| `rev.sha` (40 hex) | |
| `rev.stale` after import | must be `false` |
| `one_way` | **true** (not a reverse translator) |
| `bind.json` `memnetSession` | must **not** be `mn_0d4f6178` / `mn_b05a9869` |
| mutate → STALE / `propose` refused | |
| `reproject` → `rev.stale=false` | |
| `proof_pass_claimed` | **false** |

### STALE smoke (LIVE path — operator)

1. After import: `rev_status` 40-hex + `rev.stale=false`.
2. Mutate a `.sysml` file (no save): `rev.stale=true`.
3. `gql_read` default → `code: STALE`; `propose` refused.
4. `reproject` → live.

Honesty: TCP `ingest sysml` is LIVE Path-B ingest into a **new** session. SysMLEdge `gql_*` still overlays the grounded projection (adapter fallback). That overlay is **not** a claim that MemNet GQL is SSOT.

## Ask-back (Memnetor)

1. `memnet --version` ≥ 0.19.9 on Pi? `memnet serve` up?
2. Foam tree at which path, or p1-tiny desk OK?
3. Paste output of `npm run bind:live` (memnet-check + status + smoke-bind JSON).
4. Confirm no ingest into `mn_0d4f6178` / `mn_b05a9869`.
5. Hold H2H / cold.

## Explicit non-claims

- Not full P1 / M1–M5 pass
- Not H2H / cold operator
- Not inventing CON; not Neo4j
- Not migrating other repos
- Not claiming this VM executed LIVE `rev` bind
