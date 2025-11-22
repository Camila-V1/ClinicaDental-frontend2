/**
 * 📊 Servicio de Reportes y Dashboard
 * (Corregido: Endpoints correctos y mapeo exacto con views.py)
 */

import api from '../config/apiConfig';

// ==================== INTERFACES ====================

export interface DashboardKPIs {
  total_pacientes: number;
  citas_hoy: number;
  ingresos_mes: string;
  tratamientos_activos: number;
  pacientes_nuevos_mes: number;
  tasa_ocupacion: string;
  citas_pendientes: number;
  facturas_pendientes: number;
}

// ✅ Usar la interfaz correcta que coincide con el backend
export interface EstadisticasGenerales {
  // Pacientes
  total_pacientes_activos: number;
  pacientes_nuevos_mes: number;
  
  // Odontólogos
  total_odontologos: number;
  
  // Citas
  citas_mes_actual: number;
  citas_completadas: number;
  citas_pendientes: number;
  citas_canceladas: number;
  
  // Tratamientos
  planes_activos: number;
  planes_completados: number;  // ✅ Nombre correcto del backend
  total_procedimientos: number;
  
  // Financiero
  total_pagado_mes: string;    // ✅ Nombre correcto del backend (string)
  monto_pendiente: string;     // ✅ Backend envía como string
  facturas_vencidas: number;
  promedio_factura: string;    // ✅ Backend envía como string
  
  // Ocupación
  tasa_ocupacion: string;      // ✅ Backend envía como string "14.29"
}

export interface TendenciaCitas {
  fecha: string;
  total: number;
  completadas: number;
  canceladas: number;
}

export interface TopProcedimiento {
  nombre: string;
  cantidad: number;
  porcentaje: string;
}

export interface ReporteFinanciero {
  periodo: string;
  total_facturado: string;
  total_pagado: string;
  saldo_pendiente: string;
  numero_facturas: number;
  facturas_emitidas?: number;
  facturas_pagadas?: number;
  facturas_pendientes?: number;
  ingresos_por_metodo?: {
    EFECTIVO: string;
    TARJETA: string;
    TRANSFERENCIA: string;
    CHEQUE: string;
  };
  detalle_por_mes?: Array<{
    mes: string;
    facturado: string;
    cobrado: string;
    pendiente: string;
  }>;
}

export interface OcupacionOdontologo {
  odontologo_id: number;
  odontologo_nombre: string;
  total_citas: number;
  citas_completadas: number;
  citas_canceladas: number;
  horas_ocupadas: number;
  tasa_ocupacion: string;
  pacientes_atendidos: number;
}

// ==================== SERVICIO ====================

class ReportesService {
  // 1. Dashboard KPIs (Mapeo etiqueta/valor -> Objeto)
  async getDashboardKpis() {
    try {
      const response = await api.get('/api/reportes/reportes/dashboard-kpis/');
      const data = response.data;

      let kpisFormatted = {
        total_pacientes: 0,
        citas_hoy: 0,
        ingresos_mes: "0",
        tratamientos_activos: 0,
        pacientes_nuevos_mes: 0,
        tasa_ocupacion: "0",
        citas_pendientes: 0,
        facturas_pendientes: 0
      };

      if (Array.isArray(data)) {
        data.forEach((item: any) => {
          // El backend envía "etiqueta" y "valor"
          const label = (item.etiqueta || item.label || '').toLowerCase();
          const value = item.valor || item.value || 0;

          if (label.includes('pacientes')) kpisFormatted.total_pacientes = Number(value);
          else if (label.includes('citas')) kpisFormatted.citas_hoy = Number(value);
          else if (label.includes('ingresos')) kpisFormatted.ingresos_mes = String(value);
          else if (label.includes('saldo')) kpisFormatted.facturas_pendientes = Number(value);
        });
      }
      return kpisFormatted;
    } catch (error) {
      console.error('🔴 Error getDashboardKpis:', error);
      throw error;
    }
  }

  // 2. Estadísticas Generales (Directo)
  async getEstadisticasGenerales() {
    const response = await api.get<EstadisticasGenerales>('/api/reportes/reportes/estadisticas-generales/');
    return response.data;
  }

  // 3. Tendencia de Citas (Mapeo cantidad -> total)
  async getTendenciaCitas(params?: { dias?: number }) {
    try {
      const response = await api.get('/api/reportes/reportes/tendencia-citas/', { params });
      const data = response.data;
      
      if (!Array.isArray(data)) return [];

      // El backend envía "fecha" y "cantidad"
      return data.map((item: any) => ({
        fecha: item.fecha,
        total: Number(item.cantidad || 0), // Mapeo crítico
        completadas: 0, // El backend actual no desglosa por estado en este endpoint
        canceladas: 0   // El backend actual no desglosa por estado en este endpoint
      }));
    } catch (error) {
      console.error('🔴 Error Tendencia:', error);
      return [];
    }
  }

  // 4. Top Procedimientos (Mapeo etiqueta -> nombre, valor -> cantidad)
  async getTopProcedimientos(params?: { limite?: number }) {
    try {
      const response = await api.get('/api/reportes/reportes/top-procedimientos/', { params });
      const data = response.data;

      if (!Array.isArray(data)) return [];

      // El backend envía "etiqueta" (nombre servicio) y "valor" (cantidad)
      return data.map((item: any) => ({
        nombre: item.etiqueta || 'Desconocido',
        cantidad: Number(item.valor || 0),
        porcentaje: "0" // Cálculo opcional en frontend si se requiere
      }));
    } catch (error) {
      console.error('🔴 Error Top Procedimientos:', error);
      return [];
    }
  }

  // 5. Reporte Financiero
  async getReporteFinanciero(params?: { periodo?: string; fecha_inicio?: string; fecha_fin?: string }) {
    const response = await api.get<ReporteFinanciero>('/api/reportes/reportes/reporte-financiero/', { params });
    return response.data;
  }

  // 6. Ocupación (CORREGIDO: Usar reporte-citas-odontologo en vez de ocupacion-odontologos)
  async getOcupacionOdontologos(params?: { mes?: string }) {
    try {
      // CAMBIO CRÍTICO: Usamos el endpoint detallado que sí tiene citas/canceladas/etc
      const response = await api.get('/api/reportes/reportes/reporte-citas-odontologo/', { params });
      const data = response.data;

      if (!Array.isArray(data)) return [];

      return data.map((item: any) => ({
        odontologo_id: 0, // El reporte no devuelve ID, usamos 0 o índice
        odontologo_nombre: item.odontologo || 'Desconocido',
        total_citas: Number(item.total_citas || 0),
        citas_completadas: Number(item.completadas || 0),
        citas_canceladas: Number(item.canceladas || 0),
        // El backend envía "tasa_completado" como string "50.0%", lo limpiamos
        tasa_ocupacion: String(item.tasa_completado || "0").replace('%', ''),
        horas_ocupadas: 0, // Dato no disponible en backend actual
        pacientes_atendidos: 0 // Dato no disponible en backend actual
      }));
    } catch (error) {
      console.error('🔴 Error getOcupacionOdontologos:', error);
      return [];
    }
  }
}

export default new ReportesService();
