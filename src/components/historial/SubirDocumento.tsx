import { useState, useRef } from 'react';
import type { TipoDocumento } from '../../types/documentos.types';
import {
  TIPOS_DOCUMENTO,
  validarArchivo,
  formatearTamano,
  TAMANO_MAXIMO_MB
} from '../../types/documentos.types';
import documentosService from '../../services/documentosService';

interface SubirDocumentoProps {
  historialId: number;
  episodioId?: number;
  onDocumentoSubido: () => void;
  onCancelar?: () => void;
}

/**
 * Componente para subir documentos clínicos con drag & drop
 */
const SubirDocumento: React.FC<SubirDocumentoProps> = ({
  historialId,
  episodioId,
  onDocumentoSubido,
  onCancelar
}) => {
  // Estado
  const [archivo, setArchivo] = useState<File | null>(null);
  const [tipo, setTipo] = useState<TipoDocumento>('radiografia');
  const [descripcion, setDescripcion] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const inputFileRef = useRef<HTMLInputElement>(null);

  /**
   * Handler: Seleccionar archivo desde input
   */
  const handleSeleccionarArchivo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      procesarArchivo(files[0]);
    }
  };

  /**
   * Handler: Drag over
   */
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  /**
   * Handler: Drag leave
   */
  const handleDragLeave = () => {
    setDragOver(false);
  };

  /**
   * Handler: Drop archivo
   */
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      procesarArchivo(files[0]);
    }
  };

  /**
   * Procesa y valida un archivo
   */
  const procesarArchivo = (file: File) => {
    console.log('📁 Procesando archivo:', file.name);

    const validacion = validarArchivo(file);
    
    if (!validacion.valido) {
      setError(validacion.error || 'Archivo no válido');
      setArchivo(null);
      return;
    }

    setArchivo(file);
    setError(null);
    console.log('✅ Archivo válido:', file.name);
  };

  /**
   * Handler: Quitar archivo seleccionado
   */
  const handleQuitarArchivo = () => {
    setArchivo(null);
    setError(null);
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  };

  /**
   * Handler: Subir documento
   */
  const handleSubir = async () => {
    console.group('📤 [SubirDocumento] Iniciando subida');
    console.log('📋 historialId:', historialId);
    console.log('📄 tipo:', tipo);
    console.log('📝 descripcion:', descripcion);
    console.log('📁 archivo:', archivo?.name);
    console.log('📎 episodioId:', episodioId);
    
    if (!archivo) {
      console.warn('⚠️ No hay archivo seleccionado');
      setError('Selecciona un archivo');
      console.groupEnd();
      return;
    }

    if (!descripcion.trim()) {
      console.warn('⚠️ No hay descripción');
      setError('Ingresa una descripción');
      console.groupEnd();
      return;
    }

    try {
      setSubiendo(true);
      setError(null);

      const data = {
        archivo,
        tipo,
        descripcion: descripcion.trim(),
        episodio: episodioId
      };
      
      console.log('🚀 Enviando documento al backend:', data);

      const resultado = await documentosService.subirDocumento(historialId, data);

      console.log('✅ Documento subido exitosamente:', resultado);

      // Limpiar formulario
      setArchivo(null);
      setDescripcion('');
      setTipo('radiografia');
      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }

      console.log('🔄 Notificando al componente padre...');
      // Notificar al padre
      onDocumentoSubido();
      console.groupEnd();
    } catch (err: any) {
      console.group('❌ [SubirDocumento] Error al subir documento');
      console.error('Error completo:', err);
      console.error('Response:', err.response);
      console.error('Data:', err.response?.data);
      console.error('Status:', err.response?.status);
      console.error('Message:', err.message);
      console.groupEnd();
      setError(err.response?.data?.error || err.message || 'Error al subir el documento');
    } finally {
      setSubiendo(false);
    }
  };

  /**
   * Renderizado
   */
  return (
    <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      {/* Título */}
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#111827' }}>
        📤 Subir Documento
      </h3>

      {/* Zona de drag & drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputFileRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? '#3b82f6' : '#d1d5db'}`,
          borderRadius: '8px',
          padding: '48px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: dragOver ? '#eff6ff' : 'transparent',
          transition: 'all 0.3s',
          marginBottom: '24px'
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>☁️</div>
        
        <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500', color: '#374151' }}>
          {dragOver 
            ? '⬇️ Suelta el archivo aquí' 
            : 'Arrastra un archivo aquí o haz clic para seleccionar'
          }
        </p>
        
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
          Formatos: JPG, PNG, PDF (máx. {TAMANO_MAXIMO_MB} MB)
        </p>

        {/* Input oculto */}
        <input
          ref={inputFileRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          style={{ display: 'none' }}
          onChange={handleSeleccionarArchivo}
        />
      </div>

      {/* Archivo seleccionado */}
      {archivo && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            backgroundColor: '#d1fae5',
            borderRadius: '8px',
            marginBottom: '24px'
          }}
        >
          <span style={{ fontSize: '24px' }}>📎</span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: '600', color: '#111827' }}>{archivo.name}</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>{formatearTamano(archivo.size)}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleQuitarArchivo();
            }}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ✖️
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            marginBottom: '24px',
            color: '#991b1b'
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Formulario */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Tipo de documento */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            Tipo de Documento *
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoDocumento)}
            disabled={subiendo}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white',
              cursor: subiendo ? 'not-allowed' : 'pointer'
            }}
          >
            {Object.entries(TIPOS_DOCUMENTO).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Descripción */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            Descripción *
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej: Radiografía panorámica inicial, vista lateral derecha..."
            disabled={subiendo}
            rows={3}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              backgroundColor: subiendo ? '#f9fafb' : 'white'
            }}
          />
        </div>

        {/* Episodio vinculado */}
        {episodioId && (
          <div
            style={{
              display: 'inline-block',
              padding: '6px 12px',
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              borderRadius: '16px',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            🔗 Vinculado al episodio #{episodioId}
          </div>
        )}

        {/* Barra de progreso */}
        {subiendo && (
          <div style={{ height: '4px', backgroundColor: '#e5e7eb', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                backgroundColor: '#3b82f6',
                animation: 'progress 1.5s ease-in-out infinite',
                width: '40%'
              }}
            />
          </div>
        )}

        {/* Botones */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
          {onCancelar && (
            <button
              onClick={onCancelar}
              disabled={subiendo}
              style={{
                padding: '10px 20px',
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                color: '#374151',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: subiendo ? 'not-allowed' : 'pointer'
              }}
            >
              Cancelar
            </button>
          )}

          <button
            onClick={handleSubir}
            disabled={!archivo || !descripcion.trim() || subiendo}
            style={{
              padding: '10px 20px',
              border: 'none',
              backgroundColor: !archivo || !descripcion.trim() || subiendo ? '#9ca3af' : '#3b82f6',
              color: 'white',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: !archivo || !descripcion.trim() || subiendo ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ☁️ {subiendo ? 'Subiendo...' : 'Subir Documento'}
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}} />
    </div>
  );
};

export default SubirDocumento;
