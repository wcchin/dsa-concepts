# Coverage and extensions

Topics **1–13 and 16** now contain developed core reading material. [Topic 14](topics/strategies/strategies.md) and [Topic 15](topics/strings/strings.md) add optional algorithm-design and string-search material beyond the lecture inventory. [Topic 16](topics/applications/applications.md) supplies a developed transport-network application. “Developed” means explanatory reading and worked examples, not exhaustive coverage of every variant.

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

Topic 5 now aligns eleven readings around explicit operation contracts, representation invariants, traces, implementation choices, time/space and self-checks. Sequence and deque adapters have complete interfaces; queue implementations share FIFO operations and size queries. Linked positional List classes and custom circular/doubly linked Deque classes remain conceptual alternatives to the included adapters.

Topic 6 now aligns Map/Set contracts, returns, absent-key policies, snapshots, set combinations, hashing invariants, complete chaining/probing update helpers and table rebuilding. Python adapters delegate storage management; low-level helpers do not implement automatic count tracking or resize thresholds. Fourteen original open self-checks support the readings.

Topics 11–13 now align graph operations/traversals, the fixed-universe disjoint-set interface and graph algorithms. Simple unweighted graph construction/query/update helpers preserve list-based traversal contracts; union–find adds element/empty/component-count/component-size observers. Algorithm contracts distinguish outputs, errors, ties, input mutation and code dependencies; cost tables separate working state and returned data. Nineteen readings contain 38 explained self-checks. Directed SCC/cycle-witness algorithms, negative-cycle route algorithms and dynamic/rollback disjoint sets remain extensions.

## Topic 2 analysis alignment — 23 October 2026

Five readings now align operation contracts, input size/cost models, exact counts and growth, cases versus bounds, expected versus amortised guarantees, working/output/peak space and correctness/termination evidence. A complete linear-search invariant/progress argument connects to its existing comparison counter. Ten original open prediction checks have collapsed explanations. Existing Python functions, explicit labels, formulas, worked traces and three SVG figures are retained. No notebook, rubric, solution or assessment source was consulted.

The agreed remaining editorial order is Topic 3, then Topic 1, followed by Topics 14, 15 and 16.

## Topic 3 recursion alignment — 23 October 2026

Five readings align recursive/iterative sum and trace contracts, merge versus sort preconditions, base/progress/correctness arguments, exact depth and sort-call counts, peak frame/list/output storage and implementation choices. Adds ten original open prediction checks with collapsed explanations. The eight SVGs, existing Python listings, original headings/labels and worked traces are retained. Alternatives such as bottom-up/range-buffer merging remain clearly described comparisons rather than extra supplied implementations. No notebook, rubric, solution or assessment source was consulted.

The remaining agreed order is Topic 1, then Topics 14, 15 and 16.

## Topic 1 foundations alignment — 23 October 2026

Five readings now align problem/first-search contracts; names, slots, attributes and reference identity; mutation, copy ownership and returned values; built-in collection choices; validated class states and linked traversal; and the brief ADT introduction. Adds ten open prediction checks with collapsed explanations, preserving the original code, headings/labels and three SVG figures. Cost discussion stays introductory and links to Topic 2 rather than requiring asymptotic notation in the opening topic. Full ADT implementations remain with their respective topics. No notebook, rubric, solution or assessment source was consulted.

Topics 1–13 now have the agreed reading structure. The remaining alignment order is Topics 14, 15 and 16.

## Topics 14–15 alignment — 23 October 2026

Six strategy readings and eight string readings now align goals/prerequisites, problem/query contracts, returned results and boundary errors, state/invariant/progress reasoning, implementation choices and costs. Adds 28 original open prediction checks with collapsed explanations. Trie adds len/is_empty observers while retaining its size field, original mutation returns and existing algorithms. The four strategy and nine string SVG figures, original function/method bodies, URLs and labels remain. No notebook, rubric, solution or assessment source was consulted.

Topics 1–15 now have the agreed reading structure. Topic 16, integrated applications, is the remaining alignment task.
