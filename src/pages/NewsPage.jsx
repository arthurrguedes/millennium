import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom' // 1. Importar o Link

export function NewsPage() {
  const [allNews, setAllNews] = useState([])

  useEffect(() => {
    // Busca o arquivo JSON na pasta public
    fetch('/dbnews.json')
      .then(res => res.json())
      .then(data => {
        // Inverte a ordem para mostrar as mais recentes primeiro
        if (data.news) {
          setAllNews([...data.news].reverse())
        }
      })
      .catch(err => console.error("Erro ao carregar notícias:", err))
  }, [])

  return (
    <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <span className="accent-text">NEWSFEED</span>
      <h1>Millennium News</h1>
      
      <div style={{ marginTop: '40px' }}>
        {allNews.map(item => (
          <article key={item.id} style={{ marginBottom: '50px', borderBottom: '1px solid #222', paddingBottom: '20px' }}>
            <span className="accent-text" style={{ fontSize: '0.8rem' }}>{item.date}</span>
            
            {/* 2. Título agora é um Link que aponta para o ID da notícia */}
            <Link 
              to={`/news/${item.id}`} 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <h2 className="clickable-title" style={{ margin: '10px 0' }}>
                {item.title}
              </h2>
            </Link>
            
            <p style={{ lineHeight: '1.6', color: '#ccc' }}>
              {/* Exibe apenas um resumo se o texto for muito longo */}
              {item.content.substring(0, 150)}...
            </p>
            
            <Link to={`/news/${item.id}`} className="accent-text" style={{ fontSize: '0.9rem', textDecoration: 'none' }}>
              FULL ARTICLE READ →
            </Link>
          </article>
        ))}
      </div>
    </main>
  )
}