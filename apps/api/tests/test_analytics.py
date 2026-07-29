from app.analytics import build_meta_summary, calculate_meta_score
from app.models import CompositionStats, MetaFilters
from app.repository import list_compositions


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


def test_build_meta_summary_weights_rates_by_games():
    filters = MetaFilters(patch="14.15")
    compositions = list_compositions(filters)
    total_games = sum(composition.stats.games for composition in compositions)

    summary = build_meta_summary(filters)

    assert summary.average_top_four_rate == round(
        sum(composition.stats.top_four_rate * composition.stats.games for composition in compositions) / total_games,
        3,
    )
    assert summary.average_win_rate == round(
        sum(composition.stats.win_rate * composition.stats.games for composition in compositions) / total_games,
        3,
    )
