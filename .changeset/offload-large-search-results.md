---
"@aliou/pi-synthetic": patch
---

Offload large web search results to temp files instead of including truncated previews inline. Results exceeding 1000 lines or 25KB are saved to temp files and referenced with a brief pointer, reducing LLM context usage. Short results remain inline.
