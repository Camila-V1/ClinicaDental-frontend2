/**
 * 📋 HISTORIAL CLÍNICO SERVICE - Gestión de Historiales Médicos
 */

import api from '../config/apiConfig';

export interface HistorialResumen {
  paciente: number;
  paciente_nombre: string;
  paciente_email: string;
  alergias?: string;
  medicamentos_actuales?: string;
  actualizado: string;
  total_episodios: number;
  ultimo_episodio?: string;
}

export interface EpisodioAtencion {
  id: number;
  odontologo: number;
  odontologo_nombre: string;
  odontologo_especialidad?: string;
  item_plan_tratamiento?: number;
  item_plan_descripcion?: string;
  fecha_atencion: string;
  motivo_consulta: string;
  diagnostico?: string;
  descripcion_procedimiento?: string;
  notas_privadas?: string;
}

export interface Odontograma {
  id: number;
  fecha_snapshot: string;
  estado_piezas: Record<string, any>;
  notas?: string;
}

export interface HistorialCompleto {
  paciente: number;
  paciente_nombre: string;
  paciente_email: string;
  paciente_ci?: string;
  paciente_telefono?: string;
  paciente_fecha_nacimiento?: string;
  paciente_direccion?: string;
  
  antecedentes_medicos?: string;
  alergias?: string;
  medicamentos_actuales?: string;
  
  creado: string;
  actualizado: string;
  
  total_episodios: number;
  total_odontogramas: number;
  total_documentos: number;
  ultimo_episodio?: string;
  
  episodios: EpisodioAtencion[];
  odontogramas: Odontograma[];
  documentos: any[];
}

export interface CrearEpisodioDTO {
  historial_clinico: number;
  motivo_consulta: string;
  diagnostico?: string;
  descripcion_procedimiento?: string;
  notas_privadas?: string;
  // 🎯 GUÍA 18: Campos para vincular con planes de tratamiento
  item_plan_tratamiento?: number;  // ID del ítem del plan (si se vincula)
  servicio?: number;  // ID del servicio (para episodios libres)
}

/**
 * Obtener lista de historiales clínicos
 */
export const obtenerHistoriales = async (): Promise<HistorialResumen[]> => {
  console.log('📋 Obteniendo lista de historiales...');
  const response = await api.get<HistorialResumen[]>('/api/historial/historiales/');
  console.log('✅ Historiales recibidos:', response.data.length);
  return response.data;
};

/**
 * Obtener historial completo de un paciente
 */
export const obtenerHistorialCompleto = async (pacienteId: number): Promise<HistorialCompleto> => {
  console.log('📋 Obteniendo historial completo del paciente:', pacienteId);
  const response = await api.get<HistorialCompleto>(`/api/historial/historiales/${pacienteId}/`);
  console.log('✅ Historial completo recibido:', response.data);
  console.log('🔍 DETALLE - CI:', response.data.paciente_ci);
  console.log('🔍 DETALLE - Teléfono:', response.data.paciente_telefono);
  console.log('🔍 DETALLE - Fecha Nac:', response.data.paciente_fecha_nacimiento);
  console.log('🔍 DETALLE - Dirección:', response.data.paciente_direccion);
  console.log('🔍 DETALLE - Nombre:', response.data.paciente_nombre);
  console.log('🔍 DETALLE - Email:', response.data.paciente_email);
  console.log('🔍 DETALLE - Alergias:', response.data.alergias);
  console.log('🔍 DETALLE - Medicamentos:', response.data.medicamentos_actuales);
  console.log('🔍 DETALLE - Antecedentes:', response.data.antecedentes_medicos);
  console.log('📊 OBJETO COMPLETO:', JSON.stringify(response.data, null, 2));
  return response.data;
};

/**
 * Obtener todos los episodios
 */
export const obtenerEpisodios = async (): Promise<EpisodioAtencion[]> => {
  const response = await api.get<EpisodioAtencion[]>('/api/historial/episodios/');
  return response.data;
};

/**
 * Crear nuevo episodio de atención
 */
export const crearEpisodio = async (datos: CrearEpisodioDTO): Promise<EpisodioAtencion> => {
  const response = await api.post<EpisodioAtencion>('/api/historial/episodios/', datos);
  return response.data;
};

/**
 * Obtener mis episodios (del odontólogo logueado)
 */
export const obtenerMisEpisodios = async (): Promise<EpisodioAtencion[]> => {
  const response = await api.get<EpisodioAtencion[]>('/api/historial/episodios/mis_episodios/');
  return response.data;
};

/**
 * Obtener todos los odontogramas
 */
export const obtenerOdontogramas = async (): Promise<Odontograma[]> => {
  const response = await api.get<Odontograma[]>('/api/historial/odontogramas/');
  return response.data;
};
