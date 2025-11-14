/**
 * 📅 CALENDARIO DE CITAS - Componente Principal
 * Vista de calendario con react-big-calendar
 * 
 * Nota: El warning de JSX transform proviene de react-big-calendar
 * y no afecta la funcionalidad. La librería usa internamente el
 * JSX transform antiguo pero nuestro código usa el moderno.
 */

import { useState, useCallback, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import type { View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import type { 
  EventoCalendario, 
  CitaCalendario
} from '../../types/calendario.types';
import calendarioService from '../../services/calendarioService';
import ModalDetalleCita from './ModalDetalleCita';

// Importar constantes
import { 
  COLORES_ESTADO as coloresEstado, 
  DURACION_POR_TIPO as duracionPorTipo 
} from '../../types/calendario.types';

// Configurar localizer con date-fns en español
const locales = {
  'es': es
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: es }),
  getDay,
  locales
});

// Mensajes en español
const messages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Cita',
  noEventsInRange: 'No hay citas en este rango',
  showMore: (total: number) => `+ Ver más (${total})`
};

/**
 * Componente principal del Calendario de Citas
 */
const CalendarioCitas = () => {
  // Estado
  const [vista, setVista] = useState<View>('month');
  const [fecha, setFecha] = useState<Date>(new Date());
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState<CitaCalendario | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  /**
   * Convierte citas del backend a eventos del calendario
   */
  const convertirCitasAEventos = (citas: CitaCalendario[]): EventoCalendario[] => {
    console.log('📅 [CALENDARIO] Convirtiendo citas a eventos:', citas.length);
    
    return citas.map((cita, index) => {
      try {
        const inicio = new Date(cita.fecha_hora);
        const duracion = cita.duracion_minutos || 
                        duracionPorTipo[cita.motivo_tipo || 'OTRO'] || 
                        30;
        const fin = addMinutes(inicio, duracion);

        const evento = {
          id: cita.id,
          title: cita.paciente_nombre,
          start: inicio,
          end: fin,
          resource: cita
        };
        
        console.log(`✅ [CALENDARIO] Evento ${index + 1}/${citas.length}:`, {
          id: evento.id,
          paciente: evento.title,
          fecha: format(inicio, 'yyyy-MM-dd HH:mm'),
          duracion: `${duracion} min`,
          estado: cita.estado
        });
        
        return evento;
      } catch (error) {
        console.error(`❌ [CALENDARIO] Error al convertir cita ${index + 1}:`, {
          cita,
          error: error instanceof Error ? error.message : error
        });
        throw error;
      }
    });
  };

  /**
   * Carga citas del rango visible
   */
  const cargarCitas = useCallback(async (fechaActual: Date, vistaActual: View) => {
    console.group('🔄 [CALENDARIO] CARGANDO CITAS');
    console.log('📆 Fecha actual:', format(fechaActual, 'yyyy-MM-dd'));
    console.log('👁️ Vista actual:', vistaActual);
    
    setLoading(true);
    setError(null);

    try {
      // Calcular rango según la vista
      let fechaInicio: Date;
      let fechaFin: Date;

      switch (vistaActual) {
        case 'month':
          // Primer y último día del mes
          fechaInicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
          fechaFin = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
          console.log('📅 Vista MENSUAL:', {
            mes: format(fechaActual, 'MMMM yyyy', { locale: es }),
            desde: format(fechaInicio, 'yyyy-MM-dd'),
            hasta: format(fechaFin, 'yyyy-MM-dd')
          });
          break;
        case 'week':
          // Inicio y fin de semana
          fechaInicio = startOfWeek(fechaActual, { locale: es });
          fechaFin = new Date(fechaInicio);
          fechaFin.setDate(fechaFin.getDate() + 6);
          console.log('📆 Vista SEMANAL:', {
            semana: `Semana del ${format(fechaInicio, 'd', { locale: es })} al ${format(fechaFin, 'd MMMM', { locale: es })}`,
            desde: format(fechaInicio, 'yyyy-MM-dd'),
            hasta: format(fechaFin, 'yyyy-MM-dd')
          });
          break;
        case 'day':
          // Solo el día actual
          fechaInicio = fechaActual;
          fechaFin = fechaActual;
          console.log('📋 Vista DIARIA:', {
            dia: format(fechaActual, "EEEE d 'de' MMMM yyyy", { locale: es }),
            fecha: format(fechaActual, 'yyyy-MM-dd')
          });
          break;
        case 'agenda':
          // Vista agenda: próximos 30 días
          fechaInicio = fechaActual;
          fechaFin = new Date(fechaActual);
          fechaFin.setDate(fechaFin.getDate() + 30);
          console.log('📑 Vista AGENDA:', {
            rango: 'Próximos 30 días',
            desde: format(fechaInicio, 'yyyy-MM-dd'),
            hasta: format(fechaFin, 'yyyy-MM-dd')
          });
          break;
        default:
          fechaInicio = fechaActual;
          fechaFin = new Date(fechaActual);
          fechaFin.setDate(fechaFin.getDate() + 30);
          console.warn('⚠️ Vista no reconocida, usando default (30 días)');
      }

      // Llamar al servicio
      console.log('🔌 Llamando al servicio de calendario...');
      const tiempoInicio = performance.now();
      
      const citas = await calendarioService.getCitasCalendario({
        fecha_inicio: format(fechaInicio, 'yyyy-MM-dd'),
        fecha_fin: format(fechaFin, 'yyyy-MM-dd')
      });
      
      const tiempoTranscurrido = performance.now() - tiempoInicio;
      console.log(`✅ Citas recibidas en ${tiempoTranscurrido.toFixed(2)}ms:`, citas.length);
      
      if (citas.length > 0) {
        console.table(citas.map(c => ({
          ID: c.id,
          Paciente: c.paciente_nombre,
          Fecha: format(new Date(c.fecha_hora), 'yyyy-MM-dd HH:mm'),
          Estado: c.estado,
          Motivo: c.motivo.substring(0, 30) + (c.motivo.length > 30 ? '...' : '')
        })));
      } else {
        console.log('📭 No hay citas en este rango');
      }

      // Convertir a eventos
      console.log('🔄 Convirtiendo citas a eventos...');
      const eventosNuevos = convertirCitasAEventos(citas);
      console.log('✅ Eventos creados:', eventosNuevos.length);
      
      setEventos(eventosNuevos);
      console.log('✅ Estado actualizado con nuevos eventos');
      
    } catch (err: any) {
      console.error('❌ [CALENDARIO] ERROR AL CARGAR CITAS:', {
        error: err,
        mensaje: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      // Análisis detallado del error
      if (err.response) {
        console.error('📡 ERROR DE RESPUESTA:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        });
        
        switch (err.response.status) {
          case 401:
            console.error('🔒 Error 401: No autenticado - Token inválido o expirado');
            break;
          case 403:
            console.error('🚫 Error 403: Sin permisos - Usuario no tiene acceso');
            break;
          case 404:
            console.error('❓ Error 404: Endpoint no encontrado');
            break;
          case 500:
            console.error('💥 Error 500: Error interno del servidor');
            break;
        }
      } else if (err.request) {
        console.error('📡 ERROR DE RED: No se recibió respuesta del servidor', err.request);
      } else {
        console.error('⚙️ ERROR DE CONFIGURACIÓN:', err.message);
      }
      
      const mensajeError = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message ||
                          'Error al cargar las citas del calendario';
      
      setError(mensajeError);
      console.error('💾 Estado de error actualizado:', mensajeError);
      
    } finally {
      setLoading(false);
      console.log('🏁 Carga de citas finalizada');
      console.groupEnd();
    }
  }, []);

  /**
   * Efecto: Cargar citas al cambiar fecha o vista
   */
  useEffect(() => {
    console.log('🔄 [CALENDARIO] useEffect disparado - Cambio de fecha o vista');
    cargarCitas(fecha, vista);
  }, [fecha, vista, cargarCitas]);

  /**
   * Handler: Navegación (anterior/siguiente/hoy)
   */
  const handleNavegar = (nuevaFecha: Date) => {
    console.log('🧭 [CALENDARIO] Navegación:', {
      fechaAnterior: format(fecha, 'yyyy-MM-dd'),
      fechaNueva: format(nuevaFecha, 'yyyy-MM-dd'),
      vista
    });
    setFecha(nuevaFecha);
  };

  /**
   * Handler: Click en evento
   */
  const handleSeleccionarEvento = (evento: EventoCalendario) => {
    console.log('👆 [CALENDARIO] Click en evento:', {
      id: evento.id,
      paciente: evento.title,
      fecha: format(evento.start, 'yyyy-MM-dd HH:mm'),
      estado: evento.resource.estado
    });
    console.log('📋 Datos completos de la cita:', evento.resource);
    
    setCitaSeleccionada(evento.resource);
    setModalAbierto(true);
    console.log('✅ Modal abierto');
  };

  /**
   * Handler: Cerrar modal
   */
  const handleCerrarModal = () => {
    console.log('❌ [CALENDARIO] Cerrando modal');
    setModalAbierto(false);
    setCitaSeleccionada(null);
  };

  /**
   * Handler: Actualizar cita (desde modal)
   */
  const handleActualizarCita = () => {
    console.log('🔄 [CALENDARIO] Actualizando cita - Recargando calendario');
    // Recargar citas después de actualizar
    cargarCitas(fecha, vista);
    handleCerrarModal();
  };

  /**
   * Estilos personalizados para eventos según estado
   */
  const eventStyleGetter = (evento: EventoCalendario) => {
    const cita = evento.resource;
    const backgroundColor = coloresEstado[cita.estado];

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        display: 'block',
        fontSize: '12px',
        padding: '2px 5px'
      }
    };
  };

  /**
   * Renderizado
   */
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Encabezado */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>
            📅 Calendario de Citas
          </h1>
          <p style={{ margin: '8px 0 0 0', color: '#666' }}>
            Vista de agenda del odontólogo
          </p>
        </div>

        {/* Barra de herramientas */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {/* Selector de vista */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setVista('month')}
              style={{
                padding: '8px 16px',
                backgroundColor: vista === 'month' ? '#1976d2' : 'white',
                color: vista === 'month' ? 'white' : '#1976d2',
                border: '1px solid #1976d2',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              📅 Mes
            </button>
            <button
              onClick={() => setVista('week')}
              style={{
                padding: '8px 16px',
                backgroundColor: vista === 'week' ? '#1976d2' : 'white',
                color: vista === 'week' ? 'white' : '#1976d2',
                border: '1px solid #1976d2',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              📆 Semana
            </button>
            <button
              onClick={() => setVista('day')}
              style={{
                padding: '8px 16px',
                backgroundColor: vista === 'day' ? '#1976d2' : 'white',
                color: vista === 'day' ? 'white' : '#1976d2',
                border: '1px solid #1976d2',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              📋 Día
            </button>
            <button
              onClick={() => setVista('agenda')}
              style={{
                padding: '8px 16px',
                backgroundColor: vista === 'agenda' ? '#1976d2' : 'white',
                color: vista === 'agenda' ? 'white' : '#1976d2',
                border: '1px solid #1976d2',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              📑 Agenda
            </button>
          </div>

          {/* Leyenda de estados */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ 
              padding: '4px 12px', 
              backgroundColor: coloresEstado.PENDIENTE, 
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              Pendiente
            </span>
            <span style={{ 
              padding: '4px 12px', 
              backgroundColor: coloresEstado.CONFIRMADA, 
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              Confirmada
            </span>
            <span style={{ 
              padding: '4px 12px', 
              backgroundColor: coloresEstado.ATENDIDA, 
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              Atendida
            </span>
            <span style={{ 
              padding: '4px 12px', 
              backgroundColor: coloresEstado.CANCELADA, 
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              Cancelada
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ 
            backgroundColor: '#ffebee', 
            color: '#c62828', 
            padding: '12px 16px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #ef5350'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Calendario */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'relative'
        }}>
          {loading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.7)',
              zIndex: 10,
              borderRadius: '8px'
            }}>
              <div style={{ 
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #1976d2',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
          )}

          <Calendar
            localizer={localizer}
            events={eventos}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            view={vista}
            onView={setVista}
            date={fecha}
            onNavigate={handleNavegar}
            onSelectEvent={handleSeleccionarEvento}
            eventPropGetter={eventStyleGetter}
            messages={messages}
            culture="es"
            step={30} // Intervalo de 30 minutos
            timeslots={2} // 2 slots por hora
            min={new Date(0, 0, 0, 8, 0, 0)} // Hora inicio: 8:00 AM
            max={new Date(0, 0, 0, 20, 0, 0)} // Hora fin: 8:00 PM
          />
        </div>

        {/* Modal de detalle */}
        <ModalDetalleCita
          abierto={modalAbierto}
          cita={citaSeleccionada}
          onCerrar={handleCerrarModal}
          onActualizar={handleActualizarCita}
        />
      </div>

      {/* Animación de spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CalendarioCitas;
