import api from '../config/apiConfig';

// ============================================================================
// TIPOS
// ============================================================================

export interface CrearPlanDTO {
  paciente: number;
  odontologo: number;
  titulo: string;
  descripcion?: string;
  estado?: 'PROPUESTO' | 'PRESENTADO' | 'ACEPTADO' | 'EN_PROGRESO' | 'COMPLETADO' | 'CANCELADO';
  prioridad?: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  notas_internas?: string;
}

export interface PacienteInfo {
  id: number;
  nombre_completo: string;
  email: string;
}

export interface OdontologoInfo {
  id: number;
  nombre_completo: string;
  especialidad: string | null;
}

export interface ItemPlanTratamiento {
  id: number;
  plan: number;
  servicio: number;
  servicio_nombre: string;
  insumo_seleccionado: number | null;
  insumo_nombre: string | null;
  precio_servicio_snapshot: string;
  precio_materiales_fijos_snapshot: string;
  precio_insumo_seleccionado_snapshot: string;
  precio_total: string;
  precio_total_formateado: string;
  estado: string;
  estado_display: string;
  orden: number;
  notas: string;
  fecha_estimada: string | null;
  fecha_realizada: string | null;
  creado: string;
}

export interface PlanDeTratamiento {
  id: number;
  titulo: string;
  descripcion: string;
  paciente: number;
  paciente_info: PacienteInfo;
  odontologo: number;
  odontologo_info: OdontologoInfo;
  estado: string;
  estado_display: string;
  prioridad: string;
  prioridad_display: string;
  fecha_creacion: string;
  fecha_presentacion: string | null;
  fecha_aceptacion: string | null;
  fecha_inicio: string | null;
  fecha_finalizacion: string | null;
  items: ItemPlanTratamiento[];
  precio_total_plan: string;
  cantidad_items: number;
  porcentaje_completado: number;
  puede_ser_editado: boolean;
  notas_internas: string;
  creado: string;
  actualizado: string;
}

export interface CrearItemPlanDTO {
  plan: number;
  servicio: number;
  insumo_seleccionado?: number | null;
  orden?: number;
  notas?: string;
  fecha_estimada?: string;
}

// ============================================================================
// API CALLS
// ============================================================================

/**
 * Listar planes de tratamiento
 */
export const obtenerPlanes = async (filtros?: {
  paciente?: number;
  odontologo?: number;
  estado?: string;
}): Promise<PlanDeTratamiento[]> => {
  console.log('📋 Obteniendo planes de tratamiento...', filtros);
  
  const params = new URLSearchParams();
  if (filtros?.paciente) params.append('paciente', filtros.paciente.toString());
  if (filtros?.odontologo) params.append('odontologo', filtros.odontologo.toString());
  if (filtros?.estado) params.append('estado', filtros.estado);
  
  const response = await api.get<PlanDeTratamiento[]>(
    `/api/tratamientos/planes/${params.toString() ? '?' + params.toString() : ''}`
  );
  
  console.log('✅ Planes recibidos:', response.data.length);
  return response.data;
};

/**
 * Obtener detalle de un plan
 */
export const obtenerPlan = async (id: number): Promise<PlanDeTratamiento> => {
  console.log('📋 Obteniendo plan:', id);
  const response = await api.get<PlanDeTratamiento>(`/api/tratamientos/planes/${id}/`);
  console.log('✅ Plan recibido:', response.data);
  return response.data;
};

/**
 * Crear un nuevo plan de tratamiento
 */
export const crearPlan = async (datos: CrearPlanDTO): Promise<PlanDeTratamiento> => {
  console.log('📝 Creando plan:', datos);
  const response = await api.post<PlanDeTratamiento>('/api/tratamientos/planes/', datos);
  console.log('✅ Plan creado:', response.data);
  return response.data;
};

/**
 * Actualizar un plan existente
 */
export const actualizarPlan = async (
  id: number,
  datos: Partial<CrearPlanDTO>
): Promise<PlanDeTratamiento> => {
  console.log('📝 Actualizando plan:', id, datos);
  const response = await api.patch<PlanDeTratamiento>(`/api/tratamientos/planes/${id}/`, datos);
  console.log('✅ Plan actualizado:', response.data);
  return response.data;
};

/**
 * Eliminar un plan
 */
export const eliminarPlan = async (id: number): Promise<void> => {
  console.log('🗑️ Eliminando plan:', id);
  await api.delete(`/api/tratamientos/planes/${id}/`);
  console.log('✅ Plan eliminado');
};

/**
 * Crear un ítem (servicio) en el plan
 */
export const crearItemPlan = async (datos: CrearItemPlanDTO): Promise<ItemPlanTratamiento> => {
  console.log('📝 Creando ítem del plan:', datos);
  const response = await api.post<ItemPlanTratamiento>('/api/tratamientos/items/', datos);
  console.log('✅ Ítem creado:', response.data);
  return response.data;
};

/**
 * Actualizar un ítem del plan
 */
export const actualizarItemPlan = async (
  id: number,
  datos: Partial<CrearItemPlanDTO>
): Promise<ItemPlanTratamiento> => {
  console.log('📝 Actualizando ítem:', id, datos);
  const response = await api.patch<ItemPlanTratamiento>(`/api/tratamientos/items/${id}/`, datos);
  console.log('✅ Ítem actualizado:', response.data);
  return response.data;
};

/**
 * Eliminar un ítem del plan
 */
export const eliminarItemPlan = async (id: number): Promise<void> => {
  console.log('🗑️ Eliminando ítem:', id);
  await api.delete(`/api/tratamientos/items/${id}/`);
  console.log('✅ Ítem eliminado');
};

/**
 * Marcar un ítem como completado
 */
export const completarItemPlan = async (id: number): Promise<ItemPlanTratamiento> => {
  console.log('✅ Marcando ítem como completado:', id);
  const response = await api.patch<ItemPlanTratamiento>(`/api/tratamientos/items/${id}/`, {
    estado: 'COMPLETADO',
    fecha_realizada: new Date().toISOString()
  });
  console.log('✅ Ítem completado:', response.data);
  return response.data;
};

// ============================================================================
// NUEVAS FUNCIONES PARA GESTIÓN DEL PLAN (GUÍA 17)
// ============================================================================

/**
 * Presentar plan al paciente (PROPUESTO → PRESENTADO)
 */
export const presentarPlan = async (planId: number): Promise<PlanDeTratamiento> => {
  console.log('📋 Presentando plan:', planId);
  const response = await api.patch<PlanDeTratamiento>(
    `/api/tratamientos/planes/${planId}/`,
    { estado: 'PRESENTADO' }
  );
  console.log('✅ Plan presentado:', response.data);
  return response.data;
};

/**
 * Aceptar plan (PRESENTADO → ACEPTADO)
 */
export const aceptarPlan = async (planId: number): Promise<PlanDeTratamiento> => {
  console.log('✔️ Aceptando plan:', planId);
  const response = await api.patch<PlanDeTratamiento>(
    `/api/tratamientos/planes/${planId}/`,
    { estado: 'ACEPTADO' }
  );
  console.log('✅ Plan aceptado:', response.data);
  return response.data;
};

/**
 * Rechazar plan (PROPUESTO/PRESENTADO → RECHAZADO)
 */
export const rechazarPlan = async (
  planId: number,
  motivoRechazo?: string
): Promise<PlanDeTratamiento> => {
  console.log('✖️ Rechazando plan:', planId, 'Motivo:', motivoRechazo);
  const response = await api.patch<PlanDeTratamiento>(
    `/api/tratamientos/planes/${planId}/`,
    { 
      estado: 'RECHAZADO',
      observaciones: motivoRechazo || undefined
    }
  );
  console.log('✅ Plan rechazado:', response.data);
  return response.data;
};

/**
 * Cancelar plan (ACEPTADO/EN_PROGRESO → CANCELADO)
 */
export const cancelarPlan = async (
  planId: number,
  motivoCancelacion?: string
): Promise<PlanDeTratamiento> => {
  console.log('🚫 Cancelando plan:', planId, 'Motivo:', motivoCancelacion);
  const response = await api.patch<PlanDeTratamiento>(
    `/api/tratamientos/planes/${planId}/`,
    { 
      estado: 'CANCELADO',
      observaciones: motivoCancelacion || undefined
    }
  );
  console.log('✅ Plan cancelado:', response.data);
  return response.data;
};

/**
 * Completar ítem manualmente (sin episodio vinculado)
 */
export const completarItemManual = async (itemId: number): Promise<ItemPlanTratamiento> => {
  console.log('✅ Completando ítem manualmente:', itemId);
  const response = await api.patch<ItemPlanTratamiento>(
    `/api/tratamientos/items/${itemId}/`,
    { estado: 'COMPLETADO' }
  );
  console.log('✅ Ítem completado manualmente:', response.data);
  return response.data;
};

// ============================================================================
// FUNCIONES PARA VINCULACIÓN CON AGENDA (GUÍA 18)
// ============================================================================

/**
 * Obtener planes activos de un paciente (ACEPTADO o EN_PROGRESO)
 */
export const obtenerPlanesActivos = async (pacienteId: number): Promise<PlanDeTratamiento[]> => {
  console.log('🔍 Obteniendo planes activos del paciente:', pacienteId);
  
  try {
    // Intentar obtener todos los planes y filtrar en el frontend
    const response = await api.get<PlanDeTratamiento[]>(
      `/api/tratamientos/planes/?paciente=${pacienteId}`
    );
    
    console.log('📋 Todos los planes del paciente:', response.data);
    
    // Filtrar solo los activos (ACEPTADO o EN_PROGRESO)
    const planesActivos = response.data.filter(plan => 
      plan.estado === 'ACEPTADO' || plan.estado === 'EN_PROGRESO'
    );
    
    console.log('✅ Planes activos encontrados:', planesActivos.length, planesActivos);
    return planesActivos;
  } catch (error: any) {
    console.error('❌ Error al obtener planes activos:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Obtener ítems disponibles para vincular de un plan
 * (solo PENDIENTE o EN_PROGRESO)
 */
export const obtenerItemsDisponibles = (plan: PlanDeTratamiento): ItemPlanTratamiento[] => {
  const disponibles = plan.items.filter(item => 
    item.estado === 'PENDIENTE' || item.estado === 'EN_PROGRESO'
  );
  console.log(`📋 Ítems disponibles del plan "${plan.titulo}":`, disponibles.length);
  return disponibles;
};
