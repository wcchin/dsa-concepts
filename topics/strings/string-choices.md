# Choosing a string method

**After this page, you should be able to:**

- Select a string structure or matcher from its query and reusable information.
- Compare preprocessing, worst-case scanning, persistent state and output costs.

**Builds on:** [Trie operations](trie-operations.md), [prefix queries](trie-prefix-queries.md), [KMP](kmp-matching.md) and [verified rolling search](rolling-hash-search.md).

(string-method-selection)=
## Match the operation and the reusable work

| Requirement | Natural starting point | What to count |
|---|---|---|
| Exact keys with associated records | Dictionary or a trie map extension | New key hashing/equality can depend on length; a set trie does not store payloads |
| All stored keys starting with a prefix | Trie prefix reporting | Prefix descent, subtree traversal and emitted characters |
| Most specific stored prefix of a query | Trie with remembered terminal position | Query symbols inspected and returned-prefix copying |
| A few simple substring queries | Python string methods; naive code for learning | Required first/all/overlapping semantics |
| Predictable worst-case all-match search | KMP | Pattern preprocessing, text scan and output positions |
| Rolling fingerprints for windows | Verified rolling hash | Window updates, collision/true-match verification and arithmetic model |

A trie indexes a collection of keys. KMP preprocesses one pattern. A rolling hash maintains a summary of one window. They retain different information for different workloads; one need not replace all the others.

(string-matching-boundaries)=
## Reuse the same boundary cases across implementations

| Text | Pattern | All-match answer |
|---|---|---|
| `"ababa"` | `"aba"` | `[0,2]` |
| `"aaaa"` | `"aa"` | `[0,1,2]` |
| `"bus"` | `""` | `[0,1,2,3]` |
| `""` | `""` | `[0]` |
| `""` | `"a"` | `[]` |
| `"bus"` | `"buses"` | `[]` |
| `"Bus"` | `"bus"` | `[]` under exact comparison |

For tries, check duplicate insertion, missing deletion, a key that prefixes another, the empty key, and a missing prefix. Compare all reported completions with filtering a simple reference set. Check complete node paths as well as terminal flags after deletion.

(string-indexing-extensions)=
## Name what a production search system adds

Ranked autocomplete needs scoring and update policies. Approximate spelling search needs an edit-distance model. Searching many patterns together suggests an automaton such as Aho–Corasick; many queries against one fixed text may justify a suffix array or suffix tree. Compressed radix tries can reduce unary chains, while Boyer–Moore offers another substring-skipping strategy. These are further extensions, not implemented here.

A book's search engine also needs tokenisation, document indexing and ranking. The structures in this topic explain components and invariants; they are not a replacement search backend for this Jupyter Book.

For geographic names, preserve display spellings and make language/normalisation policies explicit. A character trie supplies no geographic distance or synonym knowledge: proximity search remains a [spatial-index](../kd-trees/kd-trees.md) question.

(string-method-cost-summary)=
## Compare the supplied implementations

Let L be a key/query length, S the total distinct stored key length, n text length, m pattern length, r returned positions, and c equal-hash candidate windows. Bounds assume expected child-dictionary access and constant-cost code-point operations; hash arithmetic uses fixed-size parameters.

| Method | Work | Working/index state and output |
|---|---|---|
| Trie exact lookup / insert / delete | Expected O(L+1) | Persistent index O(S+1); delete additionally stores O(L+1) path records |
| Trie prefix reporting | Expected O(L+V+Z+1), for V visited subtree nodes and Z emitted code points | O(L+H+1) generator workspace; collecting r strings adds O(r+Z+1) |
| Longest stored prefix | Expected O(L+1) | O(1) local workspace; up to O(L+1) returned prefix |
| Naive all-match, 1≤m≤n | O((n−m+1)m+1) worst-case | O(1) workspace; O(r+1) results |
| KMP all-match | O(n+m+r+1), including rebuilt prefix table | O(m+1) workspace; O(r+1) results |
| Verified rolling all-match, 1≤m≤n | O(n+m+cm) | O(1) workspace; O(r+1) results |

H is the maximum suffix depth below the reporting prefix. Trie construction costs the inserted key walks and newly stored prefixes; it is not free preprocessing. All three substring methods share the empty-pattern n+1-boundary result. Naive/rolling have an early long-pattern exit, while the shown KMP still builds its table. Count the implementation supplied rather than transferring another variant's shortcuts.

Complete-key count and emptiness are separate trie observers. Prefix path existence can be true when no complete key is stored, so it is not a replacement for either count or matching-key enumeration. The trie is a set, not an associated-value map or ranked autocomplete service.

:::{tip} Common misconception
**Every operation called search answers the same question.** Exact keys, prefix completions, longest prefixes and substring positions require different stored information and return different results.
:::

(string-choice-checks)=
## Check your understanding

Predict the result or justify the choice before opening the explanation.

**1. For many stored place names and all completions of bu, should KMP's pattern table replace a trie?**

:::{dropdown} Show explanation
Not for that operation directly. A trie indexes the collection by prefixes; KMP preprocesses one pattern for scanning a text. Workload and returned evidence differ.
:::

**2. Can the three substring matchers be compared against the same overlapping and empty-pattern oracle?**

:::{dropdown} Show explanation
Yes. Their result contracts match even though preprocessing, internal states and cost guarantees differ.
:::

Return to the [topic overview](strings.md), [concept index](../../concepts.md) or [coverage review](../../coverage-review.md).
