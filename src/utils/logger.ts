/**
 * 🐛 LOGGER - Sistema de logging controlado
 * Activa/desactiva logs en toda la aplicación
 */

// 🎛️ CONTROL GLOBAL DE LOGS
// Cambia a false para desactivar todos los logs en producción
const DEBUG_MODE = true; // ← Cambia a false para silenciar logs

export const logger = {
  // Logs informativos
  info: (...args: any[]) => {
    if (DEBUG_MODE) console.log(...args);
  },
  
  // Logs de grupo (con collapse)
  group: (...args: any[]) => {
    if (DEBUG_MODE) console.group(...args);
  },
  
  groupCollapsed: (...args: any[]) => {
    if (DEBUG_MODE) console.groupCollapsed(...args);
  },
  
  groupEnd: () => {
    if (DEBUG_MODE) console.groupEnd();
  },
  
  // Logs de tabla
  table: (data: any) => {
    if (DEBUG_MODE) console.table(data);
  },
  
  // Warnings (siempre se muestran)
  warn: (...args: any[]) => {
    console.warn(...args);
  },
  
  // Errores (siempre se muestran)
  error: (...args: any[]) => {
    console.error(...args);
  },
  
  // Log de performance
  time: (label: string) => {
    if (DEBUG_MODE) console.time(label);
  },
  
  timeEnd: (label: string) => {
    if (DEBUG_MODE) console.timeEnd(label);
  }
};

export default logger;
