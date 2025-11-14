import { Link } from 'react-router-dom'

export function Header() {
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
        The 2025 Millennium Awards Nominations
      </div>
      
      <nav className="nav-links">
        <Link to="/about">About</Link>
        <Link to="/awards">Awards</Link>
        <Link to="/news">News</Link>
        <Link to="/fields">Fields</Link>
        <Link to="/stats">Stats</Link>
      </nav>
      
      <div>
        <input type="text" placeholder="🔍 Search" className="search-barbox" />
      </div>
    </header>
  );
}