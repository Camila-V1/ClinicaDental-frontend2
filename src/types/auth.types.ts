/**
 * 📝 TIPOS DE AUTENTICACIÓN
 * Interfaces y types para el sistema de autenticación
 */

// 👤 Tipos de Usuario
export type TipoUsuario = 'ADMIN' | 'ODONTOLOGO' | 'PACIENTE' | 'admin' | 'doctor' | 'paciente' | 'odontologo';

// 🔐 Credenciales de Login
export interface LoginCredentials {
  email: string;
  password: string;
}

// 📝 Datos de Registro
export interface RegisterData {
  email: string;
  password: string;
  password_confirm?: string;
  first_name: string;
  last_name: string;
  tipo_usuario: TipoUsuario;
}

// 🎫 Respuesta de Autenticación del Backend
export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

// 👤 Usuario
export interface User {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  first_name: string;
  last_name: string;
  ci?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  tipo_usuario: TipoUsuario;
  is_active: boolean;
  fecha_registro?: string;
  ultimo_acceso?: string;
  avatar?: string;
}

// 🔄 Respuesta de Refresh Token
export interface RefreshTokenResponse {
  access: string;
}

// ✅ Estado de Autenticación
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

// 📊 JWT Payload Decodificado
export interface JWTPayload {
  user_id: number;
  exp: number;
  iat: number;
  token_type?: string;
}

// 🎯 Contexto de Autenticación
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
}
