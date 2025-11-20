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
    const { data } = await api.get('/api/reportes/reportes/dashboard-kpis/');
    return data;
  },

  /**
   * Obtener tendencia de citas (últimos N días)
   */
  async getTendenciaCitas(dias: number = 15): Promise<TendenciaCita[]> {
    const { data } = await api.get('/api/reportes/reportes/tendencia-citas/', {
      params: { dias }
    });
    return data;
  },

  /**
   * Obtener top procedimientos más realizados
   */
  async getTopProcedimientos(limite: number = 5): Promise<TopProcedimiento[]> {
    const { data } = await api.get('/api/reportes/reportes/top-procedimientos/', {
      params: { limite }
    });
    return data;
  },

  /**
   * Obtener estadísticas generales de la clínica
   */
  async getEstadisticasGenerales(): Promise<EstadisticasGenerales> {
    const { data } = await api.get('/api/reportes/reportes/estadisticas-generales/');
    return data;
  },

  /**
   * Obtener insumos con stock bajo
   */
  async getStockBajo() {
    const { data } = await api.get('/api/inventario/insumos/', {
      params: { 
        stock_bajo: true,
        page_size: 10
      }
    });
    return data;
  },

  /**
   * Obtener actividad reciente (bitácora)
   */
  async getActividadReciente() {
    const { data } = await api.get('/api/reportes/bitacora/', {
      params: { 
        page: 1,
        page_size: 10
      }
    });
    return data;
  },
};
