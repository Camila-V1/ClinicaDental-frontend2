import api from '../config/apiConfig';

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  first_name: string;
  last_name: string;
  full_name: string;
  nombre_completo: string;
  ci?: string;
  telefono?: string;
  direccion?: string;
  tipo_usuario: string;
  is_active: boolean;
  fecha_registro?: string;
}

/**
 * Obtener lista de usuarios
 */
export const obtenerUsuarios = async (filtros?: {
  tipo_usuario?: string;
  search?: string;
  page?: number;
}): Promise<Usuario[]> => {
  const params = new URLSearchParams();
  if (filtros?.search) params.append('search', filtros.search);
  if (filtros?.page) params.append('page', filtros.page.toString());
  
  // Determinar endpoint basado en el tipo de usuario
  let endpoint = '/api/usuarios/pacientes/'; // Default a pacientes si no se especifica
  if (filtros?.tipo_usuario === 'ODONTOLOGO') endpoint = '/api/usuarios/odontologos/';
  else if (filtros?.tipo_usuario === 'PACIENTE') endpoint = '/api/usuarios/pacientes/';
  else if (filtros?.tipo_usuario === 'RECEPCIONISTA') endpoint = '/api/usuarios/recepcionistas/';
  else if (filtros?.tipo_usuario === 'ADMIN') endpoint = '/api/usuarios/admins/';

  const response = await api.get<Usuario[]>(
    `${endpoint}${params.toString() ? '?' + params.toString() : ''}`
  );
  return response.data;
};

/**
 * Obtener lista de pacientes
 */
export const obtenerPacientes = async (): Promise<Usuario[]> => {
  const response = await api.get<Usuario[]>('/api/usuarios/pacientes/');
  return response.data;
};

/**
 * Obtener perfil del usuario actual
 */
export const obtenerPerfil = async (): Promise<Usuario> => {
  const response = await api.get<Usuario>('/api/usuarios/me/');
  return response.data;
};
