import { useState } from "react";
import TweetCard from "./components/TweetCard";

export default function App() {
  const [modoEscuro, setModoEscuro] = useState(false);

  const arquivo = {
    titulo: "Minha Música",
    tipo: "musica",
    url: "/musica.mp3",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: modoEscuro ? "#121212" : "#ffffff",
        color: modoEscuro ? "#ffffff" : "#000000",
      }}
    >
      <button
        onClick={() => setModoEscuro(!modoEscuro)}
        style={{
          padding: "10px",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        {modoEscuro ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
      </button>

      <TweetCard arquivo={arquivo} />
    </div>
  );
}