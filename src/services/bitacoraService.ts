/**
 * 📋 SERVICIO DE BITÁCORA (Auditoría)
 * Logs de actividad del sistema
 */

import api from '@/services/api';

// ==================== INTERFACES ====================

export interface BitacoraLog {
  id: number;
  usuario: string;
  accion: string;
  modelo: string;
  objeto_id: string;
  detalles?: string;
  ip_address: string;
  timestamp: string;
}

// ==================== BITÁCORA ====================

const getLogs = async (params?: {
  page?: number;
  usuario?: string;
  accion?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  limit?: number;
}): Promise<{ results: BitacoraLog[]; count: number; next: string | null; previous: string | null }> => {
  const response = await api.get('/api/reportes/bitacora/', { params });
  return response.data;
};

// ==================== EXPORTAR ====================

const bitacoraService = {
  getLogs,
};

export default bitacoraService;
