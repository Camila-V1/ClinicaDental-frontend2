/**
 * 📊 Servicio para Dashboard del Administrador
 */

import api from '@/config/apiConfig';
import type { 
  KPI, 
  EstadisticasGenerales, 
  TendenciaCita, 
  TopProcedimiento 
} from '@/types/admin';

export const adminDashboardService = {
  /**
   * Obtener KPIs principales del dashboard
   */
  async getKPIs(): Promise<KPI[]> {
    console.log('🔵 [adminDashboardService.getKPIs] Iniciando petición...');
    console.log('🔵 [adminDashboardService.getKPIs] URL:', '/api/reportes/reportes/dashboard-kpis/');
    try {
      const { data } = await api.get('/api/reportes/reportes/dashboard-kpis/');
      console.log('🟢 [adminDashboardService.getKPIs] Respuesta exitosa:', data);
      return data;
    } catch (error: any) {
      console.error('🔴 [adminDashboardService.getKPIs] Error completo:', error);
      console.error('🔴 [adminDashboardService.getKPIs] Response:', error.response);
      console.error('🔴 [adminDashboardService.getKPIs] Status:', error.response?.status);
      console.error('🔴 [adminDashboardService.getKPIs] Data:', error.response?.data);
      console.error('🔴 [adminDashboardService.getKPIs] Headers:', error.response?.headers);
      throw error;
    }
  },

  /**
   * Obtener tendencia de citas (últimos N días)
   */
  async getTendenciaCitas(dias: number = 15): Promise<TendenciaCita[]> {
    console.log('🔵 [adminDashboardService.getTendenciaCitas] Iniciando petición...');
    console.log('🔵 [adminDashboardService.getTendenciaCitas] Días:', dias);
    try {
      const { data } = await api.get('/api/reportes/reportes/tendencia-citas/', {
        params: { dias }
      });
      console.log('🟢 [adminDashboardService.getTendenciaCitas] Respuesta exitosa:', data);
      return data;
    } catch (error: any) {
      console.error('🔴 [adminDashboardService.getTendenciaCitas] Error:', error);
      console.error('🔴 [adminDashboardService.getTendenciaCitas] Response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Obtener top procedimientos más realizados
   */
  async getTopProcedimientos(limite: number = 5): Promise<TopProcedimiento[]> {
    console.log('🔵 [adminDashboardService.getTopProcedimientos] Iniciando petición...');
    console.log('🔵 [adminDashboardService.getTopProcedimientos] Límite:', limite);
    try {
      const { data } = await api.get('/api/reportes/reportes/top-procedimientos/', {
        params: { limite }
      });
      console.log('🟢 [adminDashboardService.getTopProcedimientos] Respuesta exitosa:', data);
      return data;
    } catch (error: any) {
      console.error('🔴 [adminDashboardService.getTopProcedimientos] Error:', error);
      console.error('🔴 [adminDashboardService.getTopProcedimientos] Response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Obtener estadísticas generales de la clínica
   */
  async getEstadisticasGenerales(): Promise<EstadisticasGenerales> {
    console.log('🔵 [adminDashboardService.getEstadisticasGenerales] Iniciando petición...');
    try {
      const { data } = await api.get('/api/reportes/reportes/estadisticas-generales/');
      console.log('🟢 [adminDashboardService.getEstadisticasGenerales] Respuesta exitosa:', data);
      return data;
    } catch (error: any) {
      console.error('🔴 [adminDashboardService.getEstadisticasGenerales] Error:', error);
      console.error('🔴 [adminDashboardService.getEstadisticasGenerales] Response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Obtener insumos con stock bajo
   */
  async getStockBajo() {
    console.log('🔵 [adminDashboardService.getStockBajo] Iniciando petición...');
    console.log('🔵 [adminDashboardService.getStockBajo] URL:', '/api/inventario/insumos/bajo_stock/');
    try {
      const { data } = await api.get('/api/inventario/insumos/bajo_stock/', {
        params: { 
          page_size: 10
        }
      });
      console.log('🟢 [adminDashboardService.getStockBajo] Respuesta exitosa:', data);
      return data;
    } catch (error: any) {
      console.error('🔴 [adminDashboardService.getStockBajo] Error:', error);
      console.error('🔴 [adminDashboardService.getStockBajo] Response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Obtener actividad reciente (bitácora)
   */
  async getActividadReciente() {
    console.log('🔵 [adminDashboardService.getActividadReciente] Iniciando petición...');
    try {
      const { data } = await api.get('/api/reportes/bitacora/', {
        params: { 
          page: 1,
          page_size: 10
        }
      });
      console.log('🟢 [adminDashboardService.getActividadReciente] Respuesta exitosa:', data);
      return data;
    } catch (error: any) {
      console.error('🔴 [adminDashboardService.getActividadReciente] Error:', error);
      console.error('🔴 [adminDashboardService.getActividadReciente] Response:', error.response?.data);
      throw error;
    }
  },
};
