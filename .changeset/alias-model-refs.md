---
"@aliou/pi-synthetic": patch
---

Refactor alias models as thin build-time references

`syn:large:text`, `syn:small:text`, `syn:large:vision`, `syn:small:vision` were previously duplicated concrete entries with full specs (cost, contextWindow, compat, thinkingLevelMap). They are now thin `{ id, name, aliasFor }` entries that resolve from their target at build time in `buildSyntheticProviderModels`.

- Aliases always resolve with `provider: "synthetic"`, so they remain visible when Proxied Models is disabled
- `aliasFor` maps to the API's `hugging_face_id` field (prefixed with `hf:`)
- Added discriminated union types (`SyntheticModelAliasConfig`, `ConcreteSyntheticModelConfig`) and `isAlias()` type guard
- Startup validation: throws if an alias references a missing target
- Updated skill, AGENTS.md, and README with alias handling docs
