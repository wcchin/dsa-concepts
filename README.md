# DSA Concepts — Data Structures and Algorithms

A standalone Jupyter Book 2 project for a searchable, self-reading course resource.

## Contents

- Sixteen topic areas, with alphabetical and topic-based concept indexes.
- A developed Foundations topic: four reading pages, an overview and three object diagrams.
- A developed Algorithm Analysis topic: five reading pages, an overview and three original mathematical figures.
- A developed Recursion topic: five reading pages, an overview and eight original SVG explanations.
- A developed Sorting topic: seven reading pages, an overview and seven original SVG explanations.
- A developed Linear Structures topic: nine reading pages, an overview and twelve original SVG explanations.
- A developed Maps, Sets and Hashing pilot: seven concept pages and an overview.
- Searching and BSTs: eight reading pages and nine original SVG figures.
- Balanced search trees: five reading pages and five original SVG figures.
- Spatial search and indexing: twelve reading pages and fourteen original SVG figures. Retains five k-d-tree readings and adds spatial-query foundations, separate point/PR-quadtree readings, complete quadtree operations, given-tree R-tree filtering/refinement and a runnable comparison.
- Graphs and traversal: six reading pages, an overview and eight original SVG explanations.
- Priority queues and heaps: seven reading pages, an overview and nine original SVG explanations.
- Graph ordering, shortest paths and spanning trees: eight reading pages and nine original SVG figures.
- Union–find: four reading pages and five original SVG figures.
- Optional algorithm design: six reading pages and four original SVG figures.
- Optional strings and tries: eight reading pages and nine accessible SVG figures, with trie updates/prefix queries, naive substring search, KMP and verified rolling hashes.
- Integrated transport application: six reading pages, five accessible SVG figures and a standalone standard-library Python example.
- A prerequisite reading guide and public coverage review.
- An original probing-deletion diagram.
- An author-facing source inventory under `planning/`.
- A build-check workflow and automatic publishing on pushes to `main`.

No notebooks, rubric files, solution files, slide files or Git history are included. Topic 14 develops one complete transport-network application; dependency scheduling and a spatial directory remain possible future cases.

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

Topics 1–14 and optional Topics 15–16 contain developed reading material. See `coverage-review.md` for remaining gaps and `planning/coverage-audit.md` for the editorial review. No content licence has been selected yet.

