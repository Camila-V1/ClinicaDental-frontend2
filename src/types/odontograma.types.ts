/**
 * 🦷 Tipos para el Odontograma Interactivo
 */

// Tipo de dentición
export type TipoDenticion = 'ADULTO' | 'NIÑO';

// Estados posibles de una pieza dental
export type EstadoPieza = 
  | 'sano'
  | 'caries'
  | 'restaurado'
  | 'corona'
  | 'endodoncia'
  | 'extraido'
  | 'ausente'
  | 'implante'
  | 'protesis'
  | 'fractura';

// Superficies dentales (para marcar ubicación)
export type SuperficieDental = 
  | 'oclusal'    // Superficie de masticación
  | 'mesial'     // Lado hacia el centro
  | 'distal'     // Lado hacia afuera
  | 'vestibular' // Lado hacia labios/mejillas
  | 'lingual'    // Lado hacia lengua/paladar
  | 'palatino';  // Lado hacia paladar (dientes superiores)

// Materiales de restauración
export type MaterialRestauracion = 
  | 'resina'
  | 'amalgama'
  | 'porcelana'
  | 'oro'
  | 'zirconio'
  | 'otro';

// Estado de una pieza dental individual
export interface EstadoPiezaDental {
  estado: EstadoPieza;
  superficie?: SuperficieDental[]; // Superficies afectadas
  material?: MaterialRestauracion; // Si es restauración
  notas?: string; // Observaciones específicas
}

// Odontograma completo
export interface Odontograma {
  id?: number;
  historial_clinico: number;
  fecha: string; // ISO date
  tipo_denticion: TipoDenticion;
  estado_piezas: Record<string, EstadoPiezaDental>; // Key: número pieza (FDI)
  notas_generales?: string;
  odontologo?: number;
  odontologo_nombre?: string;
  creado?: string;
  actualizado?: string;
}

// Nomenclatura FDI (Federation Dentaire Internationale)
export interface PiezaFDI {
  numero: string; // "11", "12", etc.
  nombre: string; // "Incisivo central superior derecho"
  cuadrante: 1 | 2 | 3 | 4; // Cuadrante dental
  posicion: number; // Posición en el cuadrante (1-8)
  tipo: 'incisivo' | 'canino' | 'premolar' | 'molar';
}

// Configuración de colores por estado
export const COLORES_ESTADO: Record<EstadoPieza, string> = {
  sano: '#81C784',         // Verde claro
  caries: '#E57373',       // Rojo claro
  restaurado: '#64B5F6',   // Azul claro
  corona: '#FFD54F',       // Amarillo
  endodoncia: '#BA68C8',   // Púrpura
  extraido: '#757575',     // Gris
  ausente: '#BDBDBD',      // Gris claro
  implante: '#4DB6AC',     // Turquesa
  protesis: '#FF8A65',     // Naranja
  fractura: '#F06292'      // Rosa
};

// Íconos por estado (emojis)
export const ICONOS_ESTADO: Record<EstadoPieza, string> = {
  sano: '✓',
  caries: '⚠',
  restaurado: '🔧',
  corona: '👑',
  endodoncia: '🔴',
  extraido: '✕',
  ausente: '○',
  implante: '⚙',
  protesis: '🦷',
  fractura: '⚡'
};

// Descripciones de estados
export const DESCRIPCIONES_ESTADO: Record<EstadoPieza, string> = {
  sano: 'Diente sano, sin hallazgos',
  caries: 'Caries dental activa',
  restaurado: 'Restauración previa',
  corona: 'Corona o funda dental',
  endodoncia: 'Tratamiento de conducto',
  extraido: 'Pieza extraída',
  ausente: 'Ausente congénita',
  implante: 'Implante dental',
  protesis: 'Prótesis dental',
  fractura: 'Fractura dental'
};
