export default function TweetCard({ arquivo }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        marginTop: "10px",
        borderRadius: "10px",
      }}
    >
      <h3>{arquivo.titulo}</h3>

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