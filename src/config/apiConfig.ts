/**
 * ⚙️ CONFIGURACIÓN DE AXIOS - CON SOPORTE MULTI-TENANT
 * Detecta automáticamente el tenant desde el subdominio
 * CORREGIDO: baseURL se establece dinámicamente en cada request
 */

import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getApiBaseUrl } from './tenantConfig';
import { STORAGE_KEYS, DEBUG } from './constants';

/**
 * 🌐 Crear instancia de Axios SIN baseURL fijo
 * La URL se establece dinámicamente en el interceptor
 */
const api: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * 📤 INTERCEPTOR REQUEST: Añadir JWT, Tenant ID y establecer baseURL dinámicamente
 * Se ejecuta antes de cada petición
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // ⚠️ CRÍTICO: Establecer baseURL dinámicamente para cada request
    if (typeof window !== 'undefined') {
      config.baseURL = getApiBaseUrl();
    }

    // 1️⃣ Agregar token de autenticación
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2️⃣ ⭐ NUEVO: Agregar Tenant ID desde el subdominio
    if (typeof window !== 'undefined') {
      const { getTenantIdFromHostname } = require('./tenantConfig');
      const tenantId = getTenantIdFromHostname();
      
      if (config.headers) {
        config.headers['X-Tenant-ID'] = tenantId;
      }
    }

    // ✅ Log DETALLADO de cada request
    console.log('🚀 [API REQUEST] ==================');
    console.log('  Method:', config.method?.toUpperCase());
    console.log('  BaseURL:', config.baseURL);
    console.log('  URL:', config.url);
    console.log('  Full URL:', `${config.baseURL}${config.url}`);
    console.log('  Headers:', {
      'Content-Type': config.headers?.['Content-Type'],
      'Authorization': config.headers?.Authorization ? 'Bearer ***' : 'none',
      'X-Tenant-ID': config.headers?.['X-Tenant-ID'],
    });
    console.log('  Params:', config.params);
    console.log('  Data:', config.data);
    console.log('====================================');

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ [API REQUEST ERROR]:', error);
    return Promise.reject(error);
  }
);

/**
 * 📥 INTERCEPTOR RESPONSE: Auto-refresh de tokens JWT
 * Basado en: GUIA_FRONT/01a1_axios_core_PARTE2.md
 */
api.interceptors.response.use(
  (response) => {
    // ✅ Log DETALLADO de cada response exitosa
    console.log('✅ [API RESPONSE] ==================');
    console.log('  Status:', response.status, response.statusText);
    console.log('  URL:', response.config.url);
    console.log('  Data:', response.data);
    console.log('  Headers:', response.headers);
    console.log('====================================');
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // ❌ Log DETALLADO de errores
    console.error('❌ [API RESPONSE ERROR] ==================');
    console.error('  Status:', error.response?.status);
    console.error('  Status Text:', error.response?.statusText);
    console.error('  URL:', originalRequest?.url);
    console.error('  Full URL:', `${originalRequest?.baseURL}${originalRequest?.url}`);
    console.error('  Method:', originalRequest?.method?.toUpperCase());
    console.error('  Message:', error.message);
    console.error('  Response Data:', error.response?.data);
    console.error('  Response Headers:', error.response?.headers);
    console.error('  Request Headers:', originalRequest?.headers);
    console.error('==========================================');

    // 🔄 Manejo automático de 401 Unauthorized (token expirado)
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (refreshToken) {
        originalRequest._retry = true; // Prevenir loops infinitos

        try {
          if (DEBUG) {
            console.log('🔄 Token expirado, intentando refresh...');
          }

          // Usar axios directamente (sin interceptor) para evitar loops
          const refreshResponse = await axios.post(
            `${getApiBaseUrl()}/api/token/refresh/`,
            { refresh: refreshToken }
          );

          // Guardar nuevo access token
          const newAccessToken = refreshResponse.data.access;
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);

          if (DEBUG) {
            console.log('✅ Token refrescado exitosamente');
          }

          // Actualizar header del request original y reintentar
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api.request(originalRequest);

        } catch (refreshError) {
          // Refresh token también expiró, hacer logout
          console.warn('⚠️ Refresh token expirado, cerrando sesión...');
          localStorage.clear();

          // Redirigir al login (si existe window)
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }

          return Promise.reject(refreshError);
        }
      } else {
        // No hay refresh token disponible
        console.warn('⚠️ No hay refresh token, cerrando sesión...');
        localStorage.clear();

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

/**
 * 🔍 Obtener información de configuración actual
 */
export const getApiConfig = () => ({
  baseURL: typeof window !== 'undefined' ? getApiBaseUrl() : 'N/A', // URL dinámica según tenant
  timeout: 10000,
  hasAccessToken: !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  hasRefreshToken: !!localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  debug: DEBUG,
});

/**
 * 🧪 Verificar conectividad con el backend
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${getApiBaseUrl()}/api/health/`, {
      timeout: 5000,
    });
    return response.status === 200;
  } catch (error) {
    console.error('❌ Backend no disponible:', error);
    return false;
  }
};

// Exportar instancia principal
export default api;
