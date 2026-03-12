import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'
import App from './App.jsx'
import { HomePage } from './pages/HomePage' 
import { AwardsPage } from './pages/AwardsPage.jsx'
import { YearlyAwardsPage } from './pages/YearlyAwardsPage.jsx'
import { ArtistPage } from './pages/ArtistPage'
import { StatsPage } from './pages/StatsPage.jsx'
import { FieldsPage } from './pages/FieldsPage.jsx'
import { CategoryPage } from './pages/CategoryPage.jsx'
import { NewsPage } from './pages/NewsPage.jsx'
import { NewsArticlePage } from './pages/NewsArticlePage.jsx'
import { AboutPage } from './pages/AboutPage.jsx'
import { SubmitPage } from './pages/SubmitPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/submit',
        element: <SubmitPage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/awards',
        element: <AwardsPage />,
      },
      { 
        path: '/news', 
        element: <NewsPage /> },
      { 
        path: '/news/:id', 
        element: <NewsArticlePage /> }, 
      { 
        path: '/awards', 
        element: <AwardsPage /> },
      {
        path: '/awards/:year',
        element: <YearlyAwardsPage />,
      },
      { path: '/artist/:name', 
        element: <ArtistPage /> 
      },
      { 
        path: '/stats', 
        element: <StatsPage /> 
      },
      {
        path: '/fields', 
        element: <FieldsPage /> 
      },
      { 
        path: '/category/:name', 
        element: <CategoryPage /> 
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)