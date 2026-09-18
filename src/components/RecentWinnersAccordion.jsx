import { useState, useEffect } from 'react';
import './RecentWinnersAccordion.css'; // Vamos criar os estilos a seguir

export function RecentWinnersAccordion() {
  const [winnersByField, setWinnersByField] = useState({});
  const [latestYear, setLatestYear] = useState(null);

  useEffect(() => {
    // Como o db.json está na pasta public, o fetch chama-o a partir da raiz da app
    fetch('/db.json')
      .then(res => res.json())
      .then(data => {
        // 1. Encontrar o ano mais recente disponível na base de dados
        const maxYear = Math.max(...data.map(item => item.year));
        setLatestYear(maxYear);

        // 2. Filtrar os dados pelo ano mais recente e pelo resultado "Winner"
        const recentWinners = data.filter(
          item => item.year === maxYear && item.result === "Winner"
        );

        // 3. Agrupar os vencedores por "field"
        const grouped = recentWinners.reduce((acc, curr) => {
          if (!acc[curr.field]) {
            acc[curr.field] = [];
          }
          acc[curr.field].push(curr);
          return acc;
        }, {});

        setWinnersByField(grouped);
      })
      .catch(err => console.error("Erro ao carregar db.json:", err));
  }, []);

  if (!latestYear) return null; // Não renderiza nada enquanto carrega

  return (
    <section className="recent-winners-section">
      <h2 className="recent-winners-title">
        Current Holders
      </h2>
      
      <div className="accordion-container">
        {Object.keys(winnersByField).map(field => (
          <details key={field} className="field-accordion">
            <summary className="accordion-summary">{field}</summary>
            <div className="accordion-body">
              <ul className="winners-list">
                {winnersByField[field].map(winner => (
                  <li key={winner.id}>
                    <strong>{winner.category}</strong>
                    <span>
                      {winner.main_artist} {winner.nomination ? `- ${winner.nomination}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}