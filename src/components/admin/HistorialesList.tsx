/**
 * 📋 Lista de Historiales Clínicos
 */

import React from 'react';
import { Loader, FileText, User, Edit, Calendar } from 'lucide-react';
import type { HistorialClinico } from '@/services/historialClinicoService';

interface HistorialesListProps {
  historiales: HistorialClinico[];
  isLoading: boolean;
  onEdit: (historial: HistorialClinico) => void;
}

export default function HistorialesList({ historiales, isLoading, onEdit }: HistorialesListProps) {
  if (isLoading) {
    return (
      <div style={{ padding: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: '#2563eb' }} />
      </div>
    );
  }

  if (historiales.length === 0) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
        <p>No se encontraron historiales clínicos</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      {historiales.map((historial) => (
        <div
          key={historial.id}
          style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px',
            transition: 'all 150ms',
            cursor: 'pointer'
          }}
          onClick={() => onEdit(historial)}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.borderColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <FileText style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <User style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>
                    {historial.paciente_nombre}
                  </h3>
                </div>
                {historial.paciente_email && (
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 8px 24px' }}>
                    {historial.paciente_email}
                  </p>
                )}
                
                {/* Antecedentes */}
                {historial.antecedentes_medicos && (
                  <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#92400e', margin: '0 0 4px 0' }}>
                      Antecedentes Médicos:
                    </p>
                    <p style={{ fontSize: '13px', color: '#78350f', margin: 0 }}>
                      {historial.antecedentes_medicos}
                    </p>
                  </div>
                )}

                {/* Alergias */}
                {historial.alergias && (
                  <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#fee2e2', borderRadius: '8px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#991b1b', margin: '0 0 4px 0' }}>
                      ⚠️ Alergias:
                    </p>
                    <p style={{ fontSize: '13px', color: '#7f1d1d', margin: 0 }}>
                      {historial.alergias}
                    </p>
                  </div>
                )}

                {/* Medicamentos */}
                {historial.medicamentos_actuales && (
                  <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#dbeafe', borderRadius: '8px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#1e40af', margin: '0 0 4px 0' }}>
                      💊 Medicamentos Actuales:
                    </p>
                    <p style={{ fontSize: '13px', color: '#1e3a8a', margin: 0 }}>
                      {historial.medicamentos_actuales}
                    </p>
                  </div>
                )}

                {/* Fecha */}
                {historial.created_at && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
                    <Calendar style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                      Creado: {new Date(historial.created_at).toLocaleDateString('es')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(historial);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                color: '#111827',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 150ms'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <Edit style={{ width: '14px', height: '14px' }} />
              Editar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
