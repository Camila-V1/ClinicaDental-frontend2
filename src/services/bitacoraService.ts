/**
 * 📋 SERVICIO DE BITÁCORA (Auditoría)
 * Logs de actividad del sistema
 */

import api from '../config/apiConfig';

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
  
  console.log('📋 [bitacoraService] Data cruda recibida:', response.data);
  
  // Transformar los datos del backend al formato esperado por el frontend
  let logs = [];
  if (Array.isArray(response.data)) {
    logs = response.data;
  } else if (response.data.results && Array.isArray(response.data.results)) {
    logs = response.data.results;
  }
  
  const transformedLogs = logs.map((log: any) => ({
    id: log.id,
    usuario: log.usuario?.nombre_completo || log.usuario || 'Usuario desconocido',
    accion: log.accion || '',
    modelo: log.modelo || '',
    objeto_id: log.object_id || log.objeto_id || '',
    detalles: log.descripcion || log.detalles || '',
    ip_address: log.ip_address || '',
    timestamp: log.fecha_hora || log.timestamp || new Date().toISOString()
  }));
  
  console.log('✅ [bitacoraService] Logs transformados:', transformedLogs.length);
  console.log('📊 [bitacoraService] Primer log:', transformedLogs[0]);
  
  return {
    results: transformedLogs,
    count: response.data.count || transformedLogs.length,
    next: response.data.next || null,
    previous: response.data.previous || null
  };
};

// ==================== EXPORTAR ====================

const bitacoraService = {
  getLogs,
};

export default bitacoraService;
