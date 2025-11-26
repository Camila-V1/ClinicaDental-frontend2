/**
 * 🚀 APP PRINCIPAL - Sistema de Gestión Clínica Dental
 * Configuración de rutas y autenticación con soporte multi-tenant
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { TenantProvider } from './context/TenantContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { TenantDebugInfo } from './components/TenantDebugInfo';

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
import CalendarioCitas from './components/Calendario/CalendarioCitas';
import OdontogramaDemo from './pages/odontologo/OdontogramaDemo';

// Páginas del Paciente
import DashboardPaciente from './pages/paciente/Dashboard';
import PerfilPaciente from './pages/paciente/Perfil';
import MisCitas from './pages/paciente/Citas';
import SolicitarCita from './pages/paciente/SolicitarCita';
import HistorialClinico from './pages/paciente/Historial';
import HistorialClinicoCompleto from './pages/paciente/HistorialClinicoCompleto';
import DetalleEpisodio from './pages/paciente/DetalleEpisodio';
import PlanesTratamiento from './pages/paciente/Planes';
import DetallePlanPaciente from './pages/paciente/DetallePlan';
import SolicitudesPlanes from './pages/paciente/SolicitudesPlanes';
import Facturas from './pages/paciente/Facturas';
import DetalleFactura from './pages/paciente/DetalleFactura';
import Odontograma from './pages/paciente/Odontograma';

// Admin Pages
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsuarios from './pages/admin/Usuarios';
import AdminPacientes from './pages/admin/Pacientes';
import AdminAgenda from './pages/admin/Agenda';
import AdminTratamientos from './pages/admin/Tratamientos';
import AdminHistorialClinico from './pages/admin/HistorialClinico';
import AdminFacturacion from './pages/admin/Facturacion';
import PresupuestosParaFacturar from './pages/admin/PresupuestosParaFacturar';
import AdminReportes from './pages/admin/Reportes';
import AdminConfiguracion from './pages/admin/Configuracion';
import AdminInventario from './pages/admin/Inventario';
import AdminBitacora from './pages/admin/Bitacora';
import AdminBackups from './pages/admin/Backups';

// SuperAdmin Pages
import Solicitudes from './pages/superadmin/Solicitudes';

// Public Pages
import RegistroClinica from './pages/public/RegistroClinica';

function App() {
  return (
    <BrowserRouter>
      <TenantProvider>
        <AuthProvider>
          {/* Toaster para notificaciones */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          {/* Componente de debug de tenant (solo en desarrollo) */}
          {import.meta.env.DEV && <TenantDebugInfo />}
          
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/registro-clinica" element={<RegistroClinica />} />
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
            
            {/* Ruta de Calendario para Odontólogo */}
            <Route
              path="/odontologo/calendario"
              element={
                <ProtectedRoute>
                  <CalendarioCitas />
                </ProtectedRoute>
              }
            />
            
            {/* Ruta de Demo Odontograma */}
            <Route
              path="/odontologo/odontograma-demo"
              element={
                <ProtectedRoute>
                  <OdontogramaDemo />
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
            
            {/* ============ RUTAS DEL MÓDULO PACIENTE ============ */}
            
            {/* Dashboard del paciente */}
            <Route
              path="/paciente/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPaciente />
                </ProtectedRoute>
              }
            />
            
            {/* Perfil del paciente */}
            <Route
              path="/paciente/perfil"
              element={
                <ProtectedRoute>
                  <PerfilPaciente />
                </ProtectedRoute>
              }
            />
            
            {/* Citas del paciente */}
            <Route
              path="/paciente/citas"
              element={
                <ProtectedRoute>
                  <MisCitas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/paciente/citas/solicitar"
              element={
                <ProtectedRoute>
                  <SolicitarCita />
                </ProtectedRoute>
              }
            />
            
            {/* Historial clínico */}
            <Route
              path="/paciente/historial"
              element={
                <ProtectedRoute>
                  <HistorialClinicoCompleto />
                </ProtectedRoute>
              }
            />
            
            {/* Historial clínico (vista anterior) */}
            <Route
              path="/paciente/historial-simple"
              element={
                <ProtectedRoute>
                  <HistorialClinico />
                </ProtectedRoute>
              }
            />
            
            {/* Detalle de episodio clínico */}
            <Route
              path="/paciente/historial/episodio/:episodioId"
              element={
                <ProtectedRoute>
                  <DetalleEpisodio />
                </ProtectedRoute>
              }
            />
            
            {/* Odontograma interactivo */}
            <Route
              path="/paciente/odontograma"
              element={
                <ProtectedRoute>
                  <Odontograma />
                </ProtectedRoute>
              }
            />
            
            {/* Planes de tratamiento */}
            <Route
              path="/paciente/planes"
              element={
                <ProtectedRoute>
                  <PlanesTratamiento />
                </ProtectedRoute>
              }
            />
            <Route
              path="/paciente/planes/:id"
              element={
                <ProtectedRoute>
                  <DetallePlanPaciente />
                </ProtectedRoute>
              }
            />
            
            {/* Solicitudes de planes (aprobar/rechazar) */}
            <Route
              path="/paciente/solicitudes"
              element={
                <ProtectedRoute>
                  <SolicitudesPlanes />
                </ProtectedRoute>
              }
            />
            
            {/* Facturas */}
            <Route
              path="/paciente/facturas"
              element={
                <ProtectedRoute>
                  <Facturas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/paciente/facturas/:id"
              element={
                <ProtectedRoute>
                  <DetalleFactura />
                </ProtectedRoute>
              }
            />
            
            {/* ============ FIN RUTAS PACIENTE ============ */}

            {/* ============ RUTAS ADMIN ============ */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="pacientes" element={<AdminPacientes />} />
              <Route path="agenda" element={<AdminAgenda />} />
              <Route path="tratamientos" element={<AdminTratamientos />} />
              <Route path="historial-clinico" element={<AdminHistorialClinico />} />
              <Route path="facturacion" element={<AdminFacturacion />} />
              <Route path="presupuestos-facturar" element={<PresupuestosParaFacturar />} />
              <Route path="reportes" element={<AdminReportes />} />
              <Route path="configuracion" element={<AdminConfiguracion />} />
              <Route path="inventario" element={<AdminInventario />} />
              <Route path="bitacora" element={<AdminBitacora />} />
              <Route path="backups" element={<AdminBackups />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>
            {/* ============ FIN RUTAS ADMIN ============ */}

            {/* ============ RUTAS SUPERADMIN ============ */}
            <Route path="/superadmin">
              <Route path="solicitudes" element={<Solicitudes />} />
            </Route>
            {/* ============ FIN RUTAS SUPERADMIN ============ */}

            {/* Ruta raíz redirige al dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />            {/* 404 - Not Found */}
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
