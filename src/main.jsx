import { createRoot } from 'react-dom/client'

import Home from './Home/Home.jsx'
import Register from './Register/Register.jsx'
import Login from './Login/Login.jsx'
import PMPage from './PMPage/PMPage.jsx'
import ServerPage from './ServerPage/ServerPage.jsx'
import NotFoundPage from './NotFoundPage.jsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './Context/AuthContext.jsx'
import { ModeProvider } from './Context/ModeContext.jsx'
import { ServerProvider } from "./Context/ServerProvider.jsx"

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
  {
    path:'/Server',
    element: <ServerPage/>
  }
])

createRoot(document.getElementById('root')).render(
  <ServerProvider>
    <AuthProvider>
      <ModeProvider>
        <RouterProvider router={router}/>
      </ModeProvider>
    </AuthProvider>
  </ServerProvider>
)
