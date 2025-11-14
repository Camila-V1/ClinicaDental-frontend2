import api from '../config/apiConfig';

// ============================================================================
// TIPOS
// ============================================================================

export interface Insumo {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  precio_venta: string;
  stock_actual: number;
  activo: boolean;
}

export interface MaterialServicioFijo {
  id: number;
  insumo: Insumo;
  cantidad: number;
  es_obligatorio: boolean;
  costo_adicional: string;
  costo_material_formateado: string;
}

export interface MaterialServicioOpcional {
  id: number;
  categoria_insumo: {
    id: number;
    nombre: string;
  };
  cantidad: number;
  nombre_personalizado: string | null;
  es_obligatorio: boolean;
  opciones_disponibles: Insumo[];
  rango_precios: {
    minimo: string;
    maximo: string;
    promedio: string;
  };
}

export interface Servicio {
  id: number;
  codigo_servicio: string;
  nombre: string;
  descripcion: string;
  categoria: number;
  categoria_nombre: string;
  precio_base: string;
  tiempo_estimado: number;
  duracion_formateada: string;
  requiere_cita_previa: boolean;
  requiere_autorizacion: boolean;
  activo: boolean;
  materiales_fijos: MaterialServicioFijo[];
  materiales_opcionales: MaterialServicioOpcional[];
  costo_materiales_fijos: string;
  tiene_materiales_opcionales: boolean;
  creado: string;
  actualizado: string;
}

// ============================================================================
// API CALLS
// ============================================================================

/**
 * Listar servicios disponibles
 */
export const obtenerServicios = async (filtros?: {
  categoria?: number;
  activo?: boolean;
  buscar?: string;
}): Promise<Servicio[]> => {
  console.log('🦷 Obteniendo servicios...', filtros);
  
  const params = new URLSearchParams();
  if (filtros?.categoria) params.append('categoria', filtros.categoria.toString());
  if (filtros?.activo !== undefined) params.append('activo', filtros.activo.toString());
  if (filtros?.buscar) params.append('search', filtros.buscar);
  
  const response = await api.get<Servicio[]>(
    `/api/tratamientos/servicios/${params.toString() ? '?' + params.toString() : ''}`
  );
  
  console.log('✅ Servicios recibidos:', response.data.length);
  
  // Log detallado de servicios con materiales opcionales
  response.data.forEach(servicio => {
    if (servicio.tiene_materiales_opcionales && servicio.materiales_opcionales.length > 0) {
      console.group(`🔍 Servicio con materiales opcionales: ${servicio.nombre}`);
      console.log('📊 Total materiales opcionales:', servicio.materiales_opcionales.length);
      servicio.materiales_opcionales.forEach((mat, idx) => {
        console.log(`  📦 Material ${idx}:`, {
          id: mat.id,
          nombre_personalizado: mat.nombre_personalizado,
          categoria_insumo: mat.categoria_insumo,
          opciones_disponibles: mat.opciones_disponibles,
          cantidad_opciones: mat.opciones_disponibles?.length || 0,
          es_obligatorio: mat.es_obligatorio
        });
      });
      console.groupEnd();
    }
  });
  
  return response.data;
};

/**
 * Obtener detalle de un servicio
 */
export const obtenerServicio = async (id: number): Promise<Servicio> => {
  console.log('🦷 Obteniendo servicio:', id);
  const response = await api.get<Servicio>(`/api/tratamientos/servicios/${id}/`);
  console.log('✅ Servicio recibido:', response.data);
  return response.data;
};

/**
 * Calcular precio total de un servicio con material seleccionado
 */
export const calcularPrecioServicio = (
  servicio: Servicio,
  insumoSeleccionadoId?: number
): number => {
  let total = parseFloat(servicio.precio_base);
  
  // Sumar materiales fijos
  total += parseFloat(servicio.costo_materiales_fijos);
  
  // Sumar material opcional si se seleccionó uno
  if (insumoSeleccionadoId && servicio.materiales_opcionales.length > 0) {
    servicio.materiales_opcionales.forEach(materialOpcional => {
      const insumo = materialOpcional.opciones_disponibles.find(
        opt => opt.id === insumoSeleccionadoId
      );
      if (insumo) {
        total += parseFloat(insumo.precio_venta) * materialOpcional.cantidad;
      }
    });
  }
  
  console.log('💰 Precio calculado:', {
    base: servicio.precio_base,
    materiales_fijos: servicio.costo_materiales_fijos,
    insumo_seleccionado: insumoSeleccionadoId,
    total: total
  });
  
  return total;
};
