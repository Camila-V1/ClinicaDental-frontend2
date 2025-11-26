/**
 * Página para crear facturas desde presupuestos aceptados
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import facturacionAdminService from '../../services/facturacionAdminService';
import { tratamientosService } from '../../services/tratamientosService';

interface PresupuestoDetalle {
  id: number;
  plan: number;
  plan_titulo?: string;
  paciente: number;
  paciente_nombre?: string;
  total: number;
  estado: string;
  fecha_emision: string;
  fecha_vencimiento?: string;
  token?: string;
  notas?: string;
  factura_id?: number;
  [key: string]: any; // Para otros campos dinámicos del backend
}

export default function PresupuestosParaFacturar() {
  const navigate = useNavigate();
  const [presupuestos, setPresupuestos] = useState<PresupuestoDetalle[]>([]);
  const [loading, setLoading] = useState(true);
  const [creandoFactura, setCreandoFactura] = useState<number | null>(null);

  useEffect(() => {
    cargarPresupuestos();
  }, []);

  const cargarPresupuestos = async () => {
    try {
      // Obtener presupuestos en estado ACEPTADO
      const data = await tratamientosService.getPresupuestos({ estado: 'ACEPTADO' });
      
      // Filtrar los que NO tienen factura asociada
      const sinFactura = (data as any[]).filter((p: any) => !p.factura_id);
      setPresupuestos(sinFactura);
    } catch (error) {
      console.error('Error al cargar presupuestos:', error);
      toast.error('Error al cargar presupuestos');
    } finally {
      setLoading(false);
    }
  };

  const crearFactura = async (presupuesto: PresupuestoDetalle) => {
    const pacienteNombre = presupuesto.paciente_nombre || 'Paciente';
    
    if (!confirm(`¿Crear factura para ${pacienteNombre}?`)) return;
    
    setCreandoFactura(presupuesto.id);
    try {
      const factura = await facturacionAdminService.createFactura({
        paciente: presupuesto.paciente,
        presupuesto: presupuesto.id,
        monto_total: presupuesto.total.toString()
      });
      
      toast.success('✅ Factura creada exitosamente');
      
      // Navegar al detalle de la factura
      navigate(`/admin/facturacion/${factura.id}`);
    } catch (error: any) {
      console.error('Error al crear factura:', error);
      const mensaje = error.response?.data?.error || 
                     error.response?.data?.detail ||
                     'Error al crear factura';
      toast.error(mensaje);
    } finally {
      setCreandoFactura(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-500">Cargando presupuestos...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">📋 Presupuestos para Facturar</h1>
          <p className="text-gray-600 mt-1">
            Presupuestos aceptados pendientes de facturación
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/facturacion')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          Ver Facturas
        </button>
      </div>

      {presupuestos.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No hay presupuestos pendientes
          </h3>
          <p className="text-gray-500 mb-6">
            No hay presupuestos aceptados pendientes de facturar
          </p>
          <button
            onClick={() => navigate('/admin/facturacion')}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            Ir a Facturas
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {presupuestos.map(presupuesto => {
            const pacienteNombre = presupuesto.paciente_nombre || 'Paciente';
            const planTitulo = presupuesto.plan_titulo || 'Plan de tratamiento';

            return (
              <div key={presupuesto.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-800">
                          {pacienteNombre}
                        </h3>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          ✓ Aceptado
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Presupuesto</p>
                          <p className="font-medium">#{presupuesto.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Plan de Tratamiento</p>
                          <p className="font-medium">{planTitulo}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Fecha Emisión</p>
                          <p className="font-medium">
                            {new Date(presupuesto.fecha_emision).toLocaleDateString('es-BO')}
                          </p>
                        </div>
                      </div>

                      {/* Items del presupuesto (si existen) */}
                      {presupuesto.items && presupuesto.items.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Servicios incluidos ({presupuesto.items.length}):
                          </p>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {presupuesto.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  • {item.servicio_nombre || item.descripcion}
                                </span>
                                <span className="font-medium text-gray-800">
                                  Bs. {parseFloat(item.precio || item.precio_unitario || '0').toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {presupuesto.notas && (
                        <div className="mb-4 text-sm text-gray-600 bg-blue-50 p-3 rounded">
                          <strong>Notas:</strong> {presupuesto.notas}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">Total Presupuestado:</p>
                        <p className="text-2xl font-bold text-blue-600">
                          Bs. {typeof presupuesto.total === 'number' ? presupuesto.total.toFixed(2) : parseFloat(presupuesto.total || '0').toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="ml-6 flex flex-col gap-2">
                      <button
                        onClick={() => crearFactura(presupuesto)}
                        disabled={creandoFactura === presupuesto.id}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {creandoFactura === presupuesto.id ? (
                          '⏳ Creando...'
                        ) : (
                          '📄 Crear Factura'
                        )}
                      </button>
                      
                      <button
                        onClick={() => navigate(`/admin/tratamientos/presupuestos/${presupuesto.id}`)}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 text-sm"
                      >
                        Ver Detalle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
