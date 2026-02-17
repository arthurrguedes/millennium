import { Link } from 'react-router-dom';

// Componente de um item individual da lista
function HorizontalItem({title, subtitle, imageUrl, href}) {

const Container = href ? Link : 'div';
  
  // Se for link, precisa da prop 'to'. Se for div, não precisa
  const props = href ? { to: href } : {};

  return (
    <Container 
      {...props} 
      className="horizontal-item"
      // Adicionando estilos para remover o sublinhado padrão de links e arrumar o cursor
      style={{ 
        textDecoration: 'none', 
        color: 'inherit', 
        cursor: href ? 'pointer' : 'default',
        display: 'flex', // Garante que a estrutura se mantenha
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <img 
        src={imageUrl ? (imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`) : "/millennium_default.png"} 
        alt={title} 
        className="circle-image"
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
  const startYear = 1998;
  const yearsList = [];

  for (let year = currentYear; year >= startYear; year--) {
    // Calcula a edição | 2025 - 1998 + 1 
    const edition = year - startYear + 1;
    
    // Função para colocar o sufixo
    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    yearsList.push({
      year: year,
      title: `${getOrdinal(edition)} Annual Millennium`,
      href: `/awards/${year}`
    });
  }

  return (
    <section className="horizontal-list-section">
      <span className="accent-text">MILLENNIUM - Time Capsule</span>
      <div className="horizontal-list-container">
        
        {/* Renderiza a lista com um map (loop) */}
        {yearsList.map((item) => (
          <HorizontalItem 
            key={item.year} 
            href={item.href}
            title={item.title} 
            subtitle={item.year.toString()} 
            imageUrl="/millennium_default.png"
          />
        ))}

      </div>
    </section>
  );
}