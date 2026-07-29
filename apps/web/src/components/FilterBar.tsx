import type { MetaFilters, Patch, SortKey } from "../types";

type FilterBarProps = {
  filters: MetaFilters;
  sort: SortKey;
  patches: Patch[];
  onFiltersChange: (filters: MetaFilters) => void;
  onSortChange: (sort: SortKey) => void;
};

const regions = ["OC1", "NA1", "EUW1", "KR"];
const rankTiers = ["Platinum+", "Emerald+", "Diamond+", "Master+"];
const playstyles = ["Fast 8", "Reroll", "Standard", "Fast 9", "Tempo", "Slow Roll"];

function updateFilter(
  filters: MetaFilters,
  key: keyof MetaFilters,
  value: string,
): MetaFilters {
  return { ...filters, [key]: value || undefined };
}

export function FilterBar({ filters, sort, patches, onFiltersChange, onSortChange }: FilterBarProps) {
  return (
    <section className="filter-bar" aria-label="Meta filters">
      <label>
        Patch
        <select
          value={filters.patch ?? ""}
          onChange={(event) => onFiltersChange(updateFilter(filters, "patch", event.target.value))}
        >
          <option value="">All patches</option>
          {patches.map((patch) => (
            <option key={patch.id} value={patch.id}>
              {patch.display_name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Region
        <select
          value={filters.region ?? ""}
          onChange={(event) => onFiltersChange(updateFilter(filters, "region", event.target.value))}
        >
          <option value="">All regions</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </label>
      <label>
        Rank tier
        <select
          value={filters.rankTier ?? ""}
          onChange={(event) => onFiltersChange(updateFilter(filters, "rankTier", event.target.value))}
        >
          <option value="">All ranks</option>
          {rankTiers.map((rankTier) => (
            <option key={rankTier} value={rankTier}>
              {rankTier}
            </option>
          ))}
        </select>
      </label>
      <label>
        Playstyle
        <select
          value={filters.playstyle ?? ""}
          onChange={(event) => onFiltersChange(updateFilter(filters, "playstyle", event.target.value))}
        >
          <option value="">All playstyles</option>
          {playstyles.map((playstyle) => (
            <option key={playstyle} value={playstyle}>
              {playstyle}
            </option>
          ))}
        </select>
      </label>
      <label>
        Sort by
        <select value={sort} onChange={(event) => onSortChange(event.target.value as SortKey)}>
          <option value="average_placement">Average placement</option>
          <option value="top_four_rate">Top-four rate</option>
          <option value="win_rate">Win rate</option>
          <option value="pick_rate">Pick rate</option>
        </select>
      </label>
    </section>
  );
}
