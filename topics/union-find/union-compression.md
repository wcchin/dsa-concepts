# Union by size and path compression

**After this page, you should be able to:**

- Trace weighted root linking, compression and component metadata.
- Compare individual-call costs with amortised sequence guarantees.

**Builds on:** [Parent forests](parent-forests.md) and [amortised reasoning](../linear-structures/dynamic-arrays.md#amortised-array-append).

**Code languages:** Python defines the explanations, figures and self-checks. Use the [language guide](../../code-languages.md) for native conventions and dependencies. Complete runnable topic examples: [JavaScript](../../examples/languages/union-find.js) · [Julia](../../examples/languages/union-find.jl).

JavaScript member indices are 0..n−1; Julia members are 1..n. Element count, component count and component size remain distinct. Julia find_set! and union_sets! may mutate representation links, preserving the same abstract partition and union-by-size tie rule.

(union-by-size)=
## Attach the smaller root tree to the larger

Maintain a component size at each root. When two roots differ, attach the smaller set's root below the larger root and add its size to the surviving root. Only **root** sizes are authoritative; a former root's old size may remain stale after it becomes a child.

With union by size alone, a member's depth increases only when its whole component joins one at least as large. Its component size then at least doubles. It can experience at most $\lfloor\log_2 n\rfloor$ such depth increases, giving a logarithmic worst-case find path.

(path-compression)=
## Redirect a visited path to its representative

During find, first locate the root, then redirect every member on the traversed path to it. This changes the internal shape but preserves the partition and the chosen root. Save the old next index before overwriting it, so the rest of the path remains accessible.

![Before and after find(3), member 3 changes parent from 2 to 0; the separate path from 5 through 4 remains unchanged.](../../assets/union-find/path-compression.svg)

(disjoint-set-code)=
## A complete fixed-universe implementation

::::{tab-set}
:class: code-language-tabs

:::{tab-item} Python
:sync: python

```python
class DisjointSet:
    def __init__(self, n):
        if type(n) is not int or n < 0:
            raise ValueError("n must be a nonnegative integer")
        self.parent = list(range(n))
        self.size = [1] * n
        self.components = n

    def _check(self, x):
        if type(x) is not int or not 0 <= x < len(self.parent):
            raise IndexError("member index out of range")

    def find(self, x):
        self._check(x)
        root = x
        while self.parent[root] != root:
            root = self.parent[root]
        while self.parent[x] != x:
            next_x = self.parent[x]
            self.parent[x] = root
            x = next_x
        return root

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.size[ra] < self.size[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        self.size[ra] += self.size[rb]
        self.components -= 1
        return True

    def connected(self, a, b):
        return self.find(a) == self.find(b)

    def __len__(self):
        return len(self.parent)

    def is_empty(self):
        return len(self) == 0

    def component_count(self):
        return self.components

    def component_size(self, x):
        return self.size[self.find(x)]
```

:::

:::{tab-item} JavaScript
:sync: javascript

```javascript
class DisjointSet {
    constructor(n) {
        if (!Number.isSafeInteger(n) || n < 0) throw new RangeError("nonnegative integer size required");
        this.parent = Array.from({length:n}, (_, i) => i);
        this.sizes = Array(n).fill(1); this.components = n;
    }
    _check(x) {
        if (!Number.isInteger(x) || x < 0 || x >= this.parent.length) throw new RangeError("member index out of range");
    }
    find(x) {
        this._check(x); let root = x;
        while (this.parent[root] !== root) root = this.parent[root];
        while (this.parent[x] !== x) {
            const next_x = this.parent[x]; this.parent[x] = root; x = next_x;
        }
        return root;
    }
    union(a, b) {
        let ra = this.find(a), rb = this.find(b);
        if (ra === rb) return false;
        if (this.sizes[ra] < this.sizes[rb]) [ra, rb] = [rb, ra];
        this.parent[rb] = ra; this.sizes[ra] += this.sizes[rb]; this.components--; return true;
    }
    connected(a, b) { return this.find(a) === this.find(b); }
    size() { return this.parent.length; }
    is_empty() { return this.size() === 0; }
    component_count() { return this.components; }
    component_size(x) { return this.sizes[this.find(x)]; }
}
```

:::

:::{tab-item} Julia
:sync: julia

```julia
mutable struct DisjointSet
    parent::Vector{Int}
    sizes::Vector{Int}
    components::Int
end
function DisjointSet(n)
    (n isa Int && n >= 0) || throw(ArgumentError("nonnegative integer size required"))
    return DisjointSet(collect(1:n), ones(Int, n), n)
end
function find_set!(s::DisjointSet, x)
    (x isa Int && 1 <= x <= length(s.parent)) || throw(BoundsError(s.parent, x))
    root = x
    while s.parent[root] != root; root = s.parent[root]; end
    while s.parent[x] != x
        next_x = s.parent[x]; s.parent[x] = root; x = next_x
    end
    return root
end
function union_sets!(s::DisjointSet, a, b)
    ra, rb = find_set!(s, a), find_set!(s, b)
    ra == rb && return false
    if s.sizes[ra] < s.sizes[rb]; ra, rb = rb, ra; end
    s.parent[rb] = ra; s.sizes[ra] += s.sizes[rb]; s.components -= 1
    return true
end
connected(s::DisjointSet, a, b) = find_set!(s, a) == find_set!(s, b)
Base.length(s::DisjointSet) = length(s.parent)
Base.isempty(s::DisjointSet) = length(s) == 0
component_count(s::DisjointSet) = s.components
component_size(s::DisjointSet, x) = s.sizes[find_set!(s, x)]
```

:::

::::

The explicit bounds check rejects negative Python indices rather than accidentally treating −1 as the last member. Equal sizes retain the first argument's root. Clients must preserve the internal arrays; changing them directly can break the forest or its metadata.

(union-find-shared-trace)=
## Trace the same five unions as the lecture

Start with seven singleton sets. Perform `(0,1), (2,3), (0,2), (4,5), (0,4)` in that order. The final parent array is `[0,0,0,2,0,4,6]`, root 0's size is 6, and there are two components. A subsequent `find(3)` changes parent[3] to 0 but leaves parent[5] equal to 4, because that other path was not traversed.

![Union-by-size steps show both the parent array and component count, ending with six members under root 0 and singleton root 6.](../../assets/union-find/union-trace.svg)

`connected` may compress internal paths even though it is an observer of the **logical partition**. This agrees with Topic 5's observer/mutator distinction at the abstract level: internal representation changes need not change externally meaningful membership.

(union-find-amortised-cost)=
## State sequence cost separately from one call

Initialisation takes $\Theta(n)$ time and storage. Union by size plus path compression gives $O(\alpha(n))$ amortised time per valid operation, where $\alpha$ is the inverse Ackermann function. For n≥2 and q operations after initialisation, the standard sequence bound is $O(n+q\alpha(n))$.

This is a worst-case sequence guarantee, not a probability claim and not a promise that every call takes the same constant number of steps. An individual uncompressed path can still contain $O(\log n)$ links with union by size. The iterative two-pass find uses constant auxiliary space; the full structure stores $\Theta(n)$ entries. Empty and singleton universes are handled directly without needing the asymptotic formula.

(union-find-operation-costs)=
## Compare operations and implementation choices

The class above retains its original `parent`, root `size` and `components` fields so existing Kruskal code stays compatible. Public observers `len(ds)`, `is_empty()` and `component_count()` are O(1). `component_size(x)` follows `find(x)` and then reads the authoritative root size. Non-root size entries can be stale and must not be summed as component sizes.

| Choice | Individual find / connectivity / union | Sequence guarantee | Persistent storage |
|---|---|---|---|
| Unrestricted parent forest | O(n+1), including finding roots for union | May repeatedly follow long chains | Θ(n+1) |
| Union by size, no compression | O(log(n+1)) | Same worst-case bound per call | Θ(n+1), including root sizes |
| Shown union by size plus full compression | O(log(n+1)) worst-case for one call | O(α(n)) amortised per operation for n≥2 after initialisation | Θ(n+1) |

Union by rank is another linking policy: rank bounds tree height rather than storing component cardinality. With compression, rank need not equal the current height. It is not implemented here; the size metadata directly supports our component-size query.

These bounds also apply to `component_size`, since it finds a root. Queries involving two elements perform two finds, which does not change the asymptotic bound. Iterative find uses O(1) local workspace and returns one index; union and connectivity return booleans. Initialisation is Θ(n+1), including empty/singleton cases.

The class has a fixed universe. There is no `add`, `remove`, `extract` or split operation. A failed member check does not promise representation rollback: an earlier valid find in the same call might already have compressed paths, while the partition remains unchanged. Use this structure when merges and connectivity queries dominate, and use [traversal](../graphs/graph-components.md) when routes or a static partition are the required result.

## Read the metadata after a merge

After `ds = DisjointSet(7)` and the five documented unions, `len(ds)` is 7, `ds.component_count()` is 2, `ds.component_size(3)` is 6, and `ds.is_empty()` is `False`. The size query also calls find, so it compresses 3's path just as an explicit `find(3)` would. It does not compress an unrelated branch through 5.

A representative can change at a later successful union; root identities are not persistent application labels. Equal sizes retain the first argument's root in this implementation. That choice makes the shared trace reproducible but does not change the abstract connectivity result.

:::{tip} Common misconception
**Amortised almost-constant time means every call has constant cost.** The bound describes a sequence; an individual path can still have logarithmic length.
:::

(union-compression-checks)=
## Check your understanding

Predict the result or state change before opening the explanation.

**1. After the documented five unions, what does component_size(3) return, and does component_count change?**

:::{dropdown} Show explanation
It returns 6 and leaves the count at 2. It can compress the path 3→2→0 without merging groups.
:::

**2. If all seven elements are merged into one group, is the structure empty?**

:::{dropdown} Show explanation
No. len(ds) remains 7, component_count() is 1, and is_empty() is False. Empty means no elements, not one component.
:::

Next: [Connectivity applications](union-find-applications.md).
