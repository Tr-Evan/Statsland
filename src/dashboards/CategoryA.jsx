import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import '../styles/Dashboard.css';
import { usePersistentState } from '../hooks/usePersistentState';

Chart.register(BarElement, CategoryScale, LinearScale, PointElement, LineElement);

const colors = [
  { bg: 'rgba(100, 108, 255, 0.6)', border: 'rgba(100, 108, 255, 1)', grad: 'linear-gradient(90deg,#646cff 60%,#535bf2 100%)', box: 'rgba(100,108,255,0.13)', label: 'Compteur Bleu' },
  { bg: 'rgba(255, 206, 86, 0.6)', border: 'rgba(255, 206, 86, 1)', grad: 'linear-gradient(90deg,#ffce56 60%,#ffe082 100%)', box: 'rgba(255,206,86,0.13)', label: 'Compteur Jaune' },
  { bg: 'rgba(54, 162, 235, 0.6)', border: 'rgba(54, 162, 235, 1)', grad: 'linear-gradient(90deg,#36a2eb 60%,#81d4fa 100%)', box: 'rgba(54,162,235,0.13)', label: 'Compteur Bleu Clair' },
  { bg: 'rgba(255, 99, 132, 0.6)', border: 'rgba(255, 99, 132, 1)', grad: 'linear-gradient(90deg,#ff6384 60%,#ffb1c1 100%)', box: 'rgba(255,99,132,0.13)', label: 'Compteur Rose' },
];

const CategoryA = () => {
  const [counts, setCounts] = usePersistentState('categoryA_counts', [0, 0, 0, 0]);
  const [history, setHistory] = usePersistentState('categoryA_history', []);

  const data = {
    labels: colors.map(c => c.label),
    datasets: [
      {
        label: 'Category A Counters',
        data: counts,
        backgroundColor: colors.map(c => c.bg),
        borderColor: colors.map(c => c.border),
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

  const windowMs = 60000; // 1 minute
  const points = 20; // nombre de points sur le graphe
  const days = 14; // nombre de jours à afficher
  const labels = Array.from({length: points}, (_, i) => {
    const d = new Date(Date.now() - (points - 1 - i) * windowMs);
    return d.toLocaleTimeString();
  });

  const lineData = {
    labels,
    datasets: colors.map((c, i) => ({
      label: c.label,
      data: getCountsPerMinute(history.filter(h => h.index === i), windowMs, points),
      borderColor: c.border,
      backgroundColor: c.bg,
      fill: false,
      tension: 0.2,
    })),
  };

  const dayLabels = Array.from({length: days}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  });

  const lineDataDays = {
    labels: dayLabels,
    datasets: colors.map((c, i) => ({
      label: c.label,
      data: getCountsPerDay(history.filter(h => h.index === i), days),
      borderColor: c.border,
      backgroundColor: c.bg,
      fill: false,
      tension: 0.2,
    })),
  };

  function getStats(period) {
    const now = new Date();
    return colors.map((c, i) => {
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
        { time: new Date().toISOString(), compteur: colors[i].label, index: i }
      ]);
      return newCounts;
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-row">
        <div className="dashboard-row-top">
          <div className="graph-container large">
            <Bar data={data} options={options} />
          </div>
          <div className="counter-list large">
            <div className="counter-grid">
              {colors.map((c, i) => {
                const objectif = 50;
                const value = Math.min(counts[i], objectif);
                const percent = value / objectif;
                const svgSize = 120;
                const radius = 50;
                const strokeWidth = 10;
                const circumference = 2 * Math.PI * radius;
                const dash = percent * circumference;
                return (
                  <div className="counter-square" key={i} style={{ background: c.box }}>
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
                          stroke={c.border}
                          strokeWidth={strokeWidth}
                          fill="none"
                          strokeDasharray={`${dash},${circumference - dash}`}
                          style={{transition: "stroke-dasharray 0.3s"}}
                        />
                      </svg>
                      <button
                        className="plus-btn"
                        style={{background: c.grad}}
                        onClick={() => handleIncrement(i)}
                      >+1</button>
                    </div>
                    <div className="counter-label">{c.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="dashboard-row-bottom">
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
              {colors.map((c, i) => (
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
          <div className="graph-container large">
            <Line data={lineDataDays} options={{ plugins: { legend: { labels: { color: colors[0].border }}}}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryA;