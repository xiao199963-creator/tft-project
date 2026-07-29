import type { Item, Trait, Unit } from "../types";

type DetailListsProps = {
  units: Unit[];
  traits: Trait[];
  items: Item[];
  strengths: string[];
  weaknesses: string[];
  timingNotes: string[];
};

function TextList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="detail-list" aria-labelledby={`${title}-heading`}>
      <h2 id={`${title}-heading`}>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function DetailLists({ units, traits, items, strengths, weaknesses, timingNotes }: DetailListsProps) {
  return (
    <div className="detail-lists">
      <section className="detail-list" aria-labelledby="units-heading">
        <h2 id="units-heading">Units</h2>
        <ul>
          {units.map((unit) => (
            <li key={unit.name}>
              <strong>{unit.name}</strong> <span>{unit.cost}-cost {unit.role}, {unit.recommended_stars}-star</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="detail-list" aria-labelledby="traits-heading">
        <h2 id="traits-heading">Traits</h2>
        <ul>
          {traits.map((trait) => (
            <li key={trait.name}>
              <strong>{trait.name} {trait.active_tier}</strong> <span>{trait.breakpoint_text}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="detail-list" aria-labelledby="items-heading">
        <h2 id="items-heading">Items</h2>
        <ul>
          {items.map((item) => (
            <li key={item.name}>
              <strong>{item.name}</strong> <span>{item.category} for {item.holder}</span>
            </li>
          ))}
        </ul>
      </section>
      <TextList title="Strengths" items={strengths} />
      <TextList title="Weaknesses" items={weaknesses} />
      <TextList title="Timing notes" items={timingNotes} />
    </div>
  );
}
