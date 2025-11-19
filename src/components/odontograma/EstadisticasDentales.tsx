/**
 * 📊 ESTADISTICAS DENTALES - Cards con resumen del odontograma
 */

interface Props {
  odontograma: any;
}

export default function EstadisticasDentales({ odontograma }: Props) {
  const stats = calcularEstadisticas(odontograma);

  const cards = [
    {
      titulo: 'Dientes Sanos',
      valor: stats.sanos,
      total: 32,
      emoji: '🦷',
      gradientFrom: '#10b981',
      gradientTo: '#059669',
      bgLight: '#ecfdf5',
      textColor: '#065f46'
    },
    {
      titulo: 'Tratados',
      valor: stats.tratados,
      total: 32,
      emoji: '💊',
      gradientFrom: '#3b82f6',
      gradientTo: '#2563eb',
      bgLight: '#eff6ff',
      textColor: '#1e3a8a'
    },
    {
      titulo: 'Con Problemas',
      valor: stats.problemas,
      total: 32,
      emoji: '🔴',
      gradientFrom: '#ef4444',
      gradientTo: '#dc2626',
      bgLight: '#fef2f2',
      textColor: '#991b1b'
    },
    {
      titulo: 'En Observación',
      valor: stats.observacion,
      total: 32,
      emoji: '⚠️',
      gradientFrom: '#f59e0b',
      gradientTo: '#d97706',
      bgLight: '#fef3c7',
      textColor: '#92400e'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '20px',
      marginBottom: '32px'
    }}>
      {cards.map((card, index) => (
        <div
          key={index}
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #f1f5f9',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
          }}
        >
          {/* Fondo decorativo */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '200px',
            height: '200px',
            background: `linear-gradient(135deg, ${card.gradientFrom}15, ${card.gradientTo}05)`,
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />

          {/* Contenido */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Header con emoji */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <span style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {card.titulo}
              </span>
              <div style={{
                fontSize: '36px',
                lineHeight: '1',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}>
                {card.emoji}
              </div>
            </div>

            {/* Números grandes */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '4px',
              marginBottom: '16px'
            }}>
              <span style={{
                fontSize: '48px',
                fontWeight: '800',
                background: `linear-gradient(135deg, ${card.gradientFrom}, ${card.gradientTo})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: '1'
              }}>
                {card.valor}
              </span>
              <span style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#94a3b8'
              }}>
                /{card.total}
              </span>
            </div>

            {/* Barra de progreso */}
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#f1f5f9',
              borderRadius: '999px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${card.gradientFrom}, ${card.gradientTo})`,
                  borderRadius: '999px',
                  width: `${(card.valor / card.total) * 100}%`,
                  transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: `0 0 8px ${card.gradientFrom}40`
                }}
              />
            </div>

            {/* Porcentaje */}
            <div style={{
              marginTop: '12px',
              fontSize: '13px',
              fontWeight: '700',
              color: card.textColor
            }}>
              {Math.round((card.valor / card.total) * 100)}% del total
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper: Calcular estadísticas
function calcularEstadisticas(odontograma: any) {
  let sanos = 0;
  let tratados = 0;
  let problemas = 0;
  let observacion = 0;

  Object.values(odontograma).forEach((diente: any) => {
    const estado = diente.estado.toUpperCase();
    switch (estado) {
      case 'SANO':
        sanos++;
        break;
      case 'TRATADO':
      case 'OBTURADO':
      case 'ENDODONCIA':
      case 'PROTESIS':
        tratados++;
        break;
      case 'CARIES':
      case 'FRACTURADO':
      case 'EXTRAIDO':
      case 'AUSENTE':
        problemas++;
        break;
      case 'OBSERVACION':
      case 'IMPLANTE':
        observacion++;
        break;
    }
  });

  return { sanos, tratados, problemas, observacion };
}
