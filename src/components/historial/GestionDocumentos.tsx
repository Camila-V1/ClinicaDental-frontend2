import { useState } from 'react';
import SubirDocumento from './SubirDocumento';
import GaleriaDocumentos from './GaleriaDocumentos';

interface GestionDocumentosProps {
  historialId: number;
  episodioId?: number;
}

/**
 * Componente principal que integra subida y galería de documentos
 */
const GestionDocumentos: React.FC<GestionDocumentosProps> = ({
  historialId,
  episodioId
}) => {
  const [mostrarSubida, setMostrarSubida] = useState(false);
  const [actualizarKey, setActualizarKey] = useState(0);

  /**
   * Handler: Documento subido exitosamente
   */
  const handleDocumentoSubido = () => {
    console.log('✅ [GestionDocumentos] Documento subido, actualizando galería');
    console.log('  - historialId:', historialId);
    console.log('  - Cerrando formulario de subida');
    console.log('  - Incrementando actualizarKey de', actualizarKey, 'a', actualizarKey + 1);
    setMostrarSubida(false);
    // Forzar actualización de galería
    setActualizarKey(prev => prev + 1);
  };

  console.log('🔄 [GestionDocumentos] Render');
  console.log('  - historialId:', historialId);
  console.log('  - episodioId:', episodioId);
  console.log('  - mostrarSubida:', mostrarSubida);
  console.log('  - actualizarKey:', actualizarKey);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Botón para mostrar/ocultar formulario de subida */}
      {!mostrarSubida && (
        <button
          onClick={() => setMostrarSubida(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            alignSelf: 'flex-start'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
          }}
        >
          📤 Subir Nuevo Documento
        </button>
      )}

      {/* Componente de subida (mostrar solo si está activo) */}
      {mostrarSubida && (
        <SubirDocumento
          historialId={historialId}
          episodioId={episodioId}
          onDocumentoSubido={handleDocumentoSubido}
          onCancelar={() => setMostrarSubida(false)}
        />
      )}

      {/* Galería de documentos */}
      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#111827' }}>
          📚 Mis Documentos
        </h3>
        <GaleriaDocumentos
          key={actualizarKey}
          historialId={historialId}
          onActualizar={() => setActualizarKey(prev => prev + 1)}
        />
      </div>
    </div>
  );
};

export default GestionDocumentos;
