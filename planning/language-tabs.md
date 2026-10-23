# Python/JavaScript/Julia tab pilot

Scope: [binary search](../topics/searching/binary-search.md), one reading in Topic 7. The existing Python algorithm, diagram, labels, goals and two self-checks remain. The implementation and usage sections each have three synchronised MyST tabs, with Python first and selected initially.

## Authoring and comparison policy

- Keep conceptual explanations and traces in Python; do not require students to read three languages.
- Preserve the algorithm and invariant across translations. Use native indexing and absence values, then explain their mapping explicitly.
- Keep Python's existing body unchanged. JavaScript uses Number comparisons/strict equality; Julia uses ordinary one-based vectors. Numeric cross-language fixtures use integers within JavaScript's safe range.
- Include empty, singleton, successful/unsuccessful, first/last-position and duplicate cases. Normalise successful Julia positions only in the test protocol, never in the public API.
- Show the same short usage example in each tab. Keep language notes adjacent to the example rather than repeating the explanation three times.
- Use native MyST tab-set/tab-item directives with explicit sync keys python/javascript/julia. No custom browser script or execution service is required. The three downloadable examples mirror the displayed definitions and usage, and the checker rejects drift between them. These are display tabs; the page does not execute submitted code.

Syntax reference: [MyST tabs](https://mystmd.org/guide/dropdowns-cards-and-tabs#tabs). Language references are linked in the reading.

## Reproduce the checks

Run `python tests/check_binary_search_tabs.py` from the repository root with Python 3, Node and Julia on PATH. Alternatively set JULIA_BIN to the Julia executable. The checker reads code directly from the Markdown, executes all three definitions and examples, compares deterministic matching positions under native indexing, uses an independent membership oracle and checks that input arrays are unchanged. Runtime programs and generated fixtures use temporary files; no third-party language package is required.

## Native-theme interaction boundary

The current theme renders tab headers as clickable div elements without focusable tab controls or ARIA tab roles. Browser inspection confirms that ordinary Tab navigation cannot select them. Mouse/touch selection and the language synchronisation work. Keep the visible direct links to all three complete example files so keyboard users can access their code without switching tabs. Improve theme-level keyboard/assistive-technology support before a broad rollout; this pilot does not claim that native tab controls are fully accessible.

Scoped CSS keeps the code blocks within their tab container and gives long lines local horizontal scrolling. No theme bundle is patched, and no custom browser script is added.

## Rollout decision

The pilot is implemented; review its reading experience before expanding. Next candidates are insertion sort (mutation/stability), Stack (empty errors) and then a tree example (references). This order tests distinct translation issues. Do not bulk-translate every listing until return/error conventions, shared tests and code ownership remain manageable.

## Validation

Execution and final browser results are recorded below. The Check book workflow includes a separate language-pilot job using Python 3.12, Node 22 and Julia 1.10.10.

- All three displayed definitions passed 5,562 identical cases each, including exhaustive short sorted arrays with duplicates, empty/singleton inputs, absent/first/last matches, safe-integer endpoints and longer arrays. A separate linear-membership oracle checks Python results; JavaScript/Julia results match after native-index normalisation. Inputs remain unchanged.
- All six displayed listings execute, and the three downloadable files match their corresponding definition/example listings exactly. Local runtimes: Python 3.12.14, Node 24.19.0 and Julia 1.10.10; CI uses Node 22 as in the existing workflow.
- The original Python binary-search body, explicit labels, diagram and two self-checks are retained. All 155 Python listings compile.
- Jupyter Book 2.1.7 builds 141 pages. All 7,752 rendered local link occurrences resolve, including 2,368 fragments; all 240 explanation panels render closed.
- Headless Chromium checks confirm two tab groups, Python initially selected, switching all three languages and synchronisation from either group. Containers fit 320/390/768-pixel viewports, code has local horizontal scrolling, all three source links accept keyboard focus and return the expected files, and no page-script errors occur. Desktop and mobile code blocks were visually inspected. Native tab-header keyboard support remains the documented limitation above.
