/**
 * 🦷 Lista de Servicios Dentales
 */

import React from 'react';
import { Loader, Edit, Trash2, Stethoscope, DollarSign, Clock } from 'lucide-react';
import type { Servicio, CategoriaServicio } from '@/services/tratamientosService';

interface ServiciosListProps {
  servicios: Servicio[];
  categorias: CategoriaServicio[];
  isLoading: boolean;
  onEdit: (servicio: Servicio) => void;
  onDelete: (id: number) => void;
}

export default function ServiciosList({ servicios, categorias, isLoading, onEdit, onDelete }: ServiciosListProps) {
  const getCategoriaName = (catId: number) => {
    const cat = categorias.find(c => c.id === catId);
    return cat?.nombre || 'Sin categoría';
  };

  if (isLoading) {
    return (
      <div style={{ padding: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: '#2563eb' }} />
      </div>
    );
  }

  if (servicios.length === 0) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
        <p>No hay servicios creados</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            <th style={{ 
              padding: '14px 20px', 
              textAlign: 'left', 
              fontSize: '11px', 
              fontWeight: '600', 
              color: '#64748b', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Servicio
            </th>
            <th style={{ 
              padding: '14px 20px', 
              textAlign: 'left', 
              fontSize: '11px', 
              fontWeight: '600', 
              color: '#64748b', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Categoría
            </th>
            <th style={{ 
              padding: '14px 20px', 
              textAlign: 'left', 
              fontSize: '11px', 
              fontWeight: '600', 
              color: '#64748b', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Precio
            </th>
            <th style={{ 
              padding: '14px 20px', 
              textAlign: 'left', 
              fontSize: '11px', 
              fontWeight: '600', 
              color: '#64748b', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Duración
            </th>
            <th style={{ 
              padding: '14px 20px', 
              textAlign: 'center', 
              fontSize: '11px', 
              fontWeight: '600', 
              color: '#64748b', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {servicios.map((servicio) => (
            <tr 
              key={servicio.id}
              style={{ 
                borderBottom: '1px solid #f1f5f9',
                transition: 'background-color 150ms'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {/* Servicio */}
              <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '10px', 
                    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Stethoscope style={{ width: '20px', height: '20px', color: 'white' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: 0 }}>
                      {servicio.nombre}
                    </p>
                    {servicio.descripcion && (
                      <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0', maxWidth: '300px' }}>
                        {servicio.descripcion}
                      </p>
                    )}
                  </div>
                </div>
              </td>

              {/* Categoría */}
              <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                <span style={{ 
                  padding: '4px 10px', 
                  borderRadius: '6px', 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  backgroundColor: '#f3e8ff', 
                  color: '#7c3aed'
                }}>
                  {servicio.categoria_nombre || getCategoriaName(servicio.categoria)}
                </span>
              </td>

              {/* Precio */}
              <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <DollarSign style={{ width: '14px', height: '14px', color: '#10b981' }} />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>
                    {servicio.precio_base.toLocaleString('es-UY')}
                  </span>
                </div>
              </td>

              {/* Duración */}
              <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                {servicio.duracion_estimada ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>
                      {servicio.duracion_estimada} min
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: '13px', color: '#9ca3af' }}>-</span>
                )}
              </td>

              {/* Acciones */}
              <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <button
                    onClick={() => onEdit(servicio)}
                    style={{ 
                      padding: '6px 12px', 
                      color: '#2563eb', 
                      borderRadius: '6px', 
                      border: '1px solid #bfdbfe', 
                      cursor: 'pointer', 
                      backgroundColor: '#dbeafe',
                      fontSize: '12px',
                      fontWeight: '500',
                      transition: 'all 150ms'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#bfdbfe'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                  >
                    <Edit style={{ width: '14px', height: '14px' }} />
                  </button>
                  
                  <button
                    onClick={() => onDelete(servicio.id)}
                    style={{ 
                      padding: '6px 12px', 
                      color: '#ef4444', 
                      borderRadius: '6px', 
                      border: '1px solid #fecaca', 
                      cursor: 'pointer', 
                      backgroundColor: '#fee2e2',
                      fontSize: '12px',
                      fontWeight: '500',
                      transition: 'all 150ms'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                  >
                    <Trash2 style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
