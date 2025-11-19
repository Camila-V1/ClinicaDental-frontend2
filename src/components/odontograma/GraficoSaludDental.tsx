/**
 * 📊 GRAFICO SALUD DENTAL - Gráfico circular con índice de salud
 */

interface Props {
  odontograma: any;
}

export default function GraficoSaludDental({ odontograma }: Props) {
  const stats = calcularEstadisticas(odontograma);
  const porcentajeSalud = Math.round((stats.sanos / 32) * 100);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="font-bold text-gray-800 mb-6 text-center text-xl">
        📊 Índice de Salud Dental
      </h3>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '32px',
        flexWrap: 'wrap'
      }}>
        {/* Gráfico Circular */}
        <div style={{ position: 'relative' }}>
          <svg style={{ width: '192px', height: '192px', transform: 'rotate(-90deg)' }}>
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="#E5E7EB"
              strokeWidth="16"
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke={porcentajeSalud >= 80 ? '#10B981' : porcentajeSalud >= 50 ? '#F59E0B' : '#EF4444'}
              strokeWidth="16"
              fill="none"
              strokeDasharray={`${(porcentajeSalud / 100) * 502.65} 502.65`}
              strokeLinecap="round"
              style={{ transition: 'all 1s ease-in-out' }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#111827'
            }}>
              {porcentajeSalud}%
            </span>
            <span style={{
              fontSize: '14px',
              color: '#6b7280',
              marginTop: '4px'
            }}>
              Salud Dental
            </span>
          </div>
        </div>

        {/* Desglose */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#10B981',
              borderRadius: '9999px'
            }}></div>
            <span style={{ fontSize: '14px' }}>
              <strong>{stats.sanos}</strong> Sanos
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#3B82F6',
              borderRadius: '9999px'
            }}></div>
            <span style={{ fontSize: '14px' }}>
              <strong>{stats.tratados}</strong> Tratados
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#6B7280',
              borderRadius: '9999px'
            }}></div>
            <span style={{ fontSize: '14px' }}>
              <strong>{stats.ausentes}</strong> Ausentes
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#F59E0B',
              borderRadius: '9999px'
            }}></div>
            <span style={{ fontSize: '14px' }}>
              <strong>{stats.observacion}</strong> En Observación
            </span>
          </div>
        </div>
      </div>

      {/* Mensaje */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        borderRadius: '8px',
        backgroundColor: porcentajeSalud >= 80 ? '#f0fdf4' : '#fffbeb',
        border: `1px solid ${porcentajeSalud >= 80 ? '#bbf7d0' : '#fde68a'}`
      }}>
        <p style={{
          textAlign: 'center',
          fontWeight: '500',
          color: '#111827'
        }}>
          {porcentajeSalud >= 80 
            ? '🎉 ¡Excelente! Tu salud dental está en muy buen estado'
            : porcentajeSalud >= 50
            ? '👍 Buen estado general, continúa con tus controles'
            : '⚠️ Se recomienda agendar una consulta de revisión'
          }
        </p>
      </div>
    </div>
  );
}

// Helper: Calcular estadísticas
function calcularEstadisticas(odontograma: any) {
  let sanos = 0;
  let tratados = 0;
  let ausentes = 0;
  let observacion = 0;

  Object.values(odontograma).forEach((diente: any) => {
    switch (diente.estado.toUpperCase()) {
      case 'SANO': sanos++; break;
      case 'TRATADO': tratados++; break;
      case 'AUSENTE': ausentes++; break;
      case 'OBSERVACION': observacion++; break;
    }
  });

  return { sanos, tratados, ausentes, observacion };
}
