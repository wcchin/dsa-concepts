# K-d trees: the operation route

**After this page, you should be able to:**

- Connect all five operations to the same active-axis invariant.
- Distinguish tree height from the number of regions a query examines.

**Builds on:** [Spatial query contracts](spatial-queries.md) specify the objects and answers before we choose an index.

## One method, five operations

| Operation | Reading | Main question |
|---|---|---|
| Construction and insertion | [Build the tree](kd-construction.md) | Which axis owns this depth, and where do coordinate ties go? |
| Exact point lookup | [Follow one path](kd-exact-search.md) | Is this complete coordinate pair present? |
| Range search | [Visit eligible branches](kd-range-search.md) | Which stored points lie inside the closed rectangle? |
| Nearest neighbour | [Search and backtrack](kd-nearest.md) | Can an unvisited region improve the current candidate? |
| Deletion | [Replace without changing the axes](kd-updates-costs.md) | Which point can replace this pivot while preserving every descendant's region? |

Read [shape and construction costs](kd-shape.md) alongside construction. It explains why insertion order matters, why ordinary AVL rotations are unsuitable, and which assumptions a balanced median construction needs. Static construction and incremental insertion are different algorithms.

## A shared cost vocabulary

Let n count distinct stored points and h be the longest root-to-leaf path in edges. Exact lookup follows one path; range and nearest search can visit several paths. A shallow tree helps, but does not alone make a spatial query logarithmic. The [operation summary](kd-updates-costs.md#kd-operation-cost-summary) states working space separately from persistent storage and returned results.

:::{tip} Common misconception
**Every operation on a balanced tree costs logarithmic time.** A query may need several branches, and reporting r points always requires at least r output steps.
:::

(pilot-kd-methods-checks)=
## Check your understanding

**1. Do exact lookup and nearest search ask the same question when the query point is absent?**

:::{dropdown} Show explanation
No. Exact lookup returns absence. Nearest search returns a stored point of minimum distance, unless the tree is empty.
:::

**2. Can a range query returning every point take only logarithmic time?**

:::{dropdown} Show explanation
No. It must report n points. Height is only one contributor to the cost.
:::

Start with [construction and insertion](kd-construction.md).
