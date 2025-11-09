import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearPlan, type CrearPlanDTO } from '../../services/planesService';
import { obtenerUsuarios, type Usuario } from '../../services/usuariosService';
import { useAuthContext } from '../../context/AuthContext';

export default function PlanNuevo() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState<Usuario[]>([]);
  const [buscandoPacientes, setBuscandoPacientes] = useState(true);

  const [formData, setFormData] = useState<CrearPlanDTO>({
    paciente: 0,
    odontologo: user?.id || 0,
    titulo: '',
    descripcion: '',
    estado: 'PROPUESTO',
    prioridad: 'MEDIA',
    notas_internas: ''
  });

  useEffect(() => {
    cargarPacientes();
  }, []);

  const cargarPacientes = async () => {
    try {
      setBuscandoPacientes(true);
      const data = await obtenerUsuarios({ tipo_usuario: 'PACIENTE' });
      setPacientes(data);
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
      alert('Error al cargar lista de pacientes');
    } finally {
      setBuscandoPacientes(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titulo.trim()) {
      alert('El título es obligatorio');
      return;
    }

    if (!formData.paciente) {
      alert('Debes seleccionar un paciente');
      return;
    }

    try {
      setLoading(true);
      const planCreado = await crearPlan(formData);
      alert('✅ Plan de tratamiento creado exitosamente');
      
      // Redirigir al detalle del plan para agregar ítems
      navigate(`/odontologo/planes/${planCreado.id}`);
    } catch (error: any) {
      console.error('Error al crear plan:', error);
      alert('❌ Error al crear plan: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1024px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => navigate('/odontologo/planes')}
          style={{
            color: '#3b82f6',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = '#2563eb'}
          onMouseOut={(e) => e.currentTarget.style.color = '#3b82f6'}
        >
          ← Volver a Planes
        </button>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
          📋 Nuevo Plan de Tratamiento
        </h1>
        <p style={{ color: '#6b7280', marginTop: '4px' }}>
          Crea un plan personalizado para tu paciente
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '24px'
      }}>
        {/* Paciente */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Paciente <span style={{ color: '#dc2626' }}>*</span>
          </label>
          {buscandoPacientes ? (
            <div style={{ color: '#6b7280' }}>Cargando pacientes...</div>
          ) : (
            <select
              value={formData.paciente}
              onChange={(e) => setFormData({ ...formData, paciente: Number(e.target.value) })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              required
            >
              <option value={0}>Selecciona un paciente</option>
              {pacientes.map(paciente => (
                <option key={paciente.id} value={paciente.id}>
                  {paciente.full_name} - {paciente.ci ? `CI: ${paciente.ci}` : paciente.email}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Título */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Título del Plan <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            placeholder="Ej: Rehabilitación Dental Completa"
            required
          />
        </div>

        {/* Descripción */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Descripción
          </label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            rows={4}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              resize: 'vertical'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            placeholder="Describe el plan de tratamiento general..."
          />
        </div>

        {/* Prioridad */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Prioridad
          </label>
          <select
            value={formData.prioridad}
            onChange={(e) => setFormData({ ...formData, prioridad: e.target.value as any })}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
          >
            <option value="BAJA">Baja</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
            <option value="URGENTE">Urgente</option>
          </select>
        </div>

        {/* Notas Internas */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Notas Internas (Solo para el equipo médico)
          </label>
          <textarea
            value={formData.notas_internas}
            onChange={(e) => setFormData({ ...formData, notas_internas: e.target.value })}
            rows={3}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              resize: 'vertical'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            placeholder="Notas privadas sobre el plan..."
          />
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate('/odontologo/planes')}
            disabled={loading}
            style={{
              padding: '10px 24px',
              border: '1px solid #d1d5db',
              color: '#374151',
              borderRadius: '8px',
              backgroundColor: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              fontSize: '14px',
              fontWeight: '500'
            }}
            onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#f9fafb')}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500'
            }}
            onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2563eb')}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
          >
            {loading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Creando...
              </>
            ) : (
              '✅ Crear Plan'
            )}
          </button>
        </div>

        {/* Info */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#dbeafe',
          borderRadius: '8px',
          border: '1px solid #93c5fd'
        }}>
          <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
            ℹ️ <strong>Nota:</strong> Después de crear el plan, podrás agregar los servicios (procedimientos) que incluirá el tratamiento.
          </p>
        </div>
      </form>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
