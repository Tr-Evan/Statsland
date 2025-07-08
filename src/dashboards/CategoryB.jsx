import React, { useState, useRef } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import '../styles/Dashboard.css';
import { usePersistentState } from '../hooks/usePersistentState';
import GraphFilters from '../components/GraphFilters';
import { exportToCSV } from '../utils/exportCSV';
import { FaPen } from "react-icons/fa";

Chart.register(BarElement, CategoryScale, LinearScale, PointElement, LineElement);

function CategoryB({ config, setConfig }) {
  const categoryKey = "category-b";
  const counters = config.counters[categoryKey];
  const categoryLabel = config.categories.find(cat => cat.key === categoryKey)?.label || "Catégorie";

  const [counts, setCounts] = usePersistentState('categoryB_counts', [0, 0, 0, 0, 0, 0]);
  const [history, setHistory] = usePersistentState('categoryB_history', []);
  const [period, setPeriod] = useState("7d");
  const [granularity, setGranularity] = useState("day");
  const [customRange, setCustomRange] = useState({start: "", end: ""});
  const [visibleCounters, setVisibleCounters] = useState([true, true, true, true, true, true]);
  const [objectifs, setObjectifs] = usePersistentState('objectifsB', [50, 50, 50, 50, 50, 50]);
  const [editIndex, setEditIndex] = useState(null);
  const [editDraft, setEditDraft] = useState({ label: "", color: "", objectif: 50 });
  const chartRef = useRef(null);

  // Génération des couleurs dynamiques
  const getCounterColor = (c) => c.color || c.border || "#646cff";
  const getCounterBg = (c) => c.bg || `${getCounterColor(c)}22`;
  const getCounterGrad = (c) => c.grad || getCounterColor(c);

  const data = {
    labels: counters.map(c => c.label),
    datasets: [
      {
        label: categoryLabel,
        data: counts,
        backgroundColor: counters.map(getCounterBg),
        borderColor: counters.map(getCounterColor),
        borderWidth: 2,
        borderRadius: 12,
      },
    ],
  };

  const options = {
    scales: {
      y: { beginAtZero: true },
    },
    plugins: {
      legend: { labels: { color: getComputedStyle(document.body).getPropertyValue('--main-text') } }
    }
  };

  function getCountsPerMinute(history, windowMs = 60000, points = 20) {
    const now = Date.now();
    const result = [];
    for (let i = points - 1; i >= 0; i--) {
      const start = now - i * windowMs;
      const end = start + windowMs;
      result.push(
        history.filter(h => {
          const t = new Date(h.time).getTime();
          return t >= start && t < end;
        }).length
      );
    }
    return result;
  }

  // Variante simple : variation binaire (action ou pas à chaque "tick")
  function getVariation(history, windowMs = 60000, points = 20) {
    const now = Date.now();
    const result = [];
    for (let i = points - 1; i >= 0; i--) {
      const start = now - i * windowMs;
      const end = start + windowMs;
      result.push(
        history.some(h => {
          const t = new Date(h.time).getTime();
          return t >= start && t < end;
        }) ? 1 : 0
      );
    }
    return result;
  }

  const windowMs = 60000; // 1 minute
  const points = 20; // nombre de points sur le graphe
  const labels = Array.from({length: points}, (_, i) => {
    const d = new Date(Date.now() - (points - 1 - i) * windowMs);
    return d.toLocaleTimeString();
  });

  const lineData = {
    labels,
    datasets: counters.map((c, i) => ({
      label: c.label,
      data: getCountsPerMinute(history.filter(h => h.index === i), windowMs, points),
      borderColor: c.border,
      backgroundColor: c.bg,
      fill: false,
      tension: 0.2,
    })),
  };

  function getCountsPerDay(history, days = 14) {
    // Retourne un tableau du nombre d'actions par jour sur les X derniers jours
    const now = new Date();
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const day = new Date(now);
      day.setHours(0, 0, 0, 0);
      day.setDate(day.getDate() - i);
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);
      result.push(
        history.filter(h => {
          const t = new Date(h.time);
          return t >= day && t < nextDay;
        }).length
      );
    }
    return result;
  }

  const days = 14; // nombre de jours à afficher
  const labels2 = Array.from({length: days}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  });

  const lineData2 = {
    labels: labels2,
    datasets: counters.map((c, i) => ({
      label: c.label,
      data: getCountsPerDay(history.filter(h => h.index === i), days),
      borderColor: c.border,
      backgroundColor: c.bg,
      fill: false,
      tension: 0.2,
    })),
  };

  function getCountsPerHour(history, hours = 24) {
    const now = new Date();
    const result = [];
    for (let i = hours - 1; i >= 0; i--) {
      const hour = new Date(now);
      hour.setMinutes(0, 0, 0);
      hour.setHours(hour.getHours() - i);
      const nextHour = new Date(hour);
      nextHour.setHours(hour.getHours() + 1);
      result.push(
        history.filter(h => {
          const t = new Date(h.time);
          return t >= hour && t < nextHour;
        }).length
      );
    }
    return result;
  }

  const hours = 24;
  const labels3 = Array.from({length: hours}, (_, i) => {
    const d = new Date();
    d.setHours(d.getHours() - (hours - 1 - i));
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  });

  const lineData3 = {
    labels: labels3,
    datasets: counters.map((c, i) => ({
      label: c.label,
      data: getCountsPerHour(history.filter(h => h.index === i), hours),
      borderColor: c.border,
      backgroundColor: c.bg,
      fill: false,
      tension: 0.2,
    })),
  };

  function getStats(period) {
    const now = new Date();
    return counters.map((c, i) => {
      let count = 0;
      history.forEach(h => {
        const t = new Date(h.time);
        if (h.index === i) {
          if (period === 'minute' && t > new Date(now.getTime() - 60000)) count++;
          if (period === 'hour' && t > new Date(now.getTime() - 3600000)) count++;
          if (period === 'day' && t > new Date(now.getTime() - 86400000)) count++;
        }
      });
      return count;
    });
  }

  const handleIncrement = (i) => {
    setCounts(counts => {
      const newCounts = counts.map((v, j) => j === i ? v + 1 : v);
      setHistory(hist => [
        ...hist,
        { time: new Date().toISOString(), compteur: counters[i].label, index: i }
      ]);
      return newCounts;
    });
  };

  // Modification via pop-up
  const openEdit = (i) => {
    setEditIndex(i);
    setEditDraft({
      label: counters[i].label,
      color: getCounterColor(counters[i]),
      objectif: objectifs[i]
    });
  };
  const applyEdit = () => {
    setConfig(cfg => ({
      ...cfg,
      counters: {
        ...cfg.counters,
        [categoryKey]: cfg.counters[categoryKey].map((c, j) =>
          j === editIndex ? { ...c, label: editDraft.label, color: editDraft.color, border: editDraft.color, bg: `${editDraft.color}22` } : c
        )
      }
    }));
    setObjectifs(obj => obj.map((v, j) => j === editIndex ? Number(editDraft.objectif) : v));
    setEditIndex(null);
  };
  const cancelEdit = () => setEditIndex(null);

  // Filtre l'historique selon la période sélectionnée
  function filterHistoryByPeriod(history, period, customRange) {
    const now = new Date();
    let start;
    switch (period) {
      case "today":
        start = new Date(now); start.setHours(0,0,0,0); break;
      case "24h":
        start = new Date(now.getTime() - 24*60*60*1000); break;
      case "48h":
        start = new Date(now.getTime() - 48*60*60*1000); break;
      case "7d":
        start = new Date(now.getTime() - 7*24*60*60*1000); break;
      case "1m":
        start = new Date(now.getTime() - 30*24*60*60*1000); break;
      case "custom":
        start = customRange.start ? new Date(customRange.start) : null;
        break;
      default:
        start = null;
    }
    let end = period === "custom" && customRange.end ? new Date(customRange.end) : now;
    return history.filter(h => {
      const t = new Date(h.time);
      return (!start || t >= start) && (!end || t <= end);
    });
  }

  const filteredHistory = filterHistoryByPeriod(history, period, customRange);

  // Génère les labels et data selon la granularité
  let lineLabels, getDataFunc, dataArg;
  if (granularity === "day") {
    lineLabels = labels2;
    getDataFunc = getCountsPerDay;
    dataArg = days;
  } else if (granularity === "hour") {
    lineLabels = labels3;
    getDataFunc = getCountsPerHour;
    dataArg = hours;
  } else {
    lineLabels = labels;
    getDataFunc = getCountsPerMinute;
    dataArg = points;
  }

  const filteredLineData = {
    labels: lineLabels,
    datasets: counters
      .map((c, i) => visibleCounters[i] ? {
        label: c.label,
        data: getDataFunc(filteredHistory.filter(h => h.index === i), dataArg),
        borderColor: c.border || c.color,
        backgroundColor: c.bg || c.color,
        fill: false,
        tension: 0.2,
      } : null)
      .filter(Boolean)
  };

  return (
    <div className="dashboard">
      <div className="category-header">
        <h2>{categoryLabel}</h2>
        <div className="category-actions">
          <button onClick={() => exportToCSV("stats.csv", [
            ["Date", "Compteur", "Index"],
            ...history.map(h => [h.time, h.compteur, h.index])
          ])}>
            Exporter CSV
          </button>
          <button onClick={() => {
            if (chartRef.current) {
              const chartInstance = chartRef.current;
              const url = chartInstance.toBase64Image("image/png", 1);
              const a = document.createElement("a");
              a.href = url;
              a.download = "graph.png";
              a.click();
            } else {
              alert("Graphique non prêt !");
            }
          }}>
            Exporter Image
          </button>
        </div>
      </div>
      <div className="dashboard-row">
        <div className="dashboard-row-top">
          <div className="graph-container large">
            <Bar ref={chartRef} data={data} options={options} />
          </div>
          <div className="counter-list large">
            <div className="counter-grid">
              {counters.map((c, i) => {
                const objectif = objectifs[i];
                const value = Math.min(counts[i], objectif);
                const percent = objectif ? value / objectif : 0;
                const svgSize = 120;
                const radius = 50;
                const strokeWidth = 10;
                const circumference = 2 * Math.PI * radius;
                const dash = percent * circumference;
                return (
                  <div
                    className="counter-square"
                    key={i}
                    style={{ background: getCounterBg(c) }}
                    onMouseEnter={e => e.currentTarget.classList.add('hover')}
                    onMouseLeave={e => e.currentTarget.classList.remove('hover')}
                  >
                    <button
                      className="edit-btn"
                      style={{pointerEvents: "auto" }}
                      onClick={() => openEdit(i)}
                      tabIndex={-1}
                    >
                      <FaPen size={16} />
                    </button>
                    <div className="counter-center">
                      <svg className="progress-circle" width={svgSize} height={svgSize}>
                        <circle
                          className="progress-bg"
                          cx={svgSize/2} cy={svgSize/2} r={radius}
                          stroke="#e0e0e0"
                          strokeWidth={strokeWidth}
                          fill="none"
                        />
                        <circle
                          className="progress-bar"
                          cx={svgSize/2} cy={svgSize/2} r={radius}
                          stroke={getCounterColor(c)}
                          strokeWidth={strokeWidth}
                          fill="none"
                          strokeDasharray={`${dash},${circumference - dash}`}
                          style={{transition: "stroke-dasharray 0.3s"}}
                        />
                      </svg>
                      <button
                        className="plus-btn"
                        style={{
                          background: getCounterColor(c),
                          color: "#fff"
                        }}
                        onClick={() => handleIncrement(i)}
                      >+1</button>
                    </div>
                    <div className="counter-label">{c.label}</div>
                    {editIndex === i && (
                      <div className="modal-overlay">
                        <div className="modal modern-modal">
                          <h3>Personnaliser le compteur</h3>
                          <div className="modal-fields">
                            <label>
                              <span>Nom</span>
                              <input
                                type="text"
                                value={editDraft.label}
                                onChange={e => setEditDraft(d => ({ ...d, label: e.target.value }))}
                                maxLength={32}
                                autoFocus
                              />
                            </label>
                            <label>
                              <span>Couleur</span>
                              <input
                                type="color"
                                value={editDraft.color}
                                onChange={e => setEditDraft(d => ({ ...d, color: e.target.value }))}
                              />
                            </label>
                            <label>
                              <span>Objectif</span>
                              <input
                                type="number"
                                min={1}
                                value={editDraft.objectif}
                                onChange={e => setEditDraft(d => ({ ...d, objectif: e.target.value }))}
                              />
                            </label>
                          </div>
                          <div className="modal-actions">
                            <button className="btn-accent" onClick={applyEdit}>Appliquer</button>
                            <button className="btn-outline" onClick={cancelEdit}>Annuler</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="dashboard-row-bottom">
          <div className="stats-table-container">
            <table className="stats-table large">
              <thead>
                <tr>
                  <th>Compteur</th>
                  <th>Dernière minute</th>
                  <th>Dernière heure</th>
                  <th>Dernier jour</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {counters.map((c, i) => (
                  <tr key={i}>
                    <td>{c.label}</td>
                    <td>{getStats('minute')[i]}</td>
                    <td>{getStats('hour')[i]}</td>
                    <td>{getStats('day')[i]}</td>
                    <td>{counts[i]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="graph-container large graph-flex">
            <div className="graph-side-panel">
              <span className="graph-title">{categoryLabel} – Courbe</span>
              <div className="graph-filters-vertical">
                <GraphFilters
                  period={period} setPeriod={setPeriod}
                  granularity={granularity} setGranularity={setGranularity}
                  visibleCounters={visibleCounters} setVisibleCounters={setVisibleCounters}
                  counters={counters}
                  customRange={customRange} setCustomRange={setCustomRange}
                />
              </div>
            </div>
            <div className="graph-canvas-panel">
              <Line ref={chartRef} data={filteredLineData} options={{ plugins: { legend: { labels: { color: counters[0].border }}}}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryB;