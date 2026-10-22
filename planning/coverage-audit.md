# Coherence and coverage audit — updated 22 October 2026

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
| 12 Spatial search | K-d core; point quadtrees; PR midpoints/buckets; R-tree enclosures and exact refinement | Expanded in the agreed sequence with shared point queries, explicit boundary ownership, stopping limits, given-tree R-tree scope and a runnable example. Existing k-d-tree URLs are retained. |
| 13 Union–find | Partitions, parent forests, weighted union, compression, amortisation and connectivity limits | Newly completed. Parent links are not graph edges; ordinary deletion and directed reachability are not supported. |
| 14 Applications | Developed fictional transport network integrating data representations, BFS, Dijkstra, union–find and MSTs | Separates travel from construction weights, keeps isolated vertices, compares objectives and includes a runnable script. Other applications remain future candidates. |
| 15 Strategies | Greedy proof, DP state/reconstruction, backtracking, prefix sums, two pointers, windows and tractability | Added as a clearly marked extension beyond the lecture inventory, rather than overloading union–find. |
| 16 Strings | String units and contracts, trie updates/prefix queries, naive/KMP/rolling search | Added optional extension with exact verification, empty/overlap cases and output-sensitive accounting. Ranking, approximate and multi-pattern/suffix indexes remain extensions. |

## Structural changes

- Retained existing topic numbers and URLs. Added a reading guide instead of silently renumbering the book.
- Graph route explicitly reads union–find before Kruskal; k-d trees remain independent of the graph optimisation sequence.
- New small gaps are filled in their existing topics. Larger design material has its own Topic 15; Topic 14 retains its application purpose and now has a complete transport case.
- Public coverage review lists remaining conceptual-only material and a prioritised beyond-syllabus roadmap. No unfinished extension is described as implemented.
- Per-function conventions remain explicit: BST distinct keys; coordinate ties right in k-d trees; stable heap ties via counters; edge-height −1 for empty binary subtrees; output and recursion storage stated separately where useful.

## Follow-up priorities

1. Review the new explanations for teaching emphasis, especially the optional Topic 15.
2. Strings/tries are developed in Topic 16. The integrated application is developed in Topic 14; advanced string indexing remains optional.
3. Add Bellman–Ford and directed SCC/cycle pages, then selection/non-comparison sorting.
4. Expand DP with contrasting state models before adding specialised range trees or advanced graph algorithms.

The public [coverage review](../coverage-review.md) contains the detailed missing-item list. This audit records editorial judgement; it is not a claim of exhaustive coverage of the DSA field.

## Validation for the Topics 11/13/15 review

- Compiled all 105 Python listings across the book.
- Ran 32,363 semantic and structural checks for the new and expanded examples, including exhaustive tiny digraphs, independent shortest-path answers, brute-force minimum forests/schedules/subsets, partition invariants, DP answers, range queries and sequence patterns.
- Rendered and visually inspected all 19 new accessible SVG figures and checked their trace values against the listings.
- Built all 105 navigation pages with Jupyter Book 2.1.7; checked 1,251 local links, including 766 section links, against generated HTML with no broken destinations.

These checks complement the reasoning in each reading; they do not establish correctness for every possible input. Earlier topics' Python listings were syntax-checked in this pass; the semantic checks above focus on the newly added algorithms.

## Topic 16 validation — 22 October 2026

- Compiled all 115 Python listings in the expanded book and executed every Topic 16 listing in reading order.
- Ran 54,695 semantic checks: exhaustive small substring cases against direct matching, independently computed pattern borders and rolling residues, Unicode cases, deliberate collisions, and random trie operations against a reference set. Long 5,000-symbol keys also exercise iterative traversal and deletion.
- Rendered and visually inspected all nine accessible SVG figures; every new figure is linked from its reading page.
- Built 114 navigation pages with Jupyter Book 2.1.7. Checked 1,359 local links, including 833 section links, against the built HTML with no broken destinations.

The examples teach exact code-point matching, prefix reporting and one-pattern search. Ranked autocomplete, edit distance, multi-pattern automata and suffix indexes remain explicit extensions rather than completed coverage.

## Topic 14 validation — 22 October 2026

- Executed the standalone standard-library example and all seven code listings in page order. Its reused algorithm definitions match their source-page ASTs.
- Ran 253 case checks, including all-source/target comparisons with independently enumerated simple paths, every incremental connectivity snapshot, reciprocal adjacency checks and neighbour-order changes. Exhaustive candidate-edge subsets identify 55 valid spanning forests; the minimum construction cost is 11.
- Compiled all 122 Python listings across the expanded book. Rendered and visually inspected all five new accessible SVG figures.
- Built all 120 navigation pages with Jupyter Book 2.1.7. Checked 1,429 local links including 872 section links, with no broken destinations. The published downloadable Python asset is byte-identical to the runnable source.
- Recorded a proposed spatial-search expansion in `spatial-search-plan.md`. The current Topic 12 content and its URLs are preserved; quadtrees/R-trees are not yet described as implemented.

## Spatial-search expansion validation — 22 October 2026

- Executed every new listing in reading order and the standalone spatial example. Copied k-d insert/range definitions match the original teaching-source ASTs.
- Ran 200,215 semantic checks: random exact/range comparisons with scans; all 5,040 insertion orders of the shared points; PR record/cell/shape invariants; half-open storage and closed boundary queries; close-point overflow and non-advancing midpoint cases; R-tree enclosures and candidate completeness.
- Independently compared 18,225 segment/rectangle cases with exact rational slab clipping, covering crossings, collinearity, touching and degenerate geometry.
- Compiled all 130 Python listings. Rendered and visually checked all eight new accessible SVG figures, including non-overlapping line labels and paired partition/tree views.
- Built all 127 navigation pages with Jupyter Book 2.1.7. Checked 1,521 local links including 935 section links, with no broken destinations. Both published Python downloads match their source files byte for byte.
- Retained the k-d-tree files, route names and labelled sections. General R-tree insertion/splitting, new-structure nearest traversal, PR deletion/merging and full raster quadtrees remain explicitly outside the implemented scope.

## Topic 12 self-reading pilot — 22 October 2026

- Reviewed all twelve spatial-search readings and added two learning goals, linked prerequisite cues, one misconception reminder and two original prediction/reasoning checks per reading.
- The overview now explains the reading/check sequence, supplies a code-context table and links to the checks by concept. Main conceptual explanations remain visible; only feedback on the checks is collapsed.
- Ran 117 content/structure/example checks, including concrete feedback predictions evaluated against the existing algorithms. Confirmed every Topic 12 Python listing and original explicit concept label is retained; figures and downloadable implementations were not edited.
- Built all 127 navigation pages with Jupyter Book 2.1.7. Checked 1,558 local links including 951 section links with no broken destinations. Inspected generated HTML for all 24 visible prompts and 24 default-closed native details/summary controls with complete feedback.
- All 130 book Python listings compile. This pass does not repeat the earlier full algorithm test suite because executable code is unchanged.
- Pilot review remains the next editorial step before a book-wide rollout. `self-reading-pilot.md` records the reusable pattern and its scope.

## Spatial operation completion (supersedes earlier extension boundaries)

Topic 12 now groups readings under k-d, point-quadtree, PR-quadtree and R-tree methods, preserving existing URLs. Five new readings add complete point-tree deletion and nearest operations, exact/nearest R-tree queries, per-operation time/space tables and self-reading checks. Dynamic R-tree construction/splitting/condensation are worked conceptual algorithms, not implemented updates. No notebook, rubric, solution or assessment source was used.

## Sorting editorial alignment

Nine readings now connect contracts, visual traces, code, correctness, implementation choices, stability, mutation versus auxiliary space, time costs, suitability and open self-checks. Added a merge-sort page reusing the Topic 3 functions and a conceptual Timsort/Powersort page with an original run diagram. Version-specific CPython notes cite its 3.14 design document; Powersort scheduling has an original abstract merge-cost example. Existing routes and labels are retained. Eighteen collapsed-feedback questions cover the readings. No notebooks or assessment materials were used.

## Topic 5 operation alignment

Eleven readings now separate sequence, stack, queue and deque contracts from array, growth, linked and circular implementations. Added strict-index ArraySequence, Queue and Deque adapters, consistent size/len/empty queries, explicit return/error/full policies, operation costs and 22 collapsed-feedback checks. Existing URLs, concept labels and twelve diagrams are retained; historical deque anchors link to the dedicated page. Linked low-level helpers are not presented as a complete positional List class, and underlying library storage is explicitly delegated. No notebooks or assessment materials were used.

## Topic 6 operation alignment

Seven readings align Map/Set contracts, exact results/errors, state invariants, traces, implementation choices, time/space and fourteen collapsed-feedback checks. Added dict/set-backed public adapters, chained deletion, bounded probing insertion/deletion and rebuild helpers. Public put returns None; helper put returns a new-key Boolean; Map removal returns its value while Set removal returns None. Snapshot outputs are shallow, and set combinations create new membership containers. Automatic resize/count policies remain explicit scope boundaries. Existing headings, URLs and the probing-deletion diagram are preserved. No assessment materials were used.

## Topics 7–8 operation alignment

Topic 7 has nine readings; Topic 8 has six. Both align operation/helper contracts, results and errors, representation invariants, preserved traces, code choices, costs and thirty open self-checks. Added complete preorder/postorder, maximum and root-based strict-neighbour queries, a key-only OrderedSet adapter, and an AVL operation route reusing the same readers. Public set removal returns None; extreme extraction returns its key; raw update helpers return roots and raw absent deletion is a no-op. Global count is distinct from subtree rank/select augmentation. All existing pages, labels, algorithms and fourteen figures are retained. No notebooks or assessment sources were used.
