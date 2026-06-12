import { useState } from "react";

export default function TweetCard() {
  const [arquivo, setArquivo] = useState(null);
  const [modoEscuro, setModoEscuro] = useState(false);

  const selecionarArquivo = (e) => {
    const file = e.target.files[0];

    if (file) {
      setArquivo({
        nome: file.name,
        tipo: file.type,
        url: URL.createObjectURL(file),
      });
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: modoEscuro ? "#1e1e1e" : "#fff",
        color: modoEscuro ? "#fff" : "#000",
      }}
    >
      <h1>Twitter 1.0</h1>

      <button onClick={() => setModoEscuro(!modoEscuro)}>
        {modoEscuro ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
      </button>

      <br />
      <br />

      <input
        type="file"
        accept="image/*,video/*,audio/*"
        onChange={selecionarArquivo}
      />

      {arquivo && (
        <div style={{ marginTop: "20px" }}>
          <h3>{arquivo.nome}</h3>

          {arquivo.tipo.startsWith("image/") && (
            <img
              src={arquivo.url}
              alt={arquivo.nome}
              width="400"
            />
          )}

          {arquivo.tipo.startsWith("video/") && (
            <video
              src={arquivo.url}
              controls
              width="400"
            />
          )}

          {arquivo.tipo.startsWith("audio/") && (
            <audio
              src={arquivo.url}
              controls
            />
          )}
        </div>
      )}
    </div>
  );
}