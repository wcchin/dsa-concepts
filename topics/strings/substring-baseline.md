# A substring-search baseline

(substring-match-contract)=
## Return every starting index, including overlaps

The functions in the remaining pages take text and pattern strings and return all exact occurrence indices in ascending order. They preserve inputs and use code-point positions. Overlaps count: `"aba"` occurs at indices 0 and 2 in `"ababa"`.

The empty pattern matches every boundary, so on text length n it returns `[0, 1, ..., n]`. A longer nonempty pattern has no matches. These choices are part of the contract, not consequences to discover accidentally from a loop.

(naive-substring-search)=
## Check each alignment directly

```python
def naive_find_all(text, pattern):
    n, m = len(text), len(pattern)
    if m == 0:
        return list(range(n + 1))
    matches = []
    for start in range(n - m + 1):
        j = 0
        while j < m and text[start + j] == pattern[j]:
            j += 1
        if j == m:
            matches.append(start)
    return matches
```

At an alignment, the first j positions have matched. A mismatch proves this alignment is not an occurrence; reaching m proves it is. Trying every possible starting index proves completeness, and moving by one retains overlaps. A negative range bound naturally gives no alignments when m>n.

![The pattern aba matches ababa at starts zero and two, and those matches share the middle a.](../../assets/strings/overlapping-matches.svg)

(naive-substring-cost)=
## Repeated prefixes can repeat comparisons

For 1≤m≤n, at most m comparisons are made at each of n−m+1 alignments, giving $O((n-m+1)m)$ time. Text made of many a's and pattern `"aaaab"` illustrate near-complete matches that fail late and restart. This can be quadratic when m grows proportionally to n.

The main search uses constant working space plus $O(r)$ output for r matches. The empty-pattern result needs $O(n+1)$ time and output. No candidate substring is sliced, so there is no hidden $O(m)$ temporary string per alignment. When m>n, this function returns immediately after a constant number of setup steps.

The baseline is a valuable independent check for more elaborate algorithms. It does not describe the internal implementation of Python's `str.find` or `in`; use those interfaces in applications when their contracts fit rather than assuming they use this teaching algorithm.

Next: [KMP](kmp-matching.md).
