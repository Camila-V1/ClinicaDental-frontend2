/**
 * 🦷 DETALLE DIENTE - Modal con información completa de un diente
 */

import { useNavigate } from 'react-router-dom';
import { getIconoEstadoDiente, formatearFecha } from '../../services/historialService';

interface Props {
  diente: any;
  onCerrar: () => void;
}

export default function DetalleDiente({ diente, onCerrar }: Props) {
  const navigate = useNavigate();
  
  // Ordenar tratamientos por fecha (más reciente primero)
  const tratamientosOrdenados = [...diente.tratamientos].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header con gradiente */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '9999px',
                padding: '12px'
              }}>
                <span style={{ fontSize: '64px' }}>
                  {getIconoEstadoDiente(diente.estado)}
                </span>
              </div>
              <div>
                <h2 style={{ fontSize: '30px', fontWeight: 'bold', margin: 0 }}>
                  Diente #{diente.numero}
                </h2>
                <p style={{ 
                  color: '#DBEAFE', 
                  marginTop: '8px', 
                  fontSize: '18px',
                  margin: '8px 0'
                }}>
                  {diente.nombre}
                </p>
                <span style={{
                  display: 'inline-block',
                  marginTop: '12px',
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  fontSize: '14px',
                  fontWeight: '600',
                  backgroundColor: 'rgba(255,255,255,0.2)'
                }}>
                  Estado: {diente.estado}
                </span>
              </div>
            </div>
            <button
              onClick={onCerrar}
              style={{
                color: 'white',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '9999px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '30px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          
          {/* Tratamientos con Timeline */}
          {diente.tratamientos.length > 0 ? (
            <div>
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 text-xl">
                🔧 Historial de Tratamientos ({diente.tratamientos.length})
              </h3>
              
              {/* Timeline */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '24px',
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  backgroundColor: '#e5e7eb'
                }}></div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {tratamientosOrdenados.map((tratamiento: any, index: number) => (
                    <div key={index} style={{ position: 'relative', paddingLeft: '64px' }}>
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        width: '48px',
                        height: '48px',
                        backgroundColor: '#2563eb',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        fontSize: '16px'
                      }}>
                        {index + 1}
                      </div>
                      
                      <div style={{
                        background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)',
                        borderRadius: '12px',
                        padding: '20px',
                        borderLeft: '4px solid #3b82f6',
                        transition: 'box-shadow 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      >
                        <div style={{ marginBottom: '12px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            borderRadius: '9999px',
                            fontSize: '11px',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}>
                            {tratamiento.tipo}
                          </span>
                          <span style={{
                            marginLeft: '12px',
                            fontSize: '14px',
                            color: '#6b7280'
                          }}>
                            {formatearFecha(tratamiento.fecha)}
                          </span>
                        </div>
                        
                        <p style={{
                          color: '#111827',
                          marginBottom: '16px',
                          margin: '0 0 16px 0'
                        }}>
                          {tratamiento.descripcion}
                        </p>
                        
                        <button
                          onClick={() => {
                            onCerrar();
                            navigate(`/paciente/historial/episodio/${tratamiento.episodio_id}`);
                          }}
                          style={{
                            fontSize: '14px',
                            color: '#2563eb',
                            fontWeight: '500',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#1d4ed8';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#2563eb';
                          }}
                        >
                          Ver episodio completo →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <span className="text-6xl">✅</span>
              <h3 className="text-lg font-bold text-gray-800 mt-4">
                ¡Diente Sano!
              </h3>
              <p className="mt-2">No hay tratamientos registrados para este diente</p>
            </div>
          )}

          {/* Notas */}
          {diente.notas && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">📝 Notas:</h4>
              <p className="text-gray-700">{diente.notas}</p>
            </div>
          )}

        </div>

        {/* Footer con acciones */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3">
          <button
            onClick={onCerrar}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
          >
            Cerrar
          </button>
          <button
            onClick={() => navigate('/paciente/citas')}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            📅 Agendar Consulta
          </button>
        </div>

      </div>
    </div>
  );
}
