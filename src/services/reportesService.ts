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
  usuario_id: number;          // ✅ Campo correcto del backend (no odontologo_id)
  nombre_completo: string;     // ✅ Campo correcto del backend
  total_citas: number;
  citas_completadas: number;
  citas_canceladas: number;
  horas_ocupadas: number;      // ✅ Calculado por backend
  tasa_ocupacion: string;      // ✅ String "43.48"
  pacientes_atendidos: number; // ✅ Calculado por backend
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
          // ✅ Backend envía 'etiqueta' y 'valor'
          const rawLabel = item.etiqueta || item.label || '';
          const label = String(rawLabel).toLowerCase();
          const value = item.valor || item.value || 0;
          console.log(`   ${index + 1}. "${rawLabel}" = ${value} (normalizado: "${label}")`);

          if (label.includes('pacientes') && label.includes('activos')) {
            kpisFormatted.total_pacientes = Number(value);
            console.log('      ✅ Mapeado a: total_pacientes =', Number(value));
          }
          else if (label.includes('citas') && label.includes('hoy')) {
            kpisFormatted.citas_hoy = Number(value);
            console.log('      ✅ Mapeado a: citas_hoy =', Number(value));
          }
          else if (label.includes('ingresos')) {
            kpisFormatted.ingresos_mes = String(value);
            console.log('      ✅ Mapeado a: ingresos_mes =', String(value));
          }
          else if (label.includes('saldo')) {
            kpisFormatted.facturas_pendientes = Number(value);
            console.log('      ✅ Mapeado a: facturas_pendientes =', Number(value));
          }
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
      console.log('   - Tipo de datos:', Array.isArray(data) ? 'Array' : typeof data);
      console.log('   - Cantidad de items:', Array.isArray(data) ? data.length : 'N/A');

      if (!Array.isArray(data)) {
        console.warn('⚠️ [ReportesService] Top procedimientos no es array');
        return [];
      }

      // Calcular el total para porcentajes
      const totalCantidad = data.reduce((sum, item) => sum + (Number(item.valor || item.cantidad || 0)), 0);
      console.log('📊 [ReportesService] Total cantidad de procedimientos:', totalCantidad);

      const resultado = data.map((item: any, index: number) => {
        const cantidad = Number(item.valor || item.cantidad || 0);
        const porcentaje = totalCantidad > 0 
          ? ((cantidad / totalCantidad) * 100).toFixed(1)
          : "0";

        console.log(`   ${index + 1}. ${item.etiqueta || item.nombre}: ${cantidad} realizados (${porcentaje}%)`);

        return {
          nombre: item.etiqueta || item.nombre || 'Sin Nombre',
          cantidad: cantidad,
          porcentaje: porcentaje
        };
      });
      
      console.log('📦 [ReportesService] Procedimientos mapeados:', resultado.length, 'items');
      if (resultado.length > 0) {
        console.log('   - Top 3 procedimientos más frecuentes:');
        resultado.slice(0, 3).forEach((proc, idx) => {
          console.log(`      ${idx + 1}. ${proc.nombre}: ${proc.cantidad} (${proc.porcentaje}%)`);
        });
      }
      
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

  // 6. Ocupación de Odontólogos (Usando endpoint correcto: ocupacion-odontologos)
  async getOcupacionOdontologos(params?: { mes?: string; anio?: string }) {
    try {
      console.log('👨‍⚕️ [ReportesService] Solicitando ocupacion-odontologos (ENDPOINT CORRECTO) con params:', params);
      // ✅ CAMBIO CRÍTICO: Usar endpoint correcto que tiene estructura completa
      const response = await api.get<OcupacionOdontologo[]>('/api/reportes/reportes/ocupacion-odontologos/', { params });
      const data = response.data;
      console.log('✅ [ReportesService] Ocupación recibida del backend:', data);
      console.log('   - Tipo:', Array.isArray(data) ? 'Array' : typeof data);
      console.log('   - Odontólogos:', Array.isArray(data) ? data.length : 'N/A');

      if (!Array.isArray(data)) {
        console.warn('⚠️ [ReportesService] Ocupación no es array, retornando []');
        return [];
      }

      // ✅ Backend ya envía estructura correcta, NO necesitamos mapear
      console.log('📦 [ReportesService] Retornando datos directos del backend (sin mapeo)');
      data.forEach((item, index) => {
        console.log(`\n   📋 Odontólogo ${index + 1}:`, item);
      });

      return data;
    } catch (error) {
      console.error('🔴 Error getOcupacionOdontologos:', error);
      return [];
    }
  }

  // ==================== EXPORTACIÓN DE REPORTES ====================

  /**
   * Exportar reporte genérico en formato PDF o Excel
   */
  async exportarReporte(
    endpoint: string,
    params: Record<string, any> = {},
    formato: 'pdf' | 'excel'
  ): Promise<void> {
    try {
      console.log(`📥 [ReportesService] Exportando ${endpoint} en formato ${formato}...`);
      
      const queryParams = new URLSearchParams({
        ...params,
        formato
      }).toString();

      const token = localStorage.getItem('access_token');
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const url = `${baseURL}/reportes/reportes/${endpoint}/?${queryParams}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Tenant': localStorage.getItem('tenant') || ''
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const extension = formato === 'pdf' ? 'pdf' : 'xlsx';
      const fecha = new Date().toISOString().split('T')[0];
      const nombreArchivo = `reporte_${endpoint}_${fecha}.${extension}`;
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(blobUrl);
      
      console.log(`✅ [ReportesService] Archivo descargado: ${nombreArchivo}`);
    } catch (error) {
      console.error('🔴 Error al exportar reporte:', error);
      throw error;
    }
  }

  /**
   * Exportar Dashboard KPIs
   */
  exportarDashboardKPIs(formato: 'pdf' | 'excel'): Promise<void> {
    return this.exportarReporte('dashboard-kpis', {}, formato);
  }

  /**
   * Exportar Tendencia de Citas
   */
  exportarTendenciaCitas(dias: number, formato: 'pdf' | 'excel'): Promise<void> {
    return this.exportarReporte('tendencia-citas', { dias }, formato);
  }

  /**
   * Exportar Top Procedimientos
   */
  exportarTopProcedimientos(limite: number, formato: 'pdf' | 'excel'): Promise<void> {
    return this.exportarReporte('top-procedimientos', { limite }, formato);
  }

  /**
   * Exportar Estadísticas Generales
   */
  exportarEstadisticas(formato: 'pdf' | 'excel'): Promise<void> {
    return this.exportarReporte('estadisticas-generales', {}, formato);
  }

  /**
   * Exportar Reporte de Ingresos
   */
  exportarIngresos(fechaInicio: string, fechaFin: string, formato: 'pdf' | 'excel'): Promise<void> {
    return this.exportarReporte('ingresos', { 
      fecha_inicio: fechaInicio, 
      fecha_fin: fechaFin 
    }, formato);
  }

  /**
   * Exportar Reporte Financiero
   */
  exportarReporteFinanciero(fechaInicio: string, fechaFin: string, formato: 'pdf' | 'excel'): Promise<void> {
    return this.exportarReporte('reporte-financiero', {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin
    }, formato);
  }

  /**
   * Exportar Ocupación de Odontólogos
   */
  exportarOcupacionOdontologos(fechaInicio: string, fechaFin: string, formato: 'pdf' | 'excel'): Promise<void> {
    return this.exportarReporte('ocupacion-odontologos', {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin
    }, formato);
  }
}

export default new ReportesService();
