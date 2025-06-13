import React from "react";
import '../styles/Dashboard.css';

const trophies = [
  { icon: "🏆", label: "Premier objectif atteint" },
  { icon: "🔥", label: "10 jours consécutifs" },
  { icon: "💯", label: "100 clics sur un compteur" },
  // Ajoute d'autres trophées ici
];

export default function Rewards() {
  return (
    <div className="dashboard">
      <h2>Récompenses & Trophées</h2>
      <div className="rewards-grid">
        {trophies.map((t, i) => (
          <div className="reward-card" key={i}>
            <span className="reward-icon">{t.icon}</span>
            <span className="reward-label">{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}