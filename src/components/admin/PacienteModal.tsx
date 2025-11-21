/**
 * 📝 Modal de Paciente - Crear/Editar
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import type { Usuario, UsuarioFormData } from '@/types/admin';

const pacienteSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres').optional(),
  first_name: z.string().min(2, 'Nombre requerido'),
  last_name: z.string().min(2, 'Apellido requerido'),
  ci: z.string().optional(),
  telefono: z.string().optional(),
  sexo: z.enum(['M', 'F', '']).optional(),
  tipo_usuario: z.literal('PACIENTE'),
  perfil_paciente: z.object({
    fecha_de_nacimiento: z.string().optional(),
    direccion: z.string().optional(),
    grupo_sanguineo: z.string().optional(),
  }).optional(),
});

interface PacienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  paciente: Usuario | null;
  onSubmit: (data: UsuarioFormData) => void;
  isLoading: boolean;
}

export default function PacienteModal({ isOpen, onClose, paciente, onSubmit, isLoading }: PacienteModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<UsuarioFormData>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: paciente ? {
      email: paciente.email,
      first_name: paciente.nombre || paciente.first_name || '',
      last_name: paciente.apellido || paciente.last_name || '',
      ci: paciente.ci || '',
      telefono: paciente.telefono || '',
      sexo: paciente.sexo as any || '',
      tipo_usuario: 'PACIENTE',
      perfil_paciente: {
        fecha_de_nacimiento: paciente.perfil_paciente?.fecha_de_nacimiento || '',
        direccion: paciente.perfil_paciente?.direccion || '',
        grupo_sanguineo: paciente.perfil_paciente?.grupo_sanguineo || '',
      },
    } : {
      tipo_usuario: 'PACIENTE',
      perfil_paciente: {},
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={paciente ? 'Editar Paciente' : 'Nuevo Paciente'} maxWidth="xl">
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Información Básica */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
            Información Básica
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Nombre *
              </label>
              <input
                {...register('first_name')}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  outline: 'none',
                  color: '#111827',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              />
              {errors.first_name && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.first_name.message}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Apellido *
              </label>
              <input
                {...register('last_name')}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  outline: 'none',
                  color: '#111827',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              />
              {errors.last_name && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.last_name.message}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Email *
              </label>
              <input
                type="email"
                {...register('email')}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  outline: 'none',
                  color: '#111827',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              />
              {errors.email && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.email.message}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                CI
              </label>
              <input
                {...register('ci')}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  outline: 'none',
                  color: '#111827',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                placeholder="Cédula de identidad"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Teléfono
              </label>
              <input
                {...register('telefono')}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  outline: 'none',
                  color: '#111827',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                placeholder="Número de teléfono"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Sexo
              </label>
              <select
                {...register('sexo')}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  outline: 'none', 
                  backgroundColor: 'white', 
                  color: '#111827',
                  cursor: 'pointer' 
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              >
                <option value="">Seleccionar...</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
          </div>
        </div>

        {/* Información Médica */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
            Información Médica
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                {...register('perfil_paciente.fecha_de_nacimiento')}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  outline: 'none',
                  color: '#111827',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Grupo Sanguíneo
              </label>
              <select
                {...register('perfil_paciente.grupo_sanguineo')}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  outline: 'none', 
                  backgroundColor: 'white', 
                  color: '#111827',
                  cursor: 'pointer' 
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              >
                <option value="">Seleccionar...</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Dirección
              </label>
              <textarea
                {...register('perfil_paciente.direccion')}
                rows={3}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  outline: 'none',
                  color: '#111827',
                  backgroundColor: 'white',
                  resize: 'vertical'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                placeholder="Dirección completa del paciente"
              />
            </div>
          </div>
        </div>

        {/* Contraseña (solo para nuevos pacientes) */}
        {!paciente && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
              Credenciales
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Contraseña *
                </label>
                <input
                  type="password"
                  {...register('password')}
                  style={{ 
                    width: '100%', 
                    padding: '8px 12px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px', 
                    outline: 'none',
                    color: '#111827',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                  placeholder="Mínimo 8 caracteres"
                />
                {errors.password && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.password.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Botones */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {paciente ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
