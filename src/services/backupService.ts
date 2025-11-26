/**
 * 🔄 Servicio de Backups
 */

import api from '../config/apiConfig';
import type { BackupRecord, CreateBackupResponse, BackupConfig } from '../types/backups';

const backupService = {
  /**
   * Obtener historial de backups
   */
  async getHistorial(): Promise<BackupRecord[]> {
    const response = await api.get('/api/backups/history/');
    return response.data;
  },

  /**
   * Crear backup manual
   * @param download - Si true, descarga el archivo inmediatamente
   */
  async crearBackupManual(download: boolean = false): Promise<CreateBackupResponse | Blob> {
    const response = await api.post(
      '/api/backups/create/',
      {},
      {
        params: { download },
        responseType: download ? 'blob' : 'json'
      }
    );
    
    return response.data;
  },

  /**
   * Descargar backup existente
   */
  async descargarBackup(backupId: number): Promise<Blob> {
    const response = await api.get(
      `/api/backups/history/${backupId}/download/`,
      { responseType: 'blob' }
    );
    
    return response.data;
  },

  /**
   * Eliminar backup
   */
  async eliminarBackup(backupId: number): Promise<void> {
    await api.delete(`/api/backups/history/${backupId}/`);
  },

  /**
   * Obtener configuración de backups automáticos
   */
  async getConfiguracion(): Promise<BackupConfig> {
    const response = await api.get('/api/admin/config/');
    return {
      backup_schedule: response.data.backup_schedule || 'disabled',
      backup_time: response.data.backup_time,
      backup_weekday: response.data.backup_weekday,
      backup_day_of_month: response.data.backup_day_of_month,
      next_scheduled_backup: response.data.next_scheduled_backup,
      last_backup_at: response.data.last_backup_at
    };
  },

  /**
   * Actualizar configuración de backups automáticos
   */
  async actualizarConfiguracion(config: Partial<BackupConfig>): Promise<BackupConfig> {
    const response = await api.patch('/api/admin/config/', config);
    return response.data;
  }
};

/**
 * Utilidad: Descargar archivo Blob
 */
export const descargarArchivo = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Utilidad: Formatear tamaño de archivo
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Utilidad: Formatear fecha relativa
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Hace un momento';
  if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default backupService;
