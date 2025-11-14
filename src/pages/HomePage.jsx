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
        <TopListColumn title="Check out the artists making their debut in this 2025 ceremony" />
        <TopListColumn title="2025 Album Of The Year Nominees" />
      </main>

      <CategoryGrid />
      <HorizontalList />
    </>
  )
}