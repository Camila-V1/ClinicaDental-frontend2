/**
 * 🦷 SERVICIO DE ODONTOGRAMA
 * Gestión de odontogramas interactivos
 * Backend: /api/historial/odontogramas/
 */

import apiClient from '../config/apiConfig';
import type { Odontograma } from '../types/odontograma.types';

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
    console.log('📋 Datos:', response.data);
    console.groupEnd();
    
    return response.data;
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
    return response.data;
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
    
    const response = await apiClient.post<Odontograma>(
      `/api/historial/odontogramas/`,
      payload
    );
    
    console.log('✅ [ODONTOGRAMA] Odontograma creado:', response.data);
    return response.data;
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
    return response.data;
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
    return response.data;
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
