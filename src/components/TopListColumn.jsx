export function TopListColumn({ title }) {
  return (
    <section>
      {/* Grid de 6 imagens simulado */}
      <div className="image-grid-placeholder">
        <div className="square-placeholder"></div>
        <div className="square-placeholder"></div>
        <div className="square-placeholder"></div>
        <div className="square-placeholder"></div>
        <div className="square-placeholder"></div>
        <div className="square-placeholder"></div>
      </div>
      
      <span className="accent-text">TOP LIST</span>
      
      <div className="news-item">
        <h3>{title}</h3>
      </div>
    </section>
  );
}