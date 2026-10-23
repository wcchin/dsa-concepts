# Reading the code in three languages

Python is the book’s main explanation and tracing language. Every existing Python listing has a parallel JavaScript and Julia tab. Pages that explain a concept without code do not add empty panels. Choose the language you want to read; clicking or tapping a language in one panel also selects it in the other panels on that page. The tabs display code rather than execute it.

Figures, exact trace indices and self-check answers retain their Python conventions. The other implementations preserve the algorithm or demonstrate the corresponding language feature; they do not make Python-specific behaviour universal.

## Shared ideas, native conventions

| Concern | Python | JavaScript | Julia |
|---|---|---|---|
| Sequence positions | Start at 0 | Start at 0 | Ordinary vectors start at 1 |
| Explicit absent result | None | null | nothing |
| Teaching mutator with no result | Returns None | Returns undefined implicitly | Explicitly returns nothing |
| Public operations | Usually instance methods | Usually instance methods | Functions dispatched on the container; ! marks mutation where used |
| Multiple results | Tuple | Array | Tuple |
| Value versus identity | == versus is | Primitive equality versus reference identity; array contents need explicit comparison | == versus === |
| Unordered map/set iteration | Follow the locally stated guarantees | Map and Set preserve insertion order | Dict and Set order is not promised to match Python |
| Sorting APIs | sorted copies; list.sort mutates and returns None | Copy first when needed; Array.sort returns the mutated array | sort copies; sort! mutates and returns the array |

Read the actual function names in the selected listing. For example, Julia queue operations are enqueue!(queue, item), queue_front(queue), and dequeue!(queue); public counts use length and isempty. A successful Julia boundary-search result can be length(a)+1, just as the zero-based versions can return len(a). Union–find members and quadrant/coordinate indices follow the native index base too.

The brief built-in API examples are comparisons, not claims that JavaScript or Julia uses Python’s Timsort/Powersort implementation. The supplied teaching sort functions still implement the named algorithm explicitly.

## Comparison and arithmetic assumptions

Parallel numeric examples use finite values whose ordering and equality agree across the languages. JavaScript Number integers and all intermediate exact integer operations must stay within their safe representable range. Julia Int is bounded; Python’s arbitrary-size integer behaviour should not be assumed for it. Use appropriate big-integer arithmetic when the problem requires it. Rolling fingerprints and the integer R-tree orientation predicate show that choice explicitly.

JavaScript Map/Set compares array/object keys by identity. The spatial code therefore compares two coordinates explicitly and uses a canonical coordinate key for duplicate tracking; ordinary map examples use primitive keys. The teaching hash helpers use h(k)=k for integer traces and make their alternative string hashing explicit. Do not expect a native runtime’s physical hash table to reproduce a diagram’s slot layout.

## Strings need a position model

The string algorithms match Unicode code points. JavaScript and Julia convert text and pattern to character arrays before indexed scanning. This adds O(n+m) preparation time and storage even where the Python scan itself needs constant working space. Trie prefix helpers that collect text also pay for that buffer. The extra preparation is part of these implementations’ full costs.

JavaScript match outputs are zero-based code-point positions, not necessarily offsets accepted by native UTF-16 string slicing. Julia match outputs are one-based positions in the collected character vector, not byte indices into a UTF-8 String. A prefix-function table stores prefix lengths, so its values do not shift with the index base. Normalisation and case transformation remain explicit modelling decisions.

## Run code with its prerequisites

Each code-bearing page links complete runnable JavaScript and Julia topic files. Those files include the relevant earlier definitions and [JavaScript support](examples/languages/support.js) or [Julia support](examples/languages/support.jl), so a downloaded topic file can run without third-party packages. Use Node for a JavaScript file and Julia for a Julia file. The source listings keep helpers separate so their role remains visible.

The shared support contains a linked deque and a binary min-heap. Deque endpoints update a fixed number of links; heap insertion/removal repair a logarithmic path. Neither implementation repeatedly shifts an array’s front or sorts all priorities. Payload allocation, numeric operations and dictionary/set assumptions still need the cost qualifications on the relevant reading.

Topic downloads collect independent examples as well as definitions. A repeated name can start a fresh example; do not carry a changed dataset into a later figure unless its page says to do so. JavaScript’s generated topic files use var for repeated top-level demonstration bindings so the collected file can run; algorithm-local declarations remain unchanged. Julia examples use local scopes where a top-level loop would otherwise make assignment ambiguous.

JavaScript and Julia are checked against shared behavioural fixtures where contracts agree: empty/singleton boundaries, duplicates, rejected requests, mutation/ownership, traversal and query results. Valid tie outcomes can differ with map iteration; the tests compare the promised result rather than inventing a stronger tie rule. Python-only conceptual explanations remain labelled, especially object-model and mutable-default discussions.

The original standalone [spatial](examples/spatial_search.py) and [transport](examples/transport_network.py) Python scripts remain available. The three-language [binary-search example](topics/searching/binary-search.md) is a short starting point.

## Complete topic downloads

| Topic | JavaScript | Julia |
|---|---|---|
| 1. Foundations and Python’s object model | [JavaScript](examples/languages/foundations.js) | [Julia](examples/languages/foundations.jl) |
| 2. Analysing algorithms | [JavaScript](examples/languages/analysis.js) | [Julia](examples/languages/analysis.jl) |
| 3. Recursion and divide-and-conquer | [JavaScript](examples/languages/recursion.js) | [Julia](examples/languages/recursion.jl) |
| 4. Sorting | [JavaScript](examples/languages/sorting.js) | [Julia](examples/languages/sorting.jl) |
| 5. Sequences, stacks, queues and deques | [JavaScript](examples/languages/linear-structures.js) | [Julia](examples/languages/linear-structures.jl) |
| 6. Maps, sets and hashing | [JavaScript](examples/languages/maps-sets-hashing.js) | [Julia](examples/languages/maps-sets-hashing.jl) |
| 7. Searching and binary search trees | [JavaScript](examples/languages/searching.js) | [Julia](examples/languages/searching.jl) |
| 8. Balanced search trees | [JavaScript](examples/languages/balanced-trees.js) | [Julia](examples/languages/balanced-trees.jl) |
| 9. Spatial search and indexing | [JavaScript](examples/languages/kd-trees.js) | [Julia](examples/languages/kd-trees.jl) |
| 10. Priority queues and heaps | [JavaScript](examples/languages/heaps.js) | [Julia](examples/languages/heaps.jl) |
| 11. Graphs and traversal | [JavaScript](examples/languages/graphs.js) | [Julia](examples/languages/graphs.jl) |
| 12. Union–find and disjoint sets | [JavaScript](examples/languages/union-find.js) | [Julia](examples/languages/union-find.jl) |
| 13. Graph ordering, paths and spanning trees | [JavaScript](examples/languages/graph-algorithms.js) | [Julia](examples/languages/graph-algorithms.jl) |
| 14. Algorithmic problem-solving strategies | [JavaScript](examples/languages/strategies.js) | [Julia](examples/languages/strategies.jl) |
| 15. Strings, tries and pattern matching | [JavaScript](examples/languages/strings.js) | [Julia](examples/languages/strings.jl) |
| 16. Integrated applications: a transport network | [JavaScript](examples/languages/applications.js) | [Julia](examples/languages/applications.jl) |
