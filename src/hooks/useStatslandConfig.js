import { usePersistentState } from "./usePersistentState";

const now = Date.now();
const defaultConfig = {
  categories: [
    { key: "category-a", label: "Category A" },
    { key: "category-b", label: "Category B" },
    { key: "category-c", label: "Category C" }
  ],
  counters: {
    "category-a": [
      { label: "Compteur Vert", color: "#4bc0c0", createdAt: now },
      { label: "Compteur Bleu", color: "#36a2eb", createdAt: now },
      { label: "Compteur Jaune", color: "#ffce56", createdAt: now },
      { label: "Compteur Rouge", color: "#ff6384", createdAt: now },
      { label: "Compteur Violet", color: "#6f31b5", createdAt: now },
      { label: "Compteur Orange", color: "#d48728", createdAt: now }
    ],
    "category-b": [ 
      { label: "Compteur Vert", color: "#4bc0c0", createdAt: now },
      { label: "Compteur Bleu", color: "#36a2eb", createdAt: now },
      { label: "Compteur Jaune", color: "#ffce56", createdAt: now },
      { label: "Compteur Rouge", color: "#ff6384", createdAt: now },
      { label: "Compteur Violet", color: "#6f31b5", createdAt: now },
      { label: "Compteur Orange", color: "#d48728", createdAt: now }
    ], 
    "category-c": [ 
      { label: "Compteur Vert", color: "#4bc0c0", createdAt: now },
      { label: "Compteur Bleu", color: "#36a2eb", createdAt: now },
      { label: "Compteur Jaune", color: "#ffce56", createdAt: now },
      { label: "Compteur Rouge", color: "#ff6384", createdAt: now },
      { label: "Compteur Violet", color: "#6f31b5", createdAt: now },
      { label: "Compteur Orange", color: "#d48728", createdAt: now }
    ]
  }
};

export function useStatslandConfig() {
  return usePersistentState("statsland_config", defaultConfig);
}