/**
 * 🦷 ARCADA DENTAL - Componente para mostrar un cuadrante dental
 */

import React from 'react';

interface Props {
  dientes: any[];
  onSeleccionar: (numero: string) => void;
  invertir: boolean;
  etiqueta: string;
}

export default function ArcadaDental({ dientes, onSeleccionar, invertir, etiqueta }: Props) {
  const dientesOrdenados = invertir ? [...dientes].reverse() : dientes;
  const [hoveredDiente, setHoveredDiente] = React.useState<string | null>(null);

  const getColoresEstado = (estado: string) => {
    const estadosConfig: Record<string, { bg: string; border: string; text: string; icon: string; emoji: string }> = {
      'SANO': { bg: '#ecfdf5', border: '#10b981', text: '#065f46', icon: '#059669', emoji: '✓' },
      'CARIES': { bg: '#fef2f2', border: '#ef4444', text: '#991b1b', icon: '#dc2626', emoji: '⚠' },
      'OBTURADO': { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', icon: '#d97706', emoji: '⬤' },
      'TRATADO': { bg: '#eff6ff', border: '#3b82f6', text: '#1e3a8a', icon: '#2563eb', emoji: '⚕' },
      'EXTRAIDO': { bg: '#fafafa', border: '#737373', text: '#404040', icon: '#525252', emoji: '✕' },
      'AUSENTE': { bg: '#f5f5f5', border: '#a3a3a3', text: '#525252', icon: '#737373', emoji: '○' },
      'FRACTURADO': { bg: '#fff7ed', border: '#f97316', text: '#9a3412', icon: '#ea580c', emoji: '⚡' },
      'ENDODONCIA': { bg: '#faf5ff', border: '#a855f7', text: '#6b21a8', icon: '#9333ea', emoji: '◈' },
      'PROTESIS': { bg: '#f0f9ff', border: '#0ea5e9', text: '#0c4a6e', icon: '#0284c7', emoji: '◆' },
      'OBSERVACION': { bg: '#fefce8', border: '#eab308', text: '#713f12', icon: '#ca8a04', emoji: '!' },
      'IMPLANTE': { bg: '#f0fdfa', border: '#14b8a6', text: '#134e4a', icon: '#0d9488', emoji: '◉' }
    };
    return estadosConfig[estado] || estadosConfig['SANO'];
  };

  const getEstiloBoton = (diente: any) => {
    const isHovered = hoveredDiente === diente.numero;
    const colores = getColoresEstado(diente.estado);
    
    return {
      position: 'relative' as const,
      width: '75px',
      height: '100px',
      borderRadius: '16px 16px 10px 10px',
      border: `3px solid ${colores.border}`,
      backgroundColor: colores.bg,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 8px',
      cursor: 'pointer',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isHovered ? 'translateY(-6px) scale(1.08)' : 'translateY(0)',
      boxShadow: isHovered 
        ? `0 16px 32px rgba(0,0,0,0.15), 0 0 0 4px ${colores.border}40, inset 0 2px 4px rgba(255,255,255,0.5)` 
        : `0 4px 12px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.3)`,
      zIndex: isHovered ? 10 : 1
    };
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '14px',
      padding: '16px'
    }}>
      {/* Etiqueta superior elegante */}
      <div style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: '6px 20px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '700',
        letterSpacing: '1.5px',
        textTransform: 'uppercase' as const,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '2px solid #e2e8f0'
      }}>
        {etiqueta}
      </div>

      {/* Contenedor de dientes */}
      <div style={{ 
        display: 'flex', 
        gap: '12px',
        padding: '20px',
        backgroundColor: 'transparent'
      }}>
        {dientesOrdenados.map((diente) => (
          <div 
            key={diente.numero} 
            style={{ position: 'relative' }}
            onMouseEnter={() => setHoveredDiente(diente.numero)}
            onMouseLeave={() => setHoveredDiente(null)}
          >
            <button
              onClick={() => onSeleccionar(diente.numero)}
              style={getEstiloBoton(diente)}
            >
              {/* Número del diente */}
              <div style={{
                fontSize: '13px',
                fontWeight: '900',
                color: getColoresEstado(diente.estado).text,
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '5px 14px',
                borderRadius: '8px',
                minWidth: '36px',
                textAlign: 'center' as const,
                border: `2px solid ${getColoresEstado(diente.estado).border}30`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
              }}>
                {diente.numero}
              </div>

              {/* Icono del estado (emoji grande) */}
              <div style={{
                fontSize: '36px',
                lineHeight: '1',
                margin: '6px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '42px',
                filter: hoveredDiente === diente.numero ? 'none' : 'brightness(0.95)'
              }}>
                {getColoresEstado(diente.estado).emoji === '✓' ? '🦷' :
                 getColoresEstado(diente.estado).emoji === '⚠' ? '🔴' :
                 getColoresEstado(diente.estado).emoji === '⬤' ? '🟡' :
                 getColoresEstado(diente.estado).emoji === '⚕' ? '💊' :
                 getColoresEstado(diente.estado).emoji === '✕' ? '❌' :
                 getColoresEstado(diente.estado).emoji === '○' ? '⚪' :
                 getColoresEstado(diente.estado).emoji === '⚡' ? '⚡' :
                 getColoresEstado(diente.estado).emoji === '◈' ? '💉' :
                 getColoresEstado(diente.estado).emoji === '◆' ? '👑' :
                 getColoresEstado(diente.estado).emoji === '!' ? '⚠️' :
                 getColoresEstado(diente.estado).emoji === '◉' ? '🔩' : '🦷'}
              </div>

              {/* Indicador de estado con texto */}
              <div style={{
                fontSize: '8px',
                fontWeight: '800',
                color: getColoresEstado(diente.estado).text,
                textAlign: 'center' as const,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.8px',
                backgroundColor: 'rgba(255,255,255,0.85)',
                padding: '3px 8px',
                borderRadius: '6px',
                border: `1px solid ${getColoresEstado(diente.estado).border}20`,
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {diente.estado.length > 8 ? diente.estado.substring(0, 7) + '.' : diente.estado}
              </div>

              {/* Badge de tratamientos */}
              {diente.tratamientos.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '800',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.5)',
                  border: '3px solid white'
                }}>
                  {diente.tratamientos.length}
                </div>
              )}
            </button>

            {/* Tooltip */}
            {hoveredDiente === diente.numero && (
              <div style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginBottom: '14px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                fontSize: '12px',
                borderRadius: '8px',
                padding: '10px 14px',
                whiteSpace: 'nowrap',
                zIndex: 50,
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                minWidth: '140px',
                border: '2px solid #334155'
              }}>
                <div style={{ 
                  fontWeight: '700', 
                  marginBottom: '6px', 
                  color: '#ffffff',
                  fontSize: '13px'
                }}>
                  {diente.nombre}
                </div>
                <div style={{ 
                  color: '#cbd5e1', 
                  fontSize: '11px',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: getColoresEstado(diente.estado).border,
                    border: '2px solid white'
                  }} />
                  {diente.estado}
                </div>
                {diente.tratamientos.length > 0 && (
                  <div style={{ 
                    color: '#fca5a5', 
                    fontSize: '11px',
                    fontWeight: '600',
                    marginTop: '4px',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}>
                    ⚕️ {diente.tratamientos.length} tratamiento(s)
                  </div>
                )}
                {/* Flecha del tooltip */}
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '8px solid #0f172a'
                }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
