---
doc: spec
status: draft
---
# Title Rule Lab — Technical Spec

## How This Works, In Plain Language
The page counts the text four ways on the same computer. A small rule checker compares the selected count with a limit the reviewer enters. The preview groups displayed characters together before shading overflow. A review record is built from the current inputs and can be downloaded through a local attachment endpoint. Nothing is sent to a remote service or saved between visits.

## The Core Journey Through the System
Implements `prd.md > The Core Journey`: form input → pure measurement/check functions → text-only result rendering → current-input JSON export. Input events invalidate the previous export.

## Stack
Agent-proposed: original HTML, CSS and JavaScript ES modules, without frameworks or installed application packages. Modern browser with Intl.Segmenter and TextEncoder. Node.js 24+ is used only for a local static server and built-in tests. These choices keep the task free of new API credentials and paid services.

## Where It Runs and How Someone Tries It
Run `node server.mjs` and open http://127.0.0.1:5034. Browser refresh discards unsaved text. A public source repository and a genuine 1–3 minute working demonstration are required for the event; deployment is optional.

## Look and Feel
Implements `prd.md > Look and Feel` with system fonts and original CSS. Native accessible form controls, responsive one/two-column layout, strong text contrast and no decorative animations.

## Components
### measurement.mjs
Pure `measure`, `parseRule`, `analyze` and `buildReport` functions. Grapheme boundaries use Intl.Segmenter('und', {granularity:'grapheme'}). Code points use string iteration, UTF-16 uses string length and UTF-8 uses TextEncoder. Measurement unit names are a closed allowlist. Limits are positive safe integers capped at 1,000,000.
### app.mjs
Bind input changes, render counts/states with textContent, create each preview span from whole graphemes, invalidate exports, and produce a local attachment link plus a visible JSON record. Demonstrations are clearly labelled illustrative text/rules.
### server.mjs
Read-only server bound to 127.0.0.1:5034 with an explicit static file allowlist and bounded /export?report= attachment route. The route returns the exact generated UTF-8 JSON bytes without storing them. No directory serving, credential handling, remote requests or persistence.

## Data Model
In-memory form: title, unit, limit and optional reference. Derived counts/status are recreated from it. An export captures those exact current inputs and a collection timestamp. No browser storage or database.

## File Structure
```
title-rule-lab/
  index.html       workbench and definitions
  styles.css       original visual styling
  measurement.mjs  pure Unicode and rule logic
  app.mjs          browser interactions and export
  server.mjs       loopback static preview
  measurement.test.mjs  meaningful Unicode/invalid-rule tests
  README.md, LICENSE, .gitignore
  devpost/scope.md, prd.md, spec.md, checklist.md, app-map.html
```

## External Services and Dependencies
No application network requests or APIs. Skill Pack used locally from official challengepost/learn-ai-basics at a0f065781873e8a7ed9a9a705a8dafa6a0810439; curriculum files and personal learner-profile are excluded from publication. No old application code is incorporated.

## Important Failure Modes
- Intl.Segmenter unavailable → explain compatible browser requirement and disable rule checks.
- Rule invalid → render an explicit error and disable export.
- User changes input after generating output → remove the old download URL and JSON immediately.

## What Was Simplified and Why
Human-supplied policy definitions replace live marketplace policy integrations, so no undocumented platform rule is treated as true. Manual editing replaces rewriting, so the app does not remove factual product details on a seller's behalf.

## Decisions and Open Issues
No learner technical uncertainty was established. A technical investigation confirmed that `A💧` is 2 code points, 3 UTF-16 units, 5 UTF-8 bytes and 2 graphemes; `แก้วน้ำ` is 7 code points and 4 graphemes in the current runtime. Browser/Node Intl versions can affect complex segmentation and will be disclosed. Proposal approval and actual learner feedback remain pending.

## Revisions
- Browser verification showed that textarea normalizes CRLF to LF. The report now states this explicitly; it preserves the current editor value, rather than promising raw clipboard line-ending preservation.
- The browser tool did not return a receipt for a data-URL download. Export now uses a bounded loopback HTTP attachment route; measurement still happens in the browser. This gives the same visible JSON and download bytes without external data transfer.
