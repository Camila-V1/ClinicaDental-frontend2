import { useNavigate } from 'react-router-dom';
import { AlertCircle, DollarSign, Calendar } from 'lucide-react';

interface Props {
  estadisticas: any;
}

export default function AlertasUrgentes({ estadisticas }: Props) {
  const navigate = useNavigate();
  const alertas = [];

  if (estadisticas?.totalPlanesPropuestos > 0) {
    alertas.push({
      tipo: 'warning',
      Icon: AlertCircle,
      titulo: 'Solicitudes Pendientes',
      mensaje: `Tienes ${estadisticas.totalPlanesPropuestos} ${
        estadisticas.totalPlanesPropuestos === 1 ? 'solicitud' : 'solicitudes'
      } de tratamiento pendientes de aprobar`,
      accion: 'Ver Solicitudes',
      ruta: '/paciente/solicitudes',
      bgColor: '#fffbeb',
      borderColor: '#fbbf24',
      iconColor: '#d97706'
    });
  }

  if (estadisticas?.saldoPendiente > 0) {
    alertas.push({
      tipo: 'error',
      Icon: DollarSign,
      titulo: 'Saldo Pendiente',
      mensaje: `Tienes un saldo pendiente de Bs. ${estadisticas.saldoPendiente.toFixed(2)}`,
      accion: 'Ver Facturas',
      ruta: '/paciente/facturas',
      bgColor: '#fef2f2',
      borderColor: '#f87171',
      iconColor: '#dc2626'
    });
  }

  const citasProximas = estadisticas?.proximasCitas?.filter((cita: any) => {
    const fechaCita = new Date(cita.fecha_hora);
    const ahora = new Date();
    const diffHoras = (fechaCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);
    return diffHoras > 0 && diffHoras < 48;
  });

  if (citasProximas?.length > 0) {
    alertas.push({
      tipo: 'info',
      Icon: Calendar,
      titulo: 'Citas Próximas',
      mensaje: `Tienes ${citasProximas.length} ${
        citasProximas.length === 1 ? 'cita' : 'citas'
      } en las próximas 48 horas`,
      accion: 'Ver Citas',
      ruta: '/paciente/citas',
      bgColor: '#f0fdfa',
      borderColor: '#5eead4',
      iconColor: '#0d9488'
    });
  }

  if (alertas.length === 0) return null;

  return (
    <div style={{ marginBottom: '24px' }}>
      {alertas.map((alerta, index) => {
        const { Icon } = alerta;
        return (
          <div
            key={index}
            style={{
              backgroundColor: alerta.bgColor,
              border: `1px solid ${alerta.borderColor}`,
              borderRadius: '8px',
              padding: '16px 20px',
              marginBottom: index < alertas.length - 1 ? '12px' : 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                <Icon size={20} strokeWidth={1.5} style={{ color: alerta.iconColor, marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontWeight: '600', color: '#0f172a', margin: '0 0 4px 0', fontSize: '15px' }}>{alerta.titulo}</h3>
                  <p style={{ color: '#475569', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>{alerta.mensaje}</p>
                </div>
              </div>
              <button
                onClick={() => navigate(alerta.ruta)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'white',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontWeight: '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  color: '#475569',
                  transition: 'all 150ms',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#94a3b8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
              >
                {alerta.accion}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
