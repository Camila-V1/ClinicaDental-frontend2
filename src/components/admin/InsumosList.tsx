/**
 * 📦 Lista de Insumos de Inventario
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import inventarioService from '@/services/inventarioService';
import type { Insumo } from '@/services/inventarioService';

interface InsumosListProps {
  onEdit: (insumo: Insumo) => void;
  onAjustarStock: (insumo: Insumo) => void;
}

export default function InsumosList({ onEdit, onAjustarStock }: InsumosListProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState<number | undefined>(undefined);
  const [activo, setActivo] = useState<boolean | undefined>(true);

  const { data: insumos, isLoading } = useQuery({
    queryKey: ['insumos', search, categoria, activo],
    queryFn: () => inventarioService.getInsumos({ search, categoria, activo }),
  });

  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => inventarioService.getCategorias(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => inventarioService.deleteInsumo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insumos'] });
      toast.success('Insumo eliminado exitosamente');
    },
    onError: () => {
      toast.error('Error al eliminar insumo');
    },
  });

  const handleDelete = (insumo: Insumo) => {
    if (window.confirm(`¿Eliminar insumo "${insumo.nombre}"?`)) {
      deleteMutation.mutate(insumo.id);
    }
  };

  const getStockStatus = (stock: string, minStock: string) => {
    const stockNum = parseFloat(stock);
    const minStockNum = parseFloat(minStock);
    
    if (stockNum <= 0) return { color: '#ef4444', bg: '#fee2e2', border: '#fca5a5', text: 'Sin Stock' };
    if (stockNum <= minStockNum) return { color: '#f59e0b', bg: '#fef3c7', border: '#fde68a', text: 'Stock Bajo' };
    return { color: '#10b981', bg: '#d1fae5', border: '#86efac', text: 'Disponible' };
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
        Cargando insumos...
      </div>
    );
  }

  const insumosArray = insumos || [];

  return (
    <div>
      {/* Filtros */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid #e5e7eb' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
              Buscar
            </label>
            <input
              type="text"
              placeholder="Nombre del insumo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              value={categoria || ''}
              onChange={(e) => setCategoria(e.target.value ? Number(e.target.value) : undefined)}
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
              <option value="">Todas las categorías</option>
              {categorias?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
              Estado
            </label>
            <select
              value={activo === undefined ? '' : activo.toString()}
              onChange={(e) => setActivo(e.target.value === '' ? undefined : e.target.value === 'true')}
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
              <option value="">Todos</option>
              <option value="true">Solo activos</option>
              <option value="false">Solo inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista */}
      {insumosArray.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>
            No hay insumos
          </p>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            Crea tu primer insumo para gestionar el inventario
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {insumosArray.map((insumo) => {
            // ✅ Usar campos exactos del backend
            const stockActual = parseFloat(insumo.stock_actual);
            const precioVenta = parseFloat(insumo.precio_venta);
            
            return (
              <div
                key={insumo.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  border: insumo.requiere_reposicion ? '2px solid #f59e0b' : '1px solid #e5e7eb',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
                      {insumo.nombre}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                      {insumo.codigo}
                    </p>
                  </div>
                  {insumo.requiere_reposicion && (
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        border: '1px solid #fbbf24',
                      }}
                    >
                      ⚠️ Stock Bajo
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 4px 0' }}>Stock Actual</p>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: insumo.requiere_reposicion ? '#f59e0b' : '#111827', margin: 0 }}>
                      {stockActual.toFixed(2)} {insumo.unidad_medida}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 4px 0' }}>Precio Venta</p>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: '#10b981', margin: 0 }}>
                      Bs. {precioVenta.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
                  🏷️ {insumo.categoria_nombre}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => onAjustarStock(insumo)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    📊 Stock
                  </button>
                  <button
                    onClick={() => onEdit(insumo)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(insumo)}
                    style={{
                      padding: '8px 12px',
                      background: 'white',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Contador de resultados */}
      {insumosArray.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px 20px',
          marginTop: '20px',
          textAlign: 'center',
          border: '1px solid #e5e7eb',
        }}>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            📦 Total: {insumosArray.length} insumos
          </p>
        </div>
      )}
    </div>
  );
}
