/**
 * 📦 SERVICIO DE INVENTARIO
 * Gestión de categorías e insumos
 */

import api from '../config/apiConfig';

// ==================== INTERFACES ====================

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  fecha_creacion?: string;
}

export interface Insumo {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria_nombre?: string; // Backend envía este campo directamente
  categoria?: Categoria | null; // Puede venir como objeto en algunos casos
  categoria_id?: number;
  stock_actual?: number; // Opcional - puede no venir del backend
  cantidad_disponible?: number; // Alternativa que puede enviar backend
  stock_minimo?: number; // Opcional
  unidad_medida?: string; // Opcional
  precio_unitario?: number; // Nombre original
  precio_venta?: string; // Nombre que envía el backend
  fecha_vencimiento?: string;
  proveedor?: string;
  activo: boolean;
  fecha_creacion?: string;
}

export interface AjusteStock {
  cantidad: number;
  motivo?: string;
}

// ==================== CATEGORÍAS ====================

const getCategorias = async (): Promise<Categoria[]> => {
  const response = await api.get<Categoria[]>('/api/inventario/categorias/');
  return response.data;
};

const getCategoria = async (id: number): Promise<Categoria> => {
  const response = await api.get<Categoria>(`/api/inventario/categorias/${id}/`);
  return response.data;
};

const createCategoria = async (data: Partial<Categoria>): Promise<Categoria> => {
  const response = await api.post<Categoria>('/api/inventario/categorias/', data);
  return response.data;
};

const updateCategoria = async (id: number, data: Partial<Categoria>): Promise<Categoria> => {
  const response = await api.put<Categoria>(`/api/inventario/categorias/${id}/`, data);
  return response.data;
};

const deleteCategoria = async (id: number): Promise<void> => {
  await api.delete(`/api/inventario/categorias/${id}/`);
};

// ==================== INSUMOS ====================

const getInsumos = async (params?: { page?: number; search?: string; categoria?: number }): Promise<{ results: Insumo[]; count: number; next: string | null; previous: string | null }> => {
  console.log('📦 [Inventario] Obteniendo insumos con params:', params);
  const response = await api.get<{ results: Insumo[]; count: number; next: string | null; previous: string | null }>('/api/inventario/insumos/', { params });
  console.log('✅ [Inventario] Respuesta recibida:', response.data);
  if (response.data.results && response.data.results.length > 0) {
    console.log('📋 [Inventario] Primer insumo (estructura):', response.data.results[0]);
  }
  return response.data;
};

const getInsumo = async (id: number): Promise<Insumo> => {
  const response = await api.get<Insumo>(`/api/inventario/insumos/${id}/`);
  return response.data;
};

const createInsumo = async (data: Partial<Insumo>): Promise<Insumo> => {
  const response = await api.post<Insumo>('/api/inventario/insumos/', data);
  return response.data;
};

const updateInsumo = async (id: number, data: Partial<Insumo>): Promise<Insumo> => {
  const response = await api.put<Insumo>(`/api/inventario/insumos/${id}/`, data);
  return response.data;
};

const deleteInsumo = async (id: number): Promise<void> => {
  await api.delete(`/api/inventario/insumos/${id}/`);
};

const ajustarStock = async (id: number, data: AjusteStock): Promise<Insumo> => {
  const response = await api.post<Insumo>(`/api/inventario/insumos/${id}/ajustar_stock/`, data);
  return response.data;
};

const getStockBajo = async (): Promise<Insumo[]> => {
  const response = await api.get<Insumo[]>('/api/inventario/insumos/bajo_stock/');
  return response.data;
};

// ==================== EXPORTAR ====================

const inventarioService = {
  // Categorías
  getCategorias,
  getCategoria,
  createCategoria,
  updateCategoria,
  deleteCategoria,

  // Insumos
  getInsumos,
  getInsumo,
  createInsumo,
  updateInsumo,
  deleteInsumo,
  ajustarStock,
  getStockBajo,
};

export default inventarioService;
