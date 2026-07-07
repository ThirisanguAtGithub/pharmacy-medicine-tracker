# ABC Pharmacy API (ASP.NET Core Web API)

Backend for the pharmacy take-home assessment. Data is stored server-side
in JSON files (`Data/medicines.json`, `Data/sales.json`) — no database.

## How to run

```bash
dotnet restore
dotnet run
```

- API base URL: `http://localhost:5000`
- Swagger UI (for testing): `http://localhost:5000/swagger`

## Endpoints

| Method | Route                          | Description                                  |
|--------|--------------------------------|----------------------------------------------|
| GET    | /api/medicines                 | List all medicines                           |
| GET    | /api/medicines?search=para     | Search medicines by name                     |
| GET    | /api/medicines/{id}            | Get a single medicine                        |
| POST   | /api/medicines                 | Add a medicine                               |
| PUT    | /api/medicines/{id}            | Update a medicine                            |
| DELETE | /api/medicines/{id}            | Delete a medicine                            |
| GET    | /api/sales                     | List all sale records (newest first)         |
| POST   | /api/sales                     | Record a sale (reduces medicine stock)       |

## Business rules

- `IsExpiringSoon` = expiry date is within the next 30 days (including
  already-expired). The UI shows these rows with a **red** background.
- `IsLowStock` = quantity < 10. The UI shows these rows with a **yellow**
  background. If both rules match, red takes precedence (UI decision).
- A sale cannot exceed the available stock; recording a sale reduces the
  medicine quantity and stores a sale record with the total amount.

These flags are computed on the server (in the `Medicine` entity) so the
rules are unit-testable; the React client only applies CSS based on them.

## Structure

```
PharmacyApi/
├── Controllers/      → API endpoints (Medicines, Sales)
├── Application/      → Services, DTOs, repository interfaces
├── Domain/           → Entities with business rules (Medicine, Sale)
├── Infrastructure/   → JSON file storage (repositories + file store)
└── Data/             → medicines.json, sales.json (the "database")
```

Single project with layer folders was chosen deliberately: the scope does
not justify multiple projects, CQRS, or a mediator. The repository
interfaces mean the JSON storage can be swapped for a real database
without touching the services or controllers.

## Assumptions

- Sale records are the mechanism to "maintain sales": selling deducts
  stock and appends to `sales.json`.
- Price is rounded to 2 decimal places on save.
- Data files live next to the build output; they are seeded with sample
  medicines covering every color-rule case.
