import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import './YearlyAwardsPage.css'

function flattenCreditsToString(creditData) {
  if (!creditData) return null;
  if (typeof creditData === 'string') return creditData;
  if (typeof creditData === 'object' && !Array.isArray(creditData)) {
    const allNames = [];
    const roles = Object.keys(creditData); 
    for (const role of roles) {
      const names = creditData[role];
      if (Array.isArray(names)) allNames.push(...names);
      else if (typeof names === 'string') allNames.push(...names.split(',').map(n => n.trim()));
    }
    const validNames = allNames.filter(name => name && name.trim());
    if (validNames.length === 0) return null;
    return validNames.join(', ');
  }
  return null; 
}

function getEditionTitle(year) {
  const numericYear = parseInt(year, 10)
  const edition = numericYear - 1998 + 1
  if (isNaN(edition)) return 'Awards'
  let suffix = 'th'
  if (edition % 10 === 1 && edition % 100 !== 11) suffix = 'st'
  if (edition % 10 === 2 && edition % 100 !== 12) suffix = 'nd'
  if (edition % 10 === 3 && edition % 100 !== 13) suffix = 'rd'
  return `${edition}${suffix} Millennium Awards`
}

function RenderCredits({ label, namesString, showLabel = true, isBold = false }) {
  const flatNamesString = flattenCreditsToString(namesString);
  if (!flatNamesString || typeof flatNamesString !== 'string' || flatNamesString === '—') return null;
  const namesArray = flatNamesString.split(',').map(name => name.trim());

  return (
    <p className="nominee-credit-line">
      {showLabel && <strong>{label}:</strong>}
      {' '} 
      {namesArray.map((name, index) => (
        <React.Fragment key={name}>
          {index > 0 && ', '}
          <Link to={`/artist/${encodeURIComponent(name)}`} className={isBold ? 'bold-link' : ''}>
            {name}
          </Link>
        </React.Fragment>
      ))}
    </p>
  );
}

function RenderTechnicalCredits({ technicalObject }) {
  if (!technicalObject || typeof technicalObject !== 'object' || Array.isArray(technicalObject)) return null;
  const roles = Object.keys(technicalObject);

  return (
    <div className="technical-credits-object">
      <strong>Technical(s):</strong>
      {roles.map(role => {
        const names = technicalObject[role];
        let namesArray = [];
        if (Array.isArray(names)) namesArray = names;
        else if (typeof names === 'string' && names !== '—') namesArray = names.split(',').map(n => n.trim());
        
        if (namesArray.length === 0) return null;
        const formattedRole = role.replace(/s$/, '(s)');

        return (
          <p key={role} className="nominee-credit-line technical-role">
            <strong className="role-label">{formattedRole}:</strong>
            {' '} 
            {namesArray.map((name, index) => (
              <React.Fragment key={name}>
                {index > 0 && ', '}
                <Link to={`/artist/${encodeURIComponent(name)}`}>{name}</Link>
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
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

  // --- LÓGICA PARA CALCULAR ESTATÍSTICAS DO ANO ---
  const yearStats = useMemo(() => {
    if (filteredData.length === 0) return null;

    const nominationsCount = {};
    const winsCount = {};

    filteredData.forEach(nom => {
      // Separa artistas se houver vírgula (ex: "Beyoncé, Jay-Z")
      if (nom.main_artist) {
        const artists = nom.main_artist.split(',').map(a => a.trim());
        
        artists.forEach(artist => {
          // Conta Indicações
          nominationsCount[artist] = (nominationsCount[artist] || 0) + 1;

          // Conta Vitórias
          if (nom.result === 'Winner') {
            winsCount[artist] = (winsCount[artist] || 0) + 1;
          }
        });
      }
    });

    // Função auxiliar para achar o máximo e retornar array de nomes
    const findLeaders = (countMap) => {
      const max = Math.max(0, ...Object.values(countMap));
      if (max === 0) return { count: 0, artists: [] };
      const leaders = Object.keys(countMap).filter(artist => countMap[artist] === max);
      return { count: max, artists: leaders };
    };

    return {
      mostNominated: findLeaders(nominationsCount),
      mostWins: findLeaders(winsCount)
    };
  }, [filteredData]);
  // ------------------------------------------------

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

        {/* --- EXIBIÇÃO DAS ESTATÍSTICAS --- */}
        {yearStats && (
          <div className="year-stats-container">
            {yearStats.mostNominated.count > 0 && (
              <div className="stat-box">
                <span className="stat-label">Most Nominations</span>
                <span className="stat-count">{yearStats.mostNominated.count}</span>
                <div className="stat-artists">
                  {yearStats.mostNominated.artists.map((artist, i) => (
                    <span key={artist}>
                      {i > 0 && ', '}
                      <Link to={`/artist/${encodeURIComponent(artist)}`}>{artist}</Link>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {yearStats.mostWins.count > 0 && (
              <div className="stat-box highlight">
                <span className="stat-label">Most Wins</span>
                <span className="stat-count">{yearStats.mostWins.count}</span>
                <div className="stat-artists">
                  {yearStats.mostWins.artists.map((artist, i) => (
                    <span key={artist}>
                      {i > 0 && ', '}
                      <Link to={`/artist/${encodeURIComponent(artist)}`}>{artist}</Link>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {/* --------------------------------- */}

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
                  if (nom.field === 'Achievement Field' && nom.defining_awards) {
                    return (
                      <li key={nom.id} className="winner achievement-award">
                        <div className="nominee-info">
                          <RenderCredits namesString={nom.main_artist} showLabel={false} isBold={true} />
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

                  const isArtistCategory =
                    nom.category === 'Artist Of The Year' ||
                    nom.category === 'Best New Artist' ||
                    nom.category === 'Producer Of The Year' ||
                    nom.category === 'Songwriter Of The Year';

                  return (
                    <li
                      key={nom.id}
                      className={`${nom.result === 'Winner' ? 'winner' : ''} ${
                        isArtistCategory ? 'artist-category-item' : ''
                      }`}
                    >
                      <div className="nominee-info">
                        <RenderCredits namesString={nom.main_artist} showLabel={false} isBold={true} />
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
                          {nom.category === 'Best Engineered Album' ? (
                            <RenderTechnicalCredits technicalObject={nom.technical} />
                          ) : (
                            <RenderCredits label="Technical(s)" namesString={nom.technical} />
                          )}
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