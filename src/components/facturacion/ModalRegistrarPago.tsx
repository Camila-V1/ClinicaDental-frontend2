/**
 * Modal para registrar pagos en facturas
 */

import { useState } from 'react';
import toast from 'react-hot-toast';
import facturacionAdminService from '../../services/facturacionAdminService';

interface Props {
  facturaId: number;
  saldoPendiente: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalRegistrarPago({ facturaId, saldoPendiente, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    monto_pagado: saldoPendiente.toString(),
    metodo_pago: 'EFECTIVO' as 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'QR',
    referencia_transaccion: '',
    notas: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const monto = parseFloat(formData.monto_pagado);
    
    if (monto <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }
    
    if (monto > saldoPendiente) {
      toast.error('El monto no puede ser mayor al saldo pendiente');
      return;
    }
    
    setLoading(true);
    try {
      await facturacionAdminService.createPago({
        factura: facturaId,
        ...formData
      });
      toast.success('💰 Pago registrado exitosamente');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error al registrar pago:', error);
      const mensaje = error.response?.data?.error || error.message || 'Error al registrar pago';
      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">💰 Registrar Pago</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Monto */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Monto a Pagar *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={saldoPendiente}
              required
              value={formData.monto_pagado}
              onChange={(e) => setFormData({ ...formData, monto_pagado: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
            <span className="text-sm text-gray-500 mt-1 block">
              Saldo pendiente: Bs. {saldoPendiente.toFixed(2)}
            </span>
          </div>

          {/* Método de Pago */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Método de Pago *
            </label>
            <select
              required
              value={formData.metodo_pago}
              onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value as any })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="EFECTIVO">💵 Efectivo</option>
              <option value="TARJETA">💳 Tarjeta</option>
              <option value="TRANSFERENCIA">🏦 Transferencia</option>
              <option value="QR">📱 QR</option>
            </select>
          </div>

          {/* Referencia */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Referencia de Transacción
            </label>
            <input
              type="text"
              value={formData.referencia_transaccion}
              onChange={(e) => setFormData({ ...formData, referencia_transaccion: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Número de transacción, cheque, etc."
            />
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Notas / Observaciones
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Observaciones o detalles adicionales"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Registrando...' : '✓ Registrar Pago'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
