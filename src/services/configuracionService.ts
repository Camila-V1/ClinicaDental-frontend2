/**
 * ⚙️ Servicio de Configuración
 * Configuración del sistema (limitado a lo disponible en backend)
 */

import api from '@/lib/axios-core';

// ==================== INTERFACES ====================

export interface ConfiguracionGeneral {
  nombre_sistema: string;
  version: string;
  timezone: string;
  idioma: string;
  moneda: string;
}

export interface ConfiguracionUsuario {
  id: number;
  notificaciones_email: boolean;
  notificaciones_sistema: boolean;
  tema: 'light' | 'dark' | 'auto';
  idioma: string;
}

export interface TenantInfo {
  subdomain: string;
  schema_name: string;
  nombre: string;
  plan?: string;
  activo: boolean;
}

export interface AuditoriaLog {
  id: number;
  usuario: string;
  accion: string;
  modelo: string;
  objeto_id: string;
  detalles: string;
  ip_address: string;
  timestamp: string;
}

// ==================== SERVICIO ====================

class ConfiguracionService {
  // Configuración General (Frontend - Local Storage)
  getConfiguracionGeneral(): ConfiguracionGeneral {
    const config = localStorage.getItem('config_general');
    if (config) {
      return JSON.parse(config);
    }
    return {
      nombre_sistema: 'Sistema Clínica Dental',
      version: '1.0.0',
      timezone: 'America/La_Paz',
      idioma: 'es-BO',
      moneda: 'BOB',
    };
  }

  setConfiguracionGeneral(config: ConfiguracionGeneral): void {
    localStorage.setItem('config_general', JSON.stringify(config));
  }

  // Configuración de Usuario (Frontend - Local Storage)
  getConfiguracionUsuario(): ConfiguracionUsuario {
    const config = localStorage.getItem('config_usuario');
    if (config) {
      return JSON.parse(config);
    }
    return {
      id: 0,
      notificaciones_email: true,
      notificaciones_sistema: true,
      tema: 'light',
      idioma: 'es-BO',
    };
  }

  setConfiguracionUsuario(config: ConfiguracionUsuario): void {
    localStorage.setItem('config_usuario', JSON.stringify(config));
  }

  // Información del Tenant (detectada del subdominio)
  getTenantInfo(): TenantInfo {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    
    // En desarrollo podría ser localhost
    const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');
    
    return {
      subdomain: isLocalhost ? 'clinica1' : subdomain,
      schema_name: isLocalhost ? 'clinica1' : subdomain,
      nombre: 'Clínica Dental',
      activo: true,
    };
  }

  // Limpiar caché
  clearCache(): void {
    localStorage.removeItem('config_general');
    localStorage.removeItem('config_usuario');
    sessionStorage.clear();
  }

  // Logs de Auditoría (si están disponibles en backend)
  async getAuditoriaLogs(params?: {
    page?: number;
    usuario?: string;
    accion?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
  }) {
    try {
      const response = await api.get<{ results: AuditoriaLog[]; count: number }>(
        '/api/auditoria/logs/',
        { params }
      );
      return response.data;
    } catch (error) {
      // Si el endpoint no existe, retornar datos vacíos
      return { results: [], count: 0 };
    }
  }

  // Exportar Configuración
  exportarConfiguracion(): string {
    const config = {
      general: this.getConfiguracionGeneral(),
      usuario: this.getConfiguracionUsuario(),
      tenant: this.getTenantInfo(),
      fecha_exportacion: new Date().toISOString(),
    };
    return JSON.stringify(config, null, 2);
  }

  // Importar Configuración
  importarConfiguracion(jsonString: string): boolean {
    try {
      const config = JSON.parse(jsonString);
      if (config.general) {
        this.setConfiguracionGeneral(config.general);
      }
      if (config.usuario) {
        this.setConfiguracionUsuario(config.usuario);
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new ConfiguracionService();
