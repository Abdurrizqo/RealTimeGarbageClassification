import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Photo from './Photo.tsx'
import Menu from './Menu.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Menu/>,
  },
  {
    path: "/stream",
    element: <App/>,
  },
  {
    path: "/photo",
    element: <Photo/>,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
