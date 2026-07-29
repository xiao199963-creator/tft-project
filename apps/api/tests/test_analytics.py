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
