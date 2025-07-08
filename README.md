# 📊 Statsland

Statsland est un dashboard interactif et ludique réalisé en **React + Vite**, permettant de suivre, visualiser et gamifier des compteurs personnalisés par catégorie, avec des graphiques dynamiques, des objectifs animés, des récompenses et un mode sombre/clair.

---

## 🚀 Fonctionnalités principales

- **Compteurs personnalisés par catégorie**
  - 3 catégories principales (A, B, C), chacune avec **6 compteurs** entièrement personnalisables (nom, couleur, objectif).
  - Incrémentation rapide via des boutons interactifs.
  - Objectif visuel : chaque compteur affiche une jauge circulaire animée qui se remplit à mesure que l’on clique.
  - Barre de progression animée sous chaque compteur.
  - Modification du nom, de la couleur et de l’objectif de chaque compteur via une modale.

- **Visualisation graphique avancée**
  - **Graphique en barres** pour la répartition instantanée des compteurs.
  - **Graphique en courbes** pour l’évolution des compteurs selon la granularité (minute, heure, jour).
  - **Filtres dynamiques** : période, granularité, compteurs visibles.
  - Statistiques détaillées : nombre d’actions par minute, heure, jour, total.

- **Récapitulatif global**
  - Page `/recap` affichant un graphique global de toutes les catégories.
  - Visualisation de la progression totale et de l’historique d’actions.

- **Récompenses & Défis ludiques**
  - Page `/rewards` avec des **objectifs généraux** (ex : cliquer 150 fois en 1 minute, atteindre 100 sur un compteur, etc.).
  - 4 paliers d’emoji animés pour chaque défi : loin de l’objectif, on y arrive, bientôt gagné, défi remporté.
  - Barre de progression animée pour chaque défi.
  - Animations et trophées visuels lors de la réussite d’un objectif.
  - Les récompenses sont calculées dynamiquement à partir des vraies données des catégories.

- **Sidebar ergonomique**
  - Navigation rapide entre les catégories, le récapitulatif et les récompenses.
  - Horloge en temps réel.
  - Logo et branding personnalisés.
  - Accès rapide au mode sombre/clair.

- **Données persistantes**
  - Toutes les actions sont sauvegardées dans le navigateur (**localStorage**).
  - Les compteurs, historiques et objectifs sont conservés même après rechargement.

- **Mode sombre / clair**
  - Basculer le thème à tout moment via le bouton en bas de la sidebar.
  - Couleurs et fonds adaptés automatiquement.

---

## 🗂️ Structure du projet

```bash
src
├── assets          # Images, icônes, et autres fichiers statiques
├── components      # Composants réutilisables (Sidebar, GraphFilters, ThemeToggle, etc.)
├── dashboards      # Pages principales (CategoryA, CategoryB, CategoryC, Recap, Rewards)
├── hooks           # Hooks personnalisés (usePersistentState, useStatslandConfig)
├── styles          # Fichiers CSS et thèmes
├── utils           # Fonctions utilitaires (exportCSV, etc.)
└── App.jsx         # Composant racine
```

---

## 📚 Technologies utilisées

- **React**: Bibliothèque JavaScript pour construire des interfaces utilisateur.
- **Vite**: Outil de build et serveur de développement rapide.
- **Chart.js**: Bibliothèque pour des graphiques dynamiques.
- **React Router**: Pour la navigation entre les pages.


---

## 📦 Dépendances principales

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [react-chartjs-2](https://react-chartjs-2.js.org/)
- [chart.js](https://www.chartjs.org/)
- [react-router-dom](https://reactrouter.com/)


---

## ⚙️ Installation & Lancement

1. **Clonez le dépôt**:
   ```bash
   git clone https://github.com/votre-utilisateur/statsland.git
   cd statsland
   ```

2. **Installez les dépendances**:
   ```bash
   npm install
   ```

3. **Démarrez le serveur de développement**:
   ```bash
   npm run dev
   ```

4. **Ouvrez votre navigateur** et allez à `http://localhost:3000`.

---

## 📝 Notes

- Assurez-vous d'avoir la dernière version de **Node.js** et **npm** installée.
- Pour des raisons de performance, certaines fonctionnalités (comme les graphiques) ne sont chargées qu'à la demande.
- Les données affichées sont stockées localement pour des raisons de démonstration. Dans une application réelle, envisagez d'utiliser une base de données ou une API.

---


## 🖥️ Auteur & contact

Projet réalisé par Evan Troget.  

---