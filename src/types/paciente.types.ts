/**
 * 👤 TIPOS PARA MÓDULO DE PACIENTES
 * Types específicos para el portal de pacientes
 */

import type { Cita, FiltrosCitas, SolicitarCitaData, ReprogramarCitaData, OdontologoDisponible } from '../services/agendaService';
import type { Factura, ItemFactura, Pago, EstadoCuenta, FiltrosFacturas } from '../services/facturacionService';

// Re-exportar para uso en componentes
export type {
  Cita,
  FiltrosCitas,
  SolicitarCitaData,
  ReprogramarCitaData,
  OdontologoDisponible,
  Factura,
  ItemFactura,
  Pago,
  EstadoCuenta,
  FiltrosFacturas,
};

// ==========================================
// 🦷 PLAN DE TRATAMIENTO
// ==========================================

export interface PlanTratamiento {
  id: number;
  nombre: string;
  descripcion: string;
  paciente_id: number;
  paciente_nombre: string;
  odontologo_id: number;
  odontologo_nombre: string;
  fecha_inicio: string;
  fecha_fin_estimada?: string;
  estado: 'BORRADOR' | 'ACTIVO' | 'PAUSADO' | 'COMPLETADO' | 'CANCELADO';
  precio_total: string;
  notas?: string;
  created_at: string;
  updated_at: string;
  items: ItemPlan[];
  progreso_porcentaje: number;
}

export interface ItemPlan {
  id: number;
  plan_id: number;
  servicio_id: number;
  servicio_nombre: string;
  servicio_descripcion?: string;
  precio_servicio: string;
  precio_laboratorio: string;
  precio_total: string;
  estado: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADO' | 'CANCELADO';
  sesiones_previstas: number;
  sesiones_completadas: number;
  notas?: string;
  orden: number;
  completado: boolean;
}

export interface FiltrosPlanes {
  estado?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}

// ==========================================
// 📋 HISTORIAL CLÍNICO
// ==========================================

export interface HistorialClinico {
  id: number;
  paciente_id: number;
  paciente_nombre: string;
  fecha_apertura: string;
  antecedentes_medicos?: string;
  alergias?: string;
  medicamentos_actuales?: string;
  notas_generales?: string;
  created_at: string;
  updated_at: string;
  episodios?: EpisodioClinico[];
  documentos?: DocumentoClinico[];
}

export interface EpisodioClinico {
  id: number;
  historial_id: number;
  fecha: string;
  motivo_consulta: string;
  diagnostico: string;
  tratamiento_realizado: string;
  observaciones?: string;
  odontologo_id: number;
  odontologo_nombre: string;
  created_at: string;
  tiene_odontograma: boolean;
}

export interface DocumentoClinico {
  id: number;
  historial_id: number;
  titulo: string;
  tipo: 'RADIOGRAFIA' | 'FOTO' | 'DOCUMENTO' | 'ESTUDIO' | 'OTRO';
  descripcion?: string;
  archivo_url: string;
  archivo_nombre: string;
  fecha_subida: string;
  subido_por_nombre: string;
  episodio_id?: number;
}

export interface FiltrosDocumentos {
  tipo?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}

// ==========================================
// 🦷 ODONTOGRAMA
// ==========================================

export interface Odontograma {
  id: number;
  historial_clinico_id: number;
  episodio_id?: number;
  fecha_creacion: string;
  tipo_denticion: 'ADULTO' | 'NINO';
  estado_piezas: EstadoPiezaDental[];
  observaciones?: string;
}

export interface EstadoPiezaDental {
  numero: number;
  estado: 'SANO' | 'CARIES' | 'OBTURADO' | 'AUSENTE' | 'CORONA' | 'ENDODONCIA' | 'PROTESIS' | 'IMPLANTE';
  caras_afectadas?: string[];
  notas?: string;
}

// ==========================================
// 👤 PERFIL DEL PACIENTE
// ==========================================

export interface PerfilPaciente {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  telefono?: string;
  fecha_nacimiento?: string;
  direccion?: string;
  ciudad?: string;
  documento_identidad?: string;
  
  // Información médica
  alergias?: string;
  enfermedades_cronicas?: string;
  medicamentos_actuales?: string;
  tipo_sangre?: string;
  contacto_emergencia?: string;
  telefono_emergencia?: string;
  
  // Sistema
  fecha_registro: string;
  ultima_cita?: string;
  proxima_cita?: string;
}

// ==========================================
// 📊 DASHBOARD DEL PACIENTE
// ==========================================

export interface DashboardPaciente {
  paciente: PerfilPaciente;
  proximas_citas: Cita[];
  planes_activos: PlanTratamiento[];
  ultima_consulta?: {
    fecha: string;
    odontologo: string;
    motivo: string;
  };
  facturas_pendientes: {
    cantidad: number;
    monto_total: string;
  };
  documentos_recientes: DocumentoClinico[];
}

// ==========================================
// 🔔 NOTIFICACIONES
// ==========================================

export interface Notificacion {
  id: number;
  tipo: 'CITA' | 'FACTURA' | 'DOCUMENTO' | 'TRATAMIENTO' | 'SISTEMA';
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  url?: string;
}

// ==========================================
// 📝 SOLICITUDES Y RESPUESTAS
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ==========================================
// 🎨 UTILIDADES DE UI
// ==========================================

export const ESTADOS_CITA_LABELS: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  CONFIRMADA: 'Confirmada',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada',
  ATENDIDA: 'Atendida',
};

export const ESTADOS_CITA_COLORS: Record<string, string> = {
  PENDIENTE: '#FFA500',
  CONFIRMADA: '#00BFFF',
  COMPLETADA: '#32CD32',
  CANCELADA: '#DC143C',
  ATENDIDA: '#32CD32',
};

export const ESTADOS_FACTURA_LABELS: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  PAGADA: 'Pagada',
  PARCIAL: 'Pago Parcial',
  VENCIDA: 'Vencida',
  ANULADA: 'Anulada',
};

export const ESTADOS_FACTURA_COLORS: Record<string, string> = {
  PENDIENTE: '#FFA500',
  PAGADA: '#32CD32',
  PARCIAL: '#FFD700',
  VENCIDA: '#DC143C',
  ANULADA: '#696969',
};

export const ESTADOS_PLAN_LABELS: Record<string, string> = {
  BORRADOR: 'Borrador',
  ACTIVO: 'Activo',
  PAUSADO: 'Pausado',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado',
};

export const ESTADOS_PLAN_COLORS: Record<string, string> = {
  BORRADOR: '#808080',
  ACTIVO: '#00BFFF',
  PAUSADO: '#FFA500',
  COMPLETADO: '#32CD32',
  CANCELADO: '#DC143C',
};
