# DrawScope — NZ Lotto Statistical Lab

A responsive Next.js dashboard for exploring 238 NZ Lotto, Powerball and Strike draws through 9 September 2026. It includes long- and short-window frequency, droughts, return intervals, pairs, triples, Powerball/Strike summaries, statistical benchmarks, and an eight-line modelled sequence generator.

> The generated sequences are historical-data-themed selections, not forecasts. Assuming a fair draw, every valid six-number combination has equal probability.

## Run locally

Requirements: Node.js 22+ and pnpm.

```bash
pnpm install
pnpm dev
```

Create the static production output:

```bash
pnpm build
```

The deployable output is written to `out/`.

## Recommended low-cost Azure architecture

### Release 1 — use this now

```text
GitHub repository
      │ push to main
      ▼
Azure Static Web Apps (Free)
      │
      └── Next.js static export from /out
```

Use **Azure Static Web Apps Free**. The entire current app runs in the browser and needs no database, API, server, VM, App Service, Function, Cosmos DB, or PostgreSQL. This is the least expensive and simplest production design.

### Release 2 — only when automatic draw updates are required

```text
Timer-triggered Azure Function (twice weekly)
      │ fetch + validate + calculate
      ▼
Azure Blob Storage: draws.json + analysis.json
      │ HTTPS read
      ▼
Azure Static Web Apps
```

- Use an Azure Function on Flex Consumption or Consumption for the scheduled ingestion and analysis job.
- Store the small append-only draw dataset as JSON blobs. Blob Storage is a better fit than a database for this read-heavy dataset.
- Serve the generated JSON through a read-only endpoint or Blob static URL with tightly scoped CORS.
- Add Application Insights only when the Function exists.

### When to add a database

Do not add one for public draw results alone. Add **Azure Table Storage** only if you need queryable draw records, saved model runs or lightweight audit history. Consider **Cosmos DB serverless** only after adding accounts, per-user saved slips, alerts or richer APIs. PostgreSQL and Azure SQL are unnecessary for this workload and introduce a recurring minimum cost.

## Azure Static Web Apps deployment

1. Push this project to GitHub.
2. In Azure Portal, create **Static Web App**.
3. Choose the Free plan, your GitHub organisation/repository and the `main` branch.
4. Use `/` for **App location**, leave **API location** empty, and use `out` for **Output location**.
5. Azure creates a deployment token/secret and a GitHub Actions workflow. If you use the included workflow, store the token in `AZURE_STATIC_WEB_APPS_API_TOKEN`.
6. Push to `main`; the workflow builds and deploys the static export.

The included `.github/workflows/azure-static-web-apps.yml` is ready for this setup.

## Future Function endpoints

If automatic updates are added later, keep the API small:

- `GET /api/draws?limit=50`
- `GET /api/analysis`
- `POST /api/admin/refresh` (protected; never public)
- Timer trigger: Wednesday and Saturday after the official draw is published

Validate that main numbers are six unique integers in 1–40, Powerball is 1–10, Strike has four ordered main-draw numbers, and dates are not duplicated. Preserve source and verification URLs with every record.

## Data caveat

The 238-draw sample includes all of 2024, selected 2025 months, and January–9 September 2026. May–September 2025 is missing, so the dashboard does not treat the April→October 2025 jump as consecutive draws.
