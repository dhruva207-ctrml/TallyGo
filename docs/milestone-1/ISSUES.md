# Milestone 1 — GitHub issues

Target repository: <https://github.com/dhruva207-ctrml/TallyGo>

All four issues are open, all requested screenshots are attached, and the same evidence is retained locally. Issue #2 is assigned to `dhruva207-ctrml`; issues #1 and #3 remain unassigned, and issue #4 is left open for the teammate. Labels listed below are suggestions and were not applied.

The wireframes are included as source assets and can be used as initial task-specific visual references.

---

## Issue 1 — Document the milestone assumptions and product boundaries

**Status:** Open — [issue #1](https://github.com/dhruva207-ctrml/TallyGo/issues/1)<br>
**Assignee:** Unassigned (ready for requester assignment)<br>
**Intended labels (not applied):** `documentation`, `milestone-1`

### Goal

Agree on what TallyGo should do in the first milestone and record the constraints that shape implementation.

### Tasks

- Review and confirm the single-browser `localStorage` persistence assumption.
- Confirm supported trip, member, split, and settlement workflows.
- Record limitations and out-of-scope work, especially no authentication, cloud sync, or payments.
- Keep assumptions and acceptance criteria in `docs/milestone-1/ASSUMPTIONS.md`.

### Acceptance criteria

- Product goal, users, scope, exclusions, data rules, quality requirements, and risks are documented.
- Team reviews the assumptions before extending the feature scope.

### Screenshot / visual reference

- Dashboard task: [dashboard wireframe](./wireframes/dashboard.svg)
- Attached: [empty dashboard](./screenshots/dashboard-empty.png) and [populated dashboard](./screenshots/dashboard-populated.png).

---

## Issue 2 — Build trip and expense flows on local storage

**Status:** Open — [issue #2](https://github.com/dhruva207-ctrml/TallyGo/issues/2)<br>
**Assignee:** `dhruva207-ctrml`<br>
**Intended labels (not applied):** `feature`, `milestone-1`

### Goal

Let users create trips and expenses and review balances without a database service.

### Tasks

- Persist trips and expenses in `localStorage` with explicit validation and errors.
- Support equal, exact, and percentage splits.
- Support expense deletion and recompute balances and settlements.
- Verify data survives a page reload in the same browser.

### Acceptance criteria

- Trip create form rejects empty title/member data and removes duplicate members.
- Expense form rejects non-positive totals and invalid split allocations.
- Reloading the browser restores trips and expenses.
- Trip details display correct totals, balances, and settlement recommendations.

### Screenshot / visual reference

- Trip workflow: [trip detail wireframe](./wireframes/trip-detail.svg)
- Attached: [trip detail with expense](./screenshots/trip-detail-populated.png) and [add-expense form](./screenshots/add-expense-form.png).

---

## Issue 3 — Centralize trip state with React Context API

**Status:** Open — [issue #3](https://github.com/dhruva207-ctrml/TallyGo/issues/3)<br>
**Assignee:** Unassigned (ready for requester assignment)<br>
**Intended labels (not applied):** `architecture`, `milestone-1`

### Goal

Use React Context API to share trip state and operations across the home page, trip page, and active-trip HUD.

### Tasks

- Mount a `TripProvider` in the root layout.
- Expose trip summaries, active trip, loading/error state, and create/delete/activate operations through `useTrips`.
- Refresh Context after local-storage mutations and when another same-origin tab changes storage.
- Remove component-level duplicate trip loading and active-trip cache state.

### Acceptance criteria

- Components consume shared trip state via `useTrips`.
- Only one trip can be active at a time.
- The active-trip HUD reflects state changes without a manual page reload.
- Missing provider usage produces a clear development error.

### Screenshot / visual reference

- Context-backed shell: [dashboard wireframe](./wireframes/dashboard.svg) and [trip detail wireframe](./wireframes/trip-detail.svg)
- Attached: [active trip in Context-backed HUD](./screenshots/active-trip-context.png).

---

## Issue 4 — Verify responsive screens and publish milestone evidence

**Status:** Open — [issue #4](https://github.com/dhruva207-ctrml/TallyGo/issues/4)<br>
**Assignee:** Unassigned (ready for requester assignment)<br>
**Intended labels (not applied):** `testing`, `documentation`, `milestone-1`

### Goal

Verify the end-to-end milestone flows and keep reproducible visual evidence with the design notes.

### Tasks

- Test trip creation, all split modes, expense deletion, active trip behavior, and reload persistence.
- Check dashboard and trip-detail screens at mobile and desktop viewport sizes.
- Save task-specific screenshots under `docs/milestone-1/screenshots/`.
- Update `docs/milestone-1/DESIGN.md` if the delivered UI differs from the wireframes.

### Acceptance criteria

- Production build passes.
- Manual test results cover empty, populated, loading, and validation-error states.
- Screenshot attachments are included in this issue and retained in the project evidence folder.

### Screenshot / visual reference

- [Dashboard wireframe](./wireframes/dashboard.svg)
- [Trip detail wireframe](./wireframes/trip-detail.svg)
- Attached: [desktop dashboard](./screenshots/dashboard-populated.png), [mobile dashboard](./screenshots/dashboard-mobile.png), and [trip detail](./screenshots/trip-detail-populated.png).
