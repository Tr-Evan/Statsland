import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js';
import '../styles/Dashboard.css';

Chart.register(BarElement, CategoryScale, LinearScale);

function Dashboard() {
  const [count, setCount] = useState(0);

  const data = {
    labels: ['Count'],
    datasets: [
      {
        label: 'Counter',
        data: [count],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
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
      legend: { labels: { color: '#9966ff' } }
    }
  };

  return (
    <div className="dashboard">
      <h2 style={{color:'#9966ff'}}>Accueil - Compteur général</h2>
      <div className="graph-container">
        <Bar data={data} options={options} />
      </div>
      <div className="counter" style={{background:'rgba(153,102,255,0.13)'}}>
        <span>Compteur : {count}</span>
        <button style={{background:'linear-gradient(90deg,#9966ff 60%,#b39ddb 100%)'}} onClick={() => setCount(count + 1)}>+1</button>
      </div>
    </div>
  );
}

export default Dashboard;