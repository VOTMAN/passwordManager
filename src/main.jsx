import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './Home.jsx'
import Register from './Register.jsx'
import Login from './Login.jsx'
import PMPage from './PMPage.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import NotFoundPage from './NotFoundPage.jsx'

const router = createBrowserRouter([
  {
  path:'/',
  element: <Home/>,
  errorElement: <NotFoundPage/>
  },
  {
    path: '/Register',
    element: <Register/>
  },
  {
    path: '/Login',
    element: <Login/>
  },
  {
    path: '/PMPage/:username',
    element: <PMPage/>
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
