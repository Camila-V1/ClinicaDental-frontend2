/**
 * 🏥 MODAL DE ATENCIÓN DE CITA
 * Modal completo para atender una cita con acceso a historial y odontograma
 */

import { useState, useEffect } from 'react';
import type { CitaCalendario } from '../../types/calendario.types';
import type { Odontograma as OdontogramaType } from '../../types/odontograma.types';
import { Odontograma, ModalEditarPieza } from '../odontograma';
import type { PiezaFDI, EstadoPiezaDental } from '../../types/odontograma.types';
import { getOdontogramas, createOdontograma, updateOdontograma } from '../../services/odontogramaService';

interface ModalAtenderCitaProps {
  abierto: boolean;
  cita: CitaCalendario | null;
  onCerrar: () => void;
  onConfirmarAtencion: (citaId: number, notas?: string) => Promise<void>;
}

const ModalAtenderCita = ({ abierto, cita, onCerrar, onConfirmarAtencion }: ModalAtenderCitaProps) => {
  console.log('🏥 [ModalAtender] Renderizando', { abierto, cita: cita?.id });

  // Helper para obtener datos del paciente
  const getPacienteData = () => {
    if (!cita) return null;
    if (typeof cita.paciente === 'number') {
      return {
        id: cita.paciente,
        nombre: cita.paciente_nombre,
        email: cita.paciente_email,
        historial_clinico_id: undefined
      };
    }
    return cita.paciente;
  };

  const pacienteData = getPacienteData();

  // Estados principales
  const [vistaActual, setVistaActual] = useState<'resumen' | 'historial' | 'odontograma'>('resumen');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados del odontograma
  const [odontogramas, setOdontogramas] = useState<OdontogramaType[]>([]);
  const [odontogramaActual, setOdontogramaActual] = useState<OdontogramaType | null>(null);
  const [odontogramaModificado, setOdontogramaModificado] = useState(false);
  
  // Modal de edición de pieza
  const [modalPiezaAbierto, setModalPiezaAbierto] = useState(false);
  const [piezaSeleccionada, setPiezaSeleccionada] = useState<PiezaFDI | null>(null);
  
  // Notas de atención
  const [notasAtencion, setNotasAtencion] = useState('');

  // Cargar odontogramas cuando se abre el modal
  useEffect(() => {
    if (abierto && pacienteData?.id) {
      console.log('🔄 [ModalAtender] Cargando odontogramas para paciente:', pacienteData.id);
      cargarOdontogramas();
    }
  }, [abierto, pacienteData?.id]);

  // Función para cargar odontogramas del historial del paciente
  const cargarOdontogramas = async () => {
    if (!pacienteData?.historial_clinico_id) {
      console.warn('⚠️ [ModalAtender] Paciente sin historial clínico');
      return;
    }

    setCargando(true);
    setError(null);

    try {
      console.log('📥 [ModalAtender] Obteniendo odontogramas...');
      const datos = await getOdontogramas(pacienteData.historial_clinico_id);
      
      console.log('✅ [ModalAtender] Odontogramas obtenidos:', datos.length);
      setOdontogramas(datos);
      
      // Seleccionar el más reciente o crear uno nuevo
      if (datos.length > 0) {
        const masReciente = datos[datos.length - 1];
        setOdontogramaActual(masReciente);
        console.log('📋 [ModalAtender] Odontograma actual:', masReciente.id);
      } else {
        console.log('🆕 [ModalAtender] No hay odontogramas, se creará uno nuevo al guardar');
      }
    } catch (err) {
      console.error('❌ [ModalAtender] Error cargando odontogramas:', err);
      setError('Error al cargar odontogramas');
    } finally {
      setCargando(false);
    }
  };

  // Crear nuevo odontograma
  const handleCrearOdontograma = () => {
    if (!pacienteData?.historial_clinico_id || !cita) return;

    console.log('🆕 [ModalAtender] Creando nuevo odontograma');
    
    const nuevoOdontograma: OdontogramaType = {
      historial_clinico: pacienteData.historial_clinico_id,
      fecha: new Date().toISOString().split('T')[0],
      tipo_denticion: 'ADULTO', // Por defecto, se puede cambiar
      estado_piezas: {},
      notas_generales: `Odontograma de atención - Cita ${cita.id}`
    };

    setOdontogramaActual(nuevoOdontograma);
    setOdontogramaModificado(true);
    setVistaActual('odontograma');
  };

  // Handler: Click en pieza dental
  const handlePiezaClick = (pieza: PiezaFDI) => {
    console.log('👆 [ModalAtender] Click en pieza:', pieza.numero);
    setPiezaSeleccionada(pieza);
    setModalPiezaAbierto(true);
  };

  // Handler: Guardar estado de pieza
  const handleGuardarPieza = (estado: EstadoPiezaDental) => {
    if (!piezaSeleccionada || !odontogramaActual) return;

    console.log('💾 [ModalAtender] Guardando pieza:', piezaSeleccionada.numero, estado);

    setOdontogramaActual(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        estado_piezas: {
          ...prev.estado_piezas,
          [piezaSeleccionada.numero]: estado
        }
      };
    });

    setOdontogramaModificado(true);
    setModalPiezaAbierto(false);
    setPiezaSeleccionada(null);
  };

  // Handler: Cambiar tipo de dentición
  const handleCambiarTipoDenticion = () => {
    if (!odontogramaActual) return;

    const nuevoTipo = odontogramaActual.tipo_denticion === 'ADULTO' ? 'NIÑO' : 'ADULTO';
    console.log('🔄 [ModalAtender] Cambiando tipo de dentición:', nuevoTipo);

    setOdontogramaActual(prev => {
      if (!prev) return prev;
      return { ...prev, tipo_denticion: nuevoTipo };
    });

    setOdontogramaModificado(true);
  };

  // Handler: Guardar odontograma antes de confirmar atención
  const guardarOdontograma = async () => {
    if (!odontogramaActual || !odontogramaModificado) {
      console.log('ℹ️ [ModalAtender] No hay cambios en odontograma');
      return;
    }

    if (!pacienteData?.historial_clinico_id) {
      console.error('❌ [ModalAtender] No se puede guardar: sin historial clínico');
      return;
    }

    try {
      console.log('💾 [ModalAtender] Guardando odontograma...', odontogramaActual);

      if (odontogramaActual.id) {
        // Actualizar existente
        await updateOdontograma(
          pacienteData.historial_clinico_id,
          odontogramaActual.id,
          odontogramaActual
        );
        console.log('✅ [ModalAtender] Odontograma actualizado');
      } else {
        // Crear nuevo
        const nuevoOdontograma = await createOdontograma(
          pacienteData.historial_clinico_id,
          odontogramaActual
        );
        console.log('✅ [ModalAtender] Odontograma creado:', nuevoOdontograma.id);
        setOdontogramaActual(nuevoOdontograma);
      }

      setOdontogramaModificado(false);
    } catch (err) {
      console.error('❌ [ModalAtender] Error guardando odontograma:', err);
      throw err;
    }
  };

  // Handler: Confirmar atención
  const handleConfirmar = async () => {
    if (!cita) return;

    console.log('✅ [ModalAtender] Confirmando atención...');

    try {
      setCargando(true);

      // 1. Guardar odontograma si hay cambios
      if (odontogramaModificado) {
        await guardarOdontograma();
      }

      // 2. Confirmar la atención de la cita
      await onConfirmarAtencion(cita.id, notasAtencion || undefined);

      console.log('✅ [ModalAtender] Atención confirmada exitosamente');
      
      // Resetear estado
      setVistaActual('resumen');
      setNotasAtencion('');
      setOdontogramaActual(null);
      setOdontogramaModificado(false);
      
    } catch (err) {
      console.error('❌ [ModalAtender] Error confirmando atención:', err);
      setError('Error al confirmar la atención');
    } finally {
      setCargando(false);
    }
  };

  // Handler: Cancelar y cerrar
  const handleCancelar = () => {
    if (odontogramaModificado) {
      if (!window.confirm('Hay cambios sin guardar en el odontograma. ¿Estás seguro de cerrar?')) {
        return;
      }
    }

    console.log('❌ [ModalAtender] Cancelando atención');
    setVistaActual('resumen');
    setNotasAtencion('');
    setOdontogramaActual(null);
    setOdontogramaModificado(false);
    onCerrar();
  };

  if (!abierto || !cita) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={handleCancelar}
      >
        {/* Modal Content */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '95%',
            maxWidth: '1400px',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            padding: '24px',
            borderBottom: '2px solid #e0e0e0',
            backgroundColor: '#f8f9fa'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#333' }}>
                  🏥 Atender Cita
                </h2>
                <p style={{ margin: '8px 0 0 0', fontSize: '16px', color: '#666' }}>
                  <strong>{pacienteData?.nombre}</strong> • {cita.fecha} {cita.hora}
                </p>
              </div>
              <button
                onClick={handleCancelar}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                ✕ Cerrar
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button
                onClick={() => setVistaActual('resumen')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: vistaActual === 'resumen' ? '#1976d2' : 'white',
                  color: vistaActual === 'resumen' ? 'white' : '#666',
                  border: '2px solid #1976d2',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                📋 Resumen
              </button>
              <button
                onClick={() => setVistaActual('historial')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: vistaActual === 'historial' ? '#1976d2' : 'white',
                  color: vistaActual === 'historial' ? 'white' : '#666',
                  border: '2px solid #1976d2',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                📝 Historial Clínico
              </button>
              <button
                onClick={() => setVistaActual('odontograma')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: vistaActual === 'odontograma' ? '#1976d2' : 'white',
                  color: vistaActual === 'odontograma' ? 'white' : '#666',
                  border: '2px solid #1976d2',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  position: 'relative'
                }}
              >
                🦷 Odontograma
                {odontogramaModificado && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#ff9800',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    •
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
            {/* Vista: Resumen */}
            {vistaActual === 'resumen' && (
              <div>
                <h3 style={{ marginTop: 0, color: '#333' }}>Información de la Cita</h3>
                
                <div style={{
                  backgroundColor: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <p style={{ margin: '8px 0' }}>
                    <strong>Paciente:</strong> {pacienteData?.nombre}
                  </p>
                  <p style={{ margin: '8px 0' }}>
                    <strong>Motivo:</strong> {cita.motivo_consulta || cita.motivo || 'No especificado'}
                  </p>
                  <p style={{ margin: '8px 0' }}>
                    <strong>Estado actual:</strong> {cita.estado}
                  </p>
                </div>

                <h3 style={{ color: '#333' }}>Notas de Atención</h3>
                <textarea
                  value={notasAtencion}
                  onChange={(e) => setNotasAtencion(e.target.value)}
                  placeholder="Escribe aquí las notas de la atención realizada..."
                  style={{
                    width: '100%',
                    minHeight: '150px',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />

                <div style={{
                  marginTop: '20px',
                  padding: '16px',
                  backgroundColor: '#e3f2fd',
                  borderRadius: '8px',
                  borderLeft: '4px solid #1976d2'
                }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#1565c0' }}>
                    💡 <strong>Tip:</strong> Puedes navegar entre las pestañas para ver el historial 
                    y editar el odontograma antes de confirmar la atención.
                  </p>
                </div>
              </div>
            )}

            {/* Vista: Historial Clínico */}
            {vistaActual === 'historial' && (
              <div>
                <h3 style={{ marginTop: 0, color: '#333' }}>Historial Clínico</h3>
                <div style={{
                  backgroundColor: '#fff3e0',
                  padding: '16px',
                  borderRadius: '8px',
                  borderLeft: '4px solid #ff9800'
                }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#e65100' }}>
                    🚧 Esta sección mostrará el historial clínico completo del paciente.
                    Próximamente se integrará con el componente de historial.
                  </p>
                </div>
              </div>
            )}

            {/* Vista: Odontograma */}
            {vistaActual === 'odontograma' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, color: '#333' }}>
                    Odontograma {odontogramaModificado && <span style={{ color: '#ff9800' }}>• (modificado)</span>}
                  </h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {odontogramaActual && (
                      <button
                        onClick={handleCambiarTipoDenticion}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#4caf50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}
                      >
                        🔄 Cambiar a {odontogramaActual.tipo_denticion === 'ADULTO' ? 'Niño' : 'Adulto'}
                      </button>
                    )}
                    {!odontogramaActual && (
                      <button
                        onClick={handleCrearOdontograma}
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
                        + Crear Odontograma
                      </button>
                    )}
                  </div>
                </div>

                {cargando && (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ fontSize: '16px', color: '#666' }}>⏳ Cargando odontogramas...</p>
                  </div>
                )}

                {error && (
                  <div style={{
                    backgroundColor: '#ffebee',
                    padding: '16px',
                    borderRadius: '8px',
                    borderLeft: '4px solid #f44336',
                    marginBottom: '20px'
                  }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#c62828' }}>
                      ❌ {error}
                    </p>
                  </div>
                )}

                {!cargando && odontogramaActual && (
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '2px solid #e0e0e0'
                  }}>
                    <Odontograma
                      odontograma={odontogramaActual}
                      onPiezaClick={handlePiezaClick}
                      readonly={false}
                    />
                  </div>
                )}

                {!cargando && !odontogramaActual && !error && (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '12px',
                    border: '2px dashed #bdbdbd'
                  }}>
                    <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>🦷</p>
                    <p style={{ fontSize: '18px', color: '#666', margin: '0 0 8px 0' }}>
                      No hay odontogramas registrados
                    </p>
                    <p style={{ fontSize: '14px', color: '#999', margin: '0 0 20px 0' }}>
                      Haz clic en "Crear Odontograma" para comenzar
                    </p>
                  </div>
                )}

                {/* Historial de odontogramas */}
                {odontogramas.length > 1 && (
                  <div style={{ marginTop: '20px' }}>
                    <h4 style={{ color: '#333' }}>Odontogramas Anteriores ({odontogramas.length - 1})</h4>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {odontogramas.slice(0, -1).reverse().map((odonto) => (
                        <button
                          key={odonto.id}
                          onClick={() => {
                            setOdontogramaActual(odonto);
                            console.log('📋 [ModalAtender] Odontograma seleccionado:', odonto.id);
                          }}
                          style={{
                            padding: '12px 16px',
                            backgroundColor: odontogramaActual?.id === odonto.id ? '#e3f2fd' : 'white',
                            border: '2px solid #1976d2',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          📅 {odonto.fecha}
                          <br />
                          <span style={{ fontSize: '12px', color: '#666' }}>
                            {Object.keys(odonto.estado_piezas).length} piezas
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '20px 24px',
            borderTop: '2px solid #e0e0e0',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {odontogramaModificado && (
                <span style={{ color: '#ff9800', fontWeight: 'bold' }}>
                  ⚠️ Hay cambios sin guardar en el odontograma
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleCancelar}
                disabled={cargando}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'white',
                  color: '#666',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  cursor: cargando ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  opacity: cargando ? 0.5 : 1
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmar}
                disabled={cargando}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: cargando ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  opacity: cargando ? 0.5 : 1
                }}
              >
                {cargando ? '⏳ Guardando...' : '✅ Confirmar Atención'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición de pieza */}
      {odontogramaActual && (
        <ModalEditarPieza
          abierto={modalPiezaAbierto}
          pieza={piezaSeleccionada}
          estadoActual={piezaSeleccionada ? odontogramaActual.estado_piezas[piezaSeleccionada.numero] : undefined}
          onCerrar={() => {
            setModalPiezaAbierto(false);
            setPiezaSeleccionada(null);
          }}
          onGuardar={handleGuardarPieza}
        />
      )}
    </>
  );
};

export default ModalAtenderCita;
