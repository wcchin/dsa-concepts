# Separate chaining

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

Deletion follows the same bucket search, removes the matching entry, and decreases the size only on success. Removing one entry does not break access to the other entries because the bucket itself remains reachable.

## Separate bucket objects

```python
table = [[] for _ in range(7)]
```

Each bucket above is a different list. `[[]] * 7` would repeat references to one list and make all buckets change together—an [aliasing](../foundations/foundations.md) error.

The expected cost depends on distribution and [load factor](performance.md). If all keys land in one bucket, lookup may inspect all stored entries.

**Browse:** [Maps, Sets and Hashing](maps-sets-hashing.md) · [Concept index](../../concepts.md)
