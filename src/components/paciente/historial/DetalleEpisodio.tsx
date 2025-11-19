import React from 'react';
import type { EpisodioAtencionPaciente } from '../../../services/historialService';

interface Props {
  episodio: EpisodioAtencionPaciente;
  onClose: () => void;
}

// Iconos SVG inline
const X = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Calendar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const User = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const FileText = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Activity = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export const DetalleEpisodio: React.FC<Props> = ({ episodio, onClose }) => {
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Detalle del Episodio
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Información básica */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="text-blue-600"><Calendar /></div>
              <div>
                <p className="text-sm text-gray-600">Fecha de Atención</p>
                <p className="font-medium text-gray-900">
                  {formatearFecha(episodio.fecha_atencion)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-green-600"><User /></div>
              <div>
                <p className="text-sm text-gray-600">Odontólogo</p>
                <p className="font-medium text-gray-900">
                  {episodio.odontologo_nombre}
                </p>
              </div>
            </div>
          </div>

          {/* Motivo de consulta */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600 mt-1"><FileText /></div>
              <div className="flex-1">
                <p className="font-medium text-blue-900 mb-1">Motivo de Consulta</p>
                <p className="text-blue-800">{episodio.motivo_consulta}</p>
              </div>
            </div>
          </div>

          {/* Diagnóstico */}
          {episodio.diagnostico && (
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="text-purple-600 mt-1"><Activity /></div>
                <div className="flex-1">
                  <p className="font-medium text-purple-900 mb-1">Diagnóstico</p>
                  <p className="text-purple-800">{episodio.diagnostico}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tratamiento realizado */}
          {episodio.tratamiento_realizado && (
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="text-green-600 mt-1"><Activity /></div>
                <div className="flex-1">
                  <p className="font-medium text-green-900 mb-1">Tratamiento Realizado</p>
                  <p className="text-green-800">{episodio.tratamiento_realizado}</p>
                </div>
              </div>
            </div>
          )}

          {/* Observaciones */}
          {episodio.observaciones && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-900 mb-2">Observaciones</p>
              <p className="text-gray-700">{episodio.observaciones}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
