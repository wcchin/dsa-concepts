# Rolling hashes: filter, then verify

(polynomial-string-hash)=
## Treat a fixed-length window as a polynomial fingerprint

For code values x₀,...,xₘ₋₁, choose base b and modulus q and compute

$$H=(x_0 b^{m-1}+x_1 b^{m-2}+\cdots+x_{m-1})\bmod q.$$

If the window moves one position, remove its outgoing value, shift the remaining powers by multiplying by b, and add the incoming value:

$$H' = ((H-x_0 b^{m-1})b+x_m)\bmod q.$$

Only the residue of $b^{m-1}$ is needed. Python's modulo normalises a negative intermediate value for a positive modulus. The rolling formula is an algebraic update, not evidence that equal hashes imply equal strings.

![A length-three window over code values one two three shifts to two three four by subtracting one times base squared, multiplying by base, and adding four.](../../assets/strings/rolling-window-hash.svg)

(rabin-karp-verified)=
## A matching fingerprint is a candidate, not an answer

```python
def rolling_find_all(text, pattern, *, base=257, modulus=1_000_000_007):
    if type(base) is not int or base < 2:
        raise ValueError("base must be an integer at least 2")
    if type(modulus) is not int or modulus < 2:
        raise ValueError("modulus must be an integer at least 2")
    n, m = len(text), len(pattern)
    if m == 0:
        return list(range(n + 1))
    if m > n:
        return []
    high = pow(base, m - 1, modulus)
    target_hash = window_hash = 0
    for j in range(m):
        target_hash = (target_hash * base + ord(pattern[j])) % modulus
        window_hash = (window_hash * base + ord(text[j])) % modulus
    matches = []
    for start in range(n - m + 1):
        if window_hash == target_hash:
            if all(text[start + j] == pattern[j] for j in range(m)):
                matches.append(start)
        if start + m < n:
            outgoing = ord(text[start])
            incoming = ord(text[start + m])
            window_hash = ((window_hash - outgoing * high) * base
                           + incoming) % modulus
    return matches
```

This is a verified Rabin–Karp-style search. The invariant is that `window_hash` equals the polynomial hash of the current window. The initial loop establishes it; the update formula maintains it. Equal strings must have equal fingerprints, so no true occurrence is filtered out. Direct verification excludes false candidates.

(rolling-hash-collisions)=
## Deliberately small moduli expose the correctness issue

With base 10 and modulus 7, two-code-point strings `"ab"` and `"ai"` both hash to 4: their code values are (97,98) and (97,105), differing by 7 in the last position. Thus `rolling_find_all("ai", "ab", base=10, modulus=7)` returns `[]` after rejecting a real hash collision.

![The strings ab and ai have the same fingerprint modulo seven, but comparing their second symbols rejects the false candidate.](../../assets/strings/hash-collision.svg)

The defaults are fixed parameters, not a randomised guarantee. A prime modulus or a second fingerprint can reduce collisions under suitable models, but neither alone proves equality. This is also not a cryptographic hash. In our exact search, verification is what protects correctness.

(rolling-hash-cost)=
## Verification can dominate the window updates

For 1≤m≤n and c equal-hash candidate windows, the time bound is $O(n+m+cm)$ under fixed-parameter arithmetic costs. A fingerprint update takes constant work, but checking one candidate can inspect all m symbols. Candidates include true matches: a text with many overlapping equal matches can therefore be costly even without accidental collisions.

The worst case is $O(nm)$, while [KMP](kmp-matching.md) guarantees linear scanning plus output for this contract. Working storage is constant apart from $O(r)$ returned positions; indexed verification avoids allocating m-symbol slices. Empty patterns cost $O(n+1)$ output, and patterns longer than the text return immediately. If base or modulus are allowed to grow in bit length, their arithmetic costs must also be counted.

This page builds the rolling fingerprint explicitly; Python's `hash()` does not provide this update interface. Concept reference: [Princeton's verified Rabin–Karp implementation](https://algs4.cs.princeton.edu/53substring/RabinKarp.java.html), which uses a different parameter policy and returns the first match.

Next: [Choose a string method](string-choices.md).
