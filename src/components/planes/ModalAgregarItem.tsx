import { useState, useEffect } from 'react';
import { obtenerServicios, calcularPrecioServicio, type Servicio } from '../../services/serviciosService';
import { crearItemPlan, type CrearItemPlanDTO } from '../../services/planesService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  planId: number;
  onItemAgregado: () => void;
}

type Step = 'seleccionar_servicio' | 'seleccionar_materiales' | 'confirmar';

export default function ModalAgregarItem({ isOpen, onClose, planId, onItemAgregado }: Props) {
  const [step, setStep] = useState<Step>('seleccionar_servicio');
  
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<Servicio | null>(null);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState<number | null>(null);
  const [notas, setNotas] = useState('');
  const [fechaEstimada, setFechaEstimada] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [buscandoServicios, setBuscandoServicios] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    if (isOpen) {
      cargarServicios();
      // Reset state
      setStep('seleccionar_servicio');
      setServicioSeleccionado(null);
      setInsumoSeleccionado(null);
      setNotas('');
      setFechaEstimada('');
      setBusqueda('');
    }
  }, [isOpen]);

  const cargarServicios = async () => {
    try {
      setBuscandoServicios(true);
      const data = await obtenerServicios({ activo: true });
      setServicios(data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
      alert('Error al cargar catálogo de servicios');
    } finally {
      setBuscandoServicios(false);
    }
  };

  const handleSeleccionarServicio = (servicio: Servicio) => {
    setServicioSeleccionado(servicio);
    setInsumoSeleccionado(null);
    
    // Si el servicio tiene materiales opcionales, ir al paso 2
    if (servicio.tiene_materiales_opcionales) {
      setStep('seleccionar_materiales');
    } else {
      // Si no tiene materiales opcionales, ir directo a confirmar
      setStep('confirmar');
    }
  };

  const handleAgregarItem = async () => {
    if (!servicioSeleccionado) return;

    // Validar que se seleccionó material si es obligatorio
    const tieneOpcionalesObligatorios = servicioSeleccionado.materiales_opcionales.some(
      mat => mat.es_obligatorio
    );
    
    if (tieneOpcionalesObligatorios && !insumoSeleccionado) {
      alert('Debes seleccionar un material para este servicio');
      return;
    }

    // Confirmación
    if (!confirm(`¿Agregar "${servicioSeleccionado.nombre}" al plan por Bs ${precioCalculado.toFixed(2)}?`)) {
      return;
    }

    try {
      setLoading(true);
      
      const datos: CrearItemPlanDTO = {
        plan: planId,
        servicio: servicioSeleccionado.id,
        insumo_seleccionado: insumoSeleccionado || undefined,
        notas: notas || undefined,
        fecha_estimada: fechaEstimada || undefined
      };

      console.log('📝 Creando ítem del plan:', datos);
      await crearItemPlan(datos);
      
      alert('✅ Servicio agregado al plan exitosamente');
      
      // Reset
      setServicioSeleccionado(null);
      setInsumoSeleccionado(null);
      setNotas('');
      setFechaEstimada('');
      setStep('seleccionar_servicio');
      
      onItemAgregado();
      onClose();
      
    } catch (error: any) {
      console.error('Error al agregar ítem:', error);
      alert('❌ Error al agregar servicio: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const precioCalculado = servicioSeleccionado
    ? calcularPrecioServicio(servicioSeleccionado, insumoSeleccionado || undefined)
    : 0;

  const serviciosFiltrados = servicios.filter(servicio =>
    servicio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    servicio.codigo_servicio.toLowerCase().includes(busqueda.toLowerCase()) ||
    servicio.categoria_nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (!isOpen) return null;

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
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          maxWidth: '1024px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          backgroundColor: '#3b82f6',
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
                ➕ Agregar Servicio al Plan
              </h2>
              <p style={{ color: '#dbeafe', fontSize: '14px', marginTop: '4px' }}>
                {step === 'seleccionar_servicio' && 'Paso 1: Selecciona un servicio'}
                {step === 'seleccionar_materiales' && 'Paso 2: Selecciona materiales'}
                {step === 'confirmar' && 'Paso 3: Confirmar y agregar'}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                color: 'white',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '24px',
                padding: '4px 8px'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#e5e7eb'}
              onMouseOut={(e) => e.currentTarget.style.color = 'white'}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {/* STEP 1: Seleccionar Servicio */}
          {step === 'seleccionar_servicio' && (
            <div>
              {/* Búsqueda */}
              <div style={{ marginBottom: '16px' }}>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="🔍 Buscar por nombre, código o categoría..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                />
              </div>

              {/* Lista de Servicios */}
              {buscandoServicios ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    border: '4px solid #e5e7eb',
                    borderTop: '4px solid #3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto'
                  }}></div>
                  <p style={{ color: '#6b7280', marginTop: '16px' }}>Cargando servicios...</p>
                </div>
              ) : serviciosFiltrados.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#6b7280' }}>
                  📭 No se encontraron servicios
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '16px',
                  maxHeight: '500px',
                  overflowY: 'auto'
                }}>
                  {serviciosFiltrados.map(servicio => (
                    <div
                      key={servicio.id}
                      onClick={() => handleSeleccionarServicio(servicio)}
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <h3 style={{ fontWeight: 'bold', color: '#111827', margin: 0, fontSize: '16px' }}>
                          {servicio.nombre}
                        </h3>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>{servicio.codigo_servicio}</span>
                      </div>
                      
                      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                        {servicio.categoria_nombre}
                      </p>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px', marginBottom: '12px' }}>
                        <div>
                          <span style={{ color: '#6b7280' }}>Honorarios:</span>
                          <span style={{ fontWeight: '600', marginLeft: '4px' }}>
                            Bs {parseFloat(servicio.precio_base).toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: '#6b7280' }}>Duración:</span>
                          <span style={{ fontWeight: '600', marginLeft: '4px' }}>{servicio.duracion_formateada}</span>
                        </div>
                      </div>

                      {/* Info de Materiales */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '12px', marginBottom: '12px' }}>
                        {servicio.materiales_fijos.length > 0 && (
                          <span style={{
                            backgroundColor: '#d1fae5',
                            color: '#065f46',
                            padding: '4px 8px',
                            borderRadius: '4px'
                          }}>
                            📦 {servicio.materiales_fijos.length} materiales incluidos
                          </span>
                        )}
                        {servicio.tiene_materiales_opcionales && (
                          <span style={{
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            padding: '4px 8px',
                            borderRadius: '4px'
                          }}>
                            🎨 Materiales opcionales
                          </span>
                        )}
                      </div>

                      {/* Precio Estimado */}
                      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', color: '#6b7280' }}>Precio desde:</span>
                          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a' }}>
                            Bs {(parseFloat(servicio.precio_base) + parseFloat(servicio.costo_materiales_fijos)).toFixed(2)}
                          </span>
                        </div>
                        {servicio.tiene_materiales_opcionales && (
                          <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                            * El precio final dependerá del material seleccionado
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2 & 3: Continúa en el siguiente comentario debido a límite de longitud */}
          {/* Por ahora implemento versión simplificada - el usuario puede expandir después */}
          
          {step === 'seleccionar_materiales' && servicioSeleccionado && (
            <div>
              <div style={{ backgroundColor: '#dbeafe', borderRadius: '8px', padding: '16px', marginBottom: '24px', border: '1px solid #93c5fd' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '18px', color: '#111827', marginBottom: '8px' }}>
                  {servicioSeleccionado.nombre}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
                  <div>
                    <span style={{ color: '#6b7280' }}>Honorarios:</span>
                    <span style={{ fontWeight: '600', marginLeft: '8px' }}>
                      Bs {parseFloat(servicioSeleccionado.precio_base).toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>Materiales fijos:</span>
                    <span style={{ fontWeight: '600', marginLeft: '8px' }}>
                      Bs {parseFloat(servicioSeleccionado.costo_materiales_fijos).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Materiales Opcionales */}
              {servicioSeleccionado.materiales_opcionales.map((materialOpcional, idx) => (
                <div key={idx} style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontWeight: '600', color: '#111827', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🎨 {materialOpcional.nombre_personalizado || `Seleccionar ${materialOpcional.categoria_insumo.nombre}`}
                    {materialOpcional.es_obligatorio && (
                      <span style={{ color: '#dc2626', fontSize: '14px' }}>*</span>
                    )}
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                    {materialOpcional.opciones_disponibles.map(insumo => (
                      <div
                        key={insumo.id}
                        onClick={() => setInsumoSeleccionado(insumo.id)}
                        style={{
                          border: insumoSeleccionado === insumo.id ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          backgroundColor: insumoSeleccionado === insumo.id ? '#eff6ff' : 'white'
                        }}
                        onMouseOver={(e) => {
                          if (insumoSeleccionado !== insumo.id) {
                            e.currentTarget.style.borderColor = '#93c5fd';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (insumoSeleccionado !== insumo.id) {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                          }
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                          <div style={{ flex: 1 }}>
                            <h5 style={{ fontWeight: '500', color: '#111827', margin: 0 }}>{insumo.nombre}</h5>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>{insumo.codigo}</p>
                          </div>
                          {insumoSeleccionado === insumo.id && (
                            <span style={{ color: '#3b82f6', fontSize: '20px' }}>✓</span>
                          )}
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                          <span style={{ fontSize: '14px', color: '#6b7280' }}>
                            Cantidad: {materialOpcional.cantidad}
                          </span>
                          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a' }}>
                            Bs {(parseFloat(insumo.precio_venta) * materialOpcional.cantidad).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Botones */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                <button
                  onClick={() => {
                    setStep('seleccionar_servicio');
                    setServicioSeleccionado(null);
                    setInsumoSeleccionado(null);
                  }}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #d1d5db',
                    color: '#374151',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  ← Volver
                </button>
                <button
                  onClick={() => setStep('confirmar')}
                  disabled={servicioSeleccionado.materiales_opcionales.some(m => m.es_obligatorio) && !insumoSeleccionado}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    opacity: (servicioSeleccionado.materiales_opcionales.some(m => m.es_obligatorio) && !insumoSeleccionado) ? 0.5 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!(servicioSeleccionado.materiales_opcionales.some(m => m.es_obligatorio) && !insumoSeleccionado)) {
                      e.currentTarget.style.backgroundColor = '#2563eb';
                    }
                  }}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirmar */}
          {step === 'confirmar' && servicioSeleccionado && (
            <div>
              {/* Resumen */}
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '24px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '20px', color: '#111827', marginBottom: '16px' }}>
                  📋 Resumen del Servicio
                </h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid #d1d5db' }}>
                    <span style={{ color: '#374151' }}>Servicio:</span>
                    <span style={{ fontWeight: '600', color: '#111827' }}>{servicioSeleccionado.nombre}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', fontSize: '14px' }}>
                    <span style={{ color: '#6b7280' }}>Honorarios profesionales:</span>
                    <span style={{ fontFamily: 'monospace' }}>Bs {parseFloat(servicioSeleccionado.precio_base).toFixed(2)}</span>
                  </div>
                  
                  {parseFloat(servicioSeleccionado.costo_materiales_fijos) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', fontSize: '14px' }}>
                      <span style={{ color: '#6b7280' }}>Materiales incluidos:</span>
                      <span style={{ fontFamily: 'monospace' }}>Bs {parseFloat(servicioSeleccionado.costo_materiales_fijos).toFixed(2)}</span>
                    </div>
                  )}
                  
                  {insumoSeleccionado && (() => {
                    const material = servicioSeleccionado.materiales_opcionales[0];
                    const insumo = material?.opciones_disponibles.find(i => i.id === insumoSeleccionado);
                    return insumo && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', fontSize: '14px' }}>
                        <span style={{ color: '#6b7280' }}>Material seleccionado:</span>
                        <span style={{ fontFamily: 'monospace' }}>
                          Bs {(parseFloat(insumo.precio_venta) * material.cantidad).toFixed(2)}
                        </span>
                      </div>
                    );
                  })()}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '2px solid #6b7280', marginTop: '8px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>TOTAL:</span>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
                      Bs {precioCalculado.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div style={{ backgroundColor: '#dbeafe', padding: '12px', borderRadius: '6px', border: '1px solid #93c5fd', marginTop: '16px' }}>
                  <p style={{ fontSize: '12px', color: '#1e40af', margin: 0 }}>
                    ℹ️ Este precio se "congelará" al agregar el ítem. Cambios futuros en el catálogo no afectarán este presupuesto.
                  </p>
                </div>
              </div>

              {/* Notas y Fecha */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Notas (Opcional)
                  </label>
                  <textarea
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    placeholder="Notas adicionales sobre este procedimiento..."
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Fecha Estimada (Opcional)
                  </label>
                  <input
                    type="date"
                    value={fechaEstimada}
                    onChange={(e) => setFechaEstimada(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                  />
                </div>
              </div>

              {/* Botones */}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => {
                    if (servicioSeleccionado.tiene_materiales_opcionales) {
                      setStep('seleccionar_materiales');
                    } else {
                      setStep('seleccionar_servicio');
                      setServicioSeleccionado(null);
                    }
                  }}
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #d1d5db',
                    color: '#374151',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    opacity: loading ? 0.5 : 1
                  }}
                  onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#f9fafb')}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  ← Volver
                </button>
                <button
                  onClick={handleAgregarItem}
                  disabled={loading}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#16a34a',
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
                  onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#15803d')}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid white',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Agregando...
                    </>
                  ) : (
                    '✅ Agregar al Plan'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

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
