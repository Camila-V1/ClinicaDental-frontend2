/**
 * 🏥 Servicio de Registro con Pago Automático
 * Guía 46: Sistema de registro de clínicas con pago
 */

import api from '../config/apiConfig';

export interface DatosRegistro {
  nombre_clinica: string;
  dominio_deseado: string;
  nombre_contacto: string;
  email: string;
  telefono: string;
  cargo?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  plan_solicitado: number;
  mensaje?: string;
}

export interface RespuestaCreacion {
  solicitud_id: number;
  token: string;
  siguiente_paso: string;
  message: string;
  datos: any;
}

export interface RespuestaIniciarPago {
  payment_url: string;
  payment_id: string;
  solicitud_id: number;
  message: string;
}

export interface RespuestaConfirmarPago {
  solicitud_id: number;
  clinica_id: number;
  clinica_nombre: string;
  dominio: string;
  download_url: string;
  token: string;
  message: string;
  credenciales_nota?: string;
}

export interface EstadoSolicitud {
  solicitud_id: number;
  estado: string;
  estado_display: string;
  pago_exitoso: boolean;
  fecha_pago?: string;
  clinica_nombre?: string;
  dominio?: string;
  credenciales_disponibles: boolean;
  token_valido: boolean;
  token?: string;
}

const registroService = {
  // Listar planes disponibles
  obtenerPlanes: async () => {
    const response = await api.get('/api/tenants/planes/');
    return response.data;
  },

  // Crear solicitud de registro
  crearSolicitud: async (datos: DatosRegistro): Promise<RespuestaCreacion> => {
    const response = await api.post('/api/tenants/solicitudes/', datos);
    return response.data;
  },

  // Iniciar proceso de pago
  iniciarPago: async (
    solicitudId: number,
    metodoPago: 'STRIPE' | 'PAYPAL' | 'MERCADOPAGO',
    returnUrl: string,
    cancelUrl: string
  ): Promise<RespuestaIniciarPago> => {
    const response = await api.post(
      `/api/tenants/solicitudes/${solicitudId}/iniciar_pago/`,
      {
        metodo_pago: metodoPago,
        return_url: returnUrl,
        cancel_url: cancelUrl,
      }
    );
    return response.data;
  },

  // Confirmar pago (callback)
  confirmarPago: async (solicitudId: number, sessionId?: string): Promise<RespuestaConfirmarPago> => {
    const params = sessionId ? `?session_id=${sessionId}` : '';
    const response = await api.post(
      `/api/tenants/solicitudes/${solicitudId}/confirmar_pago/${params}`
    );
    return response.data;
  },

  // Verificar estado
  verificarEstado: async (solicitudId: number): Promise<EstadoSolicitud> => {
    const response = await api.get(
      `/api/tenants/solicitudes/${solicitudId}/verificar_estado/`
    );
    return response.data;
  },

  // Descargar credenciales (retorna blob para descarga directa)
  descargarCredenciales: async (solicitudId: number, token: string): Promise<Blob> => {
    const response = await api.get(
      `/api/tenants/solicitudes/${solicitudId}/descargar_credenciales/?token=${token}`,
      { responseType: 'blob' }
    );
    return response.data;
  },
};

export default registroService;
