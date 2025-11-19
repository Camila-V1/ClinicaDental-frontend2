import React from 'react';
import type { HistorialClinicoPaciente } from '../../../services/historialService';
import { AlertCircle, Pill, FileText, Calendar } from 'lucide-react';

interface Props {
  historial: HistorialClinicoPaciente;
}

export const ResumenHistorial: React.FC<Props> = ({ historial }) => {
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Información General
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Fecha de apertura */}
        <div className="flex items-start space-x-3">
          <Calendar className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-600">Fecha de Apertura</p>
            <p className="font-medium text-gray-900">
              {formatearFecha(historial.fecha_apertura)}
            </p>
          </div>
        </div>

        {/* Alergias */}
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-gray-600">Alergias</p>
            <p className="font-medium text-gray-900">
              {historial.alergias || 'Ninguna registrada'}
            </p>
          </div>
        </div>

        {/* Medicamentos actuales */}
        <div className="flex items-start space-x-3">
          <Pill className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-gray-600">Medicamentos Actuales</p>
            <p className="font-medium text-gray-900">
              {historial.medicamentos_actuales || 'Ninguno'}
            </p>
          </div>
        </div>

        {/* Antecedentes médicos */}
        <div className="flex items-start space-x-3">
          <FileText className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-gray-600">Antecedentes Médicos</p>
            <p className="font-medium text-gray-900">
              {historial.antecedentes_medicos || 'Ninguno'}
            </p>
          </div>
        </div>
      </div>

      {/* Observaciones generales */}
      {historial.observaciones_generales && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">
            Observaciones Generales
          </p>
          <p className="text-sm text-blue-800">
            {historial.observaciones_generales}
          </p>
        </div>
      )}
    </div>
  );
};
