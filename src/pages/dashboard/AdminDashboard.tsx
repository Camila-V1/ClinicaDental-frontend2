/**
 * 👑 DASHBOARD ADMIN - Panel de administración
 */

import { useAuthContext } from '../../context/AuthContext';
import TenantInfo from '../../components/tenant/TenantInfo';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const { userName, logout } = useAuthContext();

  // 🎯 Funcionalidades implementadas para Admin
  const menuItems: Array<{ name: string; path: string; icon: string }> = [
    // ⚠️ PENDIENTES DE IMPLEMENTACIÓN:
    // { name: 'Gestión de Usuarios', path: '/usuarios', icon: '👥' },
    // { name: 'Doctores', path: '/usuarios/doctores', icon: '👨‍⚕️' },
    // { name: 'Pacientes', path: '/usuarios/pacientes', icon: '🦷' },
    // { name: 'Agenda General', path: '/agenda', icon: '📅' },
    // { name: 'Tratamientos', path: '/tratamientos', icon: '🦷' },
    // { name: 'Inventario', path: '/inventario', icon: '📦' },
    // { name: 'Facturación', path: '/facturacion', icon: '💰' },
    // { name: 'Reportes', path: '/reportes', icon: '📊' },
    // { name: 'Configuración', path: '/configuracion', icon: '⚙️' },
  ];

  const stats = [
    { label: 'Total Usuarios', value: '0', color: 'blue' },
    { label: 'Doctores', value: '0', color: 'green' },
    { label: 'Pacientes', value: '0', color: 'purple' },
    { label: 'Citas Hoy', value: '0', color: 'orange' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '25px 40px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderBottom: '3px solid #333'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '600' }}>
              👑 Dashboard Administrador
            </h1>
            <p style={{ margin: 0, color: '#666', fontSize: '15px' }}>
              ¡Hola, <strong>{userName || 'Administrador'}</strong>! Bienvenido al panel de control
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

      {/* Main Content */}
      <div style={{ padding: '30px 40px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
          {stats.map((stat) => (
            <div 
              key={stat.label} 
              style={{ 
                backgroundColor: 'white',
                border: '2px solid #e0e0e0', 
                padding: '25px', 
                borderRadius: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s'
              }}
            >
              <div style={{ fontSize: '13px', color: '#666', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '36px', fontWeight: 'bold', marginTop: '12px', color: '#333' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Menu Items */}
        {menuItems.length > 0 ? (
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
                    display: 'block',
                    textAlign: 'center',
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
        ) : (
          <div style={{ 
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '2px dashed #e0e0e0',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: '600', color: '#333' }}>
              Módulos en Desarrollo
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '15px' }}>
              Las funcionalidades de administrador están siendo implementadas.<br/>
              Por ahora, usa el rol de <strong>Odontólogo</strong> para acceder al sistema.
            </p>
          </div>
        )}

        {/* Recent Activity */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#333' }}>Actividad Reciente</h3>
          <div style={{ 
            backgroundColor: '#f9f9f9',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            padding: '20px'
          }}>
            <p style={{ margin: 0, color: '#666' }}>No hay actividad reciente</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
