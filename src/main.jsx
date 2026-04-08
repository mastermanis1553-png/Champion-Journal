import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { TradeProvider } from './context/TradeContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <TradeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TradeProvider>
    </AuthProvider>
  </React.StrictMode>
)