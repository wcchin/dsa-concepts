# Current coverage and validation audit

Updated 23 October 2026. This is the current audit summary. Earlier dated counts and implementation records are preserved in the [development archive](archive/development-history-2026-10-23.md); do not interpret its older pending-work statements as current tasks.

## Current book

- Sixteen developed topics, 120 reading pages, sixteen overviews and six front-matter pages: 142 navigation pages.
- Two goals, a prerequisite/context cue, a misconception reminder and two explained open checks per reading: 240 feedback panels.
- 155 three-language code panels (465 listings), across 92 code-bearing readings. All sixteen topics have JavaScript/Julia downloads (32 files), alongside the existing Python spatial/transport and three-language binary-search examples.
- All sixteen topics have completed the agreed structure alignment. Topics 14–15 remain optional extensions; Topic 16 is an integrated application.

The [whole-book editorial review](editorial-review.md) records findings and fixes for every topic. The [public coverage review](../coverage-review.md) distinguishes developed content, conceptual-only variants and future extensions. The [current status](status.md) is the single task checklist. This audit makes no claim of exhaustive DSA coverage or equal learning effort per page.

## Validation for the editorial revision (8bdddd7)

- Jupyter Book 2.1.7 builds all 141 navigation pages successfully.
- All 154 embedded Python listings compile. Every pre-existing topical code fence, executable Python example, SVG and stylesheet is byte-for-byte unchanged, as are myst.yml and its navigation.
- The 120 readings retain all original section headings and explicit concept labels. Each still has two goals, prerequisite/context cues, a misconception reminder and two feedback panels.
- All 240 rendered explanation panels are present and closed by default. Licensing notices remain present on every reading.
- All 7,746 rendered local link occurrences resolve, including 2,365 fragments; repeated navigation links are included in these counts.
- 3,505 source/structure assertions pass, covering preservation, compilation, scaffolding, reading-order continuations, prerequisite ordering, 2,113 repository-local Markdown destinations and stale-task removal. The historical lecture-heading inventory is retained verbatim.

Algorithms did not change, so this pass relies on exact source preservation and the previously archived semantic checks rather than claiming new algorithm implementations or repeating their full test suites. Desktop/narrow-screen visual redesign and measured student reading times were not part of this editorial pass.

## Book-wide language-tab validation — 23 October 2026

The pilot has expanded to every existing code panel. See the [authoring record](language-tabs.md) and [student guide](../code-languages.md). Python remains canonical and its original 155 listings are retained, alongside all diagrams, labels and 240 feedback panels. Native mouse/touch selection is retained; custom keyboard-navigation work is outside the agreed scope.

- 130,592 behavioural assertions pass across sixteen JavaScript and sixteen Julia topic programs. Fixtures include exhaustive short sorting arrays, all four-vertex simple graphs, brute-force minimum spanning forests, Unicode matching with deliberate rolling-hash collisions, and repeated spatial insert/delete/query comparisons with scan oracles.
- The separate binary-search suite passes 5,562 cases per language (Python, JavaScript and Julia), including matching results and unchanged input arrays.
- All 155 panels contain the three languages; all 155 Python listings compile. Their bodies, original SVG files, explicit concept labels and self-check explanations are preserved.
- Jupyter Book 2.1.7 builds all 142 navigation pages. All 240 explanation panels render closed; all 155 tab sets render. All 8,256 rendered local link occurrences resolve, including 2,373 fragments and all 32 new topic downloads.
- Chromium checks pass on eleven representative pages at widths 1280, 320, 390 and 768 pixels: 44 page/viewport checks and 76 tab-group instances. Clicking or tapping the last panel synchronises every panel on that page to JavaScript, Julia and Python. Tab containers fit the viewport, and no page-script errors occur. Desktop and mobile code panels were visually inspected.
- Runtime versions: Python 3.12.14, Node 24.19.0, Julia 1.10.10. CI uses Node 22 and repeats both language checkers; downloads are generated from Markdown and checked for drift.
