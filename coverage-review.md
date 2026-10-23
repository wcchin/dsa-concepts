# Coverage and extensions

Topics **1–13 and 16** contain developed core reading material. [Topic 14](topics/strategies/strategies.md) and [Topic 15](topics/strings/strings.md) add optional algorithm-design and string-search material beyond the lecture inventory. [Topic 16](topics/applications/applications.md) supplies a developed transport-network application. “Developed” means explanatory reading and worked examples, not exhaustive coverage of every variant.

## Gaps addressed in the coherence review

| Previously thin or missing connection | Added explanation |
|---|---|
| General correctness method dispersed across examples | [Contracts, loop invariants, termination, induction and tests](topics/analysis/correctness.md) |
| Binary search found some match but not duplicate-run boundaries | [Lower bound, upper bound and monotone boundary search](topics/searching/search-boundaries.md) |
| BSTs were compared with hashing for ranges without a worked range operation | [BST range reporting and output-sensitive costs](topics/searching/bst-range-queries.md) |
| Graph algorithm names could obscure their objectives | [Shortest-path trees versus MSTs](topics/graph-algorithms/graph-algorithm-choices.md) |
| Kruskal appeared before its union–find prerequisite | [Sequential graph reading route](reading-guide.md), with union–find before graph algorithms, and cross-links |
| String-specific keys and pattern matching were missing | [Trie operations, prefix queries, substring baselines, KMP and verified rolling hashes](topics/strings/strings.md) |
| Spatial search covered only k-d trees | [Point quadtrees, PR quadtrees and R-tree filtering](topics/kd-trees/kd-trees.md) reuse shared points and explicit boundary contracts |
| Core algorithms lacked one integrated worked case | [Transport data, hop/time routes, connectivity and construction](topics/applications/applications.md) |
| Broader design strategies were absent | [Greedy choice, DP, backtracking, sequence patterns and complexity limits](topics/strategies/strategies.md) |

## Material still covered conceptually rather than as full implementations

| Existing topic | Current boundary |
|---|---|
| Hash tables | Chaining/probing lookup, insertion, replacement, deletion and rebuilding have code. The public Map/Set adapters delegate storage management to Python; a custom resizable map class with automatic counts and thresholds remains an extension. |
| Linear structures | Doubly linked updates are explained; a full doubly linked deque class is not supplied. |
| Trees | All three traversals, extremes, strict successor/predecessor, closed ranges and a shared BST/AVL ordered-set adapter have code. Rank/select augmentation, a key–value ordered map and a static middle-key builder are not implemented. |
| Heaps | Stable min/max record queues, numeric heap operations, bottom-up construction and heapsort have code; lazy graph candidates are developed later. Indexed priority changes and arbitrary-item removal remain conceptual extensions to these queue classes. |
| Spatial search | K-d, point-quadtree and PR construction/exact/range/nearest/deletion have code; R-tree exact/range/nearest queries operate on a given tree. Dynamic R-tree insertion/splitting and deletion condensation have worked algorithm traces, not update code. Static k-d median construction and R-tree packing remain conceptual. |
| Algorithm design | DP has one complete optimisation problem; weighted interval scheduling, knapsack and sequence DP remain further examples to add. |
| Strings | Trie updates/prefix queries and three all-match substring algorithms have code. Ranked autocomplete, compressed tries, approximate matches, Aho–Corasick and suffix indexes remain extensions. |

These are named scope boundaries, not claims that the implemented algorithms require these variants to be correct.

## Recommended additions beyond the syllabus

The priorities below are editorial recommendations for this book's audience, rather than a claim that every DSA course uses the same scope.

| Priority | Missing concept or family | Suggested home and reason |
|---|---|---|
| High | **Negative-edge shortest paths and directed structure:** Bellman–Ford, reachable negative cycles, directed DFS cycle detection, strongly connected components | Extend Topics 11 and 13 with separate pages. Current functions deliberately stop short of those problems. |
| High | **Selection and non-comparison sorting:** quickselect, counting/radix sorting with key-domain assumptions | Extend Topic 4. Counting sort currently illustrates the lower-bound model without a full implementation. |
| High | **More DP examples:** 0/1 knapsack, longest common subsequence, weighted interval scheduling | Expand Topic 14. They teach item availability, two-dimensional state and greedy failure beyond coin change. |
| Medium | **Advanced string indexes and matching:** compressed tries, edit distance, multiple-pattern automata and suffix indexes | Extend Topic 15 with separate pages when the workload warrants them. The basic trie and single-pattern search foundation is now developed. |
| Medium | **Dynamic range queries:** Fenwick and segment trees | A separate topic if developed fully; contrast with the static prefix sums now in Topic 14. |
| Medium | **Randomisation and hashing guarantees:** random pivots, expected analysis, universal hashing | Expand Topics 2, 4 and 6; those concepts are currently introductory and assumption-focused. |
| Medium | **Ordered-tree alternatives and storage:** red–black trees, B/B+ trees and external-memory costs | A separate advanced extension, with an overview linked from Topic 8. AVL already covers the core balancing idea. |
| Later | **Advanced graph problems:** all-pairs routes, max flow, matching, articulation points and bridges | Separate advanced graph pages or a new topic. These would greatly expand the present course scope. |

Union–find remains Topic 12. Unrelated additions should not be collected under that title; substantial families receive their own topic, while smaller variants stay beside their prerequisite concepts.

The extension choices were cross-checked against the [MIT 6.006 course description](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/syllabus/) and [Princeton's strings chapter](https://algs4.cs.princeton.edu/50strings/). These references inform breadth, not this course's assessment requirements.

Sorting now has a dedicated merge-sort reading and a short Timsort/Powersort explanation. Elementary listings remain complete direct-comparison algorithms; general `key`/`reverse` options belong to the built-in interface examples. Full Timsort, Powersort power calculations and galloping implementations remain outside this introductory treatment.

## Current edition and next work

All sixteen topics have the self-reading structure described in the [reading guide](reading-guide.md): goals/prerequisites, worked reasoning, explicit contracts and costs, misconception reminders and explained checks. Use the reading routes and suggested study blocks to work through concepts at a pace that leaves time for diagrams, traces and checks. Conceptual-only implementations in the tables above remain deliberate scope boundaries.

All 155 existing code panels now offer Python/JavaScript/Julia tabs across the sixteen topics. Python remains the reference for explanations and diagrams; the [language guide](code-languages.md) explains conventions and provides complete topic downloads. Tracing-oriented interactive checks and selected content extensions remain planned. More applications could develop dependency scheduling or a spatial service directory.
