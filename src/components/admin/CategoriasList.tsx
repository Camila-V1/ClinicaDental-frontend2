/**
 * 📋 Lista de Categorías de Servicios
 */

import React from 'react';
import { Loader, Edit, Trash2, FolderTree } from 'lucide-react';
import type { CategoriaServicio } from '@/services/tratamientosService';

interface CategoriasListProps {
  categorias: CategoriaServicio[];
  isLoading: boolean;
  onEdit: (categoria: CategoriaServicio) => void;
  onDelete: (id: number) => void;
}

export default function CategoriasList({ categorias, isLoading, onEdit, onDelete }: CategoriasListProps) {
  if (isLoading) {
    return (
      <div style={{ padding: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: '#2563eb' }} />
      </div>
    );
  }

  if (categorias.length === 0) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
        <p>No hay categorías creadas</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
      {categorias.map((categoria) => (
        <div
          key={categoria.id}
          style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px',
            transition: 'all 150ms',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.borderColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <FolderTree style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
                {categoria.nombre}
              </h3>
              {categoria.descripcion && (
                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: '1.4' }}>
                  {categoria.descripcion}
                </p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(categoria);
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                color: '#111827',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 150ms'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <Edit style={{ width: '14px', height: '14px' }} />
              Editar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(categoria.id);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #fecaca',
                backgroundColor: '#fee2e2',
                color: '#ef4444',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 150ms'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fecaca';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fee2e2';
              }}
            >
              <Trash2 style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
