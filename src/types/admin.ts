/**
 * 📝 Tipos TypeScript para el Panel de Administración
 */

// ============= KPIs y Dashboard =============
export interface KPI {
  etiqueta: string;
  valor: string | number;
  tendencia?: {
    valor: number;
    esPositiva: boolean;
  };
}

export interface EstadisticasGenerales {
  total_pacientes_activos: number;
  total_odontologos: number;
  citas_mes_actual: number;
  tratamientos_completados: number;
  ingresos_mes_actual: number;
  promedio_factura: number;
  tasa_ocupacion: number;
}

export interface TendenciaCita {
  fecha: string;
  cantidad: number;
}

export interface TopProcedimiento {
  etiqueta: string;
  valor: number;
}

// ============= Usuarios =============
export interface PerfilOdontologo {
  especialidad?: string;
  numero_licencia?: string;
  telefono?: string;
}

export interface Usuario {
  id: number;
  email: string;
  nombre?: string;
  apellido?: string;
  nombre_completo: string;
  first_name: string;
  last_name: string;
  full_name: string;
  tipo_usuario: 'ADMIN' | 'ODONTOLOGO' | 'RECEPCIONISTA' | 'PACIENTE';
  is_active: boolean;
  date_joined: string;
  perfil_odontologo?: PerfilOdontologo;
}

export interface UsuarioFormData {
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  tipo_usuario: 'ADMIN' | 'ODONTOLOGO' | 'RECEPCIONISTA';
  perfil_odontologo?: {
    especialidad?: string;
    numero_licencia?: string;
    telefono?: string;
  };
}

export interface FiltrosUsuarios {
  tipo_usuario?: string;
  is_active?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

// ============= Pacientes =============
export interface Paciente {
  id: number;
  full_name: string;
  email: string;
  telefono?: string;
  fecha_nacimiento?: string;
  direccion?: string;
  ci?: string;
  is_active: boolean;
  date_joined: string;
  ultima_cita?: string;
  total_citas?: number;
  saldo_pendiente?: number;
}

export interface FiltrosPacientes {
  search?: string;
  is_active?: string;
  page?: number;
  page_size?: number;
}

// ============= Inventario =============
export interface InsumoStockBajo {
  id: number;
  nombre: string;
  stock_actual: number;
  stock_minimo: number;
  unidad_medida: string;
}

// ============= Bitácora =============
export interface EventoBitacora {
  id: number;
  usuario_nombre: string;
  accion_display: string;
  descripcion: string;
  fecha_hora: string;
  tabla_afectada?: string;
}

// ============= Alertas =============
export interface Alerta {
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  link?: string;
  count?: number;
}

// ============= Actividad =============
export interface ActividadReciente {
  id: number;
  tipo: 'cita' | 'plan' | 'factura' | 'usuario' | 'paciente';
  icono: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  usuario?: string;
}

// ============= Reportes =============
export interface FiltrosReporte {
  fecha_inicio?: string;
  fecha_fin?: string;
  tipo_reporte?: string;
  odontologo_id?: number;
  formato?: 'pdf' | 'excel' | 'csv';
}

export interface DatosGrafico {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    fill?: boolean;
    tension?: number;
  }[];
}

// ============= Respuestas API =============
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  message?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}
