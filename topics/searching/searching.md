# 7. Searching and binary search trees

Ordering is useful because it supplies evidence about where a target cannot be. Binary search excludes part of a sorted sequence; a binary search tree excludes an entire subtree. The same reasoning leads to different storage and update costs.

## Reading route

1. [Binary search](binary-search.md): maintain a candidate interval and make progress at every mismatch.
2. [Trees and the BST invariant](tree-basics.md): connect terminology to whole-subtree bounds.
3. [BST lookup and insertion](bst-lookup-insertion.md): follow one path and reconnect returned roots.
4. [Traversal and ordered operations](bst-traversal.md): recover sorted order, minimum and successor.
5. [BST deletion](bst-deletion.md): trace leaf, one-child and two-child removal without losing subtrees.
6. [Search costs and choices](search-costs.md): distinguish logarithmic search from the conditions that make it possible.

Review [sorting](../sorting/sorting.md), [linked structures](../linear-structures/linked-structures.md) and [recursive calls](../recursion/recursive-calls.md). Code stores one node per distinct key. Repeated insertion leaves the set unchanged; comparisons must define a consistent order.

The figures reuse the lecture tree rooted at 50. [Topic 8](../balanced-trees/balanced-trees.md) explains how to keep its paths short; [Topic 12](../kd-trees/kd-trees.md) changes the ordering rule for multidimensional points.
