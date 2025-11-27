// src/hooks/useVoiceRecognition.js
import { useState, useEffect, useRef } from 'react';

export const useVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Verificar si el navegador soporta Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Configuración
      recognitionRef.current.continuous = true;  // Escucha continua
      recognitionRef.current.interimResults = true;  // Resultados parciales
      recognitionRef.current.lang = 'es-ES';  // Español
      
      // Eventos
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
      };
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart + ' ';
          } else {
            interimTranscript += transcriptPart;
          }
        }
        
        setTranscript(prev => prev + finalTranscript || interimTranscript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Error de reconocimiento:', event.error);
        
        // Si es "no-speech", no mostrar error (es normal si el usuario no habla)
        if (event.error !== 'no-speech') {
          setError(getErrorMessage(event.error));
        }
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      setIsSupported(true);
    } else {
      setIsSupported(false);
      setError('Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setError(null);
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Error al iniciar:', err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const resetTranscript = () => {
    setTranscript('');
    setError(null);
  };

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  };
};

// Función auxiliar para mensajes de error
function getErrorMessage(error) {
  switch (error) {
    case 'no-speech':
      return '🎙️ Esperando que hables... Acerca el micrófono y habla claramente.';
    case 'audio-capture':
      return '❌ No se pudo acceder al micrófono. Verifica los permisos del navegador.';
    case 'not-allowed':
      return '🚫 Permiso denegado. Habilita el micrófono en la configuración del navegador.';
    case 'network':
      return '📡 Error de red. Verifica tu conexión a internet.';
    case 'aborted':
      return '⏹️ Reconocimiento detenido.';
    default:
      return `⚠️ Error: ${error}`;
  }
}
