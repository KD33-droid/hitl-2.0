# HITL 2.0 · Governance research console

A standalone presentation of the **proposed** HITL 2.0 architecture with four views of one synthetic session: architecture, simulator, dashboard and audit. The state machine plays versioned cases; it is not a research risk model, a policy interpreter, an execution service or an experiment.

## Run locally

Run commands in this directory. Developed with Node 24 and npm 11.

```sh
npm ci
npm run dev
```

For a presentation, use `npm run build` followed by `npm run preview`. Open the localhost URL printed by Vite. The static site in `dist/` needs no external assets, network services, credentials or Python process after building. Dependencies, generated output and tests stay in this subdirectory.

## Presenter walkthrough

1. Start in the overview. Drag to orbit, scroll or use +/− to zoom. Select a model, label or keyboard-accessible directory tile.
2. Inspect **Profile** and its **Dependencies & boundaries** disclosure. **Sources** lists repository paths, sections and what each supports.
3. Select **Human oversight** → **Focus component** to inspect the amber branch. The crosshair beside + resets the overview camera.
4. In an empty session, choose **Trace flow** for a schematic walkthrough. With a decision selected, the scene and inspector instead follow actual simulated events. A non-review decision has no human intervention in its playback.
5. Switch to **2D map**. It uses the same catalogue and keeps the current selection and trace. If the WebGL renderer fails or loses context, the map opens automatically. Reduced-motion preferences disable camera transitions and moving packets.
6. Open **Simulator**, set **release report / elevated-authority**, then **Start decision**. **Next event** advances one automatic transition; **Run to boundary** advances to an open request or audit record.
7. At the review card enter a rationale. **Refer for further review** moves this example to a second synthetic privileged reviewer; it remains pending. Approve or reject explicitly. Bounded release instead uses L2 confirmation, without referral. Leaving the view never resolves a request.
8. Open **Dashboard** and follow a contributing record. Use the session record selector to follow the same run in every view. **Replay** or the event slider only changes the inspection cursor; **Back to latest** resumes live inspection. Only **Start decision** creates another run.
9. In **Audit**, inspect the selected event and compare a locally edited copy to the original checkpoint. The original record, other views and dashboard counts are unaffected.
10. **Research notes** keeps the README control-plane flow distinct from WM1's five zones. **Fixture index** lists the authored cases. Reload the page to start an empty session.

## Contracts and evidence

- `src/catalogue.ts`: node descriptions, documentation anchors, repository implementation status, demo interpretation and the ordered flow.
- `src/scene/`: procedural geometry, studio lighting, connections, camera controls and projected labels. No 3D asset or HDR downloads.
- `src/simulation/contracts.ts`: demo-local proposal inputs, provisional routes, review responses, terminal dispositions and typed event payloads. Replay inputs exclude wall time and presentation controls.
- `src/simulation/scenarios.ts`: exact `(version, action, condition)` lookup. Unsupported combinations return `undefined`. No default allow, inferred score, threshold, conflict rule or level-selection algorithm.
- `src/simulation/engine.ts`: pure proposal → assessment → evaluation → provisional route → optional request/response → final → audit transitions. One logical second per event from a fixed UTC epoch; IDs are run-local. `reconstruct` replays versioned inputs and ordered reviewer responses into a separate history.
- `src/simulation/session.ts`: one ordered event array per run plus references into those arrays for cross-run append order. The session ordinal distinguishes repeated identical runs and stays outside the hash. Guarded commands carry the run and expected sequence; human responses must also match the request, role and type of review.
- `src/simulation/projection.ts` and `metrics.ts`: derive evidence, open reviews, outcomes and chart contributions from recorded events. Assessment conditions are categorical fixture labels, not severity levels. Session activity uses append order rather than comparing independent run-local clocks.
- `src/integrity/chain.ts`: local hash verification for original snapshots and demonstration copies. Verification checks content, links, order and the local checkpoint, not independent completeness, authorship, real time or immutability.
- `src/MapView.tsx`, `Inspector.tsx` and `ReferenceDialog.tsx`: accessible map, evidence inspector and reference views.

The component catalogue is curated from repository documentation at baseline `0e6e3b7`. Source paths are citations, not runtime filesystem access. The agent proposal and control-plane decision are visually grouped but remain distinct responsibilities. L0 means full autonomy and L4 means human control/override. No assurance about audit integrity is implied by the archive geometry.

## Validation

```sh
npm test
npm run build
PW_CHANNEL=chrome npm run test:e2e
```

The last command uses an installed Google Chrome. For a local Playwright Chromium installation instead, use `PLAYWRIGHT_BROWSERS_PATH="$PWD/.browsers" npx playwright install chromium`, then `PLAYWRIGHT_BROWSERS_PATH="$PWD/.browsers" npm run test:e2e`. The tests start and stop their own production preview at port 4287. Phase 2 captures are under `screenshots/phase2/`; Phase 1 baseline screenshots are preserved.

Unit tests cover fixture lookup, pipeline order, replay, review guards, metric reconciliation and SHA-256 verification. Browser tests cover both the original explorer and integrated synthetic decisions, including pending review across views, read-only replay and tampering on a copy.

## Five-minute presentation

From the repository root run `cd demos/hitl2-3d`, `npm ci`, `npm run build`, then `npm run preview -- --port 4173 --strictPort`. Open http://127.0.0.1:4173 and keep the preview server running. Only installation needs package access. Use **Guided walkthrough**; fullscreen is optional. For a fresh audience use **Reset session**. Restarting the guide preserves prior runs; resetting a scenario replaces only that run with its initial proposal.

| Time | Presenter cue |
|---|---|
| 0:00–0:50 | Orbit the architecture, then focus the risk station. Contrast the proposed component, repository placeholder and simulated evidence. |
| 0:50–1:40 | Advance to the elevated release proposal and inspect the assessment and policy events. Show the fixture version and logical time. |
| 1:40–2:40 | Pause at the L3 request. Read the scope, enter your rationale and explicitly approve or reject as the synthetic reviewer. |
| 2:40–3:30 | Read the final disposition, then show its effect on the dashboard. Only final dispositions enter the completed count. |
| 3:30–4:15 | Verify the original sequence. Point to the checkpoint and the previous and current event digests. |
| 4:15–5:00 | Edit a copy, verify it and identify the first mismatch. Explain that the checkpoint and verifier share the browser trust domain. Exit the guide. |

Refresh clears session history. At the venue, check projector contrast and camera response; switch to **2D map** if needed. The 1920×1080 rehearsal used Chrome with software rendering, not the venue projector or GPU.
