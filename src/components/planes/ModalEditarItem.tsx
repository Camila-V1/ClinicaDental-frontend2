import { useState, useEffect } from 'react';
import { actualizarItemPlan, type ItemPlanTratamiento, type CrearItemPlanDTO } from '../../services/planesService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: ItemPlanTratamiento;
  onItemActualizado: () => void;
}

export default function ModalEditarItem({ isOpen, onClose, item, onItemActualizado }: Props) {
  const [notas, setNotas] = useState(item.notas || '');
  const [fechaEstimada, setFechaEstimada] = useState(
    item.fecha_estimada ? item.fecha_estimada.split('T')[0] : ''
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNotas(item.notas || '');
      setFechaEstimada(item.fecha_estimada ? item.fecha_estimada.split('T')[0] : '');
    }
  }, [isOpen, item]);

  const handleActualizar = async () => {
    try {
      setLoading(true);
      
      const datos: Partial<CrearItemPlanDTO> = {
        notas: notas || undefined,
        fecha_estimada: fechaEstimada || undefined
      };

      await actualizarItemPlan(item.id, datos);
      
      alert('✅ Ítem actualizado exitosamente');
      onItemActualizado();
      onClose();
      
    } catch (error: any) {
      console.error('Error al actualizar ítem:', error);
      alert('❌ Error al actualizar ítem: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        maxWidth: '800px',
        width: '100%'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '24px',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>✏️ Editar Servicio</h2>
            <button
              onClick={onClose}
              style={{
                color: 'white',
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                lineHeight: 1
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
          {/* Info del Servicio */}
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '18px', color: '#111827', marginBottom: '8px' }}>
              {item.servicio_nombre}
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              fontSize: '14px'
            }}>
              <div>
                <span style={{ color: '#6b7280' }}>Precio Total:</span>
                <span style={{ fontWeight: '600', marginLeft: '8px' }}>{item.precio_total_formateado}</span>
              </div>
              {item.insumo_nombre && (
                <div>
                  <span style={{ color: '#6b7280' }}>Material:</span>
                  <span style={{ fontWeight: '600', marginLeft: '8px' }}>{item.insumo_nombre}</span>
                </div>
              )}
            </div>
          </div>

          {/* Formulario */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Notas
              </label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.outline = 'none';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="Notas adicionales sobre este procedimiento..."
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Fecha Estimada
              </label>
              <input
                type="date"
                value={fechaEstimada}
                onChange={(e) => setFechaEstimada(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.outline = 'none';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Info */}
          <div style={{
            marginTop: '24px',
            backgroundColor: '#fef3c7',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #fde047'
          }}>
            <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>
              ⚠️ No puedes cambiar el servicio ni el material seleccionado. Solo puedes editar notas y fecha estimada.
            </p>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <button
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '12px 24px',
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                color: '#374151',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                opacity: loading ? 0.5 : 1
              }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#f9fafb')}
              onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = 'white')}
            >
              Cancelar
            </button>
            <button
              onClick={handleActualizar}
              disabled={loading}
              style={{
                padding: '12px 32px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: loading ? 0.5 : 1
              }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2563eb')}
              onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#3b82f6')}
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
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                  Guardando...
                </>
              ) : (
                '💾 Guardar Cambios'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
