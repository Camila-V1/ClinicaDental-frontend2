/**
 * 📊 Página Dashboard del Administrador
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { adminDashboardService } from '@/services/admin/adminDashboardService';
import KPICard from '@/components/admin/KPICard';
import LineChart from '@/components/admin/LineChart';
import BarChart from '@/components/admin/BarChart';
import StatsGrid from '@/components/admin/StatsGrid';
import AlertList from '@/components/admin/AlertList';
import ActivityTimeline from '@/components/admin/ActivityTimeline';
import Button from '@/components/ui/Button';

export default function Dashboard() {
  // Fetch de datos
  const { data: kpis, isLoading: loadingKpis, refetch: refetchKpis } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: adminDashboardService.getKPIs,
    refetchInterval: 30000, // Refetch cada 30 segundos
  });

  const { data: tendencia } = useQuery({
    queryKey: ['tendencia-citas', 15],
    queryFn: () => adminDashboardService.getTendenciaCitas(15),
  });

  const { data: topProcedimientos } = useQuery({
    queryKey: ['top-procedimientos', 5],
    queryFn: () => adminDashboardService.getTopProcedimientos(5),
  });

  const { data: estadisticas } = useQuery({
    queryKey: ['estadisticas-generales'],
    queryFn: adminDashboardService.getEstadisticasGenerales,
  });

  const { data: stockBajo } = useQuery({
    queryKey: ['stock-bajo'],
    queryFn: adminDashboardService.getStockBajo,
  });

  const { data: actividad } = useQuery({
    queryKey: ['actividad-reciente'],
    queryFn: adminDashboardService.getActividadReciente,
  });

  const handleRefresh = () => {
    refetchKpis();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bienvenido al panel de administración</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loadingKpis ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </>
        ) : (
          <>
            {kpis && kpis[0] && (
              <KPICard
                label={kpis[0].etiqueta}
                value={kpis[0].valor}
                icon="Users"
                color="blue"
              />
            )}
            {kpis && kpis[1] && (
              <KPICard
                label={kpis[1].etiqueta}
                value={kpis[1].valor}
                icon="Calendar"
                color="green"
              />
            )}
            {kpis && kpis[2] && (
              <KPICard
                label={kpis[2].etiqueta}
                value={kpis[2].valor}
                icon="DollarSign"
                color="purple"
              />
            )}
            {kpis && kpis[3] && (
              <KPICard
                label={kpis[3].etiqueta}
                value={kpis[3].valor}
                icon="AlertCircle"
                color="orange"
              />
            )}
          </>
        )}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendencia de Citas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Tendencia de Citas (15 días)</h2>
          {tendencia && tendencia.length > 0 ? (
            <LineChart
              data={tendencia}
              xKey="fecha"
              yKey="cantidad"
              color="#3b82f6"
              label="Citas"
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No hay datos disponibles
            </div>
          )}
        </div>

        {/* Top Procedimientos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Top Procedimientos</h2>
          {topProcedimientos && topProcedimientos.length > 0 ? (
            <BarChart
              data={topProcedimientos}
              xKey="etiqueta"
              yKey="valor"
              color="#10b981"
              label="Cantidad"
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No hay datos disponibles
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas y Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Estadísticas */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Estadísticas Generales</h2>
          {estadisticas ? (
            <StatsGrid stats={estadisticas} />
          ) : (
            <div className="text-center text-gray-500 py-8">Cargando...</div>
          )}
        </div>

        {/* Alertas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Alertas</h2>
          <AlertList alerts={[
            ...(stockBajo && stockBajo.count > 0 ? [{
              type: 'warning' as const,
              title: 'Stock Bajo',
              message: `${stockBajo.count} insumos con stock bajo`,
              link: '/admin/inventario?stock_bajo=true',
              count: stockBajo.count
            }] : [])
          ]} />
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>
        {actividad && actividad.results ? (
          <ActivityTimeline activities={actividad.results} />
        ) : (
          <div className="text-center text-gray-500 py-8">Cargando...</div>
        )}
      </div>
    </div>
  );
}
