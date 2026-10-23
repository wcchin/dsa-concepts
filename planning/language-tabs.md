# Python/JavaScript/Julia code tabs

All 155 Python code panels across 92 readings and sixteen topics now have parallel JavaScript and Julia tabs. Theory-only pages retain their explanations and diagrams. The [student language guide](../code-languages.md) explains native conventions and links all topic downloads. The original binary-search pilot remains a useful short example.

## Authoring policy

- Keep Python canonical for explanations, diagrams, traces and self-checks. Students need only read their chosen implementation.
- Preserve each algorithm's invariant and input/result/mutation contract. Use native conventions: JavaScript positions begin at zero; Julia vector positions begin at one. Explain absence values, function-style Julia mutation, reference/value equality, Unicode positions and numeric limits.
- Preserve the existing Python bodies, explicit labels, diagrams and self-checks. Conceptual-only implementations remain conceptual in every language.
- Use native MyST `tab-set`/`tab-item` directives with `python`, `javascript` and `julia` sync keys. Python appears first. Do not add a custom selection script.
- Provide complete topic downloads, including dependencies and the documented linked-deque/min-heap helpers where required. Generate downloads from the displayed Markdown, rather than maintaining separate translations by hand.
- Keep native mouse/touch selection on laptops, tablets and phones. Following the author's decision, custom keyboard navigation is outside this rollout. The theme's tab headers are not keyboard-focusable controls; direct source/download links remain available. This does not claim full tab-control accessibility.
- Scoped CSS gives long code lines local horizontal scrolling within their panel.

Syntax reference: [MyST tabs](https://mystmd.org/guide/dropdowns-cards-and-tabs#tabs).

## Maintenance and checks

Run these commands from the repository root, with Python 3.12, Node and Julia on PATH:

```bash
python scripts/build_language_examples.py
python scripts/build_language_examples.py --check
python tests/check_language_tabs.py
python tests/check_binary_search_tabs.py
jupyter-book build --html
```

For a local Julia executable, set `JULIA` for the book-wide checker; the original binary-search checker uses `JULIA_BIN`. No third-party Python, JavaScript or Julia package is required by the code tests. The Check book workflow uses Node 22 and Julia 1.10.10.

The generator emits sixteen JavaScript and sixteen Julia topic files. Shared `support.js`/`support.jl` supply actual linked deque and binary heap operations so queue/heap cost claims do not depend on array shifting or repeated sorting. Independent demonstrations may reuse top-level names; the JavaScript generator changes top-level `let`/`const` declarations to `var` in downloads only. Local declarations and displayed listings remain unchanged.

The behavioural checker executes all 32 topic programs, checks all 155 three-language panel structures and compiles the Python listings. Fixtures cover mutation, empty errors, sorting/stability, collisions/deletion, BST/AVL invariants, graph distances and spanning-forest costs, union–find connectivity, Unicode matching, dynamic programming, spatial queries and updates, and the transport case. Separate binary-search checks retain 5,562 cases per language, with native-index normalisation only in tests.

See [the validation audit](coverage-audit.md) for results. The current progress list is [status.md](status.md).
