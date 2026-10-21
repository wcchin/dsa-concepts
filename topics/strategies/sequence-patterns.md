# Prefix sums, two pointers and sliding windows

(prefix-sums)=
## Precompute repeated range totals

Let `prefix[i]` be the sum of the first i values, so `prefix[0] = 0`. The sum of half-open range `[left,right)` is `prefix[right] - prefix[left]`.

```python
def prefix_sums(values):
    prefix = [0]
    for value in values:
        prefix.append(prefix[-1] + value)
    return prefix
```

For `[3,1,4,2]`, prefixes are `[0,3,4,8,10]`; indices `[1,3)` sum to `8-3=5`. Building takes $O(n)$ time and storage; each valid bounded range query then takes constant time. Updates to the original values invalidate affected prefix totals. Dynamic range-query structures are a separate extension.

(two-pointer-search)=
## Use sorted order to eliminate one endpoint

```python
def two_sum_sorted(values, target):
    left, right = 0, len(values) - 1
    while left < right:
        total = values[left] + values[right]
        if total == target:
            return left, right
        if total < target:
            left += 1
        else:
            right -= 1
    return None
```

The input must be ascending, with consistent numeric comparison and addition. A sum too small rules out the current left value with every remaining right value; a sum too large rules out the current right value with every remaining left value. Each step moves an endpoint, so time is $O(n)$ and auxiliary space is constant. Two equal values can be used if they occupy different positions.

(sliding-window-sum)=
## Update a fixed window by removing and adding one value

```python
def max_fixed_window_sum(values, k):
    if type(k) is not int or not 1 <= k <= len(values):
        raise ValueError("window size must be between 1 and input length")
    total = sum(values[i] for i in range(k))
    best = total
    for right in range(k, len(values)):
        total += values[right] - values[right - k]
        best = max(best, total)
    return best
```

Each iteration preserves the sum of the current k-item window. Negative numbers are allowed because the window size is fixed. Time is $O(n)$ and additional working space is $O(1)$ under the numeric word model; no sliced window lists are allocated.

![A fixed-size window moves one position by subtracting its outgoing value and adding the incoming value, while prefix sums answer arbitrary fixed-input ranges.](../../assets/strategies/sequence-windows.svg)

(window-monotonicity)=
## Variable windows need an additional argument

A variable-size window seeking a target sum often relies on positivity or another monotone condition to know which endpoint to move. The fixed-window algorithm above needs no such claim. Do not transfer it to arbitrary constraints merely because both methods are called sliding windows.

These patterns reuse [array indexing](../linear-structures/arrays.md), [sorted-order exclusion](../searching/binary-search.md) and [rolling-window policies](../linear-structures/queues-and-deques.md#rolling-window). Next: [Complexity limits](complexity-limits.md).
