# Current coverage and validation audit

Updated 23 October 2026. This is the current audit summary. Earlier dated counts and implementation records are preserved in the [development archive](archive/development-history-2026-10-23.md); do not interpret its older pending-work statements as current tasks.

## Current book

- Sixteen developed topics, 120 reading pages, sixteen overviews and five front-matter pages: 141 navigation pages.
- Two goals, a prerequisite/context cue, a misconception reminder and two explained open checks per reading: 240 feedback panels.
- 154 embedded Python listings, with ordinary code examples and standalone spatial/transport scripts.
- All sixteen topics have completed the agreed structure alignment. Topics 14–15 remain optional extensions; Topic 16 is an integrated application.

The [whole-book editorial review](editorial-review.md) records findings and fixes for every topic. The [public coverage review](../coverage-review.md) distinguishes developed content, conceptual-only variants and future extensions. The [current status](status.md) is the single task checklist. This audit makes no claim of exhaustive DSA coverage or equal learning effort per page.

## Validation for the editorial revision

- Jupyter Book 2.1.7 builds all 141 navigation pages successfully.
- All 154 embedded Python listings compile. Every pre-existing topical code fence, executable Python example, SVG and stylesheet is byte-for-byte unchanged, as are myst.yml and its navigation.
- The 120 readings retain all original section headings and explicit concept labels. Each still has two goals, prerequisite/context cues, a misconception reminder and two feedback panels.
- All 240 rendered explanation panels are present and closed by default. Licensing notices remain present on every reading.
- All 7,746 rendered local link occurrences resolve, including 2,365 fragments; repeated navigation links are included in these counts.
- 3,505 source/structure assertions pass, covering preservation, compilation, scaffolding, reading-order continuations, prerequisite ordering, 2,113 repository-local Markdown destinations and stale-task removal. The historical lecture-heading inventory is retained verbatim.

Algorithms did not change, so this pass relies on exact source preservation and the previously archived semantic checks rather than claiming new algorithm implementations or repeating their full test suites. Desktop/narrow-screen visual redesign and measured student reading times were not part of this editorial pass.
