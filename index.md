# Data Structures and Algorithms

*Concepts, Python Examples, and Algorithmic Reasoning*

Developed from the CS2040HS teaching materials at the National University of Singapore, this guide explains how representations, operation rules and algorithmic strategies fit together. Read by topic to build understanding, or use search and the [concept index](concepts.md) to revisit a specific idea.

**Current coverage:** All sixteen topics have developed, aligned self-reading material, including a complete transport-network application. Topics 14–15 add optional DSA concepts beyond the lecture inventory. See the [coverage review](coverage-review.md) for additions, limitations and priorities.

Code panels offer Python, JavaScript and Julia. See the [language guide and topic downloads](code-languages.md); explanations and diagrams use Python as their reference.

## Choose a reading route

Start with [Foundations](topics/foundations/foundations.md), [Algorithm analysis](topics/analysis/analysis.md) and [Recursion](topics/recursion/recursion.md). These establish the language, cost models and proof habits used throughout the book.

Then choose the question you want to answer:

- **How should data be stored and accessed?** Read [linear structures](topics/linear-structures/linear-structures.md), [maps, sets and hashing](topics/maps-sets-hashing/maps-sets-hashing.md), [search trees](topics/searching/searching.md) and [balanced trees](topics/balanced-trees/balanced-trees.md).
- **How can ordering reduce work?** Read [sorting](topics/sorting/sorting.md), [search boundaries](topics/searching/search-boundaries.md) and [heaps](topics/heaps/heaps.md).
- **How do networks connect and support routes?** Read [graph traversal](topics/graphs/graphs.md), [union–find](topics/union-find/union-find.md), then [ordering, paths and spanning trees](topics/graph-algorithms/graph-algorithms.md). This follows Topics 11–13 in sidebar order, with union–find established before Kruskal.
- **How can spatial regions exclude candidates?** Read [spatial search and indexing](topics/kd-trees/kd-trees.md) after binary search trees: k-d trees, point quadtrees, PR quadtrees and R-tree filtering.
- **How do the structures work together?** Follow the [transport-network application](topics/applications/applications.md) from a data model through routes, connectivity and construction choices.
- **How should text be indexed and searched?** Read [Strings, tries and pattern matching](topics/strings/strings.md) for exact keys, prefix reporting, KMP and verified rolling hashes.
- **How do we design new algorithms?** Read [Algorithm design and sequence patterns](topics/strategies/strategies.md) for greedy proofs, dynamic programming, backtracking and reusable array techniques.

The [reading guide](reading-guide.md) gives prerequisites and shorter routes. The sidebar follows a suggested learning sequence; you can also use these shorter routes or search for individual concepts.

## Questions to carry through the book

What must the operation return? Which representation supports it? What remains true after each step? Why does it terminate? How does the work grow, and under which assumptions?

Figures and Python examples make these questions concrete. The examples are ordinary code listings: no notebook or course-repository access is required to read the book.
