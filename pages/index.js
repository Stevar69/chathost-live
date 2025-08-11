import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hoi! Stel je vraag maar 😊" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const next = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setMessages(m => [...m, { role: "assistant", content: data.message }]);
    } catch {
      setError("Er ging iets mis. Probeer het zo nog eens.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 760, margin: "36px auto", fontFamily: "system-ui, Arial" }}>
      <h1 style={{ textAlign: "center", marginBottom: 8 }}>ChatHost</h1>
      <p style={{ textAlign: "center", marginTop: 0, opacity: 0.8 }}>
        <small>powered by aiopio</small>
      </p>

      <div style={{
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 16,
        minHeight: 340,
        background: "#fff"
      }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              whiteSpace: "pre-wrap",
              background: m.role === "user" ? "#eef3ff" : "#f7f7f7",
              borderRadius: 10,
              padding: "10px 12px",
              margin: "8px 0"
            }}
          >
            {m.content}
          </div>
        ))}
        {loading && <div style={{ opacity: 0.7, fontStyle: "italic" }}>hmmm…</div>}
        {error && <div style={{ color: "#b91c1c", marginTop: 8 }}>{error}</div>}
      </div>

      <form onSubmit={onSubmit} style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Typ je bericht…"
          style={{
            flex: 1,
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid #e5e7eb"
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            border: "1px solid #111827",
            background: "#111827",
            color: "#fff",
            minWidth: 110
          }}
        >
          {loading ? "Bezig…" : "Sturen"}
        </button>
      </form>
    </div>
  );
}
