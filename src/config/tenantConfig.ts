/**
 * 🏢 CONFIGURACIÓN MULTI-TENANT
 * Detecta subdominios y mapea a tenant IDs del backend
 * ✅ ACTUALIZADO: Soporte para subdominios mapeados (clinicademo1 → clinica_demo)
 */

/**
 * 🗺️ Mapeo de subdominios a tenant IDs del backend
 * Esto permite URLs amigables que se convierten a los IDs internos
 */
const SUBDOMAIN_TO_TENANT_MAP: Record<string, string> = {
  'clinicademo1': 'clinica_demo',
  'clinicaabc': 'clinica_abc',
  'clinicaxyz': 'clinica_xyz',
  // Agregar más mapeos según sea necesario
};

/**
 * 🔍 Extraer el subdominio desde el hostname actual
 * 
 * Ejemplos:
 * - clinicademo1.dentaabcxy.store → 'clinicademo1'
 * - clinicaabc.dentaabcxy.store → 'clinicaabc'
 * - www.dentaabcxy.store → null (dominio principal)
 * - dentaabcxy.store → null (dominio principal)
 * - localhost:5173 → null (desarrollo sin subdominio)
 */
function extractSubdomain(): string | null {
  // SSR/Node environment fallback
  if (typeof window === 'undefined') {
    return null;
  }
  
  const hostname = window.location.hostname;
  
  // Desarrollo local
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null; // Sin subdominio en local
  }
  
  // Producción: extraer subdominio
  const parts = hostname.split('.');
  
  // Si tiene subdominio (más de 2 partes) y no es 'www'
  if (parts.length >= 3 && parts[0] !== 'www') {
    return parts[0]; // Retorna el subdominio (ej: 'clinicademo1')
  }
  
  return null; // Dominio principal
}

/**
 * 🎯 Obtener el Tenant ID del backend desde el subdominio
 * 
 * Ejemplos:
 * - clinicademo1.dentaabcxy.store → 'clinica_demo'
 * - www.dentaabcxy.store → 'clinica_demo' (default)
 * - localhost → 'clinica_demo' (default para desarrollo)
 */
export const getTenantIdFromHostname = (): string => {
  const subdomain = extractSubdomain();
  
  // Si no hay subdominio, usar tenant por defecto
  if (!subdomain) {
    return 'clinica_demo';
  }
  
  // Buscar en el mapeo
  const tenantId = SUBDOMAIN_TO_TENANT_MAP[subdomain];
  
  if (tenantId) {
    return tenantId;
  }
  
  // Si el subdominio no está mapeado, intentar usarlo directamente
  // (útil si coincide con el tenant ID del backend)
  console.warn(`⚠️ Subdominio '${subdomain}' no está mapeado, usando como tenant ID`);
  return subdomain;
};

/**
 * 🔍 Obtener el subdominio actual (para display)
 */
export const getCurrentSubdomain = (): string => {
  return extractSubdomain() || 'www';
};

/**
 * 🔍 DEPRECADO: Usar getTenantIdFromHostname() en su lugar
 * Mantenido por compatibilidad
 */
export const getCurrentTenant = (): string => {
  return getTenantIdFromHostname();
};


/**
 * 🌐 Construir la URL base de la API
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
 * 🏷️ Obtener el nombre legible del tenant actual
 */
export const getTenantName = (): string => {
  const tenantId = getTenantIdFromHostname();
  
  const tenantNames: Record<string, string> = {
    'clinica_demo': 'Clínica Demo',
    'clinica_abc': 'Clínica ABC',
    'clinica_xyz': 'Clínica XYZ',
  };
  
  return tenantNames[tenantId] || 'Clínica Dental';
};

/**
 * 📋 Obtener información completa del tenant actual
 */
export const getTenantInfo = () => {
  if (typeof window === 'undefined') {
    return {
      tenantId: 'clinica_demo',
      subdomain: 'www',
      tenantName: 'Clínica Demo',
      apiBaseUrl: 'https://clinica-dental-backend.onrender.com',
      hostname: 'N/A',
      fullUrl: 'N/A',
    };
  }

  const tenantId = getTenantIdFromHostname();
  
  return {
    tenantId: tenantId,
    subdomain: getCurrentSubdomain(),
    tenantName: getTenantName(),
    apiBaseUrl: getApiBaseUrl(),
    hostname: window.location.hostname,
    fullUrl: window.location.href,
  };
};

/**
 * 🔄 DEPRECADO: switchTenant no soportado en producción
 * El tenant se determina automáticamente por el subdominio
 */
export const switchTenant = (newTenant: string): void => {
  console.warn('⚠️ switchTenant() está deprecado. El tenant se determina por el subdominio de la URL.');
};

/**
 * ✅ DEPRECADO: isPublicSchema no aplicable con tenant único
 */
export const isPublicSchema = (): boolean => {
  return false; // Siempre usamos un tenant específico
};

