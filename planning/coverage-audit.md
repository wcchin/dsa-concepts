# Coherence and coverage audit — 21 October 2026

Scope: all topic overviews and reading pages, concept destinations, shared contracts, code dependencies, examples and complexity conventions. Core lecture basis remains the original lecture Markdown; no notebook, rubric, solution or assessment file was consulted.

## Topic-by-topic findings

| Topic | Coherent role and retained coverage | Finding / action |
|---|---|---|
| 1 Foundations | Objects, identity, mutation, copying, collection choices, classes and invariants | Sound prerequisite for every reference diagram. Basic Python syntax is assumed explicitly; this is not a first programming course. |
| 2 Analysis | Input size, word model, cases, bounds, growth, time and peak/output space | Added a reusable correctness page. Kept probability separate from amortisation and input magnitude separate from bit length. |
| 3 Recursion | Calls/returns, stack depth, divide/combine, recurrences, merge implementation costs | Removed stale planned-topic wording. General recurrence methods remain optional; existing analysis uses explicit level sums. |
| 4 Sorting | Insertion, bubble, merge links, partition, quicksort, stability, space and comparison lower bound | Heap sorting now linked. Selection and actual counting/radix implementations remain a prioritised extension. |
| 5 Linear structures | ADTs, stacks, queues/deques, arrays, resizing, singly/doubly linked concepts, circular and linked queues | Preserves observer/mutator distinction at the logical level, compatible with compressing union–find queries. Full linked deque is still conceptual. |
| 6 Maps/sets/hashing | Behaviour versus hashing, equality/hash contract, chaining, tombstones, load, expected/amortised cost | Corrected stale prerequisite/status links. Complete resizable probing-map implementation remains absent, although insertion rules are explained. |
| 7 Search/BST | Search intervals, ancestor bounds, insertion, traversal, deletion and height costs | Added boundary search and BST ranges. Distinct-key contract and successor-child retention remain explicit. |
| 8 AVL | Edge heights, balance factors, transferred subtrees, all rotation cases and full insert/delete | Cached heights and returned roots are consistent. Broader tree families are optional, not missing from the stated AVL scope. |
| 9 Heaps | Complete shape, heap order, indices, repairs, linear build, ties, heapsort | Provides the heap prerequisite for Topic 11. Indexed updates remain an extension; lazy candidates now have a full graph example. |
| 10 Graphs | Model, representations, BFS, DFS, components, trace order and cost assumptions | Maintains directed/undirected distinction. Directed cycle and SCC implementations are still absent and are listed as high-priority extensions. |
| 11 Graph algorithms | Kahn, relaxation, Dijkstra, DAG routes, MST proofs, Prim/Kruskal and forests | Newly completed; separates the three objectives, handles isolated vertices, and links to Topic 13 before Kruskal. |
| 12 K-d trees | Axis/tie rules, inherited regions, exact/range/nearest queries and limitations | A side branch from Topic 7. Median ties and AVL-rotation incompatibility are explicit; static builder/deletion remain conceptual. |
| 13 Union–find | Partitions, parent forests, weighted union, compression, amortisation and connectivity limits | Newly completed. Parent links are not graph edges; ordinary deletion and directed reachability are not supported. |
| 14 Applications | Reserved integrated application space | Still a plan, explicitly labelled. Candidate cases link to developed concepts without pretending to be completed case studies. |
| 15 Strategies | Greedy proof, DP state/reconstruction, backtracking, prefix sums, two pointers, windows and tractability | Added as a clearly marked extension beyond the lecture inventory, rather than overloading union–find. |

## Structural changes

- Retained existing topic numbers and URLs. Added a reading guide instead of silently renumbering the book.
- Graph route explicitly reads union–find before Kruskal; k-d trees remain independent of the graph optimisation sequence.
- New small gaps are filled in their existing topics. Larger design material has its own Topic 15; Topic 14 retains its application purpose.
- Public coverage review lists remaining conceptual-only material and a prioritised beyond-syllabus roadmap. No unfinished extension is described as implemented.
- Per-function conventions remain explicit: BST distinct keys; coordinate ties right in k-d trees; stable heap ties via counters; edge-height −1 for empty binary subtrees; output and recursion storage stated separately where useful.

## Follow-up priorities

1. Review the new explanations for teaching emphasis, especially the optional Topic 15.
2. Develop a separate strings/tries topic next if broadening the DSA wiki further.
3. Add Bellman–Ford and directed SCC/cycle pages, then selection/non-comparison sorting.
4. Expand DP with contrasting state models before adding specialised range trees or advanced graph algorithms.

The public [coverage review](../coverage-review.md) contains the detailed missing-item list. This audit records editorial judgement; it is not a claim of exhaustive coverage of the DSA field.

## Validation for this pass

- Compiled all 105 Python listings across the book.
- Ran 32,363 semantic and structural checks for the new and expanded examples, including exhaustive tiny digraphs, independent shortest-path answers, brute-force minimum forests/schedules/subsets, partition invariants, DP answers, range queries and sequence patterns.
- Rendered and visually inspected all 19 new accessible SVG figures and checked their trace values against the listings.
- Built all 105 navigation pages with Jupyter Book 2.1.7; checked 1,251 local links, including 766 section links, against generated HTML with no broken destinations.

These checks complement the reasoning in each reading; they do not establish correctness for every possible input. Earlier topics' Python listings were syntax-checked in this pass; the semantic checks above focus on the newly added algorithms.
