/**
 * 📋 Logs de Auditoría
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import configuracionService from '@/services/configuracionService';

export default function AuditoriaLogs() {
  const [page, setPage] = useState(1);
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [filtroAccion, setFiltroAccion] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['auditoria-logs', page, filtroUsuario, filtroAccion, fechaDesde, fechaHasta],
    queryFn: () => configuracionService.getAuditoriaLogs({
      page,
      usuario: filtroUsuario || undefined,
      accion: filtroAccion || undefined,
      fecha_desde: fechaDesde || undefined,
      fecha_hasta: fechaHasta || undefined,
    }),
  });

  const logs = data?.results || [];
  const hasLogs = logs.length > 0;

  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
        Logs de Auditoría
      </h2>

      {/* Filtros */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Filtrar por usuario..."
          value={filtroUsuario}
          onChange={(e) => setFiltroUsuario(e.target.value)}
          style={{
            padding: '10px 14px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#111827',
            outline: 'none',
          }}
        />
        <input
          type="text"
          placeholder="Filtrar por acción..."
          value={filtroAccion}
          onChange={(e) => setFiltroAccion(e.target.value)}
          style={{
            padding: '10px 14px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#111827',
            outline: 'none',
          }}
        />
        <input
          type="date"
          value={fechaDesde}
          onChange={(e) => setFechaDesde(e.target.value)}
          style={{
            padding: '10px 14px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#111827',
            outline: 'none',
          }}
        />
        <input
          type="date"
          value={fechaHasta}
          onChange={(e) => setFechaHasta(e.target.value)}
          style={{
            padding: '10px 14px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#111827',
            outline: 'none',
          }}
        />
      </div>

      {/* Lista de Logs */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
          Cargando logs...
        </div>
      ) : !hasLogs ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>
            Módulo de Auditoría No Disponible
          </p>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            Los logs de auditoría requieren implementación en el backend.
            <br />
            Por ahora, puede revisar los logs del servidor directamente.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {logs.map((log) => (
            <div
              key={log.id}
              style={{
                padding: '16px',
                background: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                    {log.usuario}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>
                    {log.accion}
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                  {new Date(log.timestamp).toLocaleString('es-BO')}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                {log.modelo} #{log.objeto_id}
              </div>
              {log.detalles && (
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', padding: '8px', background: 'white', borderRadius: '4px' }}>
                  {log.detalles}
                </div>
              )}
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                IP: {log.ip_address}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
