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
                      {factura.numero_factura}
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
                {factura.estado}
              </span>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Fecha Emisión</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0 }}>
                  📅 {formatDate(factura.fecha_emision)}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Vencimiento</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0 }}>
                  ⏰ {formatDate(factura.fecha_vencimiento)}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Total</p>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#10b981', margin: 0 }}>
                  {formatCurrency(factura.total)}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Saldo</p>
                <p style={{ fontSize: '16px', fontWeight: '700', color: factura.saldo === '0.00' ? '#10b981' : '#ef4444', margin: 0 }}>
                  {formatCurrency(factura.saldo)}
                </p>
              </div>
            </div>

            {/* Items Preview */}
            {factura.items && factura.items.length > 0 && (
              <div style={{ marginBottom: '16px', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>
                  Items ({factura.items.length})
                </p>
                {factura.items.slice(0, 2).map((item, idx) => (
                  <div key={idx} style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                    • {item.descripcion} x{item.cantidad} = {formatCurrency(item.subtotal)}
                  </div>
                ))}
                {factura.items.length > 2 && (
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0' }}>
                    + {factura.items.length - 2} más...
                  </p>
                )}
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

            {factura.notas && (
              <div style={{ marginTop: '12px', padding: '10px', background: '#fffbeb', borderLeft: '3px solid #f59e0b', borderRadius: '4px' }}>
                <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>
                  📝 {factura.notas}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
