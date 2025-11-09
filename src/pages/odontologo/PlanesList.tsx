import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerPlanes, type PlanDeTratamiento } from '../../services/planesService';

export default function PlanesList() {
  const navigate = useNavigate();
  const [planes, setPlanes] = useState<PlanDeTratamiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');

  useEffect(() => {
    cargarPlanes();
  }, []);

  const cargarPlanes = async () => {
    try {
      setLoading(true);
      const data = await obtenerPlanes();
      setPlanes(data);
    } catch (error) {
      console.error('Error al cargar planes:', error);
      alert('Error al cargar planes de tratamiento');
    } finally {
      setLoading(false);
    }
  };

  const planesFiltrados = planes.filter(plan => {
    if (filtroEstado === 'TODOS') return true;
    return plan.estado === filtroEstado;
  });

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'PROPUESTO': return '#f3f4f6 #374151';
      case 'PRESENTADO': return '#dbeafe #1e40af';
      case 'ACEPTADO': return '#d1fae5 #065f46';
      case 'EN_PROGRESO': return '#fef3c7 #92400e';
      case 'COMPLETADO': return '#e9d5ff #6b21a8';
      case 'CANCELADO': return '#fee2e2 #991b1b';
      default: return '#f3f4f6 #374151';
    }
  };

  const obtenerColorPrioridad = (prioridad: string) => {
    switch (prioridad) {
      case 'URGENTE': return '#dc2626';
      case 'ALTA': return '#ea580c';
      case 'MEDIA': return '#ca8a04';
      case 'BAJA': return '#6b7280';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            📋 Planes de Tratamiento
          </h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>
            Gestiona los planes de tratamiento de tus pacientes
          </p>
        </div>
        <button
          onClick={() => navigate('/odontologo/planes/nuevo')}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '500',
            fontSize: '16px'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          ➕ Nuevo Plan
        </button>
      </div>

      {/* Filtros */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['TODOS', 'PROPUESTO', 'ACEPTADO', 'EN_PROGRESO', 'COMPLETADO'].map(estado => (
          <button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '500',
              border: filtroEstado === estado ? 'none' : '1px solid #d1d5db',
              backgroundColor: filtroEstado === estado ? '#3b82f6' : 'white',
              color: filtroEstado === estado ? 'white' : '#374151',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              if (filtroEstado !== estado) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseOut={(e) => {
              if (filtroEstado !== estado) {
                e.currentTarget.style.backgroundColor = 'white';
              }
            }}
          >
            {estado === 'TODOS' ? 'Todos' : estado.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Lista de Planes */}
      {planesFiltrados.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '48px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#6b7280', fontSize: '18px', marginBottom: '16px' }}>
            📭 No hay planes con este filtro
          </p>
          <button
            onClick={() => navigate('/odontologo/planes/nuevo')}
            style={{
              color: '#3b82f6',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              textDecoration: 'underline'
            }}
          >
            Crear primer plan de tratamiento
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {planesFiltrados.map((plan) => {
            const [bgColor, textColor] = obtenerColorEstado(plan.estado).split(' ');
            
            return (
              <div
                key={plan.id}
                onClick={() => navigate(`/odontologo/planes/${plan.id}`)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Header Card */}
                <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: bgColor,
                      color: textColor
                    }}>
                      {plan.estado_display}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: obtenerColorPrioridad(plan.prioridad)
                    }}>
                      🔥 {plan.prioridad_display}
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '8px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {plan.titulo}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    👤 {plan.paciente_info.nombre_completo}
                  </p>
                </div>

                {/* Body Card */}
                <div style={{ padding: '20px' }}>
                  {/* Progreso */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                      <span style={{ color: '#6b7280' }}>Progreso</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{plan.porcentaje_completado}%</span>
                    </div>
                    <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px' }}>
                      <div
                        style={{
                          backgroundColor: '#3b82f6',
                          height: '8px',
                          borderRadius: '9999px',
                          width: `${plan.porcentaje_completado}%`,
                          transition: 'width 0.3s'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Ítems y Precio */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Procedimientos</p>
                      <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '4px 0 0 0' }}>
                        {plan.cantidad_items}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Precio Total</p>
                      <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a', margin: '4px 0 0 0' }}>
                        Bs {parseFloat(plan.precio_total_plan).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Fecha */}
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    📅 Creado: {new Date(plan.fecha_creacion).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
