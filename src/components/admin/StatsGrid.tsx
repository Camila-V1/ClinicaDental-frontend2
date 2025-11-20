/**
 * 📋 Componente StatsGrid - Grid de estadísticas
 */

import React from 'react';
import type { EstadisticasGenerales } from '@/types/admin';
import { formatNumber, formatCurrency } from '@/lib/utils';

interface StatsGridProps {
  stats: EstadisticasGenerales;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const items = [
    {
      label: 'Pacientes Activos',
      value: formatNumber(stats.total_pacientes_activos),
      color: '#2563eb', // blue-600
    },
    {
      label: 'Odontólogos',
      value: formatNumber(stats.total_odontologos),
      color: '#9333ea', // purple-600
    },
    {
      label: 'Citas Este Mes',
      value: formatNumber(stats.citas_mes_actual),
      color: '#16a34a', // green-600
    },
    {
      label: 'Tratamientos Completados',
      value: formatNumber(stats.tratamientos_completados),
      color: '#ea580c', // orange-600
    },
    {
      label: 'Ingresos del Mes',
      value: formatCurrency(stats.ingresos_mes_actual),
      color: '#059669', // emerald-600
    },
    {
      label: 'Promedio por Factura',
      value: formatCurrency(stats.promedio_factura),
      color: '#0891b2', // cyan-600
    },
    {
      label: 'Tasa de Ocupación',
      value: `${typeof stats.tasa_ocupacion === 'number' ? stats.tasa_ocupacion.toFixed(1) : '0.0'}%`,
      color: '#4f46e5', // indigo-600
    },
  ];

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
      gap: '16px' 
    }}>
      {items.map((item, index) => (
        <div 
          key={index} 
          style={{
            padding: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            transition: 'box-shadow 0.2s',
            backgroundColor: 'white'
          }}
          onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'}
          onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
          <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '4px', margin: 0 }}>{item.label}</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: item.color, margin: 0 }}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}
