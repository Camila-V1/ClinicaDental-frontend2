/**
 * 📥 Utilidades para Exportación de Archivos
 */

/**
 * Descarga un archivo desde una URL con autenticación
 */
export const descargarArchivo = async (
  url: string,
  nombreArchivo: string,
  tipoContenido: string = 'application/octet-stream'
): Promise<boolean> => {
  try {
    const token = localStorage.getItem('access_token');
    const tenant = localStorage.getItem('tenant') || '';
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Tenant': tenant
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(new Blob([blob], { type: tipoContenido }));
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpiar
    window.URL.revokeObjectURL(blobUrl);
    
    return true;
  } catch (error) {
    console.error('Error al descargar archivo:', error);
    throw error;
  }
};

/**
 * Obtener nombre de archivo con timestamp
 */
export const getNombreArchivoConFecha = (
  prefijo: string,
  extension: string
): string => {
  const fecha = new Date().toISOString().split('T')[0];
  const hora = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
  return `${prefijo}_${fecha}_${hora}.${extension}`;
};

/**
 * Descargar reporte en formato específico
 */
export const descargarReporte = async (
  endpoint: string,
  formato: 'pdf' | 'excel',
  params: Record<string, any> = {},
  nombreBase: string = 'reporte'
): Promise<void> => {
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  const queryParams = new URLSearchParams({
    ...params,
    formato
  }).toString();
  
  const url = `${baseURL}/reportes/reportes/${endpoint}/?${queryParams}`;
  
  const extension = formato === 'pdf' ? 'pdf' : 'xlsx';
  const tipoContenido = formato === 'pdf' 
    ? 'application/pdf' 
    : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  
  const nombreArchivo = getNombreArchivoConFecha(nombreBase, extension);
  
  await descargarArchivo(url, nombreArchivo, tipoContenido);
};

/**
 * Convertir datos a CSV y descargar
 */
export const exportarACSV = (
  datos: any[],
  nombreArchivo: string,
  columnas?: string[]
): void => {
  if (!datos.length) {
    throw new Error('No hay datos para exportar');
  }

  // Obtener columnas automáticamente si no se especifican
  const cols = columnas || Object.keys(datos[0]);
  
  // Crear header
  let csv = cols.join(',') + '\n';
  
  // Crear filas
  datos.forEach(row => {
    const values = cols.map(col => {
      const valor = row[col];
      // Escapar comillas y envolver en comillas si contiene coma
      if (typeof valor === 'string' && (valor.includes(',') || valor.includes('"'))) {
        return `"${valor.replace(/"/g, '""')}"`;
      }
      return valor;
    });
    csv += values.join(',') + '\n';
  });
  
  // Crear blob y descargar
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${nombreArchivo}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
