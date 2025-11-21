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
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [filters, setFilters] = useState({
    tipo_usuario: 'ODONTOLOGO',
    is_active: 'true',
    search: '',
  });

  // Fetch usuarios
  const { data, isLoading } = useQuery({
    queryKey: ['usuarios-admin', filters],
    queryFn: () => adminUsuariosService.getUsuarios(filters),
  });

  // Crear/Editar usuario
  const mutation = useMutation({
    mutationFn: (userData: UsuarioFormData) => 
      selectedUser 
        ? adminUsuariosService.updateUsuario(selectedUser.id, userData, selectedUser.tipo_usuario)
        : adminUsuariosService.createUsuario(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios-admin'] });
      setIsModalOpen(false);
      setSelectedUser(null);
      toast.success(selectedUser ? 'Usuario actualizado' : 'Usuario creado');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al guardar usuario');
    },
  });

  // Toggle activo/inactivo
  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, is_active, tipo_usuario }: { id: number; is_active: boolean; tipo_usuario?: string }) =>
      adminUsuariosService.toggleActivo(id, is_active, tipo_usuario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios-admin'] });
      toast.success('Estado actualizado');
    },
  });

  const handleEdit = (user: Usuario) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleToggleActive = (user: Usuario) => {
    toggleActiveMutation.mutate({
      id: user.id,
      is_active: !user.is_active,
      tipo_usuario: user.tipo_usuario,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipo de Trabajo</h1>
          <p className="text-gray-600">Gestiona odontólogos, recepcionistas y administradores</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <select
            value={filters.tipo_usuario}
            onChange={(e) => setFilters({ ...filters, tipo_usuario: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="ODONTOLOGO">Odontólogos</option>
            <option value="RECEPCIONISTA">Recepcionistas</option>
            <option value="ADMIN">Administradores</option>
          </select>

          <select
            value={filters.is_active}
            onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Todos los estados</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>

          <button
            onClick={() => setFilters({ tipo_usuario: '', is_active: 'true', search: '' })}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow">
        <UserTable
          users={data?.results || []}
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
