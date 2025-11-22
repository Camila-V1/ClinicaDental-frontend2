/**
 * 📈 Gráfico de Tendencia de Citas
 */

import React from 'react';
import type { TendenciaCitas } from '@/services/reportesService';

interface TendenciaCitasChartProps {
  data: TendenciaCitas[];
  loading: boolean;
}

export default function TendenciaCitasChart({ data, loading }: TendenciaCitasChartProps) {
  console.log('📈 [TendenciaCitasChart] Renderizando componente');
  console.log('   - loading:', loading);
  console.log('   - data length:', data?.length);
  console.log('   - data:', data);

  if (loading) {
    console.log('📈 [TendenciaCitasChart] Mostrando mensaje de carga');
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
        Cargando tendencia...
      </div>
    );
  }

  if (!data || data.length === 0) {
    console.warn('⚠️ [TendenciaCitasChart] No hay datos disponibles');
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
        No hay datos de tendencia disponibles
      </div>
    );
  }

  console.log('✅ [TendenciaCitasChart] Datos disponibles, renderizando gráfico');
  console.log('   - Primer registro:', data[0]);
  console.log('   - Último registro:', data[data.length - 1]);

  const maxValue = Math.max(...data.map(d => d.total), 10);
  const chartHeight = 200;

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-BO', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6' }} />
          <span style={{ fontSize: '12px', color: '#6b7280' }}>Total</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
          <span style={{ fontSize: '12px', color: '#6b7280' }}>Completadas</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
          <span style={{ fontSize: '12px', color: '#6b7280' }}>Canceladas</span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: `${chartHeight}px`, padding: '0 10px' }}>
        {data.map((item, index) => {
          const totalHeight = (item.total / maxValue) * chartHeight;
          const completadasHeight = (item.completadas / maxValue) * chartHeight;
          const canceladasHeight = (item.canceladas / maxValue) * chartHeight;

          return (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '2px', alignItems: 'flex-end' }}>
                {/* Total Bar */}
                <div
                  style={{
                    width: '30%',
                    height: `${totalHeight || 2}px`,
                    background: '#3b82f6',
                    borderRadius: '4px 4px 0 0',
                    position: 'relative',
                    minHeight: '2px',
                  }}
                  title={`Total: ${item.total}`}
                >
                  {item.total > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '-20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      color: '#3b82f6',
                      whiteSpace: 'nowrap',
                    }}>
                      {item.total}
                    </div>
                  )}
                </div>
                {/* Completadas Bar */}
                <div
                  style={{
                    width: '30%',
                    height: `${completadasHeight || 2}px`,
                    background: '#10b981',
                    borderRadius: '4px 4px 0 0',
                    minHeight: '2px',
                  }}
                  title={`Completadas: ${item.completadas}`}
                />
                {/* Canceladas Bar */}
                <div
                  style={{
                    width: '30%',
                    height: `${canceladasHeight || 2}px`,
                    background: '#ef4444',
                    borderRadius: '4px 4px 0 0',
                    minHeight: '2px',
                  }}
                  title={`Canceladas: ${item.canceladas}`}
                />
              </div>
              <div style={{ fontSize: '10px', color: '#9ca3af', textAlign: 'center', marginTop: '4px' }}>
                {formatFecha(item.fecha)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
