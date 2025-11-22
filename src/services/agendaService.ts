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
  historial_clinico_id?: number; // ID del historial clínico del paciente
  
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
  
  const response = await api.get<any>(`/api/agenda/citas/?${params}`);
  
  // 🔧 FIX TEMPORAL: Manejar formato paginado ({count, results}) o array directo
  const citas = response.data?.results ? response.data.results : response.data;
  
  console.log('✅ Citas recibidas:', Array.isArray(citas) ? citas.length : 0, 'citas');
  console.log('📊 Datos:', citas);
  
  return citas;
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

// ==========================================
// 👤 MÉTODOS ESPECÍFICOS PARA PACIENTES
// ==========================================

/**
 * 📅 Obtener mis citas (paciente actual)
 */
export const obtenerMisCitas = async (filtros?: FiltrosCitas): Promise<Cita[]> => {
  const params = new URLSearchParams();
  
  if (filtros?.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
  if (filtros?.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
  if (filtros?.estado) params.append('estado', filtros.estado);

  console.log('📅 Obteniendo mis citas como paciente...');
  
  // Usar el mismo endpoint que obtenerCitas, el backend filtra automáticamente por paciente
  const response = await api.get<any>(`/api/agenda/citas/?${params}`);
  
  // 🔧 FIX TEMPORAL: Manejar formato paginado ({count, results}) o array directo
  const citas = response.data?.results ? response.data.results : response.data;
  
  console.log('✅ Mis citas recibidas:', Array.isArray(citas) ? citas.length : 0);
  return citas;
};

/**
 * 📝 Solicitar nueva cita (paciente)
 */
export interface SolicitarCitaData {
  fecha_hora: string; // ISO string
  motivo: string;
  odontologo_id?: number;
  duracion?: number;
}

export const solicitarCita = async (data: SolicitarCitaData): Promise<Cita> => {
  console.log('📝 Solicitando nueva cita:', data);
  
  const response = await api.post<Cita>('/api/agenda/citas/solicitar/', data);
  
  console.log('✅ Cita solicitada exitosamente:', response.data);
  return response.data;
};

/**
 * ❌ Cancelar mi cita (paciente)
 */
export const cancelarMiCita = async (citaId: number, motivo?: string): Promise<Cita> => {
  console.log('❌ Cancelando mi cita:', citaId);
  
  const response = await api.post<Cita>(
    `/api/agenda/citas/${citaId}/cancelar/`,
    motivo ? { motivo } : {}
  );
  
  console.log('✅ Cita cancelada:', response.data);
  return response.data;
};

/**
 * 🔄 Reprogramar mi cita (paciente)
 */
export interface ReprogramarCitaData {
  nueva_fecha_hora: string; // ISO string
  motivo?: string;
}

export const reprogramarCita = async (
  citaId: number,
  data: ReprogramarCitaData
): Promise<Cita> => {
  console.log('🔄 Reprogramando cita:', citaId, data);
  
  const response = await api.post<Cita>(
    `/api/agenda/citas/${citaId}/reprogramar/`,
    data
  );
  
  console.log('✅ Cita reprogramada:', response.data);
  return response.data;
};

/**
 * 📊 Obtener próximas citas del paciente (para dashboard)
 */
export const obtenerProximasCitas = async (limite: number = 3): Promise<Cita[]> => {
  console.log('📊 Obteniendo próximas citas...');
  
  // Filtrar por citas futuras y límite
  const hoy = new Date().toISOString().split('T')[0];
  const response = await api.get<any>(
    `/api/agenda/citas/?fecha_inicio=${hoy}&ordering=fecha_hora&limit=${limite}`
  );
  
  // 🔧 FIX TEMPORAL: Manejar formato paginado ({count, results}) o array directo
  const citas = response.data?.results ? response.data.results : response.data;
  
  console.log('✅ Próximas citas:', Array.isArray(citas) ? citas.length : 0);
  return citas;
};

/**
 * 👨‍⚕️ Obtener lista de odontólogos disponibles
 */
export interface OdontologoDisponible {
  id: number;
  nombre: string;
  especialidad?: string;
  email: string;
}

export const obtenerOdontologosDisponibles = async (): Promise<OdontologoDisponible[]> => {
  console.log('👨‍⚕️ Obteniendo odontólogos disponibles...');
  
  const response = await api.get<OdontologoDisponible[]>(
    '/api/usuarios/odontologos/'
  );
  
  console.log('✅ Odontólogos disponibles:', response.data.length);
  return response.data;
};

/**
 * 🕐 Obtener horarios disponibles de un odontólogo en una fecha
 */
export interface HorarioDisponible {
  hora: string; // "08:00", "08:30", etc.
  disponible: boolean;
}

export interface HorariosResponse {
  fecha: string;
  odontologo: string;
  total_disponibles: number;
  total_ocupados: number;
  horarios: HorarioDisponible[];
}

export const obtenerHorariosDisponibles = async (
  odontologoId: number,
  fecha: string // YYYY-MM-DD
): Promise<HorariosResponse> => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🕐 [HORARIOS DISPONIBLES] Iniciando consulta...');
  console.log('═══════════════════════════════════════════════════════');
  console.log('📋 Parámetros:');
  console.log('  - Odontólogo ID:', odontologoId);
  console.log('  - Fecha:', fecha);
  
  const response = await api.get<HorariosResponse>(
    `/api/agenda/citas/horarios_disponibles/?odontologo=${odontologoId}&fecha=${fecha}`
  );
  
  console.log('📦 Respuesta recibida:', response.data);
  console.log('📊 Odontólogo:', response.data.odontologo);
  console.log('📊 Total horarios:', response.data.horarios.length);
  console.log('✅ Disponibles:', response.data.total_disponibles);
  console.log('❌ Ocupados:', response.data.total_ocupados);
  console.log('═══════════════════════════════════════════════════════');
  console.log('📋 LISTA COMPLETA DE HORARIOS:');
  response.data.horarios.forEach((h, idx) => {
    console.log(`  ${idx + 1}. ${h.hora} - ${h.disponible ? '✅ DISPONIBLE' : '❌ OCUPADO'}`);
  });
  console.log('═══════════════════════════════════════════════════════');
  
  return response.data;
};

/**
 * 📋 Tipos de motivo de cita
 */
export type MotivoTipo = 'CONSULTA' | 'URGENCIA' | 'LIMPIEZA' | 'REVISION' | 'PLAN';

export interface MotivoOption {
  value: MotivoTipo;
  label: string;
  descripcion: string;
  precio: string;
}

export const MOTIVOS_CITA: MotivoOption[] = [
  { value: 'CONSULTA', label: 'Consulta General', descripcion: 'Primera consulta o revisión general', precio: '$30.00' },
  { value: 'URGENCIA', label: 'Urgencia/Dolor', descripcion: 'Atención urgente por dolor', precio: '$80.00' },
  { value: 'LIMPIEZA', label: 'Limpieza Dental', descripcion: 'Limpieza y profilaxis', precio: '$60.00' },
  { value: 'REVISION', label: 'Revisión/Control', descripcion: 'Control de tratamiento previo', precio: '$20.00' },
  { value: 'PLAN', label: 'Cita de Plan de Tratamiento', descripcion: 'Vinculada a un plan activo', precio: '$0.00' }
];

/**
 * 📋 Obtener planes activos del paciente
 */
export interface ItemPlanDisponible {
  id: number;
  servicio_nombre: string;
  estado: string;
  orden: number;
  notas: string;
  precio_total: string;
}

export interface PlanActivoSimple {
  id: number;
  nombre: string;
  titulo?: string;
  estado: string;
  odontologo_nombre: string;
  items_disponibles: ItemPlanDisponible[];
}

export const obtenerPlanesActivos = async (): Promise<PlanActivoSimple[]> => {
  console.log('📋 Obteniendo planes activos del paciente...');
  
  try {
    // Usar el endpoint específico de planes activos (ACEPTADO + EN_PROGRESO)
    const response = await api.get('/api/tratamientos/planes/activos/');
    
    console.log('✅ Planes activos:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo planes activos:', error);
    return [];
  }
};

/**
 * 📝 Solicitar cita AVANZADA (con tipo y item_plan)
 */
export interface SolicitarCitaAvanzadaData {
  odontologo: number;
  fecha_hora: string; // ISO 8601
  motivo_tipo: MotivoTipo;
  motivo: string;
  observaciones?: string;
  item_plan?: number | null; // Solo si motivo_tipo === 'PLAN'
}

export const solicitarCitaAvanzada = async (data: SolicitarCitaAvanzadaData): Promise<Cita> => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('📝 [SOLICITAR CITA AVANZADA] Iniciando creación...');
  console.log('═══════════════════════════════════════════════════════');
  console.log('📤 Datos enviados:');
  console.log('  - Odontólogo ID:', data.odontologo);
  console.log('  - Fecha/Hora:', data.fecha_hora);
  console.log('  - Tipo de motivo:', data.motivo_tipo);
  console.log('  - Motivo:', data.motivo);
  console.log('  - Observaciones:', data.observaciones || '(ninguna)');
  console.log('  - Item Plan ID:', data.item_plan || '(no vinculada a plan)');
  console.log('  - Es cita de plan:', data.motivo_tipo === 'PLAN' ? 'SÍ' : 'NO');
  
  const response = await api.post<Cita>('/api/agenda/citas/', data);
  
  console.log('═══════════════════════════════════════════════════════');
  console.log('✅ [CITA CREADA EXITOSAMENTE]');
  console.log('═══════════════════════════════════════════════════════');
  console.log('📋 Datos de la cita creada:');
  console.log('  - ID:', response.data.id);
  console.log('  - Paciente:', response.data.paciente_nombre);
  console.log('  - Odontólogo:', response.data.odontologo_nombre);
  console.log('  - Fecha/Hora:', response.data.fecha_hora);
  console.log('  - Estado:', response.data.estado);
  console.log('  - Motivo:', response.data.motivo);
  console.log('  - Es cita plan:', response.data.es_cita_plan);
  console.log('  - Item Plan:', response.data.item_plan);
  console.log('═══════════════════════════════════════════════════════');
  
  return response.data;
};
