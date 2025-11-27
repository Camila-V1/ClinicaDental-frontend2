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
      // Detectar si el usuario pidió exportar a PDF o Excel
      const transcriptLower = transcript.toLowerCase();
      const requestPDF = transcriptLower.includes('pdf') || transcriptLower.includes('descargar') || transcriptLower.includes('exportar');
      const requestExcel = transcriptLower.includes('excel') || transcriptLower.includes('xls');

      // Enviar comando al backend
      const result = await voiceReportService.processVoiceCommand(transcript);

      if (result.success) {
        const formattedData = voiceReportService.formatResponse(result.data);
        
        // Notificar al componente padre
        onReportGenerated(formattedData);
        
        // Si el usuario pidió exportar, mostrar opciones
        if (requestPDF || requestExcel) {
          toast.success(
            `📊 Reporte generado: ${formattedData.datos.length} registros\n\n` +
            `💡 Usa los botones "Exportar PDF" o "Exportar Excel" en la parte superior para descargar`,
            { duration: 6000, icon: '📥' }
          );
        } else {
          toast.success(`✅ Reporte generado: ${formattedData.datos.length} registros encontrados`);
        }
        
        // Cerrar modal
        setIsModalOpen(false);
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
