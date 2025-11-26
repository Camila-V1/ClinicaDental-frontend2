/**
 * 📦 Modal para ajustar stock de insumos
 */

import { useState } from 'react';
import toast from 'react-hot-toast';
import inventarioService from '../../services/inventarioService';

interface Props {
  insumo: {
    id: number;
    nombre: string;
    stock_actual: string | number;
    unidad_medida?: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalAjustarStock({ insumo, onClose, onSuccess }: Props) {
  const [tipo, setTipo] = useState<'ENTRADA' | 'SALIDA'>('ENTRADA');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cantidad: 0,
    motivo: '',
    observaciones: ''
  });

  const MOTIVOS = {
    ENTRADA: [
      'Compra a proveedor',
      'Devolución de paciente',
      'Corrección de inventario',
      'Donación',
      'Otro'
    ],
    SALIDA: [
      'Uso en tratamiento',
      'Producto vencido',
      'Producto dañado',
      'Donación',
      'Corrección de inventario',
      'Otro'
    ]
  };

  const stockActual = typeof insumo.stock_actual === 'string' 
    ? parseFloat(insumo.stock_actual) 
    : insumo.stock_actual;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.cantidad <= 0) {
      toast.error('La cantidad debe ser mayor a 0');
      return;
    }

    if (!formData.motivo) {
      toast.error('Debes seleccionar un motivo');
      return;
    }

    setLoading(true);
    try {
      // Convertir a negativo si es salida
      const cantidad = tipo === 'SALIDA' ? -formData.cantidad : formData.cantidad;
      
      const response = await inventarioService.ajustarStock(insumo.id, {
        cantidad,
        motivo: formData.motivo,
        observaciones: formData.observaciones
      });
      
      toast.success(`✅ ${response.mensaje || 'Stock ajustado correctamente'}`);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error al ajustar stock:', error);
      const mensaje = error.response?.data?.error || 
                     error.response?.data?.detail ||
                     'Error al ajustar stock';
      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const stockNuevo = tipo === 'ENTRADA' 
    ? stockActual + formData.cantidad
    : stockActual - formData.cantidad;

  const stockNegativo = stockNuevo < 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">📦 Ajustar Stock</h2>
        <p className="text-gray-600 mb-4 text-sm">{insumo.nombre}</p>
        
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <p className="text-xs text-gray-600 uppercase tracking-wide">Stock actual</p>
          <p className="text-3xl font-bold text-blue-700">
            {stockActual.toFixed(2)}
            {insumo.unidad_medida && (
              <span className="text-base text-gray-600 ml-2">{insumo.unidad_medida}</span>
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de movimiento */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setTipo('ENTRADA');
                setFormData({ ...formData, motivo: '' });
              }}
              className={`py-3 rounded-lg font-medium transition-all ${
                tipo === 'ENTRADA'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ➕ Entrada
            </button>
            <button
              type="button"
              onClick={() => {
                setTipo('SALIDA');
                setFormData({ ...formData, motivo: '' });
              }}
              className={`py-3 rounded-lg font-medium transition-all ${
                tipo === 'SALIDA'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ➖ Salida
            </button>
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad *
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={formData.cantidad || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                cantidad: parseFloat(e.target.value) || 0 
              })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          {/* Motivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo *
            </label>
            <select
              required
              value={formData.motivo}
              onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccione un motivo</option>
              {MOTIVOS[tipo].map(motivo => (
                <option key={motivo} value={motivo}>{motivo}</option>
              ))}
            </select>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="Detalles adicionales (opcional)"
            />
          </div>

          {/* Preview del stock nuevo */}
          {formData.cantidad > 0 && (
            <div className={`p-4 rounded-lg border-2 ${
              stockNegativo 
                ? 'bg-red-50 border-red-300' 
                : 'bg-green-50 border-green-300'
            }`}>
              <p className="text-xs uppercase tracking-wide mb-1 font-medium text-gray-600">
                Stock después del ajuste
              </p>
              <div className="flex items-baseline gap-2">
                <p className={`text-3xl font-bold ${
                  stockNegativo ? 'text-red-700' : 'text-green-700'
                }`}>
                  {stockNuevo.toFixed(2)}
                </p>
                {insumo.unidad_medida && (
                  <span className="text-sm text-gray-600">{insumo.unidad_medida}</span>
                )}
              </div>
              
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="text-gray-600">
                  {stockActual.toFixed(2)}
                </span>
                <span className={tipo === 'ENTRADA' ? 'text-green-600' : 'text-red-600'}>
                  {tipo === 'ENTRADA' ? '+' : '-'}{formData.cantidad.toFixed(2)}
                </span>
                <span className="text-gray-400">→</span>
                <span className={stockNegativo ? 'text-red-700 font-bold' : 'text-green-700 font-bold'}>
                  {stockNuevo.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {stockNegativo && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-700 flex items-center gap-2">
                <span>⚠️</span>
                <span>La cantidad de salida excede el stock disponible</span>
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={loading || stockNegativo || formData.cantidad <= 0}
              className={`flex-1 text-white px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                tipo === 'ENTRADA' 
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {loading ? '⏳ Procesando...' : '✓ Confirmar Ajuste'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
