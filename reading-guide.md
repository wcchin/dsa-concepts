# Reading routes and prerequisites

The sidebar follows a suggested learning sequence: foundations and structures, spatial search, graph methods, optional extensions, then integrated applications. You can also follow a shorter route. The [concept index](concepts.md) supports individual questions. These routes show how the ideas build on one another.

| Route | Read in this order | What connects it |
|---|---|---|
| Foundations | [1. Python objects](topics/foundations/foundations.md) → [2. Analysis and correctness](topics/analysis/analysis.md) → [3. Recursion](topics/recursion/recursion.md) → [4. Sorting](topics/sorting/sorting.md) | Specify behaviour, trace state, prove progress, then count work |
| Representations and ordered search | [5. Sequences, stacks, queues and deques](topics/linear-structures/linear-structures.md) → [6. Maps and hashing](topics/maps-sets-hashing/maps-sets-hashing.md) → [7. Searching and BSTs](topics/searching/searching.md) → [8. AVL](topics/balanced-trees/balanced-trees.md) | Compare the same requested operations under different invariants |
| Spatial branch | [7. BST bounds](topics/searching/tree-basics.md) → [8. Balanced trees](topics/balanced-trees/balanced-trees.md) → [9. Spatial search and indexing](topics/kd-trees/kd-trees.md) | Compare point-based cuts, midpoint cells and enclosing object rectangles |
| Graph algorithms | [10. Priority queues](topics/heaps/heaps.md) → [11. Traversal](topics/graphs/graphs.md) → [12. Union–find](topics/union-find/union-find.md) → [13. Graph algorithms](topics/graph-algorithms/graph-algorithms.md) | Queues, heaps and partitions become algorithm components |
| Optional design extension | [14. Strategies](topics/strategies/strategies.md), after Topics 1–4; graph examples are useful additional context | Greedy proofs, DP state reuse, backtracking and sequence patterns |
| Optional strings extension | [6. Hashing](topics/maps-sets-hashing/maps-sets-hashing.md) and [7. Tree traversal](topics/searching/bst-traversal.md), then [15. Strings and tries](topics/strings/strings.md) | Key length, shared prefixes and reusable pattern information |
| Integrated transport case | [11. Traversal](topics/graphs/graphs.md), [12. Union–find](topics/union-find/union-find.md) and [13. Graph algorithms](topics/graph-algorithms/graph-algorithms.md) → [16. Applications](topics/applications/applications.md) | Choose the objective and weight model before combining structures |

Topic 9 follows BSTs and AVL trees to compare spatial invariants with one-dimensional ordering; AVL rotations do not generally preserve k-d-tree partitions. Topics 10–13 establish heaps, traversal and union–find before graph optimisation. Within Topic 13, only Kruskal requires the disjoint-set class. Spatial search is not a prerequisite for the graph route, and Topics 14–15 are optional extensions: the transport case in Topic 16 can be read directly after Topic 13.

Python is the reference for explanations and traces. Every code panel also offers JavaScript and Julia tabs; choose a language with a click or tap. Read the [code language guide](code-languages.md) for indexing, mutation and download conventions.

## A common reasoning thread

Each topic asks what the input means, which operations are required, what the representation stores, which invariant remains true, why the procedure finishes, and how work and live storage grow. Use the [correctness checklist](topics/analysis/correctness.md) and [cost model](topics/analysis/counting-work.md) across the whole book.

Tie rules and boundary conventions are local contracts. Binary search can use inclusive or half-open intervals if its updates match. BSTs here keep distinct keys; k-d trees send coordinate ties right; priority queues use arrival counters when stable ties are wanted. Follow the stated convention rather than transferring a rule by name alone.

For current scope, conceptual-only coverage and future additions, see [Coverage and extensions](coverage-review.md). [Topic 16](topics/applications/applications.md) now brings these ideas together through a complete fictional transport-network case.

## Check your reasoning as you read

All sixteen topics use a self-reading format: two learning goals and prerequisite links at the start of each reading, then a misconception reminder and two prediction questions with expandable explanations. Predict a branch or result before opening the panel; use a mismatch to identify which boundary or invariant to revisit. These are ungraded, original examples.

The spatial sidebar groups k-d trees, point quadtrees, PR quadtrees and R-trees. Compare construction/insertion, exact lookup, range search, nearest search and deletion for each method. The R-tree range helpers precede the exact lookup that reuses them. Compare the cost summaries only after checking which code, occupancy assumptions, node visits and geometry tests each bound describes.


## Plan study blocks around the work

Reading a definition, tracing a figure and understanding a complete class require different effort. The blocks below are suggested stopping places, not equal-duration lessons or measured reading-time estimates. Split a block again when you need to draw references, trace code or attempt the checks. Short method/contract pages often orient the longer implementation that follows.

| Topic | Suggested study blocks | Main effort to allow for |
|---|---|---|
| [1. Foundations](topics/foundations/foundations.md) | Problems and references; mutation and copies; classes and ADTs | Draw shared objects and distinguish slot updates from object updates |
| [2. Analysis](topics/analysis/analysis.md) | Counts and growth; cases and bounds; code/storage; correctness | Derive a count or invariant before reading its simplified claim |
| [3. Recursion](topics/recursion/recursion.md) | Calls and frames; split/merge trace; costs and allocation choices | Follow returns as well as calls; count live state separately |
| [4. Sorting](topics/sorting/sorting.md) | Insertion/bubble; merge; partition/quicksort; runs/comparison/lower bound | Compare different invariants using the same sorting contract |
| [5. Linear structures](topics/linear-structures/linear-structures.md) | ADT interfaces; arrays/growth; linked edits; queue implementations/choices | Trace empty/singleton transitions and safe link-update order |
| [6. Hashing](topics/maps-sets-hashing/maps-sets-hashing.md) | Map/Set contracts; hashing/chaining; probing; rebuilding/choices | Follow a collision chain and tombstones before maintenance costs |
| [7. Searching/BSTs](topics/searching/searching.md) | Array search; tree bounds/insertion; traversal/ranges; deletion/public interface | Keep global bounds and returned subtree roots consistent |
| [8. AVL](topics/balanced-trees/balanced-trees.md) | Invariants/rotations; case identification; updates/operation comparison | Draw transferred subtrees and recompute heights bottom-up |
| [9. Spatial search](topics/kd-trees/kd-trees.md) | Shared queries; k-d trees; point quadtrees; PR quadtrees; R-trees; comparison | Give each method its own block; distinguish ownership, enclosure and exact geometry |
| [10. Heaps](topics/heaps/heaps.md) | Priority/shape; repairs; build; records/sorting/costs | Separate complete shape, heap order and application tie policies |
| [11. Graphs](topics/graphs/graphs.md) | Model/representation/updates; BFS; DFS/components; costs | Trace frontier and parent state against stored neighbour order |
| [12. Union–find](topics/union-find/union-find.md) | Partitions/forests; weighted union/compression; applications | Track membership, representative, element count and component count separately |
| [13. Graph algorithms](topics/graph-algorithms/graph-algorithms.md) | Topological order; relaxation/Dijkstra/DAG paths; cuts/Prim/Kruskal; comparison | State the objective before choosing a safe processing order |
| [14. Strategies](topics/strategies/strategies.md) | Strategy/greedy; DP; backtracking; sequence patterns/limits | Give each new state model its own worked trace |
| [15. Strings](topics/strings/strings.md) | String/trie model; trie updates/prefix queries; baseline/KMP; rolling hash/choices | Trace terminal flags, fallback lengths and exact verification separately |
| [16. Applications](topics/applications/applications.md) | Model; hop/time routes; connectivity/design; interpretation | Reuse one dataset while changing the objective and units explicitly |

On a first pass, state the contract and trace the supplied example. On a second pass, explain the invariant, implementation choices and full costs, then try the checks without the answers. Revisit prerequisite links when a trace fails; you do not need to restart an entire topic.

## Read local contracts with a shared vocabulary

| Term or convention | How to read it across the book |
|---|---|
| ADT, representation, implementation | Behaviour promised to a client; stored organisation/invariant; code that maintains it |
| Key, value, node, reference | A comparison/lookup field; associated data; a structural object; access to an object. These roles can differ even in one example |
| Observe versus mutate | Observe the logical collection versus change it. Union–find queries may compress representation links while preserving the partition |
| Remove versus extract | Read the named operation's contract. Stack/queue extraction returns the selected record; Set removal of a specified key may return None or report a Boolean state change |
| Missing versus stored None | None can be legitimate data in several containers. The local contract chooses exceptions, sentinels or absence results |
| Working versus output storage | Working storage excludes the existing input and returned output when stated separately. This book's default auxiliary-space convention includes newly allocated output unless explicitly excluded |
| Height, visits and output size | Height bounds a path. A range or spatial query can visit many paths and must pay to report its answers |

The brief [ADT introduction](topics/foundations/adt-basics.md) and [analysis conventions](topics/analysis/code-and-space.md#auxiliary-and-output-space) define these distinctions. Later pages make their particular result, tie, boundary and error policies explicit.
