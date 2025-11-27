// src/components/reportes/VoiceReportModal.jsx
import React, { useEffect } from 'react';
import { X, Mic, Square, Send, AlertCircle } from 'lucide-react';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';

const VoiceReportModal = ({ isOpen, onClose, onSubmit, isProcessing }) => {
  const {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useVoiceRecognition();

  // Auto-iniciar al abrir el modal
  useEffect(() => {
    if (isOpen && isSupported) {
      startListening();
    }
    
    return () => {
      stopListening();
    };
  }, [isOpen, isSupported]);

  const handleClose = () => {
    stopListening();
    resetTranscript();
    onClose();
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      stopListening();
      onSubmit(transcript);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="voice-modal-overlay" onClick={handleClose}>
      <div className="voice-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="voice-modal-header">
          <h3>🎤 Comando de Voz</h3>
          <button onClick={handleClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="voice-modal-body">
          {!isSupported ? (
            <div className="error-message">
              <AlertCircle size={24} />
              <p>Tu navegador no soporta reconocimiento de voz.</p>
              <p className="small">Usa Google Chrome o Microsoft Edge.</p>
            </div>
          ) : (
            <>
              {/* Estado del micrófono */}
              <div className={`mic-status ${isListening ? 'active' : ''}`}>
                <div className="mic-icon-wrapper">
                  {isListening ? (
                    <>
                      <Mic size={48} className="mic-icon-large pulse" />
                      <div className="sound-wave">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </>
                  ) : (
                    <Mic size={48} className="mic-icon-large" />
                  )}
                </div>
                <p className="mic-status-text">
                  {isListening ? '🎙️ Escuchando...' : '🔇 Detenido'}
                </p>
              </div>

              {/* Transcripción */}
              <div className="transcript-container">
                <label>Transcripción:</label>
                <div className="transcript-box">
                  {transcript || (
                    <span className="placeholder">
                      {isListening 
                        ? 'Habla ahora...' 
                        : 'Presiona el botón para comenzar'}
                    </span>
                  )}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="error-alert">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Info de Debug */}
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px', padding: '8px', background: '#f9fafb', borderRadius: '6px' }}>
                <div><strong>Navegador:</strong> {navigator.userAgent.includes('Chrome') ? '✅ Chrome' : navigator.userAgent.includes('Edge') ? '✅ Edge' : '⚠️ Otro'}</div>
                <div><strong>Idioma:</strong> es-ES</div>
                <div><strong>Tip:</strong> Habla claro y despacio. Di frases completas como "Dame las citas de hoy"</div>
              </div>

              {/* Ejemplos */}
              <div className="examples">
                <p className="examples-title">Ejemplos:</p>
                <ul>
                  <li>"Dame las citas del 1 al 5 de septiembre"</li>
                  <li>"Mostrar facturas de la semana pasada"</li>
                  <li>"Ingresos del mes actual"</li>
                  <li>"Facturas pendientes mayores a 1000"</li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {isSupported && (
          <div className="voice-modal-footer">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`btn-voice ${isListening ? 'btn-stop' : 'btn-start'}`}
              disabled={isProcessing}
            >
              {isListening ? (
                <>
                  <Square size={16} />
                  Detener
                </>
              ) : (
                <>
                  <Mic size={16} />
                  Iniciar
                </>
              )}
            </button>
            
            <button
              onClick={handleSubmit}
              className="btn-submit"
              disabled={!transcript.trim() || isProcessing}
            >
              <Send size={16} />
              {isProcessing ? 'Procesando...' : 'Enviar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceReportModal;
