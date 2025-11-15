// src/pages/StatsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StatsPage.css'; 

/**
 * Converte um campo de crédito (string ou objeto) em uma string única 
 * de nomes separados por vírgula.
 * Ex: { "Master Engineers": ["Matt Colton"] } => "Matt Colton"
 * Ex: "Produtor 1, Produtor 2" => "Produtor 1, Produtor 2"
 */
function flattenCreditsToString(creditData) {
  if (!creditData) {
    return null; // Retorna nulo se a entrada for nula
  }
  
  // Caso 1: Já é uma string (o formato antigo)
  if (typeof creditData === 'string') {
    return creditData;
  }

  // Caso 2: É um objeto (o novo formato)
  if (typeof creditData === 'object' && !Array.isArray(creditData)) {
    const allNames = [];
    // Pega todas as chaves (ex: "Master Engineers", "Sound Engineers")
    const roles = Object.keys(creditData); 
    
    for (const role of roles) {
      const names = creditData[role];
      
      // Se a chave tiver um array de nomes (ex: ["Matt Colton"])
      if (Array.isArray(names)) {
        allNames.push(...names);
      }
      // Se a chave tiver uma string de nomes (ex: "Name1, Name2")
      else if (typeof names === 'string') {
        allNames.push(...names.split(',').map(n => n.trim()));
      }
    }
    
    // Filtra nomes vazios/nulos e junta em uma string
    const validNames = allNames.filter(name => name && name.trim());
    if (validNames.length === 0) return null;
    return validNames.join(', ');
  }
  
  // Retorno padrão se não for um tipo esperado
  return null; 
}

export function StatsPage() {
  const [topWinners, setTopWinners] = useState([]);
  const [topNominees, setTopNominees] = useState([]);
  const [topGeneralWinners, setTopGeneralWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAccordion, setOpenAccordion] = useState('wins');

  // --- LÓGICA DE CONTAGEM MODIFICADA ---
  // Esta função agora conta créditos (não usa Set)
  const processNames = (namesString, countsObject) => {
    const flatNamesString = flattenCreditsToString(namesString);

    if (!flatNamesString || flatNamesString === '—') {
      return;
    }
    const namesArray = flatNamesString.split(',').map(name => name.trim());
    namesArray.forEach(name => {
      if (name) { 
        countsObject[name] = (countsObject[name] || 0) + 1;
      }
    });
  };

  // --- useEffect com a lógica corrigida ---
  useEffect(() => {
    fetch('/db.json')
      .then((res) => res.json())
      .then((data) => {
        const winCounts = {};
        const nomCounts = {};
        const generalWinCounts = {}; 
        
        // --- 1. Cálculo de Indicações (NOMINEES) Corrigido ---
        data.forEach(item => {
          // Créditos do nível superior
          processNames(item.main_artist, nomCounts);
          processNames(item.producer, nomCounts);
          processNames(item.songwriters, nomCounts);
          processNames(item.technical, nomCounts);
          processNames(item.director, nomCounts);
          
          // Créditos aninhados (sub-prêmios)
          if (item.defining_awards && Array.isArray(item.defining_awards)) {
            for (const subAward of item.defining_awards) {
              processNames(subAward.producer, nomCounts);
              processNames(subAward.songwriters, nomCounts);
              processNames(subAward.director, nomCounts);
            }
          }
        });

        // --- 2. Cálculo de Vencedores (WINS) Corrigido ---
        const winners = data.filter(item => item.result === 'Winner');
        winners.forEach(item => {
          // Nível superior
          processNames(item.main_artist, winCounts);
          processNames(item.producer, winCounts);
          processNames(item.songwriters, winCounts);
          processNames(item.technical, winCounts);
          processNames(item.director, winCounts);
          
          // Nível aninhado (sub-prêmios)
          if (item.defining_awards && Array.isArray(item.defining_awards)) {
            for (const subAward of item.defining_awards) {
              processNames(subAward.producer, winCounts);
              processNames(subAward.songwriters, winCounts);
              processNames(subAward.director, winCounts);
            }
          }
        });

        // --- 3. Cálculo de Vencedores (GENERAL) Corrigido ---
        const generalWinners = data.filter(item => 
            item.result === 'Winner' && item.field === 'General Field'
        );
        
        generalWinners.forEach(item => {
          // Nível superior
          processNames(item.main_artist, generalWinCounts);
          processNames(item.producer, generalWinCounts);
          processNames(item.songwriters, generalWinCounts);
          processNames(item.technical, generalWinCounts);
          processNames(item.director, generalWinCounts);
          
          // Nível aninhado
          if (item.defining_awards && Array.isArray(item.defining_awards)) {
            for (const subAward of item.defining_awards) {
              processNames(subAward.producer, generalWinCounts);
              processNames(subAward.songwriters, generalWinCounts);
              processNames(subAward.director, generalWinCounts);
            }
          }
        });

        // --- Definir Estados (O resto do código é o mesmo) ---
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

  // Função do accordion (sem alterações)
  const handleAccordionClick = (key) => {
    if (openAccordion === key) {
      setOpenAccordion(null);
    } else {
      setOpenAccordion(key);
    }
  };

  if (loading) {
    return <div>Loading stats...</div>;
  }

  // JSX (return) - Nenhuma alteração
  return (
    <div className="stats-page-container">
      <div className="awards-header">
        <h1>Millennium Statistics</h1>
        <p>All-time rankings for the most awarded and nominated individuals.</p>
      </div>

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