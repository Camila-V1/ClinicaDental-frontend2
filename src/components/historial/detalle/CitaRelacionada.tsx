import { useNavigate } from 'react-router-dom';
import { formatearFecha } from '../../../services/historialService';

interface Props {
  cita: any;
}

export default function CitaRelacionada({ cita }: Props) {
  const navigate = useNavigate();

  const getEstadoColor = (estado: string) => {
    switch (estado?.toUpperCase()) {
      case 'COMPLETADA':
        return 'bg-green-100 text-green-800';
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        margin: '0 0 16px 0'
      }}>
        📅 Cita Relacionada
      </h2>

      <div style={{
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        padding: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <div>
            <h4 style={{
              fontWeight: '600',
              color: '#111827',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>
              Cita #{cita.id}
            </h4>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>
              {formatearFecha(cita.fecha_hora)}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(cita.estado)}`}>
            {cita.estado}
          </span>
        </div>

        {cita.motivo && (
          <div style={{ marginBottom: '12px' }}>
            <p style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              margin: '0 0 4px 0'
            }}>
              Motivo:
            </p>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>
              {cita.motivo}
            </p>
          </div>
        )}

        {cita.duracion_minutos && (
          <div style={{ marginBottom: '12px' }}>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>
              ⏱️ Duración: {cita.duracion_minutos} minutos
            </p>
          </div>
        )}

        <button
          onClick={() => navigate(`/paciente/citas/${cita.id}`)}
          style={{
            width: '100%',
            marginTop: '12px',
            padding: '10px 16px',
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '500',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
        >
          Ver detalle de la cita →
        </button>
      </div>
    </div>
  );
}
