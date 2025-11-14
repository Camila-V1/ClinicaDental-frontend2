/**
 * 📅 CALENDARIO SERVICE - Gestión del Calendario de Citas
 */

import api from '../config/apiConfig';
import type { 
  CitaCalendario, 
  FiltrosCalendario, 
  DisponibilidadResponse,
  EstadoCita
} from '../types/calendario.types';

/**
 * Servicio para gestión del calendario de citas
 */
const calendarioService = {
  /**
   * Obtiene citas en un rango de fechas para el calendario
   * @param filtros - Fecha inicio y fin
   * @returns Promesa con array de citas
   */
  async getCitasCalendario(filtros: FiltrosCalendario): Promise<CitaCalendario[]> {
    try {
      const params = new URLSearchParams();
      params.append('fecha_inicio', filtros.fecha_inicio);
      params.append('fecha_fin', filtros.fecha_fin);
      
      if (filtros.estado) {
        params.append('estado', filtros.estado);
      }

      console.log('📅 Obteniendo citas del calendario con filtros:', filtros);
      const response = await api.get<CitaCalendario[]>(`/api/agenda/citas/?${params.toString()}`);
      console.log('✅ Citas recibidas para calendario:', response.data.length);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener citas del calendario:', error);
      throw error;
    }
  },

  /**
   * Obtiene horarios disponibles para una fecha específica
   * @param fecha - Fecha en formato YYYY-MM-DD
   * @returns Promesa con horarios disponibles
   */
  async getDisponibilidad(fecha: string): Promise<DisponibilidadResponse> {
    try {
      console.log('🕐 Obteniendo disponibilidad para:', fecha);
      const response = await api.get<DisponibilidadResponse>('/api/agenda/citas/disponibilidad/', {
        params: { fecha }
      });
      console.log('✅ Disponibilidad recibida:', response.data.horarios_disponibles.length, 'horarios');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener disponibilidad:', error);
      throw error;
    }
  },

  /**
   * Obtiene detalle de una cita específica
   * @param citaId - ID de la cita
   * @returns Promesa con datos de la cita
   */
  async getDetalleCita(citaId: number): Promise<CitaCalendario> {
    try {
      console.log('🔍 Obteniendo detalle de cita:', citaId);
      const response = await api.get<CitaCalendario>(`/api/agenda/citas/${citaId}/`);
      console.log('✅ Detalle de cita recibido:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener detalle de cita:', error);
      throw error;
    }
  },

  /**
   * Actualiza el estado de una cita
   * @param citaId - ID de la cita
   * @param estado - Nuevo estado
   * @param observaciones - Observaciones opcionales
   * @returns Promesa con cita actualizada
   */
  async actualizarEstadoCita(
    citaId: number, 
    estado: EstadoCita,
    observaciones?: string
  ): Promise<CitaCalendario> {
    try {
      console.log('📝 Actualizando estado de cita:', citaId, 'a', estado);
      const response = await api.patch<CitaCalendario>(`/api/agenda/citas/${citaId}/`, {
        estado,
        ...(observaciones && { notas: observaciones })
      });
      console.log('✅ Cita actualizada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar estado de cita:', error);
      throw error;
    }
  }
};

export default calendarioService;
