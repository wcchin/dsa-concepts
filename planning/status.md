# Book development status

- Fourteen topic areas retained. Topics 1, 2, 3, 4 and 6 now contain developed self-reading explanations; nine topic areas remain outlines.
- Topic 1: four pages covering problem requirements; objects and references; mutation and copying; collections, classes and invariants. Three original SVG diagrams illustrate aliasing/rebinding, shallow copying and linked objects.
- Topic 1 uses explicit concept labels for stable indexed targets. The alphabetical and topic-grouped indexes include these concepts and retain the Topic 6 entries.
- Source basis: Week 1 classroom and online lecture material; the general problem/representation framing also follows the course introduction. No notebook, rubric or solution file was used. The book text consolidates the slide explanations rather than reproducing presentation directives.
- Editorial corrections: the passenger-count class validates nonnegative integer updates; linked-object examples distinguish the node from its stop payload and mutation from rebinding.
- Topic 2: four pages covering counting work, growth rates, cases versus bounds, and code/space analysis. Source basis is the Week 2 classroom and online lecture material. Three original figures show growth functions, quadratic bounds and full versus triangular loops.
- Topic 2 refinements: exact floor(log2 n) count for integer halving; explicit successful/unsuccessful average-search models; consistent inclusion of output in auxiliary space unless stated otherwise; word-model assumptions distinguished from bit costs. Its 27 indexed concepts use explicit labels.
- Topic 3: five reading pages and eight original SVG figures based on the Week 3 classroom and online materials. Retains the sum_to trace, eight-value split/merge example, sorted-front merge, odd-size split, balanced/unbalanced shape and list-front-removal explanations. Source images are redrawn as legible, accessible vector figures; the unrelated historical portrait is not part of the reading argument.
- Topic 3 explicitly separates sequential execution from tree shape, total calls from live depth, and peak space from cumulative allocation. The shown slicing-based merge sort has 2n−1 calls for n≥1, ceiling-logarithmic depth and linear peak additional list storage. Its 26 indexed terms use explicit concept labels.
- Topic 4: seven reading pages and seven original accessible SVG figures, based on Week 4 classroom and online lectures. Covers sorting contracts, keys, stability, insertion sort, bubble sort, partitioning, quicksort, strategy trade-offs and the comparison lower bound. No notebooks, rubric files or solution files were used.
- Topic 4 keeps the lecture’s <= partition tie rule, states inclusive code bounds, qualifies random-pivot expected time for distinct keys, accounts for recursion space, and supplies the required lower-bound inequality for log(n!). The index links to each labelled concept.
- Jupyter Book 2.1.7 remains pinned. Pushes to main build and publish automatically; pull requests build without publishing.

Next: develop Topic 5 (Abstract data types and linear structures). Continue adding concept entries as explanations become available.
