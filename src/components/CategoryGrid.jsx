// O componente filho (CategoryItem) é modificado
// Ele troca o texto fixo para receber as props 'artist' e 'nomination'
function CategoryItem({ category, nomination, imageUrl }) {
  return (
    <div className="category-item">
      <img 
        src={imageUrl} 
        alt={nomination}
        className="grid-image"
      />
      <div className="category-item-text">
        <strong>{category}</strong>
        <span>{nomination}</span>
      </div>
    </div>
  );
}

// Componente principal da seção
export function CategoryGrid() {
  return (
    <section className="category-grid-section">
      <span className="accent-text">GENERAL FIELD</span>
      <span className="sub-text">CURRENT WINNERS</span>
      <div className="category-grid">
        
        <CategoryItem category="ALBUM OF THE YEAR" nomination="DeBÍ TiRAR MáS FOToS" imageUrl="https://lastfm.freetls.fastly.net/i/u/500x500/7d0982b56a5e4304eb6207d6688c917a.jpg" />
        <CategoryItem category="RECORD OF THE YEAR" nomination="DtMF" imageUrl="https://lastfm.freetls.fastly.net/i/u/500x500/7d0982b56a5e4304eb6207d6688c917a.jpg" />
        <CategoryItem category="ARTIST OF THE YEAR" nomination="Bad Bunny" imageUrl="https://lastfm.freetls.fastly.net/i/u/770x0/0a1a16c77a375597438b2017b94e5988.jpg#0a1a16c77a375597438b2017b94e5988"/>
        <CategoryItem category="SONG OF THE YEAR" nomination="DtMF" imageUrl="https://lastfm.freetls.fastly.net/i/u/500x500/7d0982b56a5e4304eb6207d6688c917a.jpg" />
        <CategoryItem category="BEST NEW ARTIST" nomination="Leon Thomas" imageUrl="https://lastfm.freetls.fastly.net/i/u/770x0/24c822919c2d74ae5b9a02789af2ec3d.jpg#24c822919c2d74ae5b9a02789af2ec3d" />
        <CategoryItem category="BEST COLLABORATION" nomination="Luther" imageUrl="https://lastfm.freetls.fastly.net/i/u/500x500/a79564a9768d05272682b252deb02079.jpg" />
      </div>
    </section>
  );
}