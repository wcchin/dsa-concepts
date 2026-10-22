# 12. Spatial search and indexing

A nearby point, a point inside a rectangle, and a line crossing a region require spatial evidence. This topic compares structures by what their boundaries mean and how those boundaries justify skipping work.

## What you should be able to explain

By the end of this topic, you should be able to connect each index’s stored information to its splitting/grouping rule, trace exact and range queries at boundaries, justify safe pruning, and distinguish candidate filtering from exact geometry checks. You should also be able to qualify a cost claim using height, visited records/cells and output size.

## How to use the readings

Read the question, prose and diagrams first. Before opening a **Show explanation** panel, predict the branch, answer set or stopping decision and say why. If your prediction differs, revisit the named rule rather than memorising the trace. All essential explanations remain in the main reading; the panels contain feedback on the checks.

Each reading begins with two learning goals and a prerequisite link. Near its end, a short misconception reminder and two ungraded checks help you decide whether to move on. These are original self-study examples, independent of course assessments.

## Reading route

1. [Spatial queries and a reference scan](spatial-queries.md): fix objects, distance units and query boundaries.
2. [**K-d trees**](kd-methods.md): [construction](kd-construction.md), [exact search](kd-exact-search.md), [range search](kd-range-search.md), [shape and limitations](kd-shape.md), [nearest neighbours](kd-nearest.md), and [deletion with a cost summary](kd-updates-costs.md). Existing reading URLs are retained.
3. [Point quadtrees](point-quadtrees.md): insertion, exact and range search, then [nearest search, deletion and costs](point-quadtree-updates.md).
4. [Point-region quadtrees](point-region-quadtrees.md): replace pivot locations with fixed cell midpoints, then read [insertion/exact/range](pr-quadtree-operations.md) and [nearest/deletion/merging](pr-quadtree-updates.md).
5. **R-trees:** [enclosing rectangles and the given tree](r-tree-representation.md), then follow its operation route through [construction, exact lookup, nearest and deletion](r-tree-operations.md) and [range refinement](r-tree-queries.md).
6. [Compare the spatial indexes](spatial-index-choices.md): reuse the same point/query example and account for different kinds of work.

Read [BST terminology](../searching/tree-basics.md) and [recursion](../recursion/recursion.md) first. The new point and PR operations use iterative traversal. The [AVL rotation comparison](kd-shape.md#kd-rotations) remains useful, but AVL code is not a prerequisite.

The k-d-tree core follows the additional lecture's seven-point example. The quadtree and R-tree readings are original extensions, with primary references linked on their pages. They do not change CS2040HS assessment scope. Point examples use finite numeric coordinate pairs and ignore repeated identical points; R-tree examples preserve distinct line identifiers.

The sidebar groups the readings by four methods. Each group follows the same operation route: **construction/insertion → exact lookup → range search → nearest neighbour → deletion**, with time and space costs. Page numbering changes with this grouping; existing URLs remain valid.

The [standalone Python example](../../examples/spatial_search.py) includes all listed point-tree operations and given-tree R-tree exact/range/nearest queries. General dynamic R-tree insertion, splitting and condensation are explained with worked traces, not implemented. Static k-d median construction and R-tree packing also remain conceptual.

## Keep the code context clear

| Reading route | Definitions to have available |
|---|---|
| K-d insertion, exact, range and nearest | Start with `KDNode` and the shared `root` from [construction](kd-construction.md), then read the query function on its own page |
| Point and PR quadtrees | Start with the [spatial-query helpers](spatial-queries.md), then the [point-quadtree definitions](point-quadtrees.md), then [PR operations](pr-quadtree-operations.md) |
| R-tree query and refinement | Use the spatial-query helpers and the [given R-tree/segment definitions](r-tree-representation.md) before the [query code](r-tree-queries.md) |

The downloadable comparison script supplies its own definitions and data. It includes the k-d exact, nearest and deletion listings as well as the point/PR updates and R-tree queries. New helpers and their prerequisites are linked on each operation page.

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

## Complete the operation checks

- [K-d replacement and costs](kd-updates-costs.md#pilot-kd-updates-costs-checks).
- [Point-quadtree nearest and rebuilding](point-quadtree-updates.md#pilot-point-quadtree-updates-checks).
- [PR nearest and merging](pr-quadtree-updates.md#pilot-pr-quadtree-updates-checks).
- [R-tree distance and condensation](r-tree-operations.md#pilot-r-tree-operations-checks).
