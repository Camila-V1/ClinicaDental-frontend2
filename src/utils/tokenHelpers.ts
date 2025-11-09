/**
 * 🔧 TOKEN HELPERS - Utilidades para manejo de JWT
 * Basado en: GUIA_FRONT/01a1_axios_core_PARTE1.md
 */

import { STORAGE_KEYS } from '../config/constants';

/**
 * 🧹 Limpiar todos los tokens almacenados
 */
export const clearAuthTokens = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  console.log('🧹 Auth tokens cleared');
};

/**
 * ✅ Verificar si hay tokens válidos almacenados
 */
export const hasValidTokens = (): boolean => {
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  
  return !!(accessToken && refreshToken);
};

/**
 * 📦 Almacenar tokens de autenticación
 */
export const setAuthTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  console.log('✅ Tokens saved');
};

/**
 * 🔑 Obtener token de acceso
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * 🔄 Obtener refresh token
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * 📊 Interfaz para el payload decodificado del JWT
 */
interface JWTPayload {
  valid: boolean;
  userId?: number;
  exp?: number;
  iat?: number;
  expiresIn?: number;
  error?: string;
}

/**
 * 🔍 Parsear JWT para obtener información (sin verificar firma)
 * NOTA: Esto NO valida la firma del token, solo decodifica el payload
 */
export const parseJWTPayload = (token: string): JWTPayload => {
  try {
    // JWT tiene formato: header.payload.signature
    const payload = token.split('.')[1];
    
    if (!payload) {
      return { valid: false, error: 'Invalid token format' };
    }

    // Decodificar base64
    const decoded = JSON.parse(atob(payload));
    
    const now = Math.floor(Date.now() / 1000);
    
    return {
      valid: true,
      userId: decoded.user_id,
      exp: decoded.exp,
      iat: decoded.iat,
      expiresIn: decoded.exp - now,
    };
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * ⏰ Verificar si el token está próximo a expirar
 * @param token - Token JWT a verificar
 * @param minutesBeforeExpire - Minutos antes de la expiración (default: 2)
 */
export const isTokenExpiringSoon = (token: string, minutesBeforeExpire = 2): boolean => {
  const payload = parseJWTPayload(token);
  
  if (!payload.valid || !payload.expiresIn) {
    return true; // Considerar como expirando si no es válido
  }

  const secondsBeforeExpire = minutesBeforeExpire * 60;
  return payload.expiresIn <= secondsBeforeExpire;
};

/**
 * ❌ Verificar si el token ha expirado
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = parseJWTPayload(token);
  
  if (!payload.valid || !payload.expiresIn) {
    return true;
  }

  return payload.expiresIn <= 0;
};

/**
 * 📋 Obtener información completa de los tokens almacenados
 */
export const getTokensInfo = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  
  return {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    accessTokenInfo: accessToken ? parseJWTPayload(accessToken) : null,
    refreshTokenInfo: refreshToken ? parseJWTPayload(refreshToken) : null,
  };
};

/**
 * 🔐 Guardar datos de usuario
 */
export const setUserData = (userData: unknown): void => {
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
};

/**
 * 👤 Obtener datos de usuario
 */
export const getUserData = <T = unknown>(): T | null => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData) as T;
  } catch {
    return null;
  }
};
