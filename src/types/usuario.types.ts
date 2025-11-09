/**
 * 📝 TIPOS DE USUARIO
 * Interfaces y types para gestión de usuarios
 */

import type { TipoUsuario } from './auth.types';

// 👤 Usuario Base
export interface Usuario {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  tipo_usuario: TipoUsuario;
  is_active: boolean;
  fecha_registro: string;
  ultimo_acceso?: string;
  avatar?: string;
  telefono?: string;
  direccion?: string;
}

// 👨‍⚕️ Doctor
export interface Doctor extends Usuario {
  tipo_usuario: 'doctor';
  especialidad?: string;
  numero_licencia?: string;
  horario_trabajo?: HorarioTrabajo[];
}

//  Paciente
export interface Paciente extends Usuario {
  tipo_usuario: 'paciente';
  fecha_nacimiento?: string;
  genero?: 'M' | 'F' | 'Otro';
  documento_identidad?: string;
  contacto_emergencia?: ContactoEmergencia;
  historial_medico?: string;
}

// ⏰ Horario de Trabajo
export interface HorarioTrabajo {
  dia_semana: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Domingo, 6=Sábado
  hora_inicio: string; // formato "HH:MM"
  hora_fin: string;
}

// 📞 Contacto de Emergencia
export interface ContactoEmergencia {
  nombre: string;
  relacion: string;
  telefono: string;
}

// 📋 Filtros de Búsqueda de Usuarios
export interface UsuarioFilters {
  search?: string;
  tipo_usuario?: TipoUsuario;
  is_active?: boolean;
  page?: number;
  page_size?: number;
}

// 📊 Lista Paginada de Usuarios
export interface UsuariosPaginados {
  count: number;
  next: string | null;
  previous: string | null;
  results: Usuario[];
}
