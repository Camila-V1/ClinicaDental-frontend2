/**
 * 🔧 CONSTANTES GLOBALES DEL SISTEMA
 * Clínica Dental - Frontend
 */

// 🌐 URLs del API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  PUBLIC_URL: import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:8000/public',
  TENANT_URL: import.meta.env.VITE_TENANT_API_URL || 'http://localhost:8000/api',
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  BASE_DOMAIN: import.meta.env.VITE_BASE_DOMAIN || 'localhost',
} as const;

// 🔐 Endpoints de Autenticación
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/token/',
  REGISTER: '/api/usuarios/register/',
  REFRESH: '/api/token/refresh/',
  PROFILE: '/api/usuarios/me/',
  LOGOUT: '/api/logout/',
} as const;

// 👥 Endpoints de Usuarios
export const USUARIOS_ENDPOINTS = {
  BASE: '/api/usuarios/',
  ME: '/api/usuarios/me/',
  DOCTORES: '/api/usuarios/doctores/',
  PACIENTES: '/api/usuarios/pacientes/',
  PERFIL: (id: number) => `/api/usuarios/${id}/`,
} as const;

// 📅 Endpoints de Agenda
export const AGENDA_ENDPOINTS = {
  CITAS: '/api/agenda/citas/',
  CITA_DETAIL: (id: number) => `/api/agenda/citas/${id}/`,
  DISPONIBILIDAD: '/api/agenda/disponibilidad/',
} as const;

// 🦷 Endpoints de Tratamientos
export const TRATAMIENTOS_ENDPOINTS = {
  SERVICIOS: '/api/tratamientos/servicios/',
  PLANES: '/api/tratamientos/planes/',
  PRESUPUESTOS: '/api/tratamientos/presupuestos/',
} as const;

// 📋 Endpoints de Historial Clínico
export const HISTORIAL_ENDPOINTS = {
  BASE: '/api/historial-clinico/historiales/',
  EPISODIOS: '/api/historial-clinico/episodios/',
  ODONTOGRAMA: (historialId: number) => `/api/historial-clinico/historiales/${historialId}/odontograma/`,
} as const;

// 💰 Endpoints de Facturación
export const FACTURACION_ENDPOINTS = {
  FACTURAS: '/api/facturacion/facturas/',
  PAGOS: '/api/facturacion/pagos/',
  ESTADO_CUENTA: (pacienteId: number) => `/api/facturacion/estado-cuenta/${pacienteId}/`,
} as const;

// 📦 Endpoints de Inventario
export const INVENTARIO_ENDPOINTS = {
  CATEGORIAS: '/api/inventario/categorias/',
  INSUMOS: '/api/inventario/insumos/',
  MOVIMIENTOS: '/api/inventario/movimientos/',
} as const;

// 📊 Endpoints de Reportes
export const REPORTES_ENDPOINTS = {
  DASHBOARD: '/api/reportes/dashboard/',
  INGRESOS: '/api/reportes/ingresos/',
  CITAS: '/api/reportes/citas/',
  PACIENTES: '/api/reportes/pacientes/',
} as const;

// 🔑 Keys para LocalStorage
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'user',
  TENANT: 'currentTenant',
} as const;

// ⏱️ Configuración de Tokens JWT
export const JWT_CONFIG = {
  ACCESS_TOKEN_LIFETIME: 15 * 60, // 15 minutos en segundos
  REFRESH_TOKEN_LIFETIME: 24 * 60 * 60, // 1 día en segundos
  REFRESH_BEFORE_EXPIRE: 2 * 60, // Refrescar 2 minutos antes de expirar
} as const;

// 👤 Tipos de Usuario
export const USER_TYPES = {
  ADMIN: 'ADMIN',
  ODONTOLOGO: 'ODONTOLOGO',
  PACIENTE: 'PACIENTE',
} as const;

// 📅 Estados de Cita
export const CITA_ESTADOS = {
  PENDIENTE: 'pendiente',
  CONFIRMADA: 'confirmada',
  EN_CURSO: 'en_curso',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada',
  NO_ASISTIO: 'no_asistio',
} as const;

// 💰 Estados de Factura
export const FACTURA_ESTADOS = {
  PENDIENTE: 'pendiente',
  PAGADA: 'pagada',
  PARCIAL: 'parcial',
  VENCIDA: 'vencida',
  ANULADA: 'anulada',
} as const;

// 🎨 Colores para Estados (para UI)
export const ESTADO_COLORS = {
  pendiente: '#FFA500',
  confirmada: '#00BFFF',
  en_curso: '#9370DB',
  completada: '#32CD32',
  cancelada: '#DC143C',
  no_asistio: '#696969',
  pagada: '#32CD32',
  parcial: '#FFA500',
  vencida: '#DC143C',
  anulada: '#696969',
} as const;

// 📄 Paginación por defecto
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// 🔔 Mensajes del Sistema
export const MESSAGES = {
  SUCCESS: {
    LOGIN: '¡Inicio de sesión exitoso!',
    REGISTER: '¡Registro exitoso! Bienvenido/a',
    SAVE: 'Guardado exitosamente',
    DELETE: 'Eliminado exitosamente',
    UPDATE: 'Actualizado exitosamente',
  },
  ERROR: {
    GENERIC: 'Ocurrió un error. Por favor, intenta nuevamente.',
    NETWORK: 'Error de conexión. Verifica tu internet.',
    AUTH: 'Error de autenticación. Inicia sesión nuevamente.',
    NOT_FOUND: 'Recurso no encontrado.',
    FORBIDDEN: 'No tienes permisos para esta acción.',
    VALIDATION: 'Error de validación. Revisa los datos ingresados.',
  },
  LOADING: {
    GENERIC: 'Cargando...',
    AUTH: 'Autenticando...',
    SAVING: 'Guardando...',
  },
} as const;

// 🌍 Configuración Regional
export const LOCALE_CONFIG = {
  LANGUAGE: 'es-ES',
  CURRENCY: 'BOB', // Bolivianos
  DATE_FORMAT: 'DD/MM/YYYY',
  TIME_FORMAT: 'HH:mm',
  DATETIME_FORMAT: 'DD/MM/YYYY HH:mm',
} as const;

// 🐛 Debug Mode
export const DEBUG = import.meta.env.VITE_DEBUG === 'true';
