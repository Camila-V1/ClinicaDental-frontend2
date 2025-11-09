/**
 * 🔐 AUTH SERVICE - Servicio de Autenticación
 * Basado en: GUIA_FRONT/01b_auth_service.md
 */

import api from '../config/apiConfig';
import { AUTH_ENDPOINTS } from '../config/constants';
import { setAuthTokens, clearAuthTokens, getUserData, setUserData, parseJWTPayload } from '../utils/tokenHelpers';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth.types';

// 📊 Resultado genérico de operaciones
interface ServiceResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

class AuthService {
  /**
   * 🔑 Login: email + password → JWT tokens
   */
  async login(credentials: LoginCredentials): Promise<ServiceResult<AuthResponse>> {
    try {
      console.log('🔑 authService: Paso 1 - Obteniendo tokens...');
      
      // PASO 1: Obtener tokens JWT
      const tokenResponse = await api.post<{ access: string; refresh: string }>(
        AUTH_ENDPOINTS.LOGIN, 
        credentials
      );
      
      if (tokenResponse.status === 200) {
        const { access, refresh } = tokenResponse.data;
        console.log('✅ authService: Tokens recibidos');
        
        // Guardar tokens PRIMERO
        setAuthTokens(access, refresh);
        
        console.log('🔑 authService: Paso 2 - Obteniendo datos del usuario...');
        
        // PASO 2: Obtener datos del usuario usando el token
        try {
          const userResponse = await api.get<User>(AUTH_ENDPOINTS.PROFILE);
          
          if (userResponse.status === 200) {
            console.log('✅ authService: Usuario obtenido:', userResponse.data.email);
            
            // Guardar usuario en localStorage
            setUserData(userResponse.data);
            
            // Retornar en formato AuthResponse
            return { 
              success: true, 
              data: {
                access,
                refresh,
                user: userResponse.data
              },
              status: tokenResponse.status
            };
          }
        } catch (userError) {
          console.error('❌ authService: Error al obtener usuario:', userError);
          // Si falla obtener el usuario, limpiar tokens
          clearAuthTokens();
          return {
            success: false,
            error: 'Error al obtener datos del usuario',
            status: 500
          };
        }
      }
      
      return {
        success: false,
        error: 'Login failed',
        status: tokenResponse.status
      };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string }; status?: number }; message?: string };
      console.error('❌ authService: Error en login:', err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.detail || err.message || 'Error al iniciar sesión',
        status: err.response?.status
      };
    }
  }

  /**
   * 📝 Registro: crear nuevo usuario
   */
  async register(userData: RegisterData): Promise<ServiceResult<User>> {
    try {
      const response = await api.post<User>(AUTH_ENDPOINTS.REGISTER, userData);
      
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string; email?: string[] }; status?: number }; message?: string };
      
      // Manejar errores específicos de validación
      const errorData = err.response?.data;
      let errorMessage = 'Error al registrar usuario';
      
      if (typeof errorData === 'object' && errorData !== null) {
        if ('email' in errorData) {
          errorMessage = Array.isArray(errorData.email) ? errorData.email[0] : 'Email inválido';
        } else if ('detail' in errorData) {
          errorMessage = String(errorData.detail);
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      return {
        success: false,
        error: errorMessage,
        status: err.response?.status
      };
    }
  }

  /**
   * 👤 Obtener perfil del usuario actual
   */
  async getProfile(): Promise<ServiceResult<User>> {
    try {
      const response = await api.get<User>(AUTH_ENDPOINTS.PROFILE);
      
      // Actualizar usuario en localStorage
      if (response.status === 200) {
        setUserData(response.data);
      }
      
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error: unknown) {
      const err = error as { response?: { status?: number }; message?: string };
      return {
        success: false,
        error: err.message || 'Error al obtener perfil',
        status: err.response?.status
      };
    }
  }

  /**
   * ✏️ Actualizar perfil del usuario
   */
  async updateProfile(userData: Partial<User>): Promise<ServiceResult<User>> {
    try {
      const response = await api.patch<User>(AUTH_ENDPOINTS.PROFILE, userData);
      
      // Actualizar usuario en localStorage
      if (response.status === 200) {
        setUserData(response.data);
      }
      
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error: unknown) {
      const err = error as { response?: { status?: number }; message?: string };
      return {
        success: false,
        error: err.message || 'Error al actualizar perfil',
        status: err.response?.status
      };
    }
  }

  /**
   * 🔒 Cambiar contraseña
   */
  async changePassword(passwordData: { old_password: string; new_password: string }): Promise<ServiceResult> {
    try {
      const response = await api.post('/api/usuarios/change-password/', passwordData);
      
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string }; status?: number }; message?: string };
      return {
        success: false,
        error: err.response?.data?.detail || err.message || 'Error al cambiar contraseña',
        status: err.response?.status
      };
    }
  }

  /**
   * 🚪 Logout: limpiar localStorage y redirigir
   */
  logout(): void {
    clearAuthTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  /**
   * ✅ Verificar si está autenticado
   */
  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    return !!user && !this.isTokenExpired();
  }

  /**
   * 👤 Obtener usuario actual desde localStorage
   */
  getCurrentUser(): User | null {
    return getUserData<User>();
  }

  /**
   * ⏰ Validar si el token está expirado
   */
  isTokenExpired(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) return true;
    
    const payload = parseJWTPayload(token);
    if (!payload.valid || !payload.expiresIn) return true;
    
    return payload.expiresIn <= 0;
  }

  /**
   * ⏱️ Obtener tiempo restante del token (en segundos)
   */
  getTokenExpiryTime(): number {
    const token = localStorage.getItem('accessToken');
    if (!token) return 0;
    
    const payload = parseJWTPayload(token);
    return payload.expiresIn || 0;
  }

  /**
   * 🎭 Verificar rol del usuario
   */
  hasRole(requiredRole: string): boolean {
    const user = this.getCurrentUser();
    return user?.tipo_usuario === requiredRole;
  }

  /**
   * 🎭 Verificar si tiene alguno de los roles especificados
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    return roles.includes(user.tipo_usuario);
  }

  /**
   * 🔑 Obtener permisos basados en el tipo de usuario
   */
  getPermissions(): string[] {
    const user = this.getCurrentUser();
    if (!user) return [];

    switch (user.tipo_usuario) {
      case 'admin':
        return ['all'];
      case 'doctor':
        return ['view_patients', 'edit_patients', 'view_appointments', 'edit_appointments', 'view_treatments'];
      case 'paciente':
        return ['view_own_appointments', 'view_own_treatments'];
      default:
        return [];
    }
  }

  /**
   * 🔓 Verificar si tiene un permiso específico
   */
  hasPermission(permission: string): boolean {
    const permissions = this.getPermissions();
    return permissions.includes('all') || permissions.includes(permission);
  }
}

// Exportar instancia única (Singleton)
export default new AuthService();
