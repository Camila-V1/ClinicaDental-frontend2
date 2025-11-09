/**
 * 🪝 HOOKS ADICIONALES DE AUTENTICACIÓN
 * Basado en: GUIA_FRONT/01b_auth_service.md
 */

import { useMemo, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import type { TipoUsuario } from '../types/auth.types';

/**
 * 🔑 Hook para verificar permisos basados en tipo de usuario
 */
export const usePermissions = (userType?: TipoUsuario) => {
  return useMemo(() => {
    if (!userType) {
      return {
        isAdmin: false,
        isDoctor: false,
        isPaciente: false,
        isStaff: false,
        canManageUsers: false,
        canViewAllPatients: false,
        canManageAppointments: false,
        canViewReports: false,
        canManageInventory: false,
      };
    }
    
    return {
      isAdmin: userType === 'admin',
      isDoctor: userType === 'doctor',
      isPaciente: userType === 'paciente',
      isStaff: ['admin', 'doctor'].includes(userType),
      canManageUsers: userType === 'admin',
      canViewAllPatients: ['admin', 'doctor'].includes(userType),
      canManageAppointments: ['admin', 'doctor'].includes(userType),
      canViewReports: ['admin', 'doctor'].includes(userType),
      canManageInventory: ['admin', 'doctor'].includes(userType),
    };
  }, [userType]);
};

/**
 * ⏰ Hook para monitorear expiración de token
 */
export const useTokenMonitor = () => {
  const checkTokenExpiry = useCallback(() => {
    if (!authService.isAuthenticated()) return;
    
    const timeLeft = authService.getTokenExpiryTime();
    
    // Si quedan menos de 1 minuto, forzar logout
    if (timeLeft > 0 && timeLeft < 60) {
      console.log('⚠️ Token próximo a expirar, cerrando sesión...');
      authService.logout();
    }
  }, []);

  useEffect(() => {
    // Verificar cada 30 segundos
    const interval = setInterval(checkTokenExpiry, 30000);
    
    // Verificación inmediata al montar
    checkTokenExpiry();
    
    return () => clearInterval(interval);
  }, [checkTokenExpiry]);
};

/**
 * 🎭 Hook para validar roles requeridos
 */
export const useRoleValidation = (requiredRoles: TipoUsuario[] = []) => {
  const user = authService.getCurrentUser();
  
  return useMemo(() => {
    if (!user || !requiredRoles.length) return false;
    return requiredRoles.includes(user.tipo_usuario);
  }, [user, requiredRoles]);
};

/**
 * 👤 Hook para obtener usuario actual
 */
export const useCurrentUser = () => {
  return useMemo(() => {
    return authService.getCurrentUser();
  }, []);
};

/**
 * 🔓 Hook para verificar permisos específicos
 */
export const useHasPermission = (permission: string) => {
  return useMemo(() => {
    return authService.hasPermission(permission);
  }, [permission]);
};
