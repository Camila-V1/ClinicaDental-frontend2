/**
 * 📝 Modal de Episodio de Atención
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import type { EpisodioAtencion, HistorialClinico } from '@/services/historialClinicoService';

const episodioSchema = z.object({
  historial: z.number({ required_error: 'Seleccione un historial' }),
  fecha_atencion: z.string(),
  motivo_consulta: z.string().min(5, 'Mínimo 5 caracteres'),
  diagnostico: z.string().optional(),
  tratamiento_realizado: z.string().optional(),
  observaciones: z.string().optional(),
  proximo_control: z.string().optional(),
  estado: z.enum(['PENDIENTE', 'EN_CURSO', 'COMPLETADO', 'CANCELADO']).optional(),
});

type EpisodioFormData = z.infer<typeof episodioSchema>;

interface EpisodioModalProps {
  isOpen: boolean;
  onClose: () => void;
  episodio: EpisodioAtencion | null;
  historiales: HistorialClinico[];
  onSubmit: (data: EpisodioFormData) => void;
  isLoading: boolean;
}

export default function EpisodioModal({ isOpen, onClose, episodio, historiales, onSubmit, isLoading }: EpisodioModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<EpisodioFormData>({
    resolver: zodResolver(episodioSchema),
    defaultValues: episodio ? {
      historial: episodio.historial,
      fecha_atencion: episodio.fecha_atencion?.split('T')[0] || new Date().toISOString().split('T')[0],
      motivo_consulta: episodio.motivo_consulta,
      diagnostico: episodio.diagnostico || '',
      tratamiento_realizado: episodio.tratamiento_realizado || '',
      observaciones: episodio.observaciones || '',
      proximo_control: episodio.proximo_control?.split('T')[0] || '',
      estado: episodio.estado,
    } : {
      fecha_atencion: new Date().toISOString().split('T')[0],
      motivo_consulta: '',
      diagnostico: '',
      tratamiento_realizado: '',
      observaciones: '',
      proximo_control: '',
      estado: 'PENDIENTE',
    }
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={episodio ? 'Editar Episodio' : 'Nuevo Episodio de Atención'}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Historial */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Paciente / Historial <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            {...register('historial', { valueAsNumber: true })}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              backgroundColor: 'white',
              outline: 'none',
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          >
            <option value="">Seleccione un historial</option>
            {historiales.map(h => (
              <option key={h.id} value={h.id}>
                {h.paciente_nombre} - #{h.id}
              </option>
            ))}
          </select>
          {errors.historial && (
            <p style={{ marginTop: '4px', fontSize: '12px', color: '#ef4444' }}>
              {errors.historial.message}
            </p>
          )}
        </div>

        {/* Fecha de Atención */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Fecha de Atención <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="date"
            {...register('fecha_atencion')}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              backgroundColor: 'white',
              outline: 'none',
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        {/* Motivo de Consulta */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Motivo de Consulta <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <textarea
            {...register('motivo_consulta')}
            rows={2}
            placeholder="¿Por qué acude el paciente?"
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
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
          {errors.motivo_consulta && (
            <p style={{ marginTop: '4px', fontSize: '12px', color: '#ef4444' }}>
              {errors.motivo_consulta.message}
            </p>
          )}
        </div>

        {/* Diagnóstico */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Diagnóstico
          </label>
          <textarea
            {...register('diagnostico')}
            rows={2}
            placeholder="Diagnóstico clínico"
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
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        {/* Tratamiento Realizado */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Tratamiento Realizado
          </label>
          <textarea
            {...register('tratamiento_realizado')}
            rows={3}
            placeholder="Procedimientos y tratamientos aplicados"
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
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        {/* Observaciones */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Observaciones
          </label>
          <textarea
            {...register('observaciones')}
            rows={2}
            placeholder="Notas adicionales"
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
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        {/* Próximo Control */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            📅 Próximo Control
          </label>
          <input
            type="date"
            {...register('proximo_control')}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              backgroundColor: 'white',
              outline: 'none',
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        {/* Estado */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Estado
          </label>
          <select
            {...register('estado')}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              backgroundColor: 'white',
              outline: 'none',
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          >
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_CURSO">En Curso</option>
            <option value="COMPLETADO">Completado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {episodio ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
