# Parent forests and finding a root

(union-find-parent-forest)=
## Represent each set as a rooted tree

Store one parent index per member. A root points to itself: `parent[root] == root`. Other members follow parent links until they reach that root. Different root trees represent different disjoint sets, forming a forest.

For `[0, 0, 0, 2, 4, 4, 6]`, the represented groups are `{0,1,2,3}`, `{4,5}` and `{6}`. Member 3's immediate parent is 2, but its representative is 0.

![A parent array and matching rooted forest show 3 pointing to 2 then 0, while 4 and 6 root separate components.](../../assets/union-find/parent-forest.svg)

(basic-find)=
## Follow the entire path, not just one parent

```python
def find_root(parent, x):
    while parent[x] != x:
        x = parent[x]
    return x
```

The helper assumes a valid index and a well-formed parent forest. `find_root(parent, 3)` follows **3, 2, 0** and returns 0. `find_root(parent, 1)` follows **1, 0** and returns the same representative. Testing only `parent[3] == parent[1]` would incorrectly claim they belong to different sets.

(union-find-root-linking)=
## Merge roots rather than arbitrary interior nodes

To combine two sets, first find their distinct roots, then make one root point to the other. Redirecting an arbitrary member can detach only part of a component or create a cycle in the representation. Root linking preserves all existing members and keeps one tree per abstract set.

Unrestricted root linking can still produce a chain, making one find take $\Theta(n)$ time. The next page controls that depth and shortens paths.

(union-find-links-versus-edges)=
## Parent links are bookkeeping, not original graph routes

Union may connect two root indices even when no original graph edge joins those roots. Path compression later adds further shortcuts that were never input edges. The parent forest therefore cannot be interpreted as a route network or as Kruskal's chosen spanning edges.

Keep accepted graph edges in a separate list if they are needed. This distinction also prevents confusing a graph traversal's discovery parent—which denotes an actual graph edge—with a union–find parent.

Next: [Union by size and compression](union-compression.md).
