export type SortKey = "average_placement" | "win_rate" | "top_four_rate" | "pick_rate";

export type MetaFilters = {
  patch?: string;
  region?: string;
  rankTier?: string;
  playstyle?: string;
};

export type Patch = {
  id: string;
  display_name: string;
  release_date: string;
  is_current: boolean;
};

export type CompositionStats = {
  patch: string;
  region: string;
  rank_tier: string;
  games: number;
  average_placement: number;
  top_four_rate: number;
  win_rate: number;
  pick_rate: number;
};

export type Unit = {
  name: string;
  cost: number;
  role: string;
  recommended_stars: number;
  priority: number;
};

export type Trait = {
  name: string;
  active_tier: string;
  breakpoint_text: string;
};

export type Item = {
  name: string;
  category: string;
  holder: string;
  priority: number;
};

export type CompositionSummary = {
  id: string;
  name: string;
  slug: string;
  playstyle: string;
  difficulty: string;
  summary: string;
  stats: CompositionStats;
  meta_score: number;
};

export type CompositionDetail = CompositionSummary & {
  units: Unit[];
  traits: Trait[];
  items: Item[];
  strengths: string[];
  weaknesses: string[];
  timing_notes: string[];
};

export type CompositionListResponse = {
  items: CompositionSummary[];
};

export type PatchListResponse = {
  items: Patch[];
};

export type MetaSummary = {
  total_games: number;
  average_top_four_rate: number;
  average_win_rate: number;
  composition_count: number;
};

export type TrendPoint = {
  patch: string;
  average_placement: number;
  top_four_rate: number;
  win_rate: number;
  pick_rate: number;
  games: number;
};

export type TrendResponse = {
  items: TrendPoint[];
};
