/**
 * 📊 Página de Reportes y Dashboard - Admin
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import reportesService from '@/services/reportesService';
import DashboardKPIs from '@/components/admin/DashboardKPIs';
import TendenciaCitasChart from '@/components/admin/TendenciaCitasChart';
import TopProcedimientosChart from '@/components/admin/TopProcedimientosChart';
import ReporteFinanciero from '@/components/admin/ReporteFinanciero';
import OcupacionOdontologos from '@/components/admin/OcupacionOdontologos';

export default function Reportes() {
  const [diasTendencia, setDiasTendencia] = useState(15);
  const [periodoFinanciero, setPeriodoFinanciero] = useState('mes_actual');

  console.log('📊 [Reportes] Componente renderizado');
  console.log('   - diasTendencia:', diasTendencia);
  console.log('   - periodoFinanciero:', periodoFinanciero);

  // Función para convertir "mes_actual" al formato YYYY-MM
  const getPeriodoFormateado = () => {
    if (periodoFinanciero === 'mes_actual') {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
    return periodoFinanciero;
  };

  const periodoFormateado = getPeriodoFormateado();
  console.log('   - periodoFormateado:', periodoFormateado);

  // ==================== QUERIES ====================
  
  const { data: kpis, isLoading: loadingKPIs, error: errorKPIs } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: () => reportesService.getDashboardKpis(),
    refetchInterval: 60000, // Refetch cada 60 segundos
  });

  console.log('📊 [Reportes] KPIs Query Estado:');
  console.log('   - isLoading:', loadingKPIs);
  console.log('   - error:', errorKPIs);
  console.log('   - data:', kpis);

  const { data: estadisticas, isLoading: loadingStats, error: errorStats } = useQuery({
    queryKey: ['estadisticas-generales'],
    queryFn: () => reportesService.getEstadisticasGenerales(),
  });

  console.log('📊 [Reportes] Estadísticas Query Estado:');
  console.log('   - isLoading:', loadingStats);
  console.log('   - error:', errorStats);
  console.log('   - data:', estadisticas);

  const { data: tendenciaCitas, isLoading: loadingTendencia, error: errorTendencia } = useQuery({
    queryKey: ['tendencia-citas', diasTendencia],
    queryFn: () => reportesService.getTendenciaCitas({ dias: diasTendencia }),
  });

  console.log('📊 [Reportes] Tendencia Citas Query Estado:');
  console.log('   - isLoading:', loadingTendencia);
  console.log('   - error:', errorTendencia);
  console.log('   - data:', tendenciaCitas);

  const { data: topProcedimientos, isLoading: loadingTop, error: errorTop } = useQuery({
    queryKey: ['top-procedimientos'],
    queryFn: () => reportesService.getTopProcedimientos({ limite: 5 }),
  });

  console.log('📊 [Reportes] Top Procedimientos Query Estado:');
  console.log('   - isLoading:', loadingTop);
  console.log('   - error:', errorTop);
  console.log('   - data:', topProcedimientos);

  const { data: reporteFinanciero, isLoading: loadingFinanciero, error: errorFinanciero } = useQuery({
    queryKey: ['reporte-financiero', periodoFinanciero],
    queryFn: () => reportesService.getReporteFinanciero({ periodo: periodoFormateado }),
  });

  console.log('📊 [Reportes] Reporte Financiero Query Estado:');
  console.log('   - isLoading:', loadingFinanciero);
  console.log('   - error:', errorFinanciero);
  console.log('   - data:', reporteFinanciero);

  const { data: ocupacionOdontologos, isLoading: loadingOcupacion, error: errorOcupacion } = useQuery({
    queryKey: ['ocupacion-odontologos'],
    queryFn: () => reportesService.getOcupacionOdontologos(),
  });

  console.log('📊 [Reportes] Ocupación Odontólogos Query Estado:');
  console.log('   - isLoading:', loadingOcupacion);
  console.log('   - error:', errorOcupacion);
  console.log('   - data:', ocupacionOdontologos);

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          📊 Reportes y Análisis
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Dashboard ejecutivo con métricas y estadísticas del sistema
        </p>
      </div>

      {/* KPIs Dashboard */}
      <DashboardKPIs kpis={kpis} loading={loadingKPIs} />

      {/* Gráficos y Reportes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px', marginTop: '24px' }}>
        {/* Tendencia de Citas */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
              📈 Tendencia de Citas
            </h2>
            <select
              value={diasTendencia}
              onChange={(e) => setDiasTendencia(Number(e.target.value))}
              style={{
                padding: '6px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#111827',
                backgroundColor: 'white',
                outline: 'none',
              }}
            >
              <option value={7}>Últimos 7 días</option>
              <option value={15}>Últimos 15 días</option>
              <option value={30}>Últimos 30 días</option>
            </select>
          </div>
          <TendenciaCitasChart data={tendenciaCitas || []} loading={loadingTendencia} />
        </div>

        {/* Top Procedimientos */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
            🏆 Procedimientos Más Realizados
          </h2>
          <TopProcedimientosChart data={topProcedimientos || []} loading={loadingTop} />
        </div>
      </div>

      {/* Reporte Financiero */}
      <div style={{ marginTop: '24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
              💰 Reporte Financiero
            </h2>
            <select
              value={periodoFinanciero}
              onChange={(e) => setPeriodoFinanciero(e.target.value)}
              style={{
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#111827',
                backgroundColor: 'white',
                outline: 'none',
              }}
            >
              <option value="mes_actual">Mes Actual</option>
              <option value="mes_anterior">Mes Anterior</option>
              <option value="trimestre">Trimestre Actual</option>
              <option value="año">Año Actual</option>
            </select>
          </div>
          <ReporteFinanciero reporte={reporteFinanciero} loading={loadingFinanciero} />
        </div>
      </div>

      {/* Ocupación de Odontólogos */}
      <div style={{ marginTop: '24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
            👨‍⚕️ Ocupación de Odontólogos
          </h2>
          <OcupacionOdontologos ocupacion={ocupacionOdontologos || []} loading={loadingOcupacion} />
        </div>
      </div>

      {/* Estadísticas Generales */}
      {estadisticas && (
        <div style={{ marginTop: '24px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
              📋 Estadísticas Generales
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {/* Pacientes */}
              <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#065f46', marginBottom: '12px' }}>
                  👥 Pacientes
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#065f46' }}>Activos:</span>
                    <strong style={{ fontSize: '13px', color: '#065f46' }}>{estadisticas.total_pacientes_activos ?? 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#065f46' }}>Nuevos (mes):</span>
                    <strong style={{ fontSize: '13px', color: '#10b981' }}>{estadisticas.pacientes_nuevos_mes ?? 0}</strong>
                  </div>
                </div>
              </div>

              {/* Odontólogos */}
              <div style={{ padding: '16px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af', marginBottom: '12px' }}>
                  👨‍⚕️ Odontólogos
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#1e40af' }}>Total:</span>
                    <strong style={{ fontSize: '13px', color: '#1e40af' }}>{estadisticas.total_odontologos ?? 0}</strong>
                  </div>
                </div>
              </div>

              {/* Citas */}
              <div style={{ padding: '16px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fbbf24' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#92400e', marginBottom: '12px' }}>
                  📅 Citas (Mes)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#92400e' }}>Total:</span>
                    <strong style={{ fontSize: '13px', color: '#92400e' }}>{estadisticas.citas_mes_actual ?? 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#92400e' }}>Completadas:</span>
                    <strong style={{ fontSize: '13px', color: '#10b981' }}>{estadisticas.citas_completadas ?? 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#92400e' }}>Pendientes:</span>
                    <strong style={{ fontSize: '13px', color: '#f59e0b' }}>{estadisticas.citas_pendientes ?? 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#92400e' }}>Canceladas:</span>
                    <strong style={{ fontSize: '13px', color: '#ef4444' }}>{estadisticas.citas_canceladas ?? 0}</strong>
                  </div>
                </div>
              </div>

              {/* Tratamientos */}
              <div style={{ padding: '16px', background: '#fce7f3', borderRadius: '8px', border: '1px solid #f9a8d4' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#831843', marginBottom: '12px' }}>
                  🦷 Tratamientos
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#831843' }}>Planes activos:</span>
                    <strong style={{ fontSize: '13px', color: '#831843' }}>{estadisticas.planes_activos ?? 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#831843' }}>Completados:</span>
                    <strong style={{ fontSize: '13px', color: '#10b981' }}>{estadisticas.tratamientos_completados ?? 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#831843' }}>Procedimientos:</span>
                    <strong style={{ fontSize: '13px', color: '#831843' }}>{estadisticas.total_procedimientos ?? 0}</strong>
                  </div>
                </div>
              </div>

              {/* Financiero */}
              <div style={{ padding: '16px', background: '#d1fae5', borderRadius: '8px', border: '1px solid #86efac' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#065f46', marginBottom: '12px' }}>
                  💰 Financiero
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#065f46' }}>Ingresos (mes):</span>
                    <strong style={{ fontSize: '13px', color: '#10b981' }}>Bs. {(estadisticas.ingresos_mes_actual ?? 0).toFixed(2)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#065f46' }}>Pendiente:</span>
                    <strong style={{ fontSize: '13px', color: '#f59e0b' }}>Bs. {(estadisticas.monto_pendiente ?? 0).toFixed(2)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#065f46' }}>Vencidas:</span>
                    <strong style={{ fontSize: '13px', color: '#ef4444' }}>{estadisticas.facturas_vencidas ?? 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#065f46' }}>Promedio factura:</span>
                    <strong style={{ fontSize: '13px', color: '#065f46' }}>Bs. {(estadisticas.promedio_factura ?? 0).toFixed(2)}</strong>
                  </div>
                </div>
              </div>

              {/* Ocupación */}
              <div style={{ padding: '16px', background: '#e0e7ff', borderRadius: '8px', border: '1px solid #a5b4fc' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#3730a3', marginBottom: '12px' }}>
                  📊 Ocupación
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#3730a3' }}>Tasa de ocupación:</span>
                    <strong style={{ fontSize: '13px', color: estadisticas.tasa_ocupacion > 70 ? '#10b981' : '#f59e0b' }}>
                      {(estadisticas.tasa_ocupacion ?? 0).toFixed(1)}%
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
