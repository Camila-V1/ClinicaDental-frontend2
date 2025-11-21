/**
 * 👥 Tabla de Usuarios
 */

import React from 'react';
import { Edit, Power, Loader } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Usuario } from '@/types/admin';

interface UserTableProps {
  users: Usuario[];
  isLoading: boolean;
  onEdit: (user: Usuario) => void;
  onToggleActive: (user: Usuario) => void;
}

// ✅ Función segura para obtener nombre completo
const getFullName = (user: Usuario): string => {
  // Prioridad 1: nombre_completo del backend (nuevo campo)
  if (user.nombre_completo && user.nombre_completo.trim()) {
    console.log('✅ [getFullName] Usando nombre_completo:', user.nombre_completo);
    return user.nombre_completo.trim();
  }
  
  // Prioridad 2: full_name (campo antiguo, por compatibilidad)
  if (user.full_name && user.full_name.trim()) {
    console.log('⚠️ [getFullName] Usando full_name (campo antiguo):', user.full_name);
    return user.full_name.trim();
  }
  
  // Prioridad 3: Construir desde nombre + apellido (campos backend)
  const nombre = user.nombre?.trim() || '';
  const apellido = user.apellido?.trim() || '';
  
  if (nombre && apellido) {
    console.log('🔧 [getFullName] Construido desde nombre+apellido:', `${nombre} ${apellido}`);
    return `${nombre} ${apellido}`;
  }
  
  if (nombre) return nombre;
  if (apellido) return apellido;
  
  // Prioridad 4: Construir desde first_name + last_name (campos Django)
  const firstName = user.first_name?.trim() || '';
  const lastName = user.last_name?.trim() || '';
  
  if (firstName && lastName) {
    console.log('🔧 [getFullName] Construido desde first_name+last_name:', `${firstName} ${lastName}`);
    return `${firstName} ${lastName}`;
  }
  
  if (firstName) return firstName;
  if (lastName) return lastName;
  
  // Fallback final: email
  console.warn('⚠️ [getFullName] No hay nombre disponible, usando email:', user.email);
  return user.email || 'Sin nombre';
};

// ✅ Función segura para obtener iniciales (previene error de charAt en undefined)
const getInitials = (fullName?: string): string => {
  if (!fullName || typeof fullName !== 'string') {
    console.warn('⚠️ [getInitials] fullName es undefined o inválido:', fullName);
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
  
  // Si solo hay una palabra, tomar las primeras dos letras
  return trimmed.substring(0, 2).toUpperCase();
};

export default function UserTable({ users, isLoading, onEdit, onToggleActive }: UserTableProps) {
  console.log('📊 [UserTable] Renderizando tabla con:', { 
    users, 
    cantidad: users?.length, 
    isLoading,
    primerUsuario: users?.[0]
  });
  
  console.log('🔍 [UserTable] Detalles completos del primer usuario:', {
    id: users?.[0]?.id,
    nombre_completo: users?.[0]?.nombre_completo,
    email: users?.[0]?.email,
    tipo_usuario: users?.[0]?.tipo_usuario,
    especialidad: users?.[0]?.especialidad,
    cedula_profesional: users?.[0]?.cedula_profesional,
    telefono: users?.[0]?.telefono,
    is_active: users?.[0]?.is_active,
    date_joined: users?.[0]?.date_joined,
    perfil_odontologo: users?.[0]?.perfil_odontologo
  });

  if (isLoading) {
    console.log('⏳ [UserTable] Mostrando loading...');
    return (
      <div style={{ padding: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: '#2563eb' }} />
      </div>
    );
  }

  if (users.length === 0) {
    console.log('📭 [UserTable] No hay usuarios para mostrar');
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
        <p>No se encontraron usuarios</p>
      </div>
    );
  }

  console.log(`✅ [UserTable] Renderizando ${users.length} usuarios en tabla`);

  const getRoleBadge = (tipo: string) => {
    const config = {
      ODONTOLOGO: { label: 'Odontólogo', bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
      RECEPCIONISTA: { label: 'Recepcionista', bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' },
      ADMIN: { label: 'Administrador', bg: '#faf5ff', color: '#6b21a8', border: '#e9d5ff' },
      PACIENTE: { label: 'Paciente', bg: '#f9fafb', color: '#374151', border: '#e5e7eb' },
    };
    const { label, bg, color, border } = config[tipo] || config.PACIENTE;
    return (
      <span style={{ 
        padding: '6px 12px', 
        borderRadius: '6px', 
        fontSize: '13px', 
        fontWeight: '500', 
        backgroundColor: bg, 
        color,
        border: `1px solid ${border}`,
        display: 'inline-block'
      }}>
        {label}
      </span>
    );
  };

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
              Usuario
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
              Rol
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
              Info Profesional
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
          {users.map((user, index) => {
            console.log(`👤 [UserTable] Renderizando usuario ${index}:`, user);
            console.log(`📋 [UserTable] Especialidad:`, {
              directa: user.especialidad,
              perfil: user.perfil_odontologo?.especialidad,
              cedula: user.cedula_profesional,
              telefono: user.telefono
            });
            const fullName = getFullName(user);
            return (
              <tr 
                key={user.id} 
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
                {/* Usuario */}
                <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '44px', 
                      height: '44px', 
                      borderRadius: '10px', 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.25)',
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
                  {user.email}
                </td>
                
                {/* Rol */}
                <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                  {getRoleBadge(user.tipo_usuario)}
                </td>
                
                {/* Info Profesional */}
                <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {/* Especialidad */}
                    {(user.especialidad || user.perfil_odontologo?.especialidad) ? (
                      <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500', lineHeight: '1.4' }}>
                        {user.especialidad || user.perfil_odontologo?.especialidad}
                      </div>
                    ) : (
                      <div style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>
                        Sin especialidad
                      </div>
                    )}
                    
                    {/* Cédula Profesional */}
                    {user.cedula_profesional && (
                      <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                        <span style={{ fontWeight: '500' }}>Cédula:</span> {user.cedula_profesional}
                      </div>
                    )}
                    
                    {/* Teléfono */}
                    {(user.telefono || user.perfil_odontologo?.telefono) && (
                      <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                        📱 {user.telefono || user.perfil_odontologo?.telefono}
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
                    backgroundColor: user.is_active ? '#ecfdf5' : '#fef2f2',
                    color: user.is_active ? '#059669' : '#dc2626',
                    border: `1px solid ${user.is_active ? '#a7f3d0' : '#fecaca'}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}>
                    <span style={{ 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: user.is_active ? '#059669' : '#dc2626'
                    }} />
                    {user.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                
                {/* Acciones */}
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <button
                      onClick={() => onEdit(user)}
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
                      title="Editar usuario"
                    >
                      <Edit style={{ width: '18px', height: '18px' }} />
                    </button>
                    <button
                      onClick={() => onToggleActive(user)}
                      style={{ 
                        padding: '8px', 
                        borderRadius: '8px', 
                        border: 'none', 
                        cursor: 'pointer', 
                        backgroundColor: 'transparent',
                        color: user.is_active ? '#ef4444' : '#10b981',
                        transition: 'background-color 150ms'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = user.is_active ? '#fef2f2' : '#f0fdf4';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      title={user.is_active ? 'Desactivar usuario' : 'Activar usuario'}
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
