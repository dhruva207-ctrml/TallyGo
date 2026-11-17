# Milestone 1 — Design and implementation

## User flow

1. The home screen lists trips or presents an empty state.
2. The user creates a trip with a title, currency, and member names.
3. The user opens a trip, records expenses, and chooses an equal, exact, or percentage split.
4. The trip dashboard shows expenses, balances, and minimum-transfer settlement suggestions.
5. The user can set one trip active and open its expense form from the persistent HUD.

## Front-end architecture

- `app/layout.js` owns the root layout and mounts `TripProvider`.
- `context/TripContext.js` is the shared state boundary. It loads trip summaries, exposes mutation actions, and refreshes context after local-storage changes.
- `lib/trip-storage.js` owns serialization, validation, IDs, trip/expense CRUD, and active-trip updates.
- App routes render screens; form/list components invoke context actions rather than accessing storage themselves.
- `lib/settlements.js` remains a pure calculation module for balances and recommended transfers.

```text
RootLayout
└── TripProvider (React Context)
    └── ActiveTripHUD
        ├── HomePage
        └── TripPage
            ├── AddExpenseForm
            ├── ExpenseList
            ├── BalancesView
            └── SettleUpView
```

## Persistence model

Storage key: `trekledger:trips` (kept stable so existing browser data survives the TallyGo rebrand)

```js
{
  _id: "browser-generated-id",
  title: "Coastal Weekend",
  currency: "INR",
  members: ["Asha", "Ravi"],
  isActive: false,
  createdAt: "ISO-8601 timestamp",
  expenses: [
    {
      _id: "browser-generated-id",
      tripId: "browser-generated-id",
      description: "Dinner",
      totalAmount: 1200,
      paidBy: "Asha",
      splitType: "EQUAL",
      splits: [{ member: "Asha", amountOwed: 600, percentage: 50 }],
      date: "ISO-8601 timestamp"
    }
  ]
}
```

The Context exposes `trips`, `activeTrip`, `loadingTrips`, `error`, `refreshTrips`, `getTrip`, `createTrip`, `createExpense`, `deleteExpense`, and `setTripActive`. Context is a UI state boundary only; the storage module remains responsible for persistence and validation.

## Interface rules

- Keep the dashboard simple: one primary create-trip action, visible trip summaries, and an empty state.
- On the trip screen, keep the trip title, member list, total, and active toggle above the Expenses / Balances / Settle Up tabs.
- Keep “Add Expense” prominent on mobile and available from the active-trip HUD.
- Use the existing emerald accent and neutral surfaces for consistent feedback.
- Show validation errors next to the relevant form and preserve user-entered values after a rejected submission.

## Screenshot and wireframe evidence

- [Dashboard wireframe](./wireframes/dashboard.svg) — trip list and create action.
- [Trip detail wireframe](./wireframes/trip-detail.svg) — summary, tabs, expenses, and quick add.
- [Empty dashboard screenshot](./screenshots/dashboard-empty.png)
- [Populated dashboard screenshot](./screenshots/dashboard-populated.png)
- [Trip detail screenshot](./screenshots/trip-detail-populated.png)
- [Add expense form screenshot](./screenshots/add-expense-form.png)
- [Active-trip Context screenshot](./screenshots/active-trip-context.png)
- [Mobile dashboard screenshot](./screenshots/dashboard-mobile.png)

## Acceptance criteria

- Creating a trip persists it across page reloads in the same browser.
- Creating and deleting an expense updates totals, balances, and settlement recommendations.
- Activating one trip deactivates any other trip.
- All screens use React Context for shared trip state and mutations.
- No MongoDB dependency, API persistence route, or environment variable is required.
- Production build completes without errors.
