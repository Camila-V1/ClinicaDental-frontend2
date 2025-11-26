/**
 * 🔄 Tipos TypeScript para Sistema de Backups
 */

/**
 * Registro de un backup individual
 */
export interface BackupRecord {
  id: number;
  file_name: string;
  file_path: string;
  file_size: number;        // En bytes
  file_size_mb: number;     // En MB (calculado)
  backup_type: 'manual' | 'automatic';
  created_by: {
    id: number;
    email: string;
    nombre: string;
  } | null;
  created_at: string;       // ISO 8601 datetime
}

/**
 * DTO para crear backup manual
 */
export interface CreateBackupDTO {
  download?: boolean;       // Si true, descarga directo
}

/**
 * Respuesta al crear backup
 */
export interface CreateBackupResponse {
  message: string;
  backup_info: BackupRecord;
}

/**
 * Configuración de backups automáticos
 */
export interface BackupConfig {
  backup_schedule: 'disabled' | 'daily' | 'every_12h' | 'every_6h' | 'weekly' | 'monthly' | 'scheduled';
  backup_time?: string;           // HH:MM:SS (ej: "02:00:00")
  backup_weekday?: number;        // 0-6 (0=Lunes, 6=Domingo)
  backup_day_of_month?: number;   // 1-28
  next_scheduled_backup?: string; // ISO 8601 datetime (solo para 'scheduled')
  last_backup_at?: string;        // ISO 8601 datetime (readonly)
}

/**
 * Filtros para historial
 */
export interface BackupFilters {
  tipo?: 'manual' | 'automatic';
  fecha_desde?: string;
  fecha_hasta?: string;
}
