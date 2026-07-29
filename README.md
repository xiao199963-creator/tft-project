# TFT Meta Analytics

Portfolio project scaffold for a TFT meta analytics dashboard.

## Services

- `apps/api`: FastAPI service with a health endpoint.
- `apps/web`: React and Vite dashboard shell.
- `docker-compose.yml`: local Postgres, API, and web service skeleton.

## Local commands

```bash
cd apps/api && python -m pytest -v
cd apps/web && npm test
```
