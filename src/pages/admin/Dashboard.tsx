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
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Dashboard</h1>
          <p style={{ color: '#4b5563', margin: '4px 0 0 0' }}>Bienvenido al panel de administración</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={16} />
          Actualizar
        </Button>
      </div>

      {/* KPIs */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '24px' 
      }}>
        {loadingKpis ? (
          <>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} style={{ height: '128px', backgroundColor: '#f3f4f6', borderRadius: '8px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
            ))}
          </>
        ) : (
          <>
            {kpis && (
              <>
                <KPICard
                  label="Pacientes Activos"
                  value={kpis.total_pacientes}
                  icon="Users"
                  color="blue"
                />
                <KPICard
                  label="Citas Hoy"
                  value={kpis.citas_hoy}
                  icon="Calendar"
                  color="green"
                />
                <KPICard
                  label="Ingresos del Mes"
                  value={kpis.ingresos_mes}
                  icon="DollarSign"
                  color="purple"
                  prefix="Bs. "
                  format="currency"
                />
                <KPICard
                  label="Saldo Pendiente"
                  value={kpis.saldo_pendiente}
                  icon="AlertCircle"
                  color="orange"
                  prefix="Bs. "
                  format="currency"
                />
                <KPICard
                  label="Tratamientos Activos"
                  value={kpis.tratamientos_activos}
                  icon="Activity"
                  color="indigo"
                />
                <KPICard
                  label="Planes Completados"
                  value={kpis.planes_completados}
                  icon="CheckCircle"
                  color="teal"
                />
                <KPICard
                  label="Promedio por Factura"
                  value={kpis.promedio_factura}
                  icon="TrendingUp"
                  color="cyan"
                  prefix="Bs. "
                  format="currency"
                />
                <KPICard
                  label="Facturas Vencidas"
                  value={kpis.facturas_vencidas}
                  icon="AlertTriangle"
                  color="red"
                />
              </>
            )}
          </>
        )}
      </div>

      {/* Gráficos */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '24px' 
      }}>
        {/* Tendencia de Citas */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>Tendencia de Citas (15 días)</h2>
          <LineChart
            data={tendencia || []}
            xKey="fecha"
            yKey="cantidad"
            color="#3b82f6"
            label="Citas"
          />
        </div>

        {/* Top Procedimientos */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>Top Procedimientos</h2>
          <BarChart
            data={topProcedimientos || []}
            xKey="etiqueta"
            yKey="valor"
            color="#10b981"
            label="Cantidad"
          />
        </div>
      </div>

      {/* Estadísticas y Alertas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '24px' 
      }}>
        {/* Estadísticas */}
        <div style={{ gridColumn: 'span 2', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>Estadísticas Generales</h2>
          {estadisticas ? (
            <StatsGrid stats={estadisticas} />
          ) : (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: '32px 0' }}>Cargando...</div>
          )}
        </div>

        {/* Alertas */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>Alertas</h2>
          <AlertList alerts={[
            ...(stockBajo && Array.isArray(stockBajo) && stockBajo.length > 0 ? [{
              type: 'warning' as const,
              title: 'Stock Bajo',
              message: `${stockBajo.length} insumos con stock bajo`,
              link: '/admin/inventario?stock_bajo=true',
              count: stockBajo.length
            }] : [])
          ]} />
        </div>
      </div>

      {/* Actividad Reciente */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', padding: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>Actividad Reciente</h2>
        {actividad && actividad.results ? (
          <ActivityTimeline activities={actividad.results} />
        ) : (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: '32px 0' }}>Cargando...</div>
        )}
      </div>
    </div>
  );
}
