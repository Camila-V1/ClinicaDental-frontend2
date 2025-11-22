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
  total_pagado: string;        // ✅ Nombre correcto del backend
  saldo_pendiente: string;     // ✅ Nombre correcto del backend
  numero_facturas: number;     // ✅ Nombre correcto del backend
  facturas_emitidas?: number;  // Opcional - puede no venir
  facturas_pagadas?: number;   // Opcional - puede no venir
  facturas_pendientes?: number; // Opcional - puede no venir
  ingresos_por_metodo?: {      // Opcional - no viene del backend actualmente
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
    console.log('   📋 PACIENTES:');
    console.log('      - total_pacientes_activos:', response.data?.total_pacientes_activos);
    console.log('      - pacientes_nuevos_mes:', response.data?.pacientes_nuevos_mes);
    console.log('   📋 ODONTÓLOGOS:');
    console.log('      - total_odontologos:', response.data?.total_odontologos);
    console.log('   📋 CITAS:');
    console.log('      - citas_mes_actual:', response.data?.citas_mes_actual);
    console.log('      - citas_completadas:', response.data?.citas_completadas);
    console.log('      - citas_pendientes:', response.data?.citas_pendientes);
    console.log('      - citas_canceladas:', response.data?.citas_canceladas);
    console.log('   📋 TRATAMIENTOS:');
    console.log('      - planes_activos:', response.data?.planes_activos);
    console.log('      - planes_completados:', response.data?.planes_completados);
    console.log('      - total_procedimientos:', response.data?.total_procedimientos);
    console.log('   📋 FINANCIERO:');
    console.log('      - total_pagado_mes:', response.data?.total_pagado_mes);
    console.log('      - monto_pendiente:', response.data?.monto_pendiente);
    console.log('      - facturas_vencidas:', response.data?.facturas_vencidas);
    console.log('      - promedio_factura:', response.data?.promedio_factura);
    console.log('   📋 OCUPACIÓN:');
    console.log('      - tasa_ocupacion:', response.data?.tasa_ocupacion);
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
