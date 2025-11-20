/**
 * 📈 Componente LineChart - Gráfico de líneas usando Chart.js
 */

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineChartProps {
  data: Array<{ [key: string]: any }>;
  xKey: string;
  yKey: string;
  color?: string;
  label?: string;
}

export default function LineChart({ 
  data, 
  xKey, 
  yKey, 
  color = '#3b82f6',
  label = 'Datos'
}: LineChartProps) {
  const chartData = {
    labels: data.map(item => item[xKey]),
    datasets: [
      {
        label,
        data: data.map(item => item[yKey]),
        borderColor: color,
        backgroundColor: `${color}20`,
        fill: true,
        tension: 0.4,
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
      tooltip: {
        mode: 'index' as const,
        intersect: false,
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
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
}
