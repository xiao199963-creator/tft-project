from app.models import MetaFilters
from app.repository import get_composition, list_compositions, list_patches
from app.seed_data import SUPPORTED_RANK_TIERS, SUPPORTED_REGIONS


def test_list_patches_marks_one_current_patch():
    patches = list_patches()

    assert len(patches) >= 3
    assert sum(1 for patch in patches if patch.is_current) == 1


def test_list_compositions_filters_by_playstyle():
    comps = list_compositions(MetaFilters(playstyle="Fast 8"))

    assert comps
    assert {comp.playstyle for comp in comps} == {"Fast 8"}


def test_current_patch_has_a_comparable_stat_for_every_composition():
    comps = list_compositions(MetaFilters(patch="14.15"))

    assert len(comps) == 6
    assert {comp.stats.region for comp in comps} == {"OC1"}
    assert {comp.stats.rank_tier for comp in comps} == {"Diamond+"}


def test_current_patch_covers_every_advertised_region_and_rank_filter():
    for region in SUPPORTED_REGIONS:
        for rank_tier in SUPPORTED_RANK_TIERS:
            comps = list_compositions(MetaFilters(patch="14.15", region=region, rank_tier=rank_tier))

            assert len(comps) == 6
            assert {comp.stats.region for comp in comps} == {region}
            assert {comp.stats.rank_tier for comp in comps} == {rank_tier}


def test_get_composition_returns_units_traits_items_and_stats():
    comp = get_composition("rebel-fast-8", MetaFilters(region="OC1", rank_tier="Diamond+"))

    assert comp is not None
    assert comp.slug == "rebel-fast-8"
    assert comp.units
    assert comp.traits
    assert comp.items
    assert comp.stats.games > 0
