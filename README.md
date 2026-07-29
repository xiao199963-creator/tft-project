# TFT Meta Analytics

TFT Meta Analytics is a working portfolio dashboard for comparing Teamfight Tactics composition performance. It provides filterable meta data, summary metrics, and composition-level placement, top-four, win, pick-rate, game-count, and meta-score views.

## Architecture and data

- `apps/api`: FastAPI service exposing composition, patch, and aggregate meta endpoints.
- `apps/web`: React + Vite dashboard.
- `docker-compose.yml`: local PostgreSQL, API, and web services.

Version 1 uses curated, static aggregate mock data so the dashboard is ready to run and discuss without a Riot API key. PostgreSQL is included in the local architecture for the production-oriented data layer; the current API responses are backed by the curated seed data.

## Run locally

Start the API in one terminal:

```bash
cd apps/api
python -m pip install -e .
uvicorn app.main:app --reload --port 8000
```

Start the dashboard in another:

```bash
cd apps/web
npm install
VITE_API_BASE_URL=http://localhost:8000 npm run dev
```

Open `http://localhost:5173`.

## Test

```bash
cd apps/api && python -m pytest -v
cd apps/web && npm test && npm run build
```
