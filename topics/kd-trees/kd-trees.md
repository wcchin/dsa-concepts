# 12. Spatial search and indexing

A nearby point, a point inside a rectangle, and a line crossing a region require spatial evidence. This topic compares structures by what their boundaries mean and how those boundaries justify skipping work.

## What you should be able to explain

By the end of this topic, you should be able to connect each index’s stored information to its splitting/grouping rule, trace exact and range queries at boundaries, justify safe pruning, and distinguish candidate filtering from exact geometry checks. You should also be able to qualify a cost claim using height, visited records/cells and output size.

## How to use the readings

Read the question, prose and diagrams first. Before opening a **Show explanation** panel, predict the branch, answer set or stopping decision and say why. If your prediction differs, revisit the named rule rather than memorising the trace. All essential explanations remain in the main reading; the panels contain feedback on the checks.

Each reading begins with two learning goals and a prerequisite link. Near its end, a short misconception reminder and two ungraded checks help you decide whether to move on. These are original self-study examples, independent of course assessments.

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

## Keep the code context clear

| Reading route | Definitions to have available |
|---|---|
| K-d insertion, exact, range and nearest | Start with `KDNode` and the shared `root` from [construction](kd-construction.md), then read the query function on its own page |
| Point and PR quadtrees | Start with the [spatial-query helpers](spatial-queries.md), then the [point-quadtree definitions](point-quadtrees.md), then [PR operations](pr-quadtree-operations.md) |
| R-tree query and refinement | Use the spatial-query helpers and the [given R-tree/segment definitions](r-tree-representation.md) before the [query code](r-tree-queries.md) |

The downloadable comparison script supplies its own definitions and data. It includes k-d insertion/range and the new spatial examples; the k-d exact and nearest listings remain on their respective reading pages.

## Where to check your understanding

| If you are unsure about… | Revisit these checks |
|---|---|
| Query boundaries and pruning evidence | [Spatial-query contracts](spatial-queries.md#pilot-spatial-queries-checks) |
| Active axes and coordinate ties | [K-d insertion](kd-construction.md#pilot-kd-construction-checks) and [exact search](kd-exact-search.md#pilot-kd-exact-search-checks) |
| Which branches can contain answers | [K-d ranges](kd-range-search.md#pilot-kd-range-search-checks) and [nearest search](kd-nearest.md#pilot-kd-nearest-checks) |
| Height, balance and construction assumptions | [K-d shape](kd-shape.md#pilot-kd-shape-checks) |
| Point pivots versus fixed midpoint cells | [Point quadtrees](point-quadtrees.md#pilot-point-quadtrees-checks) and [PR concepts](point-region-quadtrees.md#pilot-point-region-quadtrees-checks) |
| Buckets, redistribution and stopping | [PR operations](pr-quadtree-operations.md#pilot-pr-quadtree-operations-checks) |
| Enclosures, candidates and exact matches | [R-tree representation](r-tree-representation.md#pilot-r-tree-representation-checks) and [queries](r-tree-queries.md#pilot-r-tree-queries-checks) |
| Comparing costs and choosing a structure | [Spatial-index choices](spatial-index-choices.md#pilot-spatial-index-choices-checks) |
