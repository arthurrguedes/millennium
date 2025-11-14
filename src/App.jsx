// src/App.jsx
import './App.css'
import { Outlet } from 'react-router-dom' // Importar o Outlet
import { Header } from './components/Header'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="container">
      <Header />
      
      {/* O Outlet é onde as páginas (HomePage, AwardsPage)
          serão renderizadas pelo roteador */}
      <Outlet /> 

      <Footer />
    </div>
  )
}

export default App