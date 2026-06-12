import { useState } from "react";

export default function TweetCard({ arquivo }) {
  const [modoEscuro, setModoEscuro] = useState(false);

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        marginTop: "10px",
        borderRadius: "10px",
        backgroundColor: modoEscuro ? "#222" : "#fff",
        color: modoEscuro ? "#fff" : "#000",
      }}
    >
      <h3>{arquivo.titulo}</h3>

      <button
        onClick={() => setModoEscuro(!modoEscuro)}
        style={{
          marginBottom: "10px",
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        {modoEscuro ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
      </button>

      {arquivo.tipo === "video" && (
        <video
          src={arquivo.url}
          controls
          width="400"
        />
      )}

      {arquivo.tipo === "musica" && (
        <audio
          src={arquivo.url}
          controls
        />
      )}
    </div>
  );
}