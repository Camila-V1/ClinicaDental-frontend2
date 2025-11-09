/**
 * 🪝 HOOK useAuth - Hook personalizado de autenticación
 * Basado en: GUIA_FRONT/01b_auth_service.md
 */

import { useState, useEffect } from 'react';
import authService from '../services/authService';
import type { User, LoginCredentials, RegisterData } from '../types/auth.types';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearError: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inicializar autenticación al montar el componente
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const result = await authService.getProfile();
          if (result.success && result.data) {
            setUser(result.data);
            setIsAuthenticated(true);
          } else {
            authService.logout();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * 🔑 Login
   */
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    const result = await authService.login(credentials);
    
    if (result.success && result.data) {
      setUser(result.data.user);
      setIsAuthenticated(true);
      setIsLoading(false);
      return { success: true };
    } else {
      setError(result.error || 'Error al iniciar sesión');
      setIsLoading(false);
      return { success: false, error: result.error };
    }
  };

  /**
   * 📝 Register
   */
  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    const result = await authService.register(userData);
    
    if (!result.success) {
      setError(result.error || 'Error al registrar usuario');
    }
    
    setIsLoading(false);
    return { success: result.success, error: result.error };
  };

  /**
   * 🚪 Logout
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * 🧹 Limpiar error
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * 🎭 Verificar rol
   */
  const hasRole = (role: string): boolean => {
    return authService.hasRole(role);
  };

  /**
   * 🔑 Verificar permiso
   */
  const hasPermission = (permission: string): boolean => {
    return authService.hasPermission(permission);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    hasRole,
    hasPermission,
  };
};
