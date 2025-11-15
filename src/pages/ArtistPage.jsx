// src/pages/ArtistPage.jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import './ArtistPage.css'

const MAIN_CATEGORIES = [
  'Album of the Year',
  'Record of the Year',
  'Artist of the Year',
  'Song of the Year',
  'Best New Artist',
  'Best Collaboration'
];

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

// Função auxiliar (sem alterações)
function hasExactArtist(namesString, nameToFind) {
  const flatNamesString = flattenCreditsToString(namesString);
  
  if (!flatNamesString || flatNamesString === '—') {
    return false;
  }
  const namesArray = flatNamesString.split(',').map(name => name.trim());
  return namesArray.includes(nameToFind);
}

// Função de verificação (para a LISTA)
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

// --- NOVA FUNÇÃO HELPER (para os CONTADORES) ---
// Esta função conta os CRÉDITOS para um artista específico
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


export function ArtistPage() {
  const [allNominations, setAllNominations] = useState([]) // Para a lista
  const [loading, setLoading] = useState(true)
  const { name } = useParams()
  const artistName = decodeURIComponent(name)
  const [openYears, setOpenYears] = useState([])

  // --- NOVOS ESTADOS PARA OS CONTADORES ---
  const [totalNominations, setTotalNominations] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [mainCategoryWins, setMainCategoryWins] = useState(0);


  // --- useEffect MODIFICADO ---
  useEffect(() => {
    fetch('/db.json')
      .then((res) => res.json())
      .then((data) => {
        
        // 1. Filtrar as LINHAS para a lista "All Nominations"
        const nominationLines = data.filter(item => isArtistCredited(item, artistName));
        setAllNominations(nominationLines);

        // 2. Calcular os CONTADORES (nova lógica)
        let nomCount = 0;
        let winCount = 0;
        let generalWinCount = 0;

        // Iteramos sobre todos os dados
        for (const item of data) {
          // Contamos quantos créditos o artista tem nesta linha
          const creditsInThisNom = countCredits(item, artistName);
          
          if (creditsInThisNom > 0) {
            // Adiciona ao total de indicações
            nomCount += creditsInThisNom;
            
            // Se for uma vitória, adiciona ao total de vitórias
            if (item.result === 'Winner') {
              winCount += creditsInThisNom;
            }
            
            // Se for uma vitória de General Field, adiciona
            if (item.result === 'Winner' && MAIN_CATEGORIES.includes(item.category)) {
              generalWinCount += creditsInThisNom;
            }
          }
        }
        
        // Define os estados dos contadores
        setTotalNominations(nomCount);
        setTotalWins(winCount);
        setMainCategoryWins(generalWinCount);

        // Define os anos para o accordion
        const yearsFromNoms = [...new Set(nominationLines.map(n => n.year.toString()))];
        setOpenYears(yearsFromNoms); 
        
        setLoading(false)
      })
  }, [artistName])

  // O resto do componente (agrupamento, toggle, JSX) permanece o mesmo

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

      {/* Os contadores agora vêm direto do estado */}
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