import React, { useEffect, useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function App() {
  const [symbol, setSymbol] = useState("SPY");
  const [prices, setPrices] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [lastRun, setLastRun] = useState<string>("");

  const apiBase = import.meta.env.VITE_API_BASE;

  async function loadData() {
    try {
      setBusy(true);
      await fetch(`${apiBase}/ingest/prices`, { method: "POST" });
      const p = await (await fetch(`${apiBase}/prices?symbol=${symbol}`)).json();
      setPrices(p);

      const a = await (await fetch(`${apiBase}/alerts`)).json();
      setAlerts(a);

      setLastRun(new Date().toLocaleString());
    } catch (err) {
      alert("Erreur API, vérifie le backend !");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial", color: "white", background: "#0f172a", minHeight: "100vh" }}>
      <h1>Investi Personnel</h1>
      <p>Backend : {apiBase}</p>

      <div style={{ marginTop: 10 }}>
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          style={{ padding: 6 }}
        />
        <button onClick={loadData} disabled={busy} style={{ padding: 6, marginLeft: 8 }}>
          Charger
        </button>
      </div>

      <p style={{ opacity: 0.7 }}>Dernier run : {lastRun || "-"}</p>

      <h2>Cours</h2>
      <div style={{ width: "100%", height: 300, background: "#1e293b", borderRadius: 4 }}>
        <ResponsiveContainer>
          <LineChart data={prices}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" hide />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="close" stroke="#00d084" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h2 style={{ marginTop: 20 }}>Alertes</h2>
      {alerts.length ? (
        alerts.map((a, i) => (
          <div key={i} style={{ background: "#1e293b", padding: 8, marginTop: 5, borderRadius: 3 }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{a.created_at?.slice(0, 16)}</div>
            <b>{a.message}</b> ({a.level})
          </div>
        ))
      ) : (
        <div>Aucune alerte</div>
      )}
    </div>
  );
}
