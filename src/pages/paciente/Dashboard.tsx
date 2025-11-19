/**
 * 🏠 DASHBOARD DEL PACIENTE
 * Vista principal con resumen de información y estadísticas
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import ProximasCitas from '../../components/paciente/ProximasCitas';
import ResumenHistorial from '../../components/paciente/ResumenHistorial';
import AccesosRapidos from '../../components/paciente/AccesosRapidos';
import EstadisticasCards from '../../components/dashboard/EstadisticasCards';
import GraficoCitas from '../../components/dashboard/GraficoCitas';
import AlertasUrgentes from '../../components/dashboard/AlertasUrgentes';
import TimelineActividad from '../../components/dashboard/TimelineActividad';
import ProgresoTratamientos from '../../components/dashboard/ProgresoTratamientos';
import {
  obtenerEstadisticasDashboard,
  obtenerGraficoCitas,
  obtenerTimelineActividad
} from '../../services/dashboardService';

const DashboardPaciente = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [graficoCitas, setGraficoCitas] = useState<any[]>([]);
  const [actividades, setActividades] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  const cargarDatosDashboard = async () => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 [Dashboard] Cargando datos del dashboard...');
    console.log('═══════════════════════════════════════════════════════');
    
    try {
      setCargando(true);
      setError(null);

      const [stats, grafico, timeline] = await Promise.all([
        obtenerEstadisticasDashboard(),
        obtenerGraficoCitas(),
        obtenerTimelineActividad()
      ]);

      console.log('✅ [Dashboard] Datos cargados exitosamente:', {
        estadisticas: stats,
        graficoCitas: grafico,
        actividades: timeline
      });

      setEstadisticas(stats);
      setGraficoCitas(grafico);
      setActividades(timeline);
    } catch (err: any) {
      console.error('❌ [Dashboard] Error al cargar datos:', err);
      setError(err.message || 'Error al cargar datos del dashboard');
    } finally {
      setCargando(false);
    }
  };

  console.log('═══════════════════════════════════════════════════════');
  console.log('🏠 [Dashboard] Componente RENDERIZADO');
  console.log('═══════════════════════════════════════════════════════');
  console.log('👤 [Dashboard] Usuario autenticado:', {
    id: user?.id,
    email: user?.email,
    nombre: user?.nombre,
    apellido: user?.apellido,
    first_name: user?.first_name,
    last_name: user?.last_name,
    tipo_usuario: user?.tipo_usuario,
    ci: user?.ci,
    telefono: user?.telefono
  });
  console.log('📧 [Dashboard] Email:', user?.email);
  console.log('🏷️ [Dashboard] Nombre completo:', `${user?.nombre || user?.first_name || ''} ${user?.apellido || user?.last_name || ''}`);
  console.log('🔑 [Dashboard] Rol:', user?.tipo_usuario);
  console.log('═══════════════════════════════════════════════════════');
  console.log('📦 [Dashboard] Componentes a cargar:');
  console.log('  1️⃣ ProximasCitas → /api/agenda/citas/?fecha_inicio=...');
  console.log('  2️⃣ ResumenHistorial → /api/historial/historiales/mi_historial/');
  console.log('                      → /api/tratamientos/planes/?estado=EN_PROGRESO');
  console.log('                      → /api/facturacion/facturas/estado_cuenta/');
  console.log('  3️⃣ AccesosRapidos → (solo UI, sin peticiones)');
  console.log('═══════════════════════════════════════════════════════');

  const handleLogout = () => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🚪 [Dashboard] LOGOUT - Cerrando sesión...');
    console.log('═══════════════════════════════════════════════════════');
    logout();
    navigate('/paciente/login');
  };

  if (cargando) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #e0e0e0',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#666', fontSize: '16px' }}>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#f44336', marginBottom: '16px' }}>⚠️ Error</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>{error}</p>
          <button
            onClick={cargarDatosDashboard}
            style={{
              padding: '10px 20px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '20px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '24px', 
            color: '#0f172a',
            fontWeight: '600'
          }}>
            Portal del Paciente
          </h1>
          <p style={{ 
            margin: '6px 0 0 0', 
            fontSize: '14px', 
            color: '#64748b' 
          }}>
            Bienvenido, <strong style={{ color: '#1e293b' }}>{user?.first_name || user?.nombre || 'Paciente'}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/paciente/solicitudes')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0d9488',
              border: 'none',
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 150ms'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f766e'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
          >
            Solicitudes
          </button>

          <button
            onClick={() => navigate('/paciente/citas')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0d9488',
              border: 'none',
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 150ms'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f766e'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
          >
            Mis Citas
          </button>

          <button
            onClick={() => navigate('/paciente/perfil')}
            style={{
              padding: '8px 16px',
              backgroundColor: 'white',
              border: '1px solid #cbd5e1',
              color: '#475569',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 150ms'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.borderColor = '#94a3b8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
          >
            Perfil
          </button>
          
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              border: 'none',
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 150ms'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          >
            Salir
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <div style={{
        padding: '24px 32px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Tarjetas de Estadísticas */}
        {estadisticas && <EstadisticasCards estadisticas={estadisticas} />}

        {/* Alertas Urgentes */}
        {estadisticas && <AlertasUrgentes estadisticas={estadisticas} />}

        {/* Grid Principal - 2 columnas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
          marginBottom: '24px'
        }}>
          {/* Columna Izquierda */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ProximasCitas />
            <ProgresoTratamientos planes={estadisticas?.planesActivos || []} />
          </div>

          {/* Columna Derecha */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ResumenHistorial />
            <TimelineActividad actividades={actividades} />
          </div>
        </div>

        {/* Gráfico de Citas - Full Width */}
        {graficoCitas.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <GraficoCitas datos={graficoCitas} />
          </div>
        )}

        {/* Accesos Rápidos - Full Width */}
        <AccesosRapidos />
      </div>
    </div>
  );
};

export default DashboardPaciente;
