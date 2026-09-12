# RUNLOG — 2026-09-12 — Edison **rev bind smoke**

**CEO Core 2026-09-12:** [#18](https://github.com/chouswei/SysMLEdge/pull/18) FAKE bind = scaffold only — **not** live bind / not P1.

`proof_pass_claimed: false`. **scaffold / bind smoke ≠ P1 pass.** Not M1–M5. No H2H. No Kuzu.

SysMLEdge owns `rev.sha` / STALE / reproject. MemNet Path-B ingest is **B parallel** and is **not** this smoke.

## FAKE vs LIVE

| Arm | Where | Backend | Bind smoke |
|-----|--------|---------|------------|
| **FAKE** | CI / this cloud VM | `MEMNET_BACKEND=fake` | **green** — import desk → bound SHA `stale=false` → mutate → STALE fail-closed → `propose` refused → `reproject` → live. MCP tools exercised. |
| **LIVE** | Pi when TCP `:18765` reachable | `memnet-llm≥0.19.9` + `MEMNET_MCP_TRANSPORT=tcp` + SCHEMA `--map-file` | **operator** `npm run bind:live`. Devicor: [RUNLOG-2026-09-12-live-bind.md](RUNLOG-2026-09-12-live-bind.md) — **(f)** clean `mn_be03c1a9` @ `f6768b1108b20c15212f0895f41fb7a27b6a408d`. Dirty `mn_27ce8714` = honesty archive. H2H held (narrow only). **Not M1 pass.** |

Cloud VM does not claim LIVE TCP bind. FAKE is the recorded proof for this cut.

## Kill theater

| Not bind | Why |
|---------|-----|
| Tip Path-B / `pin_map` | Product lock: MemNet wire has **no** `rev` / STALE. Non-empty `pin_map` is not `project@rev`. |
| Path A AFTER on `mn_b05a9869` | **CON=29** + nested in TSK ego **via ops**. Cite separately. **≠** SysMLEdge bind. |
| Path-B CON **0.19.9** | On Pi: `mn_0d4f6178` published narrow **124**. **≠** this FAKE smoke. LIVE **(f)** clean is **`mn_be03c1a9`**. Dirty archive **`mn_27ce8714`**. |

### Cited MemNet session meters (separate; not this bind)

From [RUNLOG-2026-09-12-m1-bind.md](RUNLOG-2026-09-12-m1-bind.md) / Memnetor on **`mn_b05a9869`**:

| When | Meter | Value |
|------|-------|------:|
| BEFORE Path A | CON | **0** session-wide |
| BEFORE | `backgroundSetIndicator` | **ABSENT** |
| BEFORE | `pin_map` TSK ego | TSK only |
| AFTER Path A (ops) | TSK ego CON | **29** |
| AFTER Path A | nested in TSK ego | yes, via panel **owns** |
| Path-B CON | memnet-llm **0.19.9** (`mn_0d4f6178`) | **published narrow 124 — not bind** |

AFTER Path A meters are **still not** `rev.sha` bind. This RUNLOG does **not** reuse them as bind evidence.

## FAKE bind sequence (this cut)

Desk: Foam `sysml-models/` if `FOAM_DIR` is present, else documented [fixtures/p1-tiny](../../fixtures/p1-tiny/).

```bash
export MEMNET_BACKEND=fake
npm run bind:smoke
```

Must hold:

1. `rev_status`: full `rev.sha` (40 hex), `rev.stale=false`
2. Mutate a `.sysml` file (no save): `rev.stale=true`
3. `gql_read` default → `code: STALE`; `propose` refused
4. MCP `rev_status` / `gql_read` / `propose` / `reproject` follow the same rules
5. `reproject` → `rev.stale=false`; live `gql_read`

### Recorded FAKE run (this cloud VM, 2026-09-12)

`FOAM_DIR` absent → desk = `fixtures/p1-tiny`. `MEMNET_BACKEND=fake`.

| Step | Result |
|------|--------|
| import `rev.sha` | `7d470a12366f4bce864f095142431f7c0da3ae0c` (git HEAD of desk) |
| `rev.stale` after import | `false` |
| mutate `P1Tiny.sysml` | `rev.stale=true`; `gql_read` fail-closed; `propose` `code: STALE` |
| MCP | all four tools; STALE refuse then `reproject` live |
| after reproject | `rev.stale=false`; `gql_read` live |
| `proof_pass_claimed` | `false` |
| `cited_memnet_session` | `mn_b05a9869` (meters **not** used as bind) |

CI: `npm run bind:smoke` on GitHub Actions.

## Explicit non-claims

- Not Foam gold / M1 ingest fidelity
- Not P1 product pass
- Not LIVE TCP unless the LIVE checklist is filled on Pi
- Not Path-B CON on Pi (0.19.9 #158 pending roll)
