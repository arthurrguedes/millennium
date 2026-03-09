import { useState, useEffect, useRef } from 'react' // Adicionado useRef
import { Link, useNavigate } from 'react-router-dom'

export function Header() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [allNames, setAllNames] = useState([]); 
  const [filteredNames, setFilteredNames] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null); // Para fechar a busca ao clicar fora

  useEffect(() => {
    fetch('/db.json')
      .then(res => res.json())
      .then(data => {
        // --- LOGICA DE CATEGORIAS (Original) ---
        const allCategoryNames = data.map(item => item.category);
        const uniqueCategories = [...new Set(allCategoryNames)].filter(Boolean).sort(); 
        setCategories(uniqueCategories);

        // --- LOGICA DE BUSCA (Ajustada para o seu db.json plano) ---
        const namesSet = new Set();
        
        data.forEach(item => {
          const addNames = (val) => {
            if (typeof val === 'string') {
              val.split(',').forEach(n => {
                const trimmed = n.trim();
                if (trimmed) namesSet.add(trimmed);
              });
            }
          };

          // Extrai de campos de texto
          addNames(item.main_artist);
          addNames(item.producer);
          addNames(item.songwriters);
          addNames(item.director);

          // Extrai do campo technical (que pode ser objeto ou string)
          if (item.technical) {
            if (typeof item.technical === 'object') {
              Object.values(item.technical).forEach(val => {
                if (Array.isArray(val)) {
                  val.forEach(n => addNames(n));
                } else {
                  addNames(val);
                }
              });
            } else {
              addNames(item.technical);
            }
          }

          // Extrai de prêmios especiais (Diamond Icon, etc)
          if (item.defining_awards) {
            item.defining_awards.forEach(def => {
              addNames(def.main_artist);
              addNames(def.producer);
              addNames(def.songwriters);
              addNames(def.director);
            });
          }
        });

        setAllNames(Array.from(namesSet).sort());
      })
      .catch(err => console.error("Erro no Header:", err));

    // Fecha as sugestões se clicar fora da barra de busca
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setFilteredNames([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); 

  // Filtro de sugestões enquanto digita
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (term.length < 2) { // Só mostra sugestão após 2 letras
      setFilteredNames([]);
      return;
    }
    const matches = allNames.filter(name => name.toLowerCase().includes(term));
    setFilteredNames(matches.slice(0, 10)); // Limita a 10 resultados
  }, [searchTerm, allNames]);

  const handleSelectArtist = (name) => {
    setSearchTerm('');
    setFilteredNames([]);
    navigate(`/artist/${encodeURIComponent(name)}`);
  };

  return (
    <header>
      <Link to="/" className="brand">
        <img src="/mlna logo.PNG" alt="Logo" style={{ maxHeight: '45px', objectFit: 'contain' }} />
      </Link>
      
      <div style={{ fontWeight: 'bold' }}>
        <nav>
          <Link to="/awards/2025" className="nav-link-2025">The 29th Millennium Award Winners</Link>
        </nav>
      </div>
      
      <nav className="nav-links">
        <Link to="/about">About</Link>
        <Link to="/awards">Awards</Link>
        <Link to="/news">News</Link>
        <Link to="/fields">Fields</Link>
        
        <div className="nav-item dropdown">
          <span className="dropdown-toggle">Categories</span>
          <div className="dropdown-menu">
            {categories.map(category => (
              <Link key={category} to={`/category/${encodeURIComponent(category)}`}>{category}</Link>
            ))}
          </div>
        </div>
        <Link to="/stats">Stats</Link>
        <Link to="/submit">Submit</Link>
      </nav>
      
      {/* SEÇÃO DE BUSCA - Mantendo sua estrutura original com container relativo */}
      <div ref={searchRef} className="search-container" style={{ position: 'relative' }}>
        <input 
          type="text" 
          placeholder="Search for artist" 
          className="search-barbox" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && filteredNames.length > 0) {
              handleSelectArtist(filteredNames[0]);
            }
          }}
        />
        
        {/* Menu de Sugestões que flutua sobre o site */}
        {filteredNames.length > 0 && (
          <ul className="search-suggestions" style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            backgroundColor: '#fff', border: '1px solid #ddd',
            listStyle: 'none', padding: 0, margin: 0, zIndex: 9999,
            maxHeight: '300px', overflowY: 'auto', boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
          }}>
            {filteredNames.map((name, index) => (
              <li 
                key={index}
                onClick={() => handleSelectArtist(name)}
                style={{ padding: '12px 15px', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#000', fontSize: '0.9rem' }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f8f8f8'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#fff'}
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}