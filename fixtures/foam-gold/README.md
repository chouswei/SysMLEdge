# Foam gold freeze

Human-checkable list from `src/sysml/parse.ts` over Foam `sysml-models/` at `gold.json` → `source.sha`.

- Source: `chouswei/modelbasedPrj-itri-vedan-foam-detection`
- **Not** an M1 pass. `proof_executed: false`
- Nested `backgroundSetIndicator`: **AUTO** in the parser. FAKE reproject ego walks **contains/owns/ends** (no TSK owns). LIVE MemNet (`mn_b05a9869`): fail-fast then Path A ops ≠ bind. See [RUNLOG](../../docs/proof/RUNLOG-2026-09-12-m1-bind.md) and [LIVE-0199-ATTACH.md](../../docs/proof/LIVE-0199-ATTACH.md).
- `tree_files` is the parsed path matrix (models/ + libs/common + outputs diagram demo). `libs/omg` KerML is UNKNOWN.
- Parser pin: git submodule [`vendor/sysml-v2-grammar`](https://github.com/daltskin/sysml-v2-grammar) **v2026.05.0**. Frozen `gold.json` counts stay the regex-era extract until a human replaces this file. ANTLR re-gold is [`docs/proof/RUNLOG-2026-09-13-antlr-foam-gold.md`](../../docs/proof/RUNLOG-2026-09-13-antlr-foam-gold.md) — **not** a proof pass.

Regenerate after a Foam tree is on disk (see `docs/proof/FOAM-IMPORT.md` and `docs/proof/RUNLOG-2026-09-12-m1-bind.md`):

```bash
npx tsx src/cli.ts gold /path/to/foam/sysml-models --sha <SHA> -o fixtures/foam-gold/gold.json
npx tsx src/cli.ts projection-census /path/to/foam/sysml-models --sha <SHA> --gold fixtures/foam-gold/gold.json -o docs/proof/artifacts/RUNLOG-antlr-foam-gold.json
```

UNKNOWN (explicit):

- nested `sysml-models/libs/omg` until that gitlink is present
- do not invent qnames for constructs the parser still misses
