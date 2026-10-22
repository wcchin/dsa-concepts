# Prefix reporting and longest stored prefixes

(trie-autocomplete)=
## Descend to a prefix, then report its terminal descendants

A prefix lookup first follows one path. Reporting completions must then visit the matching subtree; finding the prefix does not make every answer free. This generator reuses the preceding `Trie` class.

```python
def words_with_prefix(trie, prefix):
    node = trie._walk(prefix)
    if node is None:
        return
    path = list(prefix)
    if node.terminal:
        yield prefix
    stack = [(node, iter(node.children.items()))]
    while stack:
        try:
            char, child = next(stack[-1][1])
        except StopIteration:
            stack.pop()
            if stack:
                path.pop()
            continue
        path.append(char)
        if child.terminal:
            yield "".join(path)
        stack.append((child, iter(child.children.items())))
```

For the shared keys inserted in the order on the preceding page, `list(words_with_prefix(trie, "bu"))` gives `["bus", "buses", "busy"]`. Prefix `"bus"` includes `"bus"` itself because its node is terminal. Missing prefixes yield nothing. Prefix `""` enumerates every stored key, including the empty key if present.

(trie-reporting-state)=
## Restore the path when a suspended frame completes

The list `path` spells the node at the top of the DFS stack. Each frame retains its child iterator, like [iterative DFS's suspended frames](../graphs/depth-first-search.md#iterative-dfs). Entering a child appends its symbol; finishing that child pops the symbol. Joined strings are independent outputs, so later path changes do not alter earlier results.

![The subtree below bu contains the complete keys bus, buses and busy; be and car are outside the query subtree.](../../assets/strings/trie-prefix-report.svg)

Dictionary insertion order determines traversal order; it is not a promise of alphabetical or relevance order. Sorting all results adds comparison work and storage. A ranked autocomplete service additionally needs scores and a top-k policy; this generator supplies prefix reporting only. Do not mutate the trie during iteration. Because this is a generator, traversal and argument validation occur when it is advanced.

(trie-prefix-output-cost)=
## Charge for visited nodes and emitted symbols

For prefix length L, V visited nodes in the selected subtree, and Z code points across the emitted strings, a full enumeration takes expected $O(L+V+Z+1)$ time. Joining each result costs its full length, including the shared prefix. The generator's working state is $O(L+H+1)$, where H is the maximum depth below the query node; it does not push every child at once. Collecting results into a list additionally stores the result references and their characters. A failed prefix lookup costs at most $O(L+1)$.

(trie-longest-stored-prefix)=
## Remember the deepest terminal node, not just the deepest path

```python
def longest_stored_prefix(trie, text):
    if not isinstance(text, str):
        raise TypeError("expected a string")
    node = trie.root
    best = 0 if node.terminal else None
    for i, char in enumerate(text):
        node = node.children.get(char)
        if node is None:
            break
        if node.terminal:
            best = i + 1
    return None if best is None else text[:best]
```

`"buseshed"` returns `"buses"`; `"bustop"` returns `"bus"`; `"buoyant"` returns `None` in the shared set, even though part of its path exists. If the empty key is stored, it can be the answer `""`, which is distinct from `None`.

For text length L, scanning takes expected $O(L+1)$ time and constant working space, plus up to $O(L)$ storage to return a sliced prefix. Applications include hierarchical identifiers; actual IP routing uses bit prefixes and network masks, not naive character prefixes of dotted addresses.

Next: [Substring-search baseline](substring-baseline.md).
