/**
 * 🔍 STATUS CHECKER - Verificación de estado del sistema
 * Basado en: GUIA_FRONT/01a1_validators.md
 */

import api from '../config/apiConfig';
import { parseJWTPayload, getAccessToken, getRefreshToken } from './tokenHelpers';
import type { AxiosError } from 'axios';

// 📊 Resultado del estado de autenticación
interface AuthStatusResult {
  authenticated: boolean;
  reason?: string;
  needsRefresh?: boolean;
  expiresIn?: number;
  userId?: number;
}

// 🏥 Resultado del chequeo de salud del API
interface ApiHealthResult {
  healthy: boolean;
  status?: number;
  responseTime?: string;
  error?: string;
}

/**
 * 🔐 Verificar estado de autenticación
 */
export const checkAuthStatus = (): AuthStatusResult => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  
  if (!accessToken || !refreshToken) {
    return { authenticated: false, reason: 'No tokens found' };
  }
  
  const tokenInfo = parseJWTPayload(accessToken);
  if (!tokenInfo.valid) {
    return { authenticated: false, reason: 'Invalid token format' };
  }
  
  if (tokenInfo.expiresIn && tokenInfo.expiresIn <= 0) {
    return { 
      authenticated: false, 
      reason: 'Access token expired',
      needsRefresh: true 
    };
  }
  
  return {
    authenticated: true,
    expiresIn: tokenInfo.expiresIn,
    userId: tokenInfo.userId
  };
};

/**
 * 🏥 Verificar salud del API
 */
export const checkApiHealth = async (): Promise<ApiHealthResult> => {
  try {
    const startTime = Date.now();
    const response = await api.get('/api/health/', { timeout: 5000 });
    const endTime = Date.now();
    
    return {
      healthy: true,
      status: response.status,
      responseTime: `${endTime - startTime}ms`
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      healthy: false,
      error: axiosError.message,
      status: axiosError.response?.status || 0
    };
  }
};

/**
 * 📊 Obtener información completa del estado del sistema
 */
export const getSystemStatus = async () => {
  const authStatus = checkAuthStatus();
  const apiHealth = await checkApiHealth();
  
  return {
    timestamp: new Date().toISOString(),
    auth: authStatus,
    api: apiHealth,
    environment: {
      apiUrl: import.meta.env.VITE_API_URL,
      debug: import.meta.env.VITE_DEBUG === 'true',
    }
  };
};
