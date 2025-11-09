/**
 * 👨‍⚕️ DASHBOARD DOCTOR - Panel de doctor
 */

import { useAuthContext } from '../../context/AuthContext';
import TenantInfo from '../../components/tenant/TenantInfo';
import { Link } from 'react-router-dom';

function DoctorDashboard() {
  const { userName, logout } = useAuthContext();

  // 🎯 Solo mostrar funcionalidades implementadas
  const menuItems = [
    { name: 'Mi Agenda', path: '/odontologo/agenda', icon: '📅' },
    { name: 'Historiales Clínicos', path: '/odontologo/historiales', icon: '📋' },
    { name: 'Planes de Tratamiento', path: '/odontologo/planes', icon: '🦷' },
    // ⚠️ Funcionalidades pendientes (ocultas por ahora):
    // { name: 'Mis Citas', path: '/agenda/mis-citas', icon: '📆' },
    // { name: 'Pacientes', path: '/pacientes', icon: '👥' },
    // { name: 'Inventario', path: '/inventario', icon: '📦' },
  ];

  const citasHoy = [
    { hora: '09:00', paciente: 'No hay citas', tipo: '-' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '25px 40px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderBottom: '3px solid #2c5aa0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '600' }}>
              👨‍⚕️ Dashboard Doctor
            </h1>
            <p style={{ margin: 0, color: '#666', fontSize: '15px' }}>
              ¡Buenos días, Dr. <strong>{userName || 'Doctor'}</strong>! Listo para atender pacientes
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <TenantInfo />
            <button 
            onClick={logout} 
            style={{ 
              padding: '12px 24px', 
              cursor: 'pointer',
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b71c1c'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
          >
            🚪 Cerrar Sesión
          </button>
        </div>
        </div>
      </div>

      <div style={{ padding: '30px 40px' }}>
        {/* Citas de Hoy */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0',
          marginBottom: '30px'
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600', color: '#333' }}>📅 Citas de Hoy</h2>
          <div style={{ border: '2px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid #e0e0e0', fontWeight: '600', fontSize: '14px', color: '#555' }}>Hora</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid #e0e0e0', fontWeight: '600', fontSize: '14px', color: '#555' }}>Paciente</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid #e0e0e0', fontWeight: '600', fontSize: '14px', color: '#555' }}>Tipo</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid #e0e0e0', fontWeight: '600', fontSize: '14px', color: '#555' }}>Acciones</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: 'white' }}>
                {citasHoy.map((cita, index) => (
                  <tr key={index}>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', color: '#333' }}>{cita.hora}</td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', color: '#333' }}>{cita.paciente}</td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', color: '#333' }}>{cita.tipo}</td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', color: '#999' }}>-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Acceso Rápido */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0',
          marginBottom: '30px'
        }}>
          <h2 style={{ margin: '0 0 25px 0', fontSize: '20px', fontWeight: '600', color: '#333' }}>Acceso Rápido</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            {menuItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                style={{ 
                  border: '2px solid #e0e0e0', 
                  padding: '25px', 
                  textDecoration: 'none',
                  color: '#333',
                  borderRadius: '8px',
                  textAlign: 'center',
                  display: 'block',
                  backgroundColor: '#fafafa',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{item.icon}</div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.name}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Estadísticas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div style={{ 
            backgroundColor: 'white',
            border: '2px solid #e0e0e0', 
            padding: '25px', 
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '13px', color: '#666', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Citas Hoy
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginTop: '12px', color: '#2c5aa0' }}>0</div>
          </div>
          <div style={{ 
            backgroundColor: 'white',
            border: '2px solid #e0e0e0', 
            padding: '25px', 
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '13px', color: '#666', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Pacientes Activos
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginTop: '12px', color: '#2c5aa0' }}>0</div>
          </div>
          <div style={{ 
            backgroundColor: 'white',
            border: '2px solid #e0e0e0', 
            padding: '25px', 
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '13px', color: '#666', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tratamientos en Curso
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginTop: '12px', color: '#2c5aa0' }}>0</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
