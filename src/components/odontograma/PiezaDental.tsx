/**
 * 🦷 COMPONENTE PIEZA DENTAL
 * Representación visual de un diente individual
 */

import type { PiezaFDI } from '../../types/odontograma.types';
import type { EstadoPiezaDental } from '../../types/odontograma.types';
import { COLORES_ESTADO, ICONOS_ESTADO } from '../../types/odontograma.types';

interface PiezaDentalProps {
  pieza: PiezaFDI;
  estado?: EstadoPiezaDental;
  onClick?: (pieza: PiezaFDI) => void;
  seleccionada?: boolean;
}

/**
 * Componente que muestra un diente individual con su estado
 */
const PiezaDental = ({ 
  pieza, 
  estado, 
  onClick, 
  seleccionada = false 
}: PiezaDentalProps) => {
  
  // Determinar el color según el estado
  const estadoPieza = estado?.estado || 'sano';
  const color = COLORES_ESTADO[estadoPieza];
  const icono = ICONOS_ESTADO[estadoPieza];

  // 🔍 LOG: Renderizado de pieza
  console.log(`🦷 [PiezaDental] Renderizando pieza ${pieza.numero}`, {
    nombre: pieza.nombre,
    cuadrante: pieza.cuadrante,
    posicion: pieza.posicion,
    tipo: pieza.tipo,
    estado: estadoPieza,
    color: color,
    icono: icono,
    superficie: estado?.superficie || 'ninguna',
    cantidadSuperficies: estado?.superficie?.length || 0,
    material: estado?.material || 'sin material',
    notas: estado?.notas || 'sin notas',
    seleccionada: seleccionada,
    esClickeable: !!onClick
  });

  // Handler de click
  const handleClick = () => {
    if (onClick) {
      console.log(`👆 [PiezaDental] Click en pieza ${pieza.numero} - ${pieza.nombre}`);
      onClick(pieza);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: '60px',
        height: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        padding: '8px',
        borderRadius: '8px',
        border: seleccionada 
          ? '3px solid #1976d2' 
          : '2px solid #e0e0e0',
        backgroundColor: seleccionada ? '#e3f2fd' : 'white',
        transition: 'all 0.2s ease',
        position: 'relative',
        boxShadow: seleccionada 
          ? '0 4px 8px rgba(25, 118, 210, 0.3)' 
          : '0 2px 4px rgba(0,0,0,0.1)'
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = seleccionada 
            ? '0 4px 8px rgba(25, 118, 210, 0.3)' 
            : '0 2px 4px rgba(0,0,0,0.1)';
        }
      }}
    >
      {/* Número FDI */}
      <div style={{
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#666',
        marginBottom: '4px'
      }}>
        {pieza.numero}
      </div>

      {/* Icono visual del diente */}
      <div style={{
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color,
        borderRadius: '6px',
        fontSize: '24px',
        marginBottom: '4px'
      }}>
        {icono}
      </div>

      {/* Indicador de superficies afectadas */}
      {estado && estado.superficie && estado.superficie.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          backgroundColor: '#ff9800',
          color: 'white',
          borderRadius: '50%',
          width: '16px',
          height: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          fontWeight: 'bold'
        }}>
          {estado.superficie.length}
        </div>
      )}

      {/* Nombre de la pieza (abreviado) */}
      <div style={{
        fontSize: '9px',
        color: '#999',
        textAlign: 'center',
        lineHeight: '1.1',
        maxWidth: '50px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {pieza.tipo}
      </div>
    </div>
  );
};

export default PiezaDental;
