import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Activity, Calendar, DollarSign, User, AlertCircle, FileText } from 'lucide-react';
import { 
  obtenerPlanesPropuestos, 
  aprobarPlanPropuesto, 
  rechazarPlanPropuesto,
  type PlanDeTratamiento 
} from '../../services/planesService';

// ============================================================================
// TIPOS
// ============================================================================

interface ModalAprobarProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  planTitulo: string;
}

interface ModalRechazarProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
  planTitulo: string;
}

// ============================================================================
// MODAL APROBAR
// ============================================================================

const ModalAprobar: React.FC<ModalAprobarProps> = ({ isOpen, onClose, onConfirm, planTitulo }) => {
  console.log('🟢 ModalAprobar render:', { isOpen, planTitulo });
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          position: 'relative',
          zIndex: 10000
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <CheckCircle size={24} strokeWidth={1.5} style={{ color: '#10b981' }} />
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', margin: 0 }}>
            Confirmar Aprobación
          </h3>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <p style={{ color: '#475569', marginBottom: '12px', fontSize: '14px', lineHeight: '1.5' }}>
            ¿Está seguro de que desea aprobar el siguiente plan de tratamiento?
          </p>
          <div style={{ backgroundColor: '#d1fae5', border: '1px solid #10b981', borderRadius: '6px', padding: '12px', marginTop: '12px' }}>
            <p style={{ fontWeight: '500', color: '#065f46', margin: 0 }}>{planTitulo}</p>
          </div>
        </div>

        <div style={{ backgroundColor: '#dbeafe', borderLeft: '3px solid #3b82f6', padding: '12px 16px', marginBottom: '20px', borderRadius: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
            <AlertCircle size={16} strokeWidth={1.5} style={{ color: '#1e40af', marginTop: '2px', flexShrink: 0 }} />
            <p style={{ fontSize: '13px', color: '#1e40af', margin: 0, lineHeight: '1.5' }}>
              <strong>Nota:</strong> Al aprobar este plan, se iniciará el proceso de tratamiento 
              y se coordinará con el odontólogo para agendar las citas necesarias.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: 'white', 
              color: '#475569', 
              border: '1px solid #cbd5e1',
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
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
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#10b981', 
              color: 'white', 
              border: 'none',
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontWeight: '500',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 150ms'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
          >
            <CheckCircle size={16} strokeWidth={1.5} />
            Aprobar Plan
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MODAL RECHAZAR
// ============================================================================

const ModalRechazar: React.FC<ModalRechazarProps> = ({ isOpen, onClose, onConfirm, planTitulo }) => {
  console.log('🔴 ModalRechazar render:', { isOpen, planTitulo });
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!motivo.trim()) {
      setError('⚠️ Debe ingresar un motivo para el rechazo');
      return;
    }
    if (motivo.trim().length < 10) {
      setError('⚠️ El motivo debe tener al menos 10 caracteres');
      return;
    }
    onConfirm(motivo);
    setMotivo('');
    setError('');
  };

  const handleClose = () => {
    setMotivo('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={handleClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          position: 'relative',
          zIndex: 10000
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <XCircle size={24} strokeWidth={1.5} style={{ color: '#ef4444' }} />
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', margin: 0 }}>
            Rechazar Plan de Tratamiento
          </h3>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <p style={{ color: '#475569', marginBottom: '8px', fontSize: '14px' }}>
            Plan a rechazar:
          </p>
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #ef4444', borderRadius: '6px', padding: '12px' }}>
            <p style={{ fontWeight: '500', color: '#991b1b', margin: 0 }}>{planTitulo}</p>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '8px' }}>
            Motivo del rechazo <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <textarea
            value={motivo}
            onChange={(e) => {
              setMotivo(e.target.value);
              setError('');
            }}
            placeholder="Explique por qué rechaza este plan de tratamiento..."
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              border: '1px solid #cbd5e1', 
              borderRadius: '6px', 
              fontSize: '14px', 
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              resize: 'vertical'
            }}
            rows={4}
          />
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <AlertCircle size={14} strokeWidth={1.5} style={{ color: '#ef4444' }} />
              <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{error}</p>
            </div>
          )}
        </div>

        <div style={{ backgroundColor: '#fef3c7', borderLeft: '3px solid #f59e0b', padding: '12px 16px', marginBottom: '20px', borderRadius: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
            <AlertCircle size={16} strokeWidth={1.5} style={{ color: '#92400e', marginTop: '2px', flexShrink: 0 }} />
            <p style={{ fontSize: '13px', color: '#92400e', margin: 0, lineHeight: '1.5' }}>
              <strong>Importante:</strong> El odontólogo recibirá una notificación con su motivo 
              de rechazo y podrá proponerle un plan alternativo.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={handleClose}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: 'white', 
              color: '#475569', 
              border: '1px solid #cbd5e1',
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
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
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#ef4444', 
              color: 'white', 
              border: 'none',
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontWeight: '500',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 150ms'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
          >
            <XCircle size={16} strokeWidth={1.5} />
            Rechazar Plan
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const SolicitudesPlanes: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<PlanDeTratamiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAprobar, setModalAprobar] = useState<{ isOpen: boolean; plan: PlanDeTratamiento | null }>({
    isOpen: false,
    plan: null
  });
  const [modalRechazar, setModalRechazar] = useState<{ isOpen: boolean; plan: PlanDeTratamiento | null }>({
    isOpen: false,
    plan: null
  });

  // ============================================================================
  // EFECTOS
  // ============================================================================

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  useEffect(() => {
    console.log('🔵 modalAprobar cambió:', modalAprobar);
  }, [modalAprobar]);

  useEffect(() => {
    console.log('🔴 modalRechazar cambió:', modalRechazar);
  }, [modalRechazar]);

  // ============================================================================
  // FUNCIONES
  // ============================================================================

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      const data = await obtenerPlanesPropuestos('propuesto');
      setSolicitudes(data);
      
      // 🔍 LOGS DE DEBUGGING
      console.log('📋 Solicitudes cargadas:', data.length);
      if (data.length > 0) {
        console.log('📋 Primera solicitud:', data[0]);
        console.log('📋 Estado:', data[0].estado);
      }
    } catch (error: any) {
      console.error('❌ Error al cargar solicitudes:', error);
      alert('Error al cargar las solicitudes de planes');
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async () => {
    console.log('🟢 handleAprobar ejecutado, modalAprobar:', modalAprobar);
    if (!modalAprobar.plan) {
      console.error('❌ No hay plan en modalAprobar');
      return;
    }

    try {
      console.log('📤 Enviando aprobación al backend, planId:', modalAprobar.plan.id);
      await aprobarPlanPropuesto(modalAprobar.plan.id);
      alert('✅ Plan aprobado exitosamente');
      setModalAprobar({ isOpen: false, plan: null });
      cargarSolicitudes(); // Recargar lista
    } catch (err: any) {
      console.error('❌ Error al aprobar:', err);
      const errorMsg = err.response?.data?.error 
        || err.response?.data?.detail 
        || err.response?.data?.message
        || err.message
        || 'Error al aprobar el plan';
      alert('❌ ' + errorMsg);
    }
  };

  const handleRechazar = async (motivo: string) => {
    console.log('🔴 handleRechazar ejecutado, modalRechazar:', modalRechazar, 'motivo:', motivo);
    if (!modalRechazar.plan) {
      console.error('❌ No hay plan en modalRechazar');
      return;
    }

    // Validación adicional
    if (motivo.trim().length < 10) {
      alert('⚠️ El motivo debe tener al menos 10 caracteres');
      return;
    }

    try {
      console.log('📤 Enviando rechazo al backend, planId:', modalRechazar.plan.id, 'motivo:', motivo);
      await rechazarPlanPropuesto(modalRechazar.plan.id, motivo);
      alert('✅ Plan rechazado exitosamente');
      setModalRechazar({ isOpen: false, plan: null });
      cargarSolicitudes(); // Recargar lista
    } catch (err: any) {
      console.error('❌ Error al rechazar:', err);
      const errorMsg = err.response?.data?.error 
        || err.response?.data?.motivo?.[0] // Error de validación de campo
        || err.response?.data?.detail 
        || err.response?.data?.message
        || err.message
        || 'Error al rechazar el plan';
      alert('❌ ' + errorMsg);
    }
  };

  // ============================================================================
  // UTILIDADES
  // ============================================================================

  const getPrioridadColor = (prioridad?: string) => {
    if (!prioridad) return 'text-gray-600';
    switch (prioridad.toUpperCase()) {
      case 'ALTA': return 'text-red-600';
      case 'URGENTE': return 'text-red-800 font-bold';
      case 'MEDIA': return 'text-yellow-600';
      case 'BAJA': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '60px 80px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <Activity size={40} strokeWidth={1.5} style={{ color: '#0d9488', margin: '0 auto 16px' }} className="animate-spin" />
          <p style={{ fontSize: '15px', color: '#64748b', fontWeight: '500' }}>Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <FileText size={28} strokeWidth={1.5} style={{ color: '#0d9488' }} />
            <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#0f172a', margin: 0 }}>
              Solicitudes de Planes de Tratamiento
            </h1>
          </div>
          <p style={{ fontSize: '15px', color: '#64748b' }}>
            Revise y responda a las propuestas de tratamiento de su odontólogo
          </p>
        </div>

        {/* Lista de Solicitudes */}
        {solicitudes.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '60px 48px',
            textAlign: 'center'
          }}>
            <CheckCircle size={60} strokeWidth={1.5} style={{ color: '#10b981', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
              No hay solicitudes pendientes
            </h3>
            <p style={{ fontSize: '15px', color: '#64748b' }}>
              No tiene planes de tratamiento esperando su aprobación
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {solicitudes.map((solicitud) => (
              <div key={solicitud.id} style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                padding: '24px'
              }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <FileText size={22} strokeWidth={1.5} style={{ color: '#0d9488' }} />
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', margin: 0 }}>
                      {solicitud.titulo || solicitud.nombre || 'Plan de Tratamiento'}
                    </h3>
                  </div>
                    
                    <div style={{ display: 'flex', gap: '16px', fontSize: '14px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
                        <User size={16} strokeWidth={1.5} />
                        Dr. {solicitud.odontologo_info?.nombre_completo || solicitud.odontologo_nombre || 'Desconocido'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
                        <Calendar size={16} strokeWidth={1.5} />
                        {formatearFecha(solicitud.fecha_creacion)}
                      </span>
                      {solicitud.prioridad && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: solicitud.prioridad.toUpperCase() === 'ALTA' ? '#dc2626' : '#64748b' }}>
                          <AlertCircle size={16} strokeWidth={1.5} />
                          {solicitud.prioridad_display || solicitud.prioridad}
                        </span>
                      )}
                    </div>

                    {solicitud.descripcion && (
                      <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', marginBottom: '12px' }}>
                        {solicitud.descripcion}
                      </p>
                    )}

                    {/* Resumen del Plan */}
                    <div style={{ backgroundColor: '#f8fafc', borderRadius: '6px', padding: '16px', marginBottom: '16px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', fontSize: '14px' }}>
                        <div>
                          <span style={{ color: '#64748b' }}>Total de servicios:</span>
                          <p style={{ fontWeight: '600', color: '#0f172a', marginTop: '4px', margin: 0 }}>
                            {solicitud.cantidad_items || solicitud.total_items || 0} servicios
                          </p>
                        </div>
                        <div>
                          <span style={{ color: '#64748b' }}>Costo estimado:</span>
                          <p style={{ fontWeight: '600', color: '#0f172a', marginTop: '4px', margin: 0 }}>
                            Bs. {solicitud.precio_total_plan || solicitud.costo_total || '0.00'}
                          </p>
                        </div>
                        <div>
                          <span style={{ color: '#64748b' }}>Estado:</span>
                          <p style={{ fontWeight: '600', color: '#0d9488', marginTop: '4px', margin: 0 }}>
                            {solicitud.estado_display || solicitud.estado}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Observaciones */}
                    {(solicitud.observaciones || solicitud.observaciones_generales) && (
                      <div style={{ backgroundColor: '#dbeafe', borderLeft: '3px solid #3b82f6', padding: '12px', marginBottom: '16px', borderRadius: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                          <AlertCircle size={16} strokeWidth={1.5} style={{ color: '#1e40af', marginTop: '2px', flexShrink: 0 }} />
                          <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
                            <strong style={{ fontWeight: '600' }}>Observaciones:</strong> {solicitud.observaciones || solicitud.observaciones_generales}
                          </p>
                        </div>
                      </div>
                    )}
                </div>

                {/* Botones de Acción */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '16px' }}>
                  <button
                    onClick={() => {
                      console.log('🔴 Click en RECHAZAR, plan:', solicitud.id);
                      setModalRechazar({ isOpen: true, plan: solicitud });
                    }}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#fee2e2',
                      color: '#991b1b',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 150ms',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                  >
                    <XCircle size={16} strokeWidth={1.5} />
                    Rechazar
                  </button>
                  <button
                    onClick={() => {
                      console.log('🟢 Click en APROBAR, plan:', solicitud.id);
                      setModalAprobar({ isOpen: true, plan: solicitud });
                    }}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#0d9488',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 150ms',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f766e'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
                  >
                    <CheckCircle size={16} strokeWidth={1.5} />
                    Aprobar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Información Adicional */}
        <div style={{
          marginTop: '32px',
          backgroundColor: '#dbeafe',
          borderLeft: '3px solid #3b82f6',
          borderRadius: '6px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
            <AlertCircle size={20} strokeWidth={1.5} style={{ color: '#1e40af', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <h4 style={{ fontWeight: '600', color: '#1e3a8a', marginBottom: '8px', fontSize: '15px' }}>Información Importante</h4>
              <ul style={{ fontSize: '14px', color: '#1e40af', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
                <li>Al aprobar un plan, se iniciará el proceso de coordinación de citas</li>
                <li>Si rechaza un plan, debe indicar el motivo para que el odontólogo pueda ajustar la propuesta</li>
                <li>Puede ver los detalles completos del plan antes de tomar una decisión</li>
                <li>Si tiene dudas, puede contactar directamente con su odontólogo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ModalAprobar
        isOpen={modalAprobar.isOpen}
        onClose={() => setModalAprobar({ isOpen: false, plan: null })}
        onConfirm={handleAprobar}
        planTitulo={modalAprobar.plan?.titulo || modalAprobar.plan?.nombre || 'Plan de Tratamiento'}
      />
      
      <ModalRechazar
        isOpen={modalRechazar.isOpen}
        onClose={() => setModalRechazar({ isOpen: false, plan: null })}
        onConfirm={handleRechazar}
        planTitulo={modalRechazar.plan?.titulo || modalRechazar.plan?.nombre || 'Plan de Tratamiento'}
      />
    </div>
  );
};

export default SolicitudesPlanes;
