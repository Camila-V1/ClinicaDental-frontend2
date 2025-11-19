/**
 * 📑 TABS CUADRANTES - Cambiar entre diferentes vistas del odontograma
 */

interface Props {
  vistaActual: string;
  cambiarVista: (vista: string) => void;
}

export default function TabsCuadrantes({ vistaActual, cambiarVista }: Props) {
  const vistas = [
    { id: 'completo', label: '🦷 Vista Completa' },
    { id: 'superior', label: '⬆️ Superior' },
    { id: 'inferior', label: '⬇️ Inferior' },
    { id: 'derecho', label: '👉 Derecho' },
    { id: 'izquierdo', label: '👈 Izquierdo' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        {vistas.map((vista) => (
          <button
            key={vista.id}
            onClick={() => cambiarVista(vista.id)}
            className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg font-medium transition-all ${
              vistaActual === vista.id
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {vista.label}
          </button>
        ))}
      </div>
    </div>
  );
}
