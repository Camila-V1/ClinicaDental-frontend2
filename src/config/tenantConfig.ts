/**
 * 🏢 CONFIGURACIÓN MULTI-TENANT
 * Detecta y maneja subdominios para django-tenants
 * CORREGIDO: Protegido contra SSR y carga temprana
 * 
 * ⚠️ ACTUALIZADO: Frontend NO es multi-tenant, siempre usa el backend en Render
 */

export const TENANT_CONFIG = {
  development: {
    public: 'http://localhost:8000',
    tenant: 'http://{tenant}.localhost:8000'
  },
  production: {
    public: 'https://clinica-dental-backend.onrender.com',
    tenant: 'https://clinica-dental-backend.onrender.com' // Mismo para todos
  }
} as const;

/**
 * 🔍 Detectar el tenant actual desde el hostname
 * Ejemplos:
 * - "clinica-demo.localhost" → "clinica-demo"
 * - "localhost" → "public"
 * 
 * ⚠️ Protegido contra SSR (verifica que window esté disponible)
 */
export const getCurrentTenant = (): string => {
  // Verificar que window esté disponible (protección contra SSR)
  if (typeof window === 'undefined') {
    console.warn('⚠️ window no disponible, retornando tenant por defecto');
    return 'public';
  }

  const hostname = window.location.hostname;

  // En desarrollo: clinica-demo.localhost
  if (hostname.includes('localhost')) {
    const parts = hostname.split('.');
    return parts.length > 1 ? parts[0] : 'public';
  }

  // En producción: clinica-demo.clinica-dental.com
  const parts = hostname.split('.');
  return parts.length > 2 ? parts[0] : 'public';
};

/**
 * 🌐 Construir la URL base de la API según el tenant actual
 * 
 * ✅ SIMPLIFICADO: Frontend NO es multi-tenant
 * Siempre retorna la URL del backend en Render (producción) o localhost (desarrollo)
 */
export const getApiBaseUrl = (): string => {
  // Usar variables de entorno con fallback
  const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  
  if (apiUrl) {
    return apiUrl;
  }

  // Fallback basado en entorno
  const isProduction = import.meta.env.VITE_ENV === 'production';
  return isProduction 
    ? 'https://clinica-dental-backend.onrender.com'
    : 'http://localhost:8000';
};

/**
 * ✅ Verificar si estamos en el schema público
 */
export const isPublicSchema = (): boolean => {
  return getCurrentTenant() === 'public';
};

/**
 * 🔄 Cambiar a otro tenant (redirige a su subdominio)
 * 
 * ⚠️ DEPRECADO: Frontend no soporta multi-tenant en producción
 * Esta función solo funciona en desarrollo local
 */
export const switchTenant = (newTenant: string): void => {
  if (typeof window === 'undefined') {
    console.warn('⚠️ window no disponible, no se puede cambiar tenant');
    return;
  }

  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';

  // Solo funciona en desarrollo
  if (import.meta.env.VITE_ENV !== 'production') {
    window.location.href = `${protocol}//${newTenant}.localhost${port}`;
  } else {
    console.warn('⚠️ Cambio de tenant no soportado en producción');
  }
};

/**
 * 📋 Obtener información del tenant actual
 */
export const getTenantInfo = () => {
  if (typeof window === 'undefined') {
    return {
      tenant: 'public',
      isPublic: true,
      apiBaseUrl: TENANT_CONFIG.development.public,
      hostname: 'N/A',
      fullUrl: 'N/A',
    };
  }

  return {
    tenant: getCurrentTenant(),
    isPublic: isPublicSchema(),
    apiBaseUrl: getApiBaseUrl(),
    hostname: window.location.hostname,
    fullUrl: window.location.href,
  };
};
