// src/hooks/useChatbot.js
import { useState, useEffect, useRef } from 'react';
import { chatbotService } from '../services/chatbotService';

export const useChatbot = () => {
  const [mensajes, setMensajes] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Cargar historial del localStorage
  useEffect(() => {
    const historial = localStorage.getItem('chatbot_historial');
    if (historial) {
      try {
        setMensajes(JSON.parse(historial));
      } catch (error) {
        console.error('Error cargando historial:', error);
      }
    } else {
      // Mensaje de bienvenida
      setMensajes([{
        id: Date.now(),
        tipo: 'bot',
        contenido: '👋 ¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date(),
        sugerencias: ['Ver mis citas', 'Próxima cita', 'Ayuda']
      }]);
    }
  }, []);

  // Guardar historial en localStorage
  useEffect(() => {
    if (mensajes.length > 0) {
      localStorage.setItem('chatbot_historial', JSON.stringify(mensajes));
    }
  }, [mensajes]);

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  /**
   * Envía un mensaje al chatbot
   */
  const enviarMensaje = async (texto, esVoz = false) => {
    if (!texto.trim()) return;

    // Agregar mensaje del usuario
    const mensajeUsuario = {
      id: Date.now(),
      tipo: 'usuario',
      contenido: texto,
      timestamp: new Date(),
      esVoz
    };
    setMensajes(prev => [...prev, mensajeUsuario]);

    // Mostrar indicador de "escribiendo..."
    setIsTyping(true);

    try {
      // Enviar al backend
      const resultado = await chatbotService.enviarMensaje(texto, esVoz);

      if (resultado.success) {
        const respuestaBot = {
          id: Date.now() + 1,
          tipo: 'bot',
          contenido: resultado.data.mensaje,
          timestamp: new Date(),
          datos: resultado.data.datos,
          tipoRespuesta: resultado.data.tipo_respuesta,
          sugerencias: resultado.data.sugerencias,
          intencion: resultado.data.intencion,
          requiereSeleccion: resultado.data.requiere_seleccion,
          accion: resultado.data.accion,
          redirectUrl: resultado.data.redirect_url
        };
        setMensajes(prev => [...prev, respuestaBot]);
      } else {
        // Error
        const errorMsg = {
          id: Date.now() + 1,
          tipo: 'bot',
          contenido: resultado.error,
          timestamp: new Date(),
          esError: true
        };
        setMensajes(prev => [...prev, errorMsg]);
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      const errorMsg = {
        id: Date.now() + 1,
        tipo: 'bot',
        contenido: 'Lo siento, ocurrió un error. Por favor intenta de nuevo.',
        timestamp: new Date(),
        esError: true
      };
      setMensajes(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  /**
   * Limpia el historial de chat
   */
  const limpiarChat = () => {
    setMensajes([{
      id: Date.now(),
      tipo: 'bot',
      contenido: '👋 Historial limpiado. ¿En qué puedo ayudarte?',
      timestamp: new Date(),
      sugerencias: ['Ver mis citas', 'Próxima cita', 'Ayuda']
    }]);
    localStorage.removeItem('chatbot_historial');
  };

  /**
   * Abre/cierra el chat
   */
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return {
    mensajes,
    isTyping,
    isOpen,
    enviarMensaje,
    limpiarChat,
    toggleChat,
    messagesEndRef
  };
};
