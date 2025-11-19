interface Props {
  episodio: any;
}

export default function InfoPrincipal({ episodio }: Props) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '24px'
    }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        margin: '0 0 24px 0'
      }}>
        📋 Información Clínica Completa
      </h2>

      {/* Diagnóstico */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: '0 0 12px 0'
        }}>
          🔍 Diagnóstico
        </h3>
        <div style={{
          backgroundColor: '#dbeafe',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <p style={{
            color: '#111827',
            lineHeight: '1.6',
            margin: 0
          }}>
            {episodio.diagnostico || episodio.motivo_consulta}
          </p>
        </div>
      </div>

      {/* Tratamiento Realizado */}
      {episodio.tratamiento_realizado && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '0 0 12px 0'
          }}>
            🦷 Tratamiento Realizado
          </h3>
          <div style={{
            backgroundColor: '#d1fae5',
            border: '1px solid #a7f3d0',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <p style={{
              color: '#111827',
              lineHeight: '1.6',
              whiteSpace: 'pre-line',
              margin: 0
            }}>
              {episodio.tratamiento_realizado || episodio.descripcion_procedimiento}
            </p>
          </div>
        </div>
      )}

      {/* Notas del Odontólogo */}
      {episodio.notas_privadas && (
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '0 0 12px 0'
          }}>
            📝 Notas del Odontólogo
          </h3>
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #fde68a',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <p style={{
              color: '#111827',
              lineHeight: '1.6',
              whiteSpace: 'pre-line',
              margin: 0
            }}>
              {episodio.notas_privadas}
            </p>
          </div>
        </div>
      )}

      {/* Mensaje si no hay tratamiento ni notas */}
      {!episodio.tratamiento_realizado && !episodio.descripcion_procedimiento && !episodio.notas_privadas && (
        <div style={{
          textAlign: 'center',
          padding: '32px 0',
          color: '#6b7280'
        }}>
          <span style={{ fontSize: '48px' }}>📄</span>
          <p style={{ marginTop: '8px', margin: '8px 0 0 0' }}>No hay información adicional registrada</p>
        </div>
      )}
    </div>
  );
}
