/**
 * 🔍 VALIDADORES DE CONFIGURACIÓN
 * Basado en: GUIA_FRONT/01a1_validators.md
 */

import api from '../config/apiConfig';
import type { AxiosError } from 'axios';

// 📋 Resultado de validación de variables de entorno
interface EnvValidationResult {
  valid: boolean;
  missing: string[];
}

// 🌐 Resultado de test de conexión
interface ConnectionTestResult {
  connected: boolean;
  status: number;
  message: string;
}

// 🎫 Estructura de respuesta JWT del backend
interface JWTResponseData {
  access?: string;
  refresh?: string;
  user?: {
    id: number;
    email: string;
    tipo_usuario: string;
    [key: string]: unknown;
  };
}

// 📊 Resultado de validación de respuesta JWT
interface JWTValidationResult {
  valid: boolean;
  details: {
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    hasUserData: boolean;
    userType: string;
  };
}

// 🔑 Resultado de validación de token
interface TokenValidationResult {
  valid: boolean;
  error?: string;
  isExpired?: boolean;
  expiresIn?: number;
  userId?: number;
}

/**
 * ✅ Verificar que las variables de entorno estén configuradas
 */
export const validateEnvVars = (): EnvValidationResult => {
  const requiredVars = ['VITE_API_URL'];
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing);
    return { valid: false, missing };
  }
  
  console.log('✅ Environment variables configured correctly');
  return { valid: true, missing: [] };
};

/**
 * 🌐 Test básico de conectividad con el backend
 */
export const testApiConnection = async (): Promise<ConnectionTestResult> => {
  try {
    // Intentar hacer una petición simple al backend
    // Nota: Ajustar endpoint según disponibilidad en el backend
    const response = await api.get('/api/health/', {
      timeout: 5000,
      validateStatus: (status) => status >= 200 && status < 500
    });
    
    return { 
      connected: true, 
      status: response.status,
      message: 'Backend is reachable'
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    return { 
      connected: false, 
      status: axiosError.response?.status || 0,
      message: axiosError.message || 'Backend unreachable'
    };
  }
};

/**
 * 🎫 Verificar estructura de respuesta JWT del backend
 */
export const validateJWTResponse = (responseData: JWTResponseData): JWTValidationResult => {
  const hasAccess = responseData && typeof responseData.access === 'string';
  const hasRefresh = responseData && typeof responseData.refresh === 'string';
  const hasUser = responseData && typeof responseData.user === 'object';
  
  return {
    valid: hasAccess && hasRefresh && hasUser,
    details: {
      hasAccessToken: hasAccess,
      hasRefreshToken: hasRefresh,
      hasUserData: hasUser,
      userType: responseData.user?.tipo_usuario || 'unknown'
    }
  };
};

/**
 * 🔑 Validar formato de token JWT
 */
export const validateTokenFormat = (token: string): TokenValidationResult => {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Token must be a string' };
  }
  
  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'JWT must have 3 parts' };
  }
  
  try {
    // Intentar decodificar el payload
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    return {
      valid: true,
      isExpired: payload.exp < now,
      expiresIn: payload.exp - now,
      userId: payload.user_id
    };
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'Invalid JWT format'
    };
  }
};
