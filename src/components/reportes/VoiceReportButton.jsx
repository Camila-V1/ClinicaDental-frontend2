// src/components/reportes/VoiceReportButton.jsx
import React from 'react';
import { Mic } from 'lucide-react';

const VoiceReportButton = ({ onClick, isListening }) => {
  return (
    <button
      onClick={onClick}
      className={`voice-report-button ${isListening ? 'listening' : ''}`}
      title="Reportes por voz"
    >
      <Mic className="mic-icon" size={20} />
      <span>Reportes por Voz</span>
    </button>
  );
};

export default VoiceReportButton;
