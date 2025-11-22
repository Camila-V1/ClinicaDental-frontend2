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
  console.log('📊 [StatsGrid] Renderizando con stats:', stats);

  const items = [
    {
      label: 'Pacientes Activos',
      value: formatNumber(stats.total_pacientes_activos || 0),
      color: '#2563eb', // blue-600
    },
    {
      label: 'Pacientes Nuevos (Mes)',
      value: formatNumber(stats.pacientes_nuevos_mes || 0),
      color: '#06b6d4', // cyan-600
    },
    {
      label: 'Odontólogos',
      value: formatNumber(stats.total_odontologos || 0),
      color: '#9333ea', // purple-600
    },
    {
      label: 'Citas Este Mes',
      value: formatNumber(stats.citas_mes_actual || 0),
      color: '#16a34a', // green-600
    },
    {
      label: 'Citas Completadas',
      value: formatNumber(stats.citas_completadas || 0),
      color: '#10b981', // emerald-600
    },
    {
      label: 'Citas Pendientes',
      value: formatNumber(stats.citas_pendientes || 0),
      color: '#f59e0b', // amber-600
    },
    {
      label: 'Citas Canceladas',
      value: formatNumber(stats.citas_canceladas || 0),
      color: '#ef4444', // red-600
    },
    {
      label: 'Planes Activos',
      value: formatNumber(stats.planes_activos || 0),
      color: '#8b5cf6', // violet-600
    },
    {
      label: 'Tratamientos Completados',
      value: formatNumber(stats.tratamientos_completados || 0),
      color: '#ea580c', // orange-600
    },
    {
      label: 'Total Procedimientos',
      value: formatNumber(stats.total_procedimientos || 0),
      color: '#ec4899', // pink-600
    },
    {
      label: 'Ingresos del Mes',
      value: formatCurrency(stats.ingresos_mes_actual || 0),
      color: '#059669', // emerald-600
    },
    {
      label: 'Monto Pendiente',
      value: formatCurrency(stats.monto_pendiente || 0),
      color: '#f97316', // orange-600
    },
    {
      label: 'Facturas Vencidas',
      value: formatNumber(stats.facturas_vencidas || 0),
      color: '#dc2626', // red-600
    },
    {
      label: 'Promedio por Factura',
      value: formatCurrency(stats.promedio_factura || 0),
      color: '#0891b2', // cyan-600
    },
    {
      label: 'Tasa de Ocupación',
      value: `${typeof stats.tasa_ocupacion === 'number' ? stats.tasa_ocupacion.toFixed(1) : '0.0'}%`,
      color: '#4f46e5', // indigo-600
    },
  ];

  console.log('📊 [StatsGrid] Items a renderizar:', items.length);

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
