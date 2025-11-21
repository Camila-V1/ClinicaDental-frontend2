/**
 * 👥 Página Gestión de Usuarios
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminUsuariosService } from '@/services/admin/adminUsuariosService';
import UserTable from '@/components/admin/UserTable';
import UserModal from '@/components/admin/UserModal';
import Button from '@/components/ui/Button';
import type { Usuario, UsuarioFormData } from '@/types/admin';

export default function Usuarios() {
  console.log('👥 [Usuarios] Componente montado');
  
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [filters, setFilters] = useState({
    tipo_usuario: 'ODONTOLOGO',
    is_active: 'true',
    search: '',
  });

  // Log de cambios en filtros
  React.useEffect(() => {
    console.log('🔍 [Usuarios] Filtros actualizados:', filters);
  }, [filters]);

  // Fetch usuarios
  const { data, isLoading, error } = useQuery({
    queryKey: ['usuarios-admin', filters],
    queryFn: async () => {
      console.log('📡 [Usuarios] Fetching usuarios con filtros:', filters);
      try {
        const result = await adminUsuariosService.getUsuarios(filters);
        console.log('✅ [Usuarios] Usuarios obtenidos:', result);
        return result;
      } catch (error) {
        console.error('❌ [Usuarios] Error obteniendo usuarios:', error);
        throw error;
      }
    },
  });

  // Log de errores
  React.useEffect(() => {
    if (error) {
      console.error('🔴 [Usuarios] Error en query:', error);
    }
  }, [error]);

  // Crear/Editar usuario
  const mutation = useMutation({
    mutationFn: (userData: UsuarioFormData) => {
      console.log('💾 [Usuarios] Guardando usuario:', { selectedUser: selectedUser?.id, userData });
      return selectedUser 
        ? adminUsuariosService.updateUsuario(selectedUser.id, userData, selectedUser.tipo_usuario)
        : adminUsuariosService.createUsuario(userData);
    },
    onSuccess: (data) => {
      console.log('✅ [Usuarios] Usuario guardado exitosamente:', data);
      queryClient.invalidateQueries({ queryKey: ['usuarios-admin'] });
      setIsModalOpen(false);
      setSelectedUser(null);
      toast.success(selectedUser ? 'Usuario actualizado' : 'Usuario creado');
    },
    onError: (error: any) => {
      console.error('❌ [Usuarios] Error guardando usuario:', error);
      console.error('❌ [Usuarios] Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Error al guardar usuario');
    },
  });

  // Toggle activo/inactivo
  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, is_active, tipo_usuario }: { id: number; is_active: boolean; tipo_usuario?: string }) => {
      console.log('🔄 [Usuarios] Toggle activo:', { id, is_active, tipo_usuario });
      return adminUsuariosService.toggleActivo(id, is_active, tipo_usuario);
    },
    onSuccess: (data) => {
      console.log('✅ [Usuarios] Estado actualizado:', data);
      queryClient.invalidateQueries({ queryKey: ['usuarios-admin'] });
      toast.success('Estado actualizado');
    },
    onError: (error: any) => {
      console.error('❌ [Usuarios] Error en toggle activo:', error);
      toast.error('Error al cambiar estado');
    },
  });

  const handleEdit = (user: Usuario) => {
    console.log('✏️ [Usuarios] Editando usuario:', user);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    console.log('➕ [Usuarios] Creando nuevo usuario');
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleToggleActive = (user: Usuario) => {
    console.log('🔄 [Usuarios] Iniciando toggle para usuario:', user);
    toggleActiveMutation.mutate({
      id: user.id,
      is_active: !user.is_active,
      tipo_usuario: user.tipo_usuario,
    });
  };

  console.log('🎨 [Usuarios] Renderizando página con:', { 
    data, 
    cantidad: data?.length,
    isLoading,
    filters 
  });

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
          Gestión de Usuarios
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          Administra el equipo de trabajo: odontólogos, recepcionistas y administradores
        </p>
      </div>

      {/* Filtros y Acciones */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', 
        padding: '20px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Filtros</h2>
          <Button onClick={handleCreate} size="sm">
            <Plus style={{ width: '16px', height: '16px', marginRight: '6px' }} />
            Nuevo Usuario
          </Button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {/* Búsqueda */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Buscar
            </label>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Nombre o email..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                style={{ 
                  width: '100%', 
                  paddingLeft: '38px', 
                  paddingRight: '12px', 
                  paddingTop: '10px', 
                  paddingBottom: '10px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px', 
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 150ms',
                  color: '#111827', // Asegurar color de texto oscuro
                  backgroundColor: 'white'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Tipo de Usuario */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Tipo de Usuario
            </label>
            <select
              value={filters.tipo_usuario}
              onChange={(e) => setFilters({ ...filters, tipo_usuario: e.target.value })}
              style={{ 
                width: '100%',
                padding: '10px 12px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                fontSize: '14px', 
                outline: 'none', 
                backgroundColor: 'white', 
                color: '#111827', // Asegurar color de texto oscuro
                cursor: 'pointer',
                transition: 'border-color 150ms'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="ODONTOLOGO">Odontólogos</option>
              <option value="RECEPCIONISTA">Recepcionistas</option>
              <option value="ADMIN">Administradores</option>
            </select>
          </div>

          {/* Estado */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Estado
            </label>
            <select
              value={filters.is_active}
              onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
              style={{ 
                width: '100%',
                padding: '10px 12px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                fontSize: '14px', 
                outline: 'none', 
                backgroundColor: 'white', 
                color: '#111827', // Asegurar color de texto oscuro
                cursor: 'pointer',
                transition: 'border-color 150ms'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>

          {/* Botón Limpiar */}
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => setFilters({ tipo_usuario: 'ODONTOLOGO', is_active: 'true', search: '' })}
              style={{ 
                width: '100%',
                padding: '10px 16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                fontSize: '14px', 
                fontWeight: '500',
                backgroundColor: 'white', 
                color: '#6b7280',
                cursor: 'pointer', 
                transition: 'all 150ms'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
            {filters.tipo_usuario === 'ODONTOLOGO' && 'Odontólogos'}
            {filters.tipo_usuario === 'RECEPCIONISTA' && 'Recepcionistas'}
            {filters.tipo_usuario === 'ADMIN' && 'Administradores'}
            {!filters.tipo_usuario && 'Todos los Usuarios'}
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
            {data?.length || 0} usuario{data?.length !== 1 ? 's' : ''} encontrado{data?.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <UserTable
          users={data || []}
          isLoading={isLoading}
          onEdit={handleEdit}
          onToggleActive={handleToggleActive}
        />
      </div>

      {/* Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSubmit={(data) => mutation.mutate(data)}
        isLoading={mutation.isPending}
      />
    </div>
  );
}
