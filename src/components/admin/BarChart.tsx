/**
 * 📊 Componente BarChart - Gráfico de barras usando Chart.js
 */

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: Array<{ [key: string]: any }>;
  xKey: string;
  yKey: string;
  color?: string;
  label?: string;
}

export default function BarChart({ 
  data, 
  xKey, 
  yKey, 
  color = '#10b981',
  label = 'Cantidad'
}: BarChartProps) {
  // Validación: No renderizar si no hay datos
  if (!data || data.length === 0) {
    return (
      <div style={{ height: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
        No hay datos disponibles
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => item[xKey]),
    datasets: [
      {
        label,
        data: data.map(item => item[yKey]),
        backgroundColor: color,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div style={{ height: '256px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
