# ABC Pharmacy — Medicine Tracker

A Single Page Application for ABC Pharmacy to track medicines and maintain
sale records. Built as a take-home assessment.

**Stack:** ASP.NET Core 8 Web API · React 18 (Vite) · data persisted
server-side in JSON files (no database).

```
├── PharmacyApi/    → ASP.NET Core Web API (Swagger included)
└── pharmacy-ui/    → React single page application
```

## How to run

Prerequisites: .NET 8 SDK and Node.js 18+.

**Terminal 1 — API**

```bash
cd PharmacyApi
dotnet run
```

API runs at `http://localhost:5000` — Swagger UI at `http://localhost:5000/swagger`.

**Terminal 2 — UI**

```bash
cd pharmacy-ui
npm install
npm run dev
```

UI runs at `http://localhost:3000` (the Vite dev server proxies `/api/*`
to the API, so no CORS or URL configuration is needed).

The API is seeded with sample medicines covering every color-rule case,
so the grid demonstrates all indications on first load.

## Features

- **Medicine grid** displaying all attributes except Notes
  (Name, Brand, Expiry Date, Quantity, Price)
- **Color indications** per the guidelines:
  - 🔴 Red background — expiry date within 30 days
  - 🟡 Yellow background — quantity in stock below 10
- **Search** by medicine name (debounced, served by the API)
- **Add medicine** via a modal form with all six attributes and validation
- **Sales mechanism** — a *Sell* action on each medicine records a sale,
  deducts stock (overselling is rejected by the domain rule), and a
  dedicated **Sales** page lists all records with units-sold and revenue
  totals
- **Stock health chips** — live counts of expiring / low-stock medicines
  that double as grid filters

## Design notes

- **Architecture:** single API project with layer folders
  (`Domain` → `Application` → `Infrastructure` → `Controllers`).
  Repositories sit behind interfaces, so the JSON file storage can be
  swapped for a database without touching services or controllers. CQRS /
  MediatR / multiple projects were deliberately avoided — the scope does
  not justify the ceremony.
- **Business rules live in the Domain** (`Medicine.IsExpiringSoon()`,
  `Medicine.IsLowStock()`, `Medicine.ReduceStock()`), and the API returns
  them as computed flags; the React client only applies CSS. Rules stay
  unit-testable on the server.
- **Storage:** `PharmacyApi/Data/medicines.json` and `sales.json` are the
  seed files. At runtime the app reads/writes the copies in the build
  output folder, so added records persist across restarts; `dotnet clean`
  resets to seed data.

## Assumptions

- "Maintain sale records" is interpreted as: selling a medicine deducts
  its stock and appends a record (medicine, quantity, price per unit,
  total, timestamp) viewable on the Sales page.
- "Expiry date less than 30 days" includes already-expired medicines.
- When a medicine is both expiring soon and low on stock, red takes
  precedence (a small tag on the row still indicates low stock).
- Prices are stored with 2 decimal places; currency displayed as ₹
  (a single constant in the UI).
