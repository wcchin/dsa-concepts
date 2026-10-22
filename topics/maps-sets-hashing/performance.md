# Load factor, rehashing and performance

**After this page, you should be able to:**

- Separate live load, used load, distribution and rebuild work.
- Qualify expected, worst-case and amortised costs for each operation.

**Builds on:** [Chaining](chaining.md) and [probing](open-addressing.md) use different search invariants.

Let n be the number of live entries and m the capacity. The **load factor** is $\alpha=n/m$. It summarises occupancy; it does not describe how evenly keys are distributed.

## Load factor and collision strategies

In chaining, $\alpha$ is the average bucket length, including empty buckets, and may exceed 1. With suitable hash distribution, constant-cost hashing/equality and bucket access, expected lookup takes $O(1+\alpha)$. If all keys share a bucket, the worst case is $O(n)$.

In open addressing, each live entry needs a distinct slot. Lookup examines at most m slots in the bounded linear-probing implementation. Expected probe cost depends on the collision method, distribution, occupancy and deletion history; do not reuse the chaining formula for probing.

| Claim | Qualification |
|---|---|
| Expected constant-time lookup | Suitable distribution, occupancy control and constant-cost key operations |
| A chaining lookup can be linear | One bucket may contain all n entries |
| A probing lookup is bounded | At most m probes in the stated implementation |
| A rebuild can be expensive | It processes the table and reinserts live entries |

For long strings or custom keys, hashing and equality may themselves require more than constant work. State the key-cost assumption when analysing table operations.

## Live load and used load

If d slots are tombstones, distinguish live load $n/m$ from used load $(n+d)/m$. With m = 10, n = 3 and d = 6, live load is 0.3 but used load is 0.9. Only one slot is `EMPTY`, and a failed search may pass many tombstones.

Rebuilding at the same capacity can remove tombstones. Growing the table and removing tombstones address related but different problems.

## Why changing capacity requires rehashing

An index depends on m. With $h(k)=k$, keys 8, 15 and 22 all select index 1 at capacity 7. At capacity 14, they select 8, 1 and 8 respectively. Copying each old slot into the same numbered new slot would violate the new placement rule.

A rebuild creates an empty table and reinserts live entries using the new capacity. For probing, specify the reinsertion order because it can affect final positions. Tombstones are not reinserted.

(hash-operation-costs)=
## Compare operations under stated assumptions

Let m be allocated table capacity, n live entries, d tombstones and r returned records. Hashing/equality and reference operations are constant-cost in this table; add key-processing costs separately.

| Operation | Chaining with list buckets | Fixed linear probing |
|---|---|---|
| Get / contains | Expected O(1+α); worst O(n+1) | O(p+1), at most O(m); expected O(1) only with suitable occupancy/distribution |
| Put / replace | Expected amortised O(1+α); worst O(n+1) | O(p+1), at most O(m); new entry can raise full-table error |
| Remove | Expected O(1+α); worst O(n+1), including bucket shifts | O(p+1), at most O(m); leaves a tombstone |
| Size / empty | O(1) with cached count | O(1) with cached count |
| Enumerate keys/items | O(m+n), plus O(r) output storage | Θ(m), plus O(r) output storage |
| Persistent storage | O(m+n) | Θ(m) |

Membership can use the same exact-key search without treating a stored None as absence. A bare table with no cached count must scan to compute size. Operation workspace is normally O(1); bucket allocation and full rebuilds can require additional memory. These costs are about representations, not universal Map/Set guarantees.

## Rebuild helpers illustrate maintenance

```python
def rebuild_chained(table, capacity):
    if type(capacity) is not int or capacity <= 0:
        raise ValueError("capacity must be a positive integer")
    fresh = [[] for _ in range(capacity)]
    for bucket in table:
        for key, value in bucket:
            put_chained(fresh, key, value)
    return fresh

def rebuild_probed(table, capacity):
    if type(capacity) is not int or capacity <= 0:
        raise ValueError("capacity must be a positive integer")
    fresh = [EMPTY] * capacity
    for slot in table:
        if slot is not EMPTY and slot is not DELETED:
            put_probed(fresh, slot[0], slot[1])
    return fresh
```

These helpers reuse preceding definitions and return a new table, leaving the old table unchanged. Probing reinserts live entries in old physical-slot order; deleted markers disappear. A requested probing capacity smaller than n raises OverflowError during rebuilding; the original remains valid. A caller keeps the returned table only after successful construction.

Rebuilding scans the old storage, initialises the new storage and pays **all reinsertion costs**. Under suitable distribution and bounded target load, expected cost is O(m_old+m_new+n). Reinsertions can cost O(n²) under pathological collisions, so rebuilding is not unconditionally linear. Extra storage includes the new table while the old remains live.

## Expected and amortised complexity

**Expected** cost averages over a stated probabilistic model, such as suitable hash distribution. **Amortised** cost spreads work across an operation sequence. Neither term means that each individual operation is cheap.

With geometric capacity growth, the entry counts processed across successive expansions form a geometric series. Under suitable distribution, bounded occupancy and the usual capacity policy, the total rebuilding work over n insertions is expected $O(n)$, giving expected amortised $O(1)$ insertion. A single insertion that triggers rebuilding may still cost $O(n)$ under those assumptions. Pathological collisions can invalidate the expected constant-time claim.

These distinctions connect hash tables to [dynamic arrays](../linear-structures/linear-structures.md), where occasional resizing also motivates amortised analysis.

## Implementation choices and suitability

Growing prevents excessive live load; same-capacity rebuilding removes tombstones; shrinking releases spare storage. These are separate policies. Thresholds should leave enough successful updates between rebuilds to support the claimed amortised bound. Rebuilding after every deletion would not do so. The fixed helpers above implement a rebuild, not an automatic threshold policy.

:::{tip} Common misconception
**A rebuild always costs linear time because it moves n entries.** It also scans/allocates tables and must perform each insertion, whose collision costs can be large.
:::

(hash-performance-checks)=
## Check your understanding

Predict the result and resulting state before opening the explanation.

**1. With m=10, n=3 and d=6, what are live and used load?**

:::{dropdown} Show explanation
Live load is 0.3; used load is 0.9. Only one slot is EMPTY, so a failed probe can still be long.
:::

**2. Does expected amortised O(1) insertion make a resizing insertion worst-case O(1)?**

:::{dropdown} Show explanation
No. Expectations concern a probabilistic model and amortisation an operation sequence. A particular rebuild can still be expensive.
:::

Next: [Choosing a structure](choosing.md).

**Browse:** [Maps, Sets and Hashing](maps-sets-hashing.md) · [Concept index](../../concepts.md)
