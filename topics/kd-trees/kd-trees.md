# 12. K-d trees and multidimensional search

A single ordering key does not directly describe a rectangle or a nearby location. A k-d tree uses coordinate comparisons to organise points into nested spatial regions, allowing queries to exclude regions that cannot contain an answer.

## Reading route

1. [Split rules and construction](kd-construction.md): alternate dimensions and follow a consistent tie rule.
2. [Exact-point search](kd-exact-search.md): distinguish full equality from a coordinate tie.
3. [Range search and pruning](kd-range-search.md): report every point inside an inclusive rectangle.
4. [Shape, construction and limitations](kd-shape.md): qualify height and efficiency claims.
5. [Nearest-neighbour search](kd-nearest.md): keep a best candidate and backtrack when another region could improve it.

Read [BST terminology and ordering](../searching/tree-basics.md) and [recursion](../recursion/recursion.md) first. AVL implementation is not a prerequisite, but the [rotation comparison](kd-shape.md#kd-rotations) explains an important difference from Topic 8.

The core follows the additional lecture's two-dimensional example. Code expects finite numeric coordinate pairs supplied as two-element tuples, with ordinary consistent comparisons; it ignores repeated identical points. It does not implement point deletion or geographic coordinate conversion. Nearest-neighbour code extends the lecture's conceptual introduction.
