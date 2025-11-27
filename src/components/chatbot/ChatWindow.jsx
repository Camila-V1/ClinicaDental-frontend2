// src/components/chatbot/ChatWindow.jsx
import React from 'react';
import { X, Trash2 } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatWindow = ({ 
  mensajes, 
  isTyping, 
  onEnviarMensaje, 
  onLimpiarChat, 
  onCerrar,
  messagesEndRef 
}) => {
  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-content">
          <div className="bot-avatar">🤖</div>
          <div>
            <h3>Asistente Virtual</h3>
            <span className="status">● En línea</span>
          </div>
        </div>
        <div className="chat-header-actions">
          <button 
            onClick={onLimpiarChat} 
            className="icon-button"
            title="Limpiar chat"
          >
            <Trash2 size={18} />
          </button>
          <button 
            onClick={onCerrar} 
            className="icon-button"
            title="Cerrar"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {mensajes.map((mensaje) => (
          <ChatMessage 
            key={mensaje.id} 
            mensaje={mensaje}
            onEnviarMensaje={onEnviarMensaje}
          />
        ))}
        
        {isTyping && (
          <div className="chat-message bot">
            <div className="message-bubble typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onEnviarMensaje={onEnviarMensaje} />
    </div>
  );
};

export default ChatWindow;
