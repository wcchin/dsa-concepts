# Reading routes and prerequisites

The sidebar follows a suggested learning sequence: foundations and structures, spatial search, graph methods, optional extensions, then integrated applications. You can also follow a shorter route. The [concept index](concepts.md) supports individual questions. These routes show how the ideas build on one another.

| Route | Read in this order | What connects it |
|---|---|---|
| Foundations | [1. Python objects](topics/foundations/foundations.md) → [2. Analysis and correctness](topics/analysis/analysis.md) → [3. Recursion](topics/recursion/recursion.md) → [4. Sorting](topics/sorting/sorting.md) | Specify behaviour, trace state, prove progress, then count work |
| Representations and ordered search | [5. Sequences, stacks, queues and deques](topics/linear-structures/linear-structures.md) → [6. Maps and hashing](topics/maps-sets-hashing/maps-sets-hashing.md) → [7. Searching and BSTs](topics/searching/searching.md) → [8. AVL](topics/balanced-trees/balanced-trees.md) | Compare the same requested operations under different invariants |
| Spatial branch | [7. BST bounds](topics/searching/tree-basics.md) → [8. Balanced trees](topics/balanced-trees/balanced-trees.md) → [9. Spatial search and indexing](topics/kd-trees/kd-trees.md) | Compare point-based cuts, midpoint cells and enclosing object rectangles |
| Graph algorithms | [10. Priority queues](topics/heaps/heaps.md) → [11. Traversal](topics/graphs/graphs.md) → [12. Union–find](topics/union-find/union-find.md) → [13. Graph algorithms](topics/graph-algorithms/graph-algorithms.md) | Queues, heaps and partitions become algorithm components |
| Optional design extension | [14. Strategies](topics/strategies/strategies.md), after Topics 1–4; graph examples are useful additional context | Greedy proofs, DP state reuse, backtracking and sequence patterns |
| Optional strings extension | [6. Hashing](topics/maps-sets-hashing/maps-sets-hashing.md) and [7. Tree traversal](topics/searching/bst-traversal.md), then [15. Strings and tries](topics/strings/strings.md) | Key length, shared prefixes and reusable pattern information |
| Integrated transport case | [11. Traversal](topics/graphs/graphs.md), [12. Union–find](topics/union-find/union-find.md) and [13. Graph algorithms](topics/graph-algorithms/graph-algorithms.md) → [16. Applications](topics/applications/applications.md) | Choose the objective and weight model before combining structures |

Topic 9 follows BSTs and AVL trees to compare spatial invariants with one-dimensional ordering; AVL rotations do not generally preserve k-d-tree partitions. Topics 10–13 establish heaps, traversal and union–find before graph optimisation. Within Topic 13, only Kruskal requires the disjoint-set class. Spatial search is not a prerequisite for the graph route, and Topics 14–15 are optional extensions: the transport case in Topic 16 can be read directly after Topic 13.

## A common reasoning thread

Each topic asks what the input means, which operations are required, what the representation stores, which invariant remains true, why the procedure finishes, and how work and live storage grow. Use the [correctness checklist](topics/analysis/correctness.md) and [cost model](topics/analysis/counting-work.md) across the whole book.

Tie rules and boundary conventions are local contracts. Binary search can use inclusive or half-open intervals if its updates match. BSTs here keep distinct keys; k-d trees send coordinate ties right; priority queues use arrival counters when stable ties are wanted. Follow the stated convention rather than transferring a rule by name alone.

For current scope, conceptual-only coverage and future additions, see [Coverage and extensions](coverage-review.md). [Topic 16](topics/applications/applications.md) now brings these ideas together through a complete fictional transport-network case.

## Check your reasoning as you read

[Topic 9](topics/kd-trees/kd-trees.md#where-to-check-your-understanding) pilots a self-reading format: two learning goals and prerequisite links at the start of each reading, then a misconception reminder and two prediction questions with expandable explanations. Predict a branch or result before opening the panel; use a mismatch to identify which boundary or invariant to revisit. These are ungraded, original examples.

The spatial sidebar now groups k-d trees, point quadtrees, PR quadtrees and R-trees. Follow each method’s five-operation route from construction through deletion. Compare the cost summaries only after checking which code, occupancy assumptions, node visits and geometry tests each bound describes.
