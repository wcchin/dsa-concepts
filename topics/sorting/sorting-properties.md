# What sorting promises

**After this page, you should be able to:**

- Specify ordered output without losing repeated records.
- Distinguish stability, mutation and auxiliary space.

**Builds on:** [Python lists](../foundations/collections-and-classes.md) and [cost models](../analysis/counting-work.md).

(sorting-specification)=
## Order without losing records

A sorting algorithm must satisfy two conditions: its output is ordered, and it contains exactly the same records, with the same multiplicities, as its input. Returning an empty list is ordered but fails the second condition. Repeated values must not disappear.

For ascending numeric order, adjacent output values satisfy `a[i] <= a[i + 1]`. This chapter assumes a consistent ordering and constant-time comparisons. If comparing long strings or computing expensive keys takes more work, include that cost separately.

## Sorting is an operation on a sequence

A sequence/list ADT supplies operations such as length, element access, updates and iteration. Sorting is an operation on those records; insertion sort and merge sort are alternative algorithms, rather than separate ADTs.

| Interface | Contract |
|---|---|
| Mutating sort | Rearrange the supplied list; the teaching insertion/bubble/quick/heapsort functions return `None` |
| Sorted copy | Return a new sorted list; the teaching merge sort leaves the input unchanged |
| `key` and `reverse` options | Supported by Python's built-ins; absent from our elementary listings |
| Optional ordering check | Tests adjacent ordering; must separately check preservation of all input records |

The input is a Python list of mutually comparable values under a consistent ordering. The comparisons used by the listings include `>`, `<=` and others; custom records must support the operators a particular implementation uses. Empty, singleton and duplicate-containing lists are valid inputs. Do not claim key-based stability by sorting whole `(key,label)` tuples, whose labels would also take part in comparisons.

(sorting-key)=
## Sorting keys

A record can contain several fields. The **key** is the field or computed value that determines order. Sorting students by score does not mean rearranging the fields within each student record.

```python
students = [("Alice", 80), ("Ben", 70), ("Chen", 80)]
by_score = sorted(students, key=lambda student: student[1])
assert by_score == [("Ben", 70), ("Alice", 80), ("Chen", 80)]
assert students[0] == ("Alice", 80)  # original list is unchanged
```

(stable-sorting)=
## Stability preserves the order of ties

A **stable** sort preserves the input order of records whose keys compare equal. Alice originally precedes Chen; both have score 80. A stable score sort keeps that order. Either order of these two records satisfies ascending score order, but only one preserves stability.

![A stable score sort keeps Alice before Chen among records with equal score.](../../assets/sorting/stability.svg)

Stability matters when earlier ordering carries information. To order records by score and then by name within each score, one option is a single tuple key `(score, name)`. Another is a stable sort by name followed by a stable sort by score: the last sort establishes the primary key and preserves the earlier order within ties.

(in-place-sorting)=
## In-place work and additional space

An algorithm using only a constant amount of additional working storage is **in-place** in the strict space sense. Insertion sort and bubble sort below use a few variables while modifying the supplied list.

Quicksort's partition uses constant additional storage, but recursive calls require stack frames. State the stack cost as well; modifying the input alone does not prove constant auxiliary space. A function can also modify its input while allocating substantial temporary storage.

(python-sorting)=
## Python's two interfaces

`sorted(iterable, key=...)` returns a new list. `a.sort(key=...)` rearranges an existing list and returns `None`. Both provide stable sorting and accept `reverse=True` for descending order. Descending sorting also preserves the original order among equal keys. The word “in-place” in Python interface descriptions refers to mutation; built-in sorting can still allocate O(n) temporary storage. These interfaces are useful for practical code; implementing the elementary algorithms lets us examine why they work.

```python
values = [3, 1, 2]
result = values.sort()
assert values == [1, 2, 3]
assert result is None
```

:::{tip} Common misconception
**Mutating a list and using constant extra space are the same guarantee.** A mutating algorithm can allocate large buffers.
:::

(sorting-contracts-checks)=
## Check your understanding

Predict the answer before opening the explanation.

**1. Can [1,2] be a correct sort of [2,1,2]?**

:::{dropdown} Show explanation
No. The repeated 2 was lost. Correct sorting preserves multiplicities as well as order.
:::

**2. Do equal numeric outputs prove stability?**

:::{dropdown} Show explanation
No. Use distinguishable records with equal keys and compare their relative order.
:::

Next: [Insertion sort](insertion-sort.md).
