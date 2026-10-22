# Spatial-search chapter plan and implementation status

The sidebar now groups the four methods after shared query contracts. Existing URLs are retained; numbering adjusts to nesting.

1. K-d trees: construction, shape, exact, range, nearest, deletion and costs.
2. Point quadtrees: point-based cuts, insertion/exact/range, then nearest and subtree-rebuild deletion.
3. PR quadtrees: midpoint/bucket concepts, insertion/exact/range, then nearest and deletion/merge.
4. R-trees: representation; operation route links incremental construction, exact object lookup, ranges, nearest and condensation.
5. Comparison: invariants, workload and costs; runnable standard-library script.

Each method covers the same five operations. All point operations and static-tree R-tree queries have code. General R-tree update algorithms, static packing and median k-d construction remain conceptual and explicitly identified. Costs distinguish persistent nodes, traversal workspace, geometry checks, output and update maintenance.

Five new readings retain the self-reading pattern: two goals, prerequisite link, visible misconception and two collapsed-feedback checks. Three new SVGs explain deletion and exact-distance refinement. Primary references are linked on the operation pages. Compressed trees, approximate/high-dimensional nearest indexing and production geometry kernels remain outside this pass.
