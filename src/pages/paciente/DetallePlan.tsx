/**
 * DETALLE DEL PLAN DE TRATAMIENTO (PACIENTE)
 * Vista completa con progreso, procedimientos, documentos y facturas
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerDetallePlan, type PlanDeTratamiento } from '../../services/planesService';
import { Activity, AlertCircle, ArrowLeft, FileText, User, DollarSign, Calendar, CheckCircle } from 'lucide-react';

export default function DetallePlan() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [plan, setPlan] = useState<PlanDeTratamiento | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔄 [DetallePlan] useEffect ejecutado');
    console.log('📋 ID del plan desde URL:', id);
    console.log('═══════════════════════════════════════════════════════');
    
    if (id) {
      cargarDetallePlan(parseInt(id));
    } else {
      console.error('❌ No hay ID en la URL');
    }
  }, [id]);

  const cargarDetallePlan = async (planId: number) => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('📥 [cargarDetallePlan] INICIANDO CARGA');
    console.log('═══════════════════════════════════════════════════════');
    console.log('🆔 Plan ID a cargar:', planId);
    console.log('🌐 Endpoint que se llamará: /api/tratamientos/planes/' + planId + '/');
    
    try {
      setCargando(true);
      console.log('⏳ Estado cargando: true');
      
      const data = await obtenerDetallePlan(planId);
      
      console.log('═══════════════════════════════════════════════════════');
      console.log('✅ [RESPUESTA RECIBIDA] Datos del plan cargados');
      console.log('═══════════════════════════════════════════════════════');
      console.log('📦 Data completa:', data);
      console.log('───────────────────────────────────────────────────────');
      console.log('📋 ANÁLISIS DETALLADO DEL PLAN:');
      console.log('  • ID:', data.id);
      console.log('  • Nombre:', data.nombre);
      console.log('  • Título:', data.titulo);
      console.log('  • Descripción:', data.descripcion);
      console.log('  • Estado:', data.estado);
      console.log('  • Estado display:', data.estado_display);
      console.log('  • Paciente ID:', data.paciente || data.paciente_id);
      console.log('  • Odontólogo ID:', data.odontologo || data.odontologo_id);
      console.log('  • Odontólogo nombre:', data.odontologo_nombre);
      console.log('───────────────────────────────────────────────────────');
      console.log('💰 INFORMACIÓN FINANCIERA:');
      console.log('  • Costo total:', data.costo_total);
      console.log('  • Precio total plan:', data.precio_total_plan);
      console.log('  • Monto pagado:', (data as any).monto_pagado);
      console.log('  • Saldo pendiente:', (data as any).saldo_pendiente);
      console.log('───────────────────────────────────────────────────────');
      console.log('📊 PROGRESO Y ESTADÍSTICAS:');
      console.log('  • Progreso:', data.progreso);
      console.log('  • Progreso porcentaje:', data.progreso_porcentaje);
      console.log('  • Porcentaje completado:', data.porcentaje_completado);
      console.log('  • Total items:', data.total_items);
      console.log('  • Items completados:', data.items_completados);
      console.log('  • Items en progreso:', (data as any).items_en_progreso);
      console.log('  • Items pendientes:', (data as any).items_pendientes);
      console.log('  • Cantidad items:', data.cantidad_items);
      console.log('───────────────────────────────────────────────────────');
      console.log('📝 OBSERVACIONES Y NOTAS:');
      console.log('  • Observaciones:', data.observaciones);
      console.log('  • Observaciones generales:', data.observaciones_generales);
      console.log('  • Notas internas:', data.notas_internas);
      console.log('───────────────────────────────────────────────────────');
      console.log('📅 FECHAS:');
      console.log('  • Fecha creación:', data.fecha_creacion);
      console.log('  • Fecha presentación:', data.fecha_presentacion);
      console.log('  • Fecha aceptación:', data.fecha_aceptacion);
      console.log('  • Fecha inicio:', data.fecha_inicio);
      console.log('  • Fecha finalización:', data.fecha_finalizacion);
      console.log('  • Creado:', data.creado);
      console.log('  • Actualizado:', data.actualizado);
      console.log('───────────────────────────────────────────────────────');
      console.log('📋 ITEMS DEL PLAN:');
      console.log('  • Tiene items?:', !!data.items);
      console.log('  • Es array?:', Array.isArray(data.items));
      console.log('  • Total items array:', data.items?.length || 0);
      
      if (data.items && data.items.length > 0) {
        console.log('  • LISTA DE ITEMS:');
        data.items.forEach((item, idx) => {
          console.log(`    ${idx + 1}. [${item.estado}] ${item.servicio_nombre} - ${item.precio_total_formateado || item.precio_total}`);
          console.log(`       - ID: ${item.id}`);
          console.log(`       - Orden: ${item.orden}`);
          console.log(`       - Notas: ${item.notas || 'N/A'}`);
          console.log(`       - Fecha estimada: ${item.fecha_estimada || 'N/A'}`);
          console.log(`       - Fecha realizada: ${item.fecha_realizada || 'N/A'}`);
        });
      } else {
        console.log('  ⚠️ NO HAY ITEMS EN EL PLAN');
      }
      
      console.log('───────────────────────────────────────────────────────');
      console.log('📄 DOCUMENTOS:');
      console.log('  • Tiene documentos?:', !!(data as any).documentos);
      console.log('  • Total documentos:', (data as any).documentos?.length || 0);
      
      console.log('───────────────────────────────────────────────────────');
      console.log('💳 FACTURAS:');
      console.log('  • Tiene facturas?:', !!(data as any).facturas);
      console.log('  • Total facturas:', (data as any).facturas?.length || 0);
      
      console.log('───────────────────────────────────────────────────────');
      console.log('🔑 TODAS LAS PROPIEDADES DISPONIBLES:');
      console.log('  Keys:', Object.keys(data));
      console.log('═══════════════════════════════════════════════════════');
      
      setPlan(data);
      console.log('✅ Plan guardado en estado');
      
    } catch (err: any) {
      console.log('═══════════════════════════════════════════════════════');
      console.error('❌ [ERROR] Error cargando plan');
      console.log('═══════════════════════════════════════════════════════');
      console.error('📋 Error completo:', err);
      console.error('📋 Error.response:', err.response);
      console.error('📋 Error.response.status:', err.response?.status);
      console.error('📋 Error.response.data:', err.response?.data);
      console.error('📋 Error.message:', err.message);
      console.log('═══════════════════════════════════════════════════════');
      
      if (err.response?.status === 404) {
        setError('Plan de tratamiento no encontrado');
        console.error('❌ 404 - Plan no existe');
      } else if (err.response?.status === 403) {
        setError('No tiene permiso para ver este plan');
        console.error('❌ 403 - Sin permisos');
      } else {
        setError('Error al cargar los detalles del plan');
        console.error('❌ Error desconocido');
      }
    } finally {
      setCargando(false);
      console.log('⏳ Estado cargando: false');
      console.log('═══════════════════════════════════════════════════════');
    }
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'COMPLETADO':
        return { bg: '#d4edda', color: '#155724', border: '#c3e6cb' };
      case 'EN_PROGRESO':
        return { bg: '#d1ecf1', color: '#0c5460', border: '#bee5eb' };
      case 'PENDIENTE':
        return { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' };
      case 'CANCELADO':
        return { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' };
      default:
        return { bg: '#e2e3e5', color: '#383d41', border: '#d6d8db' };
    }
  };

  if (cargando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '60px 80px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <Activity size={40} strokeWidth={1.5} style={{ color: '#0d9488', margin: '0 auto 16px' }} className="animate-spin" />
          <p style={{ fontSize: '15px', color: '#64748b', fontWeight: '500' }}>Cargando detalles del plan...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div style={{ maxWidth: '1200px', margin: '32px auto', padding: '0 16px' }}>
        <div style={{
          backgroundColor: '#fee2e2',
          borderLeft: '3px solid #dc2626',
          borderRadius: '6px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
            <AlertCircle size={24} strokeWidth={1.5} style={{ color: '#991b1b', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#991b1b', fontWeight: '600', fontSize: '16px', margin: '0 0 8px 0' }}>Error</h3>
              <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>{error}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/paciente/planes')}
            style={{
              marginTop: '16px',
              padding: '10px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 150ms'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            Volver a Planes
          </button>
        </div>
      </div>
    );
  }

  const nombre = plan.titulo || plan.nombre || 'Plan sin nombre';
  const progreso = plan.porcentaje_completado ?? plan.progreso ?? 0;
  const totalItems = plan.cantidad_items ?? plan.items?.length ?? 0;
  const itemsCompletados = plan.items?.filter(i => i.estado === 'COMPLETADO').length ?? 0;
  const itemsEnProgreso = plan.items?.filter(i => i.estado === 'EN_PROGRESO').length ?? 0;
  const itemsPendientes = plan.items?.filter(i => i.estado === 'PENDIENTE').length ?? 0;
  const costoTotal = plan.precio_total_plan || plan.costo_total || '$0.00';
  const odontologoNombre = plan.odontologo_info?.nombre_completo || plan.odontologo_nombre || 'No especificado';
  const estadoBadge = getEstadoBadgeColor(plan.estado);

  console.log('═══════════════════════════════════════════════════════');
  console.log('🎨 [RENDER] Renderizando DetallePlan');
  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 Valores calculados para mostrar:');
  console.log('  • Nombre:', nombre);
  console.log('  • Progreso:', progreso);
  console.log('  • Items completados (calculado):', itemsCompletados);
  console.log('  • Items en progreso (calculado):', itemsEnProgreso);
  console.log('  • Items pendientes (calculado):', itemsPendientes);
  console.log('  • Total items:', totalItems);
  console.log('  • Costo total:', costoTotal);
  console.log('  • Estado:', plan.estado);
  console.log('  • Estado display:', plan.estado_display);
  console.log('  • Odontólogo:', odontologoNombre);
  console.log('───────────────────────────────────────────────────────');
  console.log('📋 Items disponibles para renderizar:');
  console.log('  • plan.items existe?:', !!plan.items);
  console.log('  • plan.items.length:', plan.items?.length || 0);
  console.log('═══════════════════════════════════════════════════════');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '24px 16px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <button
              onClick={() => navigate('/paciente/planes')}
              style={{
                color: '#64748b',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: 0,
                fontWeight: '500',
                transition: 'color 150ms'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#0d9488'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
            >
              <ArrowLeft size={16} strokeWidth={1.5} />
              Volver a Planes
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <FileText size={28} strokeWidth={1.5} style={{ color: '#0d9488' }} />
              <h1 style={{ margin: 0, fontSize: '28px', color: '#0f172a', fontWeight: '600' }}>
                {nombre}
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '15px' }}>
              <User size={16} strokeWidth={1.5} />
              Odontólogo: <span style={{ fontWeight: '500', color: '#0f172a' }}>{odontologoNombre}</span>
            </div>
          </div>
          <span style={{
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: plan.estado === 'COMPLETADO' ? '#d1fae5' : (plan.estado === 'EN_PROGRESO' ? '#dbeafe' : '#fef3c7'),
            color: plan.estado === 'COMPLETADO' ? '#065f46' : (plan.estado === 'EN_PROGRESO' ? '#1e40af' : '#92400e'),
            border: `1px solid ${plan.estado === 'COMPLETADO' ? '#a7f3d0' : (plan.estado === 'EN_PROGRESO' ? '#93c5fd' : '#fde68a')}`
          }}>
            {plan.estado_display || plan.estado}
          </span>
        </div>

        {/* Resumen General - Solo 3 tarjetas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '20px' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>Progreso</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea', marginTop: '8px' }}>
              {progreso}%
            </div>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              {itemsCompletados} de {totalItems} procedimientos
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '20px' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>Costo Total</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginTop: '8px' }}>
              {costoTotal}
            </div>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              Plan completo
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '20px' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>Total Procedimientos</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745', marginTop: '8px' }}>
              {totalItems}
            </div>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              En el plan
            </div>
          </div>
        </div>

        {/* Barra de Progreso Visual */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>
            Progreso del Tratamiento
          </h2>
          <div style={{ position: 'relative' }}>
            <div style={{ 
              height: '16px', 
              borderRadius: '8px', 
              backgroundColor: '#e0e0e0',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progreso}%`,
                height: '100%',
                backgroundColor: '#667eea',
                transition: 'width 0.5s ease'
              }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666', marginTop: '8px' }}>
              <span>Inicio</span>
              <span style={{ fontWeight: 'bold' }}>{progreso}% Completado</span>
              <span>Finalización</span>
            </div>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '16px', 
            marginTop: '16px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745' }}>{itemsCompletados}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Completados</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea' }}>
                {itemsEnProgreso}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>En Progreso</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffc107' }}>
                {itemsPendientes}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Pendientes</div>
            </div>
          </div>
        </div>

      {/* Descripción y Observaciones */}
      {(plan.descripcion || plan.observaciones_generales || plan.notas_internas) && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
          {plan.descripcion && (
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#555', marginBottom: '8px' }}>
                Descripción del Plan
              </h3>
              <p style={{ color: '#666', margin: 0, lineHeight: '1.6' }}>{plan.descripcion}</p>
            </div>
          )}
          {plan.observaciones_generales && (
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#555', marginBottom: '8px' }}>
                Observaciones
              </h3>
              <p style={{ color: '#666', margin: 0, lineHeight: '1.6' }}>
                {plan.observaciones_generales}
              </p>
            </div>
          )}
        </div>
      )}        {/* Lista de Procedimientos */}
        {plan.items && plan.items.length > 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', margin: 0 }}>
                Procedimientos del Plan ({plan.items.length})
              </h2>
            </div>
            <div>
              {plan.items.map((item, index) => {
                const itemBadge = getEstadoBadgeColor(item.estado);
                return (
                  <div
                    key={item.id}
                    style={{
                      padding: '24px',
                      borderBottom: index < plan.items!.length - 1 ? '1px solid #e0e0e0' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'start', gap: '16px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#e3f2fd',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#667eea' }}>
                          {item.orden}
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', margin: '0 0 8px 0' }}>
                          {item.servicio_nombre}
                        </h3>
                        {item.notas && (
                          <p style={{ fontSize: '14px', color: '#666', margin: '0 0 8px 0' }}>
                            {item.notas}
                          </p>
                        )}
                        {item.fecha_realizada && (
                          <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                            📅 Realizado: {new Date(item.fecha_realizada).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                        {item.fecha_estimada && !item.fecha_realizada && (
                          <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                            📅 Estimado: {new Date(item.fecha_estimada).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          padding: '6px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          marginBottom: '8px',
                          backgroundColor: itemBadge.bg,
                          color: itemBadge.color,
                          border: `1px solid ${itemBadge.border}`
                        }}>
                          {item.estado_display}
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                          {item.precio_total_formateado || `$${item.precio_total}`}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Fechas del Tratamiento */}
        {(plan.fecha_creacion || plan.fecha_inicio || plan.fecha_finalizacion) && (
          <div style={{
            backgroundColor: '#e3f2fd',
            border: '1px solid #90caf9',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1565c0', marginBottom: '16px' }}>
              📅 Cronología del Tratamiento
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              fontSize: '14px'
            }}>
              {plan.fecha_creacion && (
                <div>
                  <span style={{ color: '#1976d2' }}>Fecha de Creación:</span>
                  <div style={{ fontWeight: 'bold', color: '#0d47a1', marginTop: '4px' }}>
                    {new Date(plan.fecha_creacion).toLocaleDateString('es-ES')}
                  </div>
                </div>
              )}
              {plan.fecha_inicio && (
                <div>
                  <span style={{ color: '#1976d2' }}>Fecha de Inicio:</span>
                  <div style={{ fontWeight: 'bold', color: '#0d47a1', marginTop: '4px' }}>
                    {new Date(plan.fecha_inicio).toLocaleDateString('es-ES')}
                  </div>
                </div>
              )}
              {plan.fecha_finalizacion && (
                <div>
                  <span style={{ color: '#1976d2' }}>Finalización:</span>
                  <div style={{ fontWeight: 'bold', color: '#0d47a1', marginTop: '4px' }}>
                    {new Date(plan.fecha_finalizacion).toLocaleDateString('es-ES')}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Nota sobre Documentos y Facturas */}
        <div style={{
          backgroundColor: '#fff3e0',
          border: '1px solid #ffb74d',
          borderRadius: '12px',
          padding: '16px',
          marginTop: '24px'
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#e65100', lineHeight: '1.5' }}>
            ℹ️ <strong>Nota:</strong> Los documentos clínicos y facturas relacionadas se encuentran disponibles en sus respectivas secciones del portal.
          </p>
        </div>

      </div>

      {/* Estilos para animación */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
