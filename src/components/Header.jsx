export function Header() {
  return (
    <header>
      <div className="brand">
        <img 
          src="/mlna logo.PNG" 
          alt="Millennium Awards Logo" 
          style={{ maxHeight: '45px', objectFit: 'contain' }} 
        />
      </div>
      
      <div style={{ fontWeight: 'bold' }}>
        The 2025 Millennium Awards Nominations
      </div>
      
      <nav className="nav-links">
        <a href="#">About</a>
        <a href="#">Awards</a>
        <a href="#">News</a>
        <a href="#">Genre Fields</a>
      </nav>
      
      <div>
        <input type="text" placeholder="🔍 Search" className="search-barbox" />
      </div>
    </header>
  );
}