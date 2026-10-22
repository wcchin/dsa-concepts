# 12. Spatial search and indexing

A nearby point, a point inside a rectangle, and a line crossing a region require spatial evidence. This topic compares structures by what their boundaries mean and how those boundaries justify skipping work.

## Reading route

1. [Spatial queries and a reference scan](spatial-queries.md): fix objects, distance units and query boundaries.
2. **K-d trees:** [construction](kd-construction.md), [exact search](kd-exact-search.md), [range search](kd-range-search.md), [shape and limitations](kd-shape.md), and [nearest neighbours](kd-nearest.md). These existing readings retain their examples and URLs.
3. [Point quadtrees](point-quadtrees.md): extend the point-based split to both axes and four children.
4. [Point-region quadtrees](point-region-quadtrees.md): replace pivot locations with fixed cell midpoints, then read the [insertion and query implementation](pr-quadtree-operations.md).
5. **R-trees:** [enclosing rectangles and the given tree](r-tree-representation.md), then [candidate queries and exact refinement](r-tree-queries.md).
6. [Compare the spatial indexes](spatial-index-choices.md): reuse the same point/query example and account for different kinds of work.

Read [BST terminology](../searching/tree-basics.md) and [recursion](../recursion/recursion.md) first. The new point and PR operations use iterative traversal. The [AVL rotation comparison](kd-shape.md#kd-rotations) remains useful, but AVL code is not a prerequisite.

The k-d-tree core follows the additional lecture's seven-point example. The quadtree and R-tree readings are original extensions, with primary references linked on their pages. They do not change CS2040HS assessment scope. Point examples use finite numeric coordinate pairs and ignore repeated identical points; R-tree examples preserve distinct line identifiers.

There are complete point-quadtree insert/exact/range operations, a bounded bucket PR tree, and a given-tree R-tree query with exact segment refinement. General R-tree insertion/splitting and the other stated extensions are not implemented. A [standalone Python example](../../examples/spatial_search.py) is linked from the comparison page.
