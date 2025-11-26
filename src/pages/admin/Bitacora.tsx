/**
 * 📋 BITÁCORA - Auditoría del Sistema (Mejorada con filtros avanzados)
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import bitacoraService from '@/services/bitacoraService';
import ModalDetalleLog from '@/components/bitacora/ModalDetalleLog';

export default function Bitacora() {
  const [page, setPage] = useState(1);
  const [logSeleccionado, setLogSeleccionado] = useState<any>(null);
  const [filtros, setFiltros] = useState({
    usuario: '',
    accion: '',
    modelo: '',
    fecha_inicio: '',
    fecha_fin: '',
    page_size: 20,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['bitacora', page, filtros],
    queryFn: () => bitacoraService.getLogs({ page, ...filtros }),
  });

  const handleExportar = async (formato: 'csv' | 'json') => {
    try {
      await bitacoraService.exportarLogs(filtros, formato);
      toast.success(`✅ Logs exportados a ${formato.toUpperCase()}`);
    } catch (error) {
      toast.error('Error al exportar logs');
    }
  };

  const verDetalle = async (log: any) => {
    try {
      const detalle = await bitacoraService.getLogDetalle(log.id);
      setLogSeleccionado(detalle);
    } catch (error) {
      toast.error('Error al cargar detalle');
      setLogSeleccionado(log);
    }
  };

  const getAccionColor = (accion: string) => {
    switch (accion) {
      case 'CREATE': return { bg: '#d1fae5', text: '#065f46', border: '#86efac' };
      case 'UPDATE': return { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' };
      case 'DELETE': return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' };
      case 'VIEW': return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
      case 'LOGIN': return { bg: '#f3e8ff', text: '#6b21a8', border: '#d8b4fe' };
      case 'LOGOUT': return { bg: '#fed7aa', text: '#9a3412', border: '#fdba74' };
      default: return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
    }
  };

  const getAccionIcon = (accion: string) => {
    switch (accion) {
      case 'CREATE': return '➕';
      case 'UPDATE': return '✏️';
      case 'DELETE': return '🗑️';
      case 'VIEW': return '👁️';
      case 'LOGIN': return '🔓';
      case 'LOGOUT': return '🔒';
      default: return '📝';
    }
  };

  const handleFiltrar = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleLimpiar = () => {
    setFiltros({
      usuario: '',
      accion: '',
      modelo: '',
      fecha_inicio: '',
      fecha_fin: '',
      page_size: 20,
    });
    setPage(1);
  };

  const logs = data?.results || [];
  const totalCount = data?.count || 0;
  const hasNext = !!data?.next;
  const hasPrevious = !!data?.previous;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            📋 Bitácora del Sistema
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Registro de auditoría con todas las acciones realizadas
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => handleExportar('csv')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            📊 Exportar CSV
          </button>
          <button
            onClick={() => handleExportar('json')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            📄 Exportar JSON
          </button>
        </div>
      </div>

      {/* Filtros Avanzados */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
        <form onSubmit={handleFiltrar}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                Usuario
              </label>
              <input
                type="text"
                placeholder="Nombre de usuario..."
                value={filtros.usuario}
                onChange={(e) => setFiltros({ ...filtros, usuario: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                Acción
              </label>
              <select
                value={filtros.accion}
                onChange={(e) => setFiltros({ ...filtros, accion: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'white',
                }}
              >
                <option value="">Todas</option>
                <option value="CREATE">➕ Crear</option>
                <option value="UPDATE">✏️ Actualizar</option>
                <option value="DELETE">🗑️ Eliminar</option>
                <option value="VIEW">👁️ Ver</option>
                <option value="LOGIN">🔓 Login</option>
                <option value="LOGOUT">🔒 Logout</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                Modelo
              </label>
              <input
                type="text"
                placeholder="Cita, Paciente, etc."
                value={filtros.modelo}
                onChange={(e) => setFiltros({ ...filtros, modelo: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
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
                value={filtros.fecha_inicio}
                onChange={(e) => setFiltros({ ...filtros, fecha_inicio: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
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
                value={filtros.fecha_fin}
                onChange={(e) => setFiltros({ ...filtros, fecha_fin: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
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
                fontWeight: '600',
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

      {/* Tabla de Logs */}
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
            Cargando logs...
          </div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>
              No hay registros
            </p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Ajusta los filtros para ver más resultados
            </p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb' }}>
                  <tr>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      Fecha
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      Usuario
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      Acción
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      Modelo
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      Descripción
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      IP
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log: any, index: number) => {
                    const accionStyle = getAccionColor(log.accion);
                    return (
                      <tr
                        key={log.id}
                        style={{
                          borderTop: '1px solid #e5e7eb',
                          backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb',
                        }}
                      >
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827', whiteSpace: 'nowrap' }}>
                          {new Date(log.fecha_hora || log.timestamp).toLocaleString('es-ES', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827' }}>
                          {log.usuario || 'Sistema'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              backgroundColor: accionStyle.bg,
                              color: accionStyle.text,
                              border: `1px solid ${accionStyle.border}`,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            {getAccionIcon(log.accion)} {log.accion}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#111827' }}>
                          {log.modelo}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6b7280', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {log.descripcion || log.detalles}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: '#9ca3af', fontFamily: 'monospace' }}>
                          {log.ip_address}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button
                            onClick={() => verDetalle(log)}
                            style={{
                              padding: '6px 12px',
                              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer',
                            }}
                          >
                            Ver detalle
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div style={{ backgroundColor: '#f9fafb', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Total: <strong style={{ color: '#111827' }}>{totalCount}</strong> registros
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  disabled={!hasPrevious}
                  onClick={() => setPage(page - 1)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: hasPrevious ? 'pointer' : 'not-allowed',
                    opacity: hasPrevious ? 1 : 0.5,
                    backgroundColor: 'white',
                  }}
                >
                  Anterior
                </button>
                <span style={{ padding: '8px 12px', fontSize: '14px', color: '#111827', fontWeight: '600' }}>
                  Página {page}
                </span>
                <button
                  disabled={!hasNext}
                  onClick={() => setPage(page + 1)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: hasNext ? 'pointer' : 'not-allowed',
                    opacity: hasNext ? 1 : 0.5,
                    backgroundColor: 'white',
                  }}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Detalle */}
      {logSeleccionado && (
        <ModalDetalleLog
          log={logSeleccionado}
          onClose={() => setLogSeleccionado(null)}
        />
      )}
    </div>
  );
}
