/**
 * 🦷 COMPONENTE ODONTOGRAMA
 * Vista completa del odontograma con todos los dientes
 */

import { useState } from 'react';
import type { Odontograma as OdontogramaType } from '../../types/odontograma.types';
import type { PiezaFDI } from '../../types/odontograma.types';
import { obtenerPiezasPorTipo } from '../../constants/odontograma.constants';
import PiezaDental from './PiezaDental';

interface OdontogramaProps {
  odontograma: OdontogramaType;
  onPiezaClick?: (pieza: PiezaFDI) => void;
  readonly?: boolean;
}

/**
 * Componente principal del Odontograma
 * Muestra todos los dientes organizados en cuadrantes
 */
const Odontograma = ({ 
  odontograma, 
  onPiezaClick,
  readonly = false 
}: OdontogramaProps) => {
  const [piezaSeleccionada, setPiezaSeleccionada] = useState<string | null>(null);

  // 🔍 LOG: Inicialización del Odontograma
  console.log('📋 [Odontograma] Renderizando Odontograma', {
    historial_clinico: odontograma.historial_clinico,
    fecha: odontograma.fecha,
    tipo_denticion: odontograma.tipo_denticion,
    cantidadPiezasConEstado: Object.keys(odontograma.estado_piezas).length,
    estado_piezas: odontograma.estado_piezas,
    notas_generales: odontograma.notas_generales,
    readonly: readonly,
    tieneOnPiezaClick: !!onPiezaClick
  });

  // Obtener piezas según tipo de dentición
  const piezas = obtenerPiezasPorTipo(odontograma.tipo_denticion);
  
  console.log(`🦷 [Odontograma] Piezas cargadas para ${odontograma.tipo_denticion}`, {
    totalPiezas: piezas.length,
    primerasPiezas: piezas.slice(0, 5).map(p => `${p.numero}: ${p.nombre}`)
  });
  
  // Separar por cuadrantes
  const cuadrante1 = piezas.filter(p => p.cuadrante === 1);
  const cuadrante2 = piezas.filter(p => p.cuadrante === 2);
  const cuadrante3 = piezas.filter(p => p.cuadrante === 3);
  const cuadrante4 = piezas.filter(p => p.cuadrante === 4);

  console.log('📊 [Odontograma] Distribución de cuadrantes:', {
    cuadrante1: cuadrante1.length,
    cuadrante2: cuadrante2.length,
    cuadrante3: cuadrante3.length,
    cuadrante4: cuadrante4.length
  });

  // Handler de click en pieza
  const handlePiezaClick = (pieza: PiezaFDI) => {
    if (readonly) {
      console.warn('⚠️ [Odontograma] Click bloqueado - Modo solo lectura');
      return;
    }
    
    console.log(`✅ [Odontograma] Click en pieza ${pieza.numero}`, {
      nombre: pieza.nombre,
      cuadrante: pieza.cuadrante,
      estadoActual: odontograma.estado_piezas[pieza.numero]
    });
    
    setPiezaSeleccionada(pieza.numero);
    if (onPiezaClick) {
      onPiezaClick(pieza);
    }
  };

  // Nombres de cuadrantes
  const nombresCuadrantes: Record<number, string> = {
    1: 'Superior Derecho',
    2: 'Superior Izquierdo',
    3: 'Inferior Izquierdo',
    4: 'Inferior Derecho',
    5: 'Superior Derecho (temporal)',
    6: 'Superior Izquierdo (temporal)',
    7: 'Inferior Izquierdo (temporal)',
    8: 'Inferior Derecho (temporal)',
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Encabezado */}
      <div style={{ 
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>
            🦷 Odontograma
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#666' }}>
            Tipo: {odontograma.tipo_denticion === 'ADULTO' ? 'Dentición Permanente (32 piezas)' : 'Dentición Temporal (20 piezas)'}
          </p>
        </div>
        
        {odontograma.fecha && (
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#e3f2fd',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#1976d2'
          }}>
            📅 {new Date(odontograma.fecha).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        )}
      </div>

      {/* Vista del Odontograma */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* Arcada Superior */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#666',
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            ▲ Arcada Superior
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px'
          }}>
            {/* Cuadrante 2 (Superior Izquierdo) */}
            <div>
              <div style={{
                textAlign: 'center',
                fontSize: '11px',
                color: '#999',
                marginBottom: '8px'
              }}>
                {nombresCuadrantes[2]}
              </div>
              <div style={{
                display: 'flex',
                gap: '4px',
                flexDirection: 'row'
              }}>
                {cuadrante2.reverse().map(pieza => (
                  <PiezaDental
                    key={pieza.numero}
                    pieza={pieza}
                    estado={odontograma.estado_piezas[pieza.numero]}
                    onClick={readonly ? undefined : handlePiezaClick}
                    seleccionada={piezaSeleccionada === pieza.numero}
                  />
                ))}
              </div>
            </div>

            {/* Línea media */}
            <div style={{
              width: '2px',
              backgroundColor: '#e0e0e0',
              margin: '30px 10px'
            }} />

            {/* Cuadrante 1 (Superior Derecho) */}
            <div>
              <div style={{
                textAlign: 'center',
                fontSize: '11px',
                color: '#999',
                marginBottom: '8px'
              }}>
                {nombresCuadrantes[1]}
              </div>
              <div style={{
                display: 'flex',
                gap: '4px',
                flexDirection: 'row'
              }}>
                {cuadrante1.map(pieza => (
                  <PiezaDental
                    key={pieza.numero}
                    pieza={pieza}
                    estado={odontograma.estado_piezas[pieza.numero]}
                    onClick={readonly ? undefined : handlePiezaClick}
                    seleccionada={piezaSeleccionada === pieza.numero}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Separador horizontal */}
        <div style={{
          height: '2px',
          backgroundColor: '#e0e0e0',
          margin: '20px auto',
          maxWidth: '800px'
        }} />

        {/* Arcada Inferior */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px'
          }}>
            {/* Cuadrante 3 (Inferior Izquierdo) */}
            <div>
              <div style={{
                display: 'flex',
                gap: '4px',
                flexDirection: 'row'
              }}>
                {cuadrante3.reverse().map(pieza => (
                  <PiezaDental
                    key={pieza.numero}
                    pieza={pieza}
                    estado={odontograma.estado_piezas[pieza.numero]}
                    onClick={readonly ? undefined : handlePiezaClick}
                    seleccionada={piezaSeleccionada === pieza.numero}
                  />
                ))}
              </div>
              <div style={{
                textAlign: 'center',
                fontSize: '11px',
                color: '#999',
                marginTop: '8px'
              }}>
                {nombresCuadrantes[3]}
              </div>
            </div>

            {/* Línea media */}
            <div style={{
              width: '2px',
              backgroundColor: '#e0e0e0',
              margin: '0 10px'
            }} />

            {/* Cuadrante 4 (Inferior Derecho) */}
            <div>
              <div style={{
                display: 'flex',
                gap: '4px',
                flexDirection: 'row'
              }}>
                {cuadrante4.map(pieza => (
                  <PiezaDental
                    key={pieza.numero}
                    pieza={pieza}
                    estado={odontograma.estado_piezas[pieza.numero]}
                    onClick={readonly ? undefined : handlePiezaClick}
                    seleccionada={piezaSeleccionada === pieza.numero}
                  />
                ))}
              </div>
              <div style={{
                textAlign: 'center',
                fontSize: '11px',
                color: '#999',
                marginTop: '8px'
              }}>
                {nombresCuadrantes[4]}
              </div>
            </div>
          </div>
          
          <div style={{
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#666',
            marginTop: '10px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            ▼ Arcada Inferior
          </div>
        </div>
      </div>

      {/* Notas generales */}
      {odontograma.notas_generales && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#fff9e6',
          borderRadius: '8px',
          borderLeft: '4px solid #ffc107'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#f57c00',
            marginBottom: '8px',
            textTransform: 'uppercase'
          }}>
            📝 Notas Generales
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            {odontograma.notas_generales}
          </div>
        </div>
      )}

      {/* Leyenda de estados */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#666',
          marginBottom: '12px',
          textTransform: 'uppercase'
        }}>
          🎨 Leyenda de Estados
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '8px'
        }}>
          {Object.entries({
            sano: { color: '#81C784', icono: '🦷', label: 'Sano' },
            caries: { color: '#E57373', icono: '🦠', label: 'Caries' },
            restaurado: { color: '#64B5F6', icono: '🔧', label: 'Restaurado' },
            corona: { color: '#FFB74D', icono: '👑', label: 'Corona' },
            endodoncia: { color: '#BA68C8', icono: '🔬', label: 'Endodoncia' },
            extraido: { color: '#E0E0E0', icono: '❌', label: 'Extraído' },
            ausente: { color: '#BDBDBD', icono: '⭕', label: 'Ausente' },
            implante: { color: '#4FC3F7', icono: '🔩', label: 'Implante' },
            protesis: { color: '#FFD54F', icono: '🦷', label: 'Prótesis' },
            fractura: { color: '#EF5350', icono: '💥', label: 'Fractura' },
          }).map(([key, value]) => (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px',
                backgroundColor: 'white',
                borderRadius: '4px'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: value.color,
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px'
                }}
              >
                {value.icono}
              </div>
              <span style={{ fontSize: '12px', color: '#666' }}>
                {value.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Odontograma;
