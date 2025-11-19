import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  formatearFecha,
  getTipoEpisodioColor,
  getTipoEpisodioIcono,
  getTipoDocumentoIcono,
  descargarDocumento
} from '../../services/historialService';

interface Props {
  episodio: any;
}

export default function EpisodioCard({ episodio }: Props) {
  const navigate = useNavigate();
  const [expandido, setExpandido] = useState(false);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'box-shadow 0.3s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    }}
    >
      
      {/* Header del Card */}
      <div
        style={{ padding: '24px' }}
        onClick={() => setExpandido(!expandido)}
      >
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between'
        }}>
          
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            flex: 1
          }}>
            {/* Icono */}
            <div style={{
              fontSize: '36px',
              flexShrink: 0
            }}>
              {getTipoEpisodioIcono(episodio.tipo || 'CONSULTA')}
            </div>

            {/* Info Principal */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px'
              }}>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTipoEpisodioColor(episodio.tipo || 'CONSULTA')}`}>
                  {episodio.tipo || 'CONSULTA'}
                </span>
                <span style={{
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  {formatearFecha(episodio.fecha_atencion || episodio.fecha)}
                </span>
              </div>

              <h3 style={{
                fontWeight: 'bold',
                color: '#111827',
                fontSize: '18px',
                marginBottom: '8px',
                margin: 0
              }}>
                {episodio.diagnostico || episodio.motivo_consulta}
              </h3>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                <span>👨‍⚕️</span>
                <span>{episodio.odontologo_nombre}</span>
              </div>

              {episodio.documentos?.length > 0 && (
                <div style={{
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#2563eb'
                }}>
                  <span>📎</span>
                  <span>{episodio.documentos.length} {episodio.documentos.length === 1 ? 'documento' : 'documentos'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Botón Expandir */}
          <button style={{
            fontSize: '24px',
            color: '#9ca3af',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#4b5563';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#9ca3af';
          }}
          >
            {expandido ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Contenido Expandido */}
      {expandido && (
        <div style={{
          padding: '0 24px 24px',
          borderTop: '1px solid #e5e7eb',
          paddingTop: '16px'
        }}>
          
          {/* Tratamiento Realizado */}
          {episodio.tratamiento_realizado && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px',
                fontSize: '16px',
                margin: '0 0 8px 0'
              }}>
                🦷 Tratamiento Realizado:
              </h4>
              <p style={{
                color: '#374151',
                backgroundColor: '#f9fafb',
                padding: '12px',
                borderRadius: '8px',
                margin: 0
              }}>
                {episodio.tratamiento_realizado}
              </p>
            </div>
          )}

          {/* Notas del Odontólogo */}
          {episodio.notas_privadas && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px',
                fontSize: '16px',
                margin: '0 0 8px 0'
              }}>
                📝 Notas del Odontólogo:
              </h4>
              <p style={{
                color: '#374151',
                backgroundColor: '#f9fafb',
                padding: '12px',
                borderRadius: '8px',
                margin: 0
              }}>
                {episodio.notas_privadas}
              </p>
            </div>
          )}

          {/* Documentos Adjuntos */}
          {episodio.documentos?.length > 0 && (
            <div>
              <h4 style={{
                fontWeight: '600',
                color: '#111827',
                marginBottom: '12px',
                fontSize: '16px',
                margin: '0 0 12px 0'
              }}>
                📎 Documentos Adjuntos:
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '12px'
              }}>
                {episodio.documentos.map((doc: any) => (
                  <div
                    key={doc.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <span style={{ fontSize: '24px' }}>
                        {getTipoDocumentoIcono(doc.tipo)}
                      </span>
                      <div>
                        <p style={{
                          fontWeight: '500',
                          color: '#111827',
                          fontSize: '14px',
                          margin: 0
                        }}>
                          {doc.nombre}
                        </p>
                        {doc.descripcion && (
                          <p style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            marginTop: '4px',
                            margin: '4px 0 0 0'
                          }}>
                            {doc.descripcion}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        descargarDocumento(doc.archivo, doc.nombre);
                      }}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#1d4ed8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#2563eb';
                      }}
                    >
                      ⬇️ Descargar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cita Relacionada */}
          {episodio.cita && (
            <div style={{
              marginTop: '16px',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              <span style={{ fontWeight: '500' }}>📅 Relacionado con cita #{episodio.cita}</span>
            </div>
          )}

          {/* Botón Ver Detalle Completo */}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/paciente/historial/episodio/${episodio.id}`);
              }}
              style={{
                width: '100%',
                padding: '10px 16px',
                backgroundColor: '#2563eb',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }}
            >
              👁️ Ver Detalle Completo
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
