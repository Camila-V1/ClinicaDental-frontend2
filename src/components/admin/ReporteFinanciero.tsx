/**
 * 💰 Reporte Financiero
 */

import React from 'react';
import type { ReporteFinanciero as ReporteFinancieroType } from '@/services/reportesService';

interface ReporteFinancieroProps {
  reporte: ReporteFinancieroType | undefined;
  loading: boolean;
}

export default function ReporteFinanciero({ reporte, loading }: ReporteFinancieroProps) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
        Cargando reporte financiero...
      </div>
    );
  }

  if (!reporte) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
        No hay datos financieros disponibles
      </div>
    );
  }

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 2
    }).format(num);
  };

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '16px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #93c5fd' }}>
          <p style={{ fontSize: '12px', color: '#1e40af', margin: '0 0 8px 0', fontWeight: '500' }}>
            Total Facturado
          </p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af', margin: 0 }}>
            {formatCurrency(reporte.total_facturado)}
          </p>
        </div>

        <div style={{ padding: '16px', background: '#d1fae5', borderRadius: '8px', border: '1px solid #86efac' }}>
          <p style={{ fontSize: '12px', color: '#065f46', margin: '0 0 8px 0', fontWeight: '500' }}>
            Total Cobrado
          </p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
            {formatCurrency(reporte.total_cobrado)}
          </p>
        </div>

        <div style={{ padding: '16px', background: '#fee2e2', borderRadius: '8px', border: '1px solid #fca5a5' }}>
          <p style={{ fontSize: '12px', color: '#991b1b', margin: '0 0 8px 0', fontWeight: '500' }}>
            Total Pendiente
          </p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444', margin: 0 }}>
            {formatCurrency(reporte.total_pendiente)}
          </p>
        </div>
      </div>

      {/* Facturas Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '6px', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px 0' }}>Emitidas</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            {reporte.facturas_emitidas}
          </p>
        </div>
        <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '6px', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px 0' }}>Pagadas</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
            {reporte.facturas_pagadas}
          </p>
        </div>
        <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '6px', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px 0' }}>Pendientes</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>
            {reporte.facturas_pendientes}
          </p>
        </div>
      </div>

      {/* Ingresos por Método de Pago */}
      <div>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
          Ingresos por Método de Pago
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#f0fdf4', borderRadius: '6px', border: '1px solid #86efac' }}>
            <span style={{ fontSize: '13px', color: '#065f46', display: 'flex', alignItems: 'center', gap: '6px' }}>
              💵 Efectivo
            </span>
            <strong style={{ fontSize: '13px', color: '#10b981' }}>
              {formatCurrency(reporte.ingresos_por_metodo.EFECTIVO)}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#eff6ff', borderRadius: '6px', border: '1px solid #93c5fd' }}>
            <span style={{ fontSize: '13px', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '6px' }}>
              💳 Tarjeta
            </span>
            <strong style={{ fontSize: '13px', color: '#3b82f6' }}>
              {formatCurrency(reporte.ingresos_por_metodo.TARJETA)}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#f5f3ff', borderRadius: '6px', border: '1px solid #c4b5fd' }}>
            <span style={{ fontSize: '13px', color: '#5b21b6', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🏦 Transferencia
            </span>
            <strong style={{ fontSize: '13px', color: '#8b5cf6' }}>
              {formatCurrency(reporte.ingresos_por_metodo.TRANSFERENCIA)}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#fef3c7', borderRadius: '6px', border: '1px solid #fbbf24' }}>
            <span style={{ fontSize: '13px', color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📝 Cheque
            </span>
            <strong style={{ fontSize: '13px', color: '#f59e0b' }}>
              {formatCurrency(reporte.ingresos_por_metodo.CHEQUE)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
