# Divide, conquer and combine

Recursion is a mechanism for expressing calls. **Divide-and-conquer** is a strategy for organising a solution: divide the problem into smaller subproblems, solve them, then combine their answers. Many implementations use recursion, but the two ideas are not synonyms.

(divide-conquer-combine)=
## The three stages need a complete connection

Merge sort makes the stages concrete:

| Stage | Merge-sort action | Requirement |
|---|---|---|
| Divide | Split the sequence into two parts | Parts preserve all input items |
| Conquer | Sort each part | Recursive calls return sorted results |
| Combine | Merge the sorted results | Output is sorted and preserves all items |

A split alone does not sort anything. Solving the smaller parts is also insufficient without a combine operation that produces the required whole result.

(split-and-combine)=
## Follow one dataset down and back up

![Eight values are split into halves down to singletons; the same tree is then reconstructed upward with sorted intermediate results.](../../assets/recursion/split-combine.svg)

The input is `[38, 12, 27, 5, 19, 8, 31, 14]`. Splitting preserves its values but does not order them. Singletons are already sorted. Combining `[38]` with `[12]` produces `[12, 38]`; combining that with `[5, 27]` produces `[5, 12, 27, 38]`. Finally merge the two sorted halves to obtain `[5, 8, 12, 14, 19, 27, 31, 38]`.

The tree expresses dependencies. In the sequential Python implementation below, the entire left recursive call finishes before the right call starts. The two branches do not run in parallel just because the drawing places them side by side.

(merge-two-sorted-sequences)=
## Merge only needs the first unused values

For two sorted inputs, the smallest unused value must be at one of their current fronts. Compare those candidates, append the smaller one, and advance only that side’s index.

![During a merge, the consumed prefix is grey, indices i and j point at 12 and 14, and the current result is 5, 8. Comparing the candidates selects 12 next.](../../assets/recursion/merge-cursors.svg)

| Candidates | Append | Result so far |
|---|---:|---|
| 5 and 8 | 5 | 5 |
| 12 and 8 | 8 | 5, 8 |
| 12 and 14 | 12 | 5, 8, 12 |
| 27 and 14 | 14 | 5, 8, 12, 14 |
| 27 and 19 | 19 | 5, 8, 12, 14, 19 |
| 27 and 31 | 27 | 5, 8, 12, 14, 19, 27 |
| 38 and 31 | 31 | 5, 8, 12, 14, 19, 27, 31 |
| Only 38 remains | 38 | 5, 8, 12, 14, 19, 27, 31, 38 |

(merge-invariant)=
## Why can the remainder be appended?

At each step, the output contains the smallest consumed values in sorted order, and each input index points to its first unused value. If both sides remain, selecting the smaller current candidate preserves that condition. If one side is exhausted, the other side’s remainder is already sorted and no remaining value on the exhausted side can intervene.

This argument depends on **both inputs being sorted**. Arbitrary input lists cannot be sorted by a single front-comparison pass. Repeated values are valid and must retain their multiplicities. Choosing the left item on equality will also support stable sorting, developed in Topic 4.

(merge-sort-code)=
## A complete sequential implementation

```python
def merge_sorted(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

def merge_sort(values):
    if len(values) <= 1:
        return values.copy()
    middle = len(values) // 2
    left = merge_sort(values[:middle])
    right = merge_sort(values[middle:])
    return merge_sorted(left, right)

values = [38, 12, 27, 5, 19, 8, 31, 14]
print(merge_sort(values))  # [5, 8, 12, 14, 19, 27, 31, 38]
```

This version accepts lists of mutually comparable values and returns a new sorted list. It does not mutate the caller’s outer list or copy the payload objects deeply. Empty and singleton inputs return a shallow copy immediately. Every larger call produces two strictly smaller inputs.

The base case is correct because a sequence of zero or one items is sorted. Assuming both smaller results are correct, the merge argument establishes a sorted permutation of the original input. Termination follows because each larger input is divided into smaller parts.

The [implementation page](implementation-costs.md) examines why slicing and indices matter. The planned [Sorting topic](../sorting/sorting.md) will compare this strategy with insertion, bubble and quicksort.

Next: [Recursion trees and costs](recursion-costs.md).

**Browse:** [Recursion](recursion.md) · [Concept index](../../concepts.md)
