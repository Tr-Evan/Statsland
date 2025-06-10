import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import '../styles/Dashboard.css';
import { usePersistentState } from '../hooks/usePersistentState';

Chart.register(BarElement, CategoryScale, LinearScale, PointElement, LineElement);

const categoryColors = [
  { label: 'Category A', color: '#646cff' },
  { label: 'Category B', color: '#ff6384' },
  { label: 'Category C', color: '#4bc0c0' }
];

function Recap() {
  // Récupère les données de chaque catégorie
  const [countsA] = usePersistentState('categoryA_counts', [0, 0, 0, 0]);
  const [countsB] = usePersistentState('categoryB_counts', [0, 0, 0, 0]);
  const [countsC] = usePersistentState('categoryC_counts', [0, 0, 0, 0]);
  const [historyA] = usePersistentState('categoryA_history', []);
  const [historyB] = usePersistentState('categoryB_history', []);
  const [historyC] = usePersistentState('categoryC_history', []);

  // Bar chart : total par catégorie
  const barData = {
    labels: categoryColors.map(c => c.label),
    datasets: [
      {
        label: 'Total compteurs',
        data: [
          countsA.reduce((a, b) => a + b, 0),
          countsB.reduce((a, b) => a + b, 0),
          countsC.reduce((a, b) => a + b, 0)
        ],
        backgroundColor: categoryColors.map(c => c.color),
        borderColor: categoryColors.map(c => c.color),
        borderWidth: 2,
        borderRadius: 12,
      }
    ]
  };

  // Line chart : évolution du nombre total d'actions par catégorie dans le temps
  const maxLen = Math.max(historyA.length, historyB.length, historyC.length);
  const labels = Array.from({length: maxLen}, (_, i) => `Action ${i+1}`);
  const lineData = {
    labels,
    datasets: [
      {
        label: 'Category A',
        data: historyA.map((_, i) => i + 1),
        borderColor: '#646cff',
        backgroundColor: '#646cff33',
        fill: false,
        tension: 0.2,
        pointRadius: 2,
      },
      {
        label: 'Category B',
        data: historyB.map((_, i) => i + 1),
        borderColor: '#ff6384',
        backgroundColor: '#ff638433',
        fill: false,
        tension: 0.2,
        pointRadius: 2,
      },
      {
        label: 'Category C',
        data: historyC.map((_, i) => i + 1),
        borderColor: '#4bc0c0',
        backgroundColor: '#4bc0c033',
        fill: false,
        tension: 0.2,
        pointRadius: 2,
      }
    ]
  };

  return (
    <div className="dashboard">
      <h2>Récapitulatif global</h2>
      <div className="dashboard-row">
        <div className="dashboard-row-top">
          <div className="graph-container">
            <Bar data={barData} options={{
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } }
            }} />
          </div>
        </div>
        <div className="dashboard-row-bottom">
          <div className="graph-container">
            <Line data={lineData} options={{
              plugins: { legend: { labels: { color: '#646cff' } } },
              scales: { y: { beginAtZero: true } }
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recap;