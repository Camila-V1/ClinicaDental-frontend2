// src/services/voiceReportService.js
import apiClient from '../config/apiConfig';

export const voiceReportService = {
  /**
   * Envía el comando de voz al backend para procesamiento
   * @param {string} texto - Texto transcrito del comando de voz
   * @returns {Promise} Respuesta con interpretación y datos
   */
  async processVoiceCommand(texto) {
    try {
      const response = await apiClient.post('/reportes/voice-query/', {
        texto: texto.trim()
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error en comando de voz:', error);
      
      return {
        success: false,
        error: error.response?.data?.error || 'Error al procesar el comando de voz'
      };
    }
  },

  /**
   * Valida que el comando de voz tenga contenido válido
   * @param {string} texto - Texto transcrito
   * @returns {object} Resultado de validación
   */
  validateCommand(texto) {
    const trimmed = texto.trim();
    
    if (!trimmed) {
      return {
        valid: false,
        error: 'El comando está vacío. Por favor, habla un comando.'
      };
    }
    
    if (trimmed.length < 5) {
      return {
        valid: false,
        error: 'El comando es muy corto. Intenta con una frase más completa.'
      };
    }
    
    // Palabras clave esperadas
    const keywords = ['cita', 'factura', 'ingreso', 'tratamiento', 'plan', 'paciente'];
    const hasKeyword = keywords.some(keyword => trimmed.toLowerCase().includes(keyword));
    
    if (!hasKeyword) {
      return {
        valid: false,
        error: 'No se reconoce el tipo de reporte. Intenta con: "citas", "facturas", "ingresos", etc.'
      };
    }
    
    return { valid: true };
  },

  /**
   * Formatea la respuesta del backend para usar en el frontend
   * @param {object} data - Respuesta del backend
   * @returns {object} Datos formateados
   */
  formatResponse(data) {
    return {
      tipo: data.tipo || 'general',
      datos: data.datos || [],
      resumen: data.resumen || {},
      interpretacion: data.interpretacion || {},
      mensaje: data.mensaje || ''
    };
  }
};
