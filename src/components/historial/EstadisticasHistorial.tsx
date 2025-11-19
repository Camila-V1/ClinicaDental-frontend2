interface Props {
  historial: any;
}

export default function EstadisticasHistorial({ historial }: Props) {
  const stats = [
    {
      titulo: 'Total Episodios',
      valor: historial?.episodios?.length || 0,
      icono: '📋',
      color: 'bg-blue-500'
    },
    {
      titulo: 'Documentos',
      valor: historial?.documentos?.length || 0,
      icono: '📄',
      color: 'bg-green-500'
    },
    {
      titulo: 'Último Registro',
      valor: historial?.episodios?.[0]?.fecha_atencion 
        ? new Date(historial.episodios[0].fecha_atencion).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
        : 'N/A',
      icono: '📅',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginBottom: '24px'
    }}>
      {stats.map((stat, index) => (
        <div key={index} style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                fontWeight: '500',
                margin: 0
              }}>
                {stat.titulo}
              </p>
              <p style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#111827',
                marginTop: '8px',
                marginBottom: 0
              }}>
                {stat.valor}
              </p>
            </div>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px'
            }}
            className={stat.color}
            >
              {stat.icono}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
