/**
 * 🏢 SERVICIO DE MULTI-TENANCY
 * Gestión de clínicas, solicitudes y planes
 */

import api from '../config/apiConfig';

export interface Plan {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  max_usuarios: number;
  max_pacientes: number;
  duracion_dias: number;
  activo: boolean;
}

export interface SolicitudRegistro {
  id: number;
  nombre_clinica: string;
  dominio_deseado: string;
  nombre_contacto: string;
  email: string;
  telefono: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  plan_solicitado: Plan;
  estado: 'PENDIENTE' | 'PROCESADA' | 'RECHAZADA';
  fecha_solicitud: string;
  fecha_procesada?: string;
  motivo_rechazo?: string;
}

export interface CrearSolicitudDTO {
  nombre_clinica: string;
  dominio_deseado: string;
  nombre_contacto: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  plan_solicitado: number;
}

export interface Clinica {
  id: number;
  schema_name: string;
  nombre: string;
  domain: string;
  plan: Plan;
  fecha_creacion: string;
  fecha_vencimiento: string;
  activo: boolean;
}

// Servicio de Tenants
export const tenantsService = {
  /**
   * PLANES (Público)
   */
  async getPlanes(): Promise<Plan[]> {
    const { data } = await api.get('/api/public/planes/');
    return data;
  },

  async getPlan(id: number): Promise<Plan> {
    const { data } = await api.get(`/api/public/planes/${id}/`);
    return data;
  },

  /**
   * SOLICITUDES (Público y Admin)
   */
  async crearSolicitud(solicitud: CrearSolicitudDTO): Promise<SolicitudRegistro> {
    const { data } = await api.post('/api/public/solicitudes/', solicitud);
    return data;
  },

  async getSolicitudes(filtros?: { estado?: string }): Promise<SolicitudRegistro[]> {
    const params = new URLSearchParams();
    if (filtros?.estado) params.append('estado', filtros.estado);
    
    const { data } = await api.get(`/api/public/solicitudes/?${params}`);
    return data;
  },

  async getSolicitud(id: number): Promise<SolicitudRegistro> {
    const { data } = await api.get(`/api/public/solicitudes/${id}/`);
    return data;
  },

  async aprobarSolicitud(id: number): Promise<any> {
    const { data } = await api.post(`/api/public/solicitudes/${id}/aprobar/`);
    return data;
  },

  async rechazarSolicitud(id: number, motivo: string): Promise<any> {
    const { data } = await api.post(`/api/public/solicitudes/${id}/rechazar/`, { motivo });
    return data;
  },

  /**
   * INFO REGISTRO (Público)
   */
  async getInfoRegistro(): Promise<any> {
    const { data } = await api.get('/api/public/info-registro/');
    return data;
  },

  /**
   * CLÍNICAS/TENANTS (Super Admin)
   */
  async getClinicas(): Promise<Clinica[]> {
    const { data } = await api.get('/api/public/tenants/');
    return data;
  },

  async getClinica(id: number): Promise<Clinica> {
    const { data } = await api.get(`/api/public/tenants/${id}/`);
    return data;
  },

  async activarClinica(id: number): Promise<Clinica> {
    const { data } = await api.post(`/api/public/tenants/${id}/activar/`);
    return data;
  },

  async desactivarClinica(id: number): Promise<Clinica> {
    const { data } = await api.post(`/api/public/tenants/${id}/desactivar/`);
    return data;
  }
};

export default tenantsService;
