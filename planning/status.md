# Book development status

- Fourteen topic areas retained. Topics 1 and 6 now contain developed self-reading explanations; twelve topic areas remain outlines.
- Topic 1: four pages covering problem requirements; objects and references; mutation and copying; collections, classes and invariants. Three original SVG diagrams illustrate aliasing/rebinding, shallow copying and linked objects.
- Topic 1 uses explicit concept labels for stable indexed targets. The alphabetical and topic-grouped indexes include these concepts and retain the Topic 6 entries.
- Source basis: Week 1 classroom and online lecture material; the general problem/representation framing also follows the course introduction. No notebook, rubric or solution file was used. The book text consolidates the slide explanations rather than reproducing presentation directives.
- Editorial corrections: the passenger-count class validates nonnegative integer updates; linked-object examples distinguish the node from its stop payload and mutation from rebinding.
- Jupyter Book 2.1.7 remains pinned. Pushes to main build and publish automatically; pull requests build without publishing.

Next: develop Topic 2 (Analysing algorithms), followed by recursion, sorting and linear structures. Continue adding concept entries as explanations become available.
