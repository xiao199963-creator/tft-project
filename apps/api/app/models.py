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
