# Separate chaining

**After this page, you should be able to:**

- Trace lookup, insertion, replacement and deletion within a bucket.
- Explain unique-key placement, bucket aliasing and bucket-length costs.

**Builds on:** [Hashing](hashing.md) defines the index and equality rules.

Separate chaining associates each table index with a bucket of entries. Several unequal keys can share a bucket. Lookup selects one bucket and compares keys inside it.

## Buckets and lookup in separate chaining

Use $h(k)=k$, $m=7$, and insert entries in the order shown below. New entries are appended within a bucket.

| Bucket | Entries in order |
|---|---|
| 0 | (14, A), (21, C) |
| 1 | (8, B), (15, D), (1, E) |
| 4 | (11, F) |
| 2, 3, 5, 6 | empty |

For key 15, compute 15 mod 7 = 1. Compare with 8, then 15, and return D. For key 22, examine the same bucket but compare with 8, 15 and 1 before reporting absence. For key 2, the selected bucket is empty, so no key comparison is needed.

These are two forms of an unsuccessful search: an empty bucket and an exhausted nonempty bucket. Both establish absence under the placement rule.

## Representation invariant and helper contracts

Every `(key,value)` occurs in bucket `hash(key) % m`, no two stored keys compare equal, and each bucket is a distinct list. All keys are hashable and use stable, consistent, reflexive equality. Capacity is positive. Values may be None.

| Helper | Return | Missing key / full policy |
|---|---|---|
| `get_chained(table,key)` | Value | `KeyError` on absence |
| `put_chained(table,key,value)` | True for insertion; False for replacement | Buckets grow; no configured full-table rejection |
| `remove_chained(table,key)` | Removed value | `KeyError` on absence |

These are storage-level functions, not a complete Map class. If a caller caches n, increment it only for a True put result and decrement it only after successful removal. Size/empty are O(1) with such metadata; without it, counting all entries costs O(n+m). Key/item snapshots scan all buckets and allocate their output.

## Reading the code

This example uses Python lists for buckets; a chain need not be implemented as a linked list.

```python
def get_chained(table, key):
    i = hash(key) % len(table)
    for stored_key, value in table[i]:
        if stored_key == key:
            return value
    raise KeyError(key)
```

The index calculation selects a bucket. The loop establishes whether an equal key occurs there. Reaching the exception means every candidate was checked. The function assumes a nonempty bucket array and a hashable query key.

## Insertion and replacement

```python
def put_chained(table, key, value):
    bucket = table[hash(key) % len(table)]
    for j, (stored_key, _) in enumerate(bucket):
        if stored_key == key:
            bucket[j] = (key, value)
            return False
    bucket.append((key, value))
    return True
```

The returned Boolean says whether a new key was added. Search before appending: otherwise replacing key 15 could create a duplicate association. A Map’s size increases only on `True`.

(chained-deletion-code)=
## Deletion removes and returns the value

```python
def remove_chained(table, key):
    bucket = table[hash(key) % len(table)]
    for j, (stored_key, value) in enumerate(bucket):
        if stored_key == key:
            del bucket[j]
            return value
    raise KeyError(key)
```

Delete decreases a separately maintained size only on success. Removing an entry does not break access to the remaining entries because the bucket itself stays reachable. In our **list-backed buckets**, deletion can also shift later bucket entries; a linked bucket has a different local removal cost. Missing-key removal raises after checking the entire bucket.

## Separate bucket objects

```python
table = [[] for _ in range(7)]
```

Each bucket above is a different list. `[[]] * 7` would repeat references to one list and make all buckets change together—an [aliasing](../foundations/foundations.md) error.

The expected cost depends on distribution and [load factor](performance.md). If all keys land in one bucket, lookup may inspect all stored entries.

## Implementation choices, correctness and costs

Search before replacement/insertion preserves unique keys. Exhausting the selected bucket proves absence because the placement invariant excludes every other bucket. After the table above, replacing key 15 changes D without adding a key; removing key 8 returns B, while keys 15 and 1 remain reachable in bucket 1.

For a selected bucket of length b, lookup/put/removal cost O(b+1), including possible list shifts or append growth. Workspace is O(1) ordinarily; growing that bucket can temporarily use O(b+1). Expected b is controlled by distribution and load, yielding expected O(1+α) operations with amortised bucket growth, not a worst-case constant guarantee. A table of m buckets and n entries uses O(m+n) persistent storage. The helpers do not automatically rehash or resize the outer bucket array.

Chaining suits a direct illustration of collision groups and deletion without tombstones. Choosing a linked bucket, array bucket or different capacity policy changes maintenance costs without changing the Map contract.

:::{tip} Common misconception
**A collision means the new association replaces the old one.** Only key equality permits replacement; unequal colliding keys must coexist.
:::

(hash-chaining-checks)=
## Check your understanding

Predict the result and resulting state before opening the explanation.

**1. Keys 8 and 15 share a bucket. Does putting 15 again change the number of keys?**

:::{dropdown} Show explanation
No. Search finds the equal 15 and replaces its value, returning False from the helper.
:::

**2. Can deletion from a Python-list bucket involve shifts after the key is found?**

:::{dropdown} Show explanation
Yes. del bucket[j] shifts later bucket entries. Knowing the index does not make that list removal universally constant time.
:::

Next: [Open addressing](open-addressing.md).

**Browse:** [Maps, Sets and Hashing](maps-sets-hashing.md) · [Concept index](../../concepts.md)
