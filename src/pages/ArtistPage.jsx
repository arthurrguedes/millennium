import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import './ArtistPage.css' //

// (As 4 funções helper: flattenCreditsToString, hasExactArtist, isArtistCredited, countCredits)
function flattenCreditsToString(creditData) {
  if (!creditData) {
    return null; 
  }
  if (typeof creditData === 'string') {
    return creditData;
  }
  if (typeof creditData === 'object' && !Array.isArray(creditData)) {
    const allNames = [];
    const roles = Object.keys(creditData); 
    for (const role of roles) {
      const names = creditData[role];
      if (Array.isArray(names)) {
        allNames.push(...names);
      }
      else if (typeof names === 'string') {
        allNames.push(...names.split(',').map(n => n.trim()));
      }
    }
    const validNames = allNames.filter(name => name && name.trim());
    if (validNames.length === 0) return null;
    return validNames.join(', ');
  }
  return null; 
}

function hasExactArtist(namesString, nameToFind) {
  const flatNamesString = flattenCreditsToString(namesString);
  if (!flatNamesString || flatNamesString === '—') {
    return false;
  }
  const namesArray = flatNamesString.split(',').map(name => name.trim());
  return namesArray.includes(nameToFind);
}

function isArtistCredited(item, nameToFind) {
  if (hasExactArtist(item.main_artist, nameToFind) ||
      hasExactArtist(item.producer, nameToFind) ||
      hasExactArtist(item.songwriters, nameToFind) ||
      hasExactArtist(item.director, nameToFind) ||
      hasExactArtist(item.technical, nameToFind)) {
    return true;
  }
  if (item.defining_awards && Array.isArray(item.defining_awards)) {
    for (const subAward of item.defining_awards) {
      if (hasExactArtist(subAward.producer, nameToFind) ||
          hasExactArtist(subAward.songwriters, nameToFind) ||
          hasExactArtist(subAward.director, nameToFind)) {
        return true;
      }
    }
  }
  return false;
}

function countCredits(item, nameToFind) {
  let count = 0;
  if (hasExactArtist(item.main_artist, nameToFind)) count++;
  if (hasExactArtist(item.producer, nameToFind)) count++;
  if (hasExactArtist(item.songwriters, nameToFind)) count++;
  if (hasExactArtist(item.director, nameToFind)) count++;
  if (hasExactArtist(item.technical, nameToFind)) count++;

  if (item.defining_awards && Array.isArray(item.defining_awards)) {
    for (const subAward of item.defining_awards) {
      if (hasExactArtist(subAward.producer, nameToFind)) count++;
      if (hasExactArtist(subAward.songwriters, nameToFind)) count++;
      if (hasExactArtist(subAward.director, nameToFind)) count++;
    }
  }
  return count;
}

const MAIN_CATEGORIES = [
  'Album of the Year', 'Record of the Year', 'Artist of the Year',
  'Song of the Year', 'Best New Artist', 'Best Collaboration'
];

export function ArtistPage() {
  const [allNominations, setAllNominations] = useState([]) 
  const [loading, setLoading] = useState(true)
  const { name } = useParams()
  const artistName = decodeURIComponent(name)
  const [openYears, setOpenYears] = useState([])

  const [totalNominations, setTotalNominations] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [mainCategoryWins, setMainCategoryWins] = useState(0);
  const [showWinnersOnly, setShowWinnersOnly] = useState(false);

  useEffect(() => {
    fetch('/db.json')
      .then((res) => res.json())
      .then((data) => {
        
        const nominationLines = data.filter(item => isArtistCredited(item, artistName));
        setAllNominations(nominationLines);

        let nomCount = 0;
        let winCount = 0;
        let generalWinCount = 0;

        for (const item of data) {
          const creditsInThisNom = countCredits(item, artistName);
          
          if (creditsInThisNom > 0) {
            nomCount += creditsInThisNom;
            if (item.result === 'Winner') {
              winCount += creditsInThisNom;
            }
            if (item.result === 'Winner' && MAIN_CATEGORIES.includes(item.category)) {
              generalWinCount += creditsInThisNom;
            }
          }
        }
        
        setTotalNominations(nomCount);
        setTotalWins(winCount);
        setMainCategoryWins(generalWinCount);

        const yearsFromNoms = [...new Set(nominationLines.map(n => n.year.toString()))];
        setOpenYears(yearsFromNoms); 
        
        setLoading(false)
      })
  }, [artistName])

  const filteredNominations = showWinnersOnly
    ? allNominations.filter(nom => nom.result === 'Winner')
    : allNominations;

  const nominationsByYear = filteredNominations
    .sort((a, b) => b.year - a.year)
    .reduce((acc, nom) => {
      const year = nom.year
      if (!acc[year]) {
        acc[year] = []
      }
      acc[year].push(nom)
      return acc
    }, {})
    
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

      <div className="artist-stats">
        <div className="stat-box">
          <span>{totalNominations}</span>
          <label>Total Nominations</label>
        </div>
        <div className="stat-box">
          <span>{totalWins}</span>
          <label>Total Wins</label>
        </div>
        <div className="stat-box">
          <span>{mainCategoryWins}</span>
          <label>General Field Wins</label>
        </div>
      </div>

      <div className="filter-toggle-artist">
        <label htmlFor="winnersOnly">Show Winners Only</label>
        <input
          type="checkbox"
          id="winnersOnly"
          checked={showWinnersOnly}
          onChange={(e) => setShowWinnersOnly(e.target.checked)}
        />
      </div>

      <div className="artist-nomination-list">
        <h2>All Nominations</h2>
        
        {Object.entries(nominationsByYear).map(([year, nominations]) => {
          
          const nomsInYear = nominations.length;
          const winsInYear = nominations.filter(n => n.result === 'Winner').length;

          return (
            <div key={year} className="year-group">
              <button className="year-toggle" onClick={() => toggleYear(year)}>
                {/* Div wrapper para o h3 e contadores */}
                <div className="year-toggle-header">
                  <h3>{year}</h3>
                  <div className="year-counters">
                    <span className="noms-count">{nomsInYear} Nominations</span>
                    {/* Só mostra vitórias se houver alguma */}
                    {winsInYear > 0 && (
                      <span className="wins-count">{winsInYear} Wins</span>
                    )}
                  </div>
                </div>
                
                <span className="toggle-icon">
                  {openYears.includes(year) ? '▾' : '▸'}
                </span>
              </button>
              
              {openYears.includes(year) && (
                <ul>
                  {nominations.map(nom => (
                    <li key={nom.id} className={nom.result === 'Winner' ? 'winner' : ''}>
                      <strong>{nom.category}</strong>
                      <span>{nom.nomination}</span>
                      <Link to={`/awards/${year}`} className="year-link">See year</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  )
}