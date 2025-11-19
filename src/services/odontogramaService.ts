/**
 * 🦷 SERVICIO DE ODONTOGRAMA
 * Gestión de odontogramas interactivos
 * Backend: /api/historial/odontogramas/
 */

import apiClient from '../config/apiConfig';
import type { Odontograma } from '../types/odontograma.types';

/**
 * Detecta el tipo de dentición basándose en las piezas presentes
 */
const detectarTipoDenticion = (estado_piezas: Record<string, any>): 'ADULTO' | 'NIÑO' => {
  const piezas = Object.keys(estado_piezas);
  
  // Si hay piezas de adulto (11-48), es ADULTO
  const hayPiezasAdulto = piezas.some(p => {
    const num = parseInt(p);
    return num >= 11 && num <= 48;
  });
  
  if (hayPiezasAdulto) return 'ADULTO';
  
  // Si hay piezas de niño (51-85), es NIÑO
  const hayPiezasNino = piezas.some(p => {
    const num = parseInt(p);
    return num >= 51 && num <= 85;
  });
  
  if (hayPiezasNino) return 'NIÑO';
  
  // Por defecto, ADULTO
  return 'ADULTO';
};

/**
 * Normaliza un odontograma del backend al formato del frontend
 */
const normalizarOdontograma = (odonto: any): Odontograma => {
  // Detectar tipo de dentición si no viene
  const tipo_denticion = odonto.tipo_denticion || detectarTipoDenticion(odonto.estado_piezas || {});
  
  return {
    ...odonto,
    fecha: odonto.fecha || odonto.fecha_snapshot,
    tipo_denticion,
    notas_generales: odonto.notas_generales || odonto.notas
  };
};

/**
 * Obtener todos los odontogramas de un historial clínico
 */
export const getOdontogramas = async (historialId: number): Promise<Odontograma[]> => {
  console.group('🦷 [ODONTOGRAMA SERVICE] getOdontogramas()');
  console.log('📋 Parámetros:');
  console.log('  - historialId:', historialId);
  console.log('⚠️ Si historialId = 0, la URL será incorrecta');
  
  const url = `/api/historial/odontogramas/`;
  const params = { historial_clinico: historialId };
  
  console.log('🔗 URL:', url);
  console.log('📊 Query params:', params);
  console.log('🌐 URL completa:', url + '?historial_clinico=' + historialId);
  
  try {
    console.log('📡 Haciendo petición GET...');
    const response = await apiClient.get<Odontograma[]>(url, { params });
    
    console.log('✅ Respuesta recibida exitosamente');
    console.log('📊 Cantidad de odontogramas:', response.data.length);
    console.log('📋 Datos raw:', response.data);
    console.groupEnd();
    
    // Normalizar todos los odontogramas
    const normalizados = response.data.map(normalizarOdontograma);
    console.log('✅ [ODONTOGRAMA] Odontogramas normalizados:', normalizados);
    
    return normalizados;
  } catch (error: any) {
    console.error('❌ ERROR en petición');
    console.error('📊 Error completo:', error);
    console.error('📊 Status:', error.response?.status);
    console.error('📊 Data:', error.response?.data);
    console.error('📊 Config URL:', error.config?.url);
    console.groupEnd();
    throw error;
  }
};

/**
 * Obtener un odontograma específico
 */
export const getOdontograma = async (
  historialId: number, 
  odontogramaId: number
): Promise<Odontograma> => {
  console.log('🦷 [ODONTOGRAMA] Obteniendo odontograma:', { historialId, odontogramaId });
  
  try {
    const response = await apiClient.get<Odontograma>(
      `/api/historial/odontogramas/${odontogramaId}/`
    );
    
    console.log('✅ [ODONTOGRAMA] Odontograma obtenido:', response.data);
    return normalizarOdontograma(response.data);
  } catch (error) {
    console.error('❌ [ODONTOGRAMA] Error al obtener odontograma:', error);
    throw error;
  }
};

/**
 * Crear un nuevo odontograma
 */
export const createOdontograma = async (
  historialId: number,
  data: Partial<Odontograma>
): Promise<Odontograma> => {
  console.log('🦷 [ODONTOGRAMA] Creando odontograma:', { historialId, data });
  
  try {
    // Asegurar que el historial_clinico esté en el payload
    const payload = {
      ...data,
      historial_clinico: historialId
    };
    
    console.log('📦 [ODONTOGRAMA] Payload completo a enviar:', JSON.stringify(payload, null, 2));
    console.log('🔍 [ODONTOGRAMA] historial_clinico en payload:', payload.historial_clinico);
    
    const response = await apiClient.post<Odontograma>(
      `/api/historial/odontogramas/`,
      payload
    );
    
    console.log('✅ [ODONTOGRAMA] Odontograma creado:', response.data);
    return normalizarOdontograma(response.data);
  } catch (error) {
    console.error('❌ [ODONTOGRAMA] Error al crear odontograma:', error);
    throw error;
  }
};

/**
 * Actualizar un odontograma existente
 */
export const updateOdontograma = async (
  historialId: number,
  odontogramaId: number,
  data: Partial<Odontograma>
): Promise<Odontograma> => {
  console.log('🦷 [ODONTOGRAMA] Actualizando odontograma:', { 
    historialId, 
    odontogramaId, 
    data 
  });
  
  try {
    const response = await apiClient.patch<Odontograma>(
      `/api/historial/odontogramas/${odontogramaId}/`,
      data
    );
    
    console.log('✅ [ODONTOGRAMA] Odontograma actualizado:', response.data);
    return normalizarOdontograma(response.data);
  } catch (error) {
    console.error('❌ [ODONTOGRAMA] Error al actualizar odontograma:', error);
    throw error;
  }
};

/**
 * Duplicar un odontograma existente
 */
export const duplicarOdontograma = async (
  historialId: number,
  odontogramaId: number
): Promise<Odontograma> => {
  console.log('🦷 [ODONTOGRAMA] Duplicando odontograma:', { historialId, odontogramaId });
  
  try {
    const response = await apiClient.post<Odontograma>(
      `/api/historial/odontogramas/${odontogramaId}/duplicar/`
    );
    
    console.log('✅ [ODONTOGRAMA] Odontograma duplicado:', response.data);
    return normalizarOdontograma(response.data);
  } catch (error) {
    console.error('❌ [ODONTOGRAMA] Error al duplicar odontograma:', error);
    throw error;
  }
};

/**
 * Eliminar un odontograma
 */
export const deleteOdontograma = async (
  historialId: number,
  odontogramaId: number
): Promise<void> => {
  console.log('🦷 [ODONTOGRAMA] Eliminando odontograma:', { historialId, odontogramaId });
  
  try {
    await apiClient.delete(
      `/api/historial/odontogramas/${odontogramaId}/`
    );
    
    console.log('✅ [ODONTOGRAMA] Odontograma eliminado exitosamente');
  } catch (error) {
    console.error('❌ [ODONTOGRAMA] Error al eliminar odontograma:', error);
    throw error;
  }
};

// Exportar como objeto por defecto
const odontogramaService = {
  getOdontogramas,
  getOdontograma,
  createOdontograma,
  updateOdontograma,
  duplicarOdontograma,
  deleteOdontograma,
};

export default odontogramaService;
