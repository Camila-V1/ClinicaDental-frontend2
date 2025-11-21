/**
 * 💰 Servicio de Facturación Admin
 */

import api from '../config/apiConfig';

// ==================== INTERFACES ====================

export interface Factura {
  id: number;
  numero_factura: string;
  paciente: number;
  paciente_nombre: string;
  plan_tratamiento?: number;
  plan_nombre?: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  subtotal: string;
  descuento: string;
  total: string;
  saldo: string;
  estado: 'PENDIENTE' | 'PAGADA' | 'VENCIDA' | 'ANULADA';
  notas?: string;
  items?: ItemFactura[];
  created_at: string;
  updated_at: string;
}

export interface ItemFactura {
  id: number;
  factura: number;
  descripcion: string;
  cantidad: number;
  precio_unitario: string;
  subtotal: string;
}

export interface Pago {
  id: number;
  factura: number;
  factura_numero: string;
  paciente_nombre: string;
  fecha_pago: string;
  monto: string;
  metodo_pago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'CHEQUE';
  numero_transaccion?: string;
  notas?: string;
  estado: 'COMPLETADO' | 'ANULADO';
  created_by?: number;
  created_by_nombre?: string;
  created_at: string;
}

export interface FacturaCreateData {
  paciente: number;
  plan_tratamiento?: number;
  fecha_emision: string;
  fecha_vencimiento: string;
  descuento?: string;
  notas?: string;
  items: {
    descripcion: string;
    cantidad: number;
    precio_unitario: string;
  }[];
}

export interface PagoCreateData {
  factura: number;
  fecha_pago: string;
  monto: string;
  metodo_pago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'CHEQUE';
  numero_transaccion?: string;
  notas?: string;
}

// ==================== SERVICIO ====================

class FacturacionAdminService {
  // FACTURAS
  async getFacturas(params?: {
    page?: number;
    search?: string;
    estado?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
  }) {
    const response = await api.get<Factura[]>(
      '/api/facturacion/facturas/',
      { params }
    );
    return response.data;
  }

  async getFactura(id: number) {
    const response = await api.get<Factura>(`/api/facturacion/facturas/${id}/`);
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
    const response = await api.post<Factura>(`/api/facturacion/facturas/${id}/marcar-pagada/`);
    return response.data;
  }

  async cancelarFactura(id: number) {
    const response = await api.post<Factura>(`/api/facturacion/facturas/${id}/cancelar/`);
    return response.data;
  }

  // PAGOS
  async getPagos(params?: { page?: number; factura_id?: number }) {
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
    const response = await api.get<Pago[]>('/api/facturacion/pagos/por-factura/', {
      params: { factura_id: facturaId }
    });
    return response.data;
  }
}

export default new FacturacionAdminService();
