/**
 * 🚀 ACCESOS RÁPIDOS - Diseño profesional v0
 * Navegación limpia sin colores vibrantes
 */

import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, Activity, CheckSquare, Receipt, Smile } from 'lucide-react';

const AccesosRapidos = () => {
  const navigate = useNavigate();

  const accesos = [
    {
      id: 1,
      titulo: 'Mis Citas',
      descripcion: 'Ver y gestionar citas',
      Icon: Calendar,
      ruta: '/paciente/citas'
    },
    {
      id: 2,
      titulo: 'Historial Clínico',
      descripcion: 'Registros médicos',
      Icon: FileText,
      ruta: '/paciente/historial'
    },
    {
      id: 3,
      titulo: 'Tratamientos',
      descripcion: 'Planes activos',
      Icon: Activity,
      ruta: '/paciente/planes'
    },
    {
      id: 4,
      titulo: 'Solicitudes',
      descripcion: 'Aprobaciones pendientes',
      Icon: CheckSquare,
      ruta: '/paciente/solicitudes'
    },
    {
      id: 5,
      titulo: 'Facturas',
      descripcion: 'Estado de cuenta',
      Icon: Receipt,
      ruta: '/paciente/facturas'
    },
    {
      id: 6,
      titulo: 'Odontograma',
      descripcion: 'Mapa dental',
      Icon: Smile,
      ruta: '/paciente/odontograma'
    }
  ];

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '24px'
    }}>
      <h3 style={{ 
        margin: '0 0 20px 0', 
        color: '#0f172a',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        Accesos Rápidos
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px'
      }}>
        {accesos.map((acceso) => {
          const Icon = acceso.Icon;
          return (
            <div
              key={acceso.id}
              onClick={() => navigate(acceso.ruta)}
              style={{
                padding: '16px',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 150ms ease-in-out',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <Icon 
                size={32} 
                strokeWidth={1.5}
                style={{ 
                  color: '#64748b', 
                  margin: '0 auto 12px',
                  display: 'block'
                }} 
              />
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '4px'
              }}>
                {acceso.titulo}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#64748b' 
              }}>
                {acceso.descripcion}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccesosRapidos;
