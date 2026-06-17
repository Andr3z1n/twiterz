import { useState } from 'react'
import { supabase } from '../supabase'

export default function MusicUpload({ onUploadSuccess, modoEscuro }) {
  const [tipoMidia, setTipoMidia] = useState('video') 
  const [arquivo, setArquivo] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('') // Guarda a URL temporária do vídeo
  const [loading, setLoading] = useState(false)

  const obterFiltroAceito = () => {
    if (tipoMidia === 'imagem') return 'image/*'
    if (tipoMidia === 'musica') return 'audio/mp3, audio/*'
    return 'video/mp4'
  }

  // Função disparada quando você escolhe o arquivo
  const handleFileChange = (e) => {
    const arquivoSelecionado = e.target.files[0]
    setArquivo(arquivoSelecionado)

    // Se o arquivo for um vídeo, cria um link temporário para execução imediata
    if (arquivoSelecionado && (tipoMidia === 'video' || arquivoSelecionado.type === 'video/mp4')) {
      const urlTemporaria = URL.createObjectURL(arquivoSelecionado)
      setPreviewUrl(urlTemporaria)
    } else {
      setPreviewUrl('') // Limpa se for imagem ou áudio
    }
  }

  async function handleUpload(e) {
    e.preventDefault()
    if (!arquivo) {
      alert('Por favor, selecione um arquivo.')
      return
    }

    setLoading(true)

    try {
      const limparNome = (nomeOriginal) => {
        return nomeOriginal
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9.]/g, "_")
          .replace(/__+/g, "_")
      }

      const nomeArquivoLimpo = `${Date.now()}_${limparNome(arquivo.name)}`
      
      let bucketDestino = ''
      let dadosParaSalvar = {}

      if (tipoMidia === 'imagem') {
        if (!arquivo.type.startsWith('image/')) {
          throw new Error('O arquivo selecionado não é uma imagem válida.')
        }
        bucketDestino = 'album-covers'
        dadosParaSalvar = {
          title: arquivo.name,
          cover_url: '', 
          duration_seconds: 0,
          track_number: 1
        }
      } else if (tipoMidia === 'musica') {
        if (!arquivo.type.startsWith('audio/') && !arquivo.name.endsWith('.mp3')) {
          throw new Error('O arquivo selecionado não é um áudio MP3 válido.')
        }
        bucketDestino = 'audio-files'
        dadosParaSalvar = {
          title: arquivo.name.replace('.mp3', ''),
          audio_url: '', 
          duration_seconds: 180,
          track_number: 1
        }
      } else if (tipoMidia === 'video') {
        if (arquivo.type !== 'video/mp4' && !arquivo.name.endsWith('.mp4')) {
          throw new Error('O arquivo selecionado não é um vídeo MP4 válido.')
        }
        bucketDestino = 'audio-files'
        dadosParaSalvar = {
          title: arquivo.name.replace('.mp4', ''),
          audio_url: '', 
          duration_seconds: 180,
          track_number: 1
        }
      }

      const { error: storageError } = await supabase.storage
        .from(bucketDestino)
        .upload(nomeArquivoLimpo, arquivo)

      if (storageError) throw storageError

      const { data: urlData } = supabase.storage.from(bucketDestino).getPublicUrl(nomeArquivoClean)

      if (bucketDestino === 'album-covers') {
        dadosParaSalvar.cover_url = urlData.publicUrl
      } else {
        dadosParaSalvar.audio_url = urlData.publicUrl
      }

      const { error: dbError } = await supabase.from('songs').insert([dadosParaSalvar])
      if (dbError) throw dbError

      alert('Mídia enviada com sucesso!')
      setArquivo(null)
      setPreviewUrl('') // Limpa o player após o envio concluído
      
      if (onUploadSuccess) onUploadSuccess()
      
    } catch (error) {
      console.error(error)
      alert(`Erro no upload: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '20px auto', 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      backgroundColor: modoEscuro ? '#1e1e1e' : '#f9f9f9',
      color: modoEscuro ? '#fff' : '#000'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Enviar Mídia</h3>
      
      <form onSubmit={handleUpload}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '6px' }}>O que você vai enviar agora?</label>
          <select 
            value={tipoMidia} 
            onChange={(e) => {
              setTipoMidia(e.target.value)
              setArquivo(null)
              setPreviewUrl('')
            }}
            style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
          >
            <option value="video">Vídeo (.MP4)</option>
            <option value="musica">Música (.MP3)</option>
            <option value="imagem">Foto da Capa</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Selecione o arquivo:
          </label>
          <input 
            key={tipoMidia} 
            type="file" 
            accept={obterFiltroAceito()} 
            onChange={handleFileChange} // Chama a função que gera o preview instantâneo
            required 
          />
        </div>

        {/* PLAYER INSTANTÂNEO: Só aparece quando você escolhe um vídeo MP4 */}
        {previewUrl && (
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <span style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#888' }}>
              Pré-visualização do arquivo selecionado:
            </span>
            <video 
              controls 
              src={previewUrl} 
              style={{ width: '100%', borderRadius: '4px', backgroundColor: '#000', maxHeight: '180px' }} 
            />
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading || !arquivo} 
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: '#00cbb8', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          {loading ? 'Processando envio...' : 'Salve qualquer arquivo que você quiser'}
        </button>
      </form>
    </div>
  )
}
