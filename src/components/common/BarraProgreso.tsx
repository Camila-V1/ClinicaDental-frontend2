/**
 * 📊 BARRA DE PROGRESO - Componente Reutilizable
 * Muestra una barra de progreso con porcentaje
 */

import React from 'react';

interface BarraProgresoProps {
  porcentaje: number; // 0-100
  altura?: string; // Ej: '8px', '12px'
  colorFondo?: string;
  colorBarra?: string;
  mostrarPorcentaje?: boolean;
  className?: string;
}

const BarraProgreso: React.FC<BarraProgresoProps> = ({
  porcentaje,
  altura = '8px',
  colorFondo = '#E5E7EB',
  colorBarra = '#3B82F6',
  mostrarPorcentaje = true,
  className = '',
}) => {
  // Asegurar que el porcentaje esté entre 0 y 100
  const porcentajeValido = Math.min(Math.max(porcentaje, 0), 100);

  // Determinar color según porcentaje
  const obtenerColor = () => {
    if (porcentajeValido === 100) return '#10B981'; // Verde
    if (porcentajeValido >= 70) return '#3B82F6'; // Azul
    if (porcentajeValido >= 40) return '#F59E0B'; // Naranja
    return '#EF4444'; // Rojo
  };

  const color = colorBarra === '#3B82F6' ? obtenerColor() : colorBarra;

  return (
    <div className={className} style={{ width: '100%' }}>
      {mostrarPorcentaje && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '4px',
          fontSize: '12px',
          color: '#6B7280',
        }}>
          <span>Progreso</span>
          <span style={{ fontWeight: 600, color: '#374151' }}>
            {porcentajeValido.toFixed(0)}%
          </span>
        </div>
      )}
      
      <div style={{
        width: '100%',
        height: altura,
        backgroundColor: colorFondo,
        borderRadius: '9999px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div
          style={{
            width: `${porcentajeValido}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: '9999px',
            transition: 'width 0.5s ease-in-out, background-color 0.3s ease',
          }}
        />
      </div>
    </div>
  );
};

export default BarraProgreso;
