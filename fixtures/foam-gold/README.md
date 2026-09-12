# Foam gold freeze

Human-checkable list from `src/sysml/parse.ts` over Foam `sysml-models/` at `gold.json` → `source.sha`.

- Source: `chouswei/modelbasedPrj-itri-vedan-foam-detection`
- **Not** an M1 pass. `proof_executed: false`
- Nested `backgroundSetIndicator`: **AUTO** in this freeze (parser; FakeMemNet copies with no hand CREATE). Live MemNet ingest CREATE is UNPROVEN.

Regenerate after a Foam tree is on disk (see `docs/proof/FOAM-IMPORT.md` and `docs/proof/RUNLOG-2026-09-12-m1-bind.md`):

```bash
npx tsx src/cli.ts gold /path/to/foam/sysml-models --sha <SHA> -o fixtures/foam-gold/gold.json
```

UNKNOWN (explicit):

- nested `sysml-models/libs/omg` until that gitlink is present
- do not invent qnames for constructs the parser still misses
