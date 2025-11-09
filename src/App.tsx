/**
 * 🚀 APP PRINCIPAL - Sistema de Gestión Clínica Dental
 * Configuración de rutas y autenticación con soporte multi-tenant
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TenantProvider } from './context/TenantContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AgendaCitas from './pages/odontologo/AgendaCitas';
import HistorialesList from './pages/odontologo/HistorialesList';
import HistorialDetalle from './pages/odontologo/HistorialDetalle';
import PlanesList from './pages/odontologo/PlanesList';
import PlanNuevo from './pages/odontologo/PlanNuevo';
import PlanDetalle from './pages/odontologo/PlanDetalle';

function App() {
  return (
    <BrowserRouter>
      <TenantProvider>
        <AuthProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Rutas protegidas */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            
            {/* Ruta de Agenda para Odontólogo */}
            <Route
              path="/odontologo/agenda"
              element={
                <ProtectedRoute>
                  <AgendaCitas />
                </ProtectedRoute>
              }
            />
            
            {/* Rutas de Historiales Clínicos */}
            <Route
              path="/odontologo/historiales"
              element={
                <ProtectedRoute>
                  <HistorialesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/odontologo/historiales/:pacienteId"
              element={
                <ProtectedRoute>
                  <HistorialDetalle />
                </ProtectedRoute>
              }
            />
            
            {/* Rutas de Planes de Tratamiento */}
            <Route
              path="/odontologo/planes"
              element={
                <ProtectedRoute>
                  <PlanesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/odontologo/planes/nuevo"
              element={
                <ProtectedRoute>
                  <PlanNuevo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/odontologo/planes/:id"
              element={
                <ProtectedRoute>
                  <PlanDetalle />
                </ProtectedRoute>
              }
            />
            
            {/* Ruta raíz redirige al dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 - Not Found */}
            <Route path="*" element={
              <div style={{ 
                minHeight: '100vh', 
                backgroundColor: '#f5f5f5', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <div style={{ textAlign: 'center' }}>
                  <h1 style={{ fontSize: '72px', fontWeight: 'bold', color: '#333', margin: 0 }}>404</h1>
                  <p style={{ fontSize: '20px', color: '#666', margin: '16px 0 24px' }}>Página no encontrada</p>
                  <a 
                    href="/dashboard" 
                    style={{ 
                      display: 'inline-block',
                      padding: '12px 24px', 
                      backgroundColor: '#333', 
                      color: 'white', 
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    Volver al Dashboard
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </AuthProvider>
      </TenantProvider>
    </BrowserRouter>
  );
}

export default App;
