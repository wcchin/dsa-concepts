# Self-reading editorial guide

Current scope: all sixteen topics and 120 reading pages. The format originated in Topic 9 and has completed its book-wide rollout. This file retains its historical name; it is the maintenance checklist, not an outstanding pilot task.

## Reader-facing pattern

- At the start: two specific learning goals and a short linked prerequisite cue.
- Main explanation: preserve the conceptual argument, worked examples, diagrams, algorithm contracts and complexity qualifications. Core knowledge is not hidden in a feedback panel.
- Near the end: one concise misconception reminder, followed by two visible prediction/reasoning prompts. Each explanation uses a default-closed MyST dropdown titled “Show explanation”.
- Keep the next-reading link after the checks. A wrong prediction should lead readers back to a specific rule, not merely supply a result to memorise.

The overview explains how to use the checks, maps code dependencies by route, and links to checks by concept. The concept index and reading guide point to that table without filling the alphabetical glossary with question headings.

## Editorial checks

- Prompts are open questions, with no marks or grading. All examples and feedback are original; no notebook, rubric, solution or assessment file was consulted.
- Include both a concrete state/branch prediction and an explanation, transfer or assumption check where appropriate.
- State hypothetical modifications explicitly so they are not confused with the shared seven-point dataset.
- Keep distinctions precise: full equality versus coordinate ties; closed queries versus half-open cells; point tests versus region tests; buckets versus pivots; candidates versus exact geometry; height versus visited work.
- Preserve concept labels and routes. When a later task changes code or a figure, verify it against its contract and update every dependent trace; editorial-only passes leave algorithms unchanged.
- Check the compiled HTML for closed details/summary controls, visible question text and complete answer content. Review desktop and narrow-screen presentation without changing established book branding.

## Maintain the completed rollout

When editing a reading, keep the goals and checks specific to its concept. Ensure prerequisite cues work for direct search arrivals and feedback explains why rather than only naming an answer. Adapt structure to scope: an analysis argument or integrated application does not need an artificial container-operation template. Use the study blocks in the [reading guide](../reading-guide.md) to manage effort rather than forcing equal page lengths.

## Current validation and tasks

Each of the 120 readings has two goals, a prerequisite/context cue, a misconception reminder and two collapsed-feedback checks (240 total). Keep essential explanation visible, code dependencies explicit and next-reading links consistent with the sidebar or a labelled alternative route. Current task status is maintained only in [status.md](status.md); the [editorial review](editorial-review.md) records topic-specific findings.
