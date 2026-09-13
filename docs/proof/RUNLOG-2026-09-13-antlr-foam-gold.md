# RUNLOG — 2026-09-13 — ANTLR Foam projection census

**Cite:** grammar pin [`vendor/sysml-v2-grammar`](https://github.com/daltskin/sysml-v2-grammar) **v2026.05.0** (`7292dc3`). Foam SoI @ **`76459224e6afbe74612cca9b37ffe0b3503bda85`**. Frozen gold [`fixtures/foam-gold/gold.json`](../../fixtures/foam-gold/gold.json) is **not** overwritten. `proof_pass_claimed: false`. **Not** M1. **Not** Foam-complete. **Not** full KerML. **(g)** remains provisional.

Compact JSON: [artifacts/RUNLOG-antlr-foam-gold.json](artifacts/RUNLOG-antlr-foam-gold.json).

Command:

```bash
npx tsx src/cli.ts projection-census /tmp/foam-gold-76459224/sysml-models \
  --sha 76459224e6afbe74612cca9b37ffe0b3503bda85 \
  --gold fixtures/foam-gold/gold.json \
  -o docs/proof/artifacts/RUNLOG-antlr-foam-gold.json
```

## Gate

| Field | Value |
|-------|--------|
| Tree | Foam `sysml-models/` @ gold freeze SHA (26 `.sysml`; `libs/omg` still UNKNOWN) |
| Parser | `src/sysml/parse.ts` (ANTLR first; regex per-file fallback) |
| Frozen gold | regex-era extract; **left in place** |
| `proof_pass_claimed` | **false** |
| P1 / M1–M5 / bind H2H | **not claimed** |
| Neo4j / dual-engine | **unused** |

## Engine mix

| Engine | Files | Why |
|--------|------:|-----|
| ANTLR | **21** | grammar `ok` and no silent-drop vs regex |
| regex | **5** | ANTLR **fail** (`antlr_fail`); **0** `silent_drop` |

Regex fallback files (ANTLR errors; projection still taken from the regex scanner so those files are not dropped):

| Path | Sample |
|------|--------|
| `libs/common/composites/cam_revision2_assembly.sysml` | `mismatched input ':' expecting {';', '{'}` |
| `libs/common/parts/hardware_ports.sysml` | same `:` mismatch (23 errors) |
| `libs/common/parts/opto_vision.sysml` | same `:` mismatch |
| `libs/common/parts/semiconductors.sysml` | `:` mismatch; `no viable alternative at input 'portout'` |
| `models/deploy.sysml` | UTF-8 BOM `\ufeff` then `:` mismatch |

When ANTLR parses, it did **not** silent-drop parts/ports/unique `from->to` pairs vs regex. The five regex files are ungrammatical (or BOM) relative to OMG 2026-05, not a walker skip of a valid tree.

## Projected counts vs frozen gold

| Meter | Frozen gold | ANTLR-first extract | Δ |
|-------|------------:|--------------------:|--:|
| files | 26 | 26 | 0 |
| packages | 27 | 27 | 0 |
| parts | 663 | **665** | **+2** |
| ports | 1400 | **1432** | **+32** |
| connections_parsed | 200 | **193** | **−7** |
| nested_parts | 388 | **390** | **+2** |

Part qname sample (not invented; from extract vs freeze):

- Extra: `Network::NetgearGS724T`, `OptoVision::Jhem600gmHmP`, `Rp2350W5500PoeEdge::Rp2350W5500M12PoePcba::poePowerOutConn`, `Rp2350W5500PoeEdge::Rp2350W5500M12PoePcba::wizPoe`
- Missing freeze qnames: `Rp2350W5500PoeEdge::poePowerOutConn`, `Rp2350W5500PoeEdge::wizPoe` (same two usages, now nested under the PCBA owner)

Connections **−7** matches the known regex double-count (`connection` + `connect` on one usage). ANTLR emits one edge per `connectionUsage` with two ends. Parser gold **200** stays **reference only**.

## Walker-omitted constructs (Foam tree uses these)

P0 graph kinds stay `package | part | port | connection`. The grammar **parses** the rows below; the walker **does not emit them as kinds**. Unmapped SysML stays in the zip/tree.

| Kind | Walker | ANTLR hits | Source keyword | Files (short) |
|------|--------|----------:|---------------:|----------------|
| `requirement_def` | omitted | 125 | 125 | `models/requirements.sysml` |
| `satisfy_requirement` | omitted | 182 | 0 | `models/root.sysml` |
| `requirement_usage` | omitted | 0 | 182 | same 182 as `satisfy` (keyword vs rule) |
| `item_def` | omitted | 124 | 124 | items-mqtt / items-host-config / deploy / connections / flow_items |
| `item_usage` | omitted | 117 | 117 | those plus behaviour / hardware_ports |
| `action_def` | omitted | 193 | 193 | `models/behaviour.sysml`, relays |
| `action_usage` | omitted | 8 | 13 | behaviour / relays |
| `perform_action` | omitted | 5 | 0 | relays |
| `state_def` | omitted | 16 | 16 | `models/behaviour.sysml` |
| `state_usage` | omitted | 85 | 85 | `models/behaviour.sysml` |
| `attribute_def` | omitted | 126 | 126 | behaviour / polarfire-soc |
| `calc_def` | omitted | 3 | 3 | behaviour |
| `constraint_def` | omitted | 4 | 4 | behaviour / relays |
| `allocation_usage` | omitted | 7 | 7 | `models/deploy.sysml` (regex file; source keyword) |
| `connection_def` | walked, **not** an edge | 72 | 72 | connections / libs connections / deploy / network / rp2350 composite |
| `attribute_usage` | walked; only `partNumber` / `clickUp` / `inventree` become properties | 3191 | — | most files |

Frozen gold listed packages `FoamDetectionLiteVer2Requirements`, `FoamLiteVer2Behaviour`, `FoamLiteVer2Mqtt`, `FoamLiteVer2HostConfig` and **no** parts under those qnames. That matches this census: those files parse as packages plus omitted requirement / action / state / item constructs.

## What this is not

- Not a replacement of `fixtures/foam-gold/gold.json`
- Not Foam-complete mapping (requirement / item / action / state / calc / constraint / allocation still omitted as kinds)
- Not M1 / LIVE bind / H2H / cold
- Not a claim that ANTLR beat regex on every file (five files still regex)
- Not CueConflict / MemNet ingest

UNKNOWN: nested `sysml-models/libs/omg` KerML gitlink, same as the freeze.
