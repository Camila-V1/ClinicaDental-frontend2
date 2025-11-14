/**
 * 🦷 MODAL EDICIÓN DE PIEZA DENTAL
 * Permite editar el estado de una pieza dental específica
 */

import { useState, useEffect } from 'react';
import type { 
  PiezaFDI, 
  EstadoPiezaDental, 
  EstadoPieza,
  SuperficieDental,
  MaterialRestauracion
} from '../../types/odontograma.types';
import { 
  COLORES_ESTADO, 
  ICONOS_ESTADO, 
  DESCRIPCIONES_ESTADO 
} from '../../types/odontograma.types';

interface ModalEditarPiezaProps {
  abierto: boolean;
  pieza: PiezaFDI | null;
  estadoActual?: EstadoPiezaDental;
  onCerrar: () => void;
  onGuardar: (estado: EstadoPiezaDental) => void;
}

/**
 * Modal para editar el estado de una pieza dental
 */
const ModalEditarPieza = ({
  abierto,
  pieza,
  estadoActual,
  onCerrar,
  onGuardar
}: ModalEditarPiezaProps) => {
  // Estados del formulario
  const [estado, setEstado] = useState<EstadoPieza>('sano');
  const [superficies, setSuperficies] = useState<SuperficieDental[]>([]);
  const [material, setMaterial] = useState<MaterialRestauracion | undefined>(undefined);
  const [notas, setNotas] = useState<string>('');

  // Inicializar con estado actual
  useEffect(() => {
    console.log('🔄 [ModalEditarPieza] useEffect - Inicializando estados', {
      abierto,
      pieza: pieza?.numero,
      estadoActual
    });

    if (estadoActual) {
      console.log('✏️ [ModalEditarPieza] Cargando estado existente:', estadoActual);
      setEstado(estadoActual.estado);
      setSuperficies(estadoActual.superficie || []);
      setMaterial(estadoActual.material);
      setNotas(estadoActual.notas || '');
    } else {
      console.log('🆕 [ModalEditarPieza] Pieza sin estado previo - inicializando como sano');
      // Resetear si no hay estado
      setEstado('sano');
      setSuperficies([]);
      setMaterial(undefined);
      setNotas('');
    }
  }, [estadoActual, pieza]);

  if (!abierto || !pieza) {
    if (!abierto) console.log('⏸️ [ModalEditarPieza] Modal cerrado');
    if (!pieza) console.log('⚠️ [ModalEditarPieza] No hay pieza seleccionada');
    return null;
  }

  console.log('👁️ [ModalEditarPieza] Modal visible para pieza', {
    numero: pieza.numero,
    nombre: pieza.nombre,
    estadoActual: estado,
    superficies: superficies,
    material: material,
    notas: notas
  });

  // Handler de guardado
  const handleGuardar = () => {
    const nuevoEstado: EstadoPiezaDental = {
      estado,
      superficie: superficies.length > 0 ? superficies : undefined,
      material: material,
      notas: notas.trim() || undefined
    };
    
    console.log('💾 [ModalEditarPieza] Guardando cambios', {
      pieza: pieza.numero,
      nombre: pieza.nombre,
      nuevoEstado: nuevoEstado,
      cambios: {
        estado: estado,
        cantidadSuperficies: superficies.length,
        superficies: superficies,
        material: material || 'sin material',
        tieneNotas: !!notas.trim()
      }
    });
    
    onGuardar(nuevoEstado);
    onCerrar();
  };

  // Toggle superficie
  const toggleSuperficie = (sup: SuperficieDental) => {
    const estaSeleccionada = superficies.includes(sup);
    console.log(`🔘 [ModalEditarPieza] Toggle superficie "${sup}"`, {
      accion: estaSeleccionada ? 'deseleccionar' : 'seleccionar',
      superficiesAntes: superficies,
      superficiesDespues: estaSeleccionada 
        ? superficies.filter(s => s !== sup)
        : [...superficies, sup]
    });
    
    setSuperficies(prev => 
      prev.includes(sup)
        ? prev.filter(s => s !== sup)
        : [...prev, sup]
    );
  };

  // Mostrar campos de material solo para restauraciones
  const mostrarMaterial = ['restaurado', 'corona', 'protesis'].includes(estado);

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
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
      onClick={onCerrar}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div style={{
          padding: '20px',
          borderBottom: '2px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f5f5f5'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>
              🦷 Editar Pieza Dental
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#666' }}>
              <strong>Pieza {pieza.numero}:</strong> {pieza.nombre}
            </p>
          </div>
          <button
            onClick={onCerrar}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        {/* Contenido */}
        <div style={{ padding: '20px' }}>
          {/* Selector de Estado */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '12px'
            }}>
              Estado de la Pieza
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '8px'
            }}>
              {(Object.keys(COLORES_ESTADO) as EstadoPieza[]).map(est => (
                <button
                  key={est}
                  onClick={() => setEstado(est)}
                  style={{
                    padding: '12px 8px',
                    backgroundColor: estado === est ? COLORES_ESTADO[est] : 'white',
                    color: estado === est ? 'white' : '#666',
                    border: `2px solid ${COLORES_ESTADO[est]}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: estado === est ? 'bold' : 'normal',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{ICONOS_ESTADO[est]}</span>
                  <span>{DESCRIPCIONES_ESTADO[est]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Superficies */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '8px'
            }}>
              Superficies Afectadas (opcional)
            </label>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {(['oclusal', 'mesial', 'distal', 'vestibular', 'lingual', 'palatino'] as SuperficieDental[]).map(sup => (
                <button
                  key={sup}
                  onClick={() => toggleSuperficie(sup)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: superficies.includes(sup) ? '#1976d2' : 'white',
                    color: superficies.includes(sup) ? 'white' : '#666',
                    border: '2px solid #1976d2',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: superficies.includes(sup) ? 'bold' : 'normal',
                    transition: 'all 0.2s'
                  }}
                >
                  {sup.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Material (si aplica) */}
          {mostrarMaterial && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '8px'
              }}>
                Material de Restauración
              </label>
              <select
                value={material || ''}
                onChange={(e) => setMaterial((e.target.value as MaterialRestauracion) || undefined)}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '14px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="">Seleccionar material...</option>
                <option value="resina">Resina Compuesta</option>
                <option value="amalgama">Amalgama</option>
                <option value="porcelana">Porcelana</option>
                <option value="oro">Oro</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          )}

          {/* Notas */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '8px'
            }}>
              Notas (opcional)
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Observaciones adicionales sobre la pieza..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        {/* Footer con botones */}
        <div style={{
          padding: '16px 20px',
          borderTop: '2px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
          backgroundColor: '#f5f5f5'
        }}>
          <button
            onClick={onCerrar}
            style={{
              padding: '10px 20px',
              backgroundColor: 'white',
              color: '#666',
              border: '2px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            💾 Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarPieza;
