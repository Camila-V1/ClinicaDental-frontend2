/**
 * 👨‍⚕️ Ocupación de Odontólogos
 */

import React from 'react';
import type { OcupacionOdontologo } from '@/services/reportesService';

interface OcupacionOdontologosProps {
  ocupacion: OcupacionOdontologo[];
  loading: boolean;
}

export default function OcupacionOdontologos({ ocupacion, loading }: OcupacionOdontologosProps) {
  console.log('👨‍⚕️ [OcupacionOdontologos] Renderizando componente');
  console.log('   - loading:', loading);
  console.log('   - ocupacion length:', ocupacion?.length);
  console.log('   - ocupacion:', ocupacion);

  if (loading) {
    console.log('👨‍⚕️ [OcupacionOdontologos] Mostrando mensaje de carga');
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
        Cargando ocupación...
      </div>
    );
  }

  if (!ocupacion || ocupacion.length === 0) {
    console.warn('⚠️ [OcupacionOdontologos] No hay datos disponibles');
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
        No hay datos de ocupación disponibles
      </div>
    );
  }

  console.log('✅ [OcupacionOdontologos] Datos disponibles, renderizando tabla');

  const getOcupacionColor = (tasa: string) => {
    const porcentaje = parseFloat(tasa);
    if (porcentaje >= 80) return { bg: '#d1fae5', text: '#065f46', border: '#86efac' };
    if (porcentaje >= 50) return { bg: '#fef3c7', text: '#92400e', border: '#fbbf24' };
    return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' };
  };

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      {ocupacion.map((odontologo) => {
        const colorOcupacion = getOcupacionColor(odontologo.tasa_ocupacion);
        
        return (
          <div
            key={odontologo.usuario_id}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e5e7eb',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                  }}
                >
                  👨‍⚕️
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>
                    {odontologo.nombre_completo}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: '2px 0 0 0' }}>
                    ID: {odontologo.usuario_id}
                  </p>
                </div>
              </div>

              <div
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: colorOcupacion.bg,
                  border: `1px solid ${colorOcupacion.border}`,
                }}
              >
                <p style={{ fontSize: '11px', color: colorOcupacion.text, margin: '0 0 2px 0', textAlign: 'center' }}>
                  Ocupación
                </p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: colorOcupacion.text, margin: 0, textAlign: 'center' }}>
                  {odontologo.tasa_ocupacion}%
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px 0' }}>Total Citas</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                  {odontologo.total_citas}
                </p>
              </div>

              <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: '#065f46', margin: '0 0 4px 0' }}>Completadas</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
                  {odontologo.citas_completadas}
                </p>
              </div>

              <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: '#92400e', margin: '0 0 4px 0' }}>Canceladas</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>
                  {odontologo.citas_canceladas}
                </p>
              </div>

              <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: '#1e40af', margin: '0 0 4px 0' }}>Horas</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>
                  {odontologo.horas_ocupadas}h
                </p>
              </div>

              <div style={{ padding: '12px', background: '#fce7f3', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: '#831843', margin: '0 0 4px 0' }}>Pacientes</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#ec4899', margin: 0 }}>
                  {odontologo.pacientes_atendidos}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Eficiencia</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#111827' }}>
                  {odontologo.citas_completadas}/{odontologo.total_citas}
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${odontologo.total_citas > 0 ? (odontologo.citas_completadas / odontologo.total_citas) * 100 : 0}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
