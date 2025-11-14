import React, { useState, useEffect } from 'react';
import './FieldsPage.css'; 

export function FieldsPage() {
  const [allData, setAllData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);
  
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedField, setSelectedField] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // ESTADOS DO ACCORDION:
  const [selectedCategory, setSelectedCategory] = useState(null); // Categoria pai
  const [openYearKey, setOpenYearKey] = useState(null); // Chave do filho aberto (ex: "Cat|2000" ou "Cat|Winners")
  
  const [loading, setLoading] = useState(true);

  // Buscar e processar os dados iniciais 
  useEffect(() => {
    fetch('/db.json')
      .then((res) => res.json())
      .then((data) => {
        setAllData(data);
        const years = [...new Set(data.map(item => item.year))].sort((a, b) => b - a);
        const fields = [...new Set(data.map(item => item.field))].sort();
        setAvailableYears(years);
        setAvailableFields(fields);
        setLoading(false);
      })
      .catch((err) => console.error('Falha ao carregar db.json:', err));
  }, []); 

  // Lógica de filtragem 
  let filteredData = allData;
  if (selectedYear !== 'all') {
    filteredData = filteredData.filter(item => item.year === parseInt(selectedYear));
  }
  if (selectedField !== 'all') {
    filteredData = filteredData.filter(item => item.field === selectedField);
  }

  // Obter categorias únicas
  const uniqueCategories = new Map();
  for (const item of filteredData) {
    const key = `${item.field}|${item.category}`; 
    if (!uniqueCategories.has(key)) {
      uniqueCategories.set(key, { field: item.field, category: item.category });
    }
  }
  
  let categoryList = [...uniqueCategories.values()];

  // Filtra pela busca de texto
  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    categoryList = categoryList.filter(item => 
      item.category.toLowerCase().includes(lowerQuery)
    );
  }

  // Agrupar e Ordenar
  const finalGrouped = categoryList.reduce((acc, { field, category }) => {
    if (!acc[field]) {
      acc[field] = [];
    }
    acc[field].push(category);
    return acc;
  }, {});
  const finalFields = Object.keys(finalGrouped).sort();
  for (const field of finalFields) {
    finalGrouped[field].sort();
  }

  // --- Funções do Accordion ---

  // Função para abrir a categoria (PAI)
  const handleCategoryClick = (categoryName) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null); // Fecha categoria
      setOpenYearKey(null);     // Fecha filho (seja ano ou winners)
    } else {
      setSelectedCategory(categoryName); // Abre nova categoria
      setOpenYearKey(null);     // Reseta o filho
    }
  };
  
  // Função para abrir o accordion filho (Ano ou Winners)
  const handleChildClick = (key) => {
    if (openYearKey === key) {
      setOpenYearKey(null); // Fecha
    } else {
      setOpenYearKey(key); // Abre
    }
  };


  return (
    <div className="fields-page-container">
      {/* --- Filtros (Modificados para resetar os 2 estados) --- */}
      <div className="awards-header">
        <h1>Genre Fields & Categories</h1>
        <p>Explore all categories recognized by the Millennium Awards, filterable by year and field.</p>
      </div>

      <div className="fields-filters">
        <div className="filter-group">
          <label htmlFor="year-select">Year</label>
          <select 
            id="year-select"
            value={selectedYear} 
            onChange={e => { setSelectedYear(e.target.value); setSelectedCategory(null); setOpenYearKey(null); }}
          >
            <option value="all">All Years</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="field-select">Field</label>
          <select 
            id="field-select"
            value={selectedField} 
            onChange={e => { setSelectedField(e.target.value); setSelectedCategory(null); setOpenYearKey(null); }}
          >
            <option value="all">All Fields</option>
            {availableFields.map(field => (
              <option key={field} value={field}>{field}</option>
            ))}
          </select>
        </div>
        <div className="filter-group filter-search">
          <label htmlFor="category-search">Search Category</label>
          <input 
            type="text"
            id="category-search"
            placeholder="e.g., Album of the Year"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* --- Lista de Categorias --- */}
      <div className="fields-list-container">
        {loading ? (
          <p>Loading categories...</p>
        ) : finalFields.length > 0 ? (
          finalFields.map(field => (
            <React.Fragment key={field}>
              <h2 className="field-title">{field}</h2>
              <ul className="category-accordion-list">
                {finalGrouped[field].map(category => {
                  
                  const isCategoryOpen = selectedCategory === category;
                  
                  // Pré-calcula as listas SÓ se a categoria estiver aberta
                  let winnersOnly = [];
                  let groupedByYear = {};
                  let sortedYears = [];

                  if (isCategoryOpen) {
                    const nominees = filteredData.filter(item => item.category === category);
                    winnersOnly = nominees.filter(item => item.result === 'Winner');
                    
                    groupedByYear = nominees.reduce((acc, nom) => {
                      const year = nom.year.toString();
                      if (!acc[year]) acc[year] = [];
                      acc[year].push(nom);
                      return acc;
                    }, {});
                    sortedYears = Object.keys(groupedByYear).sort((a, b) => b - a);
                  }

                  return (
                    <li key={category} className="category-item-container">
                      {/* --- Botão da Categoria --- */}
                      <button 
                        className={`category-toggle ${isCategoryOpen ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(category)}
                      >
                        {category}
                        <span className="toggle-icon">{isCategoryOpen ? '▾' : '▸'}</span>
                      </button>
                      
                      {/* Renderiza a lista de filhos (Winners + Anos) */}
                      {isCategoryOpen && (
                        <ul className="year-accordion-list">
                          
                          {/* --- Accordion de Vencedores --- */}
                          {winnersOnly.length > 0 && (
                            <li className="year-item-container winners-accordion">
                              {(() => { // IIFE para escopo de variáveis
                                const winnersKey = `${category}|Winners`;
                                const isWinnersOpen = openYearKey === winnersKey;
                                return (
                                  <>
                                    <button
                                      className={`year-toggle winners-toggle ${isWinnersOpen ? 'active' : ''}`}
                                      onClick={() => handleChildClick(winnersKey)}
                                    >
                                      All Winners ({winnersOnly.length})
                                      <span className="toggle-icon">{isWinnersOpen ? '▾' : '▸'}</span>
                                    </button>
                                    
                                    {isWinnersOpen && (
                                      <ul className="nominee-list-final">
                                        {winnersOnly.map(nom => (
                                          <li key={nom.id} className="winner">
                                            {nom.year}: {nom.main_artist} - "{nom.nomination}"
                                            <span className="winner-label">WINNER</span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </>
                                );
                              })()}
                            </li>
                          )}
                          
                          {/* --- Accordion de Anos --- */}
                          {sortedYears.map(year => {
                            const yearKey = `${category}|${year}`;
                            const isYearOpen = openYearKey === yearKey;
                            
                            return (
                              <li key={yearKey} className="year-item-container">
                                <button
                                  className={`year-toggle ${isYearOpen ? 'active' : ''}`}
                                  onClick={() => handleChildClick(yearKey)}
                                >
                                  {year}
                                  <span className="toggle-icon">{isYearOpen ? '▾' : '▸'}</span>
                                </button>
                                
                                {isYearOpen && (
                                  <ul className="nominee-list-final">
                                    {groupedByYear[year].map(nom => (
                                      <li key={nom.id} className={nom.result === 'Winner' ? 'winner' : ''}>
                                        {nom.main_artist} - "{nom.nomination}"
                                        
                                        {nom.result === 'Winner' && (
                                          <span className="winner-label">WINNER</span>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            );
})}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </React.Fragment>
          ))
        ) : (
          <p>No categories match your filter criteria.</p>
        )}
      </div>
    </div>
  );
}