# Open addressing: probing and tombstones

Open addressing stores entries directly in table slots. A collision triggers a sequence of candidate positions. For **linear probing**, position $j$ in the sequence is $(h(k)+j)\bmod m$, for $j=0,\ldots,m-1$.

## Linear probing and wraparound

Use $h(k)=k$ and capacity 7. Insert 6, 13 and 20, in that order:

| Key | Initial index | Positions examined | Stored index |
|---|---|---|---|
| 6 | 6 | 6 | 6 |
| 13 | 6 | 6, 0 | 0 |
| 20 | 6 | 6, 0, 1 | 1 |

Modulo wraps the sequence back to index 0. Lookup must follow the same sequence used for insertion. The boundary of the array is not a stopping condition.

## Empty, occupied and deleted slots

| State | What lookup does | Why |
|---|---|---|
| Occupied | Compare keys; return on equality, otherwise continue | A collision may belong to another key |
| `DELETED` | Continue | A later entry may have been displaced past this slot |
| `EMPTY` | Report absence | Under this placement rule, the key would have been inserted before passing this unused slot |

## Deletion and tombstones

The `EMPTY` stopping rule depends on preserving the insertion invariant. Deleted entries must not simply be marked empty.

For example, insert 14, 21 and 1 into an empty capacity-7 table. They occupy indices 0, 1 and 2. Delete 21 at index 1. Key 1 begins lookup at index 1, so replacing 21 with `EMPTY` would incorrectly hide key 1. A tombstone records that the search must continue.

![A capacity-7 table with key 14 at index 0, a tombstone at index 1, and key 1 at index 2. Lookup for key 1 continues past the tombstone.](../../assets/probing-deletion.svg)

## A bounded lookup

```python
EMPTY = object()
DELETED = object()

def get_probed(table, key):
    m = len(table)
    start = hash(key) % m
    for step in range(m):
        slot = table[(start + step) % m]
        if slot is EMPTY:
            raise KeyError(key)
        if slot is DELETED:
            continue
        stored_key, value = slot
        if stored_key == key:
            return value
    raise KeyError(key)
```

Create a new table with `[EMPTY] * 7`; sharing an unmodified marker object is intentional. Check marker identity before unpacking an occupied pair. The loop visits at most m slots, including when tombstones or live entries leave no `EMPTY` slot. Capacity must be positive.

## Tombstones and insertion

Suppose indices 1, 2 and 3 contain `DELETED`, `(22, C)` and `EMPTY`. Both key 22 and key 15 start at index 1.

- To put `(22, X)`, continue past the tombstone and replace the entry at index 2.
- To put `(15, B)`, remember index 1, continue through index 2, and reach `EMPTY` at index 3. Absence is now established, so reuse index 1.

Inserting immediately at the tombstone could create two copies of key 22. The insertion algorithm remembers the first deleted slot but continues searching for an equal key. A full cycle also proves absence; reuse a remembered tombstone or grow the full table.

## Clustering and alternatives

Linear probing can form contiguous clusters, making later probes longer. Quadratic probing and double hashing change the sequence. Their parameters and capacity rules must ensure adequate coverage; they cannot be substituted without changing the trace. The [performance page](performance.md) explains why low live load alone does not guarantee a short probe sequence.

**Browse:** [Maps, Sets and Hashing](maps-sets-hashing.md) · [Concept index](../../concepts.md)
