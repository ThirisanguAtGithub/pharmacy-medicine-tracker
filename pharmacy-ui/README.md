# ABC Pharmacy UI (React)

Single Page Application for the pharmacy take-home assessment.
Built with React 18 + Vite, plain CSS (no UI library).

## How to run

Start the .NET API first (it must be on http://localhost:5000), then:

```bash
npm install
npm run dev
```

Open http://localhost:3000 (in a cloud IDE, use **Open Preview** → port 3000).
The Vite dev server proxies `/api/*` to the API, so no CORS/URL setup is needed.

## Features (mapped to requirements)

- **Medicines grid** showing all attributes except Notes.
- **Color indications** driven by API flags:
  - Red row → expiry date within 30 days (`isExpiringSoon`)
  - Yellow row → quantity in stock below 10 (`isLowStock`)
  - Red takes precedence when both apply; rows also carry a small tag
    ("Expiring soon" / "Low") so the meaning is explicit.
- **Search** by medicine name (debounced, uses the API's `?search=` query).
- **Add medicine** via a modal form with all six attributes (Notes is
  collected here but never shown in the grid, per the requirement).
- **Sales mechanism**: a *Sell* button on each row opens a modal with a
  live total; recording a sale reduces stock through the API. A separate
  **Sales** tab lists all sale records with units-sold and revenue totals.
- **Stock health chips** above the grid show live counts for expiring /
  low-stock medicines and act as quick filters.

## Structure

```
src/
├── api.js                    → all backend calls in one place
├── App.jsx                   → header, tabs, toast
├── styles.css                → design tokens + all styling
└── components/
    ├── MedicinesPage.jsx     → chips, search, grid, modals
    ├── MedicineTable.jsx     → color-coded grid
    ├── AddMedicineModal.jsx  → add form
    ├── SellModal.jsx         → record a sale
    └── SalesPage.jsx         → sales records + totals
```
