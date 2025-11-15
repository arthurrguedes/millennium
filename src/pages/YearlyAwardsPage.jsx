import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import './YearlyAwardsPage.css'

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

function RenderCredits({ label, namesString, showLabel = true, isBold = false }) {
  // 1. Converte o prop (que pode ser um objeto) em uma string
  const flatNamesString = flattenCreditsToString(namesString);
  
  // 2. Usa a nova string 'flatNamesString' na verificação
  if (!flatNamesString || typeof flatNamesString !== 'string' || flatNamesString === '—') {
    return null;
  }
  
  // 3. Usa a nova string 'flatNamesString' para o .split()
  const namesArray = flatNamesString.split(',').map(name => name.trim());

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

export function YearlyAwardsPage() {
  const [allData, setAllData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [fields, setFields] = useState([])
  const { year } = useParams()
  const selectedYear = parseInt(year, 10)
  const [selectedField, setSelectedField] = useState(null)
  const [showWinnersOnly, setShowWinnersOnly] = useState(false)

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
      
        <main className="awards-content">
          {categoriesToDisplay.map(([category, nominees]) => (
            <section key={category} id={nominees[0].field} className="category-section">
              <h4>{category}</h4>
              <ul>
                {nominees.map((nom) => {

                  // Verifica se é um prêmio de achievement
                  if (nom.field === 'Achievement Field' && nom.defining_awards) {
                    return (
                      <li key={nom.id} className="winner achievement-award">
                        {/* Homenageado Principal */}
                        <div className="nominee-info">
                          <RenderCredits 
                            namesString={nom.main_artist} 
                            showLabel={false} 
                            isBold={true} 
                          />
                          <span className="winner-label">WINNER</span>
                        </div>
                        
                        <ul className="defining-awards-list">
                          {nom.defining_awards.map((award, index) => (
                            <li key={index} className="defining-award-item">
                              <div className="defining-award-info">
                                <strong>{award.category}:</strong>
                                <span>"{award.nomination}"</span>
                              </div>
                              <div className="nominee-credits">
                                <RenderCredits label="Producer(s)" namesString={award.producer} />
                                <RenderCredits label="Songwriter(s)" namesString={award.songwriters} />
                                <RenderCredits label="Director(s)" namesString={award.director} />
                              </div>
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  }

                  // --- LÓGICA ANTIGA (para prêmios normais) ---
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

                        {nom.result === 'Winner' && (
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