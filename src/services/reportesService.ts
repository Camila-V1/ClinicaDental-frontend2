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
      console.log('📊 [ReportesService] Solicitando dashboard-kpis...');
      const response = await api.get('/api/reportes/reportes/dashboard-kpis/');
      const data = response.data;
      console.log('✅ [ReportesService] KPIs recibidos del backend:', data);
      console.log('   - Tipo de datos:', Array.isArray(data) ? 'Array' : typeof data);
      console.log('   - Longitud:', Array.isArray(data) ? data.length : 'N/A');

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
        console.log('🔄 [ReportesService] Procesando items de KPIs:');
        data.forEach((item: any, index: number) => {
          const rawLabel = item.etiqueta || item.label || '';
          const label = String(rawLabel).toLowerCase();
          const value = item.valor || item.value || 0;
          console.log(`   ${index + 1}. "${rawLabel}" = ${value} (label normalizado: "${label}")`);

          if (label.includes('pacientes') && label.includes('activos')) kpisFormatted.total_pacientes = Number(value);
          else if (label.includes('citas') && label.includes('hoy')) kpisFormatted.citas_hoy = Number(value);
          else if (label.includes('ingresos')) kpisFormatted.ingresos_mes = String(value);
          else if (label.includes('saldo')) kpisFormatted.facturas_pendientes = Number(value); 
        });
      }
      console.log('📦 [ReportesService] KPIs formateados:', kpisFormatted);
      return kpisFormatted;
    } catch (error) {
      console.error('🔴 Error getDashboardKpis:', error);
      throw error;
    }
  }

  // 2. Estadísticas Generales
  async getEstadisticasGenerales() {
    console.log('📊 [ReportesService] Solicitando estadisticas-generales...');
    const response = await api.get<EstadisticasGenerales>('/api/reportes/reportes/estadisticas-generales/');
    console.log('✅ [ReportesService] Estadísticas recibidas:', response.data);
    console.log('   - Pacientes activos:', response.data.total_pacientes_activos);
    console.log('   - Citas mes:', response.data.citas_mes_actual);
    console.log('   - Tasa ocupación:', response.data.tasa_ocupacion);
    return response.data;
  }

  // 3. Tendencia de Citas (Corrección: cantidad -> total)
  async getTendenciaCitas(params?: { dias?: number }) {
    try {
      console.log('📈 [ReportesService] Solicitando tendencia-citas con params:', params);
      const response = await api.get('/api/reportes/reportes/tendencia-citas/', { params });
      const data = response.data;
      console.log('✅ [ReportesService] Tendencia recibida:', data);
      console.log('   - Tipo:', Array.isArray(data) ? 'Array' : typeof data);
      console.log('   - Registros:', Array.isArray(data) ? data.length : 'N/A');
      
      if (!Array.isArray(data)) {
        console.warn('⚠️ [ReportesService] Tendencia no es array, retornando []');
        return [];
      }

      if (data.length > 0) {
        console.log('   - Primer registro:', data[0]);
        console.log('   - Último registro:', data[data.length - 1]);
      }

      const resultado = data.map((item: any) => ({
        fecha: item.fecha,
        total: Number(item.cantidad || item.total || 0),
        completadas: Number(item.completadas || 0),
        canceladas: Number(item.canceladas || 0)
      }));
      console.log('📦 [ReportesService] Tendencia mapeada:', resultado.length, 'registros');
      return resultado;
    } catch (error) {
      console.error('🔴 Error Tendencia:', error);
      return [];
    }
  }

  // 4. Top Procedimientos (Corrección: etiqueta -> nombre + CÁLCULO DE PORCENTAJE)
  async getTopProcedimientos(params?: { limite?: number }) {
    try {
      console.log('🏆 [ReportesService] Solicitando top-procedimientos con params:', params);
      const response = await api.get('/api/reportes/reportes/top-procedimientos/', { params });
      const data = response.data;
      console.log('✅ [ReportesService] Top procedimientos recibidos:', data);

      if (!Array.isArray(data)) {
        console.warn('⚠️ [ReportesService] Top procedimientos no es array');
        return [];
      }

      // Calcular el total para porcentajes
      const totalCantidad = data.reduce((sum, item) => sum + (Number(item.valor || item.cantidad || 0)), 0);
      console.log('📊 [ReportesService] Total cantidad:', totalCantidad);

      const resultado = data.map((item: any, index: number) => {
        const cantidad = Number(item.valor || item.cantidad || 0);
        const porcentaje = totalCantidad > 0 
          ? ((cantidad / totalCantidad) * 100).toFixed(1)
          : "0";

        console.log(`   ${index + 1}. ${item.etiqueta || item.nombre}: ${cantidad} (${porcentaje}%)`);

        return {
          nombre: item.etiqueta || item.nombre || 'Sin Nombre',
          cantidad: cantidad,
          porcentaje: porcentaje
        };
      });
      console.log('📦 [ReportesService] Procedimientos mapeados:', resultado.length, 'items');
      return resultado;
    } catch (error) {
      console.error('🔴 Error Top Procedimientos:', error);
      return [];
    }
  }

  // 5. Reporte Financiero
  async getReporteFinanciero(params?: { periodo?: string; fecha_inicio?: string; fecha_fin?: string }) {
    console.log('💰 [ReportesService] Solicitando reporte-financiero con params:', params);
    const response = await api.get<ReporteFinanciero>('/api/reportes/reportes/reporte-financiero/', { params });
    console.log('✅ [ReportesService] Reporte financiero recibido:', response.data);
    console.log('   - Total facturado:', response.data.total_facturado);
    console.log('   - Total pagado:', response.data.total_pagado);
    console.log('   - Saldo pendiente:', response.data.saldo_pendiente);
    console.log('   - Número facturas:', response.data.numero_facturas);
    return response.data;
  }

  // 6. Ocupación de Odontólogos (Usando datos completos del backend)
  async getOcupacionOdontologos(params?: { mes?: string }) {
    try {
      console.log('👨‍⚕️ [ReportesService] Solicitando reporte-citas-odontologo con params:', params);
      const response = await api.get('/api/reportes/reportes/reporte-citas-odontologo/', { params });
      const data = response.data;
      console.log('✅ [ReportesService] Ocupación recibida del backend:', data);
      console.log('   - Tipo:', Array.isArray(data) ? 'Array' : typeof data);
      console.log('   - Odontólogos:', Array.isArray(data) ? data.length : 'N/A');

      if (!Array.isArray(data)) {
        console.warn('⚠️ [ReportesService] Ocupación no es array, retornando []');
        return [];
      }

      console.log('🔄 [ReportesService] Mapeando datos de ocupación:');
      return data.map((item: any, index: number) => {
        console.log(`\n   📋 Odontólogo ${index + 1}:`);
        console.log('      - Raw data:', item);
        console.log('      - usuario_id:', item.usuario_id);
        console.log('      - nombre_completo:', item.nombre_completo);
        console.log('      - total_citas:', item.total_citas);
        console.log('      - citas_completadas:', item.citas_completadas);
        console.log('      - horas_ocupadas:', item.horas_ocupadas);
        console.log('      - tasa_ocupacion:', item.tasa_ocupacion);
        console.log('      - pacientes_atendidos:', item.pacientes_atendidos);

        const resultado = {
          odontologo_id: Number(item.usuario_id || item.odontologo_id || 0),
          odontologo_nombre: item.nombre_completo || item.odontologo || 'Dr. Desconocido',
          total_citas: Number(item.total_citas || 0),
          citas_completadas: Number(item.citas_completadas || item.completadas || 0),
          citas_canceladas: Number(item.citas_canceladas || item.canceladas || 0),
          horas_ocupadas: Number(item.horas_ocupadas || 0),
          tasa_ocupacion: String(item.tasa_ocupacion || "0"),
          pacientes_atendidos: Number(item.pacientes_atendidos || 0)
        };

        console.log('      ✅ Mapeado:', resultado);
        return resultado;
      });
    } catch (error) {
      console.error('🔴 Error getOcupacionOdontologos:', error);
      return [];
    }
  }
}

export default new ReportesService();
