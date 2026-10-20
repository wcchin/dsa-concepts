# Load factor, rehashing and performance

Let n be the number of live entries and m the capacity. The **load factor** is $\alpha=n/m$. It summarises occupancy; it does not describe how evenly keys are distributed.

## Chaining and open addressing differ

In chaining, $\alpha$ is the average bucket length, including empty buckets, and may exceed 1. With suitable hash distribution, constant-cost hashing/equality and bucket access, expected lookup takes $O(1+\alpha)$. If all keys share a bucket, the worst case is $O(n)$.

In open addressing, each live entry needs a distinct slot. Lookup examines at most m slots in the bounded linear-probing implementation. Expected probe cost depends on the collision method, distribution, occupancy and deletion history; do not reuse the chaining formula for probing.

| Claim | Qualification |
|---|---|
| Expected constant-time lookup | Suitable distribution, occupancy control and constant-cost key operations |
| A chaining lookup can be linear | One bucket may contain all n entries |
| A probing lookup is bounded | At most m probes in the stated implementation |
| A rebuild can be expensive | It processes the table and reinserts live entries |

For long strings or custom keys, hashing and equality may themselves require more than constant work. State the key-cost assumption when analysing table operations.

## Tombstones count differently

If d slots are tombstones, distinguish live load $n/m$ from used load $(n+d)/m$. With m = 10, n = 3 and d = 6, live load is 0.3 but used load is 0.9. Only one slot is `EMPTY`, and a failed search may pass many tombstones.

Rebuilding at the same capacity can remove tombstones. Growing the table and removing tombstones address related but different problems.

## Why changing capacity requires rehashing

An index depends on m. With $h(k)=k$, keys 8, 15 and 22 all select index 1 at capacity 7. At capacity 14, they select 8, 1 and 8 respectively. Copying each old slot into the same numbered new slot would violate the new placement rule.

A rebuild creates an empty table and reinserts live entries using the new capacity. For probing, specify the reinsertion order because it can affect final positions. Tombstones are not reinserted.

## Expected versus amortised

**Expected** cost averages over a stated probabilistic model, such as suitable hash distribution. **Amortised** cost spreads work across an operation sequence. Neither term means that each individual operation is cheap.

With geometric capacity growth, the entry counts processed across successive expansions form a geometric series. Under suitable distribution, bounded occupancy and the usual capacity policy, the total rebuilding work over n insertions is expected $O(n)$, giving expected amortised $O(1)$ insertion. A single insertion that triggers rebuilding may still cost $O(n)$ under those assumptions. Pathological collisions can invalidate the expected constant-time claim.

These distinctions connect hash tables to [dynamic arrays](../linear-structures/linear-structures.md), where occasional resizing also motivates amortised analysis.
