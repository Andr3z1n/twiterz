import { useState } from "react";

export default function TweetCard({ arquivo }) {
  const [modoEscuro, setModoEscuro] = useState(false);

  const alternarTema = () => {
    setModoEscuro(!modoEscuro);
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        marginTop: "10px",
        borderRadius: "10px",
        backgroundColor: modoEscuro ? "#1e1e1e" : "#ffffff",
        color: modoEscuro ? "#ffffff" : "#000000",
      }}
    >
      <button
        onClick={alternarTema}
        style={{
          padding: "8px 12px",
          marginBottom: "10px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          backgroundColor: modoEscuro ? "#ffffff" : "#333333",
          color: modoEscuro ? "#000000" : "#ffffff",
        }}
      >
        {modoEscuro ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
      </button>

      <h3>{arquivo.titulo}</h3>

      {arquivo.tipo === "video" && (
        <video src={arquivo.url} controls width="400" />
      )}

      {arquivo.tipo === "musica" && (
        <audio src={arquivo.url} controls />
      )}
    </div>
  );
}