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

// Interfaz para LISTADO (serializer simplificado)
export interface Insumo {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria?: {
    id: number;
    nombre: string;
  };
  categoria_nombre: string; // ✅ Backend envía esto en listado
  precio_venta: string; // ✅ Decimal como string
  precio_unitario: string; // Alias de precio_venta
  stock_actual: string; // ✅ Decimal como string
  stock_minimo: string; // ✅ Stock mínimo requerido
  unidad_medida: string; // ✅ Siempre presente
  requiere_reposicion: boolean; // ✅ Indica si stock_actual <= stock_minimo
  fecha_vencimiento?: string;
  proveedor?: string;
  activo: boolean;
}

// Interfaz para DETALLE (serializer completo)
export interface InsumoDetalle {
  id: number;
  codigo: string;
  nombre: string;
  categoria: number; // ID de la categoría en detalle
  categoria_nombre: string;
  descripcion?: string;
  precio_venta: string;
  precio_unitario: string;
  precio_costo: string;
  margen_ganancia: string; // Calculado por backend
  stock_actual: string;
  stock_minimo: string;
  unidad_medida: string;
  requiere_reposicion: boolean;
  fecha_vencimiento?: string;
  proveedor?: string;
  activo: boolean;
  creado: string;
  actualizado: string;
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

const getInsumos = async (params?: { search?: string; categoria?: number; activo?: boolean; ordering?: string }): Promise<Insumo[]> => {
  console.log('📦 [Inventario] Obteniendo insumos con params:', params);
  const response = await api.get<Insumo[]>('/api/inventario/insumos/', { params });
  console.log('✅ [Inventario] Respuesta recibida (array directo):', response.data);
  if (response.data && response.data.length > 0) {
    console.log('📋 [Inventario] Primer insumo (estructura):', response.data[0]);
  }
  return response.data;
};

const getInsumo = async (id: number): Promise<InsumoDetalle> => {
  const response = await api.get<InsumoDetalle>(`/api/inventario/insumos/${id}/`);
  return response.data;
};

const createInsumo = async (data: Partial<InsumoDetalle>): Promise<InsumoDetalle> => {
  const response = await api.post<InsumoDetalle>('/api/inventario/insumos/', data);
  return response.data;
};

const updateInsumo = async (id: number, data: Partial<InsumoDetalle>): Promise<InsumoDetalle> => {
  const response = await api.put<InsumoDetalle>(`/api/inventario/insumos/${id}/`, data);
  return response.data;
};

const deleteInsumo = async (id: number): Promise<void> => {
  await api.delete(`/api/inventario/insumos/${id}/`);
};

interface AjusteStockResponse {
  mensaje: string;
  insumo: string;
  stock_anterior: number;
  ajuste: number;
  stock_actual: number;
  motivo: string;
}

const ajustarStock = async (id: number, data: AjusteStock): Promise<AjusteStockResponse> => {
  const response = await api.post<AjusteStockResponse>(`/api/inventario/insumos/${id}/ajustar_stock/`, data);
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
