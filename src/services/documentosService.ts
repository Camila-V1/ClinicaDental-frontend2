import apiClient from '../config/apiConfig';
import type { 
  DocumentoClinico,
  DocumentoClinicoBackend,
  SubirDocumentoData, 
  FiltrosDocumentos 
} from '../types/documentos.types';
import { normalizarDocumento, mapearTipoDocumentoAlBackend } from '../types/documentos.types';/**
 * Servicio para gestión de documentos clínicos
 */
const documentosService = {
  /**
   * Sube un nuevo documento al historial clínico
   * @param historialId - ID del historial clínico
   * @param data - Datos del documento (archivo, tipo, descripción, episodio)
   * @returns Promesa con el documento creado
   */
  async subirDocumento(
    historialId: number,
    data: SubirDocumentoData
  ): Promise<DocumentoClinico> {
    try {
      console.group('📤 [documentosService] subirDocumento');
      console.log('📋 historialId:', historialId);
      console.log('📄 Tipo:', data.tipo);
      console.log('📝 Descripción:', data.descripcion);
      console.log('📁 Archivo:', {
        nombre: data.archivo.name,
        tamaño: data.archivo.size + ' bytes',
        tipo: data.archivo.type
      });
      console.log('📎 Episodio:', data.episodio || 'No vinculado');

      // Crear FormData
      const formData = new FormData();
      formData.append('archivo', data.archivo);
      formData.append('tipo_documento', mapearTipoDocumentoAlBackend(data.tipo)); // radiografia → RADIOGRAFIA
      formData.append('descripcion', data.descripcion);
      formData.append('historial_clinico', historialId.toString()); // Agregar historialId al FormData
      
      if (data.episodio) {
        formData.append('episodio', data.episodio.toString());
        console.log('🔗 Episodio vinculado:', data.episodio);
      }

      console.log('📦 FormData creado');
      console.log('🌐 URL:', `/api/historial/documentos/`);

      // Hacer request con FormData al endpoint general
      const response = await apiClient.post(
        `/api/historial/documentos/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Normalizar respuesta del backend
      const documentoNormalizado = normalizarDocumento(response.data);
      
      console.log('✅ Documento subido exitosamente');
      console.log('📄 Response data original:', response.data);
      console.log('📄 Documento normalizado:', documentoNormalizado);
      console.groupEnd();
      return documentoNormalizado;
    } catch (error: any) {
      console.group('❌ [documentosService] Error al subir documento');
      console.error('Error completo:', error);
      console.error('Response:', error.response);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('URL:', error.config?.url);
      console.groupEnd();
      throw error;
    }
  },

  /**
   * Obtiene la lista de documentos de un historial clínico
   * @param historialId - ID del historial clínico
   * @param filtros - Filtros opcionales (tipo, episodio)
   * @returns Promesa con array de documentos
   */
  async listarDocumentos(
    historialId: number,
    filtros?: FiltrosDocumentos
  ): Promise<DocumentoClinico[]> {
    try {
      console.group('📋 [documentosService] listarDocumentos');
      console.log('📋 historialId:', historialId);
      console.log('🔍 Filtros:', filtros);
      
      const params = new URLSearchParams();
      
      if (filtros?.tipo) {
        params.append('tipo', filtros.tipo);
        console.log('🏷️ Filtro por tipo:', filtros.tipo);
      }
      
      if (filtros?.episodio) {
        params.append('episodio', filtros.episodio.toString());
        console.log('🔗 Filtro por episodio:', filtros.episodio);
      }

      const url = `/api/historial/historiales/${historialId}/documentos/${
        params.toString() ? '?' + params.toString() : ''
      }`;

      console.log('🌐 URL completa:', url);

      const response = await apiClient.get<DocumentoClinicoBackend[]>(url);
      
      // Normalizar documentos del backend al formato del frontend
      const documentosNormalizados = response.data.map(normalizarDocumento);
      
      console.log('✅ Documentos obtenidos:', documentosNormalizados.length);
      console.log('📄 Documentos normalizados:', documentosNormalizados);
      console.groupEnd();
      return documentosNormalizados;
    } catch (error: any) {
      console.group('❌ [documentosService] Error al listar documentos');
      console.error('Error completo:', error);
      console.error('Response:', error.response);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('URL:', error.config?.url);
      console.groupEnd();
      throw error;
    }
  },

  /**
   * Obtiene el detalle de un documento específico
   * @param documentoId - ID del documento
   * @returns Promesa con los datos del documento
   */
  async obtenerDocumento(documentoId: number): Promise<DocumentoClinico> {
    try {
      const response = await apiClient.get(`/api/historial/documentos/${documentoId}/`);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener documento:', error);
      throw error;
    }
  },

  /**
   * Descarga un documento
   * @param documentoId - ID del documento
   * @returns Promesa con el Blob del archivo
   */
  async descargarDocumento(documentoId: number): Promise<Blob> {
    try {
      console.log('⬇️ Descargando documento:', documentoId);
      
      const response = await apiClient.get(
        `/api/historial/documentos/${documentoId}/descargar/`,
        {
          responseType: 'blob'
        }
      );
      
      console.log('✅ Documento descargado');
      return response.data;
    } catch (error) {
      console.error('❌ Error al descargar documento:', error);
      throw error;
    }
  },

  /**
   * Elimina un documento
   * @param documentoId - ID del documento
   * @returns Promesa sin contenido
   */
  async eliminarDocumento(documentoId: number): Promise<void> {
    try {
      console.group('🗑️ [documentosService] eliminarDocumento');
      console.log('📄 documentoId:', documentoId);
      console.log('🌐 URL:', `/api/historial/documentos/${documentoId}/`);
      
      const response = await apiClient.delete(`/api/historial/documentos/${documentoId}/`);
      
      console.log('✅ Documento eliminado exitosamente');
      console.log('📄 Response:', response);
      console.groupEnd();
    } catch (error: any) {
      console.group('❌ [documentosService] Error al eliminar documento');
      console.error('Error completo:', error);
      console.error('Response:', error.response);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.groupEnd();
      throw error;
    }
  },

  /**
   * Obtiene la URL completa de un archivo
   * @param rutaArchivo - Ruta relativa del archivo
   * @returns URL completa
   */
  obtenerUrlArchivo(rutaArchivo: string): string {
    // Si la ruta ya es una URL completa, devolverla
    if (rutaArchivo.startsWith('http')) {
      return rutaArchivo;
    }
    
    // Obtener base URL del backend
    const baseURL = apiClient.defaults.baseURL || 'http://localhost:8000';
    
    // Construir URL completa
    return `${baseURL}${rutaArchivo}`;
  }
};

export default documentosService;
