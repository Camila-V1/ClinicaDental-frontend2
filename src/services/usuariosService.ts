import api from '../config/apiConfig';

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  full_name: string;
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
  if (filtros?.tipo_usuario) params.append('tipo_usuario', filtros.tipo_usuario);
  if (filtros?.search) params.append('search', filtros.search);
  if (filtros?.page) params.append('page', filtros.page.toString());
  
  const response = await api.get<Usuario[]>(
    `/api/usuarios/${params.toString() ? '?' + params.toString() : ''}`
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
