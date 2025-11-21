/**
 * 📋 Lista de Citas (Admin)
 */

import React from 'react';
import { Loader, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import type { Cita } from '@/services/agendaService';

interface CitasListProps {
  citas: Cita[];
  isLoading: boolean;
  onEdit: (cita: Cita) => void;
  onAtender: (citaId: number) => void;
  onCancelar: (citaId: number) => void;
}

export default function CitasList({
  citas,
  isLoading,
  onEdit,
  onAtender,
  onCancelar
}: CitasListProps) {
  
  const getEstadoBadge = (estado: string) => {
    const config = {
      PENDIENTE: { label: 'Pendiente', bg: '#fef3c7', color: '#f59e0b', border: '#fde68a' },
      CONFIRMADA: { label: 'Confirmada', bg: '#dbeafe', color: '#3b82f6', border: '#bfdbfe' },
      ATENDIDA: { label: 'Atendida', bg: '#d1fae5', color: '#10b981', border: '#a7f3d0' },
      COMPLETADA: { label: 'Completada', bg: '#d1fae5', color: '#10b981', border: '#a7f3d0' },
      CANCELADA: { label: 'Cancelada', bg: '#fee2e2', color: '#ef4444', border: '#fecaca' },
    };
    const { label, bg, color, border } = config[estado] || config.PENDIENTE;
    return (
      <span style={{ 
        padding: '6px 12px', 
        borderRadius: '6px', 
        fontSize: '13px', 
        fontWeight: '500', 
        backgroundColor: bg, 
        color,
        border: `1px solid ${border}`,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span style={{ 
          width: '6px', 
          height: '6px', 
          borderRadius: '50%', 
          backgroundColor: color
        }} />
        {label}
      </span>
    );
  };

  const formatFechaHora = (fechaHora: string) => {
    const date = new Date(fechaHora);
    return {
      fecha: date.toLocaleDateString('es', { year: 'numeric', month: 'short', day: 'numeric' }),
      hora: date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (isLoading) {
    return (
      <div style={{ padding: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: '#2563eb' }} />
      </div>
    );
  }

  if (citas.length === 0) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
        <p>No se encontraron citas</p>
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
              Fecha y Hora
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
              Paciente
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
              Odontólogo
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
              Motivo
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
              Estado
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
          {citas.map((cita) => {
            const { fecha, hora } = formatFechaHora(cita.fecha_hora);
            return (
              <tr 
                key={cita.id} 
                style={{ 
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'background-color 150ms'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {/* Fecha y Hora */}
                <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: 0 }}>
                        {hora}
                      </p>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                        {fecha}
                      </p>
                    </div>
                  </div>
                </td>
                
                {/* Paciente */}
                <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '8px', 
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <User style={{ width: '18px', height: '18px', color: 'white' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: 0 }}>
                        {cita.paciente_nombre}
                      </p>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                        {cita.paciente_email}
                      </p>
                    </div>
                  </div>
                </td>
                
                {/* Odontólogo */}
                <td style={{ padding: '16px 20px', verticalAlign: 'middle', fontSize: '14px', color: '#64748b' }}>
                  {cita.odontologo_nombre || 'No asignado'}
                </td>
                
                {/* Motivo */}
                <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                  <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {cita.motivo}
                  </p>
                  {cita.notas && (
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                      {cita.notas}
                    </p>
                  )}
                </td>
                
                {/* Estado */}
                <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                  {getEstadoBadge(cita.estado)}
                </td>
                
                {/* Acciones */}
                <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    {(cita.estado === 'PENDIENTE' || cita.estado === 'CONFIRMADA') && (
                      <button
                        onClick={() => onAtender(cita.id)}
                        style={{ 
                          padding: '6px 12px', 
                          color: '#10b981', 
                          borderRadius: '6px', 
                          border: '1px solid #a7f3d0', 
                          cursor: 'pointer', 
                          backgroundColor: '#d1fae5',
                          fontSize: '12px',
                          fontWeight: '500',
                          transition: 'all 150ms'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#a7f3d0';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#d1fae5';
                        }}
                        title="Atender cita"
                      >
                        <CheckCircle style={{ width: '14px', height: '14px' }} />
                      </button>
                    )}
                    
                    {cita.estado !== 'CANCELADA' && cita.estado !== 'ATENDIDA' && cita.estado !== 'COMPLETADA' && (
                      <button
                        onClick={() => onCancelar(cita.id)}
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
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fecaca';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#fee2e2';
                        }}
                        title="Cancelar cita"
                      >
                        <XCircle style={{ width: '14px', height: '14px' }} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
