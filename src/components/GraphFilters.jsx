import React from "react";

export default function GraphFilters({
  period, setPeriod,
  granularity, setGranularity,
  visibleCounters, setVisibleCounters,
  counters,
  customRange, setCustomRange
}) {
  return (
    <div className="graph-filters-modern vertical">
      <div className="gf-group">
        <label>
          Période
          <select value={period} onChange={e => setPeriod(e.target.value)}>
            <option value="today">Aujourd'hui</option>
            <option value="24h">24h</option>
            <option value="48h">48h</option>
            <option value="7d">7 jours</option>
            <option value="1m">1 mois</option>
            <option value="custom">Personnalisé</option>
          </select>
        </label>
        {period === "custom" && (
          <div className="gf-custom-range">
            <input
              type="date"
              value={customRange.start}
              onChange={e => setCustomRange(r => ({ ...r, start: e.target.value }))}
            />
            <input
              type="date"
              value={customRange.end}
              onChange={e => setCustomRange(r => ({ ...r, end: e.target.value }))}
            />
          </div>
        )}
      </div>
      <div className="gf-group">
        <label>
          Granularité
          <select value={granularity} onChange={e => setGranularity(e.target.value)}>
            <option value="hour">Par heure</option>
            <option value="day">Par jour</option>
            <option value="week">Par semaine</option>
          </select>
        </label>
      </div>
      <div className="gf-group">
        <span>Compteurs :</span>
        <div className="gf-checkbox-list">
          {counters.map((c, i) => (
            <label key={i} className="gf-checkbox">
              <input
                type="checkbox"
                checked={visibleCounters[i]}
                onChange={() => setVisibleCounters(v => v.map((b, j) => j === i ? !b : b))}
              />
              <span style={{ color: c.color, fontWeight: 600, marginLeft: 2 }}>{c.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}