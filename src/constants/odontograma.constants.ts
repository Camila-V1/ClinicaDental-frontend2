import type { PiezaFDI } from '../types/odontograma.types';

/**
 * 🦷 Nomenclatura FDI completa para dentición adulta (32 piezas)
 * 
 * Cuadrantes:
 * 1: Superior derecho (11-18)
 * 2: Superior izquierdo (21-28)
 * 3: Inferior izquierdo (31-38)
 * 4: Inferior derecho (41-48)
 */
export const PIEZAS_ADULTO: PiezaFDI[] = [
  // Cuadrante 1 (Superior derecho)
  { numero: '18', nombre: 'Tercer molar superior derecho', cuadrante: 1, posicion: 8, tipo: 'molar' },
  { numero: '17', nombre: 'Segundo molar superior derecho', cuadrante: 1, posicion: 7, tipo: 'molar' },
  { numero: '16', nombre: 'Primer molar superior derecho', cuadrante: 1, posicion: 6, tipo: 'molar' },
  { numero: '15', nombre: 'Segundo premolar superior derecho', cuadrante: 1, posicion: 5, tipo: 'premolar' },
  { numero: '14', nombre: 'Primer premolar superior derecho', cuadrante: 1, posicion: 4, tipo: 'premolar' },
  { numero: '13', nombre: 'Canino superior derecho', cuadrante: 1, posicion: 3, tipo: 'canino' },
  { numero: '12', nombre: 'Incisivo lateral superior derecho', cuadrante: 1, posicion: 2, tipo: 'incisivo' },
  { numero: '11', nombre: 'Incisivo central superior derecho', cuadrante: 1, posicion: 1, tipo: 'incisivo' },
  
  // Cuadrante 2 (Superior izquierdo)
  { numero: '21', nombre: 'Incisivo central superior izquierdo', cuadrante: 2, posicion: 1, tipo: 'incisivo' },
  { numero: '22', nombre: 'Incisivo lateral superior izquierdo', cuadrante: 2, posicion: 2, tipo: 'incisivo' },
  { numero: '23', nombre: 'Canino superior izquierdo', cuadrante: 2, posicion: 3, tipo: 'canino' },
  { numero: '24', nombre: 'Primer premolar superior izquierdo', cuadrante: 2, posicion: 4, tipo: 'premolar' },
  { numero: '25', nombre: 'Segundo premolar superior izquierdo', cuadrante: 2, posicion: 5, tipo: 'premolar' },
  { numero: '26', nombre: 'Primer molar superior izquierdo', cuadrante: 2, posicion: 6, tipo: 'molar' },
  { numero: '27', nombre: 'Segundo molar superior izquierdo', cuadrante: 2, posicion: 7, tipo: 'molar' },
  { numero: '28', nombre: 'Tercer molar superior izquierdo', cuadrante: 2, posicion: 8, tipo: 'molar' },
  
  // Cuadrante 3 (Inferior izquierdo)
  { numero: '38', nombre: 'Tercer molar inferior izquierdo', cuadrante: 3, posicion: 8, tipo: 'molar' },
  { numero: '37', nombre: 'Segundo molar inferior izquierdo', cuadrante: 3, posicion: 7, tipo: 'molar' },
  { numero: '36', nombre: 'Primer molar inferior izquierdo', cuadrante: 3, posicion: 6, tipo: 'molar' },
  { numero: '35', nombre: 'Segundo premolar inferior izquierdo', cuadrante: 3, posicion: 5, tipo: 'premolar' },
  { numero: '34', nombre: 'Primer premolar inferior izquierdo', cuadrante: 3, posicion: 4, tipo: 'premolar' },
  { numero: '33', nombre: 'Canino inferior izquierdo', cuadrante: 3, posicion: 3, tipo: 'canino' },
  { numero: '32', nombre: 'Incisivo lateral inferior izquierdo', cuadrante: 3, posicion: 2, tipo: 'incisivo' },
  { numero: '31', nombre: 'Incisivo central inferior izquierdo', cuadrante: 3, posicion: 1, tipo: 'incisivo' },
  
  // Cuadrante 4 (Inferior derecho)
  { numero: '41', nombre: 'Incisivo central inferior derecho', cuadrante: 4, posicion: 1, tipo: 'incisivo' },
  { numero: '42', nombre: 'Incisivo lateral inferior derecho', cuadrante: 4, posicion: 2, tipo: 'incisivo' },
  { numero: '43', nombre: 'Canino inferior derecho', cuadrante: 4, posicion: 3, tipo: 'canino' },
  { numero: '44', nombre: 'Primer premolar inferior derecho', cuadrante: 4, posicion: 4, tipo: 'premolar' },
  { numero: '45', nombre: 'Segundo premolar inferior derecho', cuadrante: 4, posicion: 5, tipo: 'premolar' },
  { numero: '46', nombre: 'Primer molar inferior derecho', cuadrante: 4, posicion: 6, tipo: 'molar' },
  { numero: '47', nombre: 'Segundo molar inferior derecho', cuadrante: 4, posicion: 7, tipo: 'molar' },
  { numero: '48', nombre: 'Tercer molar inferior derecho', cuadrante: 4, posicion: 8, tipo: 'molar' }
];

/**
 * Nomenclatura para dentición temporal (niños - 20 piezas)
 * 
 * Cuadrantes:
 * 5: Superior derecho (51-55)
 * 6: Superior izquierdo (61-65)
 * 7: Inferior izquierdo (71-75)
 * 8: Inferior derecho (81-85)
 */
export const PIEZAS_NINO: PiezaFDI[] = [
  // Cuadrante 5 (Superior derecho)
  { numero: '55', nombre: 'Segundo molar temporal superior derecho', cuadrante: 1, posicion: 5, tipo: 'molar' },
  { numero: '54', nombre: 'Primer molar temporal superior derecho', cuadrante: 1, posicion: 4, tipo: 'molar' },
  { numero: '53', nombre: 'Canino temporal superior derecho', cuadrante: 1, posicion: 3, tipo: 'canino' },
  { numero: '52', nombre: 'Incisivo lateral temporal superior derecho', cuadrante: 1, posicion: 2, tipo: 'incisivo' },
  { numero: '51', nombre: 'Incisivo central temporal superior derecho', cuadrante: 1, posicion: 1, tipo: 'incisivo' },
  
  // Cuadrante 6 (Superior izquierdo)
  { numero: '61', nombre: 'Incisivo central temporal superior izquierdo', cuadrante: 2, posicion: 1, tipo: 'incisivo' },
  { numero: '62', nombre: 'Incisivo lateral temporal superior izquierdo', cuadrante: 2, posicion: 2, tipo: 'incisivo' },
  { numero: '63', nombre: 'Canino temporal superior izquierdo', cuadrante: 2, posicion: 3, tipo: 'canino' },
  { numero: '64', nombre: 'Primer molar temporal superior izquierdo', cuadrante: 2, posicion: 4, tipo: 'molar' },
  { numero: '65', nombre: 'Segundo molar temporal superior izquierdo', cuadrante: 2, posicion: 5, tipo: 'molar' },
  
  // Cuadrante 7 (Inferior izquierdo)
  { numero: '75', nombre: 'Segundo molar temporal inferior izquierdo', cuadrante: 3, posicion: 5, tipo: 'molar' },
  { numero: '74', nombre: 'Primer molar temporal inferior izquierdo', cuadrante: 3, posicion: 4, tipo: 'molar' },
  { numero: '73', nombre: 'Canino temporal inferior izquierdo', cuadrante: 3, posicion: 3, tipo: 'canino' },
  { numero: '72', nombre: 'Incisivo lateral temporal inferior izquierdo', cuadrante: 3, posicion: 2, tipo: 'incisivo' },
  { numero: '71', nombre: 'Incisivo central temporal inferior izquierdo', cuadrante: 3, posicion: 1, tipo: 'incisivo' },
  
  // Cuadrante 8 (Inferior derecho)
  { numero: '81', nombre: 'Incisivo central temporal inferior derecho', cuadrante: 4, posicion: 1, tipo: 'incisivo' },
  { numero: '82', nombre: 'Incisivo lateral temporal inferior derecho', cuadrante: 4, posicion: 2, tipo: 'incisivo' },
  { numero: '83', nombre: 'Canino temporal inferior derecho', cuadrante: 4, posicion: 3, tipo: 'canino' },
  { numero: '84', nombre: 'Primer molar temporal inferior derecho', cuadrante: 4, posicion: 4, tipo: 'molar' },
  { numero: '85', nombre: 'Segundo molar temporal inferior derecho', cuadrante: 4, posicion: 5, tipo: 'molar' }
];

/**
 * Obtiene las piezas según el tipo de dentición
 */
export const obtenerPiezasPorTipo = (tipo: 'ADULTO' | 'NIÑO'): PiezaFDI[] => {
  return tipo === 'ADULTO' ? PIEZAS_ADULTO : PIEZAS_NINO;
};

/**
 * Agrupa las piezas por cuadrante
 */
export const agruparPorCuadrante = (piezas: PiezaFDI[]) => {
  const cuadrante1 = piezas.filter(p => p.cuadrante === 1);
  const cuadrante2 = piezas.filter(p => p.cuadrante === 2);
  const cuadrante3 = piezas.filter(p => p.cuadrante === 3);
  const cuadrante4 = piezas.filter(p => p.cuadrante === 4);

  return {
    superior: [...cuadrante1.reverse(), ...cuadrante2],
    inferior: [...cuadrante4.reverse(), ...cuadrante3]
  };
};
