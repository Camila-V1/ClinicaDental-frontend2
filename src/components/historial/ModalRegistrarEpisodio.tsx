/**
 * 🩺 MODAL REGISTRAR EPISODIO DE ATENCIÓN - CON VINCULACIÓN A PLANES (GUÍA 18 + 20a)
 */

import { useState, useEffect } from 'react';
import { crearEpisodio, type CrearEpisodioDTO } from '../../services/historialService';
import { obtenerPlanesActivos, obtenerItemsDisponibles, type PlanDeTratamiento, type ItemPlanTratamiento } from '../../services/planesService';
import { obtenerServicios, type Servicio } from '../../services/serviciosService';
import { atenderCita, type ItemPlanInfo } from '../../services/agendaService';

/**
 * Componente: Información del Plan (Solo Lectura)
 * Se muestra cuando la cita está vinculada a un plan de tratamiento
 */
function PlanInfoReadOnly({ itemPlanInfo }: { itemPlanInfo: ItemPlanInfo }) {
  return (
    <div style={{
      backgroundColor: '#d1fae5',
      border: '2px solid #10b981',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        marginBottom: '12px'
      }}>
        <span style={{ fontSize: '20px' }}>✅</span>
        <strong style={{ color: '#065f46' }}>
          Cita Vinculada a Plan de Tratamiento
        </strong>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '12px'
      }}>
        {/* Plan */}
        <div>
          <label style={{ 
            fontSize: '12px', 
            color: '#065f46',
            fontWeight: '600',
            display: 'block',
            marginBottom: '4px'
          }}>
            📋 Plan de Tratamiento
          </label>
          <div style={{
            backgroundColor: 'white',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid #10b981',
            fontSize: '14px',
            color: '#111827'
          }}>
            {itemPlanInfo.plan_nombre}
          </div>
        </div>

        {/* Servicio */}
        <div>
          <label style={{ 
            fontSize: '12px', 
            color: '#065f46',
            fontWeight: '600',
            display: 'block',
            marginBottom: '4px'
          }}>
            🦷 Servicio del Plan
          </label>
          <div style={{
            backgroundColor: 'white',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid #10b981',
            fontSize: '14px',
            color: '#111827'
          }}>
            {itemPlanInfo.servicio_nombre}
          </div>
        </div>

        {/* Precio */}
        <div>
          <label style={{ 
            fontSize: '12px', 
            color: '#065f46',
            fontWeight: '600',
            display: 'block',
            marginBottom: '4px'
          }}>
            💰 Precio
          </label>
          <div style={{
            backgroundColor: 'white',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid #10b981',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#111827'
          }}>
            {itemPlanInfo.precio_total}
          </div>
        </div>

        {/* Estado */}
        <div>
          <label style={{ 
            fontSize: '12px', 
            color: '#065f46',
            fontWeight: '600',
            display: 'block',
            marginBottom: '4px'
          }}>
            📊 Estado
          </label>
          <div style={{
            backgroundColor: 'white',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid #10b981',
            fontSize: '14px',
            color: '#111827'
          }}>
            {itemPlanInfo.estado}
          </div>
        </div>
      </div>

      {/* Notas del plan */}
      {itemPlanInfo.notas && (
        <div style={{ marginTop: '12px' }}>
          <label style={{ 
            fontSize: '12px', 
            color: '#065f46',
            fontWeight: '600',
            display: 'block',
            marginBottom: '4px'
          }}>
            📝 Notas del Plan
          </label>
          <div style={{
            backgroundColor: 'white',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid #10b981',
            fontSize: '13px',
            color: '#6b7280',
            fontStyle: 'italic'
          }}>
            {itemPlanInfo.notas}
          </div>
        </div>
      )}

      <div style={{ 
        marginTop: '12px', 
        paddingTop: '12px', 
        borderTop: '1px solid #86efac',
        fontSize: '12px',
        color: '#065f46'
      }}>
        ℹ️ Este episodio se vinculará automáticamente al ítem del plan. No es necesario seleccionar servicio.
      </div>
    </div>
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pacienteId: number;
  pacienteNombre: string;
  motivoCita: string;
  onEpisodioCreado: () => void;
  
  // Información de la cita para pre-selección
  esCitaPlan: boolean;
  servicioId: number | null;
  itemPlanId: number | null;
  citaId?: number; // ID de la cita para marcarla como atendida después de registrar el episodio
  itemPlanInfo?: ItemPlanInfo | null; // Información completa del plan
}

export default function ModalRegistrarEpisodio({
  isOpen,
  onClose,
  pacienteId,
  pacienteNombre,
  motivoCita,
  onEpisodioCreado,
  esCitaPlan,
  servicioId,
  itemPlanId,
  citaId,
  itemPlanInfo
}: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    motivo_consulta: motivoCita,
    diagnostico: '',
    descripcion_procedimiento: '',
    notas_privadas: ''
  });

  // Estados para planes
  const [planesActivos, setPlanesActivos] = useState<PlanDeTratamiento[]>([]);
  const [cargandoPlanes, setCargandoPlanes] = useState(false);
  const [modoSeleccion, setModoSeleccion] = useState<'plan' | 'libre'>('libre');
  const [planSeleccionado, setPlanSeleccionado] = useState<PlanDeTratamiento | null>(null);
  const [itemSeleccionado, setItemSeleccionado] = useState<ItemPlanTratamiento | null>(null);

  // Estados para servicios (modo libre)
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<number | null>(null);

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      console.group('🔍 ANÁLISIS DE CITA (GUÍA 21)');
      console.log('es_cita_plan:', esCitaPlan);
      console.log('item_plan_id:', itemPlanId);
      console.log('item_plan_info:', itemPlanInfo);
      
      setFormData({
        motivo_consulta: motivoCita,
        diagnostico: '',
        descripcion_procedimiento: '',
        notas_privadas: ''
      });
      setLoading(false);
      setPlanSeleccionado(null);
      setItemSeleccionado(null);
      
      // ========================================
      // LÓGICA DE DETECCIÓN (GUÍA 21)
      // ========================================
      
      // CASO 1: Cita Simple (Normal)
      if (!esCitaPlan) {
        console.log('📌 TIPO: Cita Simple (normal)');
        console.log('→ Mostrar selectores editables');
        setModoSeleccion('libre');
        setPlanesActivos([]);
        setCargandoPlanes(false);
        
        // Cargar servicios primero, LUEGO pre-seleccionar
        cargarServicios().then(() => {
          if (servicioId) {
            console.log('🎯 Pre-seleccionando servicio:', servicioId);
            setServicioSeleccionado(servicioId);
          }
        });
      }
      
      // CASO 2: Plan Sin Info (Vincular Manual)
      else if (esCitaPlan && itemPlanId && !itemPlanInfo) {
        console.warn('⚠️ TIPO: Plan Sin Info (vincular manual)');
        console.log('→ Cargar planes y pre-seleccionar item');
        setModoSeleccion('plan');
        setServicioSeleccionado(null);
        // Cargar planes activos para selección manual
        cargarPlanesActivos();
        cargarServicios();
      }
      
      // CASO 3: Plan Completo ✅
      else if (esCitaPlan && itemPlanInfo) {
        console.log('✅ TIPO: Plan Completo (solo lectura)');
        console.log('→ Pre-llenar y mostrar info del plan');
        console.log('📋 Plan:', itemPlanInfo.plan_nombre);
        console.log('🦷 Servicio:', itemPlanInfo.servicio_nombre);
        console.log('💰 Precio:', itemPlanInfo.precio_total);
        console.log('📊 Estado:', itemPlanInfo.estado);
        
        setModoSeleccion('plan');
        setServicioSeleccionado(null);
        // NO cargar planes porque tenemos toda la info
        setPlanesActivos([]);
        setCargandoPlanes(false);
        // Cargar servicios por si acaso (aunque no se usarán)
        cargarServicios();
      }
      
      // CASO ERROR
      else {
        console.error('❌ TIPO: Configuración Inválida');
        console.error('→ es_cita_plan=true pero sin item_plan');
      }
      
      console.groupEnd();
    }
  }, [isOpen, motivoCita, pacienteId, esCitaPlan, servicioId, itemPlanId, itemPlanInfo]);

  // Ya no se usa cuando hay itemPlanInfo, pero se mantiene para citas sin vincular a plan
  const cargarPlanesActivos = async () => {
    try {
      setCargandoPlanes(true);
      const planes = await obtenerPlanesActivos(pacienteId);
      setPlanesActivos(planes);
      
      // Si hay planes activos, sugerir modo plan
      if (planes.length > 0) {
        setModoSeleccion('plan');
      }
    } catch (error) {
      console.error('Error al cargar planes activos:', error);
      setPlanesActivos([]);
    } finally {
      setCargandoPlanes(false);
    }
  };

  const cargarServicios = async (): Promise<void> => {
    try {
      const data = await obtenerServicios({ activo: true });
      console.log('📋 Servicios cargados:', data.length);
      setServicios(data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 handleSubmit llamado');
    
    if (!formData.motivo_consulta.trim()) {
      alert('El motivo de consulta es obligatorio');
      return;
    }

    // Validación: si NO hay itemPlanInfo (debe seleccionar manualmente)
    if (!itemPlanInfo) {
      if (modoSeleccion === 'plan' && !itemSeleccionado) {
        alert('Debes seleccionar un servicio del plan');
        return;
      }

      if (modoSeleccion === 'libre' && !servicioSeleccionado) {
        alert('Debes seleccionar un servicio');
        return;
      }
    }

    // Confirmación antes de enviar
    if (!confirm('¿Confirmar registro de este episodio de atención?')) {
      console.log('❌ Usuario canceló el registro');
      return;
    }

    try {
      setLoading(true);
      
      const datos: CrearEpisodioDTO = {
        historial_clinico: pacienteId,
        motivo_consulta: formData.motivo_consulta,
        diagnostico: formData.diagnostico || undefined,
        descripcion_procedimiento: formData.descripcion_procedimiento || undefined,
        notas_privadas: formData.notas_privadas || undefined,
        // 🎯 GUÍA 20a: Si hay itemPlanInfo, usar itemPlanId directamente
        item_plan_tratamiento: itemPlanInfo
          ? (itemPlanId ?? undefined)  // Usar el ID que viene de la cita
          : modoSeleccion === 'plan' && itemSeleccionado
            ? itemSeleccionado.id
            : undefined,
        // Si es episodio libre, vincular servicio directamente
        servicio: !itemPlanInfo && modoSeleccion === 'libre' && servicioSeleccionado
          ? servicioSeleccionado
          : undefined
      };

      console.log('📝 Creando episodio:', datos);
      await crearEpisodio(datos);
      
      // Marcar cita como atendida si viene de una cita
      if (citaId) {
        console.log('✅ Episodio creado, marcando cita como atendida:', citaId);
        await atenderCita(citaId);
      }
      
      alert('✅ Episodio registrado exitosamente');
      onEpisodioCreado();
      onClose();
      
    } catch (error: any) {
      console.error('Error al crear episodio:', error);
      alert('❌ Error al registrar episodio: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Solo obtener ítems disponibles si NO hay itemPlanInfo y hay plan seleccionado
  const itemsDisponibles = !itemPlanInfo && planSeleccionado ? obtenerItemsDisponibles(planSeleccionado) : [];

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          backgroundColor: '#3498db',
          color: 'white',
          padding: '20px 24px',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                🩺 Registrar Episodio de Atención
              </h2>
              <p style={{ color: '#e3f2fd', fontSize: '14px', marginTop: '4px' }}>
                Paciente: {pacienteNombre}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                lineHeight: 1
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          
          {/* Información del Plan (Solo Lectura) - cuando la cita está vinculada a un plan */}
          {esCitaPlan && itemPlanInfo && (
            <PlanInfoReadOnly itemPlanInfo={itemPlanInfo} />
          )}

          {/* Selector de Modo: Plan vs Libre - SOLO si NO hay itemPlanInfo */}
          {!itemPlanInfo && cargandoPlanes ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '24px', 
              marginBottom: '24px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px' 
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid #e5e7eb',
                borderTop: '3px solid #3498db',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }} />
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '12px' }}>
                Verificando planes activos...
              </p>
            </div>
          ) : planesActivos.length > 0 ? (
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                marginBottom: '12px'
              }}>
                📋 Tipo de Atención
              </label>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {/* Opción: Vincular a Plan */}
                <button
                  type="button"
                  onClick={() => {
                    setModoSeleccion('plan');
                    setServicioSeleccionado(null);
                  }}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: `2px solid ${modoSeleccion === 'plan' ? '#3498db' : '#ddd'}`,
                    backgroundColor: modoSeleccion === 'plan' ? '#eff6ff' : 'white',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                    <span style={{ fontSize: '28px' }}>📋</span>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '4px', fontSize: '16px' }}>
                        Parte del Plan de Tratamiento
                      </h3>
                      <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                        Vincular a un servicio del plan aceptado
                      </p>
                      <p style={{ fontSize: '12px', color: '#3498db', marginTop: '8px', fontWeight: '500' }}>
                        {planesActivos.length} plan{planesActivos.length !== 1 ? 'es' : ''} activo{planesActivos.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Opción: Episodio Libre */}
                <button
                  type="button"
                  onClick={() => {
                    setModoSeleccion('libre');
                    setPlanSeleccionado(null);
                    setItemSeleccionado(null);
                  }}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: `2px solid ${modoSeleccion === 'libre' ? '#16a34a' : '#ddd'}`,
                    backgroundColor: modoSeleccion === 'libre' ? '#f0fdf4' : 'white',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                    <span style={{ fontSize: '28px' }}>🆓</span>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '4px', fontSize: '16px' }}>
                        Atención Independiente
                      </h3>
                      <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                        No vinculado a ningún plan
                      </p>
                      <p style={{ fontSize: '12px', color: '#16a34a', marginTop: '8px', fontWeight: '500' }}>
                        Episodio libre
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ 
              marginBottom: '24px', 
              backgroundColor: '#eff6ff', 
              borderLeft: '4px solid #3498db', 
              padding: '16px', 
              borderRadius: '4px' 
            }}>
              <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
                ℹ️ Este paciente no tiene planes de tratamiento activos. El episodio se registrará como atención independiente.
              </p>
            </div>
          )}

          {/* Selector de Plan e Ítem (Modo Plan) - SOLO si NO hay itemPlanInfo */}
          {!itemPlanInfo && modoSeleccion === 'plan' && planesActivos.length > 0 && (
            <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Selector de Plan */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  Seleccionar Plan <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <select
                  value={planSeleccionado?.id || ''}
                  onChange={(e) => {
                    const plan = planesActivos.find(p => p.id === Number(e.target.value));
                    setPlanSeleccionado(plan || null);
                    setItemSeleccionado(null);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3498db'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                >
                  <option value="">-- Seleccionar plan --</option>
                  {planesActivos.map(plan => (
                    <option key={plan.id} value={plan.id}>
                      {plan.titulo} - {plan.estado_display} - {plan.porcentaje_completado}% completado
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector de Ítem */}
              {planSeleccionado && (
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    Seleccionar Servicio del Plan <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  
                  {itemsDisponibles.length === 0 ? (
                    <div style={{ 
                      backgroundColor: '#fef3c7', 
                      border: '1px solid #fde047', 
                      borderRadius: '8px', 
                      padding: '16px' 
                    }}>
                      <p style={{ fontSize: '14px', color: '#92400e', margin: 0 }}>
                        ⚠️ No hay servicios disponibles en este plan. Todos los ítems ya están completados.
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {itemsDisponibles.map(item => (
                        <div
                          key={item.id}
                          onClick={() => setItemSeleccionado(item)}
                          style={{
                            border: `2px solid ${itemSeleccionado?.id === item.id ? '#3498db' : '#e5e7eb'}`,
                            borderRadius: '8px',
                            padding: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            backgroundColor: itemSeleccionado?.id === item.id ? '#eff6ff' : 'white'
                          }}
                          onMouseOver={(e) => {
                            if (itemSeleccionado?.id !== item.id) {
                              e.currentTarget.style.borderColor = '#93c5fd';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (itemSeleccionado?.id !== item.id) {
                              e.currentTarget.style.borderColor = '#e5e7eb';
                            }
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <h4 style={{ fontWeight: 'bold', color: '#111827', margin: 0, fontSize: '15px' }}>
                                  {item.servicio_nombre}
                                </h4>
                                <span style={{ 
                                  padding: '2px 8px', 
                                  backgroundColor: '#fef3c7', 
                                  color: '#92400e', 
                                  fontSize: '11px', 
                                  borderRadius: '9999px',
                                  fontWeight: '500'
                                }}>
                                  {item.estado_display}
                                </span>
                              </div>
                              
                              {item.insumo_nombre && (
                                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px', margin: '4px 0' }}>
                                  🎨 Material: {item.insumo_nombre}
                                </p>
                              )}
                              
                              {item.notas && (
                                <p style={{ fontSize: '13px', color: '#6b7280', fontStyle: 'italic', margin: '4px 0' }}>
                                  📝 {item.notas}
                                </p>
                              )}
                            </div>
                            
                            <div style={{ textAlign: 'right', marginLeft: '16px' }}>
                              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a', margin: 0 }}>
                                {item.precio_total_formateado}
                              </p>
                              {itemSeleccionado?.id === item.id && (
                                <span style={{ color: '#3498db', fontSize: '24px' }}>✓</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Info sobre vinculación */}
              {itemSeleccionado && (
                <div style={{ 
                  backgroundColor: '#d1fae5', 
                  borderLeft: '4px solid #16a34a', 
                  padding: '12px', 
                  borderRadius: '4px' 
                }}>
                  <p style={{ fontSize: '13px', color: '#065f46', margin: 0 }}>
                    ✅ Al guardar, este episodio se vinculará al servicio "{itemSeleccionado.servicio_nombre}" del plan.
                    El progreso del plan se actualizará automáticamente.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Selector de Servicio (Modo Libre) - SOLO si NO hay itemPlanInfo */}
          {!itemPlanInfo && modoSeleccion === 'libre' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                marginBottom: '8px'
              }}>
                Servicio Realizado <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <select
                value={servicioSeleccionado || ''}
                onChange={(e) => setServicioSeleccionado(Number(e.target.value))}
                disabled={!!servicioId}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: servicioId ? '#f5f5f5' : 'white',
                  cursor: servicioId ? 'not-allowed' : 'default'
                }}
                onFocus={(e) => !servicioId && (e.currentTarget.style.borderColor = '#3498db')}
                onBlur={(e) => !servicioId && (e.currentTarget.style.borderColor = '#ddd')}
              >
                <option value="">-- Seleccionar servicio --</option>
                {servicios.map(servicio => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.nombre} - {servicio.categoria_nombre}
                  </option>
                ))}
              </select>
              
              {!!servicioId && (
                <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  ℹ️ Servicio pre-seleccionado automáticamente desde la cita.
                </p>
              )}
            </div>
          )}
          
          {/* Motivo de Consulta */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333',
              marginBottom: '8px'
            }}>
              Motivo de Consulta <span style={{ color: '#dc3545' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.motivo_consulta}
              readOnly
              disabled
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#f5f5f5',
                color: '#666',
                cursor: 'not-allowed'
              }}
            />
            <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Este campo proviene de la cita agendada y no puede modificarse
            </p>
          </div>

          {/* Diagnóstico */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333',
              marginBottom: '8px'
            }}>
              Diagnóstico
            </label>
            <textarea
              value={formData.diagnostico}
              onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value })}
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical'
              }}
              placeholder="Ej: Caries profunda pieza 16. Pulpitis irreversible."
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          {/* Descripción del Procedimiento */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333',
              marginBottom: '8px'
            }}>
              Descripción del Procedimiento
            </label>
            <textarea
              value={formData.descripcion_procedimiento}
              onChange={(e) => setFormData({ ...formData, descripcion_procedimiento: e.target.value })}
              rows={4}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical'
              }}
              placeholder="Ej: Se realizó limpieza de la cavidad, aplicación de ácido grabador, adhesivo y obturación con resina compuesta color A2..."
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          {/* Notas Privadas */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333',
              marginBottom: '8px'
            }}>
              Notas Privadas (Solo para el equipo médico)
            </label>
            <textarea
              value={formData.notas_privadas}
              onChange={(e) => setFormData({ ...formData, notas_privadas: e.target.value })}
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical'
              }}
              placeholder="Ej: Paciente cooperador. Recordar alergia a penicilina. Próximo control en 6 meses."
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '10px 20px',
                border: '1px solid #ddd',
                color: '#666',
                borderRadius: '8px',
                background: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                opacity: loading ? 0.5 : 1
              }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#3498db',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: loading ? 0.5 : 1
              }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2980b9')}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Guardando...
                </>
              ) : (
                '✅ Registrar Episodio'
              )}
            </button>
          </div>
        </form>

        {/* CSS para animación */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
