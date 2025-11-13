import './App.css'
import { Header } from './components/Header'
import { HeroColumn } from './components/HeroColumn'
import { TopListColumn } from './components/TopListColumn'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="container">
      <Header />

      <main className="main-grid">
        {/* Coluna 1: O Hero (Destaque) */}
        <HeroColumn />

        {/* Coluna 2: Reutilizando o componente TopList */}
        <TopListColumn 
          title="Check out the artists making their debut in this 2025 ceremony" 
        />

        {/* Coluna 3: Reutilizando o MESMO componente com outro texto */}
        <TopListColumn 
          title="2025 Album Of The Year Nominees" 
        />
      </main>
      <Footer />
    </div>
  )
}

export default App