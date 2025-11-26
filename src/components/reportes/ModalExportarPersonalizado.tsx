/**
 * 📥 Modal de Exportación Personalizada de Reportes
 */

import { useState } from 'react';
import reportesService from '../../services/reportesService';
import BotonesExportar from './BotonesExportar';

interface Props {
  onClose: () => void;
}

export default function ModalExportarPersonalizado({ onClose }: Props) {
  const [tipoReporte, setTipoReporte] = useState('dashboard-kpis');
  const [parametros, setParametros] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    dias: 15,
    limite: 5
  });

  const handleExportar = async (formato: 'pdf' | 'excel') => {
    switch (tipoReporte) {
      case 'dashboard-kpis':
        await reportesService.exportarDashboardKPIs(formato);
        break;
      case 'tendencia-citas':
        await reportesService.exportarTendenciaCitas(parametros.dias, formato);
        break;
      case 'top-procedimientos':
        await reportesService.exportarTopProcedimientos(parametros.limite, formato);
        break;
      case 'estadisticas-generales':
        await reportesService.exportarEstadisticas(formato);
        break;
      case 'reporte-financiero':
        if (parametros.fecha_inicio && parametros.fecha_fin) {
          await reportesService.exportarReporteFinanciero(
            parametros.fecha_inicio, 
            parametros.fecha_fin, 
            formato
          );
        } else {
          throw new Error('Debes seleccionar fechas de inicio y fin');
        }
        break;
      case 'ocupacion-odontologos':
        if (parametros.fecha_inicio && parametros.fecha_fin) {
          await reportesService.exportarOcupacionOdontologos(
            parametros.fecha_inicio, 
            parametros.fecha_fin, 
            formato
          );
        } else {
          throw new Error('Debes seleccionar fechas de inicio y fin');
        }
        break;
    }
  };

  const requiereFechas = ['reporte-financiero', 'ocupacion-odontologos'].includes(tipoReporte);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">📥 Exportar Reporte Personalizado</h2>
        <p className="text-gray-600 text-sm mb-6">
          Selecciona el tipo de reporte y los parámetros necesarios
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Reporte *
          </label>
          <select
            value={tipoReporte}
            onChange={(e) => setTipoReporte(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="dashboard-kpis">📊 Dashboard KPIs</option>
            <option value="estadisticas-generales">📈 Estadísticas Generales</option>
            <option value="tendencia-citas">📅 Tendencia de Citas</option>
            <option value="top-procedimientos">🏆 Top Procedimientos</option>
            <option value="reporte-financiero">💰 Reporte Financiero</option>
            <option value="ocupacion-odontologos">👨‍⚕️ Ocupación Odontólogos</option>
          </select>
        </div>

        {/* Parámetros según tipo */}
        {tipoReporte === 'tendencia-citas' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Días a analizar
            </label>
            <input
              type="number"
              min="1"
              max="90"
              value={parametros.dias}
              onChange={(e) => setParametros({ ...parametros, dias: parseInt(e.target.value) || 15 })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Rango: 1-90 días</p>
          </div>
        )}

        {tipoReporte === 'top-procedimientos' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de procedimientos
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={parametros.limite}
              onChange={(e) => setParametros({ ...parametros, limite: parseInt(e.target.value) || 5 })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Rango: 1-20 procedimientos</p>
          </div>
        )}

        {requiereFechas && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Inicio *
              </label>
              <input
                type="date"
                required
                value={parametros.fecha_inicio}
                onChange={(e) => setParametros({ ...parametros, fecha_inicio: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Fin *
              </label>
              <input
                type="date"
                required
                value={parametros.fecha_fin}
                onChange={(e) => setParametros({ ...parametros, fecha_fin: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </>
        )}

        {/* Preview de parámetros */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs font-medium text-blue-800 mb-2">📋 Resumen</p>
          <p className="text-sm text-blue-700">
            <strong>Reporte:</strong> {tipoReporte.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </p>
          {tipoReporte === 'tendencia-citas' && (
            <p className="text-sm text-blue-700">
              <strong>Período:</strong> Últimos {parametros.dias} días
            </p>
          )}
          {tipoReporte === 'top-procedimientos' && (
            <p className="text-sm text-blue-700">
              <strong>Top:</strong> {parametros.limite} procedimientos
            </p>
          )}
          {requiereFechas && parametros.fecha_inicio && parametros.fecha_fin && (
            <p className="text-sm text-blue-700">
              <strong>Rango:</strong> {parametros.fecha_inicio} a {parametros.fecha_fin}
            </p>
          )}
        </div>

        <div className="mb-4">
          <BotonesExportar
            onExportar={handleExportar}
            nombreReporte={tipoReporte.replace(/-/g, ' ')}
          />
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-400 font-medium transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
