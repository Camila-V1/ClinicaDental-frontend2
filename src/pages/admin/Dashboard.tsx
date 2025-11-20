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
  console.log('🎯 [AdminDashboard] Componente montado');

  // Fetch de datos con logging detallado
  const { data: kpis, isLoading: loadingKpis, error: errorKpis, refetch: refetchKpis } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: async () => {
      console.log('📊 [AdminDashboard] Fetching KPIs...');
      try {
        const result = await adminDashboardService.getKPIs();
        console.log('✅ [AdminDashboard] KPIs obtenidos:', result);
        return result;
      } catch (error) {
        console.error('❌ [AdminDashboard] Error obteniendo KPIs:', error);
        if (error instanceof Error) {
          console.error('❌ [AdminDashboard] Error message:', error.message);
          console.error('❌ [AdminDashboard] Error stack:', error.stack);
        }
        throw error;
      }
    },
    refetchInterval: 30000,
    retry: 2,
  });

  const { data: tendencia, error: errorTendencia } = useQuery({
    queryKey: ['tendencia-citas', 15],
    queryFn: async () => {
      console.log('📈 [AdminDashboard] Fetching tendencia citas...');
      try {
        const result = await adminDashboardService.getTendenciaCitas(15);
        console.log('✅ [AdminDashboard] Tendencia obtenida:', result);
        return result;
      } catch (error) {
        console.error('❌ [AdminDashboard] Error obteniendo tendencia:', error);
        throw error;
      }
    },
    retry: 2,
  });

  const { data: topProcedimientos, error: errorProcedimientos } = useQuery({
    queryKey: ['top-procedimientos', 5],
    queryFn: async () => {
      console.log('🔝 [AdminDashboard] Fetching top procedimientos...');
      try {
        const result = await adminDashboardService.getTopProcedimientos(5);
        console.log('✅ [AdminDashboard] Top procedimientos obtenidos:', result);
        return result;
      } catch (error) {
        console.error('❌ [AdminDashboard] Error obteniendo procedimientos:', error);
        throw error;
      }
    },
    retry: 2,
  });

  const { data: estadisticas, error: errorEstadisticas } = useQuery({
    queryKey: ['estadisticas-generales'],
    queryFn: async () => {
      console.log('📋 [AdminDashboard] Fetching estadísticas generales...');
      try {
        const result = await adminDashboardService.getEstadisticasGenerales();
        console.log('✅ [AdminDashboard] Estadísticas obtenidas:', result);
        return result;
      } catch (error) {
        console.error('❌ [AdminDashboard] Error obteniendo estadísticas:', error);
        throw error;
      }
    },
    retry: 2,
  });

  const { data: stockBajo, error: errorStock } = useQuery({
    queryKey: ['stock-bajo'],
    queryFn: async () => {
      console.log('📦 [AdminDashboard] Fetching stock bajo...');
      try {
        const result = await adminDashboardService.getStockBajo();
        console.log('✅ [AdminDashboard] Stock bajo obtenido:', result);
        return result;
      } catch (error) {
        console.error('❌ [AdminDashboard] Error obteniendo stock bajo:', error);
        throw error;
      }
    },
    retry: 2,
  });

  const { data: actividad, error: errorActividad } = useQuery({
    queryKey: ['actividad-reciente'],
    queryFn: async () => {
      console.log('📅 [AdminDashboard] Fetching actividad reciente...');
      try {
        const result = await adminDashboardService.getActividadReciente();
        console.log('✅ [AdminDashboard] Actividad obtenida:', result);
        return result;
      } catch (error) {
        console.error('❌ [AdminDashboard] Error obteniendo actividad:', error);
        throw error;
      }
    },
    retry: 2,
  });

  // Log de errores consolidado
  React.useEffect(() => {
    if (errorKpis) console.error('🔴 [AdminDashboard] Error KPIs:', errorKpis);
    if (errorTendencia) console.error('🔴 [AdminDashboard] Error Tendencia:', errorTendencia);
    if (errorProcedimientos) console.error('🔴 [AdminDashboard] Error Procedimientos:', errorProcedimientos);
    if (errorEstadisticas) console.error('🔴 [AdminDashboard] Error Estadísticas:', errorEstadisticas);
    if (errorStock) console.error('🔴 [AdminDashboard] Error Stock:', errorStock);
    if (errorActividad) console.error('🔴 [AdminDashboard] Error Actividad:', errorActividad);
  }, [errorKpis, errorTendencia, errorProcedimientos, errorEstadisticas, errorStock, errorActividad]);

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
