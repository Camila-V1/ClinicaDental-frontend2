import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  obtenerPlan,
  presentarPlan,
  aceptarPlan,
  rechazarPlan,
  cancelarPlan,
  eliminarItemPlan,
  completarItemManual,
  type PlanDeTratamiento,
  type ItemPlanTratamiento
} from '../../services/planesService';
import ModalAgregarItem from '../../components/planes/ModalAgregarItem';
import ModalEditarItem from '../../components/planes/ModalEditarItem';

export default function PlanDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [plan, setPlan] = useState<PlanDeTratamiento | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [itemAEditar, setItemAEditar] = useState<ItemPlanTratamiento | null>(null);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    if (id) {
      cargarPlan();
    }
  }, [id]);

  const cargarPlan = async () => {
    try {
      setLoading(true);
      const data = await obtenerPlan(Number(id));
      setPlan(data);
    } catch (error) {
      console.error('Error al cargar plan:', error);
      alert('Error al cargar plan de tratamiento');
      navigate('/odontologo/planes');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // ACCIONES DEL PLAN
  // ============================================================================

  const handlePresentarPlan = async () => {
    if (!plan) return;
    
    if (plan.cantidad_items === 0) {
      alert('⚠️ No puedes presentar un plan sin servicios. Agrega al menos un servicio.');
      return;
    }
    
    if (!confirm(`¿Presentar plan "${plan.titulo}" al paciente?\n\nEl plan quedará como PRESENTADO y podrás compartirlo con el paciente.`)) {
      return;
    }

    try {
      setProcesando(true);
      const planActualizado = await presentarPlan(plan.id);
      setPlan(planActualizado);
      alert('✅ Plan presentado exitosamente');
    } catch (error: any) {
      console.error('Error al presentar plan:', error);
      alert('❌ Error al presentar plan: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcesando(false);
    }
  };

  const handleAceptarPlan = async () => {
    if (!plan) return;
    
    if (!confirm(`¿Marcar plan "${plan.titulo}" como ACEPTADO?\n\n⚠️ Una vez aceptado:\n- No podrás editar los ítems\n- Se podrán vincular episodios\n- El presupuesto queda CONGELADO`)) {
      return;
    }

    try {
      setProcesando(true);
      const planActualizado = await aceptarPlan(plan.id);
      setPlan(planActualizado);
      alert('✅ Plan aceptado. Ya puedes vincular episodios de atención.');
    } catch (error: any) {
      console.error('Error al aceptar plan:', error);
      alert('❌ Error al aceptar plan: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcesando(false);
    }
  };

  const handleRechazarPlan = async () => {
    if (!plan) return;
    
    const motivo = prompt('¿Por qué se rechaza el plan? (Opcional)');
    
    if (motivo === null) return; // Canceló
    
    try {
      setProcesando(true);
      const planActualizado = await rechazarPlan(plan.id, motivo);
      setPlan(planActualizado);
      alert('❌ Plan marcado como RECHAZADO');
    } catch (error: any) {
      console.error('Error al rechazar plan:', error);
      alert('❌ Error al rechazar plan: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcesando(false);
    }
  };

  const handleCancelarPlan = async () => {
    if (!plan) return;
    
    const motivo = prompt('¿Por qué se cancela el plan?');
    
    if (!motivo) {
      alert('Debes indicar un motivo de cancelación');
      return;
    }
    
    if (!confirm(`⚠️ ¿CANCELAR plan "${plan.titulo}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }
    
    try {
      setProcesando(true);
      const planActualizado = await cancelarPlan(plan.id, motivo);
      setPlan(planActualizado);
      alert('🚫 Plan cancelado');
    } catch (error: any) {
      console.error('Error al cancelar plan:', error);
      alert('❌ Error al cancelar plan: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcesando(false);
    }
  };

  // ============================================================================
  // ACCIONES DE ÍTEMS
  // ============================================================================

  const handleEliminarItem = async (item: ItemPlanTratamiento) => {
    if (!plan) return;
    
    if (item.estado !== 'PENDIENTE') {
      alert('⚠️ Solo puedes eliminar ítems en estado PENDIENTE');
      return;
    }
    
    if (!confirm(`¿Eliminar servicio "${item.servicio_nombre}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setProcesando(true);
      await eliminarItemPlan(item.id);
      await cargarPlan(); // Recargar plan completo
      alert('🗑️ Servicio eliminado del plan');
    } catch (error: any) {
      console.error('Error al eliminar ítem:', error);
      alert('❌ Error al eliminar ítem: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcesando(false);
    }
  };

  const handleCompletarItem = async (item: ItemPlanTratamiento) => {
    if (!plan) return;
    
    if (!confirm(`¿Marcar "${item.servicio_nombre}" como COMPLETADO?\n\nUsa esta opción solo si el servicio se realizó sin registrar un episodio de atención.`)) {
      return;
    }

    try {
      setProcesando(true);
      await completarItemManual(item.id);
      await cargarPlan();
      alert('✅ Ítem marcado como completado');
    } catch (error: any) {
      console.error('Error al completar ítem:', error);
      alert('❌ Error al completar ítem: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcesando(false);
    }
  };

  const handleEditarItem = (item: ItemPlanTratamiento) => {
    setItemAEditar(item);
    setModalEditarAbierto(true);
  };

  // ============================================================================
  // UTILIDADES
  // ============================================================================

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'PROPUESTO': return { bg: '#f3f4f6', text: '#374151' };
      case 'PRESENTADO': return { bg: '#dbeafe', text: '#1e40af' };
      case 'ACEPTADO': return { bg: '#d1fae5', text: '#065f46' };
      case 'EN_PROGRESO': return { bg: '#fef3c7', text: '#92400e' };
      case 'COMPLETADO': return { bg: '#e9d5ff', text: '#6b21a8' };
      case 'RECHAZADO': return { bg: '#fee2e2', text: '#991b1b' };
      case 'CANCELADO': return { bg: '#fee2e2', text: '#991b1b' };
      case 'PENDIENTE': return { bg: '#f3f4f6', text: '#374151' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading || !plan) {
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

  const estadoPlan = obtenerColorEstado(plan.estado);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => navigate('/odontologo/planes')}
          style={{
            color: '#3b82f6',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = '#2563eb'}
          onMouseOut={(e) => e.currentTarget.style.color = '#3b82f6'}
        >
          ← Volver a Planes
        </button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                {plan.titulo}
              </h1>
              <span style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: estadoPlan.bg,
                color: estadoPlan.text
              }}>
                {plan.estado_display}
              </span>
            </div>
            <p style={{ color: '#6b7280', marginTop: '4px' }}>
              👤 {plan.paciente_info.nombre_completo}
            </p>
            <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>
              Creado: {new Date(plan.fecha_creacion).toLocaleDateString('es-ES', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </p>
          </div>
          
          {/* Botones de Acción */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {plan.puede_ser_editado && (
              <button
                onClick={() => setModalAgregarAbierto(true)}
                disabled={procesando}
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
                  fontSize: '16px',
                  opacity: procesando ? 0.5 : 1
                }}
                onMouseOver={(e) => !procesando && (e.currentTarget.style.backgroundColor = '#2563eb')}
                onMouseOut={(e) => !procesando && (e.currentTarget.style.backgroundColor = '#3b82f6')}
              >
                ➕ Agregar Servicio
              </button>
            )}
            
            {plan.estado === 'PROPUESTO' && (
              <button
                onClick={handlePresentarPlan}
                disabled={procesando || plan.cantidad_items === 0}
                style={{
                  backgroundColor: '#9333ea',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: plan.cantidad_items === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '500',
                  opacity: procesando || plan.cantidad_items === 0 ? 0.5 : 1
                }}
                onMouseOver={(e) => plan.cantidad_items > 0 && !procesando && (e.currentTarget.style.backgroundColor = '#7e22ce')}
                onMouseOut={(e) => plan.cantidad_items > 0 && !procesando && (e.currentTarget.style.backgroundColor = '#9333ea')}
              >
                📋 Presentar Plan
              </button>
            )}
            
            {plan.estado === 'PRESENTADO' && (
              <>
                <button
                  onClick={handleAceptarPlan}
                  disabled={procesando}
                  style={{
                    backgroundColor: '#16a34a',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: '500',
                    opacity: procesando ? 0.5 : 1
                  }}
                  onMouseOver={(e) => !procesando && (e.currentTarget.style.backgroundColor = '#15803d')}
                  onMouseOut={(e) => !procesando && (e.currentTarget.style.backgroundColor = '#16a34a')}
                >
                  ✔️ Aceptar Plan
                </button>
                <button
                  onClick={handleRechazarPlan}
                  disabled={procesando}
                  style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: procesando ? 0.5 : 1
                  }}
                  onMouseOver={(e) => !procesando && (e.currentTarget.style.backgroundColor = '#b91c1c')}
                  onMouseOut={(e) => !procesando && (e.currentTarget.style.backgroundColor = '#dc2626')}
                >
                  ✖️ Rechazar
                </button>
              </>
            )}
            
            {(plan.estado === 'PROPUESTO' || plan.estado === 'PRESENTADO') && (
              <button
                onClick={handleRechazarPlan}
                disabled={procesando}
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: procesando ? 0.5 : 1,
                  display: plan.estado === 'PRESENTADO' ? 'none' : 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => !procesando && (e.currentTarget.style.backgroundColor = '#b91c1c')}
                onMouseOut={(e) => !procesando && (e.currentTarget.style.backgroundColor = '#dc2626')}
              >
                ✖️ Rechazar
              </button>
            )}
            
            {(plan.estado === 'ACEPTADO' || plan.estado === 'EN_PROGRESO') && (
              <button
                onClick={handleCancelarPlan}
                disabled={procesando}
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: procesando ? 0.5 : 1
                }}
                onMouseOver={(e) => !procesando && (e.currentTarget.style.backgroundColor = '#b91c1c')}
                onMouseOut={(e) => !procesando && (e.currentTarget.style.backgroundColor = '#dc2626')}
              >
                🚫 Cancelar Plan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Observaciones */}
      {plan.notas_internas && (
        <div style={{ 
          backgroundColor: '#fef3c7', 
          borderLeft: '4px solid #f59e0b', 
          padding: '16px', 
          marginBottom: '24px',
          borderRadius: '4px'
        }}>
          <p style={{ fontSize: '14px', color: '#92400e', margin: 0 }}>
            <strong>📝 Notas Internas:</strong> {plan.notas_internas}
          </p>
        </div>
      )}

      {/* Precio Total */}
      <div style={{
        background: 'linear-gradient(to right, #16a34a, #15803d)',
        color: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <p style={{ color: '#d1fae5', fontSize: '14px', margin: 0 }}>Precio Total del Plan</p>
            <p style={{ fontSize: '48px', fontWeight: 'bold', margin: '8px 0 0 0' }}>
              Bs {parseFloat(plan.precio_total_plan).toFixed(2)}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#d1fae5', fontSize: '14px', margin: 0 }}>Progreso</p>
            <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '8px 0 0 0' }}>
              {plan.porcentaje_completado}%
            </p>
            <div style={{ width: '200px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '9999px', height: '8px', marginTop: '8px' }}>
              <div style={{
                backgroundColor: 'white',
                height: '8px',
                borderRadius: '9999px',
                width: `${plan.porcentaje_completado}%`,
                transition: 'width 0.3s'
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Información del Plan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
            Estado
          </p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px', color: '#111827' }}>
            {plan.estado_display}
          </p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
            Prioridad
          </p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px', color: '#111827' }}>
            {plan.prioridad_display}
          </p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
            Procedimientos
          </p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px', color: '#111827' }}>
            {plan.cantidad_items}
          </p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
            Fecha Creación
          </p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px', color: '#111827' }}>
            {new Date(plan.fecha_creacion).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
          </p>
        </div>
      </div>

      {/* Lista de Ítems */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px', border: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
          📋 Servicios del Plan ({plan.cantidad_items})
        </h2>
        
        {plan.items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#6b7280' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>Aún no hay servicios en este plan</p>
            <p style={{ fontSize: '14px', marginBottom: '16px' }}>Agrega servicios para comenzar a construir el plan de tratamiento</p>
            {plan.puede_ser_editado && (
              <button
                onClick={() => setModalAgregarAbierto(true)}
                style={{
                  color: '#3b82f6',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  textDecoration: 'underline',
                  fontSize: '16px'
                }}
              >
                ➕ Agregar primer servicio
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {plan.items.map((item, index) => {
              const colorEstado = obtenerColorEstado(item.estado);
              
              return (
                <div 
                  key={item.id} 
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                    transition: 'border-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#93c5fd'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    {/* Info del Ítem */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ 
                          fontSize: '14px', 
                          fontWeight: 'bold', 
                          color: '#6b7280',
                          backgroundColor: '#f3f4f6',
                          padding: '4px 8px',
                          borderRadius: '4px'
                        }}>
                          #{index + 1}
                        </span>
                        <h3 style={{ fontWeight: 'bold', color: '#111827', margin: 0, fontSize: '16px' }}>
                          {item.servicio_nombre}
                        </h3>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: colorEstado.bg,
                          color: colorEstado.text
                        }}>
                          {item.estado_display}
                        </span>
                      </div>
                      
                      {item.insumo_nombre && (
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', margin: '8px 0' }}>
                          🎨 Material: <strong>{item.insumo_nombre}</strong>
                        </p>
                      )}
                      
                      {item.notas && (
                        <p style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic', margin: '8px 0' }}>
                          📝 {item.notas}
                        </p>
                      )}
                      
                      {item.fecha_estimada && (
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0' }}>
                          📅 Fecha estimada: {new Date(item.fecha_estimada).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                    
                    {/* Precio y Acciones */}
                    <div style={{ textAlign: 'right', marginLeft: '16px' }}>
                      <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a', margin: '0 0 12px 0' }}>
                        {item.precio_total_formateado}
                      </p>
                      
                      <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '12px' }}>
                        <p style={{ margin: '2px 0' }}>Honorarios: Bs {parseFloat(item.precio_servicio_snapshot).toFixed(2)}</p>
                        {parseFloat(item.precio_materiales_fijos_snapshot) > 0 && (
                          <p style={{ margin: '2px 0' }}>Materiales fijos: Bs {parseFloat(item.precio_materiales_fijos_snapshot).toFixed(2)}</p>
                        )}
                        {item.insumo_nombre && parseFloat(item.precio_insumo_seleccionado_snapshot) > 0 && (
                          <p style={{ margin: '2px 0' }}>Material: Bs {parseFloat(item.precio_insumo_seleccionado_snapshot).toFixed(2)}</p>
                        )}
                      </div>
                      
                      {/* Botones de Acción */}
                      {plan.puede_ser_editado && item.estado === 'PENDIENTE' && (
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleEditarItem(item)}
                            style={{
                              color: '#3b82f6',
                              backgroundColor: 'white',
                              border: '1px solid #3b82f6',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                            title="Editar ítem"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleEliminarItem(item)}
                            style={{
                              color: '#dc2626',
                              backgroundColor: 'white',
                              border: '1px solid #dc2626',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                            title="Eliminar ítem"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      )}
                      
                      {plan.estado === 'EN_PROGRESO' && item.estado === 'EN_PROGRESO' && (
                        <button
                          onClick={() => handleCompletarItem(item)}
                          disabled={procesando}
                          style={{
                            color: '#16a34a',
                            backgroundColor: 'white',
                            border: '1px solid #16a34a',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            opacity: procesando ? 0.5 : 1
                          }}
                          onMouseOver={(e) => !procesando && (e.currentTarget.style.backgroundColor = '#f0fdf4')}
                          onMouseOut={(e) => !procesando && (e.currentTarget.style.backgroundColor = 'white')}
                        >
                          ✅ Completar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Información Adicional */}
      <div style={{ 
        marginTop: '24px', 
        backgroundColor: '#eff6ff', 
        borderRadius: '8px', 
        padding: '16px', 
        border: '1px solid #bfdbfe' 
      }}>
        <h3 style={{ fontWeight: '600', color: '#1e40af', marginBottom: '8px', fontSize: '16px' }}>
          ℹ️ Información del Plan
        </h3>
        <ul style={{ fontSize: '14px', color: '#1e3a8a', margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
          {plan.estado === 'PROPUESTO' && (
            <>
              <li>Puedes agregar, editar y eliminar servicios mientras el plan esté en estado PROPUESTO</li>
              <li>Presenta el plan al paciente cuando esté listo</li>
            </>
          )}
          {plan.estado === 'PRESENTADO' && (
            <>
              <li>El plan ha sido presentado al paciente</li>
              <li>Marca como ACEPTADO cuando el paciente confirme, o RECHAZADO si no acepta</li>
            </>
          )}
          {plan.estado === 'ACEPTADO' && (
            <>
              <li>El plan ha sido aceptado por el paciente - presupuesto CONGELADO</li>
              <li>Ya puedes vincular episodios de atención desde la agenda</li>
              <li>El plan pasará automáticamente a EN_PROGRESO cuando se cree el primer episodio</li>
            </>
          )}
          {plan.estado === 'EN_PROGRESO' && (
            <>
              <li>Tratamiento en curso - {plan.porcentaje_completado}% completado</li>
              <li>Los ítems se completarán automáticamente al vincular episodios</li>
              <li>El plan se completará automáticamente cuando todos los ítems estén completados</li>
            </>
          )}
          {plan.estado === 'COMPLETADO' && (
            <li>✅ Tratamiento finalizado exitosamente{plan.fecha_finalizacion ? ` el ${new Date(plan.fecha_finalizacion).toLocaleDateString('es-ES')}` : ''}</li>
          )}
          {plan.estado === 'RECHAZADO' && (
            <li>❌ Plan rechazado por el paciente</li>
          )}
          {plan.estado === 'CANCELADO' && (
            <li>🚫 Plan cancelado</li>
          )}
        </ul>
      </div>

      {/* Modales */}
      <ModalAgregarItem
        isOpen={modalAgregarAbierto}
        onClose={() => setModalAgregarAbierto(false)}
        planId={plan.id}
        onItemAgregado={cargarPlan}
      />
      
      {itemAEditar && (
        <ModalEditarItem
          isOpen={modalEditarAbierto}
          onClose={() => {
            setModalEditarAbierto(false);
            setItemAEditar(null);
          }}
          item={itemAEditar}
          onItemActualizado={cargarPlan}
        />
      )}
    </div>
  );
}
