from typing import Literal

from fastapi import APIRouter, HTTPException

from app.analytics import build_meta_summary
from app.models import (
    CompositionDetail,
    CompositionListResponse,
    MetaFilters,
    MetaSummary,
    PatchListResponse,
    TrendPoint,
    TrendResponse,
)
from app.repository import get_composition, list_compositions, list_patches

router = APIRouter()

CompositionSort = Literal["average_placement", "win_rate", "top_four_rate", "pick_rate"]


def _filters(
    patch: str | None = None,
    region: str | None = None,
    rank_tier: str | None = None,
    playstyle: str | None = None,
) -> MetaFilters:
    return MetaFilters(
        patch=patch,
        region=region,
        rank_tier=rank_tier,
        playstyle=playstyle,
    )


@router.get("/patches", response_model=PatchListResponse)
def patches() -> PatchListResponse:
    return PatchListResponse(items=list_patches())


@router.get("/comps", response_model=CompositionListResponse)
def compositions(
    patch: str | None = None,
    region: str | None = None,
    rank_tier: str | None = None,
    playstyle: str | None = None,
    sort: CompositionSort | None = None,
) -> CompositionListResponse:
    items = list_compositions(_filters(patch, region, rank_tier, playstyle))
    if sort is not None:
        items.sort(
            key=lambda composition: getattr(composition.stats, sort),
            reverse=sort != "average_placement",
        )
    return CompositionListResponse(items=items)


@router.get("/comps/{comp_id}", response_model=CompositionDetail)
def composition_detail(
    comp_id: str,
    patch: str | None = None,
    region: str | None = None,
    rank_tier: str | None = None,
    playstyle: str | None = None,
) -> CompositionDetail:
    composition = get_composition(comp_id, _filters(patch, region, rank_tier, playstyle))
    if composition is None:
        raise HTTPException(status_code=404, detail="Composition not found")
    return composition


@router.get("/stats/meta", response_model=MetaSummary)
def meta_summary(
    patch: str | None = None,
    region: str | None = None,
    rank_tier: str | None = None,
    playstyle: str | None = None,
) -> MetaSummary:
    return build_meta_summary(_filters(patch, region, rank_tier, playstyle))


@router.get("/stats/trends/{comp_id}", response_model=TrendResponse)
def trends(
    comp_id: str,
    patch: str | None = None,
    region: str | None = None,
    rank_tier: str | None = None,
    playstyle: str | None = None,
) -> TrendResponse:
    composition = get_composition(comp_id, _filters(patch, region, rank_tier, playstyle))
    if composition is None:
        raise HTTPException(status_code=404, detail="Composition not found")

    return TrendResponse(
        items=[
            TrendPoint(
                patch=composition.stats.patch,
                average_placement=composition.stats.average_placement,
                top_four_rate=composition.stats.top_four_rate,
                win_rate=composition.stats.win_rate,
                pick_rate=composition.stats.pick_rate,
                games=composition.stats.games,
            )
        ]
    )
