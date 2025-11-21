/**
 * 📦 Modal Crear/Editar Insumo
 */

import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import inventarioService from '@/services/inventarioService';
import type { Insumo } from '@/services/inventarioService';

interface InsumoModalProps {
  insumo: Insumo | null;
  onClose: () => void;
}

export default function InsumoModal({ insumo, onClose }: InsumoModalProps) {
  const queryClient = useQueryClient();
  const isEdit = !!insumo;

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria_id: '',
    stock_actual: '',
    stock_minimo: '',
    unidad_medida: 'unidad',
    precio_unitario: '',
    fecha_vencimiento: '',
    proveedor: '',
    activo: true,
  });

  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => inventarioService.getCategorias(),
  });

  useEffect(() => {
    if (insumo) {
      setFormData({
        codigo: insumo.codigo,
        nombre: insumo.nombre,
        descripcion: insumo.descripcion || '',
        categoria_id: insumo.categoria?.id?.toString() || '',
        stock_actual: insumo.stock_actual.toString(),
        stock_minimo: insumo.stock_minimo.toString(),
        unidad_medida: insumo.unidad_medida,
        precio_unitario: insumo.precio_unitario.toString(),
        fecha_vencimiento: insumo.fecha_vencimiento || '',
        proveedor: insumo.proveedor || '',
        activo: insumo.activo,
      });
    }
  }, [insumo]);

  const mutation = useMutation({
    mutationFn: (data: any) => {
      const payload = {
        ...data,
        categoria_id: data.categoria_id ? Number(data.categoria_id) : null,
        stock_actual: parseFloat(data.stock_actual),
        stock_minimo: parseFloat(data.stock_minimo),
        precio_unitario: parseFloat(data.precio_unitario),
      };
      
      if (isEdit && insumo) {
        return inventarioService.updateInsumo(insumo.id, payload);
      }
      return inventarioService.createInsumo(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insumos'] });
      queryClient.invalidateQueries({ queryKey: ['stock-bajo'] });
      toast.success(isEdit ? 'Insumo actualizado' : 'Insumo creado');
      onClose();
    },
    onError: () => {
      toast.error('Error al guardar insumo');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

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
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
          {isEdit ? '✏️ Editar Insumo' : '➕ Nuevo Insumo'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                Código *
              </label>
              <input
                type="text"
                required
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
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
                Categoría
              </label>
              <select
                value={formData.categoria_id}
                onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
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
                <option value="">Sin categoría</option>
                {categorias?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
              Nombre *
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
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
              Descripción
            </label>
            <textarea
              rows={2}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                Stock Actual *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.stock_actual}
                onChange={(e) => setFormData({ ...formData, stock_actual: e.target.value })}
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
                Stock Mínimo *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.stock_minimo}
                onChange={(e) => setFormData({ ...formData, stock_minimo: e.target.value })}
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
                Unidad *
              </label>
              <select
                value={formData.unidad_medida}
                onChange={(e) => setFormData({ ...formData, unidad_medida: e.target.value })}
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
                <option value="unidad">Unidad</option>
                <option value="caja">Caja</option>
                <option value="paquete">Paquete</option>
                <option value="litro">Litro</option>
                <option value="ml">Mililitro</option>
                <option value="kg">Kilogramo</option>
                <option value="gramo">Gramo</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                Precio Unitario *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.precio_unitario}
                onChange={(e) => setFormData({ ...formData, precio_unitario: e.target.value })}
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
                Fecha Vencimiento
              </label>
              <input
                type="date"
                value={formData.fecha_vencimiento}
                onChange={(e) => setFormData({ ...formData, fecha_vencimiento: e.target.value })}
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

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
              Proveedor
            </label>
            <input
              type="text"
              value={formData.proveedor}
              onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              style={{ width: '18px', height: '18px' }}
            />
            <label style={{ fontSize: '14px', color: '#111827' }}>
              Insumo activo
            </label>
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
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: mutation.isPending ? 'not-allowed' : 'pointer',
                opacity: mutation.isPending ? 0.6 : 1,
              }}
            >
              {mutation.isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
