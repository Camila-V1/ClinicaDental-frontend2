import React, { useState } from 'react';
import type { EpisodioAtencionPaciente } from '../../../services/historialService';
import { DetalleEpisodio } from './DetalleEpisodio';

interface Props {
  episodios: EpisodioAtencionPaciente[];
}

// Iconos SVG inline (tamaños fijos)
const Calendar = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const User = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const FileText = () => (
  <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ margin: '0 auto' }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export const ListaEpisodios: React.FC<Props> = ({ episodios }) => {
  const [episodioSeleccionado, setEpisodioSeleccionado] = useState<EpisodioAtencionPaciente | null>(null);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (episodios.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '48px',
        textAlign: 'center'
      }}>
        <div style={{ color: '#d0d0d0', marginBottom: '16px' }}>
          <FileText />
        </div>
        <p style={{ color: '#666', fontSize: '18px', marginBottom: '8px' }}>
          No hay episodios de atención registrados
        </p>
        <p style={{ color: '#999', fontSize: '14px' }}>
          Los episodios aparecerán aquí después de cada consulta
        </p>
      </div>
    );
  }

  return (
    <>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '2px solid #e0e0e0'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '4px'
          }}>
            Episodios de Atención
          </h2>
          <p style={{ color: '#666', fontSize: '14px' }}>
            {episodios.length} {episodios.length === 1 ? 'episodio' : 'episodios'} registrados
          </p>
        </div>

        <div>
          {episodios.map((episodio) => (
            <div
              key={episodio.id}
              onClick={() => setEpisodioSeleccionado(episodio)}
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  {/* Fecha y odontólogo */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      color: '#666'
                    }}>
                      <Calendar />
                      {formatearFecha(episodio.fecha_atencion)}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      color: '#666'
                    }}>
                      <User />
                      {episodio.odontologo_nombre}
                    </div>
                  </div>

                  {/* Motivo de consulta */}
                  <p style={{
                    fontWeight: '500',
                    color: '#333',
                    fontSize: '15px',
                    marginBottom: '8px'
                  }}>
                    {episodio.motivo_consulta}
                  </p>

                  {/* Diagnóstico (preview) */}
                  {episodio.diagnostico && (
                    <p style={{
                      fontSize: '13px',
                      color: '#666',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      <span style={{ fontWeight: '500' }}>Diagnóstico:</span> {episodio.diagnostico}
                    </p>
                  )}
                </div>

                <div style={{ color: '#999', marginLeft: '16px', flexShrink: 0 }}>
                  <ChevronRight />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de detalle */}
      {episodioSeleccionado && (
        <DetalleEpisodio
          episodio={episodioSeleccionado}
          onClose={() => setEpisodioSeleccionado(null)}
        />
      )}
    </>
  );
};
