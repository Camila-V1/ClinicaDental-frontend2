interface Props {
  episodio: any;
}

export default function InfoOdontologo({ episodio }: Props) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '24px'
    }}>
      <h3 style={{
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        margin: '0 0 16px 0'
      }}>
        👨‍⚕️ Profesional a Cargo
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Foto o Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '96px',
            height: '96px',
            backgroundColor: '#dbeafe',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px'
          }}>
            👨‍⚕️
          </div>
        </div>

        {/* Información */}
        <div style={{ textAlign: 'center' }}>
          <h4 style={{
            fontWeight: 'bold',
            fontSize: '18px',
            color: '#111827',
            margin: 0
          }}>
            {episodio.odontologo_nombre}
          </h4>
          {episodio.odontologo_especialidad && (
            <p style={{
              fontSize: '14px',
              color: '#2563eb',
              fontWeight: '500',
              marginTop: '4px',
              margin: '4px 0 0 0'
            }}>
              {episodio.odontologo_especialidad}
            </p>
          )}
        </div>

        {/* Contacto */}
        {episodio.odontologo_email && (
          <div style={{
            paddingTop: '16px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              <span>📧</span>
              <a 
                href={`mailto:${episodio.odontologo_email}`}
                style={{
                  color: '#2563eb',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                  e.currentTarget.style.color = '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                  e.currentTarget.style.color = '#2563eb';
                }}
              >
                {episodio.odontologo_email}
              </a>
            </div>
          </div>
        )}

        {/* Botón Agendar */}
        <button
          style={{
            width: '100%',
            padding: '10px 16px',
            backgroundColor: '#16a34a',
            color: 'white',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#15803d';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#16a34a';
          }}
        >
          📅 Agendar con este doctor
        </button>
      </div>
    </div>
  );
}
