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
  // 1. Dashboard KPIs (Blindado contra datos vacíos)
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
          const rawLabel = item.etiqueta || item.label || '';
          const label = String(rawLabel).toLowerCase();
          const value = item.valor || item.value || 0;

          if (label.includes('pacientes') && label.includes('activos')) kpisFormatted.total_pacientes = Number(value);
          else if (label.includes('citas') && label.includes('hoy')) kpisFormatted.citas_hoy = Number(value);
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

  // 2. Estadísticas Generales
  async getEstadisticasGenerales() {
    const response = await api.get<EstadisticasGenerales>('/api/reportes/reportes/estadisticas-generales/');
    return response.data;
  }

  // 3. Tendencia de Citas (Corrección: cantidad -> total)
  async getTendenciaCitas(params?: { dias?: number }) {
    try {
      const response = await api.get('/api/reportes/reportes/tendencia-citas/', { params });
      const data = response.data;
      
      if (!Array.isArray(data)) return [];

      return data.map((item: any) => ({
        fecha: item.fecha,
        total: Number(item.cantidad || item.total || 0),
        completadas: 0, 
        canceladas: 0   
      }));
    } catch (error) {
      console.error('🔴 Error Tendencia:', error);
      return [];
    }
  }

  // 4. Top Procedimientos (Corrección: etiqueta -> nombre + CÁLCULO DE PORCENTAJE)
  async getTopProcedimientos(params?: { limite?: number }) {
    try {
      const response = await api.get('/api/reportes/reportes/top-procedimientos/', { params });
      const data = response.data;

      if (!Array.isArray(data)) return [];

      // Calcular el total para porcentajes
      const totalCantidad = data.reduce((sum, item) => sum + (Number(item.valor || item.cantidad || 0)), 0);

      return data.map((item: any) => {
        const cantidad = Number(item.valor || item.cantidad || 0);
        const porcentaje = totalCantidad > 0 
          ? ((cantidad / totalCantidad) * 100).toFixed(1)
          : "0";

        return {
          nombre: item.etiqueta || item.nombre || 'Sin Nombre',
          cantidad: cantidad,
          porcentaje: porcentaje
        };
      });
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

  // 6. Ocupación de Odontólogos (REPARADO: Cálculo real de ocupación)
  async getOcupacionOdontologos(params?: { mes?: string }) {
    try {
      // Usamos el endpoint detallado del backend
      const response = await api.get('/api/reportes/reportes/reporte-citas-odontologo/', { params });
      const data = response.data;

      if (!Array.isArray(data)) return [];

      return data.map((item: any) => {
        const total = Number(item.total_citas || 0);
        const confirmadas = Number(item.confirmadas || 0);
        const completadas = Number(item.completadas || 0);
        const canceladas = Number(item.canceladas || 0);

        // CÁLCULO PROPIO: Consideramos ocupado si está confirmada o completada
        // El backend solo contaba completadas, por eso daba 0%
        let tasaCalculada = 0;
        if (total > 0) {
          tasaCalculada = ((confirmadas + completadas) / total) * 100;
        }

        return {
          odontologo_id: 0,
          odontologo_nombre: item.odontologo || 'Dr. Desconocido',
          total_citas: total,
          citas_completadas: completadas,
          citas_canceladas: canceladas,
          
          // Corregimos el porcentaje
          tasa_ocupacion: tasaCalculada.toFixed(1),
          
          // Estimaciones para rellenar datos que el backend no envía aún
          horas_ocupadas: total * 1, // Asumimos 1 hora promedio por cita
          pacientes_atendidos: total // Asumimos 1 paciente por cita
        };
      });
    } catch (error) {
      console.error('🔴 Error getOcupacionOdontologos:', error);
      return [];
    }
  }
}

export default new ReportesService();
