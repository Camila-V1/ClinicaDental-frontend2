/**
 * 📊 Servicio de Reportes y Dashboard
 * (Corregido con Adaptador de Datos para /admin/reportes)
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
  // Dashboard KPIs principales (Con Adaptador Array -> Object)
  async getDashboardKpis() {
    console.log('📊 [ReportesService] Solicitando dashboard-kpis...');
    try {
      const response = await api.get('/api/reportes/reportes/dashboard-kpis/');
      const data = response.data;
      console.log('📊 [ReportesService] RAW:', data);

      // 🛠️ ADAPTADOR: Convertir Array a Objeto plano
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
          // Protección contra undefined
          const rawKey = item.key || item.label || '';
          const key = String(rawKey).toLowerCase().replace(/ /g, '_');
          const value = item.value;

          if (key.includes('pacientes') && key.includes('total')) kpisFormatted.total_pacientes = value;
          else if (key.includes('citas') && key.includes('hoy')) kpisFormatted.citas_hoy = value;
          else if (key.includes('ingresos')) kpisFormatted.ingresos_mes = String(value);
          else if (key.includes('tratamientos')) kpisFormatted.tratamientos_activos = value;
          else if (key.includes('nuevos')) kpisFormatted.pacientes_nuevos_mes = value;
          else if (key.includes('ocupacion') || key.includes('ocupación')) kpisFormatted.tasa_ocupacion = String(value);
          else if (key.includes('citas') && key.includes('pendientes')) kpisFormatted.citas_pendientes = value;
          else if (key.includes('facturas')) kpisFormatted.facturas_pendientes = value;
        });
      } else if (typeof data === 'object' && data !== null) {
        kpisFormatted = { ...kpisFormatted, ...data };
      }

      console.log('✅ [ReportesService] Adaptado:', kpisFormatted);
      return kpisFormatted;
    } catch (error) {
      console.error('🔴 Error getDashboardKpis:', error);
      throw error;
    }
  }

  // Estadísticas generales del sistema
  async getEstadisticasGenerales() {
    console.log('📊 [ReportesService] Solicitando estadisticas-generales...');
    const response = await api.get<EstadisticasGenerales>('/api/reportes/reportes/estadisticas-generales/');
    return response.data;
  }

  // Tendencia de citas (gráfico)
  async getTendenciaCitas(params?: { dias?: number }) {
    console.log('📊 [ReportesService] Solicitando tendencia-citas:', params);
    const response = await api.get<TendenciaCitas[]>('/api/reportes/reportes/tendencia-citas/', { params });
    return Array.isArray(response.data) ? response.data : [];
  }

  // Top procedimientos más realizados
  async getTopProcedimientos(params?: { limite?: number }) {
    console.log('📊 [ReportesService] Solicitando top-procedimientos:', params);
    const response = await api.get<TopProcedimiento[]>('/api/reportes/reportes/top-procedimientos/', { params });
    return Array.isArray(response.data) ? response.data : [];
  }

  // Reporte financiero por período
  async getReporteFinanciero(params?: { periodo?: string; fecha_inicio?: string; fecha_fin?: string }) {
    console.log('📊 [ReportesService] Solicitando reporte-financiero:', params);
    const response = await api.get<ReporteFinanciero>('/api/reportes/reportes/reporte-financiero/', { params });
    return response.data;
  }

  // Ocupación por odontólogo (Con Mapeo Seguro)
  async getOcupacionOdontologos(params?: { mes?: string }) {
    console.log('📊 [ReportesService] Solicitando ocupacion-odontologos:', params);
    try {
      const response = await api.get('/api/reportes/reportes/ocupacion-odontologos/', { params });
      const data = response.data;

      if (!Array.isArray(data)) return [];

      // Mapeo explícito para asegurar que el frontend reciba los nombres exactos
      return data.map((item: any) => ({
        odontologo_id: item.odontologo_id || item.id || 0,
        odontologo_nombre: item.odontologo_nombre || item.nombre_completo || item.nombre || 'Desconocido',
        total_citas: Number(item.total_citas || item.citas_totales || 0),
        citas_completadas: Number(item.citas_completadas || 0),
        citas_canceladas: Number(item.citas_canceladas || 0),
        horas_ocupadas: Number(item.horas_ocupadas || 0),
        tasa_ocupacion: String(item.tasa_ocupacion || item.ocupacion || "0"),
        pacientes_atendidos: Number(item.pacientes_atendidos || item.pacientes_unicos || 0)
      }));
    } catch (error) {
      console.error('🔴 Error getOcupacionOdontologos:', error);
      return [];
    }
  }
}

export default new ReportesService();
