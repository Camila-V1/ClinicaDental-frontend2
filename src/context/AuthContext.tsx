/**
 * 🌐 AUTH CONTEXT - Contexto de Autenticación Global
 * Basado en: GUIA_FRONT/01c_context_auth.md
 */

import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import authService from '../services/authService';
import type { User, LoginCredentials, RegisterData } from '../types/auth.types';

// 📊 Estado de autenticación
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// 🎬 Acciones del reducer
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

// 🎯 Tipo del contexto
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: () => Promise<{ success: boolean; error?: string }>;
  hasRole: (requiredRole: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  userType: string | null;
  userName: string | null;
  userEmail: string | null;
}

// Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Estado inicial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// Reducer para manejar acciones
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
      
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
      
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
      
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
      
    default:
      return state;
  }
}

// 🎁 Provider del contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Inicializar autenticación al cargar la app
  useEffect(() => {
    const initAuth = async () => {
      console.log('🔄 AuthContext: Inicializando autenticación...');
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (authService.isAuthenticated()) {
        console.log('✅ AuthContext: Usuario está autenticado, verificando token...');
        
        // Verificar si el token está expirado
        if (authService.isTokenExpired()) {
          console.log('⚠️ AuthContext: Token expirado, cerrando sesión...');
          authService.logout();
          dispatch({ type: 'LOGOUT' });
          return;
        }

        console.log('🔍 AuthContext: Obteniendo perfil del usuario...');
        // Obtener perfil del usuario
        const result = await authService.getProfile();
        if (result.success && result.data) {
          console.log('✅ AuthContext: Perfil obtenido exitosamente:', result.data.email);
          dispatch({ type: 'LOGIN_SUCCESS', payload: result.data });
        } else {
          console.error('❌ AuthContext: Error al obtener perfil:', result.error);
          authService.logout();
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        console.log('ℹ️ AuthContext: Usuario no autenticado');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();
  }, []);

  // 🔑 Función de login
  const login = async (credentials: LoginCredentials) => {
    console.log('🔑 AuthContext: Iniciando login...');
    dispatch({ type: 'SET_LOADING', payload: true });
    
    const result = await authService.login(credentials);
    
    if (result.success && result.data) {
      console.log('✅ AuthContext: Login exitoso, guardando usuario:', result.data.user.email);
      dispatch({ type: 'LOGIN_SUCCESS', payload: result.data.user });
      return { success: true };
    } else {
      console.error('❌ AuthContext: Error en login:', result.error);
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: result.error };
    }
  };

  // 📝 Función de registro
  const register = async (userData: RegisterData) => {
    const result = await authService.register(userData);
    return { success: result.success, error: result.error };
  };

  // 🚪 Función de logout
  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  // 👤 Función para actualizar perfil
  const updateProfile = async () => {
    const result = await authService.getProfile();
    if (result.success && result.data) {
      dispatch({ type: 'UPDATE_USER', payload: result.data });
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  // 🎭 Verificar rol del usuario
  const hasRole = (requiredRole: string): boolean => {
    return state.user?.tipo_usuario === requiredRole;
  };

  // 🎭 Verificar si tiene alguno de los roles
  const hasAnyRole = (roles: string[]): boolean => {
    if (!state.user) return false;
    return roles.includes(state.user.tipo_usuario);
  };

  // Valor del contexto
  const contextValue: AuthContextType = {
    // Estado
    ...state,
    
    // Acciones
    login,
    register,
    logout,
    updateProfile,
    
    // Utilidades
    hasRole,
    hasAnyRole,
    
    // Info del usuario
    userType: state.user?.tipo_usuario || null,
    userName: state.user ? `${state.user.nombre} ${state.user.apellido}` : null,
    userEmail: state.user?.email || null,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// 🪝 Hook para usar el contexto
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthContext debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};

// 🎭 Hook para verificar roles específicos
export const useRoleCheck = () => {
  const { hasRole, hasAnyRole, userType } = useAuthContext();
  
  return {
    isAdmin: hasRole('admin'),
    isDoctor: hasRole('doctor'),
    isPaciente: hasRole('paciente'),
    isRecepcionista: hasRole('recepcionista'),
    
    isStaff: hasAnyRole(['admin', 'doctor', 'recepcionista']),
    canManageUsers: hasAnyRole(['admin']),
    canManageCitas: hasAnyRole(['admin', 'doctor', 'recepcionista']),
    canViewReports: hasAnyRole(['admin', 'doctor']),
    
    userType,
  };
};
