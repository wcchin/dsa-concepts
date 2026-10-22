# Reading routes and prerequisites

Topic numbers organise the wiki; they do not require one uninterrupted reading sequence. The [concept index](concepts.md) supports individual questions. These routes show how the ideas build on one another.

| Route | Read in this order | What connects it |
|---|---|---|
| Foundations | [1. Python objects](topics/foundations/foundations.md) → [2. Analysis and correctness](topics/analysis/analysis.md) → [3. Recursion](topics/recursion/recursion.md) → [4. Sorting](topics/sorting/sorting.md) | Specify behaviour, trace state, prove progress, then count work |
| Representations and ordered search | [5. Linear ADTs](topics/linear-structures/linear-structures.md) → [6. Maps and hashing](topics/maps-sets-hashing/maps-sets-hashing.md) → [7. Searching and BSTs](topics/searching/searching.md) → [8. AVL](topics/balanced-trees/balanced-trees.md) | Compare the same requested operations under different invariants |
| Graph algorithms | [9. Priority queues](topics/heaps/heaps.md) and [10. Traversal](topics/graphs/graphs.md), then [13. Union–find](topics/union-find/union-find.md) before Kruskal in [11. Graph algorithms](topics/graph-algorithms/graph-algorithms.md) | Queues, heaps and partitions become algorithm components |
| Spatial branch | [7. BST bounds](topics/searching/tree-basics.md) → [12. Spatial search and indexing](topics/kd-trees/kd-trees.md) | Compare point-based cuts, midpoint cells and enclosing object rectangles |
| Optional design extension | [15. Strategies](topics/strategies/strategies.md), after Topics 1–4; graph examples are useful additional context | Greedy proofs, DP state reuse, backtracking and sequence patterns |
| Optional strings extension | [6. Hashing](topics/maps-sets-hashing/maps-sets-hashing.md) and [7. Tree traversal](topics/searching/bst-traversal.md), then [16. Strings and tries](topics/strings/strings.md) | Key length, shared prefixes and reusable pattern information |
| Integrated transport case | [10. Traversal](topics/graphs/graphs.md), [13. Union–find](topics/union-find/union-find.md) and [11. Graph algorithms](topics/graph-algorithms/graph-algorithms.md) → [14. Applications](topics/applications/applications.md) | Choose the objective and weight model before combining structures |

For Topic 11, topological ordering and shortest paths can be read before union–find. Only the Kruskal implementation requires the disjoint-set class. Topic 12 does not depend on minimum spanning trees, and k-d-tree construction should not reuse ordinary AVL rotations.

## A common reasoning thread

Each topic asks what the input means, which operations are required, what the representation stores, which invariant remains true, why the procedure finishes, and how work and live storage grow. Use the [correctness checklist](topics/analysis/correctness.md) and [cost model](topics/analysis/counting-work.md) across the whole book.

Tie rules and boundary conventions are local contracts. Binary search can use inclusive or half-open intervals if its updates match. BSTs here keep distinct keys; k-d trees send coordinate ties right; priority queues use arrival counters when stable ties are wanted. Follow the stated convention rather than transferring a rule by name alone.

For current scope, conceptual-only coverage and future additions, see [Coverage and extensions](coverage-review.md). [Topic 14](topics/applications/applications.md) now brings these ideas together through a complete fictional transport-network case.

## Check your reasoning as you read

[Topic 12](topics/kd-trees/kd-trees.md#where-to-check-your-understanding) pilots a self-reading format: two learning goals and prerequisite links at the start of each reading, then a misconception reminder and two prediction questions with expandable explanations. Predict a branch or result before opening the panel; use a mismatch to identify which boundary or invariant to revisit. These are ungraded, original examples.
