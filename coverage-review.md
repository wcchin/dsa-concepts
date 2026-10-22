# Coverage and extensions

Topics **1–14** now contain developed core reading material. [Topic 15](topics/strategies/strategies.md) and [Topic 16](topics/strings/strings.md) add optional algorithm-design and string-search material beyond the lecture inventory. [Topic 14](topics/applications/applications.md) supplies a developed transport-network application. “Developed” means explanatory reading and worked examples, not exhaustive coverage of every variant.

## Gaps addressed in the coherence review

| Previously thin or missing connection | Added explanation |
|---|---|
| General correctness method dispersed across examples | [Contracts, loop invariants, termination, induction and tests](topics/analysis/correctness.md) |
| Binary search found some match but not duplicate-run boundaries | [Lower bound, upper bound and monotone boundary search](topics/searching/search-boundaries.md) |
| BSTs were compared with hashing for ranges without a worked range operation | [BST range reporting and output-sensitive costs](topics/searching/bst-range-queries.md) |
| Graph algorithm names could obscure their objectives | [Shortest-path trees versus MSTs](topics/graph-algorithms/graph-algorithm-choices.md) |
| Kruskal appeared before its union–find prerequisite | [Explicit graph reading route](reading-guide.md) and cross-links |
| String-specific keys and pattern matching were missing | [Trie operations, prefix queries, substring baselines, KMP and verified rolling hashes](topics/strings/strings.md) |
| Spatial search covered only k-d trees | [Point quadtrees, PR quadtrees and R-tree filtering](topics/kd-trees/kd-trees.md) reuse shared points and explicit boundary contracts |
| Core algorithms lacked one integrated worked case | [Transport data, hop/time routes, connectivity and construction](topics/applications/applications.md) |
| Broader design strategies were absent | [Greedy choice, DP, backtracking, sequence patterns and complexity limits](topics/strategies/strategies.md) |

## Material still covered conceptually rather than as full implementations

| Existing topic | Current boundary |
|---|---|
| Hash tables | Probing lookup has code; tombstone insertion and rebuilding are explained by rules and traces. A complete resizable probing-map class is still an extension. |
| Linear structures | Doubly linked updates are explained; a full doubly linked deque class is not supplied. |
| Trees | Preorder/postorder orders and successor rules are described; the complete traversal code focuses on inorder. Rank/select augmentation is not implemented. |
| Heaps | Stable queues and lazy graph candidates have code; indexed decrease-key and arbitrary-item removal remain conceptual. |
| Spatial search | K-d insert/exact/range/nearest, point-quadtree insert/exact/range, bounded bucket PR operations, and a given-tree R-tree query with exact segment refinement have code. K-d rebuilding/deletion, quadtree deletion/merging/nearest, and R-tree insertion/splitting remain extensions. |
| Algorithm design | DP has one complete optimisation problem; weighted interval scheduling, knapsack and sequence DP remain further examples to add. |
| Strings | Trie updates/prefix queries and three all-match substring algorithms have code. Ranked autocomplete, compressed tries, approximate matches, Aho–Corasick and suffix indexes remain extensions. |

These are named scope boundaries, not claims that the implemented algorithms require these variants to be correct.

## Recommended additions beyond the syllabus

The priorities below are editorial recommendations for this book's audience, rather than a claim that every DSA course uses the same scope.

| Priority | Missing concept or family | Suggested home and reason |
|---|---|---|
| High | **Negative-edge shortest paths and directed structure:** Bellman–Ford, reachable negative cycles, directed DFS cycle detection, strongly connected components | Extend Topics 10–11 with separate pages. Current functions deliberately stop short of those problems. |
| High | **Selection and non-comparison sorting:** quickselect, counting/radix sorting with key-domain assumptions | Extend Topic 4. Counting sort currently illustrates the lower-bound model without a full implementation. |
| High | **More DP examples:** 0/1 knapsack, longest common subsequence, weighted interval scheduling | Expand Topic 15. They teach item availability, two-dimensional state and greedy failure beyond coin change. |
| Medium | **Advanced string indexes and matching:** compressed tries, edit distance, multiple-pattern automata and suffix indexes | Extend Topic 16 with separate pages when the workload warrants them. The basic trie and single-pattern search foundation is now developed. |
| Medium | **Dynamic range queries:** Fenwick and segment trees | A separate topic if developed fully; contrast with the static prefix sums now in Topic 15. |
| Medium | **Randomisation and hashing guarantees:** random pivots, expected analysis, universal hashing | Expand Topics 2, 4 and 6; those concepts are currently introductory and assumption-focused. |
| Medium | **Ordered-tree alternatives and storage:** red–black trees, B/B+ trees and external-memory costs | A separate advanced extension, with an overview linked from Topic 8. AVL already covers the core balancing idea. |
| Later | **Advanced graph problems:** all-pairs routes, max flow, matching, articulation points and bridges | Separate advanced graph pages or a new topic. These would greatly expand the present course scope. |

Union–find remains Topic 13. Unrelated additions should not be collected under that title; substantial families receive their own topic, while smaller variants stay beside their prerequisite concepts.

The extension choices were cross-checked against the [MIT 6.006 course description](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/syllabus/) and [Princeton's strings chapter](https://algs4.cs.princeton.edu/50strings/). These references inform breadth, not this course's assessment requirements.
