# Topic 12 expansion: spatial search and indexing

Implemented on 22 October 2026. The overview title is broadened while its file and all existing k-d-tree URLs are retained.

## Reading sequence and delivered scope

1. Spatial query contracts, planar units, reference scanning, grid baseline and pruning bounds.
2. Five retained k-d-tree readings: construction, exact search, range search, shape and nearest search.
3. Separate point-quadtree page: two-axis splits through stored points, tie ownership, iterative insertion/exact/range code, paired partition/tree diagram.
4. Separate point-region-quadtree page: fixed region midpoints, leaf buckets, half-open cells, closed queries, duplicate handling and stopping limits.
5. PR operations page: full iterative insertion, exact membership and ranges; redistribution and overflow accounting.
6. R-tree representation and query pages: given two-leaf tree, overlapping enclosures, candidate traversal, exact segment/rectangle refinement. This is not a general R-tree insertion/splitting implementation.
7. Comparison page and a standalone standard-library Python example.

The k-d, point-quadtree and PR examples reuse the same seven points, insertion order and closed query. R-trees use five line segments and a separate query to expose a real bounding-box false positive. New precise diagrams are original SVGs; no course notebook, rubric or solution file was used.

## Remaining extensions

- Point/PR deletion and nearest traversal, compressed PR variants and record buckets for coincident observations.
- R-tree insertion, splitting, packing, updates and nearest traversal.
- Complete region-quadtree/raster implementation, beyond the terminology distinction supplied here.
- Deeper coordinate-system instruction or production geometry robustness belongs in linked geographic material rather than silently changing the teaching contracts.

Primary references are linked on the reading pages: OpenDSA PR/other spatial structures, Guttman's R-tree paper and the PostGIS spatial-index workshop.
