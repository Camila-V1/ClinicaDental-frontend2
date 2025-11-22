/**
 * 📊 Dashboard KPIs - Indicadores Principales
 */

import React from 'react';
import type { DashboardKPIs as KPIsType } from '@/services/reportesService';

interface DashboardKPIsProps {
  kpis: KPIsType | undefined;
  loading: boolean;
}

export default function DashboardKPIs({ kpis, loading }: DashboardKPIsProps) {
  console.log('📊 [DashboardKPIs] Renderizando componente');
  console.log('   - loading:', loading);
  console.log('   - kpis:', kpis);

  if (loading) {
    console.log('📊 [DashboardKPIs] Mostrando skeleton loader');
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ background: '#f3f4f6', borderRadius: '12px', height: '120px', animation: 'pulse 2s infinite' }} />
        ))}
      </div>
    );
  }

  if (!kpis) {
    console.warn('⚠️ [DashboardKPIs] No hay datos de KPIs');
    return null;
  }

  const kpiCards = [
    {
      title: 'Total Pacientes',
      value: kpis.total_pacientes,
      icon: '👥',
      color: { bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', text: 'white' },
      suffix: '',
    },
    {
      title: 'Citas Hoy',
      value: kpis.citas_hoy,
      icon: '📅',
      color: { bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', text: 'white' },
      suffix: '',
    },
    {
      title: 'Ingresos del Mes',
      value: `Bs. ${parseFloat(kpis.ingresos_mes).toFixed(2)}`,
      icon: '💰',
      color: { bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', text: 'white' },
      suffix: '',
    },
    {
      title: 'Tratamientos Activos',
      value: kpis.tratamientos_activos,
      icon: '🦷',
      color: { bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', text: 'white' },
      suffix: '',
    },
    {
      title: 'Pacientes Nuevos (Mes)',
      value: kpis.pacientes_nuevos_mes,
      icon: '🆕',
      color: { bg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', text: 'white' },
      suffix: '',
    },
    {
      title: 'Tasa de Ocupación',
      value: kpis.tasa_ocupacion,
      icon: '📊',
      color: { bg: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', text: 'white' },
      suffix: '%',
    },
    {
      title: 'Citas Pendientes',
      value: kpis.citas_pendientes,
      icon: '⏰',
      color: { bg: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', text: 'white' },
      suffix: '',
    },
    {
      title: 'Facturas Pendientes',
      value: kpis.facturas_pendientes,
      icon: '📄',
      color: { bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', text: 'white' },
      suffix: '',
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
      {kpiCards.map((kpi, index) => (
        <div
          key={index}
          style={{
            background: kpi.color.bg,
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            color: kpi.color.text,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', opacity: 0.9, margin: '0 0 8px 0', fontWeight: '500' }}>
                {kpi.title}
              </p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>
                {kpi.value}{kpi.suffix}
              </p>
            </div>
            <div style={{ fontSize: '36px', opacity: 0.3, marginLeft: '12px' }}>
              {kpi.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
