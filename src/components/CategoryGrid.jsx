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
        
        <CategoryItem category="ALBUM OF THE YEAR" nomination="Caju" imageUrl="https://lastfm.freetls.fastly.net/i/u/500x500/e7edaed4fde151af42e93ae955ea6714.jpg" />
        <CategoryItem category="RECORD OF THE YEAR" nomination="Die With A Smile" imageUrl="https://lastfm.freetls.fastly.net/i/u/500x500/23425459b73eac17b203119b55814c89.jpg" />
        <CategoryItem category="ARTIST OF THE YEAR" nomination="Sabrina Carpenter" imageUrl="https://lastfm.freetls.fastly.net/i/u/770x0/82bedb211ed869eec10f0c299f6d95d0.jpg#82bedb211ed869eec10f0c299f6d95d0"/>
        <CategoryItem category="SONG OF THE YEAR" nomination="Outubro" imageUrl="https://lastfm.freetls.fastly.net/i/u/500x500/07056e93203875f3687ff6b1ddb19ab5.jpg" />
        <CategoryItem category="BEST NEW ARTIST" nomination="Chappell Roan" imageUrl="https://lastfm.freetls.fastly.net/i/u/770x0/5ca04932800394c7f92c526a255bd7bd.jpg#5ca04932800394c7f92c526a255bd7bd" />
        <CategoryItem category="BEST COLLABORATION" nomination="Die With A Smile" imageUrl="https://lastfm.freetls.fastly.net/i/u/500x500/23425459b73eac17b203119b55814c89.jpg" />
      </div>
    </section>
  );
}