import { useState, useEffect } from "react";
import { supabase } from "./supabase"; // Certifique-se de que o arquivo supabase.js está na mesma pasta (src/)
import MusicUpload from "./components/MusicUpload"; 

export default function App() {
  const [modoEscuro, setModoEscuro] = useState(false);
  const [videos, setVideos] = useState([]);

  // Função para buscar os vídeos cadastrados no banco de dados
  async function buscarVideos() {
    const { data, error } = await supabase
      .from("songs")
      .select("id, title, audio_url")
      // Filtra para trazer apenas os registros que possuem link de áudio/vídeo preenchidos
      .not("audio_url", "is", null);

    if (error) {
      console.error("Erro ao buscar vídeos:", error.message);
    } else if (data) {
      setVideos(data);
    }
  }

  // Busca os vídeos automaticamente assim que o projeto abre
  useEffect(() => {
    buscarVideos();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: modoEscuro ? "#121212" : "#ffffff",
        color: modoEscuro ? "#ffffff" : "#000000",
        fontFamily: "sans-serif",
      }}
    >
      {/* Botão de Alternar Modo */}
      <button
        onClick={() => setModoEscuro(!modoEscuro)}
        style={{
          padding: "10px",
          marginBottom: "20px",
          cursor: "pointer",
          backgroundColor: modoEscuro ? "#333" : "#eee",
          color: modoEscuro ? "#fff" : "#000",
          border: "none",
          borderRadius: "4px",
        }}
      >
        {modoEscuro ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
      </button>

      {/* Formulário de Envio (Atualiza a lista de vídeos ao terminar o upload) */}
      <div style={{ marginBottom: "40px" }}>
        <MusicUpload onUploadSuccess={buscarVideos} modoEscuro={modoEscuro} />
      </div>

      {/* Seção de Exibição dos Vídeos */}
      <h2>Vídeos Enviados</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", marginTop: "20px" }}>
        {videos.map((video) => (
          <div
            key={video.id}
            style={{
              padding: "15px",
              borderRadius: "8px",
              backgroundColor: modoEscuro ? "#1e1e1e" : "#f4f4f4",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <h4 style={{ margin: "0 0 10px 0", textTransform: "capitalize" }}>{video.title}</h4>
            
            {/* Player de vídeo que executa o arquivo MP4 direto do Supabase Storage */}
            <video 
              controls 
              src={video.audio_url} 
              style={{ 
                width: "100%", 
                borderRadius: "4px", 
                backgroundColor: "#000",
                maxHeight: "200px" 
              }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
