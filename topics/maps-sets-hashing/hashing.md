# Hashing: from keys to initial indices

Hashing uses a key to select a small part of a table to examine. It supports exact-key retrieval; it does not by itself organise keys by magnitude or geographical proximity.

## Three quantities to keep separate

| Quantity | Meaning | Example with key 15 and capacity 7 |
|---|---|---|
| Key | The object used for identification | 15 |
| Hash code | An integer produced by the hash function | 15 under the teaching rule h(k) = k |
| Initial index | A valid table position derived from the hash code | 15 mod 7 = 1 |

For these teaching examples, $i=h(k)\bmod m$, where $m>0$ is table capacity. With $h(k)=k$ and $m=7$, keys 8, 15 and 22 all begin at index 1. This is a **collision**, not evidence that the keys are equal.

In [chaining](chaining.md), the initial index identifies a bucket. In [open addressing](open-addressing.md), the final storage position may differ from the initial index.

## Why original keys are retained

Reducing many possible keys to a finite number of positions makes collisions unavoidable. A lookup must therefore compare the stored key with the query. Hashing narrows the candidates; equality identifies a match. Equal keys must produce equal hash codes, but equal hash codes do not imply equal keys.

## Hashability in Python

A hashable object has a hash value that stays stable during its lifetime and obeys the equality/hash contract. Python requires dictionary keys and set elements to be hashable. Lists and dictionaries are unhashable. A tuple is hashable only when all its elements are hashable.

```python
locations = {(2, 3): "Stop A"}   # tuple of integers: valid key
records = {"S01": [72, 81]}     # list as a value: valid
records["S01"].append(85)       # values need not be hashable
```

“Immutable” and “hashable” are related but not interchangeable definitions. A tuple containing a list is unhashable. User-defined classes can have other equality and hashing policies. For a value-based key, changing information used by hashing or equality can invalidate lookup assumptions; using a stable immutable key is the clearest design for these examples.

## Deterministic traces

We explicitly state the hash function, capacity, insertion order and collision rule before tracing a table. Do not substitute a guessed Python string hash: string hashes may differ between interpreter runs. The teaching tables explain principles, not the internal layout of Python’s `dict` or `set`.
