// src/components/chatbot/ChatWidget.jsx
import React from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatWindow from './ChatWindow';
import { useChatbot } from '../../hooks/useChatbot';

const ChatWidget = () => {
  const chatbot = useChatbot();

  return (
    <>
      {/* Ventana de chat */}
      {chatbot.isOpen && (
        <ChatWindow
          mensajes={chatbot.mensajes}
          isTyping={chatbot.isTyping}
          onEnviarMensaje={chatbot.enviarMensaje}
          onLimpiarChat={chatbot.limpiarChat}
          onCerrar={chatbot.toggleChat}
          messagesEndRef={chatbot.messagesEndRef}
        />
      )}

      {/* Burbuja flotante */}
      <button
        className={`chat-bubble ${chatbot.isOpen ? 'hidden' : ''}`}
        onClick={chatbot.toggleChat}
        aria-label="Abrir chat"
      >
        <MessageCircle size={24} />
        <span className="badge">💬</span>
      </button>
    </>
  );
};

export default ChatWidget;
