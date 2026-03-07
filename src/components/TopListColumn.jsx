import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export function TopListColumn({ title }) {
  const [article, setArticle] = useState(null)

  useEffect(() => {
    fetch('/dbnews.json')
      .then(res => res.json())
      .then(data => {
        // Encontra o artigo cujo título contém parte da prop 'title'
        const found = data.news.find(n => title.toLowerCase().includes(n.title.toLowerCase().substring(0, 10)))
        if (found) setArticle(found)
      })
  }, [title])

  return (
    <section>
      <div style={{ marginTop: '182px' }}>
      <div className="image-placeholder-large">
        {article && article.image ? (
          <Link to={`/news/${article.id}`} style={{ width: '100%', height: '100%' }}>
            <img src={article.image} alt={title} className="fill-image" />
          </Link>
        ) : <div className="square-placeholder" style={{width: '100%', height: '100%'}}></div>}
      </div>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <span className="accent-text">HIGHLIGHTS</span>
        <div className="news-item">
          {article ? (
            <Link to={`/news/${article.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3 className="clickable-title">{title}</h3>
            </Link>
          ) : <h3>{title}</h3>}
        </div>
      </div>
    </section>
  )
}