import React, { useMemo } from "react";
import "../styles/Dashboard.css";
import { usePersistentState } from "../hooks/usePersistentState";

// Liste d'objectifs généraux ludiques et variés
const GENERAL_GOALS = [
  // RAPIDITÉ & COMBO
  {
    id: "combo_10",
    label: "Combo 10 : 10 clics en 10 secondes",
    emoji: ["😴", "🙂", "😮", "💥"],
    check: ({ history }) => {
      if (!history.length) return 0;
      let max = 0;
      for (let i = 0; i < history.length; i++) {
        const t0 = new Date(history[i].time).getTime();
        let count = 1;
        for (let j = i + 1; j < history.length; j++) {
          const t1 = new Date(history[j].time).getTime();
          if (t1 - t0 <= 10000) count++;
          else break;
        }
        if (count > max) max = count;
      }
      return Math.min(max / 10, 1);
    }
  },
  {
    id: "combo_25",
    label: "Combo 25 : 25 clics en 30 secondes",
    emoji: ["😴", "🙂", "😮", "🔥"],
    check: ({ history }) => {
      if (!history.length) return 0;
      let max = 0;
      for (let i = 0; i < history.length; i++) {
        const t0 = new Date(history[i].time).getTime();
        let count = 1;
        for (let j = i + 1; j < history.length; j++) {
          const t1 = new Date(history[j].time).getTime();
          if (t1 - t0 <= 30000) count++;
          else break;
        }
        if (count > max) max = count;
      }
      return Math.min(max / 25, 1);
    }
  },
  // SÉRIE QUOTIDIENNE
  {
    id: "daily_streak_7",
    label: "Série quotidienne : 7 jours de clics consécutifs",
    emoji: ["😴", "🙂", "😮", "📅"],
    check: ({ history }) => {
      if (!history.length) return 0;
      // Récupère les jours uniques où il y a eu au moins un clic
      const days = Array.from(new Set(history.map(h => new Date(h.time).toDateString())));
      let streak = 1, maxStreak = 1;
      for (let i = 1; i < days.length; i++) {
        const prev = new Date(days[i - 1]);
        const curr = new Date(days[i]);
        if ((curr - prev) === 86400000) streak++;
        else streak = 1;
        if (streak > maxStreak) maxStreak = streak;
      }
      return Math.min(maxStreak / 7, 1);
    }
  },
  // POLYVALENCE
  {
    id: "polyvalent",
    label: "Polyvalent : cliquer sur chaque compteur en 1h",
    emoji: ["😴", "🙂", "😮", "🧭"],
    check: ({ history, countersCount }) => {
      const now = Date.now();
      const lastHour = history.filter(h => new Date(h.time).getTime() >= now - 3600000);
      const unique = new Set(lastHour.map(h => h.index));
      return Math.min(unique.size / countersCount, 1);
    }
  },
  // MARATHON
  {
    id: "marathon_1000",
    label: "Marathon : 1000 clics au total",
    emoji: ["😴", "🙂", "😮", "🏃‍♂️"],
    check: ({ history }) => Math.min(history.length / 1000, 1)
  },
  {
    id: "ultra_5000",
    label: "Ultra Marathon : 5000 clics au total",
    emoji: ["😴", "🙂", "😮", "🥇"],
    check: ({ history }) => Math.min(history.length / 5000, 1)
  },
  // MATINAL & NOCTAMBULE
  {
    id: "matinal",
    label: "Matinal : un clic entre 5h et 7h du matin",
    emoji: ["😴", "🙂", "😮", "🌅"],
    check: ({ history }) => {
      return history.some(h => {
        const hour = new Date(h.time).getHours();
        return hour >= 5 && hour < 7;
      }) ? 1 : 0;
    }
  },
  {
    id: "noctambule",
    label: "Noctambule : un clic entre 1h et 3h du matin",
    emoji: ["😴", "🙂", "😮", "🌙"],
    check: ({ history }) => {
      return history.some(h => {
        const hour = new Date(h.time).getHours();
        return hour >= 1 && hour < 3;
      }) ? 1 : 0;
    }
  },
  // OBJECTIFS CLASSIQUES
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
  // TOUS LES COMPTEURS
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
  },
  // PERSONNALISATION
  {
    id: "styliste",
    label: "Styliste : changer la couleur de tous les compteurs",
    emoji: ["😴", "🙂", "😮", "🖌️"],
    check: ({ config, categoryKeys }) => {
      // On considère qu'un compteur a été personnalisé si sa couleur n'est pas la couleur par défaut
      let total = 0, changed = 0;
      categoryKeys.forEach(key => {
        config.counters[key].forEach(c => {
          total++;
          if (c.color && c.color !== "#646cff") changed++;
        });
      });
      return Math.min(changed / total, 1);
    }
  },
  // EASTER EGG
  {
    id: "easter_egg",
    label: "Easter Egg : nommer un compteur 'Copilot'",
    emoji: ["😴", "🙂", "😮", "🥚"],
    check: ({ config, categoryKeys }) => {
      return categoryKeys.some(key =>
        config.counters[key].some(c => c.label && c.label.toLowerCase().includes("copilot"))
      ) ? 1 : 0;
    }
  },
  // SÉRIE PARFAITE
  {
    id: "perfect_streak",
    label: "Série parfaite : atteindre l’objectif sur tous les compteurs le même jour",
    emoji: ["😴", "🙂", "😮", "🏅"],
    check: ({ history, objectifs, counts, countersCount }) => {
      // On regarde si, pour un jour donné, tous les compteurs ont atteint ou dépassé leur objectif
      if (!history.length) return 0;
      const byDay = {};
      history.forEach(h => {
        const day = new Date(h.time).toDateString();
        if (!byDay[day]) byDay[day] = Array(countersCount).fill(0);
        byDay[day][h.index] += 1;
      });
      let found = false;
      Object.values(byDay).forEach(dayCounts => {
        if (dayCounts.every((v, i) => v >= (objectifs?.[i] || 1))) found = true;
      });
      return found ? 1 : 0;
    }
  },
  // DÉCOUVERTE
  {
    id: "decouverte",
    label: "Découverte : modifier le nom ou la couleur de chaque compteur au moins une fois",
    emoji: ["😴", "🙂", "😮", "🎨"],
    check: ({ config, categoryKeys }) => {
      let total = 0, changed = 0;
      categoryKeys.forEach(key => {
        config.counters[key].forEach(c => {
          total++;
          if ((c.label && c.label !== "") || (c.color && c.color !== "#646cff")) changed++;
        });
      });
      return Math.min(changed / total, 1);
    }
  },
  // OBJECTIF ÉCLAIR
  {
    id: "objectif_eclair",
    label: "Objectif éclair : atteindre un objectif en moins de 2 minutes après modification",
    emoji: ["😴", "🙂", "😮", "⚡"],
    check: ({ history, config, categoryKeys }) => {
      // Suppose que chaque modification de compteur est enregistrée dans config.counters avec un champ "lastEdit" (timestamp)
      // Sinon, il faut ajouter ce champ lors de la modification
      let found = false;
      categoryKeys.forEach(key => {
        config.counters[key].forEach((c, i) => {
          if (c.lastEdit) {
            const clicks = history.filter(h => h.index === i && new Date(h.time).getTime() >= c.lastEdit);
            if (clicks.length >= (c.objectif || 1)) {
              const first = new Date(clicks[0]?.time).getTime();
              const last = new Date(clicks[(c.objectif || 1) - 1]?.time).getTime();
              if (last - first <= 120000) found = true;
            }
          }
        });
      });
      return found ? 1 : 0;
    }
  },
  // SANS FAUTE
  {
    id: "sans_faute",
    label: "Sans faute : ne jamais descendre sous l’objectif pendant 3 jours consécutifs",
    emoji: ["😴", "🙂", "😮", "🛡️"],
    check: ({ history, objectifs, countersCount }) => {
      // Pour chaque jour, vérifier que tous les compteurs >= objectif
      if (!history.length) return 0;
      const byDay = {};
      history.forEach(h => {
        const day = new Date(h.time).toDateString();
        if (!byDay[day]) byDay[day] = Array(countersCount).fill(0);
        byDay[day][h.index] += 1;
      });
      const days = Object.values(byDay);
      let streak = 0, maxStreak = 0;
      for (let i = 0; i < days.length; i++) {
        if (days[i].every((v, j) => v >= (objectifs?.[j] || 1))) streak++;
        else streak = 0;
        if (streak > maxStreak) maxStreak = streak;
      }
      return Math.min(maxStreak / 3, 1);
    }
  },
  // PARTAGEUR
  {
    id: "partageur",
    label: "Partageur : exporter un CSV ou une image du dashboard",
    emoji: ["😴", "🙂", "😮", "📤"],
    check: () => {
      // Suppose que tu mets un flag dans localStorage à l'export
      return localStorage.getItem("statsland_exported") === "1" ? 1 : 0;
    }
  },
];

// Ajoute ces nouveaux défis à GENERAL_GOALS :
GENERAL_GOALS.push(
  // IRON CLICKER
  {
    id: "iron_clicker",
    label: "Iron Clicker : 1 clic chaque jour pendant 30 jours consécutifs",
    emoji: ["😴", "🙂", "😮", "🦾"],
    check: ({ history }) => {
      if (!history.length) return 0;
      const days = Array.from(new Set(history.map(h => new Date(h.time).toDateString())));
      let streak = 1, maxStreak = 1;
      for (let i = 1; i < days.length; i++) {
        const prev = new Date(days[i - 1]);
        const curr = new Date(days[i]);
        if ((curr - prev) === 86400000) streak++;
        else streak = 1;
        if (streak > maxStreak) maxStreak = streak;
      }
      return Math.min(maxStreak / 30, 1);
    }
  },
  // SPEED DEMON
  {
    id: "speed_demon",
    label: "Speed Demon : 50 clics en 5 secondes",
    emoji: ["😴", "🙂", "😮", "⚡️"],
    check: ({ history }) => {
      if (!history.length) return 0;
      let max = 0;
      for (let i = 0; i < history.length; i++) {
        const t0 = new Date(history[i].time).getTime();
        let count = 1;
        for (let j = i + 1; j < history.length; j++) {
          const t1 = new Date(history[j].time).getTime();
          if (t1 - t0 <= 5000) count++;
          else break;
        }
        if (count > max) max = count;
      }
      return Math.min(max / 50, 1);
    }
  },
  // ALL PERFECT
  {
    id: "all_perfect",
    label: "All Perfect : atteindre l’objectif sur tous les compteurs chaque jour pendant 7 jours d’affilée",
    emoji: ["😴", "🙂", "😮", "🌟"],
    check: ({ history, objectifs, countersCount }) => {
      if (!history.length) return 0;
      const byDay = {};
      history.forEach(h => {
        const day = new Date(h.time).toDateString();
        if (!byDay[day]) byDay[day] = Array(countersCount).fill(0);
        byDay[day][h.index] += 1;
      });
      // Pour chaque jour, tous les compteurs doivent avoir atteint l'objectif
      const days = Object.values(byDay).map(dayCounts =>
        dayCounts.every((v, i) => v >= (objectifs?.[i] || 1))
      );
      // Cherche la plus longue série de jours consécutifs "parfaits"
      let streak = 0, maxStreak = 0;
      for (let i = 0; i < days.length; i++) {
        if (days[i]) streak++;
        else streak = 0;
        if (streak > maxStreak) maxStreak = streak;
      }
      return Math.min(maxStreak / 7, 1);
    }
  },
  // ULTRA POLYVALENT
  {
    id: "ultra_polyvalent",
    label: "Ultra Polyvalent : cliquer sur chaque compteur au moins 10 fois dans la même minute",
    emoji: ["😴", "🙂", "😮", "🧨"],
    check: ({ history, countersCount }) => {
      if (!history.length) return 0;
      let found = false;
      // Pour chaque minute glissante, vérifie le critère
      for (let i = 0; i < history.length; i++) {
        const t0 = new Date(history[i].time).getTime();
        const window = history.filter(h => {
          const t = new Date(h.time).getTime();
          return t >= t0 && t < t0 + 60000;
        });
        const counts = Array(countersCount).fill(0);
        window.forEach(h => { if (h.index < countersCount) counts[h.index]++; });
        if (counts.every(v => v >= 10)) { found = true; break; }
      }
      return found ? 1 : 0;
    }
  },
  // NIGHT OWL
  {
    id: "night_owl",
    label: "Night Owl : 100 clics entre 2h et 4h du matin",
    emoji: ["😴", "🙂", "😮", "🦉"],
    check: ({ history }) => {
      const count = history.filter(h => {
        const hour = new Date(h.time).getHours();
        return hour >= 2 && hour < 4;
      }).length;
      return Math.min(count / 100, 1);
    }
  },
  // NO LIFE
  {
    id: "no_life",
    label: "No Life : 10 000 clics en moins de 7 jours",
    emoji: ["😴", "🙂", "😮", "💀"],
    check: ({ history }) => {
      if (!history.length) return 0;
      // Cherche une fenêtre de 7 jours avec 10 000 clics
      let max = 0;
      for (let i = 0; i < history.length; i++) {
        const t0 = new Date(history[i].time).getTime();
        let count = 1;
        for (let j = i + 1; j < history.length; j++) {
          const t1 = new Date(history[j].time).getTime();
          if (t1 - t0 <= 7 * 24 * 3600 * 1000) count++;
          else break;
        }
        if (count > max) max = count;
      }
      return Math.min(max / 10000, 1);
    }
  },
  // CLUTCH MASTER
  {
    id: "clutch_master",
    label: "Clutch Master : atteindre un objectif à exactement 23h59:59",
    emoji: ["😴", "🙂", "😮", "⏰"],
    check: ({ history, objectifs, counts }) => {
      // On cherche un clic qui fait passer un compteur à son objectif à 23h59:59
      for (let h of history) {
        const t = new Date(h.time);
        if (t.getHours() === 23 && t.getMinutes() === 59 && t.getSeconds() === 59) {
          // On vérifie si ce clic atteint l'objectif
          // Pour ça, on compte le nombre de clics sur ce compteur jusqu'à ce moment
          const clicks = history.filter(e =>
            e.index === h.index &&
            new Date(e.time) <= t
          ).length;
          if (objectifs && clicks === (objectifs[h.index] || 0)) return 1;
        }
      }
      return 0;
    }
  },
  // THE COLLECTOR
  {
    id: "the_collector",
    label: "The Collector : débloquer toutes les autres récompenses",
    emoji: ["😴", "🙂", "😮", "🏅"],
    check: ({ goals }) => {
      // On considère débloqué si toutes les autres récompenses sont à 1 (sauf celle-ci)
      if (!goals) return 0;
      const others = goals.filter(g => g.id !== "the_collector");
      return others.every(g => g.progress >= 1) ? 1 : 0;
    }
  },
  // SPEEDRUN 1000
  {
    id: "speedrun_1000",
    label: "Speedrun 1000 : 1000 clics sur un compteur en moins de 24h après sa création",
    emoji: ["😴", "🙂", "😮", "🚀"],
    check: ({ history, config, categoryKeys }) => {
      // Suppose que chaque compteur a un champ "createdAt" (timestamp)
      let found = false;
      let idx = 0;
      categoryKeys.forEach(key => {
        config.counters[key].forEach((c, i) => {
          if (c.createdAt) {
            const clicks = history.filter(h =>
              h.index === idx &&
              new Date(h.time).getTime() >= c.createdAt &&
              new Date(h.time).getTime() <= c.createdAt + 24 * 3600 * 1000
            );
            if (clicks.length >= 1000) found = true;
          }
          idx++;
        });
      });
      return found ? 1 : 0;
    }
  },
  // PERFECT EXPORT
  {
    id: "perfect_export",
    label: "Perfect Export : exporter alors que tous les compteurs sont à leur objectif ou plus",
    emoji: ["😴", "🙂", "😮", "📦"],
    check: ({ counts, config, categoryKeys }) => {
      // Suppose que tu mets un flag dans localStorage à l'export
      if (localStorage.getItem("statsland_exported") !== "1") return 0;
      // Vérifie que tous les compteurs sont à l'objectif ou plus
      let idx = 0;
      for (let key of categoryKeys) {
        for (let c of config.counters[key]) {
          if ((counts[idx] || 0) < (c.objectif || 1)) return 0;
          idx++;
        }
      }
      return 1;
    }
  }
);

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

// Ajoute ici de nouvelles récompenses variées, fun, faciles, moyennes, difficiles !
const EXTRA_GOALS = [
  // FACILES
  {
    id: "premier_clic",
    label: "Premier clic : Bravo pour ton tout premier clic !",
    emoji: ["😴", "🙂", "😮", "👋"],
    check: ({ history }) => history.length > 0 ? 1 : 0
  },
  {
    id: "premier_objectif",
    label: "Premier objectif : Atteindre un objectif sur n'importe quel compteur",
    emoji: ["😴", "🙂", "😮", "🎯"],
    check: ({ counts, objectifs }) => counts.some((v, i) => v >= (objectifs?.[i] || 1)) ? 1 : 0
  },
  {
    id: "matin_clic",
    label: "Bonjour ! : Faire un clic entre 6h et 9h",
    emoji: ["😴", "🙂", "😮", "☀️"],
    check: ({ history }) => history.some(h => {
      const hour = new Date(h.time).getHours();
      return hour >= 6 && hour < 9;
    }) ? 1 : 0
  },
  {
    id: "soir_clic",
    label: "Bonne soirée ! : Faire un clic entre 20h et 22h",
    emoji: ["😴", "🙂", "😮", "🌆"],
    check: ({ history }) => history.some(h => {
      const hour = new Date(h.time).getHours();
      return hour >= 20 && hour < 22;
    }) ? 1 : 0
  },
  // MOYENNES
  {
    id: "double_combo",
    label: "Double Combo : 2 compteurs à l'objectif le même jour",
    emoji: ["😴", "🙂", "😮", "✌️"],
    check: ({ history, objectifs, countersCount }) => {
      if (!history.length) return 0;
      const byDay = {};
      history.forEach(h => {
        const day = new Date(h.time).toDateString();
        if (!byDay[day]) byDay[day] = Array(countersCount).fill(0);
        byDay[day][h.index] += 1;
      });
      return Object.values(byDay).some(dayCounts =>
        dayCounts.filter((v, i) => v >= (objectifs?.[i] || 1)).length >= 2
      ) ? 1 : 0;
    }
  },
  {
    id: "weekend_warrior",
    label: "Weekend Warrior : Faire 50 clics un samedi ou dimanche",
    emoji: ["😴", "🙂", "😮", "🏖️"],
    check: ({ history }) => {
      const byDay = {};
      history.forEach(h => {
        const d = new Date(h.time);
        if (d.getDay() === 0 || d.getDay() === 6) { // dimanche=0, samedi=6
          const day = d.toDateString();
          byDay[day] = (byDay[day] || 0) + 1;
        }
      });
      return Object.values(byDay).some(v => v >= 50) ? 1 : 0;
    }
  },
  {
    id: "midnight_maniac",
    label: "Midnight Maniac : Faire 10 clics entre 0h et 1h",
    emoji: ["😴", "🙂", "😮", "🦇"],
    check: ({ history }) => {
      const count = history.filter(h => {
        const hour = new Date(h.time).getHours();
        return hour === 0;
      }).length;
      return Math.min(count / 10, 1);
    }
  },
  {
    id: "edit_fan",
    label: "Personnaliseur : Modifier 10 fois un compteur",
    emoji: ["😴", "🙂", "😮", "🛠️"],
    check: ({ config, categoryKeys }) => {
      let edits = 0;
      categoryKeys.forEach(key => {
        config.counters[key].forEach(c => {
          if (c.lastEditCount && c.lastEditCount >= 10) edits++;
        });
      });
      return edits > 0 ? 1 : 0;
    }
  },
  // DIFFICILES
  {
    id: "triple_objectif",
    label: "Triple Objectif : 3 compteurs à l'objectif le même jour",
    emoji: ["😴", "🙂", "😮", "🥉"],
    check: ({ history, objectifs, countersCount }) => {
      if (!history.length) return 0;
      const byDay = {};
      history.forEach(h => {
        const day = new Date(h.time).toDateString();
        if (!byDay[day]) byDay[day] = Array(countersCount).fill(0);
        byDay[day][h.index] += 1;
      });
      return Object.values(byDay).some(dayCounts =>
        dayCounts.filter((v, i) => v >= (objectifs?.[i] || 1)).length >= 3
      ) ? 1 : 0;
    }
  },
  {
    id: "insomniaque",
    label: "Insomniaque : Faire un clic chaque heure pendant 24h",
    emoji: ["😴", "🙂", "😮", "🕛"],
    check: ({ history }) => {
      if (!history.length) return 0;
      const byDay = {};
      history.forEach(h => {
        const d = new Date(h.time);
        const day = d.toDateString();
        if (!byDay[day]) byDay[day] = new Set();
        byDay[day].add(d.getHours());
      });
      return Object.values(byDay).some(hoursSet => hoursSet.size === 24) ? 1 : 0;
    }
  },
  {
    id: "hyper_combo",
    label: "Hyper Combo : 100 clics en 60 secondes",
    emoji: ["😴", "🙂", "😮", "💣"],
    check: ({ history }) => {
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
      return Math.min(max / 100, 1);
    }
  },
  {
    id: "zen_master",
    label: "Zen Master : Aucun clic pendant 48h, puis 1 clic",
    emoji: ["😴", "🙂", "😮", "🧘"],
    check: ({ history }) => {
      if (history.length < 2) return 0;
      for (let i = 1; i < history.length; i++) {
        const t0 = new Date(history[i - 1].time).getTime();
        const t1 = new Date(history[i].time).getTime();
        if (t1 - t0 >= 48 * 3600 * 1000) return 1;
      }
      return 0;
    }
  },
  {
    id: "rainbow_day",
    label: "Rainbow Day : Changer la couleur de tous les compteurs le même jour",
    emoji: ["😴", "🙂", "😮", "🌈"],
    check: ({ config, categoryKeys }) => {
      // On considère qu'un compteur a été modifié si lastEdit existe et est le même jour
      let editsByDay = {};
      categoryKeys.forEach(key => {
        config.counters[key].forEach(c => {
          if (c.lastEdit) {
            const day = new Date(c.lastEdit).toDateString();
            editsByDay[day] = (editsByDay[day] || 0) + 1;
          }
        });
      });
      return Object.values(editsByDay).some(v => v >= 18) ? 1 : 0; // 18 compteurs
    }
  },
  {
    id: "reset_king",
    label: "Reset King : Remettre à zéro tous les compteurs le même jour",
    emoji: ["😴", "🙂", "😮", "🔄"],
    check: ({ counts }) => counts.every(v => v === 0) ? 1 : 0
  }
];

// Fusionne toutes les récompenses
const ALL_GOALS = [...GENERAL_GOALS, ...EXTRA_GOALS];

// Récupère les données réelles des catégories
export default function Rewards() {
  const [countsA] = usePersistentState("categoryA_counts", [0,0,0,0,0,0]);
  const [countsB] = usePersistentState("categoryB_counts", [0,0,0,0,0,0]);
  const [countsC] = usePersistentState("categoryC_counts", [0,0,0,0,0,0]);
  const [historyA] = usePersistentState("categoryA_history", []);
  const [historyB] = usePersistentState("categoryB_history", []);
  const [historyC] = usePersistentState("categoryC_history", []);
  const [objectifsA] = usePersistentState("objectifsA", [50, 50, 50, 50, 50, 50]);
  const [objectifsB] = usePersistentState("objectifsB", [50, 50, 50, 50, 50, 50]);
  const [objectifsC] = usePersistentState("objectifsC", [50, 50, 50, 50, 50, 50]);
  const [config] = usePersistentState("statsland_config", { counters: { "category-a": [], "category-b": [], "category-c": [] } });

  // Fusionne toutes les données
  const allCounts = [...countsA, ...countsB, ...countsC];
  const allHistory = useMemo(() => [...historyA, ...historyB, ...historyC].sort((a, b) => new Date(a.time) - new Date(b.time)), [historyA, historyB, historyC]);
  const objectifs = [...objectifsA, ...objectifsB, ...objectifsC]; // <-- Ajoute cette ligne
  const countersCount = allCounts.length;
  const categoryKeys = ["category-a", "category-b", "category-c"];

  // 1. Premier passage : calcule tous les progrès SANS goals
  let goals = ALL_GOALS.map((goal) => {
    const progress = goal.check({
      counts: allCounts,
      history: allHistory,
      countersCount,
      config,
      categoryKeys,
      objectifs,
      goals: [] // temporaire, vide
    });
    const step = getEmojiStep(progress);
    return {
      ...goal,
      progress,
      step,
      emoji: goal.emoji[step],
      anim: anims[step]
    };
  });

  // 2. Second passage : recalcule the_collector avec la vraie liste
  goals = goals.map(g =>
    g.id === "the_collector"
      ? {
          ...g,
          progress: ALL_GOALS.find(goal => goal.id === "the_collector").check({
            counts: allCounts,
            history: allHistory,
            countersCount,
            config,
            categoryKeys,
            objectifs,
            goals // cette fois, la vraie liste !
          }),
          step: getEmojiStep(
            ALL_GOALS.find(goal => goal.id === "the_collector").check({
              counts: allCounts,
              history: allHistory,
              countersCount,
              config,
              categoryKeys,
              objectifs,
              goals
            })
          ),
          emoji: g.emoji[getEmojiStep(
            ALL_GOALS.find(goal => goal.id === "the_collector").check({
              counts: allCounts,
              history: allHistory,
              countersCount,
              config,
              categoryKeys,
              objectifs,
              goals
            })
          )],
          anim: anims[getEmojiStep(
            ALL_GOALS.find(goal => goal.id === "the_collector").check({
              counts: allCounts,
              history: allHistory,
              countersCount,
              config,
              categoryKeys,
              objectifs,
              goals
            })
          )]
        }
      : g
  );

  // Calcul de la progression totale (moyenne des progrès)
  const totalProgress = goals.reduce((sum, g) => sum + Math.min(g.progress, 1), 0) / goals.length;

  return (
    <div className="dashboard">
      <h2>Défis & Récompenses Générales</h2>

      {/* SECTION PROGRESSION TOTALE EN HAUT */}
      <div className="rewards-total-progress-section">
        <div className="rewards-total-progress-title">
          Progression Totale des Récompenses
        </div>
        <div className="rewards-total-progress-inner">
          <div className="rewards-total-progress-bar-bg">
            <div
              className="rewards-total-progress-bar"
              style={{
                width: `${Math.round(totalProgress * 100)}%`,
                boxShadow: totalProgress >= 1 ? "0 0 24px 8px gold" : "0 0 8px 2px #646cff55",
              }}
            />
          </div>
          <div className={`rewards-total-progress-percent${totalProgress >= 1 ? " done" : ""}`}>
            {totalProgress >= 1 ? "🎉 100% Terminé !" : `${Math.round(totalProgress * 100)}%`}
            {totalProgress >= 1 ? <span style={{fontSize: "1.2em"}}>🏆</span> : null}
          </div>
          <div className="rewards-total-progress-desc">
            {totalProgress >= 1
              ? "Félicitations, tu as débloqué toutes les récompenses !"
              : "Continue pour débloquer toutes les récompenses et deviens un(e) vrai(e) champion(ne) Statsland !"}
          </div>
          <div className="rewards-total-progress-stars">
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: `${8 + i * 7.5}%`,
                  fontSize: `${1.1 + Math.sin(i) * 0.5}em`,
                  color: "#ffd600",
                  opacity: 0.7 + 0.3 * Math.abs(Math.sin(i * 2)),
                  filter: "drop-shadow(0 0 6px #ffd60088)",
                  animation: `star-float 2.2s ${i * 0.13}s infinite alternate`
                }}
              >⭐</span>
            ))}
          </div>
        </div>
      </div>

      {/* GRILLE DES RÉCOMPENSES */}
      {CATEGORIES.map(cat => {
        const catGoals = goals
          .filter(g => cat.filter(g))
          .sort(cat.sort)
          .filter((g, i, arr) => arr.findIndex(x => x.id === g.id) === i); // éviter doublons

        if (!catGoals.length) return null;
        return (
          <div key={cat.id} style={{margin: "3.5rem 0 2.5rem 0"}}>
            <h3 style={{
              color: cat.color,
              fontWeight: 900,
              fontSize: "2em",
              letterSpacing: "1px",
              marginBottom: "1.2rem",
              marginTop: "2.5rem"
            }}>
              {cat.label}
            </h3>
            <div className="rewards-goals-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "2.2rem",
              margin: "2.5rem 0"
            }}>
              {catGoals.map((g, i) => (
                <div
                  key={g.id}
                  className={`reward-goal-card ${g.anim}`}
                >
                  <div className="reward-emoji" style={{ animation: g.progress >= 1 ? "emoji-pop 1.2s infinite alternate" : "emoji-bounce 1.2s infinite alternate" }}>
                    {g.emoji}
                  </div>
                  <div className="reward-label">{g.label}</div>
                  <div className="reward-progress-bar-bg">
                    <div
                      className="reward-progress-bar"
                      style={{
                        width: `${Math.min(g.progress, 1) * 100}%`,
                        background: g.progress >= 1 ? "#ffd600" : undefined,
                        boxShadow: g.progress >= 1 ? "0 0 12px 3px gold" : "none",
                        animation: g.progress >= 1 ? "goal-blink 1.2s infinite alternate" : "none"
                      }}
                    />
                  </div>
                  <div className={`reward-status${g.progress >= 1 ? " done" : ""}`}>
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
          </div>
        );
      })}
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
        @keyframes star-float {
          0% { transform: translateY(0);}
          100% { transform: translateY(-18px) scale(1.12);}
        }
        `}
      </style>
    </div>
  );
}

const CATEGORIES = [
  {
    id: "clicks",
    label: "Défis de Clics",
    color: "#646cff",
    filter: g => g.id.includes("combo") || g.id.includes("marathon") || g.id.includes("click") || g.id.includes("no_life") || g.id.includes("hyper_combo") || g.id.includes("speed_demon"),
    sort: (a, b) => a.difficulty - b.difficulty
  },
  {
    id: "objectifs",
    label: "Défis d’Objectif",
    color: "#ffce56",
    filter: g => g.id.includes("objectif") || g.id.includes("perfect") || g.id.includes("all_") || g.id.includes("triple_objectif") || g.id.includes("clutch_master") || g.id.includes("speedrun"),
    sort: (a, b) => a.difficulty - b.difficulty
  },
  {
    id: "design",
    label: "Défis de Personnalisation",
    color: "#4bc0c0",
    filter: g => g.id.includes("design") || g.id.includes("styliste") || g.id.includes("rainbow") || g.id.includes("edit") || g.id.includes("decouverte"),
    sort: (a, b) => a.difficulty - b.difficulty
  },
  {
    id: "timing",
    label: "Défis de Timing",
    color: "#ff6384",
    filter: g => g.id.includes("matin") || g.id.includes("soir") || g.id.includes("noctambule") || g.id.includes("night") || g.id.includes("insomniaque") || g.id.includes("zen_master") || g.id.includes("midnight"),
    sort: (a, b) => a.difficulty - b.difficulty
  },
  {
    id: "autres",
    label: "Autres Défis",
    color: "#6f31b5",
    filter: g => true,
    sort: (a, b) => a.difficulty - b.difficulty
  }
];