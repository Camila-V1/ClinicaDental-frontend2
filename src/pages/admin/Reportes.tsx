/**
 * 📊 Página de Reportes y Dashboard - Admin
 * (Corregido: Fusión inteligente de datos para evitar ceros)
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText } from 'lucide-react';
import reportesService from '@/services/reportesService';
import DashboardKPIs from '@/components/admin/DashboardKPIs';
import BotonesExportar from '@/components/reportes/BotonesExportar';
import ModalExportarPersonalizado from '@/components/reportes/ModalExportarPersonalizado';
import TendenciaCitasChart from '@/components/admin/TendenciaCitasChart';
import TopProcedimientosChart from '@/components/admin/TopProcedimientosChart';
import ReporteFinanciero from '@/components/admin/ReporteFinanciero';
import OcupacionOdontologos from '@/components/admin/OcupacionOdontologos';
import { generateReportesDocumentation, downloadMarkdownFile } from '@/utils/generateReportesDocumentation';

export default function Reportes() {
  const [diasTendencia, setDiasTendencia] = useState(15);
  const [periodoFinanciero, setPeriodoFinanciero] = useState('mes_actual');
  const [showModalExportar, setShowModalExportar] = useState(false);

  // Función para convertir "mes_actual" al formato YYYY-MM
  const getPeriodoFormateado = () => {
    if (periodoFinanciero === 'mes_actual') {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
    return periodoFinanciero;
  };

  const periodoFormateado = getPeriodoFormateado();

  // ==================== QUERIES ====================
  
  const { data: kpis, isLoading: loadingKPIs } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: () => reportesService.getDashboardKpis(),
    refetchInterval: 60000,
  });

  const { data: estadisticas, isLoading: loadingStats } = useQuery({
    queryKey: ['estadisticas-generales'],
    queryFn: () => reportesService.getEstadisticasGenerales(),
  });

  const { data: tendenciaCitas, isLoading: loadingTendencia } = useQuery({
    queryKey: ['tendencia-citas', diasTendencia],
    queryFn: () => reportesService.getTendenciaCitas({ dias: diasTendencia }),
  });

  const { data: topProcedimientos, isLoading: loadingTop } = useQuery({
    queryKey: ['top-procedimientos'],
    queryFn: () => reportesService.getTopProcedimientos({ limite: 5 }),
  });

  const { data: reporteFinanciero, isLoading: loadingFinanciero } = useQuery({
    queryKey: ['reporte-financiero', periodoFinanciero],
    queryFn: () => reportesService.getReporteFinanciero({ periodo: periodoFormateado }),
  });

  const { data: ocupacionOdontologos, isLoading: loadingOcupacion } = useQuery({
    queryKey: ['ocupacion-odontologos'],
    queryFn: () => reportesService.getOcupacionOdontologos(),
  });

  // ==================== FUSIÓN DE DATOS (SOLUCIÓN DE CEROS) ====================
  
  // Creamos un objeto KPIs "Maestro" tomando el mejor dato disponible de cada fuente
  const kpisMaestros = {
    // Prioridad: KPI directo -> Estadísticas -> 0
    total_pacientes: kpis?.total_pacientes || estadisticas?.total_pacientes_activos || 0,
    citas_hoy: kpis?.citas_hoy || 0, 
    
    // Para ingresos, confiamos más en el reporte financiero real
    ingresos_mes: reporteFinanciero?.total_pagado || estadisticas?.total_pagado_mes || kpis?.ingresos_mes || "0",
    
    tratamientos_activos: kpis?.tratamientos_activos || estadisticas?.planes_activos || 0,
    pacientes_nuevos_mes: kpis?.pacientes_nuevos_mes || estadisticas?.pacientes_nuevos_mes || 0,
    
    // Si KPI es "0" (texto) o 0, usamos estadísticas
    tasa_ocupacion: (kpis?.tasa_ocupacion && kpis.tasa_ocupacion !== "0") 
      ? kpis.tasa_ocupacion 
      : (estadisticas?.tasa_ocupacion || "0"),
      
    citas_pendientes: kpis?.citas_pendientes || estadisticas?.citas_pendientes || 0,
    
    // Usamos facturas vencidas como proxy de pendientes si no hay dato directo
    facturas_pendientes: kpis?.facturas_pendientes || estadisticas?.facturas_vencidas || 0,
  };

  const loadingGlobalKPIs = loadingKPIs || loadingStats || loadingFinanciero;

  // Función para generar y descargar documentación
  const handleGenerarDocumentacion = () => {
    const markdown = generateReportesDocumentation();
    downloadMarkdownFile(markdown, 'DOCUMENTACION_SISTEMA_REPORTES.md');
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
            📊 Reportes y Análisis
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Dashboard ejecutivo con métricas y estadísticas del sistema
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <BotonesExportar
            onExportar={(formato) => reportesService.exportarEstadisticas(formato)}
            nombreReporte="Estadísticas Generales"
          />
          <button
            onClick={() => setShowModalExportar(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(139, 92, 246, 0.3)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#7c3aed';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(139, 92, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#8b5cf6';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(139, 92, 246, 0.3)';
            }}
          >
            📥 Exportar Personalizado
          </button>
        <button
          onClick={handleGenerarDocumentacion}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.3)';
          }}
        >
          <FileText size={18} />
          📄 Imprimir Documentación
        </button>
        </div>
      </div>

      {/* KPIs Dashboard FUSIONADOS */}
      <DashboardKPIs kpis={kpisMaestros} loading={loadingGlobalKPIs} />

      {/* Gráficos y Reportes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px', marginTop: '24px' }}>
        {/* Tendencia de Citas */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
              📈 Tendencia de Citas
            </h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
              <div style={{ marginLeft: '8px' }}>
                <BotonesExportar
                  onExportar={(formato) => reportesService.exportarTendenciaCitas(diasTendencia, formato)}
                  nombreReporte="Tendencia de Citas"
                />
              </div>
            </div>
          </div>
          <TendenciaCitasChart data={tendenciaCitas || []} loading={loadingTendencia} />
        </div>

        {/* Top Procedimientos */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
              🏆 Procedimientos Más Realizados
            </h2>
            <BotonesExportar
              onExportar={(formato) => reportesService.exportarTopProcedimientos(5, formato)}
              nombreReporte="Top Procedimientos"
            />
          </div>
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
                    <strong style={{ fontSize: '13px', color: '#10b981' }}>{estadisticas.planes_completados ?? 0}</strong>
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
                    <strong style={{ fontSize: '13px', color: '#10b981' }}>Bs. {parseFloat(estadisticas.total_pagado_mes || '0').toFixed(2)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#065f46' }}>Pendiente:</span>
                    <strong style={{ fontSize: '13px', color: '#f59e0b' }}>Bs. {parseFloat(estadisticas.monto_pendiente || '0').toFixed(2)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#065f46' }}>Vencidas:</span>
                    <strong style={{ fontSize: '13px', color: '#ef4444' }}>{estadisticas.facturas_vencidas ?? 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#065f46' }}>Promedio factura:</span>
                    <strong style={{ fontSize: '13px', color: '#065f46' }}>Bs. {parseFloat(estadisticas.promedio_factura || '0').toFixed(2)}</strong>
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
                    <strong style={{ fontSize: '13px', color: parseFloat(estadisticas.tasa_ocupacion || '0') > 70 ? '#10b981' : '#f59e0b' }}>
                      {parseFloat(estadisticas.tasa_ocupacion || '0').toFixed(1)}%
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Exportación Personalizada */}
      {showModalExportar && (
        <ModalExportarPersonalizado onClose={() => setShowModalExportar(false)} />
      )}
    </div>
  );
}
