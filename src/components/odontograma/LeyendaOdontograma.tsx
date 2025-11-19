/**
 * 📖 LEYENDA ODONTOGRAMA - Explicación de colores y estados
 */

export default function LeyendaOdontograma() {
  const estados = [
    { codigo: 'SANO', nombre: 'Sano', emoji: '🦷', bg: '#ecfdf5', border: '#10b981', text: '#065f46', descripcion: 'Diente en perfecto estado' },
    { codigo: 'CARIES', nombre: 'Caries', emoji: '🔴', bg: '#fef2f2', border: '#ef4444', text: '#991b1b', descripcion: 'Requiere tratamiento urgente' },
    { codigo: 'OBTURADO', nombre: 'Obturado', emoji: '🟡', bg: '#fef3c7', border: '#f59e0b', text: '#92400e', descripcion: 'Resina o amalgama aplicada' },
    { codigo: 'TRATADO', nombre: 'Tratado', emoji: '💊', bg: '#eff6ff', border: '#3b82f6', text: '#1e3a8a', descripcion: 'Tratamiento completado' },
    { codigo: 'EXTRAIDO', nombre: 'Extraído', emoji: '❌', bg: '#fafafa', border: '#737373', text: '#404040', descripcion: 'Extracción realizada' },
    { codigo: 'AUSENTE', nombre: 'Ausente', emoji: '⚪', bg: '#f5f5f5', border: '#a3a3a3', text: '#525252', descripcion: 'Nunca erupcionó' },
    { codigo: 'FRACTURADO', nombre: 'Fracturado', emoji: '⚡', bg: '#fff7ed', border: '#f97316', text: '#9a3412', descripcion: 'Daño estructural' },
    { codigo: 'ENDODONCIA', nombre: 'Endodoncia', emoji: '💉', bg: '#faf5ff', border: '#a855f7', text: '#6b21a8', descripcion: 'Tratamiento de conducto' },
    { codigo: 'PROTESIS', nombre: 'Prótesis', emoji: '👑', bg: '#f0f9ff', border: '#0ea5e9', text: '#0c4a6e', descripcion: 'Corona o puente' },
    { codigo: 'OBSERVACION', nombre: 'Observación', emoji: '⚠️', bg: '#fefce8', border: '#eab308', text: '#713f12', descripcion: 'Requiere seguimiento' },
    { codigo: 'IMPLANTE', nombre: 'Implante', emoji: '🔩', bg: '#f0fdfa', border: '#14b8a6', text: '#134e4a', descripcion: 'Implante dental' }
  ];

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      padding: '28px',
      marginBottom: '24px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '2px solid #e2e8f0'
      }}>
        <span style={{ fontSize: '28px' }}>📖</span>
        <h3 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: '700',
          color: '#0f172a',
          letterSpacing: '0.5px'
        }}>
          Leyenda de Estados Dentales
        </h3>
      </div>

      {/* Grid de estados */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {estados.map((estado) => (
          <div
            key={estado.codigo}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: estado.bg,
              border: `2px solid ${estado.border}`,
              borderRadius: '12px',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 16px ${estado.border}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Emoji grande */}
            <div style={{
              fontSize: '32px',
              lineHeight: '1',
              minWidth: '40px',
              textAlign: 'center'
            }}>
              {estado.emoji}
            </div>

            {/* Información */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: '700',
                fontSize: '14px',
                color: estado.text,
                marginBottom: '4px'
              }}>
                {estado.nombre}
              </div>
              <div style={{
                fontSize: '11px',
                color: estado.text,
                opacity: 0.7
              }}>
                {estado.descripcion}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tip destacado */}
      <div style={{
        display: 'flex',
        gap: '12px',
        padding: '16px 20px',
        backgroundColor: '#f0f9ff',
        border: '2px solid #0ea5e9',
        borderRadius: '12px',
        marginTop: '16px'
      }}>
        <span style={{ fontSize: '24px', flexShrink: 0 }}>💡</span>
        <div>
          <div style={{
            fontWeight: '700',
            fontSize: '14px',
            color: '#0c4a6e',
            marginBottom: '4px'
          }}>
            ¿Cómo interactuar?
          </div>
          <div style={{
            fontSize: '13px',
            color: '#0369a1',
            lineHeight: '1.6'
          }}>
            <strong>Haz clic en cualquier diente</strong> para ver su historial completo de tratamientos, diagnósticos y observaciones médicas.
          </div>
        </div>
      </div>
    </div>
  );
}
