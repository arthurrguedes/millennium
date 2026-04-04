import { Link } from 'react-router-dom';

// Componente de um item individual da lista
function HorizontalItem({title, subtitle, imageUrl, href}) {
  const Container = href ? Link : 'div';
  const props = href ? { to: href } : {};

  return (
    <Container 
      {...props} 
      className="horizontal-item"
      style={{ 
        textDecoration: 'none', 
        color: 'inherit', 
        cursor: href ? 'pointer' : 'default',
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <img 
        src={imageUrl} 
        alt={title} 
        className="circle-image"
        // Garante que se a imagem falhar, use o padrão
        onError={(e) => { e.target.src = "/millennium_default.png"; }}
      />
      <div className="horizontal-item-text">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
    </Container>
  );
}

// Componente principal da seção
export function HorizontalList() {
  const currentYear = 2025;
  const startYear = 1997;
  const yearsList = [];

  for (let year = currentYear; year >= startYear; year--) {
    const edition = year - startYear + 1;
    
    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    yearsList.push({
      year: year,
      title: `${getOrdinal(edition)} Annual Millennium`,
      href: `/awards/${year}`,
      // Define o caminho da imagem baseado no ano (ex: /img-years/1997.png)
      imageUrl: `/img-years/${year}.png` 
    });
  }

  return (
    <section className="horizontal-list-section">
      <span className="accent-text">Time Capsule</span>
      <div className="horizontal-list-container">
        {yearsList.map((item) => (
          <HorizontalItem 
            key={item.year} 
            href={item.href}
            title={item.title} 
            subtitle={item.year.toString()} 
            imageUrl={item.imageUrl}
          />
        ))}
      </div>
    </section>
  );
}