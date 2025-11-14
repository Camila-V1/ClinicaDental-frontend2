/**
 * 📅 Tipos para el Calendario de Citas
 */

// Estados de cita
export type EstadoCita = 'PENDIENTE' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA';

// Tipos de motivo
export type MotivoTipo = 
  | 'CONSULTA'
  | 'LIMPIEZA'
  | 'EXTRACCION'
  | 'ENDODONCIA'
  | 'CIRUGIA'
  | 'REVISION'
  | 'EMERGENCIA'
  | 'OTRO';

// Evento del calendario (adaptado para react-big-calendar)
export interface EventoCalendario {
  id: number;
  title: string; // Nombre del paciente
  start: Date; // Fecha/hora inicio
  end: Date; // Fecha/hora fin (estimado)
  resource: CitaCalendario; // Datos completos de la cita
}

// Datos del paciente en la cita
export interface PacienteCita {
  id: number;
  nombre: string;
  email?: string;
  historial_clinico_id?: number;
}

// Datos de la cita
export interface CitaCalendario {
  id: number;
  paciente: number | PacienteCita;
  paciente_nombre: string;
  paciente_email?: string;
  odontologo: number;
  odontologo_nombre: string;
  fecha_hora: string; // ISO string
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:MM
  estado: EstadoCita;
  motivo: string;
  motivo_tipo?: MotivoTipo;
  observaciones?: string;
  motivo_consulta?: string;
  duracion_minutos?: number; // Duración estimada (default: 30)
}

// Filtros del calendario
export interface FiltrosCalendario {
  fecha_inicio: string; // YYYY-MM-DD
  fecha_fin: string; // YYYY-MM-DD
  estado?: EstadoCita;
}

// Vista del calendario
export type VistaCalendario = 'month' | 'week' | 'day' | 'agenda';

// Horarios disponibles
export interface DisponibilidadResponse {
  fecha: string;
  horarios_disponibles: string[];
}

// Configuración de colores por estado
export const COLORES_ESTADO: Record<EstadoCita, string> = {
  PENDIENTE: '#FFA726', // Naranja
  CONFIRMADA: '#66BB6A', // Verde
  ATENDIDA: '#42A5F5', // Azul
  CANCELADA: '#EF5350', // Rojo
};

// Configuración de duración por tipo de motivo (minutos)
export const DURACION_POR_TIPO: Record<MotivoTipo, number> = {
  CONSULTA: 30,
  LIMPIEZA: 45,
  EXTRACCION: 60,
  ENDODONCIA: 90,
  CIRUGIA: 120,
  REVISION: 20,
  EMERGENCIA: 30,
  OTRO: 30,
};
