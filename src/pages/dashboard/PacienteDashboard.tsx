/**
 * 🦷 DASHBOARD PACIENTE - Panel de paciente
 */

import { useAuthContext } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { Link } from 'react-router-dom';

function PacienteDashboard() {
  const { userName, logout } = useAuthContext();
  const { tenant, isPublic } = useTenant();

  // 🎯 Funcionalidades implementadas para Paciente
  const menuItems: Array<{ name: string; path: string; icon: string }> = [
    // ⚠️ PENDIENTES DE IMPLEMENTACIÓN:
    // { name: 'Mis Citas', path: '/mis-citas', icon: '📅' },
    // { name: 'Agendar Cita', path: '/agendar-cita', icon: '➕' },
    // { name: 'Mi Historial', path: '/mi-historial', icon: '📋' },
    // { name: 'Mis Tratamientos', path: '/mis-tratamientos', icon: '💊' },
    // { name: 'Mis Facturas', path: '/mis-facturas', icon: '💰' },
    // { name: 'Mi Perfil', path: '/mi-perfil', icon: '👤' },
  ];

  const proximasCitas = [
    { fecha: 'No tienes citas programadas', hora: '-', doctor: '-', tipo: '-' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '25px 40px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderBottom: '3px solid #4caf50'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '600' }}>
              🦷 Mi Panel de Paciente
            </h1>
            <p style={{ margin: '0 0 4px 0', color: '#333', fontSize: '15px' }}>
              ¡Hola, <strong>{userName || 'Paciente'}</strong>! Bienvenido/a
            </p>
            {!isPublic && (
              <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                🏢 Clínica: <strong>{tenant}</strong>
              </p>
            )}
          </div>
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

      <div style={{ padding: '30px 40px' }}>
        {/* Próximas Citas */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0',
          marginBottom: '30px'
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600', color: '#333' }}>
            📅 Mis Próximas Citas
          </h2>
          <div style={{ border: '2px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid #e0e0e0', fontWeight: '600', fontSize: '14px', color: '#555' }}>Fecha</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid #e0e0e0', fontWeight: '600', fontSize: '14px', color: '#555' }}>Hora</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid #e0e0e0', fontWeight: '600', fontSize: '14px', color: '#555' }}>Doctor</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid #e0e0e0', fontWeight: '600', fontSize: '14px', color: '#555' }}>Tipo</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid #e0e0e0', fontWeight: '600', fontSize: '14px', color: '#555' }}>Acciones</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: 'white' }}>
                {proximasCitas.map((cita, index) => (
                  <tr key={index}>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', color: '#333' }}>{cita.fecha}</td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', color: '#333' }}>{cita.hora}</td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', color: '#333' }}>{cita.doctor}</td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', color: '#333' }}>{cita.tipo}</td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', color: '#999' }}>-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Acceso Rápido */}
        {menuItems.length > 0 ? (
          <div style={{ 
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0',
            marginBottom: '30px'
          }}>
            <h2 style={{ margin: '0 0 25px 0', fontSize: '20px', fontWeight: '600', color: '#333' }}>
              Acceso Rápido
            </h2>
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
              Portal de Paciente en Desarrollo
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '15px' }}>
              Las funcionalidades para pacientes están siendo implementadas.<br/>
              Pronto podrás ver tus citas, tratamientos y más información.
            </p>
          </div>
        )}

        {/* Información Importante */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{ 
            backgroundColor: 'white',
            border: '2px solid #e0e0e0', 
            padding: '25px', 
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '13px', color: '#666', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              💊 Tratamientos Activos
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#4caf50', marginBottom: '8px' }}>0</div>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>No tienes tratamientos en curso</p>
          </div>
          <div style={{ 
            backgroundColor: 'white',
            border: '2px solid #e0e0e0', 
            padding: '25px', 
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '13px', color: '#666', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              💰 Saldo Pendiente
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#4caf50', marginBottom: '8px' }}>Bs. 0.00</div>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>No tienes pagos pendientes</p>
          </div>
        </div>

        {/* Recordatorios */}
        <div style={{ 
          backgroundColor: 'white',
          border: '2px solid #e0e0e0',
          padding: '30px', 
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#333' }}>
            📌 Recordatorios Importantes
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#555', lineHeight: '1.8' }}>
            <li>Recuerda agendar tu cita de control cada 6 meses</li>
            <li>Mantén una buena higiene dental diaria</li>
            <li>Llega 10 minutos antes de tu cita</li>
            <li>Consulta a tu doctor ante cualquier molestia</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PacienteDashboard;
