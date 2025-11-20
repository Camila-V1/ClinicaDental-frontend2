/**
 * 📝 Modal de Usuario - Crear/Editar
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import type { Usuario, UsuarioFormData } from '@/types/admin';

const userSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres').optional(),
  first_name: z.string().min(2, 'Nombre requerido'),
  last_name: z.string().min(2, 'Apellido requerido'),
  tipo_usuario: z.enum(['ADMIN', 'ODONTOLOGO', 'RECEPCIONISTA']),
  perfil_odontologo: z.object({
    especialidad: z.string().optional(),
    numero_licencia: z.string().optional(),
    telefono: z.string().optional(),
  }).optional(),
});

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Usuario | null;
  onSubmit: (data: UsuarioFormData) => void;
  isLoading: boolean;
}

export default function UserModal({ isOpen, onClose, user, onSubmit, isLoading }: UserModalProps) {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<UsuarioFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user ? {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      tipo_usuario: user.tipo_usuario as any,
      perfil_odontologo: user.perfil_odontologo,
    } : {
      tipo_usuario: 'ODONTOLOGO',
    },
  });

  const tipoUsuario = watch('tipo_usuario');
  const isOdontologo = tipoUsuario === 'ODONTOLOGO';

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={user ? 'Editar Usuario' : 'Nuevo Usuario'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Información Básica */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              {...register('first_name')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
            <input
              {...register('last_name')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {!user && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Usuario</label>
          <select
            {...register('tipo_usuario')}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="ODONTOLOGO">Odontólogo</option>
            <option value="RECEPCIONISTA">Recepcionista</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        {isOdontologo && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
              <input
                {...register('perfil_odontologo.especialidad')}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Ej: Ortodoncia, Endodoncia"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">N° Licencia</label>
                <input
                  {...register('perfil_odontologo.numero_licencia')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  {...register('perfil_odontologo.telefono')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {user ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
