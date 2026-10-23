# DSA Concepts — Data Structures and Algorithms

A standalone Jupyter Book 2 project for a searchable, self-reading course resource.

## Contents

- Sixteen topic areas, with alphabetical and topic-based concept indexes.
- A developed Foundations topic: five reading pages, an overview and three object diagrams, including a brief ADT introduction.
- Algorithm Analysis: five aligned readings, an overview and three original mathematical figures, with explicit cost models, cases/bounds, expected/amortised distinctions, working/output storage, a complete search proof and ten self-checks.
- Recursion: five aligned readings, an overview and eight original SVG explanations, with input/result/mutation contracts, reachable base cases, call/return traces, correctness, precise depth/call/space distinctions, implementation comparisons and ten self-checks.
- A developed Sorting topic: nine reading pages, an overview and eight original SVG explanations. Algorithm readings align choices, stability, mutation, time/space and self-checks; includes a conceptual Timsort/Powersort overview.
- A developed Linear Structures topic: eleven reading pages, an overview and twelve original SVG explanations. Explicit sequence, stack, queue and deque contracts connect returns, boundaries, traces, implementation choices and costs; includes 22 self-reading checks.
- Maps, Sets and Hashing: seven aligned readings and an overview, with explicit Map/Set contracts, chaining/probing insert-update-delete helpers, rebuild examples, cost qualifications and fourteen self-checks.
- Searching and BSTs: nine aligned readings and nine original SVG figures, with ordered-set contracts, complete ordered queries and eighteen self-checks.
- Balanced search trees: six aligned readings and five original SVG figures, with shared ordered-set operations, qualified costs and twelve self-checks.
- Spatial search and indexing: seventeen reading pages grouped under four methods, with seventeen original SVG figures. Each method covers construction/insertion, exact lookup, range, nearest and deletion with time/space costs. Point-tree operations and given-tree R-tree queries have runnable code; general R-tree updates have worked algorithm traces.
- Priority queues and heaps: seven aligned readings, an overview and nine original SVG explanations, with min/max contracts, stable record adapters, explicit repair/allocation costs and fourteen self-checks.
- Graphs and traversal: seven aligned readings, an overview and eight original SVG explanations, with checked simple-graph updates, explicit BFS/DFS/component contracts and fourteen self-checks.
- Union–find: four aligned readings and five original SVG figures, with a fixed-universe interface, count/component-size observers, operation-cost comparison and eight self-checks.
- Graph ordering, shortest paths and spanning trees: eight aligned readings and nine original SVG figures, with objective/input/result contracts, explicit code dependencies, implementation-specific costs and sixteen self-checks.
- Optional algorithm design: six reading pages and four original SVG figures.
- Optional strings and tries: eight reading pages and nine accessible SVG figures, with trie updates/prefix queries, naive substring search, KMP and verified rolling hashes.
- Integrated transport application: six reading pages, five accessible SVG figures and a standalone standard-library Python example.
- A Topic 9 self-reading pilot: page goals, prerequisite links, misconception reminders and 34 prediction questions with collapsed explanations.
- A prerequisite reading guide and public coverage review.
- An original probing-deletion diagram.
- An author-facing source inventory under `planning/`.
- A build-check workflow and automatic publishing on pushes to `main`.

No notebooks, rubric files, solution files, slide files or Git history are included. Topic 16 develops one complete transport-network application; dependency scheduling and a spatial directory remain possible future cases.

## Repository

Source: https://github.com/wcchin/dsa-concepts

The project is standalone: `myst.yml` is at the repository root. It does not require access to the original course-material repository.

## Preview locally

Install Node 22, then run these commands from the folder containing `myst.yml`:

```bash
npm install -g jupyter-book@2.1.7
jupyter-book start
```

For static HTML:

```bash
jupyter-book build --html
```

The pinned builder matches the established geo-stat-vis workflow. Use Jupyter Book **v2** documentation; v1 configuration does not apply.

## Publish when ready

1. In this repository, select Settings → Pages → Source → GitHub Actions.
2. Push changes to `main` (including merging a pull request) to publish automatically.
   To rebuild manually, open Actions → Publish book → Run workflow on `main`.
3. Follow the deployment URL after the workflow succeeds.

Every push to `main` builds and publishes the site. Pull requests run the build check; merging them into `main` triggers publishing. The workflows derive the Pages base path from the repository name (`/dsa-concepts`). For a custom domain or an `owner.github.io` root site, adjust `BASE_URL` accordingly. Hosting availability for a private repository depends on the GitHub account's Pages entitlement.

## Editorial work

Read `planning/topic-inventory.md` for the source-based topics, page boundaries, lecture-source mapping and gaps. The inventory records the private course-source provenance but the source files themselves are not bundled. Do not place assessment solutions in this book project.

All sixteen topics contain developed reading material; Topics 14–15 are optional extensions beyond the lecture inventory. See `coverage-review.md` for remaining gaps and `planning/coverage-audit.md` for the editorial review.


## Licensing

© 2026 Benny Chin · Content **CC BY-NC-ND 4.0** · Code **MIT**.

Original explanations and diagrams use [CC BY-NC-ND 4.0](LICENSE-CONTENT.txt). Original executable code, including embedded code listings and downloadable examples, uses [MIT](LICENSE-CODE.txt). Third-party material retains its own terms. See [LICENSE.md](LICENSE.md) and [Licensing and attribution](licensing.md) for scope and attribution. Project-level licence metadata supplies the article-header notices; `assets/page-footer.md` supplies the shared page footer.
