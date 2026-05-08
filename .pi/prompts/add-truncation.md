Add per-result truncation and temp file persistence to `synthetic_web_search`.

## Problem

The `synthetic_web_search` tool concatenates all result snippets into a single string and returns the whole thing to the LLM context. When multiple searches run in parallel or results have long `text` fields, this bloats context and can hit the built-in read/bash tool limits (2000 lines / 50KB). There is no way for the agent to access the full content of a truncated result.

## What to do

1. In `src/extensions/web-search/tool.ts`, import truncation utilities from `@mariozechner/pi-coding-agent`:
   ```ts
   import {
     DEFAULT_MAX_BYTES,
     DEFAULT_MAX_LINES,
     formatSize,
     truncateHead,
   } from "@mariozechner/pi-coding-agent";
   ```
   Also import Node.js temp file helpers:
   ```ts
   import { randomBytes } from "node:crypto";
   import { writeFile } from "node:fs/promises";
   import { tmpdir } from "node:os";
   import { join } from "node:path";
   ```

2. Add a helper function `writePerResultPreview` that:
   - Takes a single result's `text` string and a slug (for the temp file name).
   - Calls `truncateHead(text, { maxLines, maxBytes })` on it. Use `DEFAULT_MAX_LINES` and `DEFAULT_MAX_BYTES` as defaults.
   - If truncated, writes the full `text` to a temp file at `join(tmpdir(), "pi-synthetic-search-${slug}-${randomBytes(4).toString('hex')}.md")`.
   - Returns an object: `{ preview: string, tempFilePath?: string, truncated: boolean, totalLines: number, totalBytes: number }`.
   - If truncated, appends to the preview: `\n\n[Result truncated: ${outputLines} of ${totalLines} lines (${formatSize(outputBytes)} of ${formatSize(totalBytes)}). Full result: ${tempFilePath}]`

3. In the `execute` function, instead of concatenating all results into one `content` string, process each result individually:
   - Call `writePerResultPreview` on each result's `text` field.
   - Build the content string using each result's `preview` (which may be truncated).
   - Collect `tempFilePath` info per result.

4. Update `WebSearchDetails` to include per-result truncation metadata:
   ```ts
   interface WebSearchResultDetails {
     title: string;
     url: string;
     published: string;
     truncated: boolean;
     tempFilePath?: string;
     totalLines: number;
     totalBytes: number;
   }
   interface WebSearchDetails {
     results?: WebSearchResultDetails[];
     query?: string;
   }
   ```

5. Update `renderResult` to show truncation indicators per result when expanded. When a result was truncated, show a line like `Result truncated. Full content: /tmp/pi-synthetic-search-xxx.md` after the snippet, using `theme.fg("warning", ...)`.

## Reference

The `linkup_web_fetch` tool in `~/code/src/pi.dev/pi-linkup/src/extensions/web-fetch/tool.ts` already uses `truncateHead` + temp file writing. The `writeTempFilePreview` utility in `~/code/src/pi.dev/pi-harness/tools/read-url/utils/temp-file-preview.ts` is a similar pattern.

The truncation API from `@mariozechner/pi-coding-agent`:
- `truncateHead(content, { maxLines?, maxBytes? })` returns `TruncationResult` with fields: `content`, `truncated`, `truncatedBy`, `totalLines`, `totalBytes`, `outputLines`, `outputBytes`, `firstLineExceedsLimit`.
- `truncateTail(content, { maxLines?, maxBytes? })` same but keeps the tail (useful for bash-like output).
- `DEFAULT_MAX_LINES` = 2000, `DEFAULT_MAX_BYTES` = 50KB.
- `formatSize(bytes)` formats as human-readable (e.g. "12.3KB").
