/**
 * 📦 INVENTARIO - Gestión de Categorías e Insumos
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import inventarioService from '@/services/inventarioService';
import CategoriasList from '@/components/admin/CategoriasList';
import InsumosList from '@/components/admin/InsumosList';
import CategoriaModal from '@/components/admin/CategoriaModal';
import InsumoModal from '@/components/admin/InsumoModal';
import AjustarStockModal from '@/components/admin/AjustarStockModal';
import type { Categoria, Insumo } from '@/services/inventarioService';

export default function Inventario() {
  const [activeTab, setActiveTab] = useState<'insumos' | 'categorias'>('insumos');
  
  // Modales
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [showInsumoModal, setShowInsumoModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  
  // Edición
  const [categoriaEdit, setCategoriaEdit] = useState<Categoria | null>(null);
  const [insumoEdit, setInsumoEdit] = useState<Insumo | null>(null);
  const [insumoStock, setInsumoStock] = useState<Insumo | null>(null);

  // Queries
  const { data: stockBajo } = useQuery({
    queryKey: ['stock-bajo'],
    queryFn: () => inventarioService.getStockBajo(),
  });

  const handleCreateCategoria = () => {
    setCategoriaEdit(null);
    setShowCategoriaModal(true);
  };

  const handleEditCategoria = (categoria: Categoria) => {
    setCategoriaEdit(categoria);
    setShowCategoriaModal(true);
  };

  const handleCreateInsumo = () => {
    setInsumoEdit(null);
    setShowInsumoModal(true);
  };

  const handleEditInsumo = (insumo: Insumo) => {
    setInsumoEdit(insumo);
    setShowInsumoModal(true);
  };

  const handleAjustarStock = (insumo: Insumo) => {
    setInsumoStock(insumo);
    setShowStockModal(true);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
          📦 Gestión de Inventario
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          Administra categorías e insumos de la clínica
        </p>
      </div>

      {/* Alertas de Stock Bajo */}
      {stockBajo && stockBajo.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          border: '2px solid #f59e0b',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>⚠️</span>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#92400e', margin: 0 }}>
              Alertas de Stock Bajo ({stockBajo.length})
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '8px' }}>
            {stockBajo.map((insumo) => (
              <div
                key={insumo.id}
                style={{
                  padding: '8px 12px',
                  background: 'white',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#78350f',
                }}
              >
                <strong>{insumo.nombre}:</strong> {insumo.stock_actual} {insumo.unidad_medida}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setActiveTab('insumos')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'insumos' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'white',
            color: activeTab === 'insumos' ? 'white' : '#111827',
            border: activeTab === 'insumos' ? 'none' : '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          📦 Insumos
        </button>
        <button
          onClick={() => setActiveTab('categorias')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'categorias' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'white',
            color: activeTab === 'categorias' ? 'white' : '#111827',
            border: activeTab === 'categorias' ? 'none' : '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          🏷️ Categorías
        </button>

        <div style={{ marginLeft: 'auto' }}>
          {activeTab === 'insumos' ? (
            <button
              onClick={handleCreateInsumo}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              ➕ Crear Insumo
            </button>
          ) : (
            <button
              onClick={handleCreateCategoria}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              ➕ Crear Categoría
            </button>
          )}
        </div>
      </div>

      {/* Contenido */}
      {activeTab === 'insumos' && (
        <InsumosList
          onEdit={handleEditInsumo}
          onAjustarStock={handleAjustarStock}
        />
      )}

      {activeTab === 'categorias' && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
          Gestión de categorías en desarrollo
        </div>
      )}

      {/* Modales - Comentados temporalmente por falta de props requeridas */}
      {/* {showCategoriaModal && (
        <CategoriaModal
          categoria={categoriaEdit}
          onClose={() => setShowCategoriaModal(false)}
        />
      )} */}

      {/* {showInsumoModal && (
        <InsumoModal
          insumo={insumoEdit}
          onClose={() => setShowInsumoModal(false)}
        />
      )} */}

      {showStockModal && insumoStock && (
        <AjustarStockModal
          insumo={insumoStock}
          onClose={() => setShowStockModal(false)}
        />
      )}
    </div>
  );
}
