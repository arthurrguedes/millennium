import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

export function NewsArticlePage() {
  const { id } = useParams() // Pega o ID da URL
  const [article, setArticle] = useState(null)

  useEffect(() => {
    fetch('/dbnews.json')
      .then(res => res.json())
      .then(data => {
        const found = data.news.find(item => item.id === parseInt(id));
        setArticle(found);
      });
  }, [id]);

  if (!article) return <div>Loading...</div>;

  return (
    <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <span className="accent-text">{article.date}</span>
      <h1>{article.title}</h1>
      
      {/* Exibição da Imagem Ilustrativa */}
      {article.image && (
        <div style={{ margin: '20px 0' }}>
          <img 
            src={article.image} 
            alt={article.title} 
            style={{ width: '100%', borderRadius: '8px', display: 'block' }} 
          />
        </div>
      )}

      <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
        {article.content}
      </p>
    </main>
  );
}