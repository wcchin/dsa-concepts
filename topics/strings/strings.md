# 16. Strings, tries and pattern matching

A directory of place names and a long paragraph both contain strings, but they ask different search questions. Does the key `"bus"` exist? Which keys begin with `"bu"`? Where does `"bus"` occur inside a report? Choosing a structure starts by separating those requirements.

## Reading route

1. [String models and query contracts](string-model.md): distinguish exact, prefix and substring questions; define what an index counts.
2. [Trie representation](trie-representation.md): share common prefixes while marking complete keys explicitly.
3. [Trie insertion, lookup and deletion](trie-operations.md): maintain a string set without losing shared paths.
4. [Prefix reporting and longest prefixes](trie-prefix-queries.md): enumerate completions and remember the last complete key.
5. [A substring-search baseline](substring-baseline.md): compare candidates without hidden slicing costs.
6. [KMP and reusable border information](kmp-matching.md): avoid restarting work after a mismatch.
7. [Rolling hashes and exact verification](rolling-hash-search.md): update a fingerprint and handle collisions correctly.
8. [Choosing a string method](string-choices.md): compare preprocessing, output costs and application requirements.

This is an optional extension beyond the lecture inventory, with original examples. It does not change CS2040HS assessment scope. Read [maps and hashing](../maps-sets-hashing/maps-sets-hashing.md), [tree traversal](../searching/bst-traversal.md) and [sequence patterns](../strategies/sequence-patterns.md) for useful prerequisites. Recursion is useful background, although the trie operations here are iterative.

The examples use ordinary Python code listings. They index Python string code points, use exact case-sensitive equality unless a transformation is explicitly applied, and leave input strings unchanged. The [coverage review](../../coverage-review.md) records remaining advanced extensions.
