/**
 * 🦷 PÁGINA DE PRUEBA DEL ODONTOGRAMA
 * Demo interactiva del componente Odontograma
 */

import { useState } from 'react';
import { Odontograma, ModalEditarPieza } from '../../components/odontograma';
import type { Odontograma as OdontogramaType, PiezaFDI, EstadoPiezaDental } from '../../types/odontograma.types';

const OdontogramaDemo = () => {
  console.log('🚀 [DEMO] ========================================');
  console.log('🚀 [DEMO] Componente OdontogramaDemo renderizado');
  console.log('🚀 [DEMO] ========================================');

  // Estado del odontograma
  const [odontograma, setOdontograma] = useState<OdontogramaType>({
    historial_clinico: 1,
    fecha: new Date().toISOString().split('T')[0],
    tipo_denticion: 'ADULTO',
    estado_piezas: {
      // Algunos ejemplos pre-cargados
      '11': { estado: 'sano' },
      '12': { estado: 'caries', superficie: ['oclusal', 'mesial'], notas: 'Caries profunda' },
      '13': { estado: 'restaurado', material: 'resina', superficie: ['oclusal'] },
      '21': { estado: 'corona', material: 'porcelana' },
      '22': { estado: 'endodoncia' },
      '31': { estado: 'implante' },
      '32': { estado: 'extraido' },
    },
    notas_generales: 'Este es un odontograma de ejemplo para pruebas.'
  });

  console.log('📊 [DEMO] Estado inicial del odontograma:', {
    historial_clinico: odontograma.historial_clinico,
    fecha: odontograma.fecha,
    tipo_denticion: odontograma.tipo_denticion,
    piezas_con_estado: Object.keys(odontograma.estado_piezas).length,
    estado_piezas: odontograma.estado_piezas,
    notas: odontograma.notas_generales
  });

  // Modal de edición
  const [modalAbierto, setModalAbierto] = useState(false);
  const [piezaSeleccionada, setPiezaSeleccionada] = useState<PiezaFDI | null>(null);

  // Handler: Click en pieza
  const handlePiezaClick = (pieza: PiezaFDI) => {
    console.log('📍 [DEMO] ========== CLICK EN PIEZA ==========');
    console.log('🦷 [DEMO] Pieza seleccionada:', {
      numero: pieza.numero,
      nombre: pieza.nombre,
      cuadrante: pieza.cuadrante,
      posicion: pieza.posicion,
      tipo: pieza.tipo,
      estadoActual: odontograma.estado_piezas[pieza.numero]
    });
    
    setPiezaSeleccionada(pieza);
    setModalAbierto(true);
    console.log('✅ [DEMO] Modal abierto');
  };

  // Handler: Guardar cambios
  const handleGuardarCambios = (estado: EstadoPiezaDental) => {
    if (!piezaSeleccionada) {
      console.error('❌ [DEMO] Error: No hay pieza seleccionada');
      return;
    }

    console.log('� [DEMO] ========== GUARDANDO CAMBIOS ==========');
    console.log('�💾 [DEMO] Pieza:', piezaSeleccionada.numero, '-', piezaSeleccionada.nombre);
    console.log('💾 [DEMO] Nuevo estado:', estado);
    console.log('📊 [DEMO] Estado anterior:', odontograma.estado_piezas[piezaSeleccionada.numero] || 'sin estado');

    const nuevoOdontograma = {
      ...odontograma,
      estado_piezas: {
        ...odontograma.estado_piezas,
        [piezaSeleccionada.numero]: estado
      }
    };

    console.log('📋 [DEMO] Odontograma actualizado:', {
      totalPiezasConEstado: Object.keys(nuevoOdontograma.estado_piezas).length,
      piezasModificadas: Object.keys(nuevoOdontograma.estado_piezas)
    });

    setOdontograma(nuevoOdontograma);
    setModalAbierto(false);
    setPiezaSeleccionada(null);
    console.log('✅ [DEMO] Cambios guardados exitosamente');
  };

  // Handler: Cambiar tipo de dentición
  const handleCambiarTipo = () => {
    const tipoAnterior = odontograma.tipo_denticion;
    const tipoNuevo = tipoAnterior === 'ADULTO' ? 'NIÑO' : 'ADULTO';
    
    console.log('🔄 [DEMO] ========== CAMBIAR TIPO ==========');
    console.log('🔄 [DEMO] De:', tipoAnterior, '→ A:', tipoNuevo);
    
    setOdontograma(prev => ({
      ...prev,
      tipo_denticion: tipoNuevo,
      estado_piezas: {} // Limpiar estados al cambiar
    }));
    
    console.log('✅ [DEMO] Tipo cambiado y estados limpiados');
  };

  // Handler: Limpiar odontograma
  const handleLimpiar = () => {
    console.log('🗑️ [DEMO] Solicitando confirmación para limpiar');
    
    if (window.confirm('¿Estás seguro de limpiar todos los estados?')) {
      console.log('🗑️ [DEMO] ========== LIMPIANDO ODONTOGRAMA ==========');
      console.log('🗑️ [DEMO] Piezas antes:', Object.keys(odontograma.estado_piezas).length);
      
      setOdontograma(prev => ({
        ...prev,
        estado_piezas: {}
      }));
      
      console.log('✅ [DEMO] Odontograma limpiado');
    } else {
      console.log('❌ [DEMO] Limpieza cancelada por el usuario');
    }
  };

  // Handler: Cargar ejemplo
  const handleCargarEjemplo = () => {
    console.log('📝 [DEMO] ========== CARGANDO EJEMPLO ==========');
    
    setOdontograma(prev => ({
      ...prev,
      estado_piezas: {
        '11': { estado: 'sano' },
        '12': { estado: 'caries', superficie: ['oclusal', 'mesial'], notas: 'Caries profunda' },
        '13': { estado: 'restaurado', material: 'resina', superficie: ['oclusal'] },
        '14': { estado: 'corona', material: 'porcelana' },
        '15': { estado: 'endodoncia' },
        '21': { estado: 'sano' },
        '22': { estado: 'restaurado', material: 'resina', superficie: ['vestibular'] },
        '23': { estado: 'caries', superficie: ['distal'] },
        '31': { estado: 'implante' },
        '32': { estado: 'extraido' },
        '33': { estado: 'protesis', material: 'porcelana' },
        '34': { estado: 'fractura', notas: 'Fractura vertical' },
        '41': { estado: 'sano' },
        '42': { estado: 'ausente' },
      }
    }));
    
    console.log('✅ [DEMO] Ejemplo cargado con 13 piezas modificadas');
  };

  return (
    <div style={{ 
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Encabezado */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#333' }}>
            🦷 Demo del Odontograma Interactivo
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: '16px', color: '#666' }}>
            Haz click en cualquier diente para editar su estado
          </p>
        </div>

        {/* Barra de herramientas */}
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <button
            onClick={handleCambiarTipo}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🔄 Cambiar a {odontograma.tipo_denticion === 'ADULTO' ? 'Niño' : 'Adulto'}
          </button>

          <button
            onClick={handleCargarEjemplo}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📝 Cargar Ejemplo
          </button>

          <button
            onClick={handleLimpiar}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🗑️ Limpiar Todo
          </button>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>
              Piezas modificadas:
            </span>
            <span style={{
              padding: '4px 12px',
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {Object.keys(odontograma.estado_piezas).length}
            </span>
          </div>
        </div>

        {/* Información */}
        <div style={{
          backgroundColor: '#fff3e0',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '20px',
          borderLeft: '4px solid #ff9800'
        }}>
          <div style={{ fontSize: '14px', color: '#e65100' }}>
            <strong>💡 Instrucciones:</strong>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Haz click en cualquier diente para editar su estado</li>
              <li>Puedes seleccionar entre 10 estados diferentes</li>
              <li>Marca las superficies afectadas (opcional)</li>
              <li>Agrega notas específicas para cada pieza</li>
              <li>Los cambios se guardan automáticamente en este demo</li>
            </ul>
          </div>
        </div>

        {/* Odontograma */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Odontograma
            odontograma={odontograma}
            onPiezaClick={handlePiezaClick}
            readonly={false}
          />
        </div>

        {/* JSON viewer (para desarrollo) */}
        <details style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '12px',
          marginTop: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <summary style={{
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#666',
            userSelect: 'none'
          }}>
            🔧 Ver datos JSON (para desarrollo)
          </summary>
          <pre style={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            fontSize: '12px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {JSON.stringify(odontograma, null, 2)}
          </pre>
        </details>
      </div>

      {/* Modal de edición */}
      <ModalEditarPieza
        abierto={modalAbierto}
        pieza={piezaSeleccionada}
        estadoActual={piezaSeleccionada ? odontograma.estado_piezas[piezaSeleccionada.numero] : undefined}
        onCerrar={() => {
          setModalAbierto(false);
          setPiezaSeleccionada(null);
        }}
        onGuardar={handleGuardarCambios}
      />
    </div>
  );
};

export default OdontogramaDemo;
