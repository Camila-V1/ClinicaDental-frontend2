/**
 * 📝 Modal de Categoría
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import type { CategoriaServicio } from '@/services/tratamientosService';

const categoriaSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  descripcion: z.string().optional(),
});

type CategoriaFormData = z.infer<typeof categoriaSchema>;

interface CategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoria: CategoriaServicio | null;
  onSubmit: (data: CategoriaFormData) => void;
  isLoading: boolean;
}

export default function CategoriaModal({ isOpen, onClose, categoria, onSubmit, isLoading }: CategoriaModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: categoria ? {
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || '',
    } : {
      nombre: '',
      descripcion: '',
    }
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={categoria ? 'Editar Categoría' : 'Nueva Categoría'}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Nombre */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Nombre <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            {...register('nombre')}
            placeholder="Ej: Ortodoncia, Endodoncia"
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

        {/* Descripción */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Descripción
          </label>
          <textarea
            {...register('descripcion')}
            rows={3}
            placeholder="Descripción opcional de la categoría"
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
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {categoria ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
