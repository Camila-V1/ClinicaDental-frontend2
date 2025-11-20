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
      color: 'text-blue-600',
    },
    {
      label: 'Odontólogos',
      value: formatNumber(stats.total_odontologos),
      color: 'text-purple-600',
    },
    {
      label: 'Citas Este Mes',
      value: formatNumber(stats.citas_mes_actual),
      color: 'text-green-600',
    },
    {
      label: 'Tratamientos Completados',
      value: formatNumber(stats.tratamientos_completados),
      color: 'text-orange-600',
    },
    {
      label: 'Ingresos del Mes',
      value: formatCurrency(stats.ingresos_mes_actual),
      color: 'text-emerald-600',
    },
    {
      label: 'Promedio por Factura',
      value: formatCurrency(stats.promedio_factura),
      color: 'text-cyan-600',
    },
    {
      label: 'Tasa de Ocupación',
      value: `${stats.tasa_ocupacion.toFixed(1)}%`,
      color: 'text-indigo-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-600 mb-1">{item.label}</p>
          <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}
