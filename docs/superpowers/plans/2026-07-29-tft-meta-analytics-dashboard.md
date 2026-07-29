# TFT Meta Analytics Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a portfolio-ready TFT meta analytics dashboard with React, FastAPI, PostgreSQL-oriented models, seeded analytics data, tests, and GitHub-ready documentation.

**Architecture:** Use a small monorepo with `apps/api` for FastAPI and `apps/web` for React. Version 1 reads curated seed data through backend service functions, exposes stable REST endpoints, and keeps persistence boundaries shaped so PostgreSQL/SQLAlchemy can be introduced without changing the frontend contract.

**Tech Stack:** Python 3.11+, FastAPI, Pydantic, pytest, React, TypeScript, Vite, Recharts, Vitest, Testing Library, Docker Compose, PostgreSQL.

## Global Constraints

- Version 1 uses curated static and mock match-aggregate data.
- Do not require a Riot production API key for local development, tests, or deployment.
- Out of scope: live Riot API ingestion, Riot Sign On, user accounts, real-time match tracking, agent chat interface, mobile app wrapper, paid or monetized functionality.
- The landing screen must be the working dashboard, not a marketing page.
- Include filters for patch, region, rank tier, and playstyle.
- Include sorting by average placement, win rate, top-four rate, and popularity.
- Include loading, empty, and error states.
- Keep the README understandable to a recruiter or interviewer within two minutes.

---

## Planned File Structure

- `README.md`: project summary, setup, screenshots section, API examples, roadmap.
- `docker-compose.yml`: local database, API, and web service wiring.
- `.gitignore`: Python, Node, env, build, and database artifacts.
- `apps/api/pyproject.toml`: backend package metadata and dependencies.
- `apps/api/app/main.py`: FastAPI app factory and route registration.
- `apps/api/app/models.py`: Pydantic domain and response models.
- `apps/api/app/seed_data.py`: curated TFT-like seed data.
- `apps/api/app/repository.py`: read/query functions over seed data, later replaceable by PostgreSQL.
- `apps/api/app/analytics.py`: deterministic metrics and ranking calculations.
- `apps/api/app/routes.py`: REST endpoints.
- `apps/api/tests/*.py`: backend unit and API tests.
- `apps/web/package.json`: frontend scripts and dependencies.
- `apps/web/src/api/client.ts`: typed backend client.
- `apps/web/src/types.ts`: frontend API types matching backend responses.
- `apps/web/src/App.tsx`: route shell and page composition.
- `apps/web/src/pages/DashboardPage.tsx`: meta overview page.
- `apps/web/src/pages/CompDetailPage.tsx`: composition detail page.
- `apps/web/src/components/*.tsx`: focused dashboard components.
- `apps/web/src/*.css`: global and component styling.
- `apps/web/src/**/*.test.tsx`: frontend tests.

---

### Task 1: Repository And Tooling Scaffold

**Files:**
- Create: `.gitignore`
- Create: `README.md`
- Create: `docker-compose.yml`
- Create: `apps/api/pyproject.toml`
- Create: `apps/api/Dockerfile`
- Create: `apps/api/app/__init__.py`
- Create: `apps/api/app/main.py`
- Create: `apps/api/tests/test_health.py`
- Create: `apps/web/package.json`
- Create: `apps/web/Dockerfile`
- Create: `apps/web/index.html`
- Create: `apps/web/src/main.tsx`
- Create: `apps/web/src/App.tsx`
- Create: `apps/web/src/App.test.tsx`
- Create: `apps/web/src/styles.css`

**Interfaces:**
- Produces: `app.main.app: FastAPI`
- Produces: frontend script commands `npm run dev`, `npm run test`, `npm run build`
- Produces: backend command `python -m pytest`

- [ ] **Step 1: Create backend health test**

```python
from fastapi.testclient import TestClient

from app.main import app


def test_health_returns_ok():
    client = TestClient(app)

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
```

- [ ] **Step 2: Run backend test to verify it fails**

Run: `cd apps/api && python -m pytest tests/test_health.py -v`

Expected: FAIL because `app.main` or `/health` is not implemented yet.

- [ ] **Step 3: Create minimal FastAPI app**

```python
from fastapi import FastAPI

app = FastAPI(title="TFT Meta Analytics API")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
```

- [ ] **Step 4: Add backend package config**

```toml
[project]
name = "tft-meta-analytics-api"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
  "fastapi>=0.111.0",
  "httpx>=0.27.0",
  "pydantic>=2.7.0",
  "pytest>=8.2.0",
  "uvicorn[standard]>=0.30.0"
]

[tool.pytest.ini_options]
pythonpath = ["."]
```

- [ ] **Step 5: Create frontend smoke test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the dashboard shell", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /tft meta analytics/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Create minimal React shell**

```tsx
export default function App() {
  return (
    <main className="app-shell">
      <h1>TFT Meta Analytics</h1>
    </main>
  );
}
```

- [ ] **Step 7: Add frontend package config**

```json
{
  "name": "tft-meta-analytics-web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc && vite build",
    "test": "vitest --run"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.3.0",
    "typescript": "^5.5.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "recharts": "^2.12.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^16.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 8: Add Docker Compose skeleton**

Add backend Dockerfile:

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY pyproject.toml .
RUN pip install --no-cache-dir .
COPY app ./app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Add frontend Dockerfile:

```dockerfile
FROM node:20-slim
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY index.html ./
COPY src ./src
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: tft_meta
      POSTGRES_USER: tft
      POSTGRES_PASSWORD: tft
    ports:
      - "5432:5432"
  api:
    build: ./apps/api
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://tft:tft@db:5432/tft_meta
    depends_on:
      - db
  web:
    build: ./apps/web
    command: npm run dev
    ports:
      - "5173:5173"
    environment:
      VITE_API_BASE_URL: http://localhost:8000
    depends_on:
      - api
```

- [ ] **Step 9: Run scaffold checks**

Run: `cd apps/api && python -m pytest -v`

Expected: PASS for health test.

Run: `cd apps/web && npm test`

Expected: PASS for App smoke test after dependencies are installed.

- [ ] **Step 10: Commit**

```bash
git add .gitignore README.md docker-compose.yml apps/api apps/web
git commit -m "chore: scaffold TFT analytics app"
```

---

### Task 2: Backend Domain Models And Seed Repository

**Files:**
- Create: `apps/api/app/models.py`
- Create: `apps/api/app/seed_data.py`
- Create: `apps/api/app/repository.py`
- Create: `apps/api/tests/test_repository.py`

**Interfaces:**
- Consumes: Python package from Task 1
- Produces: `MetaFilters(patch: str | None, region: str | None, rank_tier: str | None, playstyle: str | None)`
- Produces: `list_patches() -> list[Patch]`
- Produces: `list_compositions(filters: MetaFilters) -> list[CompositionSummary]`
- Produces: `get_composition(slug: str, filters: MetaFilters) -> CompositionDetail | None`

- [ ] **Step 1: Write repository tests**

```python
from app.models import MetaFilters
from app.repository import get_composition, list_compositions, list_patches


def test_list_patches_marks_one_current_patch():
    patches = list_patches()

    assert len(patches) >= 3
    assert sum(1 for patch in patches if patch.is_current) == 1


def test_list_compositions_filters_by_playstyle():
    comps = list_compositions(MetaFilters(playstyle="Fast 8"))

    assert comps
    assert {comp.playstyle for comp in comps} == {"Fast 8"}


def test_get_composition_returns_units_traits_items_and_stats():
    comp = get_composition("rebel-fast-8", MetaFilters(region="OC1", rank_tier="Diamond+"))

    assert comp is not None
    assert comp.slug == "rebel-fast-8"
    assert comp.units
    assert comp.traits
    assert comp.items
    assert comp.stats.games > 0
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd apps/api && python -m pytest tests/test_repository.py -v`

Expected: FAIL because models and repository functions are not implemented.

- [ ] **Step 3: Add Pydantic models**

```python
from pydantic import BaseModel


class MetaFilters(BaseModel):
    patch: str | None = None
    region: str | None = None
    rank_tier: str | None = None
    playstyle: str | None = None


class Patch(BaseModel):
    id: str
    display_name: str
    release_date: str
    is_current: bool


class CompositionStats(BaseModel):
    patch: str
    region: str
    rank_tier: str
    games: int
    average_placement: float
    top_four_rate: float
    win_rate: float
    pick_rate: float


class Unit(BaseModel):
    name: str
    cost: int
    role: str
    recommended_stars: int
    priority: int


class Trait(BaseModel):
    name: str
    active_tier: str
    breakpoint_text: str


class Item(BaseModel):
    name: str
    category: str
    holder: str
    priority: int


class CompositionSummary(BaseModel):
    id: str
    name: str
    slug: str
    playstyle: str
    difficulty: str
    summary: str
    stats: CompositionStats
    meta_score: float


class CompositionDetail(CompositionSummary):
    units: list[Unit]
    traits: list[Trait]
    items: list[Item]
    strengths: list[str]
    weaknesses: list[str]
    timing_notes: list[str]
```

- [ ] **Step 4: Add seed data with at least six compositions**

Seed data must include at least:

```python
PATCHES = [
    {"id": "14.13", "display_name": "Patch 14.13", "release_date": "2026-06-12", "is_current": False},
    {"id": "14.14", "display_name": "Patch 14.14", "release_date": "2026-06-26", "is_current": False},
    {"id": "14.15", "display_name": "Patch 14.15", "release_date": "2026-07-10", "is_current": True},
]

COMPOSITIONS = [
    {
        "id": "comp-001",
        "name": "Rebel Fast 8",
        "slug": "rebel-fast-8",
        "playstyle": "Fast 8",
        "difficulty": "Medium",
        "summary": "Stable late-game board that rewards economy management and flexible itemisation.",
        "units": [{"name": "Jinx", "cost": 4, "role": "Carry", "recommended_stars": 2, "priority": 1}],
        "traits": [{"name": "Rebel", "active_tier": "5", "breakpoint_text": "5 Rebels active"}],
        "items": [{"name": "Guinsoo's Rageblade", "category": "Attack Speed", "holder": "Jinx", "priority": 1}],
        "strengths": ["Strong capped board", "Flexible AD item holders"],
        "weaknesses": ["Needs stable economy", "Contested four-cost carries hurt consistency"],
        "timing_notes": ["Push level 8 on 4-2 when healthy", "Stabilise around upgraded four-cost carries"],
    }
]
```

Add five additional seeded compositions with different `slug`, `playstyle`, and stats.

- [ ] **Step 5: Implement repository filtering**

```python
def _matches_filters(stat: dict, composition: dict, filters: MetaFilters) -> bool:
    return (
        (filters.patch is None or stat["patch"] == filters.patch)
        and (filters.region is None or stat["region"] == filters.region)
        and (filters.rank_tier is None or stat["rank_tier"] == filters.rank_tier)
        and (filters.playstyle is None or composition["playstyle"] == filters.playstyle)
    )
```

If no exact stat row matches, repository functions should return no composition for that filter combination instead of silently falling back.

- [ ] **Step 6: Run repository tests**

Run: `cd apps/api && python -m pytest tests/test_repository.py -v`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add apps/api/app/models.py apps/api/app/seed_data.py apps/api/app/repository.py apps/api/tests/test_repository.py
git commit -m "feat: add TFT seed repository"
```

---

### Task 3: Backend Analytics And API Routes

**Files:**
- Create: `apps/api/app/analytics.py`
- Create: `apps/api/app/routes.py`
- Modify: `apps/api/app/main.py`
- Create: `apps/api/tests/test_analytics.py`
- Create: `apps/api/tests/test_routes.py`

**Interfaces:**
- Consumes: `CompositionSummary`, `MetaFilters`, repository functions from Task 2
- Produces: `calculate_meta_score(stats: CompositionStats) -> float`
- Produces: `build_meta_summary(filters: MetaFilters) -> MetaSummary`
- Produces routes `GET /patches`, `GET /comps`, `GET /comps/{comp_id}`, `GET /stats/meta`, `GET /stats/trends/{comp_id}`

- [ ] **Step 1: Write analytics tests**

```python
from app.analytics import calculate_meta_score
from app.models import CompositionStats


def test_calculate_meta_score_rewards_good_placement_and_rates():
    strong = CompositionStats(
        patch="14.15",
        region="OC1",
        rank_tier="Diamond+",
        games=1200,
        average_placement=3.8,
        top_four_rate=0.62,
        win_rate=0.18,
        pick_rate=0.11,
    )
    weak = CompositionStats(
        patch="14.15",
        region="OC1",
        rank_tier="Diamond+",
        games=900,
        average_placement=4.8,
        top_four_rate=0.44,
        win_rate=0.08,
        pick_rate=0.05,
    )

    assert calculate_meta_score(strong) > calculate_meta_score(weak)
```

- [ ] **Step 2: Write API route tests**

```python
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_comps_endpoint_returns_filtered_compositions():
    response = client.get("/comps", params={"region": "OC1", "rank_tier": "Diamond+", "playstyle": "Fast 8"})

    assert response.status_code == 200
    body = response.json()
    assert body["items"]
    assert {item["playstyle"] for item in body["items"]} == {"Fast 8"}


def test_comp_detail_endpoint_returns_404_for_unknown_slug():
    response = client.get("/comps/not-a-real-comp")

    assert response.status_code == 404
    assert response.json()["detail"] == "Composition not found"


def test_trends_endpoint_returns_patch_ordered_points():
    response = client.get("/stats/trends/rebel-fast-8", params={"region": "OC1", "rank_tier": "Diamond+"})

    assert response.status_code == 200
    patches = [point["patch"] for point in response.json()["items"]]
    assert patches == sorted(patches)
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd apps/api && python -m pytest tests/test_analytics.py tests/test_routes.py -v`

Expected: FAIL because analytics and routes are not implemented.

- [ ] **Step 4: Implement deterministic score**

```python
def calculate_meta_score(stats: CompositionStats) -> float:
    placement_score = max(0.0, (8.0 - stats.average_placement) / 7.0)
    top_four_score = stats.top_four_rate
    win_score = stats.win_rate * 1.5
    popularity_score = min(stats.pick_rate, 0.2) / 0.2
    return round((placement_score * 40) + (top_four_score * 30) + (win_score * 20) + (popularity_score * 10), 2)
```

- [ ] **Step 5: Add API response wrapper models**

Add to `models.py`:

```python
class CompositionListResponse(BaseModel):
    items: list[CompositionSummary]


class PatchListResponse(BaseModel):
    items: list[Patch]


class MetaSummary(BaseModel):
    total_games: int
    average_top_four_rate: float
    average_win_rate: float
    composition_count: int


class TrendPoint(BaseModel):
    patch: str
    average_placement: float
    top_four_rate: float
    win_rate: float
    pick_rate: float
    games: int


class TrendResponse(BaseModel):
    items: list[TrendPoint]
```

- [ ] **Step 6: Implement routes and register router**

`routes.py` should parse query parameters into `MetaFilters` and call repository/analytics functions. Unknown composition slugs return `HTTPException(status_code=404, detail="Composition not found")`.

`main.py` should include:

```python
from app.routes import router

app.include_router(router)
```

- [ ] **Step 7: Run backend route tests**

Run: `cd apps/api && python -m pytest -v`

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add apps/api/app apps/api/tests
git commit -m "feat: expose TFT analytics API"
```

---

### Task 4: Frontend API Client And Dashboard Data States

**Files:**
- Create: `apps/web/src/types.ts`
- Create: `apps/web/src/api/client.ts`
- Create: `apps/web/src/api/client.test.ts`
- Create: `apps/web/src/components/StateMessage.tsx`
- Create: `apps/web/src/components/StateMessage.test.tsx`

**Interfaces:**
- Consumes: backend API contracts from Task 3
- Produces: `fetchComps(filters: MetaFilters, sort: SortKey) -> Promise<CompositionListResponse>`
- Produces: `fetchPatches() -> Promise<PatchListResponse>`
- Produces: `fetchMetaSummary(filters: MetaFilters) -> Promise<MetaSummary>`
- Produces: `fetchCompDetail(slug: string, filters: MetaFilters) -> Promise<CompositionDetail>`
- Produces: `fetchTrends(slug: string, filters: MetaFilters) -> Promise<TrendResponse>`

- [ ] **Step 1: Write client URL test**

```ts
import { describe, expect, it } from "vitest";
import { buildQueryString } from "./client";

describe("buildQueryString", () => {
  it("omits empty filters and encodes selected filters", () => {
    const query = buildQueryString({
      filters: { patch: "14.15", region: "OC1", rankTier: "Diamond+", playstyle: "" },
      sort: "win_rate",
    });

    expect(query).toBe("?patch=14.15&region=OC1&rank_tier=Diamond%2B&sort=win_rate");
  });
});
```

- [ ] **Step 2: Write state component test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StateMessage } from "./StateMessage";

describe("StateMessage", () => {
  it("renders an accessible status message", () => {
    render(<StateMessage title="No comps found" message="Try a different filter." />);

    expect(screen.getByRole("status")).toHaveTextContent("No comps found");
    expect(screen.getByText("Try a different filter.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd apps/web && npm test -- src/api/client.test.ts src/components/StateMessage.test.tsx`

Expected: FAIL because client and component files do not exist.

- [ ] **Step 4: Add shared frontend types**

```ts
export type SortKey = "average_placement" | "win_rate" | "top_four_rate" | "pick_rate";

export type MetaFilters = {
  patch?: string;
  region?: string;
  rankTier?: string;
  playstyle?: string;
};
```

Continue matching backend response fields exactly with snake_case properties for API payloads.

- [ ] **Step 5: Implement query string builder**

```ts
export function buildQueryString({ filters, sort }: { filters: MetaFilters; sort?: SortKey }) {
  const params = new URLSearchParams();
  if (filters.patch) params.set("patch", filters.patch);
  if (filters.region) params.set("region", filters.region);
  if (filters.rankTier) params.set("rank_tier", filters.rankTier);
  if (filters.playstyle) params.set("playstyle", filters.playstyle);
  if (sort) params.set("sort", sort);
  const value = params.toString();
  return value ? `?${value}` : "";
}
```

- [ ] **Step 6: Implement `StateMessage`**

```tsx
type StateMessageProps = {
  title: string;
  message: string;
};

export function StateMessage({ title, message }: StateMessageProps) {
  return (
    <section className="state-message" role="status">
      <h2>{title}</h2>
      <p>{message}</p>
    </section>
  );
}
```

- [ ] **Step 7: Run frontend tests**

Run: `cd apps/web && npm test -- src/api/client.test.ts src/components/StateMessage.test.tsx`

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/types.ts apps/web/src/api apps/web/src/components/StateMessage.tsx apps/web/src/components/StateMessage.test.tsx
git commit -m "feat: add typed frontend API client"
```

---

### Task 5: Meta Overview Dashboard

**Files:**
- Create: `apps/web/src/pages/DashboardPage.tsx`
- Create: `apps/web/src/pages/DashboardPage.test.tsx`
- Create: `apps/web/src/components/FilterBar.tsx`
- Create: `apps/web/src/components/MetricCards.tsx`
- Create: `apps/web/src/components/CompositionTable.tsx`
- Modify: `apps/web/src/App.tsx`
- Modify: `apps/web/src/styles.css`

**Interfaces:**
- Consumes: frontend API client from Task 4
- Produces: dashboard with filters, summary metrics, composition rows, loading state, empty state, error state

- [ ] **Step 1: Write dashboard render test**

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DashboardPage from "./DashboardPage";

vi.mock("../api/client", () => ({
  fetchComps: vi.fn(async () => ({
    items: [
      {
        id: "comp-001",
        name: "Rebel Fast 8",
        slug: "rebel-fast-8",
        playstyle: "Fast 8",
        difficulty: "Medium",
        summary: "Stable late-game board.",
        meta_score: 72.4,
        stats: {
          patch: "14.15",
          region: "OC1",
          rank_tier: "Diamond+",
          games: 1200,
          average_placement: 3.8,
          top_four_rate: 0.62,
          win_rate: 0.18,
          pick_rate: 0.11,
        },
      },
    ],
  })),
  fetchMetaSummary: vi.fn(async () => ({
    total_games: 1200,
    average_top_four_rate: 0.62,
    average_win_rate: 0.18,
    composition_count: 1,
  })),
  fetchPatches: vi.fn(async () => ({
    items: [{ id: "14.15", display_name: "Patch 14.15", release_date: "2026-07-10", is_current: true }],
  })),
}));

describe("DashboardPage", () => {
  it("renders fetched meta data", async () => {
    render(<DashboardPage />);

    await waitFor(() => expect(screen.getByText("Rebel Fast 8")).toBeInTheDocument());
    expect(screen.getByText("1,200")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && npm test -- src/pages/DashboardPage.test.tsx`

Expected: FAIL because dashboard page is not implemented.

- [ ] **Step 3: Implement dashboard state loading**

Use `useEffect` to call `fetchPatches`, `fetchMetaSummary`, and `fetchComps` whenever filters or sort changes. Track:

```ts
type LoadState = "loading" | "ready" | "empty" | "error";
```

- [ ] **Step 4: Implement filter controls**

`FilterBar` props:

```ts
type FilterBarProps = {
  filters: MetaFilters;
  sort: SortKey;
  patches: Patch[];
  onFiltersChange: (filters: MetaFilters) => void;
  onSortChange: (sort: SortKey) => void;
};
```

Include selects for patch, region, rank tier, playstyle, and sort.

- [ ] **Step 5: Implement metrics and table**

`MetricCards` displays total games, average top-four rate, average win rate, and composition count. `CompositionTable` displays name, playstyle, difficulty, average placement, top-four rate, win rate, pick rate, games, and meta score.

- [ ] **Step 6: Wire dashboard into `App.tsx`**

```tsx
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return <DashboardPage />;
}
```

- [ ] **Step 7: Run frontend tests**

Run: `cd apps/web && npm test -- src/pages/DashboardPage.test.tsx`

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/App.tsx apps/web/src/pages apps/web/src/components apps/web/src/styles.css
git commit -m "feat: build TFT meta overview dashboard"
```

---

### Task 6: Composition Detail Page And Trend Chart

**Files:**
- Create: `apps/web/src/pages/CompDetailPage.tsx`
- Create: `apps/web/src/pages/CompDetailPage.test.tsx`
- Create: `apps/web/src/components/TrendChart.tsx`
- Create: `apps/web/src/components/DetailLists.tsx`
- Modify: `apps/web/src/App.tsx`
- Modify: `apps/web/src/components/CompositionTable.tsx`
- Modify: `apps/web/src/styles.css`

**Interfaces:**
- Consumes: `fetchCompDetail(slug, filters)` and `fetchTrends(slug, filters)` from Task 4
- Produces: detail page reachable from dashboard rows
- Produces: route handling based on `window.location.pathname` or React Router if added during implementation

- [ ] **Step 1: Write detail page test**

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CompDetailPage from "./CompDetailPage";

vi.mock("../api/client", () => ({
  fetchCompDetail: vi.fn(async () => ({
    id: "comp-001",
    name: "Rebel Fast 8",
    slug: "rebel-fast-8",
    playstyle: "Fast 8",
    difficulty: "Medium",
    summary: "Stable late-game board.",
    meta_score: 72.4,
    stats: {
      patch: "14.15",
      region: "OC1",
      rank_tier: "Diamond+",
      games: 1200,
      average_placement: 3.8,
      top_four_rate: 0.62,
      win_rate: 0.18,
      pick_rate: 0.11,
    },
    units: [{ name: "Jinx", cost: 4, role: "Carry", recommended_stars: 2, priority: 1 }],
    traits: [{ name: "Rebel", active_tier: "5", breakpoint_text: "5 Rebels active" }],
    items: [{ name: "Guinsoo's Rageblade", category: "Attack Speed", holder: "Jinx", priority: 1 }],
    strengths: ["Strong capped board"],
    weaknesses: ["Needs stable economy"],
    timing_notes: ["Push level 8 on 4-2 when healthy"],
  })),
  fetchTrends: vi.fn(async () => ({
    items: [
      { patch: "14.14", average_placement: 4.1, top_four_rate: 0.56, win_rate: 0.13, pick_rate: 0.08, games: 900 },
      { patch: "14.15", average_placement: 3.8, top_four_rate: 0.62, win_rate: 0.18, pick_rate: 0.11, games: 1200 },
    ],
  })),
}));

describe("CompDetailPage", () => {
  it("renders composition detail and trend section", async () => {
    render(<CompDetailPage slug="rebel-fast-8" />);

    await waitFor(() => expect(screen.getByText("Rebel Fast 8")).toBeInTheDocument());
    expect(screen.getByText("Jinx")).toBeInTheDocument();
    expect(screen.getByText(/Patch Trend/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && npm test -- src/pages/CompDetailPage.test.tsx`

Expected: FAIL because detail page is not implemented.

- [ ] **Step 3: Implement `CompDetailPage`**

Fetch detail and trend data. Show `StateMessage` for loading, empty, or error states. Render summary metrics plus detail lists.

- [ ] **Step 4: Implement `TrendChart` with Recharts**

Use `ResponsiveContainer`, `LineChart`, `Line`, `XAxis`, `YAxis`, and `Tooltip`. Plot average placement, top-four rate, and win rate. Keep the chart inside a stable-height container to prevent layout shift.

- [ ] **Step 5: Add simple route switching**

If React Router is not installed, use a small pathname parser:

```tsx
const compMatch = window.location.pathname.match(/^\/comps\/([^/]+)$/);
return compMatch ? <CompDetailPage slug={compMatch[1]} /> : <DashboardPage />;
```

Update composition rows to link to `/comps/{slug}`.

- [ ] **Step 6: Run tests**

Run: `cd apps/web && npm test -- src/pages/CompDetailPage.test.tsx src/pages/DashboardPage.test.tsx`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/App.tsx apps/web/src/pages apps/web/src/components apps/web/src/styles.css
git commit -m "feat: add TFT composition detail view"
```

---

### Task 7: Documentation, Docker Polish, And Final Verification

**Files:**
- Modify: `README.md`
- Modify: `docker-compose.yml`
- Create: `apps/api/.env.example`
- Create: `apps/web/.env.example`

**Interfaces:**
- Consumes: completed backend and frontend from Tasks 1-6
- Produces: recruiter-friendly README and one-command local run instructions

- [ ] **Step 1: Write README verification checklist**

README must include:

```markdown
## Local Development

```bash
docker compose up --build
```

- Web: http://localhost:5173
- API: http://localhost:8000
- API docs: http://localhost:8000/docs

## Test Commands

```bash
cd apps/api && python -m pytest -v
cd apps/web && npm test
cd apps/web && npm run build
```
```

- [ ] **Step 2: Confirm Docker Compose service commands**

Ensure the `api` service uses `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload` and the `web` service uses `npm run dev`. Keep database credentials local-only and development scoped.

- [ ] **Step 3: Add `.env.example` files**

Backend:

```text
DATABASE_URL=postgresql://tft:tft@localhost:5432/tft_meta
```

Frontend:

```text
VITE_API_BASE_URL=http://localhost:8000
```

- [ ] **Step 4: Run backend verification**

Run: `cd apps/api && python -m pytest -v`

Expected: PASS.

- [ ] **Step 5: Run frontend verification**

Run: `cd apps/web && npm test`

Expected: PASS.

Run: `cd apps/web && npm run build`

Expected: PASS.

- [ ] **Step 6: Run full stack manually**

Run: `docker compose up --build`

Expected:

- API responds at `http://localhost:8000/health` with `{"status":"ok"}`
- API docs load at `http://localhost:8000/docs`
- Web loads at `http://localhost:5173`
- Dashboard shows seeded compositions
- Clicking a composition opens its detail page

- [ ] **Step 7: Commit**

```bash
git add README.md docker-compose.yml apps/api/.env.example apps/web/.env.example
git commit -m "docs: document local setup and verification"
```

---

## Self-Review Notes

- Spec coverage: Tasks cover scaffold, seed data, API endpoints, filters, sorting, dashboard, detail page, trend chart, tests, Docker Compose, README, and roadmap.
- Scope control: Live Riot API ingestion, Riot Sign On, accounts, real-time tracking, agent chat, mobile app, and monetization remain out of scope.
- Type consistency: Backend uses snake_case response fields; frontend maps query input from `rankTier` to `rank_tier` while preserving API payload field names.
- Execution order: Later frontend tasks depend on the typed API contract from Task 3 and client from Task 4.
