import { useState, useEffect } from 'react';
import type {
  DocumentoClinico,
  TipoDocumento
} from '../../types/documentos.types';
import {
  TIPOS_DOCUMENTO,
  COLORES_TIPO,
  ICONOS_TIPO,
  formatearTamano,
  esImagen,
  esPDF
} from '../../types/documentos.types';
import documentosService from '../../services/documentosService';

interface GaleriaDocumentosProps {
  historialId: number;
  onActualizar?: () => void;
}

/**
 * Galería de documentos clínicos con vista previa
 */
const GaleriaDocumentos: React.FC<GaleriaDocumentosProps> = ({
  historialId,
  onActualizar
}) => {
  // Estado
  const [documentos, setDocumentos] = useState<DocumentoClinico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<TipoDocumento | 'todos'>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState<DocumentoClinico | null>(null);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  /**
   * Efecto: Cargar documentos al montar
   */
  useEffect(() => {
    console.log('🔄 [GaleriaDocumentos] useEffect triggered');
    console.log('  - historialId:', historialId);
    console.log('  - filtroTipo:', filtroTipo);
    cargarDocumentos();
  }, [historialId, filtroTipo]);

  /**
   * Carga los documentos del historial
   */
  const cargarDocumentos = async () => {
    try {
      console.group('📚 [GaleriaDocumentos] Cargando documentos');
      console.log('📋 historialId:', historialId);
      console.log('🔍 filtroTipo:', filtroTipo);
      
      setLoading(true);
      setError(null);

      const filtros = filtroTipo !== 'todos' ? { tipo: filtroTipo } : undefined;
      console.log('🎯 Filtros aplicados:', filtros);
      
      const docs = await documentosService.listarDocumentos(historialId, filtros);

      console.log('✅ Documentos cargados:', docs.length);
      console.log('📄 Documentos:', docs);
      setDocumentos(docs);
      console.groupEnd();
    } catch (err: any) {
      console.group('❌ [GaleriaDocumentos] Error al cargar documentos');
      console.error('Error completo:', err);
      console.error('Response:', err.response);
      console.error('Data:', err.response?.data);
      console.error('Status:', err.response?.status);
      console.groupEnd();
      setError(err.response?.data?.error || 'Error al cargar los documentos');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handler: Descargar documento
   */
  const handleDescargar = async (documento: DocumentoClinico) => {
    try {
      console.log('⬇️ Descargando:', documento.nombre_archivo);

      const blob = await documentosService.descargarDocumento(documento.id);
      
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = documento.nombre_archivo || `documento_${documento.id}`;
      link.click();
      
      // Limpiar
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Descarga completada');
    } catch (err) {
      console.error('❌ Error al descargar:', err);
      alert('Error al descargar el documento');
    }
  };

  /**
   * Handler: Confirmar eliminación
   */
  const handleConfirmarEliminar = (documento: DocumentoClinico) => {
    setDocumentoSeleccionado(documento);
    setModalEliminar(true);
  };

  /**
   * Handler: Eliminar documento
   */
  const handleEliminar = async () => {
    if (!documentoSeleccionado) return;

    try {
      setEliminando(true);
      
      await documentosService.eliminarDocumento(documentoSeleccionado.id);
      
      console.log('✅ Documento eliminado');
      
      // Recargar lista
      await cargarDocumentos();
      
      // Cerrar modal
      setModalEliminar(false);
      setDocumentoSeleccionado(null);
      
      // Notificar
      if (onActualizar) {
        onActualizar();
      }
    } catch (err: any) {
      console.error('❌ Error al eliminar:', err);
      alert('Error al eliminar el documento');
    } finally {
      setEliminando(false);
    }
  };

  /**
   * Filtra documentos por búsqueda
   */
  const documentosFiltrados = documentos.filter(doc => {
    if (!busqueda) return true;
    
    const busquedaLower = busqueda.toLowerCase();
    return (
      doc.descripcion.toLowerCase().includes(busquedaLower) ||
      (doc.nombre_archivo && doc.nombre_archivo.toLowerCase().includes(busquedaLower))
    );
  });

  /**
   * Formatea fecha
   */
  const formatearFecha = (fechaISO: string): string => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  /**
   * Renderizado
   */
  return (
    <div>
      {/* Filtros y búsqueda */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {/* Filtro por tipo */}
        <div style={{ minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            Tipo de Documento
          </label>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as TipoDocumento | 'todos')}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="todos">Todos los tipos</option>
            {Object.entries(TIPOS_DOCUMENTO).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Búsqueda */}
        <div style={{ flex: 1, minWidth: '250px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            Buscar
          </label>
          <input
            type="text"
            placeholder="Buscar por descripción o nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
          <div style={{ fontSize: '24px' }}>⏳ Cargando documentos...</div>
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

      {/* Sin documentos */}
      {!loading && documentosFiltrados.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
            No hay documentos para mostrar
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            {busqueda 
              ? 'No se encontraron documentos con ese criterio'
              : 'Sube tu primer documento para comenzar'
            }
          </p>
        </div>
      )}

      {/* Grid de documentos */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}
      >
        {documentosFiltrados.map(documento => (
          <div
            key={documento.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            {/* Vista previa */}
            <div
              style={{
                height: '200px',
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {esImagen(documento.nombre_archivo) ? (
                <img
                  src={documentosService.obtenerUrlArchivo(documento.archivo)}
                  alt={documento.descripcion}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : esPDF(documento.nombre_archivo) ? (
                <div style={{ fontSize: '64px' }}>📄</div>
              ) : (
                <div style={{ fontSize: '64px' }}>📁</div>
              )}

              {/* Chip de tipo */}
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  padding: '4px 12px',
                  backgroundColor: COLORES_TIPO[documento.tipo],
                  color: 'white',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {ICONOS_TIPO[documento.tipo]} {TIPOS_DOCUMENTO[documento.tipo]}
              </div>
            </div>

            {/* Contenido */}
            <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <p
                style={{
                  margin: '0 0 8px 0',
                  fontWeight: '600',
                  color: '#111827',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={documento.nombre_archivo}
              >
                {documento.nombre_archivo}
              </p>
              
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6b7280' }}>
                {documento.tamano_bytes ? formatearTamano(documento.tamano_bytes) + ' • ' : ''}{formatearFecha(documento.fecha_subida)}
              </p>

              <p
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '13px',
                  color: '#374151',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  flexGrow: 1
                }}
              >
                {documento.descripcion}
              </p>

              {documento.episodio_info && (
                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    backgroundColor: '#e0e7ff',
                    color: '#3730a3',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '500',
                    marginBottom: '12px'
                  }}
                >
                  🔗 Episodio #{documento.episodio}
                </div>
              )}

              {/* Acciones */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginTop: 'auto' }}>
                <button
                  onClick={() => handleDescargar(documento)}
                  title="Descargar"
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #3b82f6',
                    backgroundColor: 'white',
                    color: '#3b82f6',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  ⬇️ Descargar
                </button>

                <button
                  onClick={() => handleConfirmarEliminar(documento)}
                  title="Eliminar"
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ef4444',
                    backgroundColor: 'white',
                    color: '#ef4444',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef2f2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmación de eliminación */}
      {modalEliminar && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => !eliminando && setModalEliminar(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#111827' }}>
              🗑️ ¿Eliminar Documento?
            </h3>
            
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#374151' }}>
              ¿Estás seguro de que deseas eliminar este documento?
            </p>
            
            {documentoSeleccionado && (
              <div style={{ margin: '16px 0', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: '600', fontSize: '14px', color: '#111827' }}>
                  {documentoSeleccionado.nombre_archivo}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                  {documentoSeleccionado.descripcion}
                </p>
              </div>
            )}
            
            <div
              style={{
                padding: '12px',
                backgroundColor: '#fef3c7',
                border: '1px solid #fcd34d',
                borderRadius: '6px',
                marginBottom: '20px'
              }}
            >
              <p style={{ margin: 0, fontSize: '13px', color: '#92400e' }}>
                ⚠️ Esta acción no se puede deshacer
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setModalEliminar(false)}
                disabled={eliminando}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: eliminando ? 'not-allowed' : 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
                disabled={eliminando}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  backgroundColor: eliminando ? '#9ca3af' : '#ef4444',
                  color: 'white',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: eliminando ? 'not-allowed' : 'pointer'
                }}
              >
                {eliminando ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GaleriaDocumentos;
