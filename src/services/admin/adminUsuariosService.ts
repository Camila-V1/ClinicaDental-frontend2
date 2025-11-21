/**
 * 👥 Servicio para Gestión de Usuarios (Admin)
 */

import api from '@/config/apiConfig';
import type { 
  Usuario, 
  UsuarioFormData, 
  FiltrosUsuarios,
  PaginatedResponse 
} from '@/types/admin';

export const adminUsuariosService = {
  /**
   * Listar usuarios con filtros
   */
  async getUsuarios(filtros: FiltrosUsuarios = {}): Promise<PaginatedResponse<Usuario>> {
    const params = new URLSearchParams();
    
    if (filtros.tipo_usuario) params.append('tipo_usuario', filtros.tipo_usuario);
    if (filtros.is_active !== undefined) params.append('is_active', filtros.is_active);
    if (filtros.search) params.append('search', filtros.search);
    if (filtros.page) params.append('page', filtros.page.toString());
    if (filtros.page_size) params.append('page_size', filtros.page_size.toString());
    
    // Determinar endpoint basado en el tipo de usuario
    let endpoint: string;
    if (filtros.tipo_usuario === 'ODONTOLOGO') endpoint = '/api/usuarios/odontologos/';
    else if (filtros.tipo_usuario === 'PACIENTE') endpoint = '/api/usuarios/pacientes/';
    else if (filtros.tipo_usuario === 'RECEPCIONISTA') endpoint = '/api/usuarios/recepcionistas/';
    else if (filtros.tipo_usuario === 'ADMIN') endpoint = '/api/usuarios/admins/';
    else {
      throw new Error('Debe especificar un tipo_usuario válido (ODONTOLOGO, PACIENTE, RECEPCIONISTA, ADMIN)');
    }

    const { data } = await api.get(`${endpoint}?${params.toString()}`);
    return data;
  },

  /**
   * Obtener un usuario por ID
   */
  async getUsuario(id: number, tipo_usuario?: string): Promise<Usuario> {
    if (!tipo_usuario) {
      throw new Error('Debe especificar el tipo_usuario para obtener un usuario específico');
    }
    
    let endpoint: string;
    if (tipo_usuario === 'ODONTOLOGO') endpoint = '/api/usuarios/odontologos/';
    else if (tipo_usuario === 'PACIENTE') endpoint = '/api/usuarios/pacientes/';
    else if (tipo_usuario === 'RECEPCIONISTA') endpoint = '/api/usuarios/recepcionistas/';
    else if (tipo_usuario === 'ADMIN') endpoint = '/api/usuarios/admins/';
    else {
      throw new Error(`Tipo de usuario no válido: ${tipo_usuario}`);
    }
    
    const { data } = await api.get(`${endpoint}${id}/`);
    return data;
  },

  /**
   * Crear nuevo usuario
   */
  async createUsuario(userData: UsuarioFormData): Promise<Usuario> {
    let endpoint: string;
    if (userData.tipo_usuario === 'ODONTOLOGO') endpoint = '/api/usuarios/odontologos/';
    else if (userData.tipo_usuario === 'RECEPCIONISTA') endpoint = '/api/usuarios/recepcionistas/';
    else if (userData.tipo_usuario === 'ADMIN') endpoint = '/api/usuarios/admins/';
    else {
      throw new Error(`Tipo de usuario no válido para crear: ${userData.tipo_usuario}`);
    }

    const { data } = await api.post(endpoint, userData);
    return data;
  },

  /**
   * Actualizar usuario existente
   */
  async updateUsuario(id: number, userData: Partial<UsuarioFormData>, tipo_usuario?: string): Promise<Usuario> {
    // Si no se pasa el tipo, intentamos deducirlo de userData
    const tipo = tipo_usuario || userData.tipo_usuario;
    
    if (!tipo) {
      throw new Error('Debe especificar el tipo_usuario para actualizar un usuario');
    }
    
    let endpoint: string;
    if (tipo === 'ODONTOLOGO') endpoint = '/api/usuarios/odontologos/';
    else if (tipo === 'PACIENTE') endpoint = '/api/usuarios/pacientes/';
    else if (tipo === 'RECEPCIONISTA') endpoint = '/api/usuarios/recepcionistas/';
    else if (tipo === 'ADMIN') endpoint = '/api/usuarios/admins/';
    else {
      throw new Error(`Tipo de usuario no válido: ${tipo}`);
    }

    const { data } = await api.patch(`${endpoint}${id}/`, userData);
    return data;
  },

  /**
   * Desactivar usuario (soft delete)
   */
  async toggleActivo(id: number, is_active: boolean, tipo_usuario?: string): Promise<Usuario> {
    if (!tipo_usuario) {
      throw new Error('Debe especificar el tipo_usuario para cambiar el estado');
    }
    
    let endpoint: string;
    if (tipo_usuario === 'ODONTOLOGO') endpoint = '/api/usuarios/odontologos/';
    else if (tipo_usuario === 'PACIENTE') endpoint = '/api/usuarios/pacientes/';
    else if (tipo_usuario === 'RECEPCIONISTA') endpoint = '/api/usuarios/recepcionistas/';
    else if (tipo_usuario === 'ADMIN') endpoint = '/api/usuarios/admins/';
    else {
      throw new Error(`Tipo de usuario no válido: ${tipo_usuario}`);
    }

    const { data } = await api.patch(`${endpoint}${id}/`, { is_active });
    return data;
  },

  /**
   * Eliminar usuario permanentemente
   */
  async deleteUsuario(id: number, tipo_usuario?: string): Promise<void> {
    if (!tipo_usuario) {
      throw new Error('Debe especificar el tipo_usuario para eliminar un usuario');
    }
    
    let endpoint: string;
    if (tipo_usuario === 'ODONTOLOGO') endpoint = '/api/usuarios/odontologos/';
    else if (tipo_usuario === 'PACIENTE') endpoint = '/api/usuarios/pacientes/';
    else if (tipo_usuario === 'RECEPCIONISTA') endpoint = '/api/usuarios/recepcionistas/';
    else if (tipo_usuario === 'ADMIN') endpoint = '/api/usuarios/admins/';
    else {
      throw new Error(`Tipo de usuario no válido: ${tipo_usuario}`);
    }
    
    await api.delete(`${endpoint}${id}/`);
  },

  /**
   * Obtener estadísticas de un odontólogo
   */
  async getEstadisticasOdontologo(id: number, mes?: string) {
    const params = mes ? { mes } : {};
    const { data } = await api.get(`/api/reportes/reportes/reporte-citas-odontologo/`, {
      params: { ...params, odontologo_id: id }
    });
    return data;
  },
};
