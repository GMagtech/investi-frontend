import React from "react";

export default function App() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Investi Personnel — Dashboard</h2>
      <p>Le backend est prêt. Connecte Vercel à l’API : <b>{import.meta.env.VITE_API_BASE}</b></p>
    </div>
  );
}
