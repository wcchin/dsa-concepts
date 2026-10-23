# Whole-book editorial review — 23 October 2026

Scope: all 141 navigation pages, including sixteen overviews and 120 readings; reading routes, goal/prerequisite cues, section progression, contracts/terminology, repetition, implementation dependencies and workload. This editorial pass leaves executable algorithms, examples, diagrams, explicit concept labels and topic numbering unchanged. It uses the public book, not notebooks, rubrics, solutions or assessment materials.

## Overall judgement

The current sequence is coherent: foundations → analysis/recursion/sorting → linear and keyed structures → ordered trees → spatial branch → heaps/graphs/union–find/graph algorithms → optional strategies/strings → applications. No further topic reorder is needed. The graph route can skip spatial search, and the transport case can follow Topic 13 without requiring optional Topics 14–15.

There is useful reinforcement but no exact repeated long prose paragraph across topic pages in the source check (28-word threshold, excluding standard scaffolding/code/tables). Related explanations have different roles: Topic 1 introduces ADTs, Topic 5 specifies full linear interfaces; Topic 3 uses merge sort to explain recursion, Topic 4 compares sorting strategies; Topic 11 computes static components, Topic 12 maintains partitions. Keep these connections explicit rather than deleting necessary context for direct search arrivals. This check does not claim that all semantic repetition is absent.

The clearest problems were development-history language in public introductions, stale rollout instructions and inconsistent end-of-page routes. Several dense readings also need natural stopping points. Equalising word counts would obscure the difference between a short contract page and a complete implementation; the revision instead adds a study-block guide and targeted pause cues. These are teaching judgements, not measured reading-time estimates.

## Topic findings and actions

| Topic | Editorial finding and retained role | Action in this pass |
|---|---|---|
| 1 Foundations | Object identity/sharing must be established before costs; the classes reading combines two distinct tasks | Remove changelog prose; add pause cues between mutation/copying and state/linked-object work |
| 2 Analysis | Counts, case/bound distinctions, storage and correctness form a sound route; code/space is a dense two-part reading | Add a storage pause and the missing continuation to correctness; link correctness onward to recursion |
| 3 Recursion | Calls/returns, merge decomposition and allocation have distinct roles | Keep the detailed figures/code, make the sorting continuation explicit and remove preservation history |
| 4 Sorting | Contracts, concrete algorithms, practical runs and the lower-bound argument are coherent | Retain reuse of Topic 3 merge code with its stated role; add onward route to linear structures |
| 5 Linear structures | ADTs precede storage mechanics; queue variants share the promised FIFO behaviour | Restore arrays → growth → linked-structures continuations; guide study blocks rather than add interfaces |
| 6 Hashing | Map/Set behaviour correctly precedes hashing and storage helpers; probing mixes lookup and maintenance | Add a pause before update helpers; retain tombstone, helper/public return and expected/amortised distinctions |
| 7 Searching/BSTs | Array boundaries, global tree bounds and returned-root updates build coherently | Clarify that examples start from the indicated reference tree; keep ordinary BST costs distinct from AVL |
| 8 AVL | Search/read contracts remain shared while updates maintain a stronger invariant | Separate the sidebar continuation to spatial search from the optional direct route to heaps; remove changelog prose |
| 9 Spatial search | Four methods are substantial study blocks, not one equal-sized lesson; R-tree exact lookup depends on range helpers | Align overview and final links with representation → range → operations; add PR/R-tree pause cues; preserve five-operation comparison |
| 10 Heaps | Shape, order, numeric helpers, record adapters and sorting have separate contracts | Replace preservation notes with trace guidance; keep min/max and FIFO-tie conventions local |
| 11 Graphs | Discovery/expansion/completion and static snapshots are coherent with stored neighbour order | Replace history notes with ordering guidance; keep graph mutation distinct from traversal results |
| 12 Union–find | Element count, component count and component size need explicit separation | Clarify the three observations; lead to Topic 13 overview before the later Kruskal page |
| 13 Graph algorithms | Dependency order, shortest paths and spanning forests optimise different results | Keep objective distinctions; replace figure-preservation notes with heap/parent meaning cues |
| 14 Strategies | Different sufficient-state models justify different methods; the complete DP example is dense | Add a recurrence-to-tabulation pause; retain optional status and provide separate study blocks |
| 15 Strings | Key, prefix and substring questions share string units but need distinct structures | Add a prefix-table-to-scan pause for KMP; preserve empty/overlap semantics and Boolean Trie mutation returns |
| 16 Applications | A flexible question/model/method/result/interpretation route fits the case | Retain all six readings, units, graph assumptions and scope; include model/routes/design/interpretation study blocks |

## Shared language and dependency checks

The reading guide now makes ADT/representation/implementation; key/value/node/reference; logical observation versus representation mutation; local removal returns; missing versus stored None; and working/output/auxiliary storage explicit in one place. It does not impose identical operation names or return conventions on different ADTs. All reading prerequisite cues resolve; none requires a later reading in sidebar order. Overview links to later applications are labelled connections rather than hidden prerequisites.

Keep helpers beside linked definitions, especially BST/AVL returned roots, Kahn in DAG paths, the disjoint-set class in Kruskal, TrieNode/prefix generators, and shared spatial predicates. The R-tree range helper is introduced before its exact-query reuse. The public spatial example and transport script continue to provide their own executable context.

## Progress records

[status.md](status.md) is the authoritative task checklist. [coverage-review.md](../coverage-review.md) contains scope boundaries and content priorities; [topic-inventory.md](topic-inventory.md) contains provenance; [self-reading-pilot.md](self-reading-pilot.md) is the current editorial guide despite its historical filename. The earlier coverage audit is preserved in [one archive](archive/development-history-2026-10-23.md). Public introductions no longer present completed alignment work as a pending pilot.

The two authorised priorities—whole-book editorial review and progress-list cleanup—are complete in this revision. Language tabs, interactive tools and new content have not been implemented by this pass.
