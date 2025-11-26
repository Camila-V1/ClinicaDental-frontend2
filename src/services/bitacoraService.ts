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
  descripcion?: string;
  user_agent?: string;
  fecha_hora?: string;
}

// ==================== BITÁCORA ====================

const getLogs = async (params?: {
  page?: number;
  usuario?: number | string;
  accion?: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'LOGIN' | 'LOGOUT' | string;
  modelo?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  page_size?: number;
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
    descripcion: log.descripcion || log.detalles || '',
    ip_address: log.ip_address || '',
    timestamp: log.fecha_hora || log.timestamp || new Date().toISOString(),
    fecha_hora: log.fecha_hora || log.timestamp || new Date().toISOString(),
    user_agent: log.user_agent || ''
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

const getLogDetalle = async (id: number): Promise<BitacoraLog> => {
  const response = await api.get(`/api/reportes/bitacora/${id}/`);
  const log = response.data;
  
  return {
    id: log.id,
    usuario: log.usuario?.nombre_completo || log.usuario || 'Usuario desconocido',
    accion: log.accion || '',
    modelo: log.modelo || '',
    objeto_id: log.object_id || log.objeto_id || '',
    detalles: log.descripcion || log.detalles || '',
    descripcion: log.descripcion || log.detalles || '',
    ip_address: log.ip_address || '',
    timestamp: log.fecha_hora || log.timestamp || new Date().toISOString(),
    fecha_hora: log.fecha_hora || log.timestamp || new Date().toISOString(),
    user_agent: log.user_agent || ''
  };
};

// Helper para convertir a CSV
const convertirACSV = (logs: BitacoraLog[]): string => {
  if (logs.length === 0) return '';
  
  const headers = ['ID', 'Fecha', 'Usuario', 'Acción', 'Modelo', 'Descripción', 'IP'];
  const rows = logs.map(log => [
    log.id,
    new Date(log.fecha_hora || log.timestamp).toLocaleString(),
    log.usuario || 'Sistema',
    log.accion,
    log.modelo,
    log.descripcion || log.detalles || '',
    log.ip_address
  ]);
  
  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
};

// Exportar logs a CSV o JSON
const exportarLogs = async (params: any, formato: 'csv' | 'json'): Promise<void> => {
  const data = await getLogs(params);
  const logs = data.results || [];
  
  if (formato === 'json') {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } else if (formato === 'csv') {
    const csv = convertirACSV(logs);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

// ==================== EXPORTAR ====================

const bitacoraService = {
  getLogs,
  getLogDetalle,
  exportarLogs,
};

export default bitacoraService;
