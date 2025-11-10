/**
 * 📅 AGENDA SERVICE - Gestión de Citas
 */

import api from '../config/apiConfig';

export interface Paciente {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
}

export interface Odontologo {
  id: number;
  nombre: string;
}

export interface ItemPlanInfo {
  id: number;
  servicio_id: number;
  servicio_nombre: string;
  servicio_descripcion: string;
  notas: string;
  precio_servicio: string;
  precio_servicio_snapshot: string;
  precio_laboratorio: string;
  precio_total: string;
  estado: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADO' | 'CANCELADO';
  completado: boolean;
  plan_id: number;
  plan_nombre: string;
  sesiones_previstas: number;
  sesiones_completadas: number;
}

export interface Cita {
  id: number;
  paciente: number; // ID del paciente
  paciente_email: string;
  paciente_nombre?: string;
  odontologo_nombre?: string;
  fecha_hora: string;
  duracion?: number;
  motivo: string;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA' | 'ATENDIDA';
  notas?: string;
  created_at?: string;
  updated_at?: string;
  
  // Información de vinculación a planes (opcionales para compatibilidad con backend antiguo)
  es_cita_plan?: boolean;
  servicio?: number | null;
  item_plan?: number | null;
  item_plan_info?: ItemPlanInfo | null;
}

export interface FiltrosCitas {
  fecha_inicio?: string; // YYYY-MM-DD
  fecha_fin?: string;
  estado?: string;
  paciente?: number;
}

/**
 * Obtener citas del odontólogo actual
 */
export const obtenerCitas = async (filtros?: FiltrosCitas): Promise<Cita[]> => {
  const params = new URLSearchParams();
  
  if (filtros?.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
  if (filtros?.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
  if (filtros?.estado) params.append('estado', filtros.estado);
  if (filtros?.paciente) params.append('paciente', filtros.paciente.toString());

  console.log('📅 Obteniendo citas con filtros:', filtros);
  console.log('🔗 URL completa:', `/api/agenda/citas/?${params}`);
  
  const response = await api.get<Cita[]>(`/api/agenda/citas/?${params}`);
  
  console.log('✅ Citas recibidas:', response.data.length, 'citas');
  console.log('📊 Datos:', response.data);
  
  return response.data;
};

/**
 * Obtener detalle de una cita
 */
export const obtenerCita = async (id: number): Promise<Cita> => {
  const response = await api.get<Cita>(`/api/agenda/citas/${id}/`);
  return response.data;
};

/**
 * Actualizar estado de cita
 */
export const actualizarCita = async (
  id: number,
  datos: Partial<Pick<Cita, 'estado' | 'notas'>>
): Promise<Cita> => {
  const response = await api.patch<Cita>(`/api/agenda/citas/${id}/`, datos);
  return response.data;
};

/**
 * Marcar cita como completada
 */
export const completarCita = async (id: number, notas?: string): Promise<Cita> => {
  return actualizarCita(id, { estado: 'COMPLETADA', notas });
};

/**
 * Cancelar cita
 */
export const cancelarCita = async (id: number, motivo?: string): Promise<Cita> => {
  return actualizarCita(id, { estado: 'CANCELADA', notas: motivo });
};

/**
 * Atender una cita (cambiar estado a ATENDIDA)
 */
export const atenderCita = async (citaId: number, observaciones?: string): Promise<Cita> => {
  console.log('🩺 Atendiendo cita:', citaId, observaciones);
  const response = await api.post<{ message: string; cita: Cita }>(
    `/api/agenda/citas/${citaId}/atender/`,
    observaciones ? { observaciones } : {}
  );
  console.log('✅ Cita atendida:', response.data);
  return response.data.cita;
};

/**
 * Interface para las métricas del día
 */
export interface MetricasCita {
  id: number;
  paciente: {
    full_name: string;
  };
  hora: string;
  motivo: string;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA' | 'ATENDIDA';
}

export interface MetricasDelDia {
  fecha: string;
  citas_hoy: number; // Total de citas del día (número)
  citas_pendientes: number;
  citas_confirmadas: number;
  citas_atendidas: number;
  pacientes_atendidos: number;
  proxima_cita: MetricasCita | null;
}

/**
 * Obtener métricas del día actual del odontólogo
 */
export const obtenerMetricasDia = async (): Promise<MetricasDelDia> => {
  console.log('📊 Obteniendo métricas del día...');
  const response = await api.get<MetricasDelDia>('/api/agenda/citas/metricas-dia/');
  console.log('✅ Métricas recibidas:', response.data);
  return response.data;
};
