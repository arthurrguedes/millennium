import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'
import App from './App.jsx'
import { HomePage } from './pages/HomePage' 
import { AwardsPage } from './pages/AwardsPage.jsx'
import { YearlyAwardsPage } from './pages/YearlyAwardsPage.jsx'
import { ArtistPage } from './pages/ArtistPage'

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
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)