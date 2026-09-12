# Foam SoI import (whole tree)

Pilot SoI: `chouswei/modelbasedPrj-itri-vedan-foam-detection`. **Read SysML only.** Do not open Foam VI / app feature PRs from this repo.

This is **not** a second desk. Foam is the one proof SoI. SysMLEdge owns `rev` / STALE / reproject after import.

**Proof is not executed in this cut.** Import success ≠ M1–M5 pass.

## Clone (operator)

The Foam git repo is private. Use a token that can clone it. Always init the `sysml-models/libs` submodule (common-lib). ASCII paths only.

```bash
git clone --recurse-submodules https://github.com/chouswei/modelbasedPrj-itri-vedan-foam-detection.git /tmp/foam-soi
cd /tmp/foam-soi
git submodule update --init --recursive
# record SHA for gold freeze
git rev-parse HEAD
```

Whole-tree **mirror** = **all** `.sysml` under `sysml-models/` (including `models/`, `outputs/`, and `libs/` once the submodule is present). Never parts-only. Never treat `parts/**` as the model. After upload, lock **(g)** — graph is working SSOT; this tree is the regenerable mirror.

## Bind with existing P1 runtime

Default MemNet is **fake** (CI). Live Pi is optional (`docs/proof/MEMNET-LIVE.md`).

LIVE attach / LIVE bind operator: [LIVE-0199-ATTACH.md](LIVE-0199-ATTACH.md). Meters: [RUNLOG-2026-09-12-live-bind.md](RUNLOG-2026-09-12-live-bind.md).

```bash
export MEMNET_BACKEND=fake
export FOAM_DIR=/tmp/foam-soi
export SYSMLEDGE_PROJECT=/tmp/foam-desk
npm run bind:smoke
```

Equivalent split:

```bash
# from SysMLEdge
export MEMNET_BACKEND=fake
npx tsx src/cli.ts import-foam /tmp/foam-soi --project /tmp/foam-desk
npx tsx src/cli.ts status --project /tmp/foam-desk
npx tsx src/cli.ts smoke-bind --project /tmp/foam-desk --mcp
```

Equivalent:

```bash
npx tsx src/cli.ts import /tmp/foam-soi --project /tmp/foam-desk
```

`import` / `import-foam` copy the **entire** `sysml-models/` tree into the project, commit, and `reproject`. Previous graph nodes are gone. `rev.sha` is the git commit of that desk snapshot.

**Cite:** Sysmler **KEEP / NARROW** + [CEO Core P1 gate](../PRODUCT-LOCKS.md#ceo-core-p1-gate-2026-09-12). This import path is **not** Foam gold. **Must-fix:** full-clone construct matrix. **Kill:** silent drop (`connections_parsed:0` / omitted files); shrink zip to parts-only.

## Gold list

Frozen parser output: [`fixtures/foam-gold/`](../../fixtures/foam-gold/). See [RUNLOG-2026-09-12-m1-bind.md](RUNLOG-2026-09-12-m1-bind.md). Regenerate (does not claim live ingest fidelity):

```bash
npx tsx src/cli.ts gold /tmp/foam-soi/sysml-models --sha <FOAM_HEAD_SHA> -o fixtures/foam-gold/gold.json
```

## What this is not

- Not a Foam product change
- Not Kuzu, not a C rewrite, not P2 UI
- Not a claim that MemNet ingest covers nested parts without hand CREATE until M1 is run live
- Not a P1 pass from [#11](https://github.com/chouswei/SysMLEdge/pull/11) / [#12](https://github.com/chouswei/SysMLEdge/pull/12)
