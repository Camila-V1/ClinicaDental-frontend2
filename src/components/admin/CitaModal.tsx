/**
 * 📝 Modal de Cita - Crear/Editar (Admin)
 */

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { adminUsuariosService } from '@/services/admin/adminUsuariosService';
import type { Cita } from '@/services/agendaService';
import type { Usuario } from '@/types/admin';

const citaSchema = z.object({
  paciente: z.number().min(1, 'Seleccione un paciente'),
  fecha_hora: z.string().min(1, 'Fecha y hora requeridos'),
  motivo: z.string().min(5, 'Mínimo 5 caracteres'),
  notas: z.string().optional(),
  duracion: z.number().min(15).max(240).optional(),
});

type CitaFormData = z.infer<typeof citaSchema>;

interface CitaModalProps {
  isOpen: boolean;
  onClose: () => void;
  cita: Cita | null;
  onSubmit: (data: CitaFormData) => void;
  isLoading: boolean;
}

export default function CitaModal({ isOpen, onClose, cita, onSubmit, isLoading }: CitaModalProps) {
  const [pacientes, setPacientes] = useState<Usuario[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CitaFormData>({
    resolver: zodResolver(citaSchema),
    defaultValues: cita ? {
      paciente: cita.paciente,
      fecha_hora: cita.fecha_hora,
      motivo: cita.motivo,
      notas: cita.notas || '',
      duracion: cita.duracion || 30,
    } : {
      motivo: '',
      notas: '',
      duracion: 30,
    }
  });

  // Cargar pacientes y odontólogos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadUsuarios();
    }
  }, [isOpen]);

  const loadUsuarios = async () => {
    setLoadingData(true);
    try {
      const resPacientes = await adminUsuariosService.getUsuarios({ tipo_usuario: 'PACIENTE', is_active: 'true' });
      setPacientes(resPacientes || []);
    } catch (error) {
      console.error('Error cargando pacientes:', error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleFormSubmit = (data: CitaFormData) => {
    onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={cita ? 'Editar Cita' : 'Nueva Cita'}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Paciente */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Paciente <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            {...register('paciente', { valueAsNumber: true })}
            disabled={loadingData}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              backgroundColor: 'white',
              outline: 'none',
              transition: 'border-color 150ms',
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          >
            <option value="">Seleccione un paciente</option>
            {pacientes.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre || p.first_name} {p.apellido || p.last_name} - {p.email}
              </option>
            ))}
          </select>
          {errors.paciente && (
            <p style={{ marginTop: '4px', fontSize: '12px', color: '#ef4444' }}>
              {errors.paciente.message}
            </p>
          )}
        </div>

        {/* Odontólogo - Removido, el backend lo asigna */}

        {/* Fecha y Hora */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Fecha y Hora <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="datetime-local"
            {...register('fecha_hora')}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              backgroundColor: 'white',
              outline: 'none',
              transition: 'border-color 150ms',
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
          {errors.fecha_hora && (
            <p style={{ marginTop: '4px', fontSize: '12px', color: '#ef4444' }}>
              {errors.fecha_hora.message}
            </p>
          )}
        </div>

        {/* Duración (minutos) */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Duración (minutos)
          </label>
          <input
            type="number"
            {...register('duracion', { valueAsNumber: true })}
            min={15}
            max={240}
            step={15}
            placeholder="30"
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              backgroundColor: 'white',
              outline: 'none',
              transition: 'border-color 150ms',
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
          {errors.duracion && (
            <p style={{ marginTop: '4px', fontSize: '12px', color: '#ef4444' }}>
              {errors.duracion.message}
            </p>
          )}
        </div>

        {/* Motivo */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Motivo <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <textarea
            {...register('motivo')}
            rows={3}
            placeholder="Describe el motivo de la cita"
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              backgroundColor: 'white',
              outline: 'none',
              resize: 'vertical',
              transition: 'border-color 150ms',
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
          {errors.motivo && (
            <p style={{ marginTop: '4px', fontSize: '12px', color: '#ef4444' }}>
              {errors.motivo.message}
            </p>
          )}
        </div>

        {/* Notas Adicionales */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Notas Adicionales
          </label>
          <textarea
            {...register('notas')}
            rows={2}
            placeholder="Notas u observaciones opcionales"
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              backgroundColor: 'white',
              outline: 'none',
              resize: 'vertical',
              transition: 'border-color 150ms',
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            disabled={isLoading}
            style={{ minWidth: '100px' }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading || loadingData}
            style={{ minWidth: '100px' }}
          >
            {cita ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
