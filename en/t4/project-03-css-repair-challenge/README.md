# Project 03 — CSS Repair Challenge

## Objective

Diagnose a preserved generated stylesheet and restore flow, responsive layout, readable notice colors, intrinsic card height, and visible focus through one targeted cascade layer.

## Workflow

Run your starting page at 390 and 1024 px before editing. Use computed styles to trace each defect to the legacy declaration and declared layer order. Classify it as a cascade, flow, sizing, or focus problem.

Give Codex the bounded repair task from `spec.md`. Reject edits outside `public/repair.css`, selector escalation, `!important`, hidden overflow, fixed card heights, or a copied replacement stylesheet. Inspect how each proposed declaration addresses one observed cause.

## Success criteria

- Baseline, objective, and regression checks pass.
- Navigation remains in flow and wraps above content.
- Main content is one column below 48rem and sidebar/content Grid above it.
- Notice colors, visible focus, and intrinsic card height match the contract.
- Only `public/repair.css` differs from your starting project.

## Debugging task

Temporarily place the repair layer before the legacy layer. Inspect the changed computed values and explain why layer order is resolved before selector specificity. Restore the canonical order and rerun all checks.

## What you should be able to explain

- Cascade layers versus specificity.
- Normal flow versus fixed positioning.
- Intrinsic height and why clipping is not a repair.
- Content-driven breakpoints and Grid track sizing.
- Why focus visibility is observable behavior.
