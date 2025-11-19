/** PLANES DE TRATAMIENTO - v0 Design */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, Calendar, DollarSign, User } from 'lucide-react';
import { obtenerPlanes, type PlanDeTratamiento } from '../../services/planesService';

const PlanesTratamiento = () => {
  const navigate = useNavigate();
  const [planes, setPlanes] = useState<PlanDeTratamiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    cargarPlanes();
  }, []);

  const cargarPlanes = async () => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('💰 [PLANES TRATAMIENTO] Iniciando carga...');
    console.log('═══════════════════════════════════════════════════════');
    setCargando(true);
    setError(false);

    try {
      console.log('📡 Endpoint: /api/planes/planes/mis-planes/');
      const data = await obtenerPlanes();
      
      console.log('📦 Respuesta completa recibida:', data);
      console.log('📊 Tipo de data:', typeof data);
      console.log('📊 Es array:', Array.isArray(data));
      console.log('📊 Total planes recibidos:', data.length);
      console.log('═══════════════════════════════════════════════════════');
      
      if (data.length > 0) {
        console.log('🔍 PRIMER PLAN (análisis detallado):');
        const primerPlan = data[0];
        console.log('  - ID:', primerPlan.id);
        console.log('  - Nombre:', primerPlan.nombre);
        console.log('  - Estado:', primerPlan.estado);
        console.log('  - Paciente ID:', primerPlan.paciente_id);
        console.log('  - Odontólogo:', primerPlan.odontologo_nombre);
        console.log('  - Fecha creación:', primerPlan.fecha_creacion);
        console.log('  - Costo total:', primerPlan.costo_total);
        console.log('  - Total items:', primerPlan.total_items);
        console.log('  - Items completados:', primerPlan.items_completados);
        console.log('  - Progreso:', primerPlan.progreso_porcentaje, '%');
        console.log('  - Observaciones:', primerPlan.observaciones_generales);
        console.log('  - Campos disponibles:', Object.keys(primerPlan));
      }
      
      console.log('═══════════════════════════════════════════════════════');
      console.log('📋 LISTA COMPLETA DE PLANES:');
      data.forEach((plan, idx) => {
        console.log(`  ${idx + 1}. [${plan.estado}] ${plan.nombre} - ${plan.odontologo_nombre} (${plan.items_completados}/${plan.total_items} items, ${plan.progreso_porcentaje}%)`);
      });
      console.log('═══════════════════════════════════════════════════════');
      
      setPlanes(data);
      console.log('✅ Planes cargados exitosamente en estado:', data.length);
    } catch (err) {
      console.error('═══════════════════════════════════════════════════════');
      console.error('❌ ERROR CARGANDO PLANES:', err);
      console.error('═══════════════════════════════════════════════════════');
      setError(true);
    } finally {
      setCargando(false);
    }
  };

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case 'BORRADOR': return { bg: '#dbeafe', color: '#1e40af', text: 'Borrador' };
      case 'ACTIVO': return { bg: '#d1fae5', color: '#065f46', text: 'Activo' };
      case 'EN_PROGRESO': return { bg: '#fef3c7', color: '#92400e', text: 'En Progreso' };
      case 'COMPLETADO': return { bg: '#e0e7ff', color: '#3730a3', text: 'Completado' };
      case 'CANCELADO': return { bg: '#fee2e2', color: '#991b1b', text: 'Cancelado' };
      default: return { bg: '#f1f5f9', color: '#475569', text: estado };
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatMonto = (monto: string | number) => {
    return `$${parseFloat(monto.toString()).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e2e8f0', 
        padding: '24px 32px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#0f172a', fontWeight: '600' }}>Mis Planes de Tratamiento</h1>
        <button 
          onClick={() => navigate('/paciente/dashboard')} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: 'white', 
            border: '1px solid #cbd5e1', 
            color: '#475569', 
            borderRadius: '6px', 
            cursor: 'pointer', 
            fontWeight: '500',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
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
          <ArrowLeft size={18} strokeWidth={1.5} />
          Volver
        </button>
      </div>

      {/* Contenido */}
      <div style={{ padding: '32px', width: '100%', boxSizing: 'border-box' }}>
        {/* Loading */}
        {cargando && (
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            border: '1px solid #e2e8f0',
            padding: '80px', 
            textAlign: 'center' 
          }}>
            <Activity size={48} strokeWidth={1.5} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
            <p style={{ fontSize: '15px', color: '#94a3b8' }}>Cargando planes...</p>
          </div>
        )}

        {/* Error */}
        {error && !cargando && (
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            border: '1px solid #e2e8f0',
            padding: '80px', 
            textAlign: 'center' 
          }}>
            <p style={{ fontSize: '18px', color: '#475569', marginBottom: '20px', fontWeight: '500' }}>
              Error al cargar los planes
            </p>
            <button
              onClick={cargarPlanes}
              style={{
                padding: '10px 20px',
                backgroundColor: '#0d9488',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                transition: 'background-color 150ms'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f766e'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Lista de Planes */}
        {!cargando && !error && (
          <>
            {planes.length === 0 ? (
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0',
                padding: '80px', 
                textAlign: 'center' 
              }}>
                <Activity size={64} strokeWidth={1.5} style={{ color: '#cbd5e1', margin: '0 auto 20px' }} />
                <p style={{ fontSize: '18px', color: '#475569', fontWeight: '500' }}>
                  No tienes planes de tratamiento registrados
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {planes.map((plan) => {
                  const badge = getBadgeColor(plan.estado);
                  const itemsCompletados = plan.items_completados ?? 0;
                  const totalItems = plan.total_items ?? 0;
                  const progreso = plan.progreso ?? 0;
                  const observaciones = plan.observaciones || plan.observaciones_generales || '';
                  const planNombre = plan.nombre || plan.titulo || 'Plan sin nombre';
                  const costoTotal = plan.costo_total || plan.precio_total_plan || '0.00';

                  return (
                    <div
                      key={plan.id}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        padding: '24px',
                        cursor: 'pointer',
                        transition: 'all 150ms'
                      }}
                      onClick={() => navigate(`/paciente/planes/${plan.id}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.backgroundColor = 'white';
                      }}
                    >
                      {/* Header del Plan */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0f172a', fontWeight: '600' }}>
                            {planNombre}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={14} strokeWidth={1.5} style={{ color: '#64748b' }} />
                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                              Creado el {formatFecha(plan.fecha_creacion)}
                            </p>
                          </div>
                        </div>
                        <div
                          style={{
                            padding: '6px 14px',
                            backgroundColor: badge.bg,
                            color: badge.color,
                            borderRadius: '16px',
                            fontSize: '13px',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            border: `1px solid ${badge.color}20`
                          }}
                        >
                          {badge.text}
                        </div>
                      </div>

                      {/* Descripción */}
                      {plan.descripcion && (
                        <p style={{ 
                          margin: '0 0 16px 0', 
                          fontSize: '14px', 
                          color: '#475569',
                          lineHeight: '1.6'
                        }}>
                          {plan.descripcion}
                        </p>
                      )}

                      {/* Observaciones (si existen) */}
                      {observaciones && (
                        <div style={{ 
                          margin: '0 0 16px 0', 
                          padding: '12px 16px',
                          backgroundColor: '#fef3c7',
                          borderLeft: '3px solid #f59e0b',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'start',
                          gap: '8px'
                        }}>
                          <FileText size={16} strokeWidth={1.5} style={{ color: '#f59e0b', marginTop: '2px', flexShrink: 0 }} />
                          <p style={{ margin: 0, fontSize: '13px', color: '#78350f', lineHeight: '1.5' }}>
                            {observaciones}
                          </p>
                        </div>
                      )}

                      {/* Progreso */}
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Activity size={14} strokeWidth={1.5} style={{ color: '#0d9488' }} />
                            <span style={{ fontSize: '13px', color: '#475569', fontWeight: '500' }}>
                              Progreso de tratamientos
                            </span>
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#0d9488' }}>
                            {totalItems > 0 ? `${itemsCompletados}/${totalItems}` : 'Sin ítems'} ({progreso}%)
                          </span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '6px',
                          backgroundColor: '#f1f5f9',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${progreso}%`,
                            height: '100%',
                            backgroundColor: progreso === 0 ? '#cbd5e1' : '#0d9488',
                            transition: 'width 300ms ease-out'
                          }} />
                        </div>
                      </div>

                      {/* Footer con información financiera */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        paddingTop: '16px',
                        borderTop: '1px solid #e2e8f0'
                      }}>
                        <div>
                          <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
                            Odontólogo
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <User size={14} strokeWidth={1.5} style={{ color: '#64748b' }} />
                            <p style={{ margin: 0, fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>
                              {plan.odontologo_nombre || `${plan.odontologo_info?.nombre || ''} ${plan.odontologo_info?.apellido || ''}`.trim() || 'Sin asignar'}
                            </p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
                            Costo Total
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                            <DollarSign size={16} strokeWidth={1.5} style={{ color: '#0d9488' }} />
                            <p style={{ margin: 0, fontSize: '18px', color: '#0d9488', fontWeight: '700' }}>
                              {formatMonto(costoTotal)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PlanesTratamiento;

