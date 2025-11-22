/**
 * 💳 Modal de Pago - Admin
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import type { Pago, Factura, PagoCreateData } from '@/services/facturacionAdminService';

const pagoSchema = z.object({
  factura: z.number({ message: 'Seleccione una factura' }),
  fecha_pago: z.string(),
  monto: z.string().refine(val => parseFloat(val) > 0, 'El monto debe ser mayor a 0'),
  metodo_pago: z.enum(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'QR']),
  numero_transaccion: z.string().optional(),
  notas: z.string().optional(),
});

type PagoFormData = z.infer<typeof pagoSchema>;

interface PagoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pago: Pago | null;
  facturas: Factura[];
  onSubmit: (data: PagoCreateData) => void;
  isLoading: boolean;
}

export default function PagoModal({ isOpen, onClose, pago, facturas, onSubmit, isLoading }: PagoModalProps) {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<PagoFormData>({
    resolver: zodResolver(pagoSchema),
    defaultValues: pago ? {
      factura: pago.factura,
      fecha_pago: pago.fecha_pago.split('T')[0],
      monto: pago.monto,
      metodo_pago: pago.metodo_pago,
      numero_transaccion: pago.numero_transaccion || '',
      notas: pago.notas || '',
    } : {
      fecha_pago: new Date().toISOString().split('T')[0],
      monto: '0.00',
      metodo_pago: 'EFECTIVO',
      numero_transaccion: '',
      notas: '',
    }
  });

  const metodoPago = watch('metodo_pago');
  const facturaId = watch('factura');

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const facturaSeleccionada = facturas.find(f => f.id === facturaId);

  // Filtrar solo facturas pendientes
  const facturasPendientes = facturas.filter(f => f.estado === 'PENDIENTE' || f.estado === 'VENCIDA');

  const handleFormSubmit = (data: PagoFormData) => {
    // Transformar monto a monto_pagado para el backend
    const pagoData: PagoCreateData = {
      ...data,
      monto_pagado: data.monto,
    };
    onSubmit(pagoData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={pago ? 'Editar Pago' : 'Registrar Pago'}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Factura */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Factura <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            {...register('factura', { valueAsNumber: true })}
            disabled={!!pago}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              backgroundColor: pago ? '#f3f4f6' : 'white',
              outline: 'none',
            }}
          >
            <option value="">Seleccione una factura</option>
            {facturasPendientes.map(f => (
              <option key={f.id} value={f.id}>
                {f.numero_factura} - {f.paciente_nombre} - Saldo: Bs. {f.saldo}
              </option>
            ))}
          </select>
          {errors.factura && (
            <p style={{ marginTop: '4px', fontSize: '12px', color: '#ef4444' }}>
              {errors.factura.message}
            </p>
          )}
        </div>

        {/* Info de Factura */}
        {facturaSeleccionada && (
          <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
            <p style={{ fontSize: '12px', color: '#065f46', margin: '0 0 4px 0' }}>
              <strong>Paciente:</strong> {facturaSeleccionada.paciente_nombre}
            </p>
            <p style={{ fontSize: '12px', color: '#065f46', margin: '0 0 4px 0' }}>
              <strong>Total:</strong> Bs. {facturaSeleccionada.total}
            </p>
            <p style={{ fontSize: '12px', color: '#065f46', margin: 0 }}>
              <strong>Saldo Pendiente:</strong> <span style={{ fontWeight: '700', color: '#10b981' }}>Bs. {facturaSeleccionada.saldo}</span>
            </p>
          </div>
        )}

        {/* Fecha y Monto */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
              Fecha Pago <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="date"
              {...register('fecha_pago')}
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
              Monto (Bs.) <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="number"
              step="0.01"
              {...register('monto')}
              placeholder="0.00"
              min="0"
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
            {errors.monto && (
              <p style={{ marginTop: '4px', fontSize: '12px', color: '#ef4444' }}>
                {errors.monto.message}
              </p>
            )}
          </div>
        </div>

        {/* Método de Pago */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Método de Pago <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            {...register('metodo_pago')}
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
          >
            <option value="EFECTIVO">💵 Efectivo</option>
            <option value="TARJETA">💳 Tarjeta</option>
            <option value="TRANSFERENCIA">🏦 Transferencia</option>
            <option value="QR">📱 QR</option>
          </select>
        </div>

        {/* Número de Transacción */}
        {(metodoPago === 'TARJETA' || metodoPago === 'TRANSFERENCIA' || metodoPago === 'QR') && (
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
              Número de Transacción
            </label>
            <input
              type="text"
              {...register('numero_transaccion')}
              placeholder="Ej: TRX123456789"
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
        )}

        {/* Notas */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Notas
          </label>
          <textarea
            {...register('notas')}
            rows={2}
            placeholder="Observaciones del pago..."
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
            {pago ? 'Actualizar' : 'Registrar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
