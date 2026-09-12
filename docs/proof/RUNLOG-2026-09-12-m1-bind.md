# RUNLOG — 2026-09-12 — M1 parser gold + FAKE bind smoke

| Gate | Status |
|------|--------|
| **LIVE** MemNet M1 | **blocked** |
| **FAKE** bind / STALE | **ok** |
| `proof_pass_claimed` | `false` |
| M1–M5 pass | **not claimed** |

## LIVE=blocked (Memnetor probe)

Do **not** claim live MemNet M1. Leave the TCP ingest path as **TODO** until Memnetor restores **both**:

1. Foam mission `mn_b05a9869` as a proven TCP-shared ingest (not an in-process id list)
2. `memnet-llm` **version pin** (`==0.19.8` or higher on the wire)

| Probe | Result |
|-------|--------|
| Memnetor | TCP ports OK; Foam mission `mn_b05a9869` **ABSENT**; `memnet-llm` version **UNKNOWN** |
| This VM | `127.0.0.1:18765` connect **refused** (ports-up reports are not a version pin) |
| `git clone` Foam | **blocked** (private; agent token 404) |

`sysmledge memnet-check` / `--live` ingest is **out of scope** for this cut.

## FAKE=ok (this cut)

| Field | Value |
|-------|--------|
| Date (UTC) | 2026-09-12 |
| Foam source SHA | `76459224e6afbe74612cca9b37ffe0b3503bda85` |
| Foam fetch | **LIVE SysML via GitHub MCP** (clone blocked). Tree: `/tmp/foam-soi/sysml-models/` — 7 `models/` files including `connections.sysml` + `root.sysml`, plus `libs/common/**/*.sysml`. Nested `libs/omg` **not** on disk. |
| Bind / STALE | **FAKE** (`MEMNET_BACKEND=fake`, forced by `npm run m1:smoke`) |
| Command | `FOAM_DIR=/tmp/foam-soi SYSMLEDGE_PROJECT=/tmp/foam-desk npm run m1:smoke` |

1. `import` Foam tree → `rev.sha` 40-hex, `rev.stale=false`
2. Mutate `models/root.sysml` → `rev.stale=true`
3. `propose` refused with `code: STALE`

## Gold counts (parser, not ingest pass)

Frozen at `fixtures/foam-gold/gold.json`. `proof_executed: false`.

| Meter | Count |
|-------|------:|
| files | 25 |
| packages | 26 |
| parts | 647 |
| ports | 1400 |
| connections_parsed | 186 |
| nested_parts | 380 |
| unknown | 1 (`libs/omg` KerML gitlink) |

`connections_parsed:0` was a parser bug (quote pairing swallowed `deploy.sysml` usages). Still **186** after re-extract. Nested `backgroundSetIndicator`: **AUTO** (no hand CREATE on FakeMemNet). Live MemNet CREATE: **TODO** (blocked).

## TODO — live MemNet (Memnetor)

- Restore Foam mission ingest on TCP-shared serve (`mn_b05a9869` or successor named on the wire)
- Pin `memnet-llm==0.19.8` (or higher) so `memnet-check` is not UNKNOWN
- Then: live ingest of this gold tree, pin_map vs gold, bounce (M4), then H2H (M5)

## Not this cut

H2H timings, P2 UI, Kuzu, other-repo migrate, Foam VI, product-ready claim, live M1.
