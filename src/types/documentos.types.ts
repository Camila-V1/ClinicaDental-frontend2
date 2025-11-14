/**
 * Tipos para Gestión de Documentos Clínicos
 */

// Tipos de documento
export type TipoDocumento = 
  | 'radiografia'
  | 'receta'
  | 'consentimiento'
  | 'informe'
  | 'otro';

// Información de episodio
export interface EpisodioInfo {
  id: number;
  fecha: string;
  motivo: string;
}

// Documento clínico (estructura del backend)
export interface DocumentoClinicoBackend {
  id: number;
  historial_clinico?: number;
  tipo_documento: string; // RADIOGRAFIA, LABORATORIO, etc.
  archivo: string; // URL completa del archivo
  descripcion: string;
  episodio?: number;
  creado: string; // ISO string
}

// Documento clínico (normalizado para el frontend)
export interface DocumentoClinico {
  id: number;
  historial_clinico: number;
  tipo: TipoDocumento;
  archivo: string; // URL del archivo
  descripcion: string;
  episodio?: number;
  episodio_info?: EpisodioInfo;
  fecha_subida: string; // ISO string
  nombre_archivo?: string; // Opcional, extraído de archivo
  tamano_bytes?: number; // Opcional
}

// Datos para subir documento
export interface SubirDocumentoData {
  archivo: File;
  tipo: TipoDocumento;
  descripcion: string;
  episodio?: number;
}

// Filtros de búsqueda
export interface FiltrosDocumentos {
  tipo?: TipoDocumento;
  episodio?: number;
  busqueda?: string;
}

// Configuración de tipos
export const TIPOS_DOCUMENTO: Record<TipoDocumento, string> = {
  radiografia: 'Radiografía',
  receta: 'Receta Médica',
  consentimiento: 'Consentimiento Informado',
  informe: 'Informe Médico',
  otro: 'Otro Documento'
};

// Colores por tipo
export const COLORES_TIPO: Record<TipoDocumento, string> = {
  radiografia: '#2196F3',   // Azul
  receta: '#4CAF50',        // Verde
  consentimiento: '#FF9800', // Naranja
  informe: '#9C27B0',       // Púrpura
  otro: '#607D8B'           // Gris
};

// Iconos por tipo (emojis)
export const ICONOS_TIPO: Record<TipoDocumento, string> = {
  radiografia: '📷',
  receta: '💊',
  consentimiento: '📋',
  informe: '📄',
  otro: '📁'
};

// Extensiones permitidas
export const EXTENSIONES_PERMITIDAS = {
  imagenes: ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
  documentos: ['.pdf'],
  todos: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.pdf']
};

// Tamaño máximo de archivo (10 MB)
export const TAMANO_MAXIMO_MB = 10;
export const TAMANO_MAXIMO_BYTES = TAMANO_MAXIMO_MB * 1024 * 1024;

/**
 * Verifica si un archivo es una imagen
 */
export const esImagen = (nombreArchivo: string | undefined): boolean => {
  if (!nombreArchivo) return false;
  const extension = nombreArchivo.toLowerCase().substring(nombreArchivo.lastIndexOf('.'));
  return EXTENSIONES_PERMITIDAS.imagenes.includes(extension);
};

/**
 * Verifica si un archivo es un PDF
 */
export const esPDF = (nombreArchivo: string | undefined): boolean => {
  if (!nombreArchivo) return false;
  return nombreArchivo.toLowerCase().endsWith('.pdf');
};

/**
 * Formatea el tamaño de archivo en formato legible
 */
export const formatearTamano = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Valida un archivo antes de subirlo
 */
export const validarArchivo = (archivo: File): { valido: boolean; error?: string } => {
  // Validar tamaño
  if (archivo.size > TAMANO_MAXIMO_BYTES) {
    return {
      valido: false,
      error: `El archivo es demasiado grande. Máximo ${TAMANO_MAXIMO_MB} MB.`
    };
  }
  
  // Validar extensión
  const extension = archivo.name.toLowerCase().substring(archivo.name.lastIndexOf('.'));
  if (!EXTENSIONES_PERMITIDAS.todos.includes(extension)) {
    return {
      valido: false,
      error: 'Tipo de archivo no permitido. Solo se permiten imágenes y PDFs.'
    };
  }
  
  return { valido: true };
};

/**
 * Mapea tipo de documento del backend al frontend
 */
const mapearTipoDocumento = (tipoBackend: string): TipoDocumento => {
  const mapa: Record<string, TipoDocumento> = {
    'RADIOGRAFIA': 'radiografia',
    'RECETA': 'receta',
    'CONSENTIMIENTO': 'consentimiento',
    'INFORME': 'informe',
    'LABORATORIO': 'otro', // Mapear LABORATORIO a "otro"
    'OTRO': 'otro'
  };
  return mapa[tipoBackend] || 'otro';
};

/**
 * Mapea tipo de documento del frontend al backend
 */
export const mapearTipoDocumentoAlBackend = (tipoFrontend: TipoDocumento): string => {
  const mapa: Record<TipoDocumento, string> = {
    'radiografia': 'RADIOGRAFIA',
    'receta': 'RECETA',
    'consentimiento': 'CONSENTIMIENTO',
    'informe': 'INFORME',
    'otro': 'OTRO'
  };
  return mapa[tipoFrontend];
};

/**
 * Extrae el nombre de archivo de una URL
 */
const extraerNombreArchivo = (url: string): string => {
  try {
    const partes = url.split('/');
    const nombreConParams = partes[partes.length - 1];
    const nombre = nombreConParams.split('?')[0]; // Quitar query params
    return decodeURIComponent(nombre);
  } catch {
    return url;
  }
};

/**
 * Normaliza un documento del backend al formato del frontend
 */
export const normalizarDocumento = (docBackend: DocumentoClinicoBackend): DocumentoClinico => {
  const nombreArchivo = extraerNombreArchivo(docBackend.archivo);
  
  return {
    id: docBackend.id,
    historial_clinico: docBackend.historial_clinico || 0,
    tipo: mapearTipoDocumento(docBackend.tipo_documento),
    archivo: docBackend.archivo,
    descripcion: docBackend.descripcion,
    episodio: docBackend.episodio,
    fecha_subida: docBackend.creado,
    nombre_archivo: nombreArchivo,
    tamano_bytes: undefined // No viene del backend
  };
};
