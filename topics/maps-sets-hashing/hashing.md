# Hashing: from keys to initial indices

**After this page, you should be able to:**

- Distinguish keys, hash codes, indices, collisions and equality.
- State the key assumptions needed for consistent placement and lookup.

**Builds on:** [Map](maps.md) and [set](sets.md) contracts specify which exact-key operations are needed.

Hashing uses a key to select a small part of a table to examine. It supports exact-key retrieval; it does not by itself organise keys by magnitude or geographical proximity.

## Operation role and invariant

Hashing is an implementation technique, not a replacement for the Map or Set contract. Insert/lookup/delete must use compatible index calculations and key equality. Changing a key's hash-relevant state after placement can leave a stored entry outside the search path chosen for it.

## Keys, hash codes and table indices

| Quantity | Meaning | Example with key 15 and capacity 7 |
|---|---|---|
| Key | The object used for identification | 15 |
| Hash code | An integer produced by the hash function | 15 under the teaching rule h(k) = k |
| Initial index | A valid table position derived from the hash code | 15 mod 7 = 1 |

For these teaching examples, $i=h(k)\bmod m$, where $m>0$ is table capacity. With $h(k)=k$ and $m=7$, keys 8, 15 and 22 all begin at index 1. This is a **collision**, not evidence that the keys are equal.

In [chaining](chaining.md), the initial index identifies a bucket. In [open addressing](open-addressing.md), the final storage position may differ from the initial index.

## Hash collisions and key equality

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

## Implementation choices, costs and suitability

The integer identity rule makes traces reproducible; a practical hash function must also distribute the workload's keys suitably. Modulo requires positive capacity. A hash function should not be confused with encryption or an ordering by magnitude.

We count hashing and equality as O(1) only under an explicit key model. Reading a previously unhashed long string or comparing long equal prefixes can add key-length work; cached hashes can change later costs. The hash calculation does not alone determine storage or collision-search cost. Use this technique for exact-key questions, then choose chaining or probing to preserve a complete search invariant.

:::{tip} Common misconception
**Equal table indices imply equal keys.** A finite table forces collisions; equality must still distinguish candidate keys.
:::

(hash-basics-checks)=
## Check your understanding

Predict the result and resulting state before opening the explanation.

**1. At capacity 7 with h(k)=k, do 8 and 15 identify the same entry?**

:::{dropdown} Show explanation
They share initial index 1, but are unequal keys. A correct Map can retain both associations.
:::

**2. Does a tuple containing a list become hashable because its outer tuple cannot be changed?**

:::{dropdown} Show explanation
No. Hashability also depends on its contents. The inner list is unhashable.
:::

Next: [Separate chaining](chaining.md).

**Browse:** [Maps, Sets and Hashing](maps-sets-hashing.md) · [Concept index](../../concepts.md)
