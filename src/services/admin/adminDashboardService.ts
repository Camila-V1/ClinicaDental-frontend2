/**
 * 📊 Servicio para Dashboard del Administrador
 * (Corregido: Error 'includes' of undefined)
 */

import api from '@/config/apiConfig';
import type { 
  KPI, 
  DashboardKPIs,
  EstadisticasGenerales, 
  TendenciaCita, 
  TopProcedimiento 
} from '@/types/admin';

// Interfaz local para asegurar el tipado de salida de ocupación
interface OcupacionOdontologoUI {
  odontologo_id: number;
  odontologo_nombre: string;
  tasa_ocupacion: string;
  total_citas: number;
  citas_completadas: number;
  citas_canceladas: number;
  horas_ocupadas: number;
  pacientes_atendidos: number;
}

export const adminDashboardService = {
  /**
   * Obtener KPIs principales del dashboard
   * ✅ CORREGIDO: Mapeo EXACTO por etiquetas del backend
   */
  async getKPIs(): Promise<DashboardKPIs> {
    console.log('🔵 [adminDashboardService.getKPIs] Iniciando petición...');
    try {
      const { data } = await api.get('/api/reportes/reportes/dashboard-kpis/');
      console.log('🟢 [adminDashboardService.getKPIs] Respuesta RAW del backend:', data);

      // Crear un mapa para acceso rápido por etiqueta
      const kpisMap = new Map<string, number>();
      if (Array.isArray(data)) {
        data.forEach((item: any) => {
          const etiqueta = item.etiqueta || '';
          const valor = Number(item.valor || 0);
          kpisMap.set(etiqueta, valor);
          console.log(`  📊 Mapeando KPI: "${etiqueta}" = ${valor}`);
        });
      }

      // Mapeo EXACTO por etiquetas del backend (sin normalización)
      const kpis: DashboardKPIs = {
        total_pacientes: kpisMap.get('Pacientes Activos') || 0,
        citas_hoy: kpisMap.get('Citas Hoy') || 0,
        ingresos_mes: kpisMap.get('Ingresos Este Mes') || 0,
        saldo_pendiente: kpisMap.get('Saldo Pendiente') || 0,
        tratamientos_activos: kpisMap.get('Tratamientos Activos') || 0,
        planes_completados: kpisMap.get('Planes Completados') || 0,
        promedio_factura: kpisMap.get('Promedio por Factura') || 0,
        facturas_vencidas: kpisMap.get('Facturas Vencidas') || 0,
        total_procedimientos: kpisMap.get('Total Procedimientos') || 0,
        pacientes_nuevos_mes: kpisMap.get('Pacientes Nuevos Mes') || 0,
      };

      console.log('✅ [adminDashboardService.getKPIs] KPIs mapeados correctamente:', kpis);
      return kpis;

    } catch (error: any) {
      console.error('🔴 [adminDashboardService.getKPIs] Error:', error);
      // Retornamos estructura vacía para no romper la UI
      return {
        total_pacientes: 0,
        citas_hoy: 0,
        ingresos_mes: 0,
        saldo_pendiente: 0,
        tratamientos_activos: 0,
        planes_completados: 0,
        promedio_factura: 0,
        facturas_vencidas: 0,
        total_procedimientos: 0,
        pacientes_nuevos_mes: 0,
      };
    }
  },

  /**
   * Obtener tendencia de citas
   */
  async getTendenciaCitas(dias: number = 15): Promise<TendenciaCita[]> {
    try {
      const { data } = await api.get('/api/reportes/reportes/tendencia-citas/', { params: { dias } });
      return data || [];
    } catch (error: any) {
      console.error('🔴 Error Tendencia:', error);
      return [];
    }
  },

  /**
   * Obtener top procedimientos
   */
  async getTopProcedimientos(limite: number = 5): Promise<TopProcedimiento[]> {
    try {
      const { data } = await api.get('/api/reportes/reportes/top-procedimientos/', { params: { limite } });
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      console.error('🔴 Error Top Procedimientos:', error);
      return [];
    }
  },

  /**
   * Obtener estadísticas generales
   */
  async getEstadisticasGenerales(): Promise<EstadisticasGenerales> {
    try {
      const { data } = await api.get('/api/reportes/reportes/estadisticas-generales/');
      return data;
    } catch (error: any) {
      console.error('🔴 Error Estadísticas:', error);
      throw error;
    }
  },

  /**
   * Obtener reporte financiero
   */
  async getReporteFinanciero(params: { periodo: string }) {
    try {
        const { data } = await api.get('/api/reportes/reportes/reporte-financiero/', { params });
        return data;
    } catch (error) {
        console.error('Error financiero', error);
        return null;
    }
  },

  /**
   * Obtener ocupación de odontólogos
   */
  async getOcupacionOdontologos(): Promise<OcupacionOdontologoUI[]> {
    try {
      const { data } = await api.get('/api/reportes/reportes/ocupacion-odontologos/');
      console.log('👨‍⚕️ [adminDashboardService] Ocupación recibida:', data);
      
      if (!Array.isArray(data)) return [];

      const mappedData = data.map((item: any) => {
        console.log('🔄 Mapeo ocupación:', item);
        return {
          odontologo_id: Number(item.usuario_id || 0),  // ✅ CORRECTO: usuario_id del backend
          odontologo_nombre: item.nombre_completo || 'Desconocido',  // ✅ CORRECTO: nombre_completo
          tasa_ocupacion: String(item.tasa_ocupacion || "0"),
          total_citas: Number(item.total_citas || 0),
          citas_completadas: Number(item.citas_completadas || 0),
          citas_canceladas: Number(item.citas_canceladas || 0),
          horas_ocupadas: Number(item.horas_ocupadas || 0),
          pacientes_atendidos: Number(item.pacientes_atendidos || 0)
        };
      });

      console.log('✅ [adminDashboardService] Ocupación mapeada:', mappedData);
      return mappedData;
    } catch (error: any) {
      console.error('🔴 Error Ocupación:', error);
      return [];
    }
  },

  /**
   * Obtener insumos con stock bajo
   */
  async getStockBajo() {
    try {
      const { data } = await api.get('/api/inventario/insumos/bajo_stock/', { params: { page_size: 10 } });
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      console.error('🔴 Error Stock:', error);
      return [];
    }
  },

  /**
   * ✅ Actividad reciente - Bitácora del sistema
   */
  async getActividadReciente() {
    try {
      const { data } = await api.get('/api/reportes/bitacora/', { params: { page: 1, page_size: 10 } });
      
      console.log('📋 [adminDashboardService] Bitácora data cruda:', data);
      
      // La respuesta de bitácora a veces viene paginada (results) o directa (array)
      let logs = [];
      if (data && Array.isArray(data.results)) {
        logs = data.results;
      } else if (Array.isArray(data)) {
        logs = data;
      }
      
      console.log('📋 [adminDashboardService] Logs encontrados:', logs.length);
      
      // Transformar el formato del backend al formato que espera el frontend
      const transformedLogs = logs.map((log: any) => ({
        id: log.id,
        usuario_nombre: log.usuario?.nombre_completo || log.usuario || 'Usuario desconocido',
        accion_display: log.accion_display || log.accion || 'Acción',
        descripcion: log.descripcion || '',
        fecha_hora: log.fecha_hora || log.timestamp || new Date().toISOString(),
        tabla_afectada: log.modelo || undefined
      }));
      
      console.log('✅ [adminDashboardService] Logs transformados:', transformedLogs);
      console.log('📊 [adminDashboardService] Primer log:', transformedLogs[0]);
      
      return { results: transformedLogs, count: transformedLogs.length };
    } catch (error: any) {
      console.error('🔴 Error Bitácora:', error);
      return { results: [], count: 0 };
    }
  },
};

export default adminDashboardService;
