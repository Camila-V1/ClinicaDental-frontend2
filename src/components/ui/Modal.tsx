/**
 * 🎨 Componente Modal Reutilizable
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  maxWidth = 'lg'
}: ModalProps) {
  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getMaxWidth = (size: string) => {
    switch (size) {
      case 'sm': return '384px';
      case 'md': return '448px';
      case 'lg': return '512px';
      case 'xl': return '576px';
      case '2xl': return '672px';
      default: return '512px';
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 50, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      {/* Backdrop */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          transition: 'opacity 0.3s' 
        }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div style={{ 
        position: 'relative', 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', 
        width: '100%', 
        maxWidth: getMaxWidth(maxWidth), 
        margin: '0 16px', 
        maxHeight: '90vh', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '16px 24px', 
          borderBottom: '1px solid #e5e7eb' 
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ 
              padding: '4px', 
              borderRadius: '8px', 
              border: 'none', 
              backgroundColor: 'transparent', 
              cursor: 'pointer', 
              transition: 'background-color 150ms' 
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X style={{ width: '20px', height: '20px', color: '#6b7280' }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
