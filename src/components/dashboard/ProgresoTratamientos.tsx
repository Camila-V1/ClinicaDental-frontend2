import { useNavigate } from 'react-router-dom';

interface Plan {
  id: number;
  nombre: string;
  descripcion: string;
  progreso: number;
}

interface Props {
  planes: Plan[];
}

export default function ProgresoTratamientos({ planes }: Props) {
  const navigate = useNavigate();

  const obtenerColor = (progreso: number) => {
    if (progreso < 30) return '#dc2626';
    if (progreso < 70) return '#d97706';
    return '#059669';
  };

  const planesActivos = planes ? planes.slice(0, 3) : [];

  if (planesActivos.length === 0) {
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
          Progreso de Tratamientos
        </h2>
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px 0' }}>
          No tienes planes de tratamiento activos
        </p>
        <button
          onClick={() => navigate('/paciente/planes')}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#0d9488',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '500',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 150ms'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0f766e';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#0d9488';
          }}
        >
          Ver Todos los Planes
        </button>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', margin: 0 }}>
          Progreso de Tratamientos
        </h2>
        <button
          onClick={() => navigate('/paciente/planes')}
          style={{
            padding: '6px 12px',
            backgroundColor: 'white',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            color: '#475569',
            transition: 'all 150ms'
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
          Ver Todos
        </button>
      </div>
      <div>
        {planesActivos.map((plan, index) => (
          <div
            key={plan.id}
            style={{
              padding: '16px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              backgroundColor: 'white',
              marginBottom: index < planesActivos.length - 1 ? '10px' : 0,
              cursor: 'pointer',
              transition: 'all 150ms'
            }}
            onClick={() => navigate(`/paciente/planes/${plan.id}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <div style={{ marginBottom: '12px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', margin: '0 0 4px 0' }}>
                {plan.nombre}
              </h3>
              {plan.descripcion && (
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  {plan.descripcion}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  flex: 1,
                  height: '6px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${plan.progreso}%`,
                    backgroundColor: obtenerColor(plan.progreso),
                    transition: 'width 0.5s ease-in-out',
                    borderRadius: '3px'
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: obtenerColor(plan.progreso),
                  minWidth: '42px',
                  textAlign: 'right'
                }}
              >
                {plan.progreso}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
