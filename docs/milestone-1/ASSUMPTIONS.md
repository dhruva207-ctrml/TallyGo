# Milestone 1 — Assumptions

Status: working assumptions for team review

## Product goal

TallyGo helps a small travel group record shared trip expenses, understand each member's balance, and calculate a short list of transfers to settle up.

## Users and operating assumptions

- The first release is a single-user prototype; authentication and shared collaboration are out of scope.
- The app runs in a modern browser and stores trips and expenses in that browser's `localStorage`.
- Data is isolated to the browser profile and device. It is not backed up, synchronized, or shared with teammates.
- Users can create multiple trips, add named members, record expenses, and choose equal, exact-amount, or percentage splits.
- One trip can be marked active at a time. The active trip is surfaced in the shared HUD for quick expense entry.
- Supported currencies initially include INR, USD, EUR, and GBP. Conversion between currencies is out of scope.
- Expenses are entered in one currency per trip; the app does not perform currency conversion.
- The settlement calculation is informational guidance; members still complete payments outside the app.

## Milestone 1 scope

1. Establish the responsive trip-list and trip-detail screens.
2. Create and persist trips and expenses locally.
3. Calculate member balances and suggested settlements.
4. Centralize shared trip state with React Context API.
5. Document product assumptions, architecture, design, and acceptance evidence.

## Out of scope

- Login, authorization, cloud database, cross-device synchronization, and real-time collaboration.
- Payment processing, receipts/OCR, currency conversion, and export.
- Editing or deleting trips and changing member rosters after trip creation.
- Production analytics, deployment, and automated email/push delivery.

## Data and validation assumptions

- A trip requires a non-empty title and at least one non-empty member name.
- Duplicate member names are removed when a trip is created.
- An expense requires a non-empty description, a positive amount, and a payer who belongs to the trip.
- Equal splits include one or more selected trip members; rounding differences are applied to the first selected member.
- Exact splits must add to the expense total within one cent.
- Percentage splits must total 100% within a small floating-point tolerance.
- The app reports unreadable local data rather than silently discarding it.

## Quality and accessibility

- Core flows should work on mobile and desktop widths.
- Controls should be keyboard reachable, have visible focus, and use meaningful labels.
- Loading, empty, and error states should be distinguishable.
- Financial values are rounded to two decimal places for display and settlement.

## Risks to revisit

- `localStorage` can be cleared or unavailable, and it has a small storage limit.
- Data has no recovery path until an export/backup feature is implemented.
- Team members cannot see the same trip without a future shared backend.
- Browser notifications require user permission and support.
