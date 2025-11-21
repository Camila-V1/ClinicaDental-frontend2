/**
 * 📋 Lista de Episodios de Atención
 */

import React from 'react';
import { Loader, Clipboard, User, Calendar, Edit, Trash2 } from 'lucide-react';
import type { EpisodioAtencion } from '@/services/historialClinicoService';

interface EpisodiosListProps {
  episodios: EpisodioAtencion[];
  isLoading: boolean;
  onEdit: (episodio: EpisodioAtencion) => void;
  onDelete: (id: number) => void;
}

export default function EpisodiosList({ episodios, isLoading, onEdit, onDelete }: EpisodiosListProps) {
  const getEstadoBadge = (estado: string) => {
    const config = {
      PENDIENTE: { label: 'Pendiente', bg: '#fef3c7', color: '#f59e0b' },
      EN_CURSO: { label: 'En Curso', bg: '#dbeafe', color: '#2563eb' },
      COMPLETADO: { label: 'Completado', bg: '#d1fae5', color: '#10b981' },
      CANCELADO: { label: 'Cancelado', bg: '#fee2e2', color: '#ef4444' },
    };
    const { label, bg, color } = config[estado] || config.PENDIENTE;
    return (
      <span style={{ 
        padding: '4px 10px', 
        borderRadius: '6px', 
        fontSize: '12px', 
        fontWeight: '500', 
        backgroundColor: bg, 
        color
      }}>
        {label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div style={{ padding: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: '#2563eb' }} />
      </div>
    );
  }

  if (episodios.length === 0) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
        <p>No hay episodios de atención registrados</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      {episodios.map((episodio) => (
        <div
          key={episodio.id}
          style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px',
            transition: 'all 150ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.borderColor = '#3b82f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Clipboard style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>
                    {episodio.motivo_consulta}
                  </h3>
                  {getEstadoBadge(episodio.estado)}
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>
                      Dr. {episodio.odontologo_nombre}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>
                      {new Date(episodio.fecha_atencion).toLocaleDateString('es')}
                    </span>
                  </div>
                </div>

                {episodio.diagnostico && (
                  <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '6px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#166534', margin: '0 0 4px 0' }}>
                      Diagnóstico:
                    </p>
                    <p style={{ fontSize: '13px', color: '#15803d', margin: 0 }}>
                      {episodio.diagnostico}
                    </p>
                  </div>
                )}

                {episodio.tratamiento_realizado && (
                  <div style={{ marginTop: '8px', padding: '10px', backgroundColor: '#eff6ff', borderRadius: '6px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#1e40af', margin: '0 0 4px 0' }}>
                      Tratamiento Realizado:
                    </p>
                    <p style={{ fontSize: '13px', color: '#1e3a8a', margin: 0 }}>
                      {episodio.tratamiento_realizado}
                    </p>
                  </div>
                )}

                {episodio.proximo_control && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#f59e0b' }}>
                    📅 Próximo control: {new Date(episodio.proximo_control).toLocaleDateString('es')}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => onEdit(episodio)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #bfdbfe',
                  backgroundColor: '#dbeafe',
                  color: '#2563eb',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 150ms'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#bfdbfe'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
              >
                <Edit style={{ width: '14px', height: '14px' }} />
              </button>
              <button
                onClick={() => onDelete(episodio.id)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #fecaca',
                  backgroundColor: '#fee2e2',
                  color: '#ef4444',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 150ms'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
              >
                <Trash2 style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
