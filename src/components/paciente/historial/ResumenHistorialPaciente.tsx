import React from 'react';
import type { HistorialClinicoPaciente } from '../../../services/historialService';

interface Props {
  historial: HistorialClinicoPaciente;
}

// Iconos SVG inline (20x20px)
const Calendar = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const AlertCircle = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const Pill = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6" />
  </svg>
);

const FileText = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export const ResumenHistorial: React.FC<Props> = ({ historial }) => {
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '24px'
    }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '24px'
      }}>
        📋 Información General
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {/* Fecha de apertura */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ color: '#2196f3', marginTop: '4px', flexShrink: 0 }}>
            <Calendar />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
              Fecha de Apertura
            </p>
            <p style={{ fontSize: '15px', fontWeight: '500', color: '#333' }}>
              {formatearFecha(historial.fecha_apertura)}
            </p>
          </div>
        </div>

        {/* Alergias */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ color: '#f44336', marginTop: '4px', flexShrink: 0 }}>
            <AlertCircle />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
              Alergias
            </p>
            <p style={{ fontSize: '15px', fontWeight: '500', color: '#333' }}>
              {historial.alergias || 'Ninguna registrada'}
            </p>
          </div>
        </div>

        {/* Medicamentos actuales */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ color: '#4caf50', marginTop: '4px', flexShrink: 0 }}>
            <Pill />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
              Medicamentos Actuales
            </p>
            <p style={{ fontSize: '15px', fontWeight: '500', color: '#333' }}>
              {historial.medicamentos_actuales || 'Ninguno'}
            </p>
          </div>
        </div>

        {/* Antecedentes médicos */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ color: '#9c27b0', marginTop: '4px', flexShrink: 0 }}>
            <FileText />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
              Antecedentes Médicos
            </p>
            <p style={{ fontSize: '15px', fontWeight: '500', color: '#333' }}>
              {historial.antecedentes_medicos || 'Ninguno'}
            </p>
          </div>
        </div>
      </div>

      {/* Observaciones generales */}
      {historial.observaciones_generales && (
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          border: '1px solid #90caf9'
        }}>
          <p style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#1565c0',
            marginBottom: '8px'
          }}>
            Observaciones Generales
          </p>
          <p style={{ fontSize: '14px', color: '#0d47a1', lineHeight: '1.5' }}>
            {historial.observaciones_generales}
          </p>
        </div>
      )}
    </div>
  );
};
