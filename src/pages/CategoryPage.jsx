import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CategoryPage.css'; 

// --- 1. FUNÇÕES AUXILIARES (Copiadas de StatsPage e YearlyAwardsPage) ---

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

function processNames(namesString, countsObject) {
  const flatNamesString = flattenCreditsToString(namesString);
  if (!flatNamesString || flatNamesString === '—') return;
  
  flatNamesString.split(',').map(name => name.trim()).forEach(name => {
    if (name) { 
      countsObject[name] = (countsObject[name] || 0) + 1;
    }
  });
};

// Copiado de YearlyAwardsPage
function RenderCredits({ label, namesString, showLabel = true, isBold = false }) {
  const flatNamesString = flattenCreditsToString(namesString);
  if (!flatNamesString || typeof flatNamesString !== 'string' || flatNamesString === '—') {
    return null;
  }
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

// (Componente de Créditos Técnicos também copiado)
function RenderTechnicalCredits({ technicalObject }) {
  if (!technicalObject || typeof technicalObject !== 'object' || Array.isArray(technicalObject)) {
    return null;
  }
  const roles = Object.keys(technicalObject);

  return (
    <div className="technical-credits-object">
      <strong className="technical-main-label">Technical(s):</strong>
      {roles.map(role => {
        let namesArray = [];
        const names = technicalObject[role];
        if (Array.isArray(names)) {
          namesArray = names;
        } else if (typeof names === 'string' && names !== '—') {
          namesArray = names.split(',').map(n => n.trim());
        }
        if (namesArray.length === 0) return null;
        const formattedRole = role.replace(/s$/, '(s)');

        return (
          <p key={role} className="nominee-credit-line technical-role">
            <strong className="role-label">{formattedRole}:</strong>
            {' '} 
            {namesArray.map((name, index) => (
              <React.Fragment key={name}>
                {index > 0 && ', '}
                <Link to={`/artist/${encodeURIComponent(name)}`}>
                  {name}
                </Link>
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}


// --- 2. COMPONENTE PRINCIPAL DA PÁGINA (LÓGICA ATUALIZADA) ---

export function CategoryPage() {
  const [categoryData, setCategoryData] = useState([]); // Armazena TODOS os dados da categoria
  const [recordHolders, setRecordHolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openYears, setOpenYears] = useState([]);
  const [showWinnersOnly, setShowWinnersOnly] = useState(false); // NOVO ESTADO DE FILTRO
  const { name } = useParams();
  const categoryName = decodeURIComponent(name);

  useEffect(() => {
    fetch('/db.json')
      .then((res) => res.json())
      .then((data) => {
        // Filtra todos os dados por esta categoria
        const categoryData = data.filter(item => item.category === categoryName);
        setCategoryData(categoryData);

        // --- LÓGICA DOS RECORDISTAS MODIFICADA ---
        const winCounts = {};
        const winners = categoryData.filter(item => item.result === 'Winner');
        
        winners.forEach(item => {
          processNames(item.main_artist, winCounts);
          processNames(item.producer, winCounts);
          processNames(item.songwriters, winCounts);
          processNames(item.technical, winCounts);
          processNames(item.director, winCounts);
          if (item.defining_awards) {
            for (const sub of item.defining_awards) {
              processNames(sub.producer, winCounts);
              processNames(sub.songwriters, winCounts);
              processNames(sub.director, winCounts);
            }
          }
        });
        
        const sortedWinners = Object.entries(winCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        // Acha a contagem máxima
        const maxCount = sortedWinners.length > 0 ? sortedWinners[0].count : 0;
        
        // Filtra apenas por quem tem a contagem máxima E a contagem é >= 2
        const allRecordHolders = sortedWinners.filter(
          p => p.count === maxCount && p.count >= 2
        );
          
        setRecordHolders(allRecordHolders);
        // --- FIM DA LÓGICA DE RECORDISTAS ---

        // Agrupar apenas para abrir o ano mais recente por padrão
        const groupedByYear = categoryData
          .sort((a, b) => b.year - a.year)
          .reduce((acc, nom) => {
            const year = nom.year;
            if (!acc[year]) acc[year] = [];
            acc[year].push(nom);
            return acc;
          }, {});
        
        if (Object.keys(groupedByYear).length > 0) {
          setOpenYears([Object.keys(groupedByYear)[0]]);
        }
        
        setLoading(false);
      })
      .catch(err => console.error("Falha ao carregar dados da categoria:", err));

  }, [categoryName]); // O 'useEffect' só roda quando o nome da categoria muda

  // (toggleYear permanece o mesmo)
  const toggleYear = (year) => {
    const yearStr = year.toString();
    if (openYears.includes(yearStr)) {
      setOpenYears(openYears.filter(y => y !== yearStr));
    } else {
      setOpenYears([...openYears, yearStr]);
    }
  };

  // --- LÓGICA DE AGRUPAMENTO MOVIDA PARA A RENDERIZAÇÃO ---
  // Filtra os dados da categoria com base no 'showWinnersOnly'
  const filteredNominations = showWinnersOnly
    ? categoryData.filter(nom => nom.result === 'Winner')
    : categoryData;
  
  // Agrupa os dados JÁ FILTRADOS por ano
  const nominationsByYear = filteredNominations
    .sort((a, b) => b.year - a.year)
    .reduce((acc, nom) => {
      const year = nom.year;
      if (!acc[year]) acc[year] = [];
      acc[year].push(nom);
      return acc;
    }, {});


  if (loading) {
    return <div>Loading category details...</div>;
  }

  return (
    <div className="category-page-container">
      <div className="category-header">
        <h1>{categoryName}</h1>
        
        {/* --- Seção de Recordistas (Condicional) --- */}
        {recordHolders.length > 0 && (
          <div className="record-holder-box">
            <h3>Record Holder(s)</h3>
            <ol className="record-list">
              {recordHolders.map(holder => (
                <li key={holder.name}>
                  <Link to={`/artist/${encodeURIComponent(holder.name)}`}>{holder.name}</Link>
                  <span>{holder.count} Wins</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* --- Seção do Histórico (Renderização) --- */}
      <div className="category-history-list">
        <h2>All Nominations by Year</h2>

        {/* --- ADICIONA O FILTRO AQUI --- */}
        <div className="category-filter-toggle">
          <label htmlFor="winnersOnly">Show Winners Only</label>
          <input
            type="checkbox"
            id="winnersOnly"
            checked={showWinnersOnly}
            onChange={(e) => setShowWinnersOnly(e.target.checked)}
          />
        </div>
        
        {Object.entries(nominationsByYear).map(([year, nominations]) => (
          <div key={year} className="year-group">
            <button className="year-toggle" onClick={() => toggleYear(year)}>
              <div className="year-toggle-header">
                <h3>{year}</h3>
              </div>
              <span className="toggle-icon">
                {openYears.includes(year) ? '▾' : '▸'}
              </span>
            </button>
            
            {openYears.includes(year) && (
              <ul className="category-nominee-list">
                {nominations.map(nom => {
                  const isArtistCategory = nom.category === 'Artist of the Year' || nom.category === 'Best New Artist' || nom.category === 'Producer Of The Year' || nom.category === 'Songwriter Of The Year';
                  
                  // Renderização especial para prêmios de achievement
                  if (nom.field === 'Achievement Field') {
                     return (
                       <li key={nom.id} className="winner achievement-award">
                         <div className="nominee-info">
                           <RenderCredits 
                             namesString={nom.main_artist} 
                             showLabel={false} 
                             isBold={true} 
                           />
                           <span className="winner-label">WINNER</span>
                         </div>
                       </li>
                     );
                  }

                  // Renderização padrão (copiada de YearlyAwardsPage)
                  return (
                    <li key={nom.id} className={nom.result === 'Winner' ? 'winner' : ''}>
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}