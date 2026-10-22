# Proposed Topic 12 expansion: spatial search and indexing

Status: proposal discussed on 22 October 2026; the extension is not yet implemented. Retain existing topic numbering and k-d-tree URLs. Broaden the overview title when the new readings are ready.

## Proposed reading groups

1. Spatial query contracts: points versus extended objects; exact, range and nearest queries; brute-force reference search; distance units; safe exclusion rules.
2. K-d trees: retain the current five developed readings and diagrams, including split/tie rules, exact/range/nearest search and shape limitations.
3. Quadtrees: distinguish point quadtrees (splits through stored points), point-region (PR) quadtrees (fixed midpoint region subdivision for points), and region quadtrees (homogeneous raster regions). Develop a bucket PR quadtree as the main implementation rather than treating these terms as synonyms.
4. PR-quadtree operations: bounded extent, child boundary ownership, insertion, range reporting, maximum depth/minimum cell size and duplicate-coordinate handling. Prevent infinite subdivision when coincident or very close points exceed bucket capacity.
5. R-trees: bounding rectangles enclosing child groups, overlapping sibling rectangles, points and extended geometries, candidate filtering and exact refinement. Start with a small given tree and a complete query trace; insertion/splitting algorithms can be a later extension.
6. Comparison: shared point set and query rectangle across k-d and PR trees; a second line/polygon example for R-tree false positives. Compare visited regions and returned records, rather than claiming every query is logarithmic.

Grid indexing can supply a simple baseline. Keep advanced spatial databases and coordinate-reference-system instruction proportional to this DSA book; link to geographic applications for fuller context.

Primary references: [OpenDSA PR quadtree](https://opendsax.cs.vt.edu/OpenDSA/Books/Everything/html/PRquadtree.html), [OpenDSA other spatial structures](https://opendsa.cs.vt.edu/ODSA/Books/ewu/cscd320/spring-2019/01/html/OtherSpatial.html), and [PostGIS spatial indexing workshop](https://postgis.net/workshops/en/postgis-intro/indexing.html). These inform the proposal, not the current assessment scope.
