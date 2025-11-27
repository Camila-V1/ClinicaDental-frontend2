// src/components/reportes/VoiceReportCapture.jsx
import React, { useState } from 'react';
import VoiceReportButton from './VoiceReportButton';
import VoiceReportModal from './VoiceReportModal';
import { voiceReportService } from '../../services/voiceReportService';
import toast from 'react-hot-toast';

const VoiceReportCapture = ({ onReportGenerated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitCommand = async (transcript) => {
    // Validar comando
    const validation = voiceReportService.validateCommand(transcript);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setIsProcessing(true);

    try {
      // Enviar comando al backend
      const result = await voiceReportService.processVoiceCommand(transcript);

      if (result.success) {
        const formattedData = voiceReportService.formatResponse(result.data);
        
        // Notificar al componente padre
        onReportGenerated(formattedData);
        
        // Cerrar modal
        setIsModalOpen(false);
        
        toast.success(`✅ Reporte generado: ${formattedData.datos.length} registros encontrados`);
      } else {
        toast.error(result.error || 'Error al procesar el comando');
      }
    } catch (error) {
      console.error('Error procesando comando:', error);
      toast.error('Error al procesar el comando de voz');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <VoiceReportButton onClick={handleOpenModal} />
      
      <VoiceReportModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitCommand}
        isProcessing={isProcessing}
      />
    </>
  );
};

export default VoiceReportCapture;
