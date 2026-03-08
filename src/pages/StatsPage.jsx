// src/pages/StatsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StatsPage.css'; 

function flattenCreditsToString(creditData) {
  if (!creditData) return null;
  if (typeof creditData === 'string') return creditData;

  if (typeof creditData === 'object' && !Array.isArray(creditData)) {
    const allNames = [];
    const roles = Object.keys(creditData); 
    for (const role of roles) {
      const names = creditData[role];
      if (Array.isArray(names)) {
        allNames.push(...names);
      } else if (typeof names === 'string') {
        allNames.push(...names.split(',').map(n => n.trim()));
      }
    }
    const validNames = allNames.filter(name => name && name.trim());
    if (validNames.length === 0) return null;
    return validNames.join(', ');
  }
  return null; 
}

export function StatsPage() {
  const [topWinners, setTopWinners] = useState([]);
  const [topNominees, setTopNominees] = useState([]);
  const [topGeneralWinners, setTopGeneralWinners] = useState([]);
  const [topGeneralNominees, setTopGeneralNominees] = useState([]); // Novo estado
  const [loading, setLoading] = useState(true);
  const [openAccordion, setOpenAccordion] = useState('wins');

  const processNames = (namesString, countsObject) => {
    const flatNamesString = flattenCreditsToString(namesString);
    if (!flatNamesString || flatNamesString === '—') return;
    const namesArray = flatNamesString.split(',').map(name => name.trim());
    namesArray.forEach(name => {
      if (name) { 
        countsObject[name] = (countsObject[name] || 0) + 1;
      }
    });
  };

  useEffect(() => {
    fetch('/db.json')
      .then((res) => res.json())
      .then((data) => {
        const winCounts = {};
        const nomCounts = {};
        const generalWinCounts = {}; 
        const generalNomCounts = {}; // Novo contador
        
        data.forEach(item => {
          // Indicações Gerais (All Fields)
          processNames(item.main_artist, nomCounts);
          processNames(item.producer, nomCounts);
          processNames(item.songwriters, nomCounts);
          processNames(item.technical, nomCounts);
          processNames(item.director, nomCounts);

          // Filtro para General Field (Indicações)
          if (item.field === 'General Field') {
            processNames(item.main_artist, generalNomCounts);
            processNames(item.producer, generalNomCounts);
            processNames(item.songwriters, generalNomCounts);
            processNames(item.technical, generalNomCounts);
            processNames(item.director, generalNomCounts);
          }
          
          if (item.defining_awards && Array.isArray(item.defining_awards)) {
            for (const subAward of item.defining_awards) {
              processNames(subAward.producer, nomCounts);
              processNames(subAward.songwriters, nomCounts);
              processNames(subAward.director, nomCounts);
              
              if (item.field === 'General Field') {
                processNames(subAward.producer, generalNomCounts);
                processNames(subAward.songwriters, generalNomCounts);
                processNames(subAward.director, generalNomCounts);
              }
            }
          }
        });

        // Cálculo de Vencedores
        const winners = data.filter(item => item.result === 'Winner');
        winners.forEach(item => {
          processNames(item.main_artist, winCounts);
          processNames(item.producer, winCounts);
          processNames(item.songwriters, winCounts);
          processNames(item.technical, winCounts);
          processNames(item.director, winCounts);
          
          if (item.field === 'General Field') {
            processNames(item.main_artist, generalWinCounts);
            processNames(item.producer, generalWinCounts);
            processNames(item.songwriters, generalWinCounts);
            processNames(item.technical, generalWinCounts);
            processNames(item.director, generalWinCounts);
          }

          if (item.defining_awards && Array.isArray(item.defining_awards)) {
            for (const subAward of item.defining_awards) {
              processNames(subAward.producer, winCounts);
              processNames(subAward.songwriters, winCounts);
              processNames(subAward.director, winCounts);
              
              if (item.field === 'General Field') {
                processNames(subAward.producer, generalWinCounts);
                processNames(subAward.songwriters, generalWinCounts);
                processNames(subAward.director, generalWinCounts);
              }
            }
          }
        });

        // Ordenação e Estados
        const sortLimit = (counts) => Object.entries(counts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        setTopWinners(sortLimit(winCounts));
        setTopNominees(sortLimit(nomCounts));
        setTopGeneralWinners(sortLimit(generalWinCounts));
        setTopGeneralNominees(sortLimit(generalNomCounts)); // Define o novo estado

        setLoading(false);
      })
      .catch((err) => {
        console.error('Falha ao carregar dados:', err);
        setLoading(false);
      });
  }, []); 

  const handleAccordionClick = (key) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  if (loading) return <div>Loading stats...</div>;

  return (
    <div className="stats-page-container">
      <div className="awards-header">
        <h1>Millennium Statistics</h1>
        <p>All-time rankings for the most awarded and nominated individuals.</p>
      </div>

      {/* Wins Accordion */}
      <div className="ranking-section-accordion">
        <button className={`accordion-toggle ${openAccordion === 'wins' ? 'active' : ''}`} onClick={() => handleAccordionClick('wins')}>
          <h2>Top 10 - Most Wins (All Fields)</h2>
          <span className="toggle-icon">{openAccordion === 'wins' ? '▾' : '▸'}</span>
        </button>
        {openAccordion === 'wins' && (
          <div className="accordion-content">
            <ol className="stats-ranking-list">
              {topWinners.map((w, i) => (
                <li key={w.name}><span className="rank-number">{i + 1}.</span> <Link to={`/artist/${encodeURIComponent(w.name)}`} className="artist-name-link">{w.name}</Link> <span className="win-count">{w.count} Wins</span></li>
              ))}
            </ol>
          </div>
        )}
      </div>

            {/* Nominations Accordion */}
      <div className="ranking-section-accordion">
        <button className={`accordion-toggle ${openAccordion === 'noms' ? 'active' : ''}`} onClick={() => handleAccordionClick('noms')}>
          <h2>Top 10 - Most Nominations (All Fields)</h2>
          <span className="toggle-icon">{openAccordion === 'noms' ? '▾' : '▸'}</span>
        </button>
        {openAccordion === 'noms' && (
          <div className="accordion-content">
            <ol className="stats-ranking-list">
              {topNominees.map((n, i) => (
                <li key={n.name}><span className="rank-number">{i + 1}.</span> <Link to={`/artist/${encodeURIComponent(n.name)}`} className="artist-name-link">{n.name}</Link> <span className="win-count">{n.count} Nominations</span></li>
              ))}
            </ol>
          </div>
        )}
      </div>
      
      {/* General Wins Accordion */}
      <div className="ranking-section-accordion">
        <button className={`accordion-toggle ${openAccordion === 'general' ? 'active' : ''}`} onClick={() => handleAccordionClick('general')}>
          <h2>Top 10 - Most General Field Wins</h2>
          <span className="toggle-icon">{openAccordion === 'general' ? '▾' : '▸'}</span>
        </button>
        {openAccordion === 'general' && (
          <div className="accordion-content">
            <ol className="stats-ranking-list">
              {topGeneralWinners.map((w, i) => (
                <li key={w.name}><span className="rank-number">{i + 1}.</span> <Link to={`/artist/${encodeURIComponent(w.name)}`} className="artist-name-link">{w.name}</Link> <span className="win-count">{w.count} Wins</span></li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* NOVO: General Nominations Accordion */}
      <div className="ranking-section-accordion">
        <button className={`accordion-toggle ${openAccordion === 'general_noms' ? 'active' : ''}`} onClick={() => handleAccordionClick('general_noms')}>
          <h2>Top 10 - Most General Field Nominations</h2>
          <span className="toggle-icon">{openAccordion === 'general_noms' ? '▾' : '▸'}</span>
        </button>
        {openAccordion === 'general_noms' && (
          <div className="accordion-content">
            <ol className="stats-ranking-list">
              {topGeneralNominees.map((n, i) => (
                <li key={n.name}><span className="rank-number">{i + 1}.</span> <Link to={`/artist/${encodeURIComponent(n.name)}`} className="artist-name-link">{n.name}</Link> <span className="win-count">{n.count} Nominations</span></li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}