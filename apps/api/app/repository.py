from app.analytics import calculate_meta_score
from app.models import CompositionDetail, CompositionStats, CompositionSummary, MetaFilters, Patch
from app.seed_data import COMPOSITIONS, PATCHES


def _matches_filters(stat: dict, composition: dict, filters: MetaFilters) -> bool:
    return (
        (filters.patch is None or stat["patch"] == filters.patch)
        and (filters.region is None or stat["region"] == filters.region)
        and (filters.rank_tier is None or stat["rank_tier"] == filters.rank_tier)
        and (filters.playstyle is None or composition["playstyle"] == filters.playstyle)
    )


def _matching_stat(composition: dict, filters: MetaFilters) -> dict | None:
    return next(
        (stat for stat in composition["stats"] if _matches_filters(stat, composition, filters)),
        None,
    )


def _summary(composition: dict, stat: dict) -> CompositionSummary:
    return CompositionSummary(
        id=composition["id"],
        name=composition["name"],
        slug=composition["slug"],
        playstyle=composition["playstyle"],
        difficulty=composition["difficulty"],
        summary=composition["summary"],
        stats=stat,
        meta_score=calculate_meta_score(CompositionStats(**stat)),
    )


def list_patches() -> list[Patch]:
    return [Patch(**patch) for patch in PATCHES]


def list_compositions(filters: MetaFilters) -> list[CompositionSummary]:
    compositions = []
    for composition in COMPOSITIONS:
        stat = _matching_stat(composition, filters)
        if stat is not None:
            compositions.append(_summary(composition, stat))
    return compositions


def get_composition(slug: str, filters: MetaFilters) -> CompositionDetail | None:
    composition = next((comp for comp in COMPOSITIONS if comp["slug"] == slug), None)
    if composition is None:
        return None

    stat = _matching_stat(composition, filters)
    if stat is None:
        return None

    summary = _summary(composition, stat)
    return CompositionDetail(
        **summary.model_dump(),
        units=composition["units"],
        traits=composition["traits"],
        items=composition["items"],
        strengths=composition["strengths"],
        weaknesses=composition["weaknesses"],
        timing_notes=composition["timing_notes"],
    )


def list_trend_stats(slug: str, filters: MetaFilters) -> list[CompositionStats] | None:
    composition = next((comp for comp in COMPOSITIONS if comp["slug"] == slug), None)
    if composition is None:
        return None

    trend_filters = filters.model_copy(update={"patch": None})
    patch_order = {patch["id"]: index for index, patch in enumerate(PATCHES)}
    stats = [
        CompositionStats(**stat)
        for stat in composition["stats"]
        if _matches_filters(stat, composition, trend_filters)
    ]
    return sorted(stats, key=lambda stat: patch_order[stat.patch])
