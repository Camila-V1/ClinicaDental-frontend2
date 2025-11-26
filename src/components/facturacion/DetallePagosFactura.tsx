/**
 * Componente para mostrar el detalle de pagos de una factura
 */

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import facturacionAdminService, { Pago } from '../../services/facturacionAdminService';

interface Props {
  facturaId: number;
}

export default function DetallePagosFactura({ facturaId }: Props) {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPagos();
  }, [facturaId]);

  const cargarPagos = async () => {
    try {
      const data = await facturacionAdminService.getPagosPorFactura(facturaId);
      setPagos(data);
    } catch (error) {
      console.error('Error al cargar pagos:', error);
      toast.error('Error al cargar pagos');
    } finally {
      setLoading(false);
    }
  };

  const anularPago = async (pagoId: number) => {
    if (!confirm('¿Está seguro de anular este pago?')) return;
    
    try {
      await facturacionAdminService.anularPago(pagoId);
      toast.success('Pago anulado exitosamente');
      cargarPagos(); // Recargar la lista
    } catch (error: any) {
      console.error('Error al anular pago:', error);
      const mensaje = error.response?.data?.error || 'Error al anular pago';
      toast.error(mensaje);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando pagos...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4">💳 Historial de Pagos</h3>
      
      {pagos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay pagos registrados para esta factura
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referencia</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pagos.map((pago) => (
                <tr key={pago.id} className={pago.estado === 'CANCELADO' ? 'opacity-50' : ''}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {new Date(pago.fecha_pago).toLocaleDateString('es-BO', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center">
                      {pago.metodo_pago === 'EFECTIVO' && '💵'}
                      {pago.metodo_pago === 'TARJETA' && '💳'}
                      {pago.metodo_pago === 'TRANSFERENCIA' && '🏦'}
                      {pago.metodo_pago === 'QR' && '📱'}
                      <span className="ml-2">{pago.metodo_pago}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600">
                    Bs. {parseFloat(pago.monto_pagado).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {pago.referencia_transaccion || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {pago.estado === 'COMPLETADO' && (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        ✓ Completado
                      </span>
                    )}
                    {pago.estado === 'CANCELADO' && (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        ✕ Anulado
                      </span>
                    )}
                    {pago.estado === 'PENDIENTE' && (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        ⏱ Pendiente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {pago.estado === 'COMPLETADO' && (
                      <button
                        onClick={() => anularPago(pago.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                        title="Anular pago"
                      >
                        ✕ Anular
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Notas de los pagos */}
          {pagos.some(p => p.notas) && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Notas:</h4>
              {pagos.filter(p => p.notas).map(pago => (
                <div key={pago.id} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <span className="font-medium">
                    {new Date(pago.fecha_pago).toLocaleDateString()}:
                  </span>{' '}
                  {pago.notas}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
