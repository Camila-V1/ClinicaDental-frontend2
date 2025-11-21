/**
 * 📝 Modal de Servicio Dental
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import type { Servicio, CategoriaServicio } from '@/services/tratamientosService';

const servicioSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  descripcion: z.string().optional(),
  categoria: z.number({ required_error: 'Seleccione una categoría' }),
  precio_base: z.number().min(0, 'El precio debe ser mayor a 0'),
  duracion_estimada: z.number().min(0).optional(),
  activo: z.boolean().optional(),
});

type ServicioFormData = z.infer<typeof servicioSchema>;

interface ServicioModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicio: Servicio | null;
  categorias: CategoriaServicio[];
  onSubmit: (data: ServicioFormData) => void;
  isLoading: boolean;
}

export default function ServicioModal({ isOpen, onClose, servicio, categorias, onSubmit, isLoading }: ServicioModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ServicioFormData>({
    resolver: zodResolver(servicioSchema),
    defaultValues: servicio ? {
      nombre: servicio.nombre,
      descripcion: servicio.descripcion || '',
      categoria: servicio.categoria,
      precio_base: servicio.precio_base,
      duracion_estimada: servicio.duracion_estimada || 30,
      activo: servicio.activo,
    } : {
      nombre: '',
      descripcion: '',
      precio_base: 0,
      duracion_estimada: 30,
      activo: true,
    }
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={servicio ? 'Editar Servicio' : 'Nuevo Servicio'}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Nombre */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Nombre del Servicio <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            {...register('nombre')}
            placeholder="Ej: Limpieza dental, Extracción"
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
          {errors.nombre && (
            <p style={{ marginTop: '4px', fontSize: '12px', color: '#ef4444' }}>
              {errors.nombre.message}
            </p>
          )}
        </div>

        {/* Categoría */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Categoría <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            {...register('categoria', { valueAsNumber: true })}
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
            <option value="">Seleccione una categoría</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
          {errors.categoria && (
            <p style={{ marginTop: '4px', fontSize: '12px', color: '#ef4444' }}>
              {errors.categoria.message}
            </p>
          )}
        </div>

        {/* Precio Base */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Precio Base ($) <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="number"
            step="0.01"
            {...register('precio_base', { valueAsNumber: true })}
            placeholder="0.00"
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
          {errors.precio_base && (
            <p style={{ marginTop: '4px', fontSize: '12px', color: '#ef4444' }}>
              {errors.precio_base.message}
            </p>
          )}
        </div>

        {/* Duración Estimada */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Duración Estimada (minutos)
          </label>
          <input
            type="number"
            {...register('duracion_estimada', { valueAsNumber: true })}
            placeholder="30"
            min={0}
            step={15}
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
        </div>

        {/* Descripción */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Descripción
          </label>
          <textarea
            {...register('descripcion')}
            rows={3}
            placeholder="Descripción detallada del servicio"
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

        {/* Activo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            {...register('activo')}
            id="activo"
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <label htmlFor="activo" style={{ fontSize: '14px', color: '#111827', cursor: 'pointer' }}>
            Servicio activo
          </label>
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
            {servicio ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
