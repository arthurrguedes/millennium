import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export function HeroColumn() {
  const [latestNews, setLatestNews] = useState(null)

  useEffect(() => {
    // Busca o arquivo JSON local na pasta public
    fetch('/dbnews.json')
      .then(res => res.json())
      .then(data => {
        if (data.news && data.news.length > 0) {
          // Define o último item do array como a notícia em destaque
          setLatestNews(data.news[data.news.length - 1])
        }
      })
      .catch(err => console.error("Erro ao carregar notícias:", err))
  }, [])

  return (
    <section>
      <div className="column-header">
      <span className="accent-text">FINALLY HERE!</span>
      <h1>All winners from The 29th Millennium Awards</h1>
      
      {/* Botão para a lista completa de prêmios */}
      <Link to="/awards/2025" className="see-full-list">SEE FULL LIST</Link>
      </div>

      {/* Espaço da Imagem: Agora dinâmico e clicável */}
      <div className="image-placeholder-large" style={{ overflow: 'hidden' }}>
        {latestNews ? (
          <Link to={`/news/${latestNews.id}`}>
            {latestNews.image ? (
              <img 
                src={latestNews.image} 
                alt={latestNews.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
              />
            ) : (
              <div style={{ padding: '20px' }}>No image available</div>
            )}
          </Link>
        ) : (
          "placeholder principal"
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <span className="accent-text">NEWS</span>
        <div className="news-item">
          {latestNews ? (
            <>
              {/* Título clicável que redireciona para a página do artigo */}
              <Link 
                to={`/news/${latestNews.id}`} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <h3 className="clickable-title">
                  {latestNews.title}
                </h3>
              </Link>
            </>
          ) : (
            <h3>Carregando destaques...</h3>
          )}
        </div>
      </div>
    </section>
  )
}