// src/pages/ArtistPage.jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import './ArtistPage.css'

// 1. DEFINIR AS CATEGORIAS PRINCIPAIS (BIG 6)
const MAIN_CATEGORIES = [
  'Album of the Year',
  'Record of the Year',
  'Artist of the Year',
  'Song of the Year',
  'Best New Artist',
  'Best Collaboration'
];

export function ArtistPage() {
  const [allNominations, setAllNominations] = useState([])
  const [loading, setLoading] = useState(true)
  const { name } = useParams()
  const artistName = decodeURIComponent(name)
  const [openYears, setOpenYears] = useState([])

  useEffect(() => {
    fetch('/db.json')
      .then((res) => res.json())
      .then((data) => {
        const nominations = data.filter(item => {
          const main = item.main_artist || '';
          const prod = item.producer || '';
          const song = item.songwriters || '';
          const dir = item.director || '';
          const tech = item.technical || '';
          
          return main.includes(artistName) ||
                 prod.includes(artistName) ||
                 song.includes(artistName) ||
                 dir.includes(artistName) ||
                 tech.includes(artistName);
        });
        
        setAllNominations(nominations)

        const yearsFromNoms = [...new Set(nominations.map(n => n.year.toString()))];
        setOpenYears(yearsFromNoms); 
        
        setLoading(false)
      })
  }, [artistName])

  // --- Cálculos ---
  const totalNominations = allNominations.length
  const totalWins = allNominations.filter(n => n.result === 'Winner').length
  
  // 2. ADICIONAR O NOVO CÁLCULO
  const mainCategoryWins = allNominations.filter(n => 
    n.result === 'Winner' && MAIN_CATEGORIES.includes(n.category)
  ).length;

  // (Agrupamento por ano permanece o mesmo)
  const nominationsByYear = allNominations
    .sort((a, b) => b.year - a.year)
    .reduce((acc, nom) => {
      const year = nom.year
      if (!acc[year]) {
        acc[year] = []
      }
      acc[year].push(nom)
      return acc
    }, {})
    
  // (Função toggleYear permanece a mesma)
  const toggleYear = (year) => {
    const yearStr = year.toString();
    if (openYears.includes(yearStr)) {
      setOpenYears(openYears.filter(y => y !== yearStr));
    } else {
      setOpenYears([...openYears, yearStr]);
    }
  };

  if (loading) {
    return <div>Loading artist details...</div>
  }

  return (
    <div className="artist-page-container">
      <h1>{artistName}</h1>

      {/* Seção de Estatísticas (MODIFICADA) */}
      <div className="artist-stats">
        <div className="stat-box">
          <span>{totalNominations}</span>
          <label>Total Nominations</label>
        </div>
        <div className="stat-box">
          <span>{totalWins}</span>
          <label>Total Wins</label>
        </div>
        
        {/* 3. ADICIONAR O NOVO CONTADOR */}
        <div className="stat-box">
          <span>{mainCategoryWins}</span>
          <label>General Field Wins</label>
        </div>
      </div>

      {/* Seção da Lista de Indicações (Permanece a mesma) */}
      <div className="artist-nomination-list">
        <h2>All Nominations</h2>
        
        {Object.entries(nominationsByYear).map(([year, nominations]) => (
          <div key={year} className="year-group">
            <button className="year-toggle" onClick={() => toggleYear(year)}>
              <h3>{year}</h3>
              <span className="toggle-icon">
                {openYears.includes(year) ? '▾' : '▸'}
              </span>
            </button>
            
            {openYears.includes(year) && (
              <ul>
                {nominations.map(nom => (
                  <li key={nom.id} className={nom.result === 'Winner' ? 'winner' : ''}>
                    <strong>{nom.category}</strong>
                    <span>{nom.main_artist} - "{nom.nomination}"</span>
                    <Link to={`/awards/${year}`} className="year-link">See year</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}