// src/pages/StatsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StatsPage.css'; // Vamos atualizar este CSS

export function StatsPage() {
  const [topWinners, setTopWinners] = useState([]);
  const [topNominees, setTopNominees] = useState([]);
  const [topGeneralWinners, setTopGeneralWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  // NOVO ESTADO: para controlar o accordion
  // 'wins' será o accordion aberto por padrão
  const [openAccordion, setOpenAccordion] = useState('wins');

  // Função de processamento de nomes (sem alterações)
  const processNames = (namesString, countsObject) => {
    if (!namesString || namesString === '—') {
      return;
    }
    const namesArray = namesString.split(',').map(name => name.trim());
    namesArray.forEach(name => {
      if (name) { 
        countsObject[name] = (countsObject[name] || 0) + 1;
      }
    });
  };

  // useEffect (sem alterações)
  useEffect(() => {
    fetch('/db.json')
      .then((res) => res.json())
      .then((data) => {
        const winCounts = {};
        const nomCounts = {};
        const generalWinCounts = {}; 

        const winners = data.filter(item => item.result === 'Winner');
        const generalWinners = data.filter(item => 
            item.result === 'Winner' && item.field === 'General Field'
        );
        
        // 1. Calcular Todos os Vencedores
        winners.forEach(nom => {
          processNames(nom.main_artist, winCounts);
          processNames(nom.producer, winCounts);
          processNames(nom.songwriters, winCounts);
          processNames(nom.technical, winCounts);
          processNames(nom.director, winCounts);
        });

        // 2. Calcular Todos os Indicados
        data.forEach(nom => {
          processNames(nom.main_artist, nomCounts);
          processNames(nom.producer, nomCounts);
          processNames(nom.songwriters, nomCounts);
          processNames(nom.technical, nomCounts);
          processNames(nom.director, nomCounts);
        });
        
        // 3. Calcular Vencedores do General Field
        generalWinners.forEach(nom => {
          processNames(nom.main_artist, generalWinCounts);
          processNames(nom.producer, generalWinCounts);
          processNames(nom.songwriters, generalWinCounts);
          processNames(nom.technical, generalWinCounts);
          processNames(nom.director, generalWinCounts);
        });

        // --- Definir Estados ---
        const sortedWinners = Object.entries(winCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);
        setTopWinners(sortedWinners.slice(0, 10));
        
        const sortedNominees = Object.entries(nomCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);
        setTopNominees(sortedNominees.slice(0, 10));

        const sortedGeneralWinners = Object.entries(generalWinCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);
        setTopGeneralWinners(sortedGeneralWinners.slice(0, 10));

        setLoading(false);
      })
      .catch((err) => {
        console.error('Falha ao carregar dados de estatísticas:', err);
        setLoading(false);
      });
  }, []); 

  // NOVA FUNÇÃO: para controlar o accordion
  const handleAccordionClick = (key) => {
    if (openAccordion === key) {
      setOpenAccordion(null); // Fecha se clicar no que já está aberto
    } else {
      setOpenAccordion(key); // Abre o novo
    }
  };

  if (loading) {
    return <div>Loading stats...</div>;
  }

  // --- JSX (Return) TOTALMENTE MODIFICADO ---
  return (
    <div className="stats-page-container">
      <div className="awards-header">
        <h1>Millennium Statistics</h1>
        <p>All-time rankings for the most awarded and nominated individuals.</p>
      </div>

      {/* Seção Ranking de Vencedores (ACCORDION 1) */}
      <div className="ranking-section-accordion">
        <button 
          className={`accordion-toggle ${openAccordion === 'wins' ? 'active' : ''}`}
          onClick={() => handleAccordionClick('wins')}
        >
          <h2>Top 10 - Most Wins (All Fields)</h2>
          <span className="toggle-icon">{openAccordion === 'wins' ? '▾' : '▸'}</span>
        </button>
        {openAccordion === 'wins' && (
          <div className="accordion-content">
            <ol className="stats-ranking-list">
              {topWinners.map((winner, index) => (
                <li key={winner.name}>
                  <span className="rank-number">{index + 1}.</span>
                  <Link to={`/artist/${encodeURIComponent(winner.name)}`} className="artist-name-link">
                    {winner.name}
                  </Link>
                  <span className="win-count">{winner.count} Wins</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
      
      {/* Seção Ranking de Vencedores (GENERAL FIELD - ACCORDION 2) */}
      <div className="ranking-section-accordion">
        <button 
          className={`accordion-toggle ${openAccordion === 'general' ? 'active' : ''}`}
          onClick={() => handleAccordionClick('general')}
        >
          <h2>Top 10 - Most General Field Wins</h2>
          <span className="toggle-icon">{openAccordion === 'general' ? '▾' : '▸'}</span>
        </button>
        {openAccordion === 'general' && (
          <div className="accordion-content">
            <ol className="stats-ranking-list">
              {topGeneralWinners.map((winner, index) => (
                <li key={winner.name}>
                  <span className="rank-number">{index + 1}.</span>
                  <Link to={`/artist/${encodeURIComponent(winner.name)}`} className="artist-name-link">
                    {winner.name}
                  </Link>
                  <span className="win-count">{winner.count} Wins</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Seção Ranking de Indicados (ACCORDION 3) */}
      <div className="ranking-section-accordion">
        <button 
          className={`accordion-toggle ${openAccordion === 'noms' ? 'active' : ''}`}
          onClick={() => handleAccordionClick('noms')}
        >
          <h2>Top 10 - Most Nominations (All Fields)</h2>
          <span className="toggle-icon">{openAccordion === 'noms' ? '▾' : '▸'}</span>
        </button>
        {openAccordion === 'noms' && (
          <div className="accordion-content">
            <ol className="stats-ranking-list">
              {topNominees.map((nominee, index) => (
                <li key={nominee.name}>
                  <span className="rank-number">{index + 1}.</span>
                  <Link to={`/artist/${encodeURIComponent(nominee.name)}`} className="artist-name-link">
                    {nominee.name}
                  </Link>
                  <span className="win-count">{nominee.count} Nominations</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

    </div>
  );
}