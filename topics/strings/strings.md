# 15. Strings, tries and pattern matching

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

## A common operation and implementation route

Across eight readings, specify the query, comparison units, valid inputs and result/error policies before tracing nodes or matches. Then connect the invariant to implementation choices, preprocessing, working/index state and output costs. Use the same empty, overlapping and equal-prefix cases when comparing methods; a faster scan must still satisfy the same match contract.

The [complete trie interface](trie-operations.md#trie-complete-interface) includes key count, emptiness, insert/delete boolean returns and the size field. The [cost comparison](string-choices.md#string-method-cost-summary) distinguishes prefix indexing from all-match scanning. Trie-node, prefix-query and KMP helper dependencies are explicit; advanced ranking, approximate/multiple-pattern and suffix-index methods remain extensions.

Code listings offer Python, JavaScript and Julia tabs where a runnable example is present. Python remains the explanation and trace language; see the [language guide](../../code-languages.md) for native conventions and runnable topic downloads.
