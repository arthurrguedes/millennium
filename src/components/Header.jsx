import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export function Header() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Busca todas as categorias do db.json
    fetch('/db.json')
      .then(res => res.json())
      .then(data => {
        const allCategoryNames = data.map(item => item.category);
        const uniqueCategories = [...new Set(allCategoryNames)]
          .filter(Boolean)
          .sort(); 
          
        setCategories(uniqueCategories);
      })
      .catch(err => console.error("Falha ao buscar categorias para o header:", err));
  }, []); 

  return (
    <header>
      <Link to="/" className="brand">
        <img 
          src="/mlna logo.PNG" 
          alt="Millennium Awards Logo" 
          style={{ maxHeight: '45px', objectFit: 'contain' }} 
        />
      </Link>
      
      <div style={{ fontWeight: 'bold' }}>
        <nav>
        <Link to="http://localhost:5173/awards/2025" className="nav-link-2025">
        The 2025 Millennium Awards Winners
        </Link>
        </nav>
      </div>
      
      <nav className="nav-links">
        <Link to="/about">About</Link>
        <Link to="/awards">Awards</Link>
        <Link to="/news">News</Link>
        <Link to="/fields">Fields</Link>
        
        {/* --- DROPDOWN DE CATEGORIAS --- */}
        <div className="nav-item dropdown">
          <span className="dropdown-toggle">Categories</span>
          
          <div className="dropdown-menu">
            {categories.length > 0 ? (
              categories.map(category => (
                <Link 
                  key={category} 
                  to={`/category/${encodeURIComponent(category)}`}
                >
                  {category}
                </Link>
              ))
            ) : (
              <span className="dropdown-loading">Loading...</span>
            )}
          </div>
        </div>

        <Link to="/stats">Stats</Link>
      </nav>
      
      <div>
        <input type="text" placeholder="🔍 Search" className="search-barbox" />
      </div>
    </header>
  );
}