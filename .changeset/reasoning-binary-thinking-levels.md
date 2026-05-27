---
"@aliou/pi-synthetic": patch
---

Set binary on/off thinkingLevelMap for all reasoning models

Most Synthetic reasoning models (GLM, Kimi, Qwen3.5, Nemotron, DeepSeek-V3.2, MiniMax-M2.5) only support binary reasoning — either on or off — not multiple levels. Updated their `thinkingLevelMap` to expose only a single "medium" toggle in Pi's UI, matching the approach in pi-neuralwatt.

- GLM-4.7, GLM-5, GLM-5.1, GLM-4.7-Flash, Kimi-K2.6, Qwen3.5-397B, Nemotron, DeepSeek-V3.2: `off: "none"`, only `medium` visible (reasoning_effort="none" confirmed to disable reasoning via API testing)
- MiniMax-M2.5: `off: null` (reasoning cannot be disabled — `reasoning_effort: "none"` is ignored by the model), only `medium` visible
- gpt-oss-120b: unchanged — true multi-level reasoning with distinct reasoning_content at low/medium/high
- Added `supportsReasoningEffort: true` to compat for Qwen3.5-397B and DeepSeek-V3.2 (new thinkingLevelMap requires it)
- Alias models (syn:large:text, syn:small:text, syn:large:vision, syn:small:vision) updated to match their target model
