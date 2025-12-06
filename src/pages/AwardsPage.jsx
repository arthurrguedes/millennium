import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './AwardsPage.css'

const BIG_FOUR_CATEGORIES = [
  'Album Of The Year',
  'Record Of The Year',
  'Song Of The Year',
  'Best New Artist',
  'Artist Of The Year',
  'Best Collaboration',
]

export function AwardsPage() {
  const [groupedData, setGroupedData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/db.json') 
      .then((res) => res.json())
      .then((data) => {
        const winners = data.filter(
          (item) =>
            item.result === 'Winner' && BIG_FOUR_CATEGORIES.includes(item.category)
        )

        // Agrupa os vencedores por ano
        const byYear = winners.reduce((acc, item) => {
          const year = item.year
          if (!acc[year]) {
            acc[year] = []
          }
          acc[year].push(item)
          return acc
        }, {})
        
        setGroupedData(byYear)
        setLoading(false)
      })
  }, [])

  // Pega os anos e os reverte (para mostrar 2025, 2024, 2023...)
  const years = Object.keys(groupedData).sort().reverse()

  if (loading) {
    return <div>Loading awards...</div>
  }

  return (
    <div className="awards-hub-container">
      <div className="awards-header">
        <h1>AWARDS NOMINATIONS & WINNERS</h1>
        <p>The rich history of Music's Biggest Night is at your fingertips. From Santana and Amy Winehouse to Kendrick Lamar, Lady Gaga and Bad Bunny, explore the winners and biggest moments from each MILLENNIUM Awards telecast.</p>
      </div>

      <div className="awards-hub-grid">
        {years.map((year) => (
          <div key={year} className="year-card">
            <h2>{year}</h2>
            <ul className="winners-list">
              {groupedData[year].map((winner) => {
                
                // Verificação se é uma categoria de artista
                const isArtistCategory =
                  winner.category === 'Artist of the Year' ||
                  winner.category === 'Best New Artist';

                return (
                  <li key={winner.id}>
                    <strong>{winner.category}</strong>
                    
                    {/* Renderização condicional:
                       Se for categoria de artista, mostra o artista.
                       Se não, mostra "Artista - Nomeação".
                    */}
                    {isArtistCategory ? (
                      <span>{winner.main_artist}</span>
                    ) : (
                      <span>{winner.main_artist} - "{winner.nomination}"</span>
                    )}
                  </li>
                );
              })}
            </ul>
            <Link to={`/awards/${year}`} className="full-list-button">
              See More
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}