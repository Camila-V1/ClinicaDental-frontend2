// src/hooks/useVoiceRecognition.js
import { useState, useEffect, useRef } from 'react';

export const useVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const shouldListenRef = useRef(false); // ✅ Flag para saber si debe continuar
  
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
        console.log('✅ Reconocimiento iniciado');
        setIsListening(true);
        setError(null);
      };
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;
          
          console.log(`🎤 Resultado [${i}]:`, {
            texto: transcriptPart,
            confianza: confidence,
            esFinal: event.results[i].isFinal
          });
          
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart + ' ';
          } else {
            interimTranscript += transcriptPart;
          }
        }
        
        const newText = finalTranscript || interimTranscript;
        if (newText) {
          console.log('📝 Transcripción actualizada:', newText);
        }
        
        // ✅ CORRECCIÓN: Acumular solo texto final, mostrar interim sin guardar
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        } else if (interimTranscript) {
          // Para resultados parciales, actualizar sin acumular
          setTranscript(prev => prev + interimTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('❌ Error de reconocimiento:', event.error);
        
        // ✅ SOLUCIÓN: Ignorar 'no-speech' completamente y continuar escuchando
        if (event.error === 'no-speech') {
          console.log('⏸️ Pausa detectada (no-speech) - continuando escucha...');
          return; // ✅ NO cambiar isListening, NO mostrar error
        }
        
        // Solo detener y mostrar error para problemas reales
        setError(getErrorMessage(event.error));
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        console.log('⏹️ Reconocimiento finalizado');
        setIsListening(false);
        
        // ✅ Auto-reiniciar si aún debería estar escuchando
        if (shouldListenRef.current) {
          console.log('🔄 Reiniciando reconocimiento automáticamente...');
          setTimeout(() => {
            if (shouldListenRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (err) {
                console.error('❌ Error al reiniciar:', err);
              }
            }
          }, 100);
        }
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
      shouldListenRef.current = true; // ✅ Marcar que debe continuar
      try {
        console.log('🎙️ Iniciando reconocimiento de voz...');
        console.log('📌 Configuración:', {
          lang: 'es-ES',
          continuous: true,
          interimResults: true
        });
        recognitionRef.current.start();
      } catch (err) {
        console.error('❌ Error al iniciar:', err);
        setError('Error al iniciar el micrófono: ' + err.message);
        shouldListenRef.current = false;
      }
    }
  };

  const stopListening = () => {
    shouldListenRef.current = false; // ✅ Marcar que debe detenerse
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
