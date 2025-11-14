/**
 * 💬 MODAL DETALLE DE CITA
 * Muestra información completa de una cita y permite acciones
 */

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { CitaCalendario } from '../../types/calendario.types';
import { COLORES_ESTADO } from '../../types/calendario.types';
import calendarioService from '../../services/calendarioService';
import { useAuth } from '../../hooks/useAuth';

interface ModalDetalleCitaProps {
  abierto: boolean;
  cita: CitaCalendario | null;
  onCerrar: () => void;
  onActualizar: () => void;
}

/**
 * Modal que muestra el detalle de una cita del calendario
 */
const ModalDetalleCita = ({
  abierto,
  cita,
  onCerrar,
  onActualizar
}: ModalDetalleCitaProps) => {
  const { user, isLoading } = useAuth();
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determinar si el usuario puede modificar citas (solo odontólogos NO pueden desde calendario)
  const soloLectura = user?.tipo_usuario === 'ODONTOLOGO';
  
  console.log('🔐 [MODAL] DEBUG COMPLETO:', { 
    isLoading,
    user_completo: user,
    user_existe: !!user,
    tipo_usuario: user?.tipo_usuario,
    tipo_usuario_type: typeof user?.tipo_usuario,
    comparacion: user?.tipo_usuario === 'ODONTOLOGO',
    soloLectura,
    mensaje: soloLectura ? '✅ Odontólogo - Solo lectura' : '❌ NO es odontólogo - Puede modificar'
  });

  /**
   * Handler: Confirmar cita
   */
  const handleConfirmar = async () => {
    if (!cita) return;

    console.group('✅ [MODAL] CONFIRMANDO CITA');
    console.log('📋 Cita a confirmar:', {
      id: cita.id,
      paciente: cita.paciente_nombre,
      fecha: cita.fecha_hora,
      estadoActual: cita.estado
    });

    try {
      setActualizando(true);
      setError(null);
      console.log('🔄 Actualizando estado...');
      
      const tiempoInicio = performance.now();
      await calendarioService.actualizarEstadoCita(
        cita.id,
        'CONFIRMADA',
        'Cita confirmada desde el calendario'
      );
      const tiempoTranscurrido = performance.now() - tiempoInicio;
      
      console.log(`✅ Cita confirmada exitosamente en ${tiempoTranscurrido.toFixed(2)}ms`);
      console.log('🔄 Notificando actualización al componente padre...');
      
      onActualizar();
      console.log('✅ Actualización completada');
      
    } catch (err: any) {
      console.error('❌ ERROR AL CONFIRMAR CITA:', {
        error: err,
        mensaje: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      const mensajeError = err.response?.data?.error || 
                          err.response?.data?.message ||
                          'Error al confirmar la cita';
      setError(mensajeError);
      console.error('💾 Estado de error actualizado:', mensajeError);
      
    } finally {
      setActualizando(false);
      console.log('🏁 Proceso finalizado');
      console.groupEnd();
    }
  };

  /**
   * Handler: Cancelar cita
   */
  const handleCancelar = async () => {
    if (!cita) return;

    console.log('❌ [MODAL] Solicitando cancelación de cita:', cita.id);

    const confirmacion = window.confirm(
      '¿Está seguro de cancelar esta cita?'
    );

    if (!confirmacion) {
      console.log('🚫 Usuario canceló la operación');
      return;
    }

    console.group('❌ [MODAL] CANCELANDO CITA');
    console.log('📋 Cita a cancelar:', {
      id: cita.id,
      paciente: cita.paciente_nombre,
      fecha: cita.fecha_hora,
      estadoActual: cita.estado
    });

    try {
      setActualizando(true);
      setError(null);
      console.log('🔄 Actualizando estado a CANCELADA...');
      
      const tiempoInicio = performance.now();
      await calendarioService.actualizarEstadoCita(
        cita.id,
        'CANCELADA',
        'Cita cancelada desde el calendario'
      );
      const tiempoTranscurrido = performance.now() - tiempoInicio;
      
      console.log(`✅ Cita cancelada exitosamente en ${tiempoTranscurrido.toFixed(2)}ms`);
      console.log('🔄 Notificando actualización al componente padre...');
      
      onActualizar();
      console.log('✅ Actualización completada');
      
    } catch (err: any) {
      console.error('❌ ERROR AL CANCELAR CITA:', {
        error: err,
        mensaje: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      const mensajeError = err.response?.data?.error || 
                          err.response?.data?.message ||
                          'Error al cancelar la cita';
      setError(mensajeError);
      console.error('💾 Estado de error actualizado:', mensajeError);
      
    } finally {
      setActualizando(false);
      console.log('🏁 Proceso finalizado');
      console.groupEnd();
    }
  };

  /**
   * Handler: Marcar como atendida
   */
  const handleAtender = async () => {
    if (!cita) return;

    console.group('🩺 [MODAL] MARCANDO CITA COMO ATENDIDA');
    console.log('📋 Cita a atender:', {
      id: cita.id,
      paciente: cita.paciente_nombre,
      fecha: cita.fecha_hora,
      estadoActual: cita.estado
    });

    try {
      setActualizando(true);
      setError(null);
      console.log('🔄 Actualizando estado a ATENDIDA...');
      
      const tiempoInicio = performance.now();
      await calendarioService.actualizarEstadoCita(
        cita.id,
        'ATENDIDA',
        'Cita atendida desde el calendario'
      );
      const tiempoTranscurrido = performance.now() - tiempoInicio;
      
      console.log(`✅ Cita marcada como atendida exitosamente en ${tiempoTranscurrido.toFixed(2)}ms`);
      console.log('🔄 Notificando actualización al componente padre...');
      
      onActualizar();
      console.log('✅ Actualización completada');
      
    } catch (err: any) {
      console.error('❌ ERROR AL MARCAR CITA COMO ATENDIDA:', {
        error: err,
        mensaje: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      const mensajeError = err.response?.data?.error || 
                          err.response?.data?.message ||
                          'Error al marcar como atendida';
      setError(mensajeError);
      console.error('💾 Estado de error actualizado:', mensajeError);
      
    } finally {
      setActualizando(false);
      console.log('🏁 Proceso finalizado');
      console.groupEnd();
    }
  };

  if (!abierto || !cita) {
    if (abierto && !cita) {
      console.warn('⚠️ [MODAL] Modal abierto pero sin cita seleccionada');
    }
    return null;
  }

  // No mostrar el modal hasta que el usuario esté cargado
  if (isLoading) {
    console.log('⏳ [MODAL] Esperando a que se cargue el usuario...');
    return null;
  }

  console.log('📋 [MODAL] Renderizando detalle de cita:', {
    id: cita.id,
    paciente: cita.paciente_nombre,
    estado: cita.estado,
    fecha: cita.fecha_hora
  });

  // Formatear fecha y hora
  const fechaHora = new Date(cita.fecha_hora);
  const fechaFormateada = format(fechaHora, "EEEE d 'de' MMMM yyyy", { locale: es });
  const horaFormateada = format(fechaHora, 'HH:mm', { locale: es });

  // Color del chip de estado
  const colorEstado = COLORES_ESTADO[cita.estado];
  
  console.log('🎨 Color asignado al estado:', { estado: cita.estado, color: colorEstado });

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
          borderRadius: '8px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Título */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
            Detalle de la Cita
          </h2>
          <button
            onClick={onCerrar}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

        {/* Contenido */}
        <div style={{ padding: '20px' }}>
          {/* Mensaje para odontólogo (solo lectura) */}
          {soloLectura && (
            <div style={{
              backgroundColor: '#e3f2fd',
              color: '#1565c0',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '16px',
              border: '1px solid #90caf9',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '20px' }}>👁️</span>
              <span style={{ fontSize: '14px' }}>
                <strong>Modo solo lectura:</strong> Desde el calendario solo puedes ver las citas. 
                Para gestionar citas, ve a "Mi Agenda".
              </span>
            </div>
          )}

          {error && (
            <div style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '16px',
              border: '1px solid #ef5350'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Estado */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{
              display: 'inline-block',
              padding: '8px 20px',
              backgroundColor: colorEstado,
              color: 'white',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              {cita.estado}
            </span>
          </div>

          {/* Información */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Paciente */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '20px' }}>👤</span>
                <span style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>
                  Paciente
                </span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginLeft: '28px', color: '#333' }}>
                {cita.paciente_nombre}
              </div>
              {cita.paciente_email && (
                <div style={{ fontSize: '14px', color: '#666', marginLeft: '28px' }}>
                  {cita.paciente_email}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid #e0e0e0' }} />

            {/* Fecha */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '20px' }}>📅</span>
                <span style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>
                  Fecha
                </span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '500', marginLeft: '28px', textTransform: 'capitalize', color: '#333' }}>
                {fechaFormateada}
              </div>
            </div>

            {/* Hora */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '20px' }}>🕐</span>
                <span style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>
                  Hora
                </span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '500', marginLeft: '28px', color: '#333' }}>
                {horaFormateada}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e0e0e0' }} />

            {/* Motivo */}
            <div>
              <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>
                Motivo de la Cita
              </div>
              <div style={{ fontSize: '16px', color: '#333' }}>
                {cita.motivo}
              </div>
              {cita.motivo_tipo && (
                <span style={{
                  display: 'inline-block',
                  marginTop: '8px',
                  padding: '4px 12px',
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
                  {cita.motivo_tipo}
                </span>
              )}
            </div>

            {/* Observaciones */}
            {cita.observaciones && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '20px' }}>📝</span>
                  <span style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>
                    Observaciones
                  </span>
                </div>
                <div style={{ fontSize: '14px', marginLeft: '28px', color: '#555' }}>
                  {cita.observaciones}
                </div>
              </div>
            )}

            {/* Odontólogo */}
            <div>
              <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>
                Odontólogo Asignado
              </div>
              <div style={{ fontSize: '14px', color: '#333' }}>
                {cita.odontologo_nombre}
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          {/* Solo mostrar botones de acción si NO es odontólogo */}
          {!soloLectura && (
            <>
              {/* Botón Cancelar Cita */}
              {(cita.estado === 'PENDIENTE' || cita.estado === 'CONFIRMADA') && (
                <button
                  onClick={handleCancelar}
                  disabled={actualizando}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'white',
                    color: '#d32f2f',
                    border: '1px solid #d32f2f',
                    borderRadius: '4px',
                    cursor: actualizando ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    opacity: actualizando ? 0.6 : 1
                  }}
                >
                  ❌ Cancelar Cita
                </button>
              )}

              {/* Botón Confirmar */}
              {cita.estado === 'PENDIENTE' && (
                <button
                  onClick={handleConfirmar}
                  disabled={actualizando}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: actualizando ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    opacity: actualizando ? 0.6 : 1
                  }}
                >
                  {actualizando ? 'Confirmando...' : '✓ Confirmar Asistencia'}
                </button>
              )}

              {/* Botón Atender */}
              {cita.estado === 'CONFIRMADA' && (
                <button
                  onClick={handleAtender}
                  disabled={actualizando}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: actualizando ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    opacity: actualizando ? 0.6 : 1
                  }}
                >
                  {actualizando ? 'Procesando...' : '✓ Marcar Atendida'}
                </button>
              )}
            </>
          )}

          {/* Botón Cerrar - Siempre visible */}
          <button
            onClick={onCerrar}
            disabled={actualizando}
            style={{
              padding: '10px 20px',
              backgroundColor: soloLectura ? '#1976d2' : 'white',
              color: soloLectura ? 'white' : '#666',
              border: soloLectura ? 'none' : '1px solid #ddd',
              borderRadius: '4px',
              cursor: actualizando ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              opacity: actualizando ? 0.6 : 1
            }}
          >
            {soloLectura ? '✓ Entendido' : 'Cerrar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalleCita;
