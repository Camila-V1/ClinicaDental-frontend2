import { useState } from 'react';
import {
  getTipoDocumentoColor,
  getTipoDocumentoIcono,
  descargarDocumento,
  formatearFecha
} from '../../services/historialService';

interface Props {
  documentos: any[];
}

export default function DocumentosGaleria({ documentos }: Props) {
  const [filtroTipo, setFiltroTipo] = useState('');

  const documentosFiltrados = filtroTipo
    ? documentos.filter(doc => doc.tipo === filtroTipo)
    : documentos;

  const tiposUnicos = [...new Set(documentos.map(doc => doc.tipo))];

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '24px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#111827',
          margin: 0
        }}>
          📁 Todos los Documentos ({documentos.length})
        </h2>

        {/* Filtro por tipo */}
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          style={{
            padding: '10px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '16px',
            color: '#111827',
            backgroundColor: 'white'
          }}
        >
          <option value="" key="todos">Todos los tipos</option>
          {tiposUnicos.map((tipo, index) => (
            <option key={`tipo-${tipo}-${index}`} value={tipo}>{tipo}</option>
          ))}
        </select>
      </div>

      {documentosFiltrados.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 0',
          color: '#6b7280'
        }}>
          <span style={{ fontSize: '64px' }}>📭</span>
          <p style={{ marginTop: '16px', fontSize: '16px' }}>No hay documentos de este tipo</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {documentosFiltrados.map((doc) => (
            <div
              key={doc.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '16px',
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
              {/* Preview (si es imagen) */}
              {(doc.tipo === 'FOTO' || doc.tipo === 'RADIOGRAFIA') && doc.archivo ? (
                <div style={{ marginBottom: '12px' }}>
                  <img
                    src={doc.archivo}
                    alt={doc.nombre}
                    style={{
                      width: '100%',
                      height: '160px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div style={{
                  marginBottom: '12px',
                  height: '160px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px',
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
              <div style={{ marginBottom: '12px' }}>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTipoDocumentoColor(doc.tipo)}`}>
                  {doc.tipo}
                </span>
              </div>

              <h4 style={{
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px',
                fontSize: '16px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                margin: '0 0 8px 0'
              }}>
                {doc.nombre}
              </h4>

              {doc.descripcion && (
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginBottom: '12px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  margin: '0 0 12px 0'
                }}>
                  {doc.descripcion}
                </p>
              )}

              <p style={{
                fontSize: '12px',
                color: '#9ca3af',
                marginBottom: '12px',
                margin: '0 0 12px 0'
              }}>
                {formatearFecha(doc.fecha_subida || doc.creado)}
              </p>

              {/* Botón Descargar */}
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
                  transition: 'background-color 0.2s',
                  fontSize: '14px'
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
      )}
    </div>
  );
}
