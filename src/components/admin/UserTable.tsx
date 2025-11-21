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
      ODONTOLOGO: { label: 'Odontólogo', bg: '#dbeafe', color: '#1e40af' },
      RECEPCIONISTA: { label: 'Recepcionista', bg: '#d1fae5', color: '#065f46' },
      ADMIN: { label: 'Administrador', bg: '#e9d5ff', color: '#6b21a8' },
      PACIENTE: { label: 'Paciente', bg: '#f3f4f6', color: '#1f2937' },
    };
    const { label, bg, color } = config[tipo] || config.PACIENTE;
    return (
      <span style={{ padding: '4px 8px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: bg, color }}>
        {label}
      </span>
    );
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%' }}>
        <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
          <tr>
            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
              Usuario
            </th>
            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
              Email
            </th>
            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
              Rol
            </th>
            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
              Especialidad
            </th>
            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
              Estado
            </th>
            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
              Registro
            </th>
            <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody style={{ borderTop: '1px solid #e5e7eb' }}>
          {users.map((user, index) => {
            console.log(`👤 [UserTable] Renderizando usuario ${index}:`, user);
            const fullName = getFullName(user);
            return (
              <tr 
                key={user.id} 
                style={{ borderBottom: '1px solid #e5e7eb' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#2563eb', fontWeight: '500' }}>
                      {getInitials(fullName)}
                    </span>
                  </div>
                  <div style={{ marginLeft: '12px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{fullName}</p>
                  </div>
                </div>
              </td>
              <td style={{ padding: '16px 24px', fontSize: '14px', color: '#4b5563' }}>{user.email}</td>
              <td style={{ padding: '16px 24px' }}>{getRoleBadge(user.tipo_usuario)}</td>
              <td style={{ padding: '16px 24px', fontSize: '14px', color: '#4b5563' }}>
                {user.perfil_odontologo?.especialidad || '-'}
              </td>
              <td style={{ padding: '16px 24px' }}>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '9999px', 
                  fontSize: '12px', 
                  fontWeight: '500',
                  backgroundColor: user.is_active ? '#d1fae5' : '#fee2e2',
                  color: user.is_active ? '#065f46' : '#991b1b'
                }}>
                  {user.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td style={{ padding: '16px 24px', fontSize: '14px', color: '#4b5563' }}>
                {formatDate(user.date_joined)}
              </td>
              <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                  <button
                    onClick={() => onEdit(user)}
                    style={{ padding: '8px', color: '#2563eb', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    title="Editar"
                  >
                    <Edit style={{ width: '16px', height: '16px' }} />
                  </button>
                  <button
                    onClick={() => onToggleActive(user)}
                    style={{ 
                      padding: '8px', 
                      borderRadius: '8px', 
                      border: 'none', 
                      cursor: 'pointer', 
                      backgroundColor: 'transparent',
                      color: user.is_active ? '#dc2626' : '#16a34a'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = user.is_active ? '#fef2f2' : '#f0fdf4'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    title={user.is_active ? 'Desactivar' : 'Activar'}
                  >
                    <Power style={{ width: '16px', height: '16px' }} />
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
