import React from "react";

export default function GraphFilters({
  period, setPeriod,
  granularity, setGranularity,
  visibleCounters, setVisibleCounters,
  counters,
  customRange, setCustomRange
}) {
  return (
    <div className="graph-filters-modern">
      <div className="gf-group">
        <label>Granularité&nbsp;
          <select value={granularity} onChange={e => setGranularity(e.target.value)}>
            <option value="hour">Par heure</option>
            <option value="day">Par jour</option>
            <option value="week">Par semaine</option>
          </select>
        </label>
      </div>
      <div className="gf-group">
        <span>Compteurs :</span>
        {counters.map((c, i) => (
          <label key={i} className="gf-checkbox">
            <input
              type="checkbox"
              checked={visibleCounters[i]}
              onChange={() => setVisibleCounters(v => v.map((b, j) => j === i ? !b : b))}
            />
            <span style={{color: c.color, fontWeight: 600, marginLeft: 2}}>{c.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}