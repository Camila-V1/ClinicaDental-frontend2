import { Calendar, Activity, FileText, CheckCircle } from 'lucide-react';

interface Actividad {
  tipo: 'cita' | 'plan' | 'factura' | 'pago';
  titulo: string;
  descripcion: string;
  fecha: string;
}

interface Props {
  actividades: Actividad[];
}

export default function TimelineActividad({ actividades }: Props) {
  const obtenerIcono = (tipo: string) => {
    switch (tipo) {
      case 'cita':
        return Calendar;
      case 'plan':
        return Activity;
      case 'factura':
        return FileText;
      case 'pago':
        return CheckCircle;
      default:
        return FileText;
    }
  };

  const obtenerColor = (tipo: string) => {
    switch (tipo) {
      case 'cita':
        return '#0d9488';
      case 'plan':
        return '#059669';
      case 'factura':
        return '#d97706';
      case 'pago':
        return '#0d9488';
      default:
        return '#64748b';
    }
  };

  if (!actividades || actividades.length === 0) {
    return (
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '24px'
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
          Actividad Reciente
        </h2>
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px 0' }}>
          No hay actividades recientes
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        padding: '24px'
      }}
    >
      <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '20px' }}>
        Actividad Reciente
      </h2>
      <div style={{ position: 'relative', paddingLeft: '36px' }}>
        {/* Línea vertical del timeline */}
        <div
          style={{
            position: 'absolute',
            left: '13px',
            top: 0,
            bottom: 0,
            width: '2px',
            backgroundColor: '#e2e8f0'
          }}
        />
        {actividades.map((actividad, index) => {
          const Icon = obtenerIcono(actividad.tipo);
          return (
            <div
              key={index}
              style={{
                position: 'relative',
                marginBottom: index < actividades.length - 1 ? '24px' : 0
              }}
            >
              {/* Punto del timeline */}
              <div
                style={{
                  position: 'absolute',
                  left: '-31px',
                  top: '2px',
                  width: '28px',
                  height: '28px',
                  backgroundColor: 'white',
                  border: `2px solid ${obtenerColor(actividad.tipo)}`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon size={14} strokeWidth={2} style={{ color: obtenerColor(actividad.tipo) }} />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', margin: '0 0 4px 0' }}>
                  {actividad.titulo}
                </h3>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 4px 0' }}>
                  {actividad.descripcion}
                </p>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                  {actividad.fecha}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
