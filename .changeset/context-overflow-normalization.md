---
"@aliou/pi-synthetic": patch
---

Normalize Synthetic context overflow errors so Pi's built-in compact-and-retry triggers.

Some Synthetic backends return overflow errors that Pi does not detect natively (e.g. "The input (N tokens) is longer than the model's context length" or "Context limit exceeded"). A `message_end` handler now prefixes these with `context_length_exceeded:` so Pi recognizes them and auto-compacts.
