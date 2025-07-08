import React, { useMemo } from "react";
import "../styles/Dashboard.css";

// Exemple d'accès aux données globales (à adapter selon ton archi)
import { usePersistentState } from "../hooks/usePersistentState";

// Liste d'objectifs généraux ludiques
const GENERAL_GOALS = [
  {
    id: "click_150_minute",
    label: "150 clics en 1 minute (tous compteurs confondus)",
    emoji: ["😴", "🙂", "😮", "🎉"],
    check: ({ history }) => {
      // Cherche une fenêtre de 1 minute avec 150 clics
      if (!history.length) return 0;
      let max = 0;
      for (let i = 0; i < history.length; i++) {
        const t0 = new Date(history[i].time).getTime();
        let count = 1;
        for (let j = i + 1; j < history.length; j++) {
          const t1 = new Date(history[j].time).getTime();
          if (t1 - t0 <= 60000) count++;
          else break;
        }
        if (count > max) max = count;
      }
      return Math.min(max / 150, 1);
    }
  },
  {
    id: "click_5_second",
    label: "5 clics en 1 seconde (sur n'importe quel compteur)",
    emoji: ["😴", "🙂", "😮", "⚡"],
    check: ({ history }) => {
      if (!history.length) return 0;
      let max = 0;
      for (let i = 0; i < history.length; i++) {
        const t0 = new Date(history[i].time).getTime();
        let count = 1;
        for (let j = i + 1; j < history.length; j++) {
          const t1 = new Date(history[j].time).getTime();
          if (t1 - t0 <= 1000) count++;
          else break;
        }
        if (count > max) max = count;
      }
      return Math.min(max / 5, 1);
    }
  },
  {
    id: "reach_50",
    label: "Atteindre 50 sur un compteur",
    emoji: ["😴", "🙂", "😮", "🏅"],
    check: ({ counts }) => Math.min(Math.max(...counts) / 50, 1)
  },
  {
    id: "reach_100",
    label: "Atteindre 100 sur un compteur",
    emoji: ["😴", "🙂", "😮", "🏆"],
    check: ({ counts }) => Math.min(Math.max(...counts) / 100, 1)
  },
  {
    id: "reach_250",
    label: "Atteindre 250 sur un compteur",
    emoji: ["😴", "🙂", "😮", "🥇"],
    check: ({ counts }) => Math.min(Math.max(...counts) / 250, 1)
  },
  {
    id: "reach_500",
    label: "Atteindre 500 sur un compteur",
    emoji: ["😴", "🙂", "😮", "👑"],
    check: ({ counts }) => Math.min(Math.max(...counts) / 500, 1)
  },
  {
    id: "all_50",
    label: "Tous les compteurs à 50+",
    emoji: ["😴", "🙂", "😮", "🌈"],
    check: ({ counts }) => Math.min(Math.min(...counts) / 50, 1)
  },
  {
    id: "all_100",
    label: "Tous les compteurs à 100+",
    emoji: ["😴", "🙂", "😮", "🌟"],
    check: ({ counts }) => Math.min(Math.min(...counts) / 100, 1)
  }
];

// Palette d'animations CSS
const anims = [
  "emoji-far",
  "emoji-mid",
  "emoji-close",
  "emoji-win"
];

// Utilitaire pour trouver le palier d'emoji
function getEmojiStep(progress) {
  if (progress >= 1) return 3;
  if (progress >= 0.85) return 2;
  if (progress >= 0.5) return 1;
  return 0;
}

export default function Rewards() {
  // Récupère les données réelles des catégories (exemple avec CategoryA)
  const [countsA] = usePersistentState("categoryA_counts", [0,0,0,0,0,0]);
  const [countsB] = usePersistentState("categoryB_counts", [0,0,0,0,0,0]);
  const [countsC] = usePersistentState("categoryC_counts", [0,0,0,0,0,0]);
  const [historyA] = usePersistentState("categoryA_history", []);
  const [historyB] = usePersistentState("categoryB_history", []);
  const [historyC] = usePersistentState("categoryC_history", []);

  // Fusionne toutes les données
  const allCounts = [...countsA, ...countsB, ...countsC];
  const allHistory = useMemo(() => [...historyA, ...historyB, ...historyC].sort((a, b) => new Date(a.time) - new Date(b.time)), [historyA, historyB, historyC]);

  // Calcule la progression de chaque objectif général
  const goals = GENERAL_GOALS.map(goal => {
    const progress = goal.check({ counts: allCounts, history: allHistory });
    const step = getEmojiStep(progress);
    return {
      ...goal,
      progress,
      step,
      emoji: goal.emoji[step],
      anim: anims[step]
    };
  });

  return (
    <div className="dashboard">
      <h2>Défis & Récompenses Générales</h2>
      <div className="rewards-goals-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "2.2rem",
        margin: "2.5rem 0"
      }}>
        {goals.map((g, i) => (
          <div
            key={g.id}
            className={`reward-goal-card ${g.anim}`}
            style={{
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 2px 12px 0 rgba(100,108,255,0.10)",
              padding: "2em 1.5em 1.5em 1.5em",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: 210,
              overflow: "hidden"
            }}
          >
            <div style={{ fontSize: "3.2em", marginBottom: 12, animation: g.progress >= 1 ? "emoji-pop 1.2s infinite alternate" : "emoji-bounce 1.2s infinite alternate" }}>
              {g.emoji}
            </div>
            <div style={{ fontWeight: 700, fontSize: "1.15em", color: "#646cff", marginBottom: 10, textAlign: "center" }}>
              {g.label}
            </div>
            <div style={{ width: "100%", marginBottom: 10 }}>
              <div style={{
                height: 12,
                borderRadius: 7,
                background: "#e0e0e0",
                overflow: "hidden",
                position: "relative"
              }}>
                <div style={{
                  width: `${Math.min(g.progress, 1) * 100}%`,
                  height: "100%",
                  background: g.progress >= 1 ? "#ffd600" : "#646cff",
                  transition: "width 0.7s cubic-bezier(.4,0,.2,1)",
                  borderRadius: 7,
                  boxShadow: g.progress >= 1 ? "0 0 12px 3px gold" : "none",
                  animation: g.progress >= 1 ? "goal-blink 1.2s infinite alternate" : "none"
                }} />
              </div>
            </div>
            <div style={{
              fontWeight: 600,
              color: g.progress >= 1 ? "#ffd600" : "#646cff",
              fontSize: "1.05em",
              marginBottom: 6,
              marginTop: 2
            }}>
              {g.progress >= 1
                ? "Défi remporté !"
                : g.progress >= 0.85
                  ? "Bientôt gagné !"
                  : g.progress >= 0.5
                    ? "On y arrive !"
                    : "Loin de l'objectif..."}
            </div>
            {g.progress >= 1 && (
              <div style={{
                position: "absolute",
                top: 10,
                right: 18,
                fontSize: "2.2em",
                animation: "emoji-pop 1.2s infinite alternate"
              }}>
                {g.emoji}
              </div>
            )}
          </div>
        ))}
      </div>
      <style>
        {`
        @keyframes goal-blink {
          0% { box-shadow: 0 0 12px 3px gold; }
          100% { box-shadow: 0 0 24px 8px #ffd600; }
        }
        @keyframes emoji-pop {
          0% { transform: scale(1);}
          100% { transform: scale(1.18);}
        }
        @keyframes emoji-bounce {
          0% { transform: translateY(0);}
          50% { transform: translateY(-8px);}
          100% { transform: translateY(0);}
        }
        .emoji-far { filter: grayscale(0.7) opacity(0.7);}
        .emoji-mid { filter: grayscale(0.3) opacity(0.9);}
        .emoji-close { filter: grayscale(0) opacity(1);}
        .emoji-win { filter: drop-shadow(0 0 8px gold);}
        `}
      </style>
    </div>
  );
}