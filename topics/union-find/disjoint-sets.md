# Partitions and representatives

**After this page, you should be able to:**

- Specify the fixed-universe disjoint-set interface and union return semantics.
- Distinguish representatives, element count, component count and component size.

**Builds on:** [ADT contracts](../linear-structures/adts-and-contracts.md) and [undirected components](../graphs/graph-components.md).

(disjoint-set-partition)=
## Every object belongs to exactly one group

A **partition** divides a universe into nonempty, pairwise disjoint sets whose union is the whole universe. The sets `{0,1,2,3}`, `{4,5}` and `{6}` partition indices 0 through 6. No member can appear in two sets, and no member is omitted. The empty universe has an empty partition.

![Seven members form three disjoint groups, with one representative for each group.](../../assets/union-find/disjoint-partition.svg)

(union-find-adt)=
## Specify the three central operations

| Operation | Meaning in this book |
|---|---|
| `find(x)` | Return a representative of x's current set |
| `connected(a, b)` | Report whether a and b belong to the same set |
| `union(a, b)` | Merge their sets; return `True` only if two different sets merged |

Initially every member is in its own singleton set. A successful union decreases the number of sets by one. Union within an existing set returns `False` and leaves the partition unchanged. It does not create a duplicate member or another copy of the group.

(disjoint-set-interface)=
## Complete the fixed-universe contract

Construction `DisjointSet(n)` creates n singleton groups for integer members `0..n-1`. It does not insert graph edges or discover a graph's components automatically. Duplicate unions do not create elements. The class is defined on the [implementation page](union-compression.md#disjoint-set-code).

| Public query | Result; logical effect |
|---|---|
| `len(ds)` | Number of elements, fixed at construction |
| `is_empty()` | Whether there are zero elements; one merged group is not empty |
| `component_count()` | Number of current groups; decreases only on a successful union |
| `component_size(x)` | Number of elements in x's group |
| `find(x)` | Current representative; may compress parent links |
| `connected(a, b)` | Boolean connectivity; may compress parent links |
| `union(a, b)` | `True` if two groups merged, otherwise `False`; may also compress links |

`DisjointSet(0)` is valid. The constructor rejects non-integer, boolean and negative n with `ValueError`. Member operations reject non-integer, boolean, negative and out-of-range indices with `IndexError`. No public insertion or removal operation is supplied. The internal `size` list stores root metadata; it is not a public `size()` query. The retained `components` field is the count read by existing Kruskal examples; use `component_count()` when writing new client code.

(disjoint-set-representative)=
## A representative identifies a current set

The representative is an implementation-selected member identifying a set. It need not be the smallest member, earliest arrival, most important vertex or geometric centre. A later union can change a member's representative by attaching its former root below another root.

Compare `find(a) == find(b)` when you need current connectivity. Do not assume that a saved representative remains the root forever. If an application needs a persistent label or a minimum member, maintain that information explicitly as component metadata.

(union-find-versus-sets)=
## A partition structure is not a general set container

A Python set supports membership and set operations on its stored elements. Union–find specialises in identifying and merging **groups of elements** efficiently. Its parent array does not directly list every member of a component or recover a route between two graph vertices.

Static undirected components can be computed once with BFS or DFS in $O(n+m)$ time. Union–find is useful when merges and connectivity queries are interleaved. These structures answer related but different operational requirements.

## Costs belong to the chosen representation

The abstract partition contract does not prescribe parent arrays or path compression. A direct group-label array makes connectivity easy but may scan all n elements on a merge. A parent forest links roots and shifts work to finding representatives. The [implementation comparison](union-compression.md#union-find-operation-costs) separates plain forests, union by size, and compression.

For the supplied class, construction uses Θ(n+1) time/storage, count/empty queries use O(1), and operations that find roots have O(α(n)) amortised time for growing n with union by size and compression. A single call can still traverse O(log(n+1)) links. Component enumeration is a separate scan, not a constant-time `find` result.

:::{tip} Common misconception
**find returns every member of a group.** It returns one representative index. Enumerating members needs a separate grouping pass.
:::

(disjoint-set-checks)=
## Check your understanding

Predict the result or state change before opening the explanation.

**1. Starting with seven singleton elements, three unions successfully merge different groups. What are len(ds) and component_count()?**

:::{dropdown} Show explanation
Seven elements and four components. Union changes the partition, not the universe.
:::

**2. If union(a, b) returns False, has the abstract partition changed?**

:::{dropdown} Show explanation
No. They were already connected. Its find calls may still shorten internal parent paths without changing connectivity.
:::

Next: [Parent forests](parent-forests.md).
