/**
 * 📋 Lista de Logs de Bitácora
 */

import React from 'react';
import type { BitacoraLog } from '@/services/bitacoraService';

interface BitacoraLogsListProps {
  logs: BitacoraLog[];
  isLoading: boolean;
  currentPage: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
}

export default function BitacoraLogsList({
  logs,
  isLoading,
  currentPage,
  totalCount,
  hasNext,
  hasPrevious,
  onPageChange,
}: BitacoraLogsListProps) {
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
        Cargando logs...
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div style={{ background: 'white', borderRadius: '12px', padding: '60px 20px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
        <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>
          No hay registros
        </p>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
          No se encontraron logs de auditoría con los filtros aplicados
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {logs.map((log, index) => (
          <div
            key={log.id}
            style={{
              padding: '16px 20px',
              borderBottom: index < logs.length - 1 ? '1px solid #f3f4f6' : 'none',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#111827',
                  }}>
                    {log.usuario}
                  </span>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    backgroundColor: '#e0e7ff',
                    color: '#3730a3',
                  }}>
                    {log.accion}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  {log.modelo} #{log.objeto_id}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'right' }}>
                <div>{new Date(log.timestamp).toLocaleDateString('es-BO')}</div>
                <div>{new Date(log.timestamp).toLocaleTimeString('es-BO')}</div>
              </div>
            </div>

            {log.detalles && (
              <div style={{
                marginTop: '8px',
                padding: '8px 12px',
                background: '#f9fafb',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#6b7280',
              }}>
                {log.detalles}
              </div>
            )}

            <div style={{ marginTop: '8px', fontSize: '11px', color: '#9ca3af' }}>
              IP: {log.ip_address}
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {totalCount > 50 && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px 20px',
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid #e5e7eb',
        }}>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            Página {currentPage} - Total: {totalCount} registros
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              disabled={!hasPrevious}
              onClick={() => onPageChange(currentPage - 1)}
              style={{
                padding: '8px 16px',
                background: hasPrevious ? 'white' : '#f9fafb',
                color: hasPrevious ? '#111827' : '#9ca3af',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: hasPrevious ? 'pointer' : 'not-allowed',
              }}
            >
              ← Anterior
            </button>
            <button
              disabled={!hasNext}
              onClick={() => onPageChange(currentPage + 1)}
              style={{
                padding: '8px 16px',
                background: hasNext ? 'white' : '#f9fafb',
                color: hasNext ? '#111827' : '#9ca3af',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: hasNext ? 'pointer' : 'not-allowed',
              }}
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
