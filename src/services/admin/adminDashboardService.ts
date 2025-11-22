/**
 * 📊 Servicio para Dashboard del Administrador
 * (Corregido: Error 'includes' of undefined)
 */

import api from '@/config/apiConfig';
import type { 
  KPI, 
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
   * Se aplica transformación de Array -> Objeto
   */
  async getKPIs(): Promise<any> {
    console.log('🔵 [adminDashboardService.getKPIs] Iniciando petición...');
    try {
      const { data } = await api.get('/api/reportes/reportes/dashboard-kpis/');
      console.log('🟢 [adminDashboardService.getKPIs] Respuesta RAW:', data);

      // 🛠️ ADAPTADOR: Convertir Array de backend a Objeto para frontend
      let kpisFormatted = {
        total_pacientes: 0,
        citas_hoy: 0,
        ingresos_mes: "0",
        tratamientos_activos: 0,
        pacientes_nuevos_mes: 0,
        tasa_ocupacion: 0,
        citas_pendientes: 0,
        facturas_pendientes: 0
      };

      if (Array.isArray(data)) {
        // Si es un array, intentamos mapear buscando por claves o labels comunes
        data.forEach((item: any) => {
          // CORRECCIÓN: Asegurar que key siempre sea string
          // Usamos (item.key O item.label O texto vacío)
          const rawKey = item.key || item.label || ''; 
          const key = String(rawKey).toLowerCase().replace(/ /g, '_');
          const value = item.value;

          if (key.includes('pacientes') && key.includes('total')) kpisFormatted.total_pacientes = value;
          else if (key.includes('citas') && key.includes('hoy')) kpisFormatted.citas_hoy = value;
          else if (key.includes('ingresos')) kpisFormatted.ingresos_mes = String(value);
          else if (key.includes('tratamientos')) kpisFormatted.tratamientos_activos = value;
          else if (key.includes('nuevos')) kpisFormatted.pacientes_nuevos_mes = value;
          else if (key.includes('ocupacion') || key.includes('ocupación')) kpisFormatted.tasa_ocupacion = value;
          else if (key.includes('citas') && key.includes('pendientes')) kpisFormatted.citas_pendientes = value;
          else if (key.includes('facturas')) kpisFormatted.facturas_pendientes = value;
        });
      } else if (typeof data === 'object' && data !== null) {
        // Si ya es objeto, lo mezclamos con los defaults
        kpisFormatted = { ...kpisFormatted, ...data };
      }

      console.log('✅ [adminDashboardService.getKPIs] Datos Adaptados:', kpisFormatted);
      return kpisFormatted;

    } catch (error: any) {
      console.error('🔴 [adminDashboardService.getKPIs] Error:', error);
      // Retornamos estructura vacía para no romper la UI
      return {
        total_pacientes: 0,
        citas_hoy: 0,
        ingresos_mes: "0",
        tratamientos_activos: 0,
        pacientes_nuevos_mes: 0,
        tasa_ocupacion: 0,
        citas_pendientes: 0,
        facturas_pendientes: 0
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
   * Obtener actividad reciente (bitácora)
   */
  async getActividadReciente() {
    try {
      const { data } = await api.get('/api/reportes/bitacora/', { params: { page: 1, page_size: 10 } });
      // La respuesta de bitácora a veces viene paginada (results) o directa (array)
      if (data && Array.isArray(data.results)) return data.results;
      if (Array.isArray(data)) return data;
      return [];
    } catch (error: any) {
      console.error('🔴 Error Bitácora:', error);
      return [];
    }
  },
};

export default adminDashboardService;
