# 📊 Statsland

Statsland est un dashboard interactif réalisé en React + Vite, permettant de suivre et visualiser des compteurs personnalisés par catégorie, avec des graphiques dynamiques, des objectifs visuels et un mode sombre/clair.

---

## 🚀 Fonctionnalités principales

- **Compteurs par catégorie**  
  - 3 catégories principales (A, B, C), chacune avec 4 compteurs personnalisés.
  - Incrémentation rapide via des boutons interactifs.
  - Objectif visuel : chaque compteur affiche une jauge circulaire qui se remplit à mesure que l’on clique.

- **Visualisation graphique**
  - Graphique en barres pour la répartition des compteurs.
  - Graphique en courbes (Line) pour l’évolution des compteurs par jour.
  - Statistiques détaillées : nombre d’actions par minute, heure, jour, total.

- **Récapitulatif global**
  - Page dédiée `/recap` affichant un graphique global de toutes les catégories.
  - Accès rapide via un bouton animé dans la sidebar.

- **Mode sombre / clair**
  - Basculer le thème à tout moment via le bouton en bas de la sidebar.
  - Couleurs et fonds adaptés automatiquement.

- **Sidebar ergonomique**
  - Navigation rapide entre les catégories et le récapitulatif.
  - Horloge en temps réel.
  - Logo et branding personnalisés.

- **Données persistantes**
  - Toutes les actions sont sauvegardées dans le navigateur (localStorage).
  - Les compteurs et historiques sont conservés même après rechargement.

---

## 🗂️ Structure du projet

```bash
src
├── assets          # Images, icônes, et autres fichiers statiques
├── components      # Composants réutilisables (boutons, en-têtes, etc.)
├── features        # Logique spécifique aux fonctionnalités (compteurs, graphiques)
├── layouts         # Templates de pages (avec ou sans sidebar)
├── pages          # Pages principales de l'application
│   ├── Home.jsx    # Page d'accueil avec les compteurs
│   ├── Recap.jsx   # Page de récapitulatif
│   └── NotFound.jsx # Page 404
├── services        # Appels API et gestion des données
├── store           # Gestion de l'état global (Redux, Context API)
├── styles          # Fichiers CSS et thèmes
└── App.jsx         # Composant racine
```

---

## 📚 Technologies utilisées

- **React**: Bibliothèque JavaScript pour construire des interfaces utilisateur.
- **Vite**: Outil de build et serveur de développement rapide.
- **Chart.js**: Bibliothèque pour des graphiques dynamiques.
- **React Router**: Pour la navigation entre les pages.
- **Redux Toolkit**: Pour la gestion de l'état global.
- **Axios**: Pour les requêtes HTTP.

---

## 📦 Dépendances principales

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [react-chartjs-2](https://react-chartjs-2.js.org/)
- [chart.js](https://www.chartjs.org/)
- [react-router-dom](https://reactrouter.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/) *(si utilisé)*
- [Axios](https://axios-http.com/) *(si utilisé)*

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

## 💡 Astuces

- Cliquez sur le bouton « Récapitulatif » (arc-en-ciel) dans la sidebar pour voir la synthèse globale.
- Utilisez le bouton « +1 » au centre de chaque jauge pour incrémenter rapidement vos compteurs.
- Changez de thème à tout moment pour un affichage optimal selon votre environnement.
- Les jauges circulaires sont paramétrées pour un objectif de 50 (modifiable dans le code).

---

## 🖥️ Auteur & contact

Projet réalisé par [Votre Nom ou Organisation].  
Pour toute question ou suggestion : [votre.email@exemple.com]

---

## 🤝 Contribuer

Les contributions sont les bienvenues! Voici comment vous pouvez aider:

- Signalez des bugs ou des problèmes que vous rencontrez.
- Proposez de nouvelles fonctionnalités ou améliorations.
- Soumettez des pull requests avec des corrections ou des ajouts.

Veuillez lire le fichier `CONTRIBUTING.md` pour plus de détails.

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

---

Merci d'avoir consulté Statsland! Nous espérons que ce projet vous sera utile et inspirant. N'hésitez pas à nous faire part de vos retours ou suggestions.
