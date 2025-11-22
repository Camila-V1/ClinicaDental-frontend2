/**
 * 📊 Servicio de Reportes y Dashboard
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

export interface EstadisticasGenerales {
  pacientes: {
    total: number;
    nuevos_mes: number;
    activos: number;
  };
  citas: {
    total_mes: number;
    completadas: number;
    canceladas: number;
    pendientes: number;
  };
  financiero: {
    ingresos_mes: string;
    ingresos_año: string;
    facturas_pendientes: string;
    facturas_vencidas: number;
  };
  tratamientos: {
    planes_activos: number;
    procedimientos_realizados: number;
    servicios_mas_solicitados: Array<{
      nombre: string;
      cantidad: number;
    }>;
  };
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
  total_cobrado: string;
  total_pendiente: string;
  facturas_emitidas: number;
  facturas_pagadas: number;
  facturas_pendientes: number;
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
  // Dashboard KPIs principales
  async getDashboardKpis() {
    console.log('📊 [ReportesService] Solicitando dashboard-kpis...');
    const response = await api.get<DashboardKPIs>('/api/reportes/reportes/dashboard-kpis/');
    console.log('📊 [ReportesService] Dashboard KPIs recibidos:', response.data);
    return response.data;
  }

  // Estadísticas generales del sistema
  async getEstadisticasGenerales() {
    console.log('📊 [ReportesService] Solicitando estadisticas-generales...');
    const response = await api.get<EstadisticasGenerales>('/api/reportes/reportes/estadisticas-generales/');
    console.log('📊 [ReportesService] Estadísticas generales recibidas:', response.data);
    console.log('   - Pacientes:', response.data?.pacientes);
    console.log('   - Citas:', response.data?.citas);
    console.log('   - Financiero:', response.data?.financiero);
    console.log('   - Tratamientos:', response.data?.tratamientos);
    return response.data;
  }

  // Tendencia de citas (gráfico)
  async getTendenciaCitas(params?: { dias?: number }) {
    console.log('📊 [ReportesService] Solicitando tendencia-citas con params:', params);
    const response = await api.get<TendenciaCitas[]>('/api/reportes/reportes/tendencia-citas/', { params });
    console.log('📊 [ReportesService] Tendencia citas recibida:', response.data);
    console.log('   - Total registros:', response.data?.length);
    return response.data;
  }

  // Top procedimientos más realizados
  async getTopProcedimientos(params?: { limite?: number }) {
    console.log('📊 [ReportesService] Solicitando top-procedimientos con params:', params);
    const response = await api.get<TopProcedimiento[]>('/api/reportes/reportes/top-procedimientos/', { params });
    console.log('📊 [ReportesService] Top procedimientos recibidos:', response.data);
    console.log('   - Total procedimientos:', response.data?.length);
    return response.data;
  }

  // Reporte financiero por período
  async getReporteFinanciero(params?: { periodo?: string; fecha_inicio?: string; fecha_fin?: string }) {
    console.log('📊 [ReportesService] Solicitando reporte-financiero con params:', params);
    const response = await api.get<ReporteFinanciero>('/api/reportes/reportes/reporte-financiero/', { params });
    console.log('📊 [ReportesService] Reporte financiero recibido:', response.data);
    console.log('   - Periodo:', response.data?.periodo);
    console.log('   - Total facturado:', response.data?.total_facturado);
    console.log('   - Ingresos por método:', response.data?.ingresos_por_metodo);
    return response.data;
  }

  // Ocupación por odontólogo
  async getOcupacionOdontologos(params?: { mes?: string }) {
    console.log('📊 [ReportesService] Solicitando ocupacion-odontologos con params:', params);
    const response = await api.get<OcupacionOdontologo[]>('/api/reportes/reportes/ocupacion-odontologos/', { params });
    console.log('📊 [ReportesService] Ocupación odontólogos recibida:', response.data);
    console.log('   - Total odontólogos:', response.data?.length);
    return response.data;
  }
}

export default new ReportesService();
