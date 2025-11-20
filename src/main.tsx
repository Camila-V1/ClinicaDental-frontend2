// import { StrictMode } from 'react' // Desactivado temporalmente
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import App from './App.tsx'

// Configurar React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

createRoot(document.getElementById('root')!).render(
  // StrictMode temporalmente desactivado para evitar doble ejecución en desarrollo
  // TODO: Arreglar manejo de estado en AuthContext para que funcione con StrictMode
  // <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  // </StrictMode>,
)
