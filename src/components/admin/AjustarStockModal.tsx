/**
 * 📊 Modal Ajustar Stock de Insumo
 */

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import inventarioService from '@/services/inventarioService';
import type { Insumo } from '@/services/inventarioService';

interface AjustarStockModalProps {
  insumo: Insumo;
  onClose: () => void;
}

export default function AjustarStockModal({ insumo, onClose }: AjustarStockModalProps) {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    cantidad: '',
    motivo: '',
  });

  const mutation = useMutation({
    mutationFn: (data: { cantidad: number; motivo?: string }) => {
      return inventarioService.ajustarStock(insumo.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insumos'] });
      queryClient.invalidateQueries({ queryKey: ['stock-bajo'] });
      toast.success('Stock ajustado correctamente');
      onClose();
    },
    onError: () => {
      toast.error('Error al ajustar stock');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      cantidad: parseFloat(formData.cantidad),
      motivo: formData.motivo || undefined,
    });
  };

  const nuevoStock = parseFloat(String(insumo.stock_actual)) + parseFloat(formData.cantidad || '0');

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          width: '90%',
          maxWidth: '500px',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
          📊 Ajustar Stock
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
          {insumo.nombre}
        </p>

        <div style={{
          background: '#f9fafb',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Stock Actual</p>
              <p style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>
                {insumo.stock_actual}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Ajuste</p>
              <p style={{
                fontSize: '20px',
                fontWeight: '600',
                color: parseFloat(formData.cantidad || '0') >= 0 ? '#10b981' : '#ef4444',
                margin: 0,
              }}>
                {formData.cantidad ? (parseFloat(formData.cantidad) > 0 ? '+' : '') + formData.cantidad : '0'}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Nuevo Stock</p>
              <p style={{ fontSize: '20px', fontWeight: '600', color: '#8b5cf6', margin: 0 }}>
                {nuevoStock.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
              Cantidad a Ajustar *
            </label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="Ej: +10 para agregar, -5 para quitar"
              value={formData.cantidad}
              onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
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
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '6px 0 0 0' }}>
              💡 Usa números positivos para aumentar, negativos para reducir
            </p>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
              Motivo
            </label>
            <textarea
              rows={3}
              placeholder="Ej: Compra, uso en procedimiento, pérdida..."
              value={formData.motivo}
              onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
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

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px 20px',
                background: 'white',
                color: '#111827',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              style={{
                flex: 1,
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: mutation.isPending ? 'not-allowed' : 'pointer',
                opacity: mutation.isPending ? 0.6 : 1,
              }}
            >
              {mutation.isPending ? 'Ajustando...' : 'Ajustar Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
