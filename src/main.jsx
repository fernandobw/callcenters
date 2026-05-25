import React from 'react'
import ReactDOM from 'react-dom/client'
import "bootstrap/dist/js/bootstrap.bundle.min"
import "bootstrap/dist/css/bootstrap.min.css"
import './index.scss'
import { RouterProvider } from 'react-router-dom'
import router from "./router.jsx"
import { ContextProvider } from './contexts/ContextProvider'

import 'animate.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  </React.StrictMode>
)
