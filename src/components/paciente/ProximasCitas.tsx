/**
 * PRÓXIMAS CITAS - v0 Design
 * Muestra las próximas citas programadas del paciente
 * Diseño profesional con colores slate/teal
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User } from 'lucide-react';
import { obtenerProximasCitas, type Cita } from '../../services/agendaService';

const ProximasCitas = () => {
  const navigate = useNavigate();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarProximasCitas();
  }, []);

  const cargarProximasCitas = async () => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('📅 [ProximasCitas] INICIANDO CARGA DE CITAS');
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎯 [ProximasCitas] Llamando a: obtenerProximasCitas(3)');
    console.log('📡 [ProximasCitas] Endpoint esperado: /api/agenda/citas/?fecha_inicio=...&ordering=fecha_hora&limit=3');
    
    setCargando(true);
    setError(null);
    
    try {
      const citasData = await obtenerProximasCitas(3); // Obtener las próximas 3 citas
      
      console.log('═══════════════════════════════════════════════════════');
      console.log('✅ [ProximasCitas] RESPUESTA RECIBIDA DEL BACKEND');
      console.log('═══════════════════════════════════════════════════════');
      console.log('📊 Tipo de respuesta:', typeof citasData);
      console.log('📊 Es array?:', Array.isArray(citasData));
      console.log('📊 Número de citas:', citasData?.length || 0);
      console.log('📊 Datos completos:', citasData);
      
      if (citasData && citasData.length > 0) {
        console.log('───────────────────────────────────────────────────────');
        console.log('🔍 [ProximasCitas] ANÁLISIS DE PRIMERA CITA:');
        console.log('───────────────────────────────────────────────────────');
        const primeraCita = citasData[0];
        console.log('📋 Objeto completo:', primeraCita);
        console.log('📋 Campos disponibles:', Object.keys(primeraCita));
        console.log('📋 Valores importantes:', {
          id: primeraCita.id,
          paciente: primeraCita.paciente,
          paciente_nombre: primeraCita.paciente_nombre,
          odontologo_nombre: primeraCita.odontologo_nombre,
          fecha_hora: primeraCita.fecha_hora,
          estado: primeraCita.estado,
          motivo: primeraCita.motivo,
          es_cita_plan: primeraCita.es_cita_plan,
          item_plan: primeraCita.item_plan
        });
        
        console.log('───────────────────────────────────────────────────────');
        console.log('📋 [ProximasCitas] TODAS LAS CITAS:');
        citasData.forEach((cita, index) => {
          console.log(`  ${index + 1}. ID: ${cita.id} | ${cita.fecha_hora} | ${cita.odontologo_nombre} | "${cita.motivo}"`);
        });
        console.log('───────────────────────────────────────────────────────');
      } else {
        console.log('⚠️ [ProximasCitas] NO HAY CITAS DISPONIBLES');
      }
      
      setCitas(citasData);
      console.log('✅ [ProximasCitas] Estado actualizado con', citasData.length, 'citas');
      console.log('═══════════════════════════════════════════════════════');
    } catch (error: any) {
      console.log('═══════════════════════════════════════════════════════');
      console.error('❌ [ProximasCitas] ERROR AL CARGAR CITAS');
      console.log('═══════════════════════════════════════════════════════');
      console.error('❌ Error completo:', error);
      console.error('❌ Mensaje:', error.message);
      console.error('❌ Response:', error.response?.data);
      console.error('❌ Status:', error.response?.status);
      console.log('═══════════════════════════════════════════════════════');
      
      setError(error.response?.data?.detail || 'Error al cargar las citas');
      setCitas([]);
    } finally {
      setCargando(false);
      console.log('🏁 [ProximasCitas] Carga finalizada');
    }
  };

  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    const opciones: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  if (cargando) {
    console.log('⏳ [ProximasCitas] Componente en estado CARGANDO');
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#0f172a', fontSize: '18px', fontWeight: '600' }}>
          Próximas Citas
        </h3>
        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
          Cargando citas...
        </p>
      </div>
    );
  }

  console.log('🎨 [ProximasCitas] Renderizando componente');
  console.log('🎨 Estado actual - citas:', citas);
  console.log('🎨 Estado actual - citas.length:', citas.length);
  console.log('🎨 Estado actual - error:', error);
  console.log('🎨 Estado actual - cargando:', cargando);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      minHeight: '200px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px', fontWeight: '600' }}>
          Próximas Citas
        </h3>
        <button
          onClick={() => navigate('/paciente/citas')}
          style={{
            padding: '6px 12px',
            backgroundColor: 'white',
            color: '#475569',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '13px',
            cursor: 'pointer',
            fontWeight: '500',
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
          Ver todas
        </button>
      </div>

      {/* Lista de citas */}
      {error ? (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          color: '#991b1b',
          fontSize: '14px'
        }}>
          {error}
        </div>
      ) : citas.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 20px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px dashed #cbd5e1'
        }}>
          <Calendar size={48} strokeWidth={1.5} style={{ color: '#cbd5e1', margin: '0 auto 12px' }} />
          <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '15px' }}>
            No tienes citas programadas
          </p>
          <button
            onClick={() => navigate('/paciente/citas/solicitar')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0d9488',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 150ms'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f766e'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
          >
            Solicitar Cita
          </button>
        </div>
      ) : (
        <div 
          style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          data-testid="citas-container"
        >
          {citas.map((cita, index) => {
            console.log(`🔄 [ProximasCitas] Renderizando cita #${index + 1}:`, cita.id, cita);
            return (
              <div
                key={cita.id}
                data-testid={`cita-${cita.id}`}
                style={{
                  padding: '16px',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 150ms'
                }}
                onClick={() => navigate('/paciente/citas')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '12px' }}>
                  <Clock size={18} strokeWidth={1.5} style={{ color: '#0d9488', marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: '#0f172a', fontSize: '14px', fontWeight: '600' }}>
                      {formatearFecha(cita.fecha_hora)}
                    </strong>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>
                  <User size={16} strokeWidth={1.5} />
                  <span>{cita.odontologo_nombre || 'Odontólogo asignado'}</span>
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8', paddingLeft: '24px' }}>
                  {cita.motivo}
                </div>
              </div>
            );
          })}
          
          {/* Botón Ver Todas */}
          <button
            onClick={() => navigate('/paciente/citas')}
            style={{
              padding: '12px',
              backgroundColor: 'white',
              border: '1px solid #cbd5e1',
              color: '#475569',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              marginTop: '12px',
              transition: 'all 150ms',
              width: '100%'
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
            Ver Todas Mis Citas →
          </button>
        </div>
      )}
    </div>
  );
};

export default ProximasCitas;
