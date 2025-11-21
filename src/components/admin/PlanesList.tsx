/**
 * 📋 Lista de Planes de Tratamiento
 */

import React from 'react';
import { Loader, FileText, User, Calendar } from 'lucide-react';
import type { PlanTratamiento } from '@/services/tratamientosService';

interface PlanesListProps {
  planes: PlanTratamiento[];
  isLoading: boolean;
}

export default function PlanesList({ planes, isLoading }: PlanesListProps) {
  const getEstadoBadge = (estado: string) => {
    const config = {
      BORRADOR: { label: 'Borrador', bg: '#f3f4f6', color: '#6b7280' },
      PROPUESTO: { label: 'Propuesto', bg: '#dbeafe', color: '#2563eb' },
      ACEPTADO: { label: 'Aceptado', bg: '#d1fae5', color: '#10b981' },
      EN_CURSO: { label: 'En Curso', bg: '#fef3c7', color: '#f59e0b' },
      COMPLETADO: { label: 'Completado', bg: '#d1fae5', color: '#059669' },
      CANCELADO: { label: 'Cancelado', bg: '#fee2e2', color: '#ef4444' },
    };
    const { label, bg, color } = config[estado] || config.BORRADOR;
    return (
      <span style={{ 
        padding: '6px 12px', 
        borderRadius: '6px', 
        fontSize: '12px', 
        fontWeight: '500', 
        backgroundColor: bg, 
        color
      }}>
        {label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div style={{ padding: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: '#2563eb' }} />
      </div>
    );
  }

  if (planes.length === 0) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
        <p>No hay planes de tratamiento</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      {planes.map((plan) => (
        <div
          key={plan.id}
          style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px',
            transition: 'all 150ms',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.borderColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <FileText style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
                  {plan.titulo}
                </h3>
                {plan.descripcion && (
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                    {plan.descripcion}
                  </p>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>
                      {plan.paciente_nombre}
                    </span>
                  </div>
                  {plan.fecha_inicio && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>
                        {new Date(plan.fecha_inicio).toLocaleDateString('es')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              {getEstadoBadge(plan.estado)}
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>
                ${plan.total.toLocaleString('es-UY')}
              </div>
              {plan.items && plan.items.length > 0 && (
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {plan.items.length} item{plan.items.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>

          {/* Items del plan */}
          {plan.items && plan.items.length > 0 && (
            <div style={{ 
              marginTop: '16px', 
              paddingTop: '16px', 
              borderTop: '1px solid #f1f5f9'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                ITEMS DEL PLAN
              </div>
              <div style={{ display: 'grid', gap: '8px' }}>
                {plan.items.slice(0, 3).map((item) => (
                  <div 
                    key={item.id}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '8px 12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px'
                    }}
                  >
                    <span style={{ fontSize: '13px', color: '#0f172a' }}>
                      {item.servicio_nombre}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#10b981' }}>
                      ${item.subtotal.toLocaleString('es-UY')}
                    </span>
                  </div>
                ))}
                {plan.items.length > 3 && (
                  <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', padding: '4px' }}>
                    +{plan.items.length - 3} más
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
