import React from "react";
import '../styles/Dashboard.css';

function Dashboard() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center"
    }}>
      <h1 style={{
        color: "var(--accent)",
        fontSize: "var(--font-size-xl)",
        fontWeight: "var(--font-weight-bold)"
      }}>Bienvenue sur <span style={{fontWeight:700}}>Statsland</span> !</h1>
      <p style={{fontSize:"1.2em", maxWidth: 480, margin: "0 auto 2em auto", color: "#444"}}>
        Statsland est un dashboard interactif pour suivre et visualiser vos compteurs personnalisés par catégorie, avec des graphiques dynamiques, des objectifs visuels et un mode sombre/clair.
      </p>
      <div style={{fontSize:"1.05em", color:"#646cff", marginBottom:"0.7em"}}>
        <b>➡️ Naviguez dans la barre latérale pour explorer les catégories et le récapitulatif.</b>
      </div>
      <div style={{fontSize:"0.98em", color:"#888"}}>
        Mode sombre/clair, données persistantes, et visualisation en temps réel.
      </div>
    </div>
  );
}

export default Dashboard;