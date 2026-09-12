# LIVE bind checklist — Pi when TCP reachable

SysMLEdge **bind** on live `memnet serve`. **Not** Path-B CON ingest. **Not** `pin_map` as `project@rev`.

[#23](https://github.com/chouswei/SysMLEdge/pull/23) published M1 **narrow** (CON **124** + nested qname ego on `mn_0d4f6178` @ **0.19.9+TCP**) and **cleared** the LIVE-bind gate. This checklist is the Edison operator path.

`proof_pass_claimed: false` until LIVE bind **and** timed H2H **and** cold. H2H scores **narrow 124+nested**, not gold-200.

Cite Path-B **`mn_0d4f6178`** as published M1 meters **only**. Cite Path A **`mn_b05a9869`** AFTER (CON=29) as **engine ops**. Neither session id is `rev.sha`. LIVE bind **opens a new ingest session**.

Lock **(g):** `rev_status.working_ssot=graph`, `sysml_role=machine_mirror`. **No `one_way` flag.**

## Floor (must)

| Item | Value |
|------|--------|
| Engine on Pi | **memnet-llm ≥0.19.9** + TCP (bounce still proven on **0.19.8**) |
| Session open | SCHEMA **`--map-file`** (`fixtures/memnet-session.map` or `MEMNET_MAP_FILE`). leftover `--map PKG qname,path` **rejected** |
| Path-B CON | **on Pi** — published narrow on `mn_0d4f6178` (MemNet #158). **≠ bind** |
| Serve | `127.0.0.1:18765` (operator on Pi). Cloud VM **`10.0.0.10:18765` often unreachable** |
| MemNet MCP (`pin_map` proof only) | `:18766`, `MEMNET_MCP_TRANSPORT=tcp` |
| SysMLEdge MCP | `:18776/mcp` Bearer |

## Cloud VM blocker

If `npm run live:probe` cannot TCP `127.0.0.1:18765` or `10.0.0.10:18765`, **do not claim LIVE bind from that VM**. Memnetor/Devicor run the operator script **on the Pi**.

```bash
npm run live:probe
# exit 2 → fill RUNLOG blocker; operator continues on Pi
```

## Steps (operator on Pi)

```bash
memnet serve          # 127.0.0.1:18765
export FOAM_DIR=/tmp/foam-soi          # or omit → fixtures/p1-tiny
export SYSMLEDGE_PROJECT=/tmp/foam-desk
export MEMNET_MAP_FILE="$(pwd)/fixtures/memnet-session.map"
npm run bind:live
```

MUST NOT set `MEMNET_ATTACH_SESSION=mn_0d4f6178` or `mn_b05a9869`.

Record (operator): [RUNLOG-2026-09-12-live-bind.md](RUNLOG-2026-09-12-live-bind.md).

| Field | Fill (Memnetor verified 2026-09-12) |
|-------|------|
| Floor | **0.19.9** + TCP **:18765** / **:18766** |
| `memnet-check` | `ok=true` `memnet_llm=0.19.9` `transport=tcp` `proof_pass_claimed=false` |
| Desk | `fixtures/p1-tiny` (`FOAM_DIR` absent) |
| SysMLEdge `rev.sha` | `1664f20a41320b8ceba81340ea237d8c19245894` |
| `rev.stale` | **false** |
| `memnetSession` | **`mn_27ce8714`** (**not** A/B) |
| housekeep | rows **56/5000** edges **30** orphans **26** — **not** Foam CON=124 |
| smoke | `BIND_SMOKE_LIVE=1` **ok**; STALE fail-closed; reproject/MCP gates **true** |
| map | SCHEMA `--map-file` `fixtures/memnet-session.map` |
| invent meter (same sid) | `InventProbeBar` / `inventProbe` / `probeOut`; `rev.sha` → `1c1e3e50769cc23d8111548d19277cdbddfd1ce5`; gold 11→13 / 12→13 / 6→6; zip≡disk PASS; InventProbe in MemNet yes; mirror-lie PASS |
| append caveat | rows **56→116**; find PRT **11→24** / CON **5→10** (duplicate qnames). Prefer fresh session or replace |
| H2H / cold | **held** |
| `proof_pass_claimed` | **false** |

## Refuse

- Treating Path-B / `pin_map` / `mn_0d4f6178` as bind
- Treating Path A AFTER meters (CON=29) as bind
- Claiming [#21](https://github.com/chouswei/SysMLEdge/pull/21) FAKE ego is LIVE bind
- Advertising `one_way: true` as product truth (lock **(g)**)
- leftover `--map` TAG wire on 0.19.9
- Claiming M1 / P1 / `proof_pass_claimed` from this checklist
- Starting H2H from this checklist
- Inventing CON / Neo4j / dual-engine / dual-write editor
