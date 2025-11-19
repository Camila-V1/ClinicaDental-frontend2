/**
 * 📋 HISTORIAL CLÍNICO SERVICE - Gestión de Historiales Médicos
 */

import api from '../config/apiConfig';

export interface HistorialResumen {
  paciente: number;
  paciente_nombre: string;
  paciente_email: string;
  alergias?: string;
  medicamentos_actuales?: string;
  actualizado: string;
  total_episodios: number;
  ultimo_episodio?: string;
}

export interface EpisodioAtencion {
  id: number;
  odontologo: number;
  odontologo_nombre: string;
  odontologo_especialidad?: string;
  item_plan_tratamiento?: number;
  item_plan_descripcion?: string;
  fecha_atencion: string;
  motivo_consulta: string;
  diagnostico?: string;
  descripcion_procedimiento?: string;
  notas_privadas?: string;
}

export interface Odontograma {
  id: number;
  fecha_snapshot: string;
  estado_piezas: Record<string, any>;
  notas?: string;
}

export interface HistorialCompleto {
  paciente: number;
  paciente_nombre: string;
  paciente_email: string;
  paciente_ci?: string;
  paciente_telefono?: string;
  paciente_fecha_nacimiento?: string;
  paciente_direccion?: string;
  
  antecedentes_medicos?: string;
  alergias?: string;
  medicamentos_actuales?: string;
  
  creado: string;
  actualizado: string;
  
  total_episodios: number;
  total_odontogramas: number;
  total_documentos: number;
  ultimo_episodio?: string;
  
  episodios: EpisodioAtencion[];
  odontogramas: Odontograma[];
  documentos: any[];
}

export interface CrearEpisodioDTO {
  historial_clinico: number;
  motivo_consulta: string;
  diagnostico?: string;
  descripcion_procedimiento?: string;
  notas_privadas?: string;
  // 🎯 GUÍA 18: Campos para vincular con planes de tratamiento
  item_plan_tratamiento?: number;  // ID del ítem del plan (si se vincula)
  servicio?: number;  // ID del servicio (para episodios libres)
}

/**
 * Obtener lista de historiales clínicos
 */
export const obtenerHistoriales = async (): Promise<HistorialResumen[]> => {
  console.log('📋 Obteniendo lista de historiales...');
  const response = await api.get<HistorialResumen[]>('/api/historial/historiales/');
  console.log('✅ Historiales recibidos:', response.data.length);
  return response.data;
};

/**
 * Obtener historial completo de un paciente
 */
export const obtenerHistorialCompleto = async (pacienteId: number): Promise<HistorialCompleto> => {
  console.log('📋 Obteniendo historial completo del paciente:', pacienteId);
  const response = await api.get<HistorialCompleto>(`/api/historial/historiales/${pacienteId}/`);
  console.log('✅ Historial completo recibido:', response.data);
  console.log('🔍 DETALLE - CI:', response.data.paciente_ci);
  console.log('🔍 DETALLE - Teléfono:', response.data.paciente_telefono);
  console.log('🔍 DETALLE - Fecha Nac:', response.data.paciente_fecha_nacimiento);
  console.log('🔍 DETALLE - Dirección:', response.data.paciente_direccion);
  console.log('🔍 DETALLE - Nombre:', response.data.paciente_nombre);
  console.log('🔍 DETALLE - Email:', response.data.paciente_email);
  console.log('🔍 DETALLE - Alergias:', response.data.alergias);
  console.log('🔍 DETALLE - Medicamentos:', response.data.medicamentos_actuales);
  console.log('🔍 DETALLE - Antecedentes:', response.data.antecedentes_medicos);
  console.log('📊 OBJETO COMPLETO:', JSON.stringify(response.data, null, 2));
  return response.data;
};

/**
 * Obtener todos los episodios
 */
export const obtenerEpisodios = async (): Promise<EpisodioAtencion[]> => {
  const response = await api.get<EpisodioAtencion[]>('/api/historial/episodios/');
  return response.data;
};

/**
 * Crear nuevo episodio de atención
 */
export const crearEpisodio = async (datos: CrearEpisodioDTO): Promise<EpisodioAtencion> => {
  const response = await api.post<EpisodioAtencion>('/api/historial/episodios/', datos);
  return response.data;
};

/**
 * Obtener mis episodios (del odontólogo logueado)
 */
export const obtenerMisEpisodios = async (): Promise<EpisodioAtencion[]> => {
  const response = await api.get<EpisodioAtencion[]>('/api/historial/episodios/mis_episodios/');
  return response.data;
};

/**
 * Obtener todos los odontogramas
 */
export const obtenerOdontogramas = async (): Promise<Odontograma[]> => {
  const response = await api.get<Odontograma[]>('/api/historial/odontogramas/');
  return response.data;
};

// ============================================
// 📋 FUNCIONES PARA PACIENTES
// ============================================

export interface OdontogramaDetalle {
  id: number;
  estado_piezas: {
    [pieza: string]: {
      estado: 'sano' | 'caries' | 'obturado' | 'extraido' | 'endodoncia' | 'protesis';
      observacion?: string;
    };
  };
  observaciones: string;
  fecha_ultima_actualizacion: string;
}

export interface EpisodioAtencionPaciente {
  id: number;
  fecha_atencion: string;
  odontologo: number;
  odontologo_nombre: string;
  motivo_consulta: string;
  diagnostico: string;
  tratamiento_realizado: string;
  observaciones: string;
  proxima_cita: number | null;
  cita: number | null;
}

export interface HistorialClinicoPaciente {
  id: number;
  paciente: number;
  paciente_info: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
  };
  fecha_apertura: string;
  alergias: string;
  medicamentos_actuales: string;
  antecedentes_medicos: string;
  observaciones_generales: string;
  odontograma: OdontogramaDetalle;
  episodios: EpisodioAtencionPaciente[];
  documentos: DocumentoClinico[]; // 📄 Documentos clínicos del historial
}

export interface DocumentoClinico {
  id: number;
  tipo_documento: string;
  descripcion: string;
  archivo: string;
  creado: string;
  episodio: number | null;
}

/**
 * Obtener el historial clínico completo del paciente autenticado
 */
export const obtenerMiHistorial = async (): Promise<HistorialClinicoPaciente> => {
  console.log('📋 Obteniendo mi historial clínico...');
  
  try {
    // Intenta usar el endpoint específico para pacientes
    const response = await api.get<any>(
      '/api/historial/historiales/mi_historial/'
    );
    
    console.log('✅ Historial obtenido:', response.data);
    console.log('📄 Documentos en respuesta backend:', response.data.documentos);
    console.log('📄 Total documentos (backend):', response.data.total_documentos);
    console.log('📄 Longitud array documentos:', response.data.documentos?.length);
    
    // Adaptar la respuesta al formato esperado
    const historial = response.data;
    const historialAdaptado: HistorialClinicoPaciente = {
      id: historial.paciente,
      paciente: historial.paciente,
      paciente_info: {
        id: historial.paciente,
        nombre: historial.paciente_nombre?.split(' ')[0] || '',
        apellido: historial.paciente_nombre?.split(' ').slice(1).join(' ') || '',
        email: historial.paciente_email
      },
      fecha_apertura: historial.creado || new Date().toISOString(),
      alergias: historial.alergias || '',
      medicamentos_actuales: historial.medicamentos_actuales || '',
      antecedentes_medicos: historial.antecedentes_medicos || '',
      observaciones_generales: '',
      odontograma: historial.odontogramas?.[0] || {
        id: 0,
        estado_piezas: {},
        observaciones: '',
        fecha_ultima_actualizacion: new Date().toISOString()
      },
      episodios: (historial.episodios || []).map((ep: any) => ({
        id: ep.id,
        fecha_atencion: ep.fecha_atencion,
        odontologo: ep.odontologo,
        odontologo_nombre: ep.odontologo_nombre,
        motivo_consulta: ep.motivo_consulta,
        diagnostico: ep.diagnostico || '',
        tratamiento_realizado: ep.descripcion_procedimiento || '',
        observaciones: ep.notas_privadas || '',
        proxima_cita: null,
        cita: null
      })),
      documentos: historial.documentos || [] // 📄 Mapear documentos del backend
    };
    
    console.log('✅ Historial adaptado:', historialAdaptado);
    console.log('✅ Documentos adaptados:', historialAdaptado.documentos?.length || 0);
    return historialAdaptado;
  } catch (error: any) {
    // Si falla (404), usa el endpoint alternativo obteniendo el historial por ID de usuario
    console.warn('⚠️ Endpoint mi_historial no disponible, usando método alternativo');
    
    // Primero obtener la lista para encontrar el historial del usuario actual
    const historiales = await api.get<HistorialResumen[]>('/api/historial/historiales/');
    console.log('📋 Historiales disponibles:', historiales.data);
    
    if (historiales.data.length === 0) {
      throw new Error('No se encontró historial clínico');
    }
    
    // Tomar el primer historial (debería ser el del paciente autenticado)
    const miHistorial = historiales.data[0];
    const historialCompleto = await obtenerHistorialCompleto(miHistorial.paciente);
    
    // Adaptar la respuesta al formato esperado
    const historialAdaptado: HistorialClinicoPaciente = {
      id: miHistorial.paciente,
      paciente: miHistorial.paciente,
      paciente_info: {
        id: miHistorial.paciente,
        nombre: historialCompleto.paciente_nombre.split(' ')[0] || '',
        apellido: historialCompleto.paciente_nombre.split(' ').slice(1).join(' ') || '',
        email: historialCompleto.paciente_email
      },
      fecha_apertura: historialCompleto.creado,
      alergias: historialCompleto.alergias || '',
      medicamentos_actuales: historialCompleto.medicamentos_actuales || '',
      antecedentes_medicos: historialCompleto.antecedentes_medicos || '',
      observaciones_generales: '',
      odontograma: {
        id: 0,
        estado_piezas: {},
        observaciones: '',
        fecha_ultima_actualizacion: new Date().toISOString()
      },
      episodios: historialCompleto.episodios.map(ep => ({
        id: ep.id,
        fecha_atencion: ep.fecha_atencion,
        odontologo: ep.odontologo,
        odontologo_nombre: ep.odontologo_nombre,
        motivo_consulta: ep.motivo_consulta,
        diagnostico: ep.diagnostico || '',
        tratamiento_realizado: ep.descripcion_procedimiento || '',
        observaciones: ep.notas_privadas || '',
        proxima_cita: null,
        cita: null
      })),
      documentos: historialCompleto.documentos || [] // 📄 Mapear documentos del fallback
    };
    
    console.log('✅ Historial adaptado:', historialAdaptado);
    return historialAdaptado;
  }
};

/**
 * Obtener todos los episodios del paciente autenticado
 */
export const obtenerMisEpisodiosPaciente = async (): Promise<EpisodioAtencionPaciente[]> => {
  console.log('📋 Obteniendo mis episodios de atención...');
  
  const response = await api.get<EpisodioAtencionPaciente[]>(
    '/api/historial/episodios/mis_episodios/'
  );
  
  console.log(`✅ ${response.data.length} episodios obtenidos`);
  return response.data;
};

/**
 * Obtener documentos clínicos de un historial
 */
export const obtenerDocumentosHistorial = async (
  historialId: number
): Promise<DocumentoClinico[]> => {
  console.log(`📄 Obteniendo documentos del historial ${historialId}...`);
  
  const response = await api.get<DocumentoClinico[]>(
    '/api/historial/documentos/',
    { params: { historial_clinico: historialId } }
  );
  
  console.log(`✅ ${response.data.length} documentos obtenidos`);
  return response.data;
};

/**
 * Descargar un documento clínico
 */
export const descargarDocumento = (archivoUrl: string, nombreArchivo?: string): void => {
  console.log('📥 Descargando documento:', nombreArchivo || archivoUrl);
  
  try {
    const link = document.createElement('a');
    link.href = archivoUrl;
    if (nombreArchivo) {
      link.download = nombreArchivo;
    }
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ Descarga iniciada');
  } catch (error) {
    console.error('❌ Error descargando documento:', error);
  }
};

// ============================================
// FUNCIONES AUXILIARES PARA HISTORIAL COMPLETO
// ============================================

/**
 * Formatea fecha a texto legible en español
 */
export const formatearFecha = (fechaISO: string): string => {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Obtiene el color según el tipo de episodio
 */
export const getTipoEpisodioColor = (tipo: string): string => {
  switch (tipo?.toUpperCase()) {
    case 'CONSULTA':
      return 'bg-blue-100 text-blue-800';
    case 'EMERGENCIA':
      return 'bg-red-100 text-red-800';
    case 'CONTROL':
      return 'bg-green-100 text-green-800';
    case 'TRATAMIENTO':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Obtiene el icono según el tipo de episodio
 */
export const getTipoEpisodioIcono = (tipo: string): string => {
  switch (tipo?.toUpperCase()) {
    case 'CONSULTA':
      return '🩺';
    case 'EMERGENCIA':
      return '🚨';
    case 'CONTROL':
      return '✅';
    case 'TRATAMIENTO':
      return '🦷';
    default:
      return '📋';
  }
};

/**
 * Obtiene el color según el tipo de documento
 */
export const getTipoDocumentoColor = (tipo: string): string => {
  switch (tipo?.toUpperCase()) {
    case 'RADIOGRAFIA':
      return 'bg-purple-100 text-purple-800';
    case 'RECETA':
      return 'bg-green-100 text-green-800';
    case 'ESTUDIO':
      return 'bg-blue-100 text-blue-800';
    case 'CONSENTIMIENTO':
      return 'bg-yellow-100 text-yellow-800';
    case 'FOTO':
      return 'bg-pink-100 text-pink-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Obtiene el icono según el tipo de documento
 */
export const getTipoDocumentoIcono = (tipo: string): string => {
  switch (tipo?.toUpperCase()) {
    case 'RADIOGRAFIA':
      return '🔬';
    case 'RECETA':
      return '💊';
    case 'ESTUDIO':
      return '📊';
    case 'CONSENTIMIENTO':
      return '📝';
    case 'FOTO':
      return '📷';
    default:
      return '📄';
  }
};

/**
 * Agrupa episodios por mes
 */
export const agruparEpisodiosPorMes = (episodios: any[]): any => {
  const grupos: any = {};
  
  episodios.forEach(episodio => {
    const fecha = new Date(episodio.fecha_atencion || episodio.fecha);
    const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    const mesNombre = fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    
    if (!grupos[mesKey]) {
      grupos[mesKey] = {
        nombre: mesNombre.charAt(0).toUpperCase() + mesNombre.slice(1),
        episodios: []
      };
    }
    
    grupos[mesKey].episodios.push(episodio);
  });
  
  // Convertir a array y ordenar por fecha descendente
  return Object.entries(grupos)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([, value]) => value);
};

/**
 * Obtiene detalle de un episodio específico
 */
export const obtenerDetalleEpisodio = async (episodioId: number): Promise<any> => {
  console.log(`📋 Obteniendo episodio ${episodioId}...`);
  
  try {
    const response = await api.get(`/api/historial/episodios/${episodioId}/`);
    console.log('✅ Episodio obtenido:', response.data);
    console.log('📄 Documentos adjuntos:', response.data.documentos?.length || 0);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo episodio:', error);
    throw error;
  }
};

/**
 * Obtiene el episodio anterior y siguiente para navegación
 */
export const obtenerEpisodiosNavegacion = async (
  episodioActualId: number
): Promise<{ anterior: number | null; siguiente: number | null }> => {
  console.log(`🔍 Obteniendo episodios para navegación...`);
  
  try {
    // Obtener el historial completo
    const historial = await obtenerMiHistorial();
    const episodios = historial.episodios || [];
    
    // Ordenar por fecha descendente (más reciente primero)
    const episodiosOrdenados = [...episodios].sort(
      (a, b) => new Date(b.fecha_atencion).getTime() - new Date(a.fecha_atencion).getTime()
    );
    
    // Encontrar índice del episodio actual
    const indiceActual = episodiosOrdenados.findIndex(e => e.id === episodioActualId);
    
    return {
      anterior: indiceActual > 0 ? episodiosOrdenados[indiceActual - 1].id : null,
      siguiente: indiceActual < episodiosOrdenados.length - 1 
        ? episodiosOrdenados[indiceActual + 1].id 
        : null
    };
  } catch (error) {
    console.error('❌ Error obteniendo navegación:', error);
    return { anterior: null, siguiente: null };
  }
};

/**
 * Obtiene el odontograma completo del paciente
 */
export const obtenerOdontograma = async (): Promise<any> => {
  console.log('🦷 Obteniendo odontograma...');
  
  try {
    const historial = await obtenerMiHistorial();
    
    // Construir odontograma desde episodios
    const odontograma = construirOdontograma(historial.episodios || []);
    
    console.log('✅ Odontograma construido:', odontograma);
    return odontograma;
  } catch (error) {
    console.error('❌ Error obteniendo odontograma:', error);
    throw error;
  }
};

/**
 * Construye el odontograma desde los episodios
 */
const construirOdontograma = (episodios: any[]): any => {
  const odontograma: any = {};
  
  // Inicializar todos los dientes como SANO
  for (let i = 1; i <= 4; i++) {
    for (let j = 1; j <= 8; j++) {
      const numero = `${i}${j}`;
      odontograma[numero] = {
        numero,
        nombre: getNombreDiente(numero),
        estado: 'SANO',
        tratamientos: [],
        notas: ''
      };
    }
  }
  
  // Procesar episodios y actualizar estados
  episodios.forEach(episodio => {
    // Extraer números de dientes del diagnóstico o tratamiento
    const dientesAfectados = extraerDientesDelTexto(
      `${episodio.diagnostico || ''} ${episodio.tratamiento_realizado || ''} ${episodio.descripcion_procedimiento || ''}`
    );
    
    dientesAfectados.forEach(numero => {
      if (odontograma[numero]) {
        // Agregar tratamiento
        odontograma[numero].tratamientos.push({
          tipo: clasificarTratamiento(episodio.tratamiento_realizado || episodio.descripcion_procedimiento || ''),
          fecha: episodio.fecha_atencion,
          descripcion: episodio.tratamiento_realizado || episodio.descripcion_procedimiento || episodio.diagnostico || 'Sin descripción',
          episodio_id: episodio.id
        });
        
        // Actualizar estado según tratamiento
        odontograma[numero].estado = determinarEstadoDiente(
          odontograma[numero].tratamientos
        );
      }
    });
  });
  
  return odontograma;
};

/**
 * Extrae números de dientes del texto (ej: "pieza 16", "diente 26")
 */
const extraerDientesDelTexto = (texto: string): string[] => {
  const regex = /\b(pieza|diente|molar|premolar|incisivo|canino)?\s*([1-4][1-8])\b/gi;
  const matches = texto.matchAll(regex);
  const dientes = new Set<string>();
  
  for (const match of matches) {
    dientes.add(match[2]);
  }
  
  return Array.from(dientes);
};

/**
 * Clasifica el tipo de tratamiento
 */
const clasificarTratamiento = (tratamiento: string): string => {
  const texto = tratamiento.toLowerCase();
  
  if (texto.includes('obturación') || texto.includes('restauración') || texto.includes('resina')) return 'OBTURACION';
  if (texto.includes('endodoncia') || texto.includes('conducto')) return 'ENDODONCIA';
  if (texto.includes('extracción') || texto.includes('exodoncia')) return 'EXTRACCION';
  if (texto.includes('corona') || texto.includes('prótesis')) return 'CORONA';
  if (texto.includes('limpieza') || texto.includes('profilaxis')) return 'LIMPIEZA';
  if (texto.includes('implante')) return 'IMPLANTE';
  
  return 'OTRO';
};

/**
 * Determina el estado del diente según sus tratamientos
 */
const determinarEstadoDiente = (tratamientos: any[]): string => {
  if (tratamientos.length === 0) return 'SANO';
  
  const ultimoTratamiento = tratamientos[tratamientos.length - 1];
  
  switch (ultimoTratamiento.tipo) {
    case 'EXTRACCION':
      return 'AUSENTE';
    case 'IMPLANTE':
      return 'IMPLANTE';
    case 'ENDODONCIA':
    case 'CORONA':
    case 'OBTURACION':
      return 'TRATADO';
    default:
      return 'OBSERVACION';
  }
};

/**
 * Obtiene el nombre descriptivo de un diente
 */
export const getNombreDiente = (numero: string): string => {
  const cuadrante = numero[0];
  const posicion = numero[1];
  
  let nombreCuadrante = '';
  switch (cuadrante) {
    case '1': nombreCuadrante = 'Superior Derecho'; break;
    case '2': nombreCuadrante = 'Superior Izquierdo'; break;
    case '3': nombreCuadrante = 'Inferior Izquierdo'; break;
    case '4': nombreCuadrante = 'Inferior Derecho'; break;
  }
  
  let nombrePosicion = '';
  switch (posicion) {
    case '1': nombrePosicion = 'Incisivo Central'; break;
    case '2': nombrePosicion = 'Incisivo Lateral'; break;
    case '3': nombrePosicion = 'Canino'; break;
    case '4': nombrePosicion = 'Primer Premolar'; break;
    case '5': nombrePosicion = 'Segundo Premolar'; break;
    case '6': nombrePosicion = 'Primer Molar'; break;
    case '7': nombrePosicion = 'Segundo Molar'; break;
    case '8': nombrePosicion = 'Tercer Molar (Muela del Juicio)'; break;
  }
  
  return `${nombrePosicion} ${nombreCuadrante}`;
};

/**
 * Obtiene el color según el estado del diente
 */
export const getColorEstadoDiente = (estado: string): string => {
  switch (estado?.toUpperCase()) {
    case 'SANO':
      return 'bg-green-100 border-green-500 hover:bg-green-200';
    case 'TRATADO':
      return 'bg-blue-100 border-blue-500 hover:bg-blue-200';
    case 'AUSENTE':
      return 'bg-gray-200 border-gray-400 hover:bg-gray-300';
    case 'CARIES':
      return 'bg-red-100 border-red-500 hover:bg-red-200';
    case 'OBSERVACION':
      return 'bg-yellow-100 border-yellow-500 hover:bg-yellow-200';
    case 'IMPLANTE':
      return 'bg-purple-100 border-purple-500 hover:bg-purple-200';
    default:
      return 'bg-gray-100 border-gray-300 hover:bg-gray-200';
  }
};

/**
 * Obtiene el icono según el estado del diente
 */
export const getIconoEstadoDiente = (estado: string): string => {
  switch (estado?.toUpperCase()) {
    case 'SANO': return '✅';
    case 'TRATADO': return '🔧';
    case 'AUSENTE': return '❌';
    case 'CARIES': return '🔴';
    case 'OBSERVACION': return '⚠️';
    case 'IMPLANTE': return '⚙️';
    default: return '🦷';
  }
};
