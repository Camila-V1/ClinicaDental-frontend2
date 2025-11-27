// src/components/chatbot/ChatInput.jsx
import React, { useState } from 'react';
import { Send, Mic } from 'lucide-react';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition'; // Reutilizar del sistema de voz

const ChatInput = ({ onEnviarMensaje }) => {
  const [texto, setTexto] = useState('');
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript
  } = useVoiceRecognition();

  const handleSubmit = (e) => {
    e.preventDefault();
    const mensaje = texto.trim() || transcript.trim();
    
    if (mensaje) {
      onEnviarMensaje(mensaje, !!transcript);
      setTexto('');
      resetTranscript();
    }
  };

  const handleVoiceClick = () => {
    if (isListening) {
      stopListening();
      // Enviar automáticamente después de detener
      if (transcript) {
        onEnviarMensaje(transcript, true);
        resetTranscript();
      }
    } else {
      startListening();
    }
  };

  // Sincronizar transcript con input
  const displayText = transcript || texto;

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <button
        type="button"
        className={`voice-button ${isListening ? 'listening' : ''}`}
        onClick={handleVoiceClick}
        title={isListening ? 'Detener' : 'Hablar'}
      >
        <Mic size={20} />
      </button>
      
      <input
        type="text"
        value={displayText}
        onChange={(e) => setTexto(e.target.value)}
        placeholder={isListening ? 'Escuchando...' : 'Escribe un mensaje...'}
        disabled={isListening}
      />
      
      <button
        type="submit"
        className="send-button"
        disabled={!displayText.trim()}
        title="Enviar"
      >
        <Send size={20} />
      </button>
    </form>
  );
};

export default ChatInput;
