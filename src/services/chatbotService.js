// src/services/chatbotService.js
import apiClient from '../config/apiConfig';

export const chatbotService = {
  /**
   * Envía un mensaje al chatbot
   * @param {string} texto - Mensaje del usuario
   * @param {boolean} esVoz - Si viene de reconocimiento de voz
   */
  async enviarMensaje(texto, esVoz = false) {
    try {
      const response = await apiClient.post('/api/chatbot/query/', {
        texto: texto.trim(),
        es_voz: esVoz
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error en chatbot:', error);
      
      return {
        success: false,
        error: error.response?.data?.error || 'Error al procesar tu mensaje'
      };
    }
  },

  /**
   * Comandos sugeridos para mostrar al usuario
   */
  getComandosSugeridos() {
    return [
      { texto: 'Ver mis citas', icono: '📅' },
      { texto: 'Próxima cita', icono: '📆' },
      { texto: 'Mis tratamientos', icono: '🦷' },
      { texto: 'Cuánto debo', icono: '💰' },
      { texto: 'Ver mis pagos', icono: '📋' },
      { texto: 'Ayuda', icono: '💡' }
    ];
  }
};
