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
        <TopListColumn title="2025 Millennium Awards: Bad Bunny's Historic Sweep and Genre Highlights." />
        <TopListColumn title="Achievements from The 29th Millennium's Nominations: Bad Bunny, Kendrick, Lady Gaga and much more!" />
      </main>

      <CategoryGrid />
      <HorizontalList />
    </>
  )
}