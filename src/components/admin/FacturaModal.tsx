/**
 * 📄 Modal de Factura - Admin
 */

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import pacientesService from '@/services/pacientesService';
import type { Factura, FacturaCreateData } from '@/services/facturacionAdminService';

const facturaSchema = z.object({
  paciente: z.number({ message: 'Seleccione un paciente' }),
  plan_tratamiento: z.number().optional(),
  fecha_emision: z.string(),
  fecha_vencimiento: z.string(),
  descuento: z.string().optional(),
  notas: z.string().optional(),
  items: z.array(z.object({
    descripcion: z.string().min(3, 'Mínimo 3 caracteres'),
    cantidad: z.number().min(1, 'Mínimo 1'),
    precio_unitario: z.string(),
  })).min(1, 'Agregue al menos un item'),
});

type FacturaFormData = z.infer<typeof facturaSchema>;

interface FacturaModalProps {
  isOpen: boolean;
  onClose: () => void;
  factura: Factura | null;
  onSubmit: (data: FacturaCreateData) => void;
  isLoading: boolean;
}

export default function FacturaModal({ isOpen, onClose, factura, onSubmit, isLoading }: FacturaModalProps) {
  const { register, handleSubmit, formState: { errors }, reset, control, watch } = useForm<FacturaFormData>({
    resolver: zodResolver(facturaSchema),
    defaultValues: factura ? {
      paciente: factura.paciente,
      plan_tratamiento: factura.plan_tratamiento,
      fecha_emision: factura.fecha_emision.split('T')[0],
      fecha_vencimiento: factura.fecha_vencimiento.split('T')[0],
      descuento: factura.descuento || '0.00',
      notas: factura.notas || '',
      items: factura.items || [],
    } : {
      fecha_emision: new Date().toISOString().split('T')[0],
      fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      descuento: '0.00',
      items: [{ descripcion: '', cantidad: 1, precio_unitario: '0.00' }],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');
  const descuento = watch('descuento') || '0.00';

  const { data: pacientesData } = useQuery({
    queryKey: ['pacientes'],
    queryFn: () => pacientesService.getPacientes(),
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const calcularSubtotal = () => {
    return items.reduce((sum, item) => {
      const cantidad = item.cantidad || 0;
      const precio = parseFloat(item.precio_unitario || '0');
      return sum + (cantidad * precio);
    }, 0);
  };

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    const desc = parseFloat(descuento || '0');
    return Math.max(0, subtotal - desc);
  };

  const pacientes = pacientesData?.results || [];

  const handleFormSubmit = (data: FacturaFormData) => {
    // Transformar datos para el backend
    const facturaData: FacturaCreateData = {
      ...data,
      presupuesto: 0, // Campo requerido - se puede modificar según necesidad
    };
    onSubmit(facturaData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={factura ? 'Editar Factura' : 'Nueva Factura'}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Paciente */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Paciente <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            {...register('paciente', { valueAsNumber: true })}
            disabled={!!factura}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              backgroundColor: factura ? '#f3f4f6' : 'white',
              outline: 'none',
            }}
          >
            <option value="">Seleccione un paciente</option>
            {pacientes.map(p => (
              <option key={p.id} value={p.id}>
                {p.full_name || p.nombre_completo || `${p.first_name} ${p.last_name}`} {p.ci ? `- CI: ${p.ci}` : ''}
              </option>
            ))}
          </select>
          {errors.paciente && (
            <p style={{ marginTop: '4px', fontSize: '12px', color: '#ef4444' }}>
              {errors.paciente.message}
            </p>
          )}
        </div>

        {/* Fechas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
              Fecha Emisión <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="date"
              {...register('fecha_emision')}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#111827',
                outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
              Fecha Vencimiento <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="date"
              {...register('fecha_vencimiento')}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#111827',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Items */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
              Items <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <button
              type="button"
              onClick={() => append({ descripcion: '', cantidad: 1, precio_unitario: '0.00' })}
              style={{
                padding: '6px 12px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              ➕ Agregar
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
            {fields.map((field, index) => (
              <div key={field.id} style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 80px 100px 40px', gap: '8px', alignItems: 'start' }}>
                  <div>
                    <input
                      {...register(`items.${index}.descripcion`)}
                      placeholder="Descripción del servicio"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#111827',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      {...register(`items.${index}.cantidad`, { valueAsNumber: true })}
                      placeholder="Cant."
                      min="1"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#111827',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.precio_unitario`)}
                      placeholder="Precio"
                      min="0"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#111827',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    style={{
                      padding: '8px',
                      background: fields.length === 1 ? '#e5e7eb' : '#fee2e2',
                      color: fields.length === 1 ? '#9ca3af' : '#991b1b',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: fields.length === 1 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    🗑️
                  </button>
                </div>
                {errors.items?.[index] && (
                  <p style={{ marginTop: '4px', fontSize: '11px', color: '#ef4444' }}>
                    {errors.items[index]?.descripcion?.message || errors.items[index]?.cantidad?.message}
                  </p>
                )}
              </div>
            ))}
          </div>
          {errors.items && typeof errors.items.message === 'string' && (
            <p style={{ marginTop: '4px', fontSize: '12px', color: '#ef4444' }}>
              {errors.items.message}
            </p>
          )}
        </div>

        {/* Resumen */}
        <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#065f46' }}>Subtotal:</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#065f46' }}>
              Bs. {calcularSubtotal().toFixed(2)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#065f46' }}>Descuento:</span>
            <input
              type="number"
              step="0.01"
              {...register('descuento')}
              placeholder="0.00"
              min="0"
              style={{
                width: '120px',
                padding: '4px 8px',
                border: '1px solid #86efac',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#065f46',
                textAlign: 'right',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ borderTop: '2px solid #86efac', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#065f46' }}>TOTAL:</span>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>
              Bs. {calcularTotal().toFixed(2)}
            </span>
          </div>
        </div>

        {/* Notas */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Notas
          </label>
          <textarea
            {...register('notas')}
            rows={2}
            placeholder="Notas adicionales..."
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              outline: 'none',
              resize: 'vertical',
            }}
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
            {factura ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
