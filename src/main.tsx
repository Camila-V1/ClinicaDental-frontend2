// import { StrictMode } from 'react' // Desactivado temporalmente
import { createRoot } from 'react-dom/client'
import './index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  // StrictMode temporalmente desactivado para evitar doble ejecución en desarrollo
  // TODO: Arreglar manejo de estado en AuthContext para que funcione con StrictMode
  // <StrictMode>
    <App />
  // </StrictMode>,
)
