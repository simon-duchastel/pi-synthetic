---
"@aliou/pi-synthetic": minor
---

Add GLM-5.2 model and update `syn:large:text` alias

- Add `hf:zai-org/GLM-5.2`:
  - contextWindow: 524288
  - maxTokens: 65536
  - cost: input $1.4, output $4.4 per 1M tokens (cacheRead $1.4)
  - input: text only
  - reasoning: two effective levels — `max` (default, highest) and `high` (lower), per the GLM-5.2 chat template. The Synthetic OpenAI shim rejects literal `max` (and `xhigh` errors), so `thinkingLevelMap` maps Pi's `high` -> `"high"` and `xhigh` -> `"medium"` (which falls through to `max`); `minimal`/`low`/`medium` are hidden.
- Update `syn:large:text` alias target from `hf:zai-org/GLM-5.1` to `hf:zai-org/GLM-5.2`. Alias inherits the new two-level thinking map from its target.
