/**
 * 📥 Componente de Botones de Exportación
 */

import { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
  onExportar: (formato: 'pdf' | 'excel') => Promise<void>;
  nombreReporte?: string;
}

export default function BotonesExportar({ onExportar, nombreReporte = 'reporte' }: Props) {
  const [exportando, setExportando] = useState(false);

  const handleExportar = async (formato: 'pdf' | 'excel') => {
    console.log(`🔵 [BotonesExportar] Iniciando exportación a ${formato.toUpperCase()} de "${nombreReporte}"`);
    setExportando(true);
    try {
      console.log(`📤 [BotonesExportar] Llamando a onExportar(${formato})...`);
      await onExportar(formato);
      console.log(`✅ [BotonesExportar] Exportación exitosa a ${formato.toUpperCase()}`);
      toast.success(`✅ ${nombreReporte} exportado a ${formato.toUpperCase()}`);
    } catch (error: any) {
      console.error('❌ [BotonesExportar] Error al exportar:', error);
      console.error('❌ [BotonesExportar] Mensaje de error:', error.message);
      console.error('❌ [BotonesExportar] Stack:', error.stack);
      const mensaje = error.message || `Error al exportar a ${formato.toUpperCase()}`;
      toast.error(mensaje);
    } finally {
      console.log(`🏁 [BotonesExportar] Finalizando exportación (exportando=false)`);
      setExportando(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button
        onClick={() => handleExportar('pdf')}
        disabled={exportando}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: exportando ? '#9ca3af' : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          color: 'white',
          padding: '10px 16px',
          borderRadius: '8px',
          border: 'none',
          fontSize: '14px',
          fontWeight: '600',
          cursor: exportando ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          opacity: exportando ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (!exportando) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <span style={{ fontSize: '18px' }}>📄</span>
        {exportando ? 'Exportando...' : 'Exportar PDF'}
      </button>
      
      <button
        onClick={() => handleExportar('excel')}
        disabled={exportando}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: exportando ? '#9ca3af' : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          color: 'white',
          padding: '10px 16px',
          borderRadius: '8px',
          border: 'none',
          fontSize: '14px',
          fontWeight: '600',
          cursor: exportando ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          opacity: exportando ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (!exportando) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <span style={{ fontSize: '18px' }}>📊</span>
        {exportando ? 'Exportando...' : 'Exportar Excel'}
      </button>
    </div>
  );
}
