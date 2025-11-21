/**
 * 👥 SERVICIO DE PACIENTES
 * Wrapper sobre usuariosService para obtener solo pacientes
 */

import { obtenerUsuarios } from './usuariosService';
import type { Usuario } from './usuariosService';

interface PacientesResponse {
  results: Usuario[];
  count: number;
  next: string | null;
  previous: string | null;
}

/**
 * Obtener lista de pacientes
 */
const getPacientes = async (params?: {
  page?: number;
  search?: string;
}): Promise<PacientesResponse> => {
  const response = await obtenerUsuarios({
    tipo_usuario: 'PACIENTE',
    ...params,
  });
  
  return response;
};

const pacientesService = {
  getPacientes,
};

export default pacientesService;
