/**
 * 💰 FACTURACIÓN SERVICE - Gestión de Facturas y Pagos
 * Para módulo de pacientes
 */

import api from '../config/apiConfig';

export interface Factura {
  id: number;
  numero: string;
  paciente_id: number;
  paciente_nombre: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  subtotal: string;
  descuento: string;
  total: string;
  pagado: string;
  saldo: string;
  saldo_pendiente?: string | null; // Campo adicional del backend
  estado: 'PENDIENTE' | 'PAGADA' | 'PARCIAL' | 'VENCIDA' | 'ANULADA';
  notas?: string;
  created_at: string;
  items: ItemFactura[];
  pagos?: Pago[];
}

export interface ItemFactura {
  id: number;
  servicio_nombre: string;
  cantidad: number;
  precio_unitario: string;
  subtotal: string;
  descripcion?: string;
}

export interface Pago {
  id: number;
  factura_id: number;
  fecha_pago: string;
  monto: string;
  metodo_pago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'CHEQUE';
  referencia?: string;
  notas?: string;
  created_at: string;
}

export interface FiltrosFacturas {
  estado?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}

/**
 * 📋 Obtener facturas del paciente actual
 */
export const obtenerMisFacturas = async (filtros?: FiltrosFacturas): Promise<Factura[]> => {
  const params = new URLSearchParams();
  
  if (filtros?.estado) params.append('estado', filtros.estado);
  if (filtros?.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
  if (filtros?.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);

  console.log('💰 Obteniendo facturas del paciente...');
  
  try {
    // Intentar con guion bajo (convención Django)
    const response = await api.get<Factura[]>(`/api/facturacion/facturas/mis_facturas/?${params}`);
    console.log('✅ Facturas recibidas:', response.data.length);
    return response.data;
  } catch (error: any) {
    // Fallback: intentar con guion medio
    if (error.response?.status === 404) {
      console.log('⚠️ Endpoint con guion bajo no encontrado, intentando con guion medio...');
      try {
        const response = await api.get<Factura[]>(`/api/facturacion/facturas/mis-facturas/?${params}`);
        console.log('✅ Facturas recibidas (fallback):', response.data.length);
        return response.data;
      } catch (fallbackError) {
        console.error('❌ Error en fallback:', fallbackError);
        throw fallbackError;
      }
    }
    throw error;
  }
};

/**
 * 🔍 Obtener detalle de una factura
 */
export const obtenerDetalleFactura = async (id: number): Promise<Factura> => {
  console.log('🔍 Obteniendo detalle de factura:', id);
  
  const response = await api.get<Factura>(`/api/facturacion/facturas/${id}/`);
  
  console.log('✅ Factura obtenida:', response.data);
  return response.data;
};

/**
 * 💳 Obtener pagos de una factura
 */
export const obtenerPagosFactura = async (facturaId: number): Promise<Pago[]> => {
  console.log('💳 Obteniendo pagos de factura:', facturaId);
  
  const response = await api.get<Pago[]>(`/api/facturacion/facturas/${facturaId}/pagos/`);
  
  console.log('✅ Pagos recibidos:', response.data.length);
  return response.data;
};

/**
 * 📊 Obtener estado de cuenta del paciente
 */
export interface EstadoCuenta {
  paciente_id: number;
  paciente_nombre: string;
  total_facturas: number;
  total_facturado: string;
  total_pagado: string;
  saldo_pendiente: string;
  facturas_pendientes: number;
  facturas_vencidas: number;
  ultima_factura?: {
    id: number;
    numero: string;
    fecha_emision: string;
    total: string;
    estado: string;
  };
  proximo_vencimiento?: {
    factura_id: number;
    factura_numero: string;
    fecha_vencimiento: string;
    monto: string;
  };
}

export const obtenerEstadoCuenta = async (): Promise<EstadoCuenta> => {
  console.log('📊 Obteniendo estado de cuenta...');
  
  // Nota: DRF convierte def estado_cuenta → URL estado_cuenta/ (guión bajo, no medio)
  const response = await api.get<EstadoCuenta>('/api/facturacion/facturas/estado_cuenta/');
  
  console.log('✅ Estado de cuenta obtenido:', response.data);
  return response.data;
};

/**
 * 🔔 Verificar facturas vencidas
 */
export const verificarFacturasVencidas = async (): Promise<{
  tiene_vencidas: boolean;
  cantidad: number;
  facturas: Factura[];
}> => {
  console.log('🔔 Verificando facturas vencidas...');
  
  const response = await api.get<{
    tiene_vencidas: boolean;
    cantidad: number;
    facturas: Factura[];
  }>('/api/facturacion/facturas/verificar-vencidas/');
  
  console.log('✅ Verificación completada:', response.data);
  return response.data;
};

