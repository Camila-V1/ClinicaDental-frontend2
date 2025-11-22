/**
 * 💰 Servicio de Facturación Admin
 */

import api from '../config/apiConfig';

// ==================== INTERFACES ====================

// Interfaz para LISTADO de facturas (campos EXACTOS que envía el backend)
export interface Factura {
  id: number;
  paciente: number;
  paciente_nombre: string;
  estado: 'PENDIENTE' | 'PAGADA' | 'ANULADA' | 'VENCIDA';
  estado_display: string;
  monto_total: string;
  monto_pagado: string;
  saldo_pendiente: string;
  saldo: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  total_pagos: number;
  descripcion: string;
  numero_factura: string;
  plan_tratamiento?: number;
  descuento?: string;
  notas?: string;
  items?: ItemFactura[];
  // Campos adicionales que puede enviar el backend
  numero?: number;
  monto?: string;
  total?: string;
  fecha?: string;
}

export interface ItemFactura {
  id?: number;
  descripcion: string;
  cantidad: number;
  precio_unitario: string;
  subtotal?: string;
}

// Interfaz para DETALLE de factura
export interface FacturaDetalle extends Factura {
  fecha_anulacion: string | null;
  paciente: number;
  paciente_email: string;
  paciente_ci: string;
  paciente_telefono: string;
  presupuesto: number;
  presupuesto_numero: number;
  presupuesto_token: string;
  nit_ci: string;
  razon_social: string;
  porcentaje_pagado: number;
  pagos: Pago[];
}

// Interfaz para Pago// Interfaz para Pago
export interface Pago {
  id: number;
  factura: number;
  factura_numero: number;
  factura_total: string;
  paciente: number;
  paciente_nombre: string;
  monto: string;
  monto_pagado: string;
  metodo_pago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'QR';
  estado: 'COMPLETADO' | 'PENDIENTE' | 'CANCELADO';
  estado_pago: 'COMPLETADO' | 'PENDIENTE' | 'CANCELADO';
  fecha_pago: string;
  numero_transaccion: string;
  referencia_transaccion: string;
  created_by_nombre: string;
  notas: string;
}

export interface FacturaCreateData {
  paciente: number;
  presupuesto: number;
  monto_total?: string;
  nit_ci?: string;
  razon_social?: string;
}

export interface PagoCreateData {
  factura: number;
  monto_pagado: string;
  metodo_pago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'QR';
  referencia_transaccion?: string;
  notas?: string;
}

// ==================== SERVICIO ====================

class FacturacionAdminService {
  // FACTURAS
  async getFacturas(params?: {
    search?: string;
    estado?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
  }) {
    console.log('💰 [Facturación] Obteniendo facturas con params:', params);
    const response = await api.get<Factura[]>(
      '/api/facturacion/facturas/',
      { params }
    );
    console.log('✅ [Facturación] Respuesta recibida (array directo):', response.data);
    if (response.data && response.data.length > 0) {
      console.log('📋 [Facturación] Primera factura (estructura):', response.data[0]);
    }
    return response.data;
  }

  async getFactura(id: number) {
    const response = await api.get<FacturaDetalle>(`/api/facturacion/facturas/${id}/`);
    return response.data;
  }

  async createFactura(data: FacturaCreateData) {
    const response = await api.post<Factura>('/api/facturacion/facturas/', data);
    return response.data;
  }

  async updateFactura(id: number, data: Partial<FacturaCreateData>) {
    const response = await api.put<Factura>(`/api/facturacion/facturas/${id}/`, data);
    return response.data;
  }

  async deleteFactura(id: number) {
    await api.delete(`/api/facturacion/facturas/${id}/`);
  }

  async marcarPagada(id: number) {
    const response = await api.post<Factura>(`/api/facturacion/facturas/${id}/marcar_pagada/`);
    return response.data;
  }

  async cancelarFactura(id: number) {
    const response = await api.post<Factura>(`/api/facturacion/facturas/${id}/cancelar/`);
    return response.data;
  }

  // PAGOS
  async getPagos(params?: { factura_id?: number }) {
    const response = await api.get<Pago[]>(
      '/api/facturacion/pagos/',
      { params }
    );
    return response.data;
  }

  async getPago(id: number) {
    const response = await api.get<Pago>(`/api/facturacion/pagos/${id}/`);
    return response.data;
  }

  async createPago(data: PagoCreateData) {
    const response = await api.post<Pago>('/api/facturacion/pagos/', data);
    return response.data;
  }

  async updatePago(id: number, data: Partial<PagoCreateData>) {
    const response = await api.put<Pago>(`/api/facturacion/pagos/${id}/`, data);
    return response.data;
  }

  async deletePago(id: number) {
    await api.delete(`/api/facturacion/pagos/${id}/`);
  }

  async anularPago(id: number) {
    const response = await api.post<Pago>(`/api/facturacion/pagos/${id}/anular/`);
    return response.data;
  }

  async getPagosPorFactura(facturaId: number) {
    const response = await api.get<Pago[]>('/api/facturacion/pagos/por_factura/', {
      params: { factura_id: facturaId }
    });
    return response.data;
  }
}

export default new FacturacionAdminService();
