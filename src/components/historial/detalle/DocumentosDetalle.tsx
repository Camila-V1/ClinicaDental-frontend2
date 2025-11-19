import { useState } from 'react';
import {
  getTipoDocumentoColor,
  getTipoDocumentoIcono,
  descargarDocumento,
  formatearFecha
} from '../../../services/historialService';

interface Props {
  documentos: any[];
}

export default function DocumentosDetalle({ documentos }: Props) {
  const [imagenExpandida, setImagenExpandida] = useState<string | null>(null);

  const esImagen = (tipo: string) => {
    return tipo === 'FOTO' || tipo === 'RADIOGRAFIA';
  };

  return (
    <>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '24px'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: '0 0 24px 0'
        }}>
          📎 Documentos Adjuntos ({documentos.length})
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {documentos.map((doc) => (
            <div
              key={doc.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#93c5fd';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Preview */}
              {esImagen(doc.tipo) ? (
                <div 
                  style={{
                    height: '192px',
                    backgroundColor: '#f3f4f6',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => setImagenExpandida(doc.archivo)}
                  onMouseEnter={(e) => {
                    const overlay = e.currentTarget.querySelector('.overlay') as HTMLElement;
                    if (overlay) {
                      overlay.style.opacity = '1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const overlay = e.currentTarget.querySelector('.overlay') as HTMLElement;
                    if (overlay) {
                      overlay.style.opacity = '0';
                    }
                  }}
                >
                  <img
                    src={doc.archivo}
                    alt={doc.nombre}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div
                    className="overlay"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s'
                    }}
                  >
                    <span style={{ fontSize: '48px' }}>🔍</span>
                  </div>
                </div>
              ) : (
                <div style={{
                  height: '192px',
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '64px' }}>
                    {getTipoDocumentoIcono(doc.tipo)}
                  </span>
                </div>
              )}

              {/* Info */}
              <div style={{ padding: '16px' }}>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTipoDocumentoColor(doc.tipo)}`}>
                  {doc.tipo}
                </span>
                <h4 style={{
                  fontWeight: '600',
                  color: '#111827',
                  marginTop: '12px',
                  marginBottom: '8px',
                  margin: '12px 0 8px 0'
                }}>
                  {doc.nombre}
                </h4>
                {doc.descripcion && (
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '12px',
                    margin: '0 0 12px 0'
                  }}>
                    {doc.descripcion}
                  </p>
                )}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: '#9ca3af',
                  marginBottom: '12px'
                }}>
                  <span>{formatearFecha(doc.fecha_subida || doc.creado)}</span>
                  {doc.subido_por && <span>Por: {doc.subido_por}</span>}
                </div>
                <button
                  onClick={() => descargarDocumento(doc.archivo, doc.nombre)}
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
                  ⬇️ Descargar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Imagen Expandida */}
      {imagenExpandida && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setImagenExpandida(null)}
        >
          <div style={{
            position: 'relative',
            maxWidth: '1200px',
            maxHeight: '100%'
          }}>
            <button
              onClick={() => setImagenExpandida(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
              }}
            >
              ×
            </button>
            <img
              src={imagenExpandida}
              alt="Vista ampliada"
              style={{
                maxWidth: '100%',
                maxHeight: '100vh',
                objectFit: 'contain'
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}
