# Choosing a string method

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

Return to the [topic overview](strings.md), [concept index](../../concepts.md) or [coverage review](../../coverage-review.md).
