// src/pages/YearlyAwardsPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import './YearlyAwardsPage.css'

// (A função getEditionTitle permanece a mesma)
function getEditionTitle(year) {
  const numericYear = parseInt(year, 10)
  const edition = numericYear - 1999 + 1
  if (isNaN(edition)) return 'Awards'
  let suffix = 'th'
  if (edition % 10 === 1 && edition % 100 !== 11) suffix = 'st'
  if (edition % 10 === 2 && edition % 100 !== 12) suffix = 'nd'
  if (edition % 10 === 3 && edition % 100 !== 13) suffix = 'rd'
  return `${edition}${suffix} Millennium Awards`
}

// (O sub-componente RenderCredits permanece o mesmo)
function RenderCredits({ label, namesString, showLabel = true, isBold = false }) {
  if (!namesString || namesString === '—') {
    return null;
  }
  const namesArray = namesString.split(',').map(name => name.trim());

  return (
    <p className="nominee-credit-line">
      {showLabel && <strong>{label}:</strong>}
      {' '} 
      {namesArray.map((name, index) => (
        <React.Fragment key={name}>
          {index > 0 && ', '}
          <Link 
            to={`/artist/${encodeURIComponent(name)}`}
            className={isBold ? 'bold-link' : ''} 
          >
            {name}
          </Link>
        </React.Fragment>
      ))}
    </p>
  );
}

// (O componente principal)
export function YearlyAwardsPage() {
  const [allData, setAllData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [fields, setFields] = useState([])
  const { year } = useParams()
  const selectedYear = parseInt(year, 10)
  const [selectedField, setSelectedField] = useState(null)
  const [showWinnersOnly, setShowWinnersOnly] = useState(false)

  // (Todos os useEffects permanecem os mesmos)
  useEffect(() => {
    fetch('/db.json')
      .then((res) => res.json())
      .then((data) => {
        setAllData(data)
      })
      .catch((err) => console.error('Falha ao carregar db.json:', err))
  }, [])

  useEffect(() => {
    if (allData.length > 0 && !isNaN(selectedYear)) {
      const yearData = allData.filter((item) => item.year === selectedYear)
      setFilteredData(yearData)
      const uniqueFields = [...new Set(yearData.map((item) => item.field))]
      setFields(uniqueFields.sort())
      setSelectedField(null)
      setShowWinnersOnly(false)
    }
  }, [selectedYear, allData])

  // (Toda a lógica de 'groupedNominations' e 'categoriesToDisplay' permanece a mesma)
  const groupedNominations = filteredData.reduce((acc, nom) => {
    if (!acc[nom.category]) {
      acc[nom.category] = []
    }
    acc[nom.category].push(nom)
    return acc
  }, {})

  const categoriesToDisplay = Object.entries(groupedNominations)
    .filter(([category, nominees]) => {
      if (selectedField === null) {
        return true
      }
      return nominees[0].field === selectedField
    })
    .map(([category, nominees]) => {
      if (showWinnersOnly) {
        const winnersOnly = nominees.filter(nom => nom.result === 'Winner');
        return [category, winnersOnly];
      }
      return [category, nominees];
    })
    .filter(([category, nominees]) => nominees.length > 0);


  return (
    <div className="awards-page-container">
      {/* (O .awards-header e .awards-sidebar permanecem os mesmos) */}
      <div className="awards-header">
        <h1>{getEditionTitle(selectedYear)}</h1>
        <p>Honoring the best in music from {selectedYear}</p>
      </div>

      <div className="awards-body">
        <aside className="awards-sidebar">
          <h3>Filter</h3>
          <div className="filter-toggle">
            <label htmlFor="winnersOnly">Show Winners Only</label>
            <input
              type="checkbox"
              id="winnersOnly"
              checked={showWinnersOnly}
              onChange={(e) => setShowWinnersOnly(e.target.checked)}
            />
          </div>
          <h3>Fields</h3>
          <ul>
            <li>
              <button
                onClick={() => setSelectedField(null)}
                className={selectedField === null ? 'active' : ''}
              >
                All Fields
              </button>
            </li>
            {fields.map((field) => (
              <li key={field}>
                <button
                  onClick={() => setSelectedField(field)}
                  className={selectedField === field ? 'active' : ''}
                >
                  {field}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      
        {/* (O 'main' onde o erro está) */}
        <main className="awards-content">
          {categoriesToDisplay.map(([category, nominees]) => (
            <section key={category} id={nominees[0].field} className="category-section">
              <h4>{category}</h4>
              <ul>
                {nominees.map((nom) => {
                  
                  // --- ESTA É A LINHA QUE FALTAVA ---
                  // O erro acontece se esta definição não estiver aqui.
                  const isArtistCategory =
                    nom.category === 'Artist of the Year' ||
                    nom.category === 'Best New Artist';

                  return (
                    <li
                      key={nom.id}
                      className={`${nom.result === 'Winner' ? 'winner' : ''} ${
                        isArtistCategory ? 'artist-category-item' : ''
                      }`}
                    >
                      <div className="nominee-info">
                        <RenderCredits 
                          namesString={nom.main_artist} 
                          showLabel={false} 
                          isBold={true} 
                        />
                        {!isArtistCategory && (
                          <span>"{nom.nomination}"</span>
                        )}
                        {!isArtistCategory && nom.result === 'Winner' && (
                          <span className="winner-label">WINNER</span>
                        )}
                      </div>
                      
                      {!isArtistCategory && (
                        <div className="nominee-credits">
                          <RenderCredits label="Producer(s)" namesString={nom.producer} />
                          <RenderCredits label="Songwriter(s)" namesString={nom.songwriters} />
                          <RenderCredits label="Director(s)" namesString={nom.director} />
                          <RenderCredits label="Technical(s)" namesString={nom.technical} />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </main>
      </div>
    </div>
  )
}