/**
 * 🦷 Servicio de Tratamientos
 * Gestión de categorías, servicios, planes y presupuestos
 */

import api from '@/config/apiConfig';

// Interfaces
export interface CategoriaServicio {
  id: number;
  nombre: string;
  descripcion?: string;
  created_at?: string;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string;
  categoria: number;
  categoria_nombre?: string;
  precio_base: number;
  duracion_estimada?: number; // minutos
  activo: boolean;
  created_at?: string;
}

export interface PlanTratamiento {
  id: number;
  paciente: number;
  paciente_nombre?: string;
  odontologo: number;
  odontologo_nombre?: string;
  titulo: string;
  descripcion?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado: 'BORRADOR' | 'PROPUESTO' | 'ACEPTADO' | 'EN_CURSO' | 'COMPLETADO' | 'CANCELADO';
  total: number;
  items?: ItemPlan[];
  created_at?: string;
  updated_at?: string;
}

export interface ItemPlan {
  id: number;
  plan: number;
  servicio: number;
  servicio_nombre?: string;
  precio: number;
  cantidad: number;
  descuento?: number;
  subtotal: number;
  estado: 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO' | 'CANCELADO';
  notas?: string;
  orden?: number;
}

export interface Presupuesto {
  id: number;
  plan: number;
  plan_titulo?: string;
  paciente: number;
  paciente_nombre?: string;
  total: number;
  estado: 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO' | 'VENCIDO';
  fecha_emision: string;
  fecha_vencimiento?: string;
  token?: string;
  notas?: string;
  created_at?: string;
}

export interface FiltrosTratamientos {
  page?: number;
  page_size?: number;
  search?: string;
  categoria?: number;
  paciente?: number;
  estado?: string;
}

// Servicio de Tratamientos
export const tratamientosService = {
  /**
   * CATEGORÍAS DE SERVICIOS
   */
  async getCategorias(): Promise<CategoriaServicio[]> {
    const { data } = await api.get('/api/tratamientos/categorias/');
    return data;
  },

  async createCategoria(categoria: Partial<CategoriaServicio>): Promise<CategoriaServicio> {
    const { data } = await api.post('/api/tratamientos/categorias/', categoria);
    return data;
  },

  async updateCategoria(id: number, categoria: Partial<CategoriaServicio>): Promise<CategoriaServicio> {
    const { data } = await api.put(`/api/tratamientos/categorias/${id}/`, categoria);
    return data;
  },

  async deleteCategoria(id: number): Promise<void> {
    await api.delete(`/api/tratamientos/categorias/${id}/`);
  },

  /**
   * SERVICIOS
   */
  async getServicios(filtros: FiltrosTratamientos = {}): Promise<Servicio[]> {
    const params = new URLSearchParams();
    if (filtros.page) params.append('page', filtros.page.toString());
    if (filtros.page_size) params.append('page_size', filtros.page_size.toString());
    if (filtros.search) params.append('search', filtros.search);
    if (filtros.categoria) params.append('categoria', filtros.categoria.toString());

    const { data } = await api.get(`/api/tratamientos/servicios/?${params}`);
    return data;
  },

  async getServicio(id: number): Promise<Servicio> {
    const { data } = await api.get(`/api/tratamientos/servicios/${id}/`);
    return data;
  },

  async createServicio(servicio: Partial<Servicio>): Promise<Servicio> {
    const { data } = await api.post('/api/tratamientos/servicios/', servicio);
    return data;
  },

  async updateServicio(id: number, servicio: Partial<Servicio>): Promise<Servicio> {
    const { data } = await api.put(`/api/tratamientos/servicios/${id}/`, servicio);
    return data;
  },

  async deleteServicio(id: number): Promise<void> {
    await api.delete(`/api/tratamientos/servicios/${id}/`);
  },

  /**
   * PLANES DE TRATAMIENTO
   */
  async getPlanes(filtros: FiltrosTratamientos = {}): Promise<PlanTratamiento[]> {
    const params = new URLSearchParams();
    if (filtros.page) params.append('page', filtros.page.toString());
    if (filtros.page_size) params.append('page_size', filtros.page_size.toString());
    if (filtros.search) params.append('search', filtros.search);
    if (filtros.paciente) params.append('paciente', filtros.paciente.toString());
    if (filtros.estado) params.append('estado', filtros.estado);

    const { data } = await api.get(`/api/tratamientos/planes/?${params}`);
    return data;
  },

  async getPlan(id: number): Promise<PlanTratamiento> {
    const { data } = await api.get(`/api/tratamientos/planes/${id}/`);
    return data;
  },

  async createPlan(plan: Partial<PlanTratamiento>): Promise<PlanTratamiento> {
    const { data } = await api.post('/api/tratamientos/planes/', plan);
    return data;
  },

  async updatePlan(id: number, plan: Partial<PlanTratamiento>): Promise<PlanTratamiento> {
    const { data } = await api.put(`/api/tratamientos/planes/${id}/`, plan);
    return data;
  },

  async deletePlan(id: number): Promise<void> {
    await api.delete(`/api/tratamientos/planes/${id}/`);
  },

  /**
   * ITEMS DEL PLAN
   */
  async createItemPlan(item: Partial<ItemPlan>): Promise<ItemPlan> {
    const { data } = await api.post('/api/tratamientos/items/', item);
    return data;
  },

  async updateItemPlan(id: number, item: Partial<ItemPlan>): Promise<ItemPlan> {
    const { data } = await api.put(`/api/tratamientos/items/${id}/`, item);
    return data;
  },

  async deleteItemPlan(id: number): Promise<void> {
    await api.delete(`/api/tratamientos/items/${id}/`);
  },

  /**
   * PRESUPUESTOS
   */
  async getPresupuestos(filtros: FiltrosTratamientos = {}): Promise<Presupuesto[]> {
    const params = new URLSearchParams();
    if (filtros.page) params.append('page', filtros.page.toString());
    if (filtros.page_size) params.append('page_size', filtros.page_size.toString());
    if (filtros.search) params.append('search', filtros.search);
    if (filtros.estado) params.append('estado', filtros.estado);

    const { data } = await api.get(`/api/tratamientos/presupuestos/?${params}`);
    return data;
  },

  async getPresupuesto(id: number): Promise<Presupuesto> {
    const { data } = await api.get(`/api/tratamientos/presupuestos/${id}/`);
    return data;
  },

  async createPresupuesto(presupuesto: Partial<Presupuesto>): Promise<Presupuesto> {
    const { data } = await api.post('/api/tratamientos/presupuestos/', presupuesto);
    return data;
  },

  async aceptarPresupuesto(id: number, token: string): Promise<Presupuesto> {
    const { data } = await api.post(`/api/tratamientos/presupuestos/${id}/aceptar/${token}/`);
    return data;
  },

  async rechazarPresupuesto(id: number): Promise<void> {
    await api.post(`/api/tratamientos/presupuestos/${id}/rechazar/`);
  },
};
