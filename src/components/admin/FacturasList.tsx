/**
 * 📄 Lista de Facturas - Admin
 */

import React from 'react';
import type { Factura } from '@/services/facturacionAdminService';

interface FacturasListProps {
  facturas: Factura[];
  loading: boolean;
  onEdit: (factura: Factura) => void;
  onDelete: (id: number) => void;
  onMarcarPagada: (id: number) => void;
  onCancelar: (id: number) => void;
}

export default function FacturasList({ facturas, loading, onEdit, onDelete, onMarcarPagada, onCancelar }: FacturasListProps) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        Cargando facturas...
      </div>
    );
  }

  if (facturas.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        No se encontraron facturas
      </div>
    );
  }

  const getEstadoColor = (estado: string) => {
    const colors = {
      'PENDIENTE': { bg: '#fef3c7', text: '#92400e', border: '#fbbf24' },
      'PAGADA': { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
      'VENCIDA': { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' },
      'ANULADA': { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' },
    };
    return colors[estado as keyof typeof colors] || colors['PENDIENTE'];
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
      day: 'numeric'
    });
  };

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      {facturas.map((factura) => {
        // ✅ Usar campos exactos del backend según documentación
        const numeroFactura = factura.numero || factura.id;
        const montoTotal = parseFloat(factura.monto_total || factura.total || factura.monto || '0');
        const montoPagado = parseFloat(factura.monto_pagado || '0');
        const saldoPendiente = parseFloat(factura.saldo_pendiente || factura.saldo || '0');
        const fechaEmision = factura.fecha_emision || factura.fecha;
        
        const estadoColor = getEstadoColor(factura.estado);
        
        return (
          <div
            key={factura.id}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold',
                    }}
                  >
                    📄
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>
                      Factura #{numeroFactura}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '2px 0 0 0' }}>
                      {factura.paciente_nombre}
                    </p>
                  </div>
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
                {factura.estado_display}
              </span>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Fecha Emisión</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0 }}>
                  📅 {formatDate(fechaEmision)}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Monto Total</p>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#10b981', margin: 0 }}>
                  {formatCurrency(montoTotal)}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Pagado</p>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#059669', margin: 0 }}>
                  {formatCurrency(montoPagado)}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Saldo Pendiente</p>
                <p style={{ fontSize: '16px', fontWeight: '700', color: saldoPendiente === 0 ? '#10b981' : '#ef4444', margin: 0 }}>
                  {formatCurrency(saldoPendiente)}
                </p>
              </div>
            </div>

            {/* Descripción */}
            {factura.descripcion && (
              <div style={{ marginBottom: '16px', padding: '10px', background: '#f9fafb', borderRadius: '8px' }}>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                  📝 {factura.descripcion}
                </p>
              </div>
            )}

            {/* Total de pagos */}
            {factura.total_pagos > 0 && (
              <div style={{ marginBottom: '16px', fontSize: '13px', color: '#059669' }}>
                💳 {factura.total_pagos} pago{factura.total_pagos !== 1 ? 's' : ''} registrado{factura.total_pagos !== 1 ? 's' : ''}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onEdit(factura)}
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
              
              {factura.estado === 'PENDIENTE' && (
                <>
                  <button
                    onClick={() => onMarcarPagada(factura.id)}
                    style={{
                      padding: '8px 16px',
                      background: '#d1fae5',
                      color: '#065f46',
                      border: '1px solid #10b981',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    ✅ Marcar Pagada
                  </button>
                  <button
                    onClick={() => onCancelar(factura.id)}
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
                    ❌ Cancelar
                  </button>
                </>
              )}
              
              {factura.estado !== 'PAGADA' && (
                <button
                  onClick={() => onDelete(factura.id)}
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
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
