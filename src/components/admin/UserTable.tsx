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

export default function UserTable({ users, isLoading, onEdit, onToggleActive }: UserTableProps) {
  if (isLoading) {
    return (
      <div className="p-12 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No se encontraron usuarios</p>
      </div>
    );
  }

  const getRoleBadge = (tipo: string) => {
    const config = {
      ODONTOLOGO: { label: 'Odontólogo', color: 'bg-blue-100 text-blue-800' },
      RECEPCIONISTA: { label: 'Recepcionista', color: 'bg-green-100 text-green-800' },
      ADMIN: { label: 'Administrador', color: 'bg-purple-100 text-purple-800' },
      PACIENTE: { label: 'Paciente', color: 'bg-gray-100 text-gray-800' },
    };
    const { label, color } = config[tipo] || config.PACIENTE;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Usuario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Rol
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Especialidad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Registro
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {user.full_name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
              <td className="px-6 py-4">{getRoleBadge(user.tipo_usuario)}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {user.perfil_odontologo?.especialidad || '-'}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {formatDate(user.date_joined)}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onToggleActive(user)}
                    className={`p-2 rounded-lg ${
                      user.is_active 
                        ? 'text-red-600 hover:bg-red-50' 
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={user.is_active ? 'Desactivar' : 'Activar'}
                  >
                    <Power className="w-4 h-4" />
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
