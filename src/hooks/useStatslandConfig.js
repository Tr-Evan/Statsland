import { usePersistentState } from "./usePersistentState";

const defaultConfig = {
  categories: [
    { key: "category-a", label: "Category A" },
    { key: "category-b", label: "Category B" },
    { key: "category-c", label: "Category C" }
  ],
  counters: {
    "category-a": [
      { label: "Compteur Vert", color: "#4bc0c0" },
      { label: "Compteur Bleu", color: "#36a2eb" },
      { label: "Compteur Jaune", color: "#ffce56" },
      { label: "Compteur Rouge", color: "#ff6384" }
    ],
    "category-b": [ { label: "Compteur Vert", color: "#4bc0c0" },
      { label: "Compteur Bleu", color: "#36a2eb" },
      { label: "Compteur Jaune", color: "#ffce56" },
      { label: "Compteur Rouge", color: "#ff6384" } 
    ], 
    "category-c": [ { label: "Compteur Vert", color: "#4bc0c0" },
      { label: "Compteur Bleu", color: "#36a2eb" },
      { label: "Compteur Jaune", color: "#ffce56" },
      { label: "Compteur Rouge", color: "#ff6384" } 
    ]
  }
};

export function useStatslandConfig() {
  return usePersistentState("statsland_config", defaultConfig);
}