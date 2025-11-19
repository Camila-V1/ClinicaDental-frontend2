interface Props {
  filtros: any;
  cambiarFiltro: (campo: string, valor: any) => void;
  limpiarFiltros: () => void;
}

export default function FiltrosHistorial({ filtros, cambiarFiltro, limpiarFiltros }: Props) {
  const tieneFiltrosActivos = filtros.tipo || filtros.fechaInicio || filtros.fechaFin || filtros.busqueda;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '24px',
      marginBottom: '24px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#111827',
          margin: 0
        }}>
          🔍 Filtros
        </h3>
        {tieneFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            style={{
              fontSize: '14px',
              color: '#dc2626',
              fontWeight: '500',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#991b1b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#dc2626';
            }}
          >
            🗑️ Limpiar
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        
        {/* Búsqueda */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Buscar
          </label>
          <input
            type="text"
            placeholder="Diagnóstico, tratamiento, doctor..."
            value={filtros.busqueda}
            onChange={(e) => cambiarFiltro('busqueda', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              color: '#111827',
              backgroundColor: 'white',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Tipo */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Tipo
          </label>
          <select
            value={filtros.tipo}
            onChange={(e) => cambiarFiltro('tipo', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              color: '#111827',
              backgroundColor: 'white',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Todos</option>
            <option value="CONSULTA">Consulta</option>
            <option value="EMERGENCIA">Emergencia</option>
            <option value="CONTROL">Control</option>
            <option value="TRATAMIENTO">Tratamiento</option>
          </select>
        </div>

        {/* Fecha Inicio */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Desde
          </label>
          <input
            type="date"
            value={filtros.fechaInicio}
            onChange={(e) => cambiarFiltro('fechaInicio', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              color: '#111827',
              backgroundColor: 'white',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Fecha Fin */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Hasta
          </label>
          <input
            type="date"
            value={filtros.fechaFin}
            onChange={(e) => cambiarFiltro('fechaFin', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              color: '#111827',
              backgroundColor: 'white',
              boxSizing: 'border-box'
            }}
          />
        </div>

      </div>
    </div>
  );
}
