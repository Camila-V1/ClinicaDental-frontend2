/**
 * 🏥 Servicio de Historial Clínico
 * Gestión de historiales, episodios, odontogramas y documentos clínicos
 */

import api from '@/config/apiConfig';

// Interfaces
export interface HistorialClinico {
  id: number;
  paciente: number;
  paciente_nombre?: string;
  paciente_email?: string;
  antecedentes_medicos?: string;
  alergias?: string;
  medicamentos_actuales?: string;
  notas_generales?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EpisodioAtencion {
  id: number;
  historial: number;
  odontologo: number;
  odontologo_nombre?: string;
  fecha_atencion: string;
  motivo_consulta: string;
  diagnostico?: string;
  tratamiento_realizado?: string;
  observaciones?: string;
  proximo_control?: string;
  estado: 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO' | 'CANCELADO';
  created_at?: string;
  updated_at?: string;
}

export interface Odontograma {
  id: number;
  episodio?: number;
  historial: number;
  fecha_odontograma: string;
  observaciones?: string;
  dientes: DienteOdontograma[];
  created_at?: string;
}

export interface DienteOdontograma {
  numero_diente: number;
  estado?: string;
  tratamientos?: string[];
  notas?: string;
}

export interface DocumentoClinico {
  id: number;
  historial: number;
  episodio?: number;
  tipo_documento: 'RECETA' | 'ORDEN_LABORATORIO' | 'CONSENTIMIENTO' | 'RADIOGRAFIA' | 'FOTO' | 'OTRO';
  titulo: string;
  descripcion?: string;
  archivo?: string;
  fecha_documento: string;
  created_at?: string;
}

export interface FiltrosHistorial {
  page?: number;
  page_size?: number;
  search?: string;
  paciente?: number;
}

// Servicio de Historial Clínico
export const historialClinicoService = {
  /**
   * HISTORIALES CLÍNICOS
   */
  async getHistoriales(filtros: FiltrosHistorial = {}): Promise<HistorialClinico[]> {
    const params = new URLSearchParams();
    if (filtros.page) params.append('page', filtros.page.toString());
    if (filtros.page_size) params.append('page_size', filtros.page_size.toString());
    if (filtros.search) params.append('search', filtros.search);
    if (filtros.paciente) params.append('paciente', filtros.paciente.toString());

    const { data } = await api.get(`/api/historial-clinico/historiales/?${params}`);
    return data;
  },

  async getHistorial(id: number): Promise<HistorialClinico> {
    const { data } = await api.get(`/api/historial-clinico/historiales/${id}/`);
    return data;
  },

  async createHistorial(paciente_id: number, historialData?: Partial<HistorialClinico>): Promise<HistorialClinico> {
    const { data } = await api.post('/api/historial-clinico/historiales/crear_historial/', {
      paciente_id,
      ...historialData
    });
    return data;
  },

  async updateHistorial(id: number, historialData: Partial<HistorialClinico>): Promise<HistorialClinico> {
    const { data } = await api.put(`/api/historial-clinico/historiales/${id}/`, historialData);
    return data;
  },

  /**
   * EPISODIOS DE ATENCIÓN
   */
  async getEpisodios(filtros: FiltrosHistorial = {}): Promise<EpisodioAtencion[]> {
    const params = new URLSearchParams();
    if (filtros.page) params.append('page', filtros.page.toString());
    if (filtros.page_size) params.append('page_size', filtros.page_size.toString());
    if (filtros.search) params.append('search', filtros.search);

    const { data } = await api.get(`/api/historial-clinico/episodios/?${params}`);
    return data;
  },

  async getMisEpisodios(): Promise<EpisodioAtencion[]> {
    const { data } = await api.get('/api/historial-clinico/episodios/mis_episodios/');
    return data;
  },

  async getEpisodio(id: number): Promise<EpisodioAtencion> {
    const { data } = await api.get(`/api/historial-clinico/episodios/${id}/`);
    return data;
  },

  async createEpisodio(episodioData: Partial<EpisodioAtencion>): Promise<EpisodioAtencion> {
    const { data } = await api.post('/api/historial-clinico/episodios/', episodioData);
    return data;
  },

  async updateEpisodio(id: number, episodioData: Partial<EpisodioAtencion>): Promise<EpisodioAtencion> {
    const { data } = await api.put(`/api/historial-clinico/episodios/${id}/`, episodioData);
    return data;
  },

  async deleteEpisodio(id: number): Promise<void> {
    await api.delete(`/api/historial-clinico/episodios/${id}/`);
  },

  /**
   * ODONTOGRAMAS
   */
  async getOdontogramas(historial_id?: number): Promise<Odontograma[]> {
    const params = new URLSearchParams();
    if (historial_id) params.append('historial', historial_id.toString());

    const { data } = await api.get(`/api/historial-clinico/odontogramas/?${params}`);
    return data;
  },

  async getOdontograma(id: number): Promise<Odontograma> {
    const { data } = await api.get(`/api/historial-clinico/odontogramas/${id}/`);
    return data;
  },

  async createOdontograma(odontogramaData: Partial<Odontograma>): Promise<Odontograma> {
    const { data } = await api.post('/api/historial-clinico/odontogramas/', odontogramaData);
    return data;
  },

  async updateOdontograma(id: number, odontogramaData: Partial<Odontograma>): Promise<Odontograma> {
    const { data } = await api.put(`/api/historial-clinico/odontogramas/${id}/`, odontogramaData);
    return data;
  },

  async duplicarOdontograma(id: number): Promise<Odontograma> {
    const { data } = await api.post(`/api/historial-clinico/odontogramas/${id}/duplicar_odontograma/`);
    return data;
  },

  /**
   * DOCUMENTOS CLÍNICOS
   */
  async getDocumentos(historial_id?: number, tipo?: string): Promise<DocumentoClinico[]> {
    const params = new URLSearchParams();
    if (historial_id) params.append('historial', historial_id.toString());
    if (tipo) params.append('tipo_documento', tipo);

    const { data } = await api.get(`/api/historial-clinico/documentos/?${params}`);
    return data;
  },

  async getDocumento(id: number): Promise<DocumentoClinico> {
    const { data } = await api.get(`/api/historial-clinico/documentos/${id}/`);
    return data;
  },

  async createDocumento(documentoData: FormData): Promise<DocumentoClinico> {
    const { data } = await api.post('/api/historial-clinico/documentos/', documentoData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  async deleteDocumento(id: number): Promise<void> {
    await api.delete(`/api/historial-clinico/documentos/${id}/`);
  },

  async descargarDocumento(id: number): Promise<Blob> {
    const { data } = await api.get(`/api/historial-clinico/documentos/${id}/descargar/`, {
      responseType: 'blob'
    });
    return data;
  },
};
