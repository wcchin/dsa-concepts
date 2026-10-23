# 7. Searching and binary search trees

Ordering is useful because it supplies evidence about where a target cannot be. Binary search excludes part of a sorted sequence; a binary search tree excludes an entire subtree. The same reasoning leads to different storage and update costs.

## Reading route

1. [Binary search](binary-search.md): maintain a candidate interval and make progress at every mismatch.
2. [Search boundaries](search-boundaries.md): find first/last duplicate boundaries and insertion positions.
3. [Trees and the BST invariant](tree-basics.md): connect terminology to whole-subtree bounds.
4. [BST lookup and insertion](bst-lookup-insertion.md): follow one path and reconnect returned roots.
5. [Traversal and ordered operations](bst-traversal.md): recover sorted order, minimum and successor.
6. [BST range queries](bst-range-queries.md): report a bounded key range while pruning irrelevant subtrees.
7. [BST deletion](bst-deletion.md): trace leaf, one-child and two-child removal without losing subtrees.
8. [One ordered-set contract](ordered-set-operations.md): public operations, strict/tolerant removal and extraction.
9. [Search costs and choices](search-costs.md): distinguish logarithmic search from the conditions that make it possible.

Review [sorting](../sorting/sorting.md), [linked structures](../linear-structures/linked-structures.md) and [recursive calls](../recursion/recursive-calls.md). Code stores one node per distinct key. Repeated insertion leaves the set unchanged; comparisons must define a consistent order.

The figures reuse the lecture tree rooted at 50. [Topic 8](../balanced-trees/balanced-trees.md) explains how to keep its paths short; [Topic 9](../kd-trees/kd-trees.md) changes the ordering rule for multidimensional points.

## Consistent contracts and implementation scope

Read **purpose/contract → invariant and representation → trace → code → choices/correctness → costs → suitability → self-checks**. Exact binary search and boundary search return positions; BST readers return nodes or key snapshots; update helpers return subtree roots. The [ordered-set adapter](ordered-set-operations.md#ordered-set-contract) makes the public operation results explicit rather than confusing those different layers.

The seven-node reference tree precedes insertion of 65; pages explicitly identify examples that include it. Trace updates against the indicated starting tree rather than carrying a changed tree into the next independent example. The strict distinct-key policy applies to both BST and AVL implementations.

The supplied code covers exact/boundary array search, all three traversals, extremes, strict neighbours, closed ranges, BST updates and a shared public set interface. It does not implement a key–value ordered map, rank/select augmentation or a static median builder.
