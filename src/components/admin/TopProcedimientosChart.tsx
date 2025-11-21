/**
 * 🏆 Gráfico de Top Procedimientos
 */

import React from 'react';
import type { TopProcedimiento } from '@/services/reportesService';

interface TopProcedimientosChartProps {
  data: TopProcedimiento[];
  loading: boolean;
}

export default function TopProcedimientosChart({ data, loading }: TopProcedimientosChartProps) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
        Cargando procedimientos...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
        No hay datos de procedimientos disponibles
      </div>
    );
  }

  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // purple
    '#ec4899', // pink
  ];

  const maxCantidad = Math.max(...data.map(d => d.cantidad));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {data.map((item, index) => {
        const percentage = (item.cantidad / maxCantidad) * 100;
        const color = colors[index % colors.length];

        return (
          <div key={index}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: '500', color: '#111827' }}>
                {item.nombre}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color }}>
                  {item.cantidad}
                </span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                  ({item.porcentaje}%)
                </span>
              </div>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${percentage}%`,
                  height: '100%',
                  background: color,
                  borderRadius: '4px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
