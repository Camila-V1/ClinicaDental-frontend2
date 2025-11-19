/**
 * 📊 ESTADÍSTICAS CARDS - Diseño profesional v0
 * Sistema de colores: slate/teal (profesional y clínico)
 */

import { useNavigate } from 'react-router-dom';
import { Calendar, Activity, FileText, DollarSign } from 'lucide-react';

interface Props {
  estadisticas: any;
}

export default function EstadisticasCards({ estadisticas }: Props) {
  const navigate = useNavigate();

  const cards = [
    {
      titulo: 'Próximas Citas',
      valor: estadisticas?.totalCitasProximas || 0,
      Icon: Calendar,
      ruta: '/paciente/citas',
      descripcion: 'citas programadas'
    },
    {
      titulo: 'Tratamientos Activos',
      valor: estadisticas?.totalPlanesActivos || 0,
      Icon: Activity,
      ruta: '/paciente/planes',
      descripcion: 'en progreso'
    },
    {
      titulo: 'Solicitudes Pendientes',
      valor: estadisticas?.totalPlanesPropuestos || 0,
      Icon: FileText,
      ruta: '/paciente/solicitudes',
      descripcion: 'requieren atención'
    },
    {
      titulo: 'Saldo Pendiente',
      valor: `Bs. ${(estadisticas?.saldoPendiente || 0).toFixed(2)}`,
      Icon: DollarSign,
      ruta: '/paciente/facturas',
      descripcion: 'por pagar'
    }
  ];

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '16px', 
      marginBottom: '24px' 
    }}>
      {cards.map((card, index) => {
        const Icon = card.Icon;
        return (
          <div
            key={index}
            onClick={() => navigate(card.ruta)}
            style={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 150ms ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#64748b', 
                  fontWeight: '500', 
                  margin: '0 0 8px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.025em'
                }}>
                  {card.titulo}
                </p>
                <p style={{ 
                  fontSize: '32px', 
                  fontWeight: '600', 
                  color: '#0f172a', 
                  margin: 0,
                  lineHeight: 1
                }}>
                  {card.valor}
                </p>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#94a3b8', 
                  margin: '6px 0 0 0'
                }}>
                  {card.descripcion}
                </p>
              </div>
              <Icon 
                size={40} 
                strokeWidth={1.5}
                style={{ color: '#94a3b8', flexShrink: 0 }} 
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
