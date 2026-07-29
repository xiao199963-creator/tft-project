from fastapi.testclient import TestClient
import pytest

from app.main import app


client = TestClient(app)


def test_api_allows_preflight_requests_from_local_vite():
    response = client.options(
        "/comps",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"


def test_comps_endpoint_returns_filtered_compositions():
    response = client.get("/comps", params={"region": "OC1", "rank_tier": "Diamond+", "playstyle": "Fast 8"})

    assert response.status_code == 200
    body = response.json()
    assert body["items"]
    assert {item["playstyle"] for item in body["items"]} == {"Fast 8"}


@pytest.mark.parametrize(
    ("sort_value", "reverse"),
    [
        ("average_placement", False),
        ("win_rate", True),
        ("top_four_rate", True),
        ("pick_rate", True),
    ],
)
def test_comps_endpoint_sorts_by_requested_statistic(sort_value: str, reverse: bool):
    response = client.get("/comps", params={"sort": sort_value})

    assert response.status_code == 200
    values = [item["stats"][sort_value] for item in response.json()["items"]]
    assert values == sorted(values, reverse=reverse)


def test_comp_detail_endpoint_returns_404_for_unknown_slug():
    response = client.get("/comps/not-a-real-comp")

    assert response.status_code == 404
    assert response.json()["detail"] == "Composition not found"


def test_trends_endpoint_returns_patch_ordered_points():
    response = client.get("/stats/trends/rebel-fast-8", params={"region": "OC1", "rank_tier": "Diamond+"})

    assert response.status_code == 200
    patches = [point["patch"] for point in response.json()["items"]]
    assert patches == sorted(patches)
