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
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827' }}>Equipo de Trabajo</h1>
          <p style={{ color: '#6b7280' }}>Gestiona odontólogos, recepcionistas y administradores</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus style={{ width: '20px', height: '20px', marginRight: '8px' }} />
          Nuevo Usuario
        </Button>
      </div>

      {/* Filtros */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              style={{ width: '100%', paddingLeft: '40px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            />
          </div>

          <select
            value={filters.tipo_usuario}
            onChange={(e) => setFilters({ ...filters, tipo_usuario: e.target.value })}
            style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: 'white', cursor: 'pointer' }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
          >
            <option value="ODONTOLOGO">Odontólogos</option>
            <option value="RECEPCIONISTA">Recepcionistas</option>
            <option value="ADMIN">Administradores</option>
          </select>

          <select
            value={filters.is_active}
            onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
            style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: 'white', cursor: 'pointer' }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
          >
            <option value="">Todos los estados</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>

          <button
            onClick={() => setFilters({ tipo_usuario: 'ODONTOLOGO', is_active: 'true', search: '' })}
            style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', backgroundColor: 'white', cursor: 'pointer', transition: 'background-color 150ms' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
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
