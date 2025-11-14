/**
 * 👨‍⚕️ DASHBOARD DOCTOR - Panel de doctor
 */

import { useAuthContext } from '../../context/AuthContext';
import TenantInfo from '../../components/tenant/TenantInfo';
import { Link } from 'react-router-dom';
import MetricasDelDia from '../../components/dashboard/MetricasDelDia';

function DoctorDashboard() {
  const { userName, logout } = useAuthContext();

  // 🎯 Solo mostrar funcionalidades implementadas
  const menuItems = [
    { name: 'Mi Agenda', path: '/odontologo/agenda', icon: '📅' },
    { name: 'Calendario', path: '/odontologo/calendario', icon: '🗓️' },
    { name: 'Historiales Clínicos', path: '/odontologo/historiales', icon: '📋' },
    { name: 'Planes de Tratamiento', path: '/odontologo/planes', icon: '🦷' },
    // ⚠️ Funcionalidades pendientes (ocultas por ahora):
    // { name: 'Mis Citas', path: '/agenda/mis-citas', icon: '📆' },
    // { name: 'Pacientes', path: '/pacientes', icon: '👥' },
    // { name: 'Inventario', path: '/inventario', icon: '📦' },
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
        {/* Métricas del Día en Tiempo Real */}
        <MetricasDelDia />

        {/* Acceso Rápido */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e8e8e8',
          marginTop: '30px'
        }}>
          <h2 style={{ margin: '0 0 25px 0', fontSize: '20px', fontWeight: '600', color: '#2c3e50' }}>🚀 Acceso Rápido</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {menuItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                style={{ 
                  border: '2px solid #e8e8e8', 
                  padding: '30px', 
                  textDecoration: 'none',
                  color: '#2c3e50',
                  borderRadius: '12px',
                  textAlign: 'center',
                  display: 'block',
                  backgroundColor: '#fafafa',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{item.icon}</div>
                <div style={{ fontWeight: '600', fontSize: '16px' }}>{item.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
