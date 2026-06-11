import { useState } from "react";
import TweetCard from "./components/TweetCard";
import "./index.css";

export default function App() {
  const [listaArquivos, setListaArquivos] = useState([]);

  function selecionarArquivo(event) {
    const file = event.target.files[0];

    if (!file) return;

    const novoArquivo = {
      id: Date.now(),
      titulo: file.name,
      tipo: file.type.startsWith("video")
        ? "video"
        : file.type.startsWith("audio")
        ? "musica"
        : "outro",
      url: URL.createObjectURL(file),
    };

    setListaArquivos((arquivos) => [
      novoArquivo,
      ...arquivos,
    ]);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>🐦 Twitter 2</h1>
      </aside>

      <main className="feed">
        <h2>Página Inicial</h2>

        <button
          onClick={() =>
            document.getElementById("arquivo").click()
          }
        >
          Escolher vídeo ou música
        </button>

        <input
          id="arquivo"
          type="file"
          accept="video/*,audio/*"
          style={{ display: "none" }}
          onChange={selecionarArquivo}
        />

        {listaArquivos.map((arquivo) => (
          <TweetCard
            key={arquivo.id}
            arquivo={arquivo}
          />
        ))}
      </main>
    </div>
  );
}