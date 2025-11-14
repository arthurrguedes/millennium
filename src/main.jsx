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
        path: '/awards',
        element: <AwardsPage />,
      },
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
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)