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
    
    const { data } = await api.get(`/api/usuarios/usuarios/?${params.toString()}`);
    return data;
  },

  /**
   * Obtener un usuario por ID
   */
  async getUsuario(id: number): Promise<Usuario> {
    const { data } = await api.get(`/api/usuarios/usuarios/${id}/`);
    return data;
  },

  /**
   * Crear nuevo usuario
   */
  async createUsuario(userData: UsuarioFormData): Promise<Usuario> {
    const { data } = await api.post('/api/usuarios/usuarios/', userData);
    return data;
  },

  /**
   * Actualizar usuario existente
   */
  async updateUsuario(id: number, userData: Partial<UsuarioFormData>): Promise<Usuario> {
    const { data } = await api.patch(`/api/usuarios/usuarios/${id}/`, userData);
    return data;
  },

  /**
   * Desactivar usuario (soft delete)
   */
  async toggleActivo(id: number, is_active: boolean): Promise<Usuario> {
    const { data } = await api.patch(`/api/usuarios/usuarios/${id}/`, { is_active });
    return data;
  },

  /**
   * Eliminar usuario permanentemente
   */
  async deleteUsuario(id: number): Promise<void> {
    await api.delete(`/api/usuarios/usuarios/${id}/`);
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
