from app.models import CompositionStats, MetaFilters, MetaSummary


def calculate_meta_score(stats: CompositionStats) -> float:
    placement_score = max(0.0, (8.0 - stats.average_placement) / 7.0)
    top_four_score = stats.top_four_rate
    win_score = stats.win_rate * 1.5
    popularity_score = min(stats.pick_rate, 0.2) / 0.2
    return round((placement_score * 40) + (top_four_score * 30) + (win_score * 20) + (popularity_score * 10), 2)


def build_meta_summary(filters: MetaFilters) -> MetaSummary:
    from app.repository import list_compositions

    compositions = list_compositions(filters)
    count = len(compositions)

    if not count:
        return MetaSummary(
            total_games=0,
            average_top_four_rate=0.0,
            average_win_rate=0.0,
            composition_count=0,
        )

    total_games = sum(composition.stats.games for composition in compositions)
    return MetaSummary(
        total_games=total_games,
        average_top_four_rate=round(
            sum(composition.stats.top_four_rate * composition.stats.games for composition in compositions) / total_games,
            3,
        ),
        average_win_rate=round(
            sum(composition.stats.win_rate * composition.stats.games for composition in compositions) / total_games,
            3,
        ),
        composition_count=count,
    )
