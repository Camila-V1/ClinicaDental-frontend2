import {
  formatearFecha,
  getTipoEpisodioColor,
  getTipoEpisodioIcono
} from '../../services/historialService';

interface Props {
  episodios: any[];
}

export default function LineaTiempo({ episodios }: Props) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '24px'
    }}>
      <div style={{ position: 'relative' }}>
        {/* Línea vertical */}
        <div style={{
          position: 'absolute',
          left: '32px',
          top: 0,
          bottom: 0,
          width: '2px',
          backgroundColor: '#e5e7eb'
        }} />

        {/* Episodios */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {episodios.map((episodio) => (
            <div key={episodio.id} style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '24px'
            }}>
              
              {/* Punto en la línea */}
              <div style={{
                position: 'relative',
                zIndex: 10,
                flexShrink: 0
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: 'white',
                  border: '4px solid #3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {getTipoEpisodioIcono(episodio.tipo || 'CONSULTA')}
                </div>
              </div>

              {/* Contenido */}
              <div style={{
                flex: 1,
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                padding: '24px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTipoEpisodioColor(episodio.tipo || 'CONSULTA')}`}>
                    {episodio.tipo || 'CONSULTA'}
                  </span>
                  <span style={{
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    {formatearFecha(episodio.fecha_atencion || episodio.fecha)}
                  </span>
                </div>

                <h3 style={{
                  fontWeight: 'bold',
                  color: '#111827',
                  fontSize: '18px',
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>
                  {episodio.diagnostico || episodio.motivo_consulta}
                </h3>

                {episodio.tratamiento_realizado && (
                  <p style={{
                    color: '#374151',
                    marginBottom: '8px',
                    margin: '0 0 8px 0'
                  }}>
                    {episodio.tratamiento_realizado}
                  </p>
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '14px',
                  color: '#6b7280',
                  marginTop: '12px'
                }}>
                  <span>👨‍⚕️ {episodio.odontologo_nombre}</span>
                  {episodio.documentos?.length > 0 && (
                    <span>📎 {episodio.documentos.length} documentos</span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
