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
      // Priorizar campos backend (nombre/apellido) sobre Django (first_name/last_name)
      first_name: user.nombre || user.first_name || '',
      last_name: user.apellido || user.last_name || '',
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
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Información Básica */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Nombre</label>
            <input
              {...register('first_name')}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            />
            {errors.first_name && (
              <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Apellido</label>
            <input
              {...register('last_name')}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            />
            {errors.last_name && (
              <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.last_name.message}</p>
            )}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Email</label>
          <input
            type="email"
            {...register('email')}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
          />
          {errors.email && (
            <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.email.message}</p>
          )}
        </div>

        {!user && (
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Contraseña</label>
            <input
              type="password"
              {...register('password')}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            />
            {errors.password && (
              <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.password.message}</p>
            )}
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Tipo de Usuario</label>
          <select
            {...register('tipo_usuario')}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', backgroundColor: 'white', cursor: 'pointer' }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
          >
            <option value="ODONTOLOGO">Odontólogo</option>
            <option value="RECEPCIONISTA">Recepcionista</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        {isOdontologo && (
          <>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Especialidad</label>
              <input
                {...register('perfil_odontologo.especialidad')}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                placeholder="Ej: Ortodoncia, Endodoncia"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>N° Licencia</label>
                <input
                  {...register('perfil_odontologo.numero_licencia')}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Teléfono</label>
                <input
                  {...register('perfil_odontologo.telefono')}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                />
              </div>
            </div>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
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
