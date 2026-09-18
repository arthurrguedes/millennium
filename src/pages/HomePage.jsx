import { HeroColumn } from '../components/HeroColumn'
import { TopListColumn } from '../components/TopListColumn'
import { CategoryGrid } from '../components/CategoryGrid'
import { HorizontalList } from '../components/HorizontalList'
import { RecentWinnersAccordion } from '../components/RecentWinnersAccordion'

export function HomePage() {
  return (
    // Usamos um <></> (Fragment) para agrupar tudo
    <>
      <main className="main-grid">
        <HeroColumn />
        <TopListColumn title="(UPDATED: 26/06/26) Official Announcement: New Categories and Updates" />
        <TopListColumn title="2025 Millennium Awards: Bad Bunny's Historic Sweep and Genre Highlights." />
      </main>

      <RecentWinnersAccordion />
    </>
  )
}