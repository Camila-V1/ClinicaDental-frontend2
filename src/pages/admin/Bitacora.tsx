/**
 * 📋 BITÁCORA - Auditoría del Sistema
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import bitacoraService from '@/services/bitacoraService';
import BitacoraLogsList from '@/components/admin/BitacoraLogsList';

export default function Bitacora() {
  const [page, setPage] = useState(1);
  const [filtros, setFiltros] = useState({
    usuario: '',
    accion: '',
    fecha_desde: '',
    fecha_hasta: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['bitacora', page, filtros],
    queryFn: () => bitacoraService.getLogs({ page, ...filtros, limit: 50 }),
  });

  const handleFiltrar = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleLimpiar = () => {
    setFiltros({ usuario: '', accion: '', fecha_desde: '', fecha_hasta: '' });
    setPage(1);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
          📋 Bitácora del Sistema
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          Registro de todas las acciones realizadas en el sistema
        </p>
      </div>

      {/* Filtros */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
        <form onSubmit={handleFiltrar}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                Usuario
              </label>
              <input
                type="text"
                placeholder="Filtrar por usuario..."
                value={filtros.usuario}
                onChange={(e) => setFiltros({ ...filtros, usuario: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#111827',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                Acción
              </label>
              <input
                type="text"
                placeholder="Filtrar por acción..."
                value={filtros.accion}
                onChange={(e) => setFiltros({ ...filtros, accion: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#111827',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                Desde
              </label>
              <input
                type="date"
                value={filtros.fecha_desde}
                onChange={(e) => setFiltros({ ...filtros, fecha_desde: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#111827',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                Hasta
              </label>
              <input
                type="date"
                value={filtros.fecha_hasta}
                onChange={(e) => setFiltros({ ...filtros, fecha_hasta: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#111827',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              🔍 Filtrar
            </button>
            <button
              type="button"
              onClick={handleLimpiar}
              style={{
                padding: '10px 24px',
                background: 'white',
                color: '#111827',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              🔄 Limpiar
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Logs */}
      <BitacoraLogsList
        logs={data?.results || []}
        isLoading={isLoading}
        currentPage={page}
        totalCount={data?.count || 0}
        hasNext={!!data?.next}
        hasPrevious={!!data?.previous}
        onPageChange={setPage}
      />
    </div>
  );
}
