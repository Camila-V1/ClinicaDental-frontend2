/**
 * MIS CITAS - v0 Design
 * Lista de todas las citas del paciente con filtros
 * Diseño profesional con colores slate/teal
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Plus } from 'lucide-react';
import { obtenerMisCitas, type Cita } from '../../services/agendaService';

const MisCitas = () => {
  const navigate = useNavigate();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('TODAS');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('📅 [MisCitas] Componente renderizado');
  console.log('📊 [MisCitas] Estado actual:', { filtroEstado, totalCitas: citas.length, cargando });

  useEffect(() => {
    console.log('🔄 [MisCitas] useEffect disparado - filtroEstado:', filtroEstado);
    cargarCitas();
  }, [filtroEstado]);

  const cargarCitas = async () => {
    console.log('📅 [MisCitas] Cargando citas...');
    console.log('🔍 [MisCitas] Filtro aplicado:', filtroEstado);
    setCargando(true);
    setError(null);
    try {
      const filtros = filtroEstado !== 'TODAS' ? { estado: filtroEstado } : {};
      console.log('📤 [MisCitas] Enviando filtros:', filtros);
      const citasData = await obtenerMisCitas(filtros);
      setCitas(citasData);
      console.log('✅ [MisCitas] Citas cargadas:', citasData.length);
      console.log('📊 [MisCitas] Primera cita:', citasData[0]);
    } catch (error: any) {
      console.error('❌ [MisCitas] Error cargando citas:', error);
      console.error('❌ [MisCitas] Status:', error.response?.status);
      console.error('❌ [MisCitas] Data:', error.response?.data);
      setError(error.response?.data?.detail || 'Error al cargar las citas');
      if (error.response?.status === 401) {
        console.warn('⚠️ [MisCitas] No autenticado, redirigiendo a login');
        navigate('/login');
      }
    } finally {
      setCargando(false);
      console.log('✅ [MisCitas] Estado cargando actualizado a false');
    }
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return { border: '#f59e0b', bg: '#fef3c7', text: '#d97706' };
      case 'CONFIRMADA': return { border: '#0d9488', bg: '#ccfbf1', text: '#0f766e' };
      case 'ATENDIDA': 
      case 'COMPLETADA': return { border: '#059669', bg: '#d1fae5', text: '#047857' };
      case 'CANCELADA': return { border: '#dc2626', bg: '#fee2e2', text: '#b91c1c' };
      default: return { border: '#64748b', bg: '#f1f5f9', text: '#475569' };
    }
  };

  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatearHora = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '24px 32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600', color: '#0f172a' }}>Mis Citas</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => navigate('/paciente/citas/solicitar')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#0d9488',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 150ms'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f766e'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
            >
              <Plus size={18} strokeWidth={1.5} />
              Nueva Cita
            </button>
            <button
              onClick={() => navigate('/paciente/dashboard')}
              style={{
                padding: '10px 20px',
                backgroundColor: 'white',
                color: '#475569',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
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
              <ArrowLeft size={18} strokeWidth={1.5} />
              Volver
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '20px', flexWrap: 'wrap' }}>
          {['TODAS', 'PENDIENTE', 'CONFIRMADA', 'ATENDIDA', 'CANCELADA'].map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado)}
              style={{
                padding: '8px 16px',
                backgroundColor: filtroEstado === estado ? '#0d9488' : 'white',
                color: filtroEstado === estado ? 'white' : '#475569',
                border: `1px solid ${filtroEstado === estado ? '#0d9488' : '#cbd5e1'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 150ms'
              }}
              onMouseEnter={(e) => {
                if (filtroEstado !== estado) {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#94a3b8';
                }
              }}
              onMouseLeave={(e) => {
                if (filtroEstado !== estado) {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }
              }}
            >
              {estado}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '32px', width: '100%', boxSizing: 'border-box' }}>
        {error && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            marginBottom: '20px',
            color: '#991b1b',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {cargando ? (
          <p style={{ textAlign: 'center', padding: '80px', color: '#94a3b8', fontSize: '15px' }}>Cargando citas...</p>
        ) : citas.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '80px 40px',
            textAlign: 'center'
          }}>
            <Calendar size={64} strokeWidth={1.5} style={{ color: '#cbd5e1', margin: '0 auto 20px' }} />
            <p style={{ fontSize: '18px', color: '#475569', margin: '0 0 8px 0', fontWeight: '500' }}>
              No tienes citas {filtroEstado !== 'TODAS' ? filtroEstado.toLowerCase() + 's' : ''}
            </p>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 24px 0' }}>
              Solicita una nueva cita para comenzar
            </p>
            <button
              onClick={() => navigate('/paciente/citas/solicitar')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#0d9488',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 150ms'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f766e'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
            >
              <Plus size={18} strokeWidth={1.5} />
              Solicitar Nueva Cita
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {citas.map((cita) => {
              const colores = getColorEstado(cita.estado);
              return (
                <div
                  key={cita.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    transition: 'all 150ms'
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <Calendar size={18} strokeWidth={1.5} style={{ color: '#0d9488' }} />
                        <span style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>
                          {formatearFecha(cita.fecha_hora)}
                        </span>
                        <Clock size={16} strokeWidth={1.5} style={{ color: '#64748b', marginLeft: '4px' }} />
                        <span style={{ fontSize: '15px', color: '#64748b' }}>
                          {formatearHora(cita.fecha_hora)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
                        <User size={16} strokeWidth={1.5} />
                        <span>{cita.odontologo_nombre || 'Odontólogo asignado'}</span>
                      </div>
                      <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px', paddingLeft: '24px' }}>
                        {cita.motivo}
                      </div>
                      {cita.duracion && (
                        <div style={{ fontSize: '13px', color: '#94a3b8', paddingLeft: '24px' }}>
                          Duración: {cita.duracion} minutos
                        </div>
                      )}
                    </div>
                    <span style={{
                      padding: '6px 12px',
                      backgroundColor: colores.bg,
                      color: colores.text,
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      border: `1px solid ${colores.border}`,
                      whiteSpace: 'nowrap'
                    }}>
                      {cita.estado}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisCitas;
