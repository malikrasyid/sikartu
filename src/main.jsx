import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PerkaraProvider } from './context/PerkaraContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PerkaraProvider>
      <App />
    </PerkaraProvider>
  </StrictMode>,
)
