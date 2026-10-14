---
doc: prd
status: draft
---
# Title Rule Lab — Product Requirements

Source: `scope.md > The Core Loop` and `The Unique Kernel`. This is a proposal prepared under delegated task selection, awaiting the user's review.

## The Core Journey
1. Open a local page with an empty editor, an unset limit and brief definitions.
2. Paste a title or load an explicitly labelled demonstration.
3. Enter a positive integer limit and choose the rule's unit. The app does not preselect any marketplace policy.
4. See all four counts, the selected-rule result, and the whole displayed characters that intersect or follow the first unit beyond the limit.
5. Edit the original yourself. No normalization, truncation or automatic rewrite happens.
6. Generate a review record, inspect its JSON and download that same record.

## Screens and Layout
One responsive workbench. Left: title editor, demonstration controls and rule inputs. Right: four numerical counts, selected-rule result, overflow preview and export. Definitions and limits are available below the core workbench.

## Look and Feel
Agent-proposed editorial styling: readable system fonts, cream background, black text and orange rule marker. Textual states accompany colors, form controls have labels, focus is visible, and reduced motion is respected. No third-party visual assets.

## Features and Behavior
### Counting
Show counts for code points, UTF-16 units, UTF-8 bytes and grapheme clusters. A decomposed accent stays decomposed; whitespace and line endings are counted as entered.

### Rule Result
Reject empty, zero, negative, fractional or oversized limits. An empty title is not a successful check. Changing unit or limit updates the result without changing the text.

### Overflow Preview
Never split a grapheme for visual marking. If the first excess unit falls inside a grapheme, mark that whole grapheme and explain the boundary. Keep exact selected-unit totals separate from shading.

### Review Record
For valid title/rule input, expose JSON containing schema version, original title, four counts, rule unit/limit/reference, comparison outcome and limitations. Refresh or invalidate generated output whenever input changes, so old results cannot be downloaded as current.

## States and Boundaries
- Empty input: prompt for a title.
- Unset or invalid limit: keep counts visible, explain the rule input and disable export.
- Unsupported grapheme segmenter: show an explicit browser-compatibility error; never silently substitute code points.
- No persistence: closing or reloading loses entered text; no analytics or network calls are made by the app.
- Content is rendered as text. HTML in a title is not executable markup.

## Product Decisions
The user delegated selecting and completing a task. All product, visual and technical specifics here are agent proposals, not attributed personal preferences or interview answers.

## What We're Building
The one complete journey above, with deterministic Unicode examples, real browser verification, and an export that preserves the exact title.

## Deferred From the POC
No batch processing, live platform validation, AI text generation, translation, saved histories or hosted accounts.

## Open Questions
Human review and any requested changes remain pending. Personal benefit/learning statements and submission survey answers must come from the participant rather than being invented.
