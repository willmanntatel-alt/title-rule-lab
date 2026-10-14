# Title Rule Lab

A new, original multilingual text checking proof of concept prepared for Devpost's Build With AI: Basics. Paste a title, enter the real numerical limit and measurement unit, see all four counts, inspect overflow, edit the wording yourself, and export a review JSON record. Demonstration limits are explicitly illustrative and are not marketplace policies.

## Run

Node.js 24 or later and a modern desktop browser with Intl.Segmenter. No installed packages, API keys, remote services or account are required to run the app.

```sh
node server.mjs
```

Open http://127.0.0.1:5034. The server intentionally binds only to this loopback address. It serves an explicit allowlist and a bounded JSON attachment endpoint. Measurement happens in the browser; exporting sends the already-generated JSON only to the local server, without storing it. There are no analytics or external network requests. Input disappears on refresh.

## Try the complete journey

1. Choose **Emoji family**. This loads the illustrative title `Cup 👨‍👩‍👧‍👦` and a made-up limit of 12 code points.
2. The result is within the entered rule: 11 code points, but 15 UTF-16 units, 29 UTF-8 bytes and 5 displayed characters.
3. Change the measurement to **UTF-16 units**. The unchanged title is over by 3 units. The whole family emoji is highlighted; it is not split into fragments.
4. Edit the title manually or change the rule after checking its actual source. The app does not rewrite, translate or remove product facts.
5. Prepare review JSON, inspect the record and download it. Changing any input immediately invalidates the old export.
6. **Thai text** shows `แก้วน้ำ`: 7 code points, 7 UTF-16 units, 21 UTF-8 bytes and 4 displayed characters in the tested runtime.

## Measurements and limits

- Code points use string iteration; UTF-16 uses JavaScript string length; UTF-8 uses TextEncoder; displayed characters use Intl.Segmenter grapheme clusters.
- Text is not Unicode-normalized by the app. HTML text areas normalize pasted line endings to LF; the export preserves the current editor value.
- Grapheme segmentation follows the browser's Unicode implementation and may differ between runtime versions. TextEncoder replaces isolated surrogate code units with U+FFFD when counting bytes.
- Overflow shading marks whole graphemes intersecting or following the first excess unit. Exact totals still use the chosen measurement, so shading is not a promise of an exact truncation boundary.
- A rule result does not establish platform compliance, factual accuracy, translation quality or product eligibility. No platform policies are fetched or assumed.
- No user study, measured productivity gain or marketplace approval is claimed.

## Validation

```sh
node --test measurement.test.mjs
```

Eleven tests cover supplementary emoji, Chinese bytes, Thai combining marks, decomposed accents, whole emoji-family overflow, changed rule outcomes, exact boundaries, CRLF in the pure logic, invalid rules, blank titles and literal HTML in exported text. Browser checks separately exercised switching units, manual editing, invalid-input export prevention, stale-export clearing, safe text rendering and matching exported bytes. These are functional checks, not an accessibility certification.

## Planning and AI disclosure

New application source was written during the event's submission period on 2026-10-14, from a fresh project folder. No previous application code or contestant project was incorporated. The official Devpost Learn Skill Pack was used locally as a planning/build scaffold from https://github.com/challengepost/learn-ai-basics at commit `a0f065781873e8a7ed9a9a705a8dafa6a0810439`.

`devpost/scope.md`, `prd.md`, `spec.md` and `checklist.md` record the proposal, behavior, implementation and real checks. Product direction, application code, documentation and original CSS identity were substantially AI-assisted under a human's instruction to select and complete a task. Human review and learner-authored submission/exit survey answers are tracked separately; they are not inferred from automated tests. The personal learner profile and curriculum installation are excluded from publication.

An offline source guide is provided at `devpost/app-map.html`. With the local server running, open http://127.0.0.1:5034/devpost/app-map.html.

MIT license. The project and its submission status are separate: source readiness does not mean a contest entry has been submitted or awarded.
