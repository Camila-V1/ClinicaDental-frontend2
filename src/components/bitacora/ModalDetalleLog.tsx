/**
 * 📋 Modal de Detalle de Log de Bitácora
 */

interface Props {
  log: any;
  onClose: () => void;
}

export default function ModalDetalleLog({ log, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>📋</span>
          Detalle del Log
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Fecha y Hora</p>
              <p className="font-medium text-sm">
                {new Date(log.fecha_hora || log.timestamp).toLocaleString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Usuario</p>
              <p className="font-medium text-sm">{log.usuario || 'Sistema'}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-600 mb-1">Acción</p>
              <p className="font-semibold text-sm text-blue-800">{log.accion}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-xs text-purple-600 mb-1">Modelo</p>
              <p className="font-semibold text-sm text-purple-800">{log.modelo}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">ID del Objeto</p>
              <p className="font-medium text-sm font-mono">{log.objeto_id}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">IP Address</p>
              <p className="font-medium text-sm font-mono">{log.ip_address}</p>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs text-yellow-800 font-medium mb-2">📝 Descripción</p>
            <p className="text-sm text-yellow-900">{log.descripcion || log.detalles || 'Sin descripción'}</p>
          </div>

          {log.user_agent && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 font-medium mb-2">🌐 User Agent</p>
              <p className="text-xs text-gray-700 break-all">{log.user_agent}</p>
            </div>
          )}

          {log.detalles && typeof log.detalles === 'object' && Object.keys(log.detalles).length > 0 && (
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <p className="text-xs text-indigo-800 font-medium mb-2">🔍 Detalles Adicionales</p>
              <pre className="bg-white p-3 rounded text-xs overflow-x-auto border border-indigo-100">
                {JSON.stringify(log.detalles, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-400 font-medium transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
