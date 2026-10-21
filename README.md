# DSA Concepts — Data Structures and Algorithms

A standalone Jupyter Book 2 project for a searchable, self-reading course resource.

## Contents

- Fourteen topic areas, with alphabetical and topic-based concept indexes.
- A developed Foundations topic: four reading pages, an overview and three object diagrams.
- A developed Algorithm Analysis topic: four reading pages, an overview and three original mathematical figures.
- A developed Maps, Sets and Hashing pilot: seven concept pages and an overview.
- An original probing-deletion diagram.
- An author-facing source inventory under `planning/`.
- A build-check workflow and automatic publishing on pushes to `main`.

No notebooks, rubric files, solution files, slide files or Git history are included. Eleven topics remain scope outlines, not finished chapters.

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

Read `planning/topic-inventory.md` for the fourteen topics, page boundaries, lecture-source mapping and gaps. The inventory records the private course-source provenance but the source files themselves are not bundled. Do not place assessment solutions in this book project.

Topics 1, 2 and 6 contain developed reading material. Continue with Topic 3 (Recursion and divide-and-conquer). No content licence has been selected yet.

