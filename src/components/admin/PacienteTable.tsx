/**
 * 🏥 Tabla de Pacientes
 */

import React from 'react';
import { Edit, Power, Loader } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Usuario } from '@/types/admin';

interface PacienteTableProps {
  pacientes: Usuario[];
  isLoading: boolean;
  onEdit: (paciente: Usuario) => void;
  onToggleActive: (paciente: Usuario) => void;
}

// ✅ Función segura para obtener nombre completo
const getFullName = (paciente: Usuario): string => {
  if (paciente.nombre_completo && paciente.nombre_completo.trim()) {
    return paciente.nombre_completo.trim();
  }
  
  if (paciente.full_name && paciente.full_name.trim()) {
    return paciente.full_name.trim();
  }
  
  const nombre = paciente.nombre?.trim() || '';
  const apellido = paciente.apellido?.trim() || '';
  
  if (nombre && apellido) {
    return `${nombre} ${apellido}`;
  }
  
  if (nombre) return nombre;
  if (apellido) return apellido;
  
  const firstName = paciente.first_name?.trim() || '';
  const lastName = paciente.last_name?.trim() || '';
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  
  if (firstName) return firstName;
  if (lastName) return lastName;
  
  return paciente.email || 'Sin nombre';
};

// ✅ Función segura para obtener iniciales
const getInitials = (fullName?: string): string => {
  if (!fullName || typeof fullName !== 'string') {
    return '??';
  }
  
  const trimmed = fullName.trim();
  if (!trimmed) return '??';
  
  const parts = trimmed.split(' ');
  if (parts.length >= 2) {
    const initial1 = parts[0].charAt(0).toUpperCase();
    const initial2 = parts[1].charAt(0).toUpperCase();
    return `${initial1}${initial2}`;
  }
  
  return trimmed.substring(0, 2).toUpperCase();
};

export default function PacienteTable({ pacientes, isLoading, onEdit, onToggleActive }: PacienteTableProps) {
  console.log('📊 [PacienteTable] Renderizando tabla con:', { 
    pacientes, 
    cantidad: pacientes?.length, 
    isLoading,
    primerPaciente: pacientes?.[0]
  });

  if (isLoading) {
    console.log('⏳ [PacienteTable] Mostrando loading...');
    return (
      <div style={{ padding: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: '#2563eb' }} />
      </div>
    );
  }

  if (pacientes.length === 0) {
    console.log('📭 [PacienteTable] No hay pacientes para mostrar');
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
        <p>No se encontraron pacientes</p>
      </div>
    );
  }

  console.log(`✅ [PacienteTable] Renderizando ${pacientes.length} pacientes en tabla`);

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
              Email
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
              Información Personal
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
          {pacientes.map((paciente, index) => {
            console.log(`👤 [PacienteTable] Renderizando paciente ${index}:`, paciente);
            const fullName = getFullName(paciente);
            return (
              <tr 
                key={paciente.id} 
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
                {/* Paciente */}
                <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '44px', 
                      height: '44px', 
                      borderRadius: '10px', 
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                      flexShrink: 0
                    }}>
                      <span style={{ 
                        color: 'white', 
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        {getInitials(fullName)}
                      </span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#0f172a',
                        margin: 0,
                        lineHeight: '1.4'
                      }}>
                        {fullName}
                      </p>
                    </div>
                  </div>
                </td>
                
                {/* Email */}
                <td style={{ 
                  padding: '16px 20px',
                  verticalAlign: 'middle',
                  fontSize: '14px', 
                  color: '#64748b'
                }}>
                  {paciente.email}
                </td>
                
                {/* Información Personal */}
                <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {/* CI */}
                    {paciente.ci && (
                      <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500', lineHeight: '1.4' }}>
                        CI: {paciente.ci}
                      </div>
                    )}
                    
                    {/* Teléfono */}
                    {paciente.telefono && (
                      <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                        📱 {paciente.telefono}
                      </div>
                    )}
                    
                    {/* Fecha de nacimiento */}
                    {paciente.perfil_paciente?.fecha_de_nacimiento && (
                      <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                        🎂 {formatDate(paciente.perfil_paciente.fecha_de_nacimiento)}
                      </div>
                    )}
                  </div>
                </td>
                
                {/* Estado */}
                <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                  <span style={{ 
                    padding: '6px 12px', 
                    borderRadius: '6px', 
                    fontSize: '13px', 
                    fontWeight: '500',
                    backgroundColor: paciente.is_active ? '#ecfdf5' : '#fef2f2',
                    color: paciente.is_active ? '#059669' : '#dc2626',
                    border: `1px solid ${paciente.is_active ? '#a7f3d0' : '#fecaca'}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}>
                    <span style={{ 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: paciente.is_active ? '#059669' : '#dc2626'
                    }} />
                    {paciente.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                
                {/* Acciones */}
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <button
                      onClick={() => onEdit(paciente)}
                      style={{ 
                        padding: '8px', 
                        color: '#3b82f6', 
                        borderRadius: '8px', 
                        border: 'none', 
                        cursor: 'pointer', 
                        backgroundColor: 'transparent',
                        transition: 'background-color 150ms'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#eff6ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      title="Editar paciente"
                    >
                      <Edit style={{ width: '18px', height: '18px' }} />
                    </button>
                    <button
                      onClick={() => onToggleActive(paciente)}
                      style={{ 
                        padding: '8px', 
                        borderRadius: '8px', 
                        border: 'none', 
                        cursor: 'pointer', 
                        backgroundColor: 'transparent',
                        color: paciente.is_active ? '#ef4444' : '#10b981',
                        transition: 'background-color 150ms'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = paciente.is_active ? '#fef2f2' : '#f0fdf4';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      title={paciente.is_active ? 'Desactivar paciente' : 'Activar paciente'}
                    >
                      <Power style={{ width: '18px', height: '18px' }} />
                    </button>
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
