// src/components/chatbot/ChatMessage.jsx
import React from 'react';
import ChatResponseRenderer from './ChatResponseRenderer';

const ChatMessage = ({ mensaje, onEnviarMensaje }) => {
  const { tipo, contenido, timestamp, esVoz, esError, sugerencias } = mensaje;

  return (
    <div className={`chat-message ${tipo}`}>
      {tipo === 'bot' && <div className="message-avatar">🤖</div>}
      
      <div className="message-content">
        <div className={`message-bubble ${esError ? 'error' : ''}`}>
          {esVoz && tipo === 'usuario' && <span className="voice-badge">🎤</span>}
          
          <p>{contenido}</p>
          
          {/* Renderizar datos estructurados */}
          {mensaje.datos && (
            <ChatResponseRenderer 
              datos={mensaje.datos}
              tipoRespuesta={mensaje.tipoRespuesta}
              onEnviarMensaje={onEnviarMensaje}
            />
          )}
        </div>
        
        {/* Sugerencias */}
        {sugerencias && sugerencias.length > 0 && (
          <div className="message-suggestions">
            {sugerencias.map((sugerencia, index) => (
              <button
                key={index}
                className="suggestion-chip"
                onClick={() => onEnviarMensaje(sugerencia)}
              >
                {sugerencia}
              </button>
            ))}
          </div>
        )}
        
        <span className="message-time">
          {new Date(timestamp).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
