import { HeroColumn } from '../components/HeroColumn'
import { TopListColumn } from '../components/TopListColumn'
import { CategoryGrid } from '../components/CategoryGrid'
import { HorizontalList } from '../components/HorizontalList'

export function HomePage() {
  return (
    // Usamos um <></> (Fragment) para agrupar tudo
    <>
      <main className="main-grid">
        <HeroColumn />
        <TopListColumn title="Achievements from The 29th Millennium's Nominations: Bad Bunny, Kendrick, Lady Gaga and much more!" />
        <TopListColumn title="Check out the artists making their debut in this 2025 ceremony." />
      </main>

      <CategoryGrid />
      <HorizontalList />
    </>
  )
}