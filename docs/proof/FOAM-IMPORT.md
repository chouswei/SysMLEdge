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

Whole-tree SSOT = **all** `.sysml` under `sysml-models/` (including `models/`, `outputs/`, and `libs/` once the submodule is present). Never parts-only. Never treat `parts/**` as model SSOT.

## Bind with existing P1 runtime

Default MemNet is **fake** (CI). Live Pi is optional (`docs/proof/MEMNET-LIVE.md`).

```bash
# from SysMLEdge
export MEMNET_BACKEND=fake
npx tsx src/cli.ts import-foam /tmp/foam-soi --project /tmp/foam-desk
npx tsx src/cli.ts status --project /tmp/foam-desk
```

Equivalent:

```bash
npx tsx src/cli.ts import /tmp/foam-soi --project /tmp/foam-desk
```

`import` / `import-foam` copy the **entire** `sysml-models/` tree into the project, commit, and `reproject`. Previous graph nodes are gone. `rev.sha` is the git commit of that desk snapshot.

## Gold list

Frozen parser output: [`fixtures/foam-gold/`](../../fixtures/foam-gold/). Regenerate (does not claim ingest fidelity):

```bash
npx tsx src/cli.ts gold /tmp/foam-soi/sysml-models --sha <FOAM_HEAD_SHA> -o fixtures/foam-gold/gold.json
```

## What this is not

- Not a Foam product change
- Not Kuzu, not a C rewrite, not P2 UI
- Not a claim that MemNet ingest covers nested parts without hand CREATE until M1 is run live
