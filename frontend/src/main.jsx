import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import { PrimeReactProvider } from 'primereact/api';

createRoot(document.getElementById('root')).render(
  <PrimeReactProvider>
  <BrowserRouter>
      <App />
  </BrowserRouter>
  </PrimeReactProvider>
)
