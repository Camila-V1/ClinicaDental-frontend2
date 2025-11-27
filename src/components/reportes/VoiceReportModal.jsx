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
    resetTranscript,
    setTranscript
  } = useVoiceRecognition();
  
  const [manualText, setManualText] = React.useState('');

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
    setManualText('');
    onClose();
  };

  const handleSubmit = () => {
    const finalText = manualText.trim() || transcript.trim();
    if (finalText) {
      stopListening();
      onSubmit(finalText);
      setManualText('');
    }
  };
  
  const handleManualTextChange = (e) => {
    setManualText(e.target.value);
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

              {/* Transcripción por voz */}
              <div className="transcript-container">
                <label>Transcripción por voz:</label>
                <div className="transcript-box" style={{
                  minHeight: '80px',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  padding: '12px',
                  backgroundColor: isListening ? '#f0fdf4' : '#f9fafb',
                  border: isListening ? '2px solid #10b981' : '1px solid #e5e7eb',
                  transition: 'all 0.3s ease'
                }}>
                  {transcript ? (
                    <span style={{ color: '#111827', fontWeight: '500' }}>
                      {transcript}
                    </span>
                  ) : (
                    <span className="placeholder" style={{
                      color: isListening ? '#10b981' : '#9ca3af',
                      fontStyle: 'italic'
                    }}>
                      {isListening 
                        ? '🎤 Escuchando... Habla ahora' 
                        : '🔇 Presiona "Iniciar" para comenzar'}
                    </span>
                  )}
                </div>
                {transcript && (
                  <div style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>✅</span>
                    <span>{transcript.split(' ').length} palabras capturadas por voz</span>
                  </div>
                )}
              </div>

              {/* Campo de texto manual */}
              <div className="manual-input-container" style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  ✍️ O escribe tu comando manualmente:
                </label>
                <textarea
                  value={manualText}
                  onChange={handleManualTextChange}
                  placeholder="Escribe aquí tu comando... Ejemplo: Dame las citas del 1 al 5 de septiembre"
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    backgroundColor: '#ffffff',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                {manualText && (
                  <div style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    color: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>✅</span>
                    <span>{manualText.split(' ').length} palabras escritas</span>
                  </div>
                )}
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
              disabled={(!transcript.trim() && !manualText.trim()) || isProcessing}
            >
              <Send size={16} />
              {isProcessing ? 'Procesando...' : 'Enviar Comando'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceReportModal;
