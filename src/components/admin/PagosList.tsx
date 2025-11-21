/**
 * 💳 Lista de Pagos - Admin
 */

import React from 'react';
import type { Pago } from '@/services/facturacionAdminService';

interface PagosListProps {
  pagos: Pago[];
  loading: boolean;
  onEdit: (pago: Pago) => void;
  onDelete: (id: number) => void;
  onAnular: (id: number) => void;
}

export default function PagosList({ pagos, loading, onEdit, onDelete, onAnular }: PagosListProps) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        Cargando pagos...
      </div>
    );
  }

  if (pagos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        No se encontraron pagos
      </div>
    );
  }

  const getMetodoColor = (metodo: string) => {
    const colors = {
      'EFECTIVO': { bg: '#d1fae5', text: '#065f46', icon: '💵' },
      'TARJETA': { bg: '#dbeafe', text: '#1e40af', icon: '💳' },
      'TRANSFERENCIA': { bg: '#e0e7ff', text: '#3730a3', icon: '🏦' },
      'CHEQUE': { bg: '#fef3c7', text: '#92400e', icon: '📝' },
    };
    return colors[metodo as keyof typeof colors] || colors['EFECTIVO'];
  };

  const getEstadoColor = (estado: string) => {
    const colors = {
      'COMPLETADO': { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
      'ANULADO': { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' },
    };
    return colors[estado as keyof typeof colors] || colors['COMPLETADO'];
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 2
    }).format(num);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      {pagos.map((pago) => {
        const metodoColor = getMetodoColor(pago.metodo_pago);
        const estadoColor = getEstadoColor(pago.estado);
        
        return (
          <div
            key={pago.id}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                  }}
                >
                  {metodoColor.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>
                    Pago #{pago.id}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '2px 0 0 0' }}>
                    {pago.paciente_nombre}
                  </p>
                </div>
              </div>
              
              <span
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: estadoColor.bg,
                  color: estadoColor.text,
                  border: `1px solid ${estadoColor.border}`,
                }}
              >
                {pago.estado}
              </span>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Factura</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0 }}>
                  📄 {pago.factura_numero}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Fecha Pago</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0 }}>
                  📅 {formatDate(pago.fecha_pago)}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Método</p>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    backgroundColor: metodoColor.bg,
                    color: metodoColor.text,
                  }}
                >
                  {pago.metodo_pago}
                </span>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Monto</p>
                <p style={{ fontSize: '18px', fontWeight: '700', color: '#10b981', margin: 0 }}>
                  {formatCurrency(pago.monto)}
                </p>
              </div>
            </div>

            {/* Transaction Number */}
            {pago.numero_transaccion && (
              <div style={{ marginBottom: '12px', padding: '10px', background: '#f0fdf4', borderRadius: '6px', border: '1px solid #86efac' }}>
                <p style={{ fontSize: '12px', color: '#065f46', margin: 0 }}>
                  🔢 Transacción: <strong>{pago.numero_transaccion}</strong>
                </p>
              </div>
            )}

            {/* Notes */}
            {pago.notas && (
              <div style={{ marginBottom: '12px', padding: '10px', background: '#fffbeb', borderLeft: '3px solid #f59e0b', borderRadius: '4px' }}>
                <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>
                  📝 {pago.notas}
                </p>
              </div>
            )}

            {/* Created By */}
            {pago.created_by_nombre && (
              <div style={{ marginBottom: '12px', fontSize: '12px', color: '#9ca3af' }}>
                Registrado por: <strong>{pago.created_by_nombre}</strong>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onEdit(pago)}
                style={{
                  padding: '8px 16px',
                  background: '#f3f4f6',
                  color: '#111827',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                ✏️ Editar
              </button>
              
              {pago.estado === 'COMPLETADO' && (
                <button
                  onClick={() => onAnular(pago.id)}
                  style={{
                    padding: '8px 16px',
                    background: '#fee2e2',
                    color: '#991b1b',
                    border: '1px solid #ef4444',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  🚫 Anular
                </button>
              )}
              
              <button
                onClick={() => onDelete(pago.id)}
                style={{
                  padding: '8px 16px',
                  background: '#fef3c7',
                  color: '#92400e',
                  border: '1px solid #fbbf24',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
