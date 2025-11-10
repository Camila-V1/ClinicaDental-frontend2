/**
 * 📅 AGENDA DE CITAS - Odontólogo
 */

import { useState, useEffect } from 'react';
import { obtenerCitas, cancelarCita, type Cita } from '../../services/agendaService';
import ModalRegistrarEpisodio from '../../components/historial/ModalRegistrarEpisodio';

export default function AgendaCitas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  
  // Estado del modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);

  // Cargar citas al montar componente
  useEffect(() => {
    cargarCitas();
  }, [filtroEstado, fechaInicio, fechaFin]);

  const cargarCitas = async () => {
    try {
      setLoading(true);
      const data = await obtenerCitas({
        estado: filtroEstado || undefined,
        fecha_inicio: fechaInicio || undefined,
        fecha_fin: fechaFin || undefined,
      });
      console.log('🔍 Primera cita (estructura):', data[0]);
      setCitas(data);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      alert('Error al cargar citas');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (id: number) => {
    const motivo = prompt('Motivo de cancelación:');
    if (!motivo) return;

    try {
      await cancelarCita(id, motivo);
      await cargarCitas();
      alert('✅ Cita cancelada');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cancelar cita');
    }
  };

  const handleAtenderCita = async (cita: Cita) => {
    console.group('🩺 ATENDER CITA - Inicio del Proceso');
    console.log('📌 ID Cita:', cita.id);
    console.log('👤 Paciente:', cita.paciente_nombre || cita.paciente_email);
    console.log('📅 Fecha:', cita.fecha_hora);
    console.log('📝 Motivo:', cita.motivo);
    console.log('🏷️ Estado actual:', cita.estado);
    
    console.group('🔍 Análisis de Vinculación a Plan');
    console.log('es_cita_plan:', cita.es_cita_plan);
    console.log('servicio:', cita.servicio);
    console.log('item_plan:', cita.item_plan);
    console.log('item_plan_info:', cita.item_plan_info);
    
    if (cita.item_plan_info) {
      console.log('✅ Info del plan disponible:');
      console.log('  - Plan ID:', cita.item_plan_info.plan_id);
      console.log('  - Plan Nombre:', cita.item_plan_info.plan_nombre);
      console.log('  - Servicio ID:', cita.item_plan_info.servicio_id);
      console.log('  - Servicio Nombre:', cita.item_plan_info.servicio_nombre);
      console.log('  - Estado:', cita.item_plan_info.estado);
      console.log('  - Precio:', cita.item_plan_info.precio_total);
    } else if (cita.es_cita_plan && cita.item_plan) {
      console.warn('⚠️ Cita de plan PERO sin item_plan_info (se necesitará vincular manualmente)');
      console.log('  - item_plan ID que se debe buscar:', cita.item_plan);
    } else {
      console.log('📋 Cita simple (sin vinculación a plan)');
    }
    console.groupEnd();
    
    try {
      console.log('🔄 Paso 1: Guardando cita seleccionada en estado');
      setCitaSeleccionada(cita);
      
      console.log('🔄 Paso 2: Abriendo modal para registrar episodio');
      setModalAbierto(true);
      
      console.log('✅ Modal abierto, esperando que odontólogo registre episodio');
      console.log('📋 Props que se pasarán al modal:');
      console.log('  - pacienteId:', cita.paciente);
      console.log('  - pacienteNombre:', cita.paciente_nombre || cita.paciente_email);
      console.log('  - motivoCita:', cita.motivo);
      console.log('  - esCitaPlan:', cita.es_cita_plan ?? false);
      console.log('  - servicioId:', cita.item_plan_info?.servicio_id ?? cita.servicio ?? null);
      console.log('  - itemPlanId:', cita.item_plan ?? null);
      console.log('  - itemPlanInfo:', cita.item_plan_info ?? null);
      console.log('  - citaId:', cita.id);
      
    } catch (error: any) {
      console.error('❌ Error al abrir modal:', error);
      alert('❌ Error: ' + (error.response?.data?.error || error.message));
    }
    
    console.groupEnd();
  };

  const handleEpisodioCreado = () => {
    console.group('✅ EPISODIO CREADO - Finalizando Proceso');
    console.log('🔄 Cerrando modal...');
    console.log('🔄 Recargando lista de citas para reflejar cambios...');
    console.log('📊 La cita debería cambiar de estado a ATENDIDA');
    
    // Recargar citas para reflejar el cambio de estado
    cargarCitas();
    
    console.log('✅ Proceso de atención completado exitosamente');
    console.groupEnd();
  };

  const obtenerColorEstado = (estado: string) => {
    const colores = {
      PENDIENTE: '#fff3cd',
      CONFIRMADA: '#cfe2ff',
      COMPLETADA: '#d1e7dd',
      CANCELADA: '#f8d7da'
    };
    return colores[estado as keyof typeof colores] || '#e9ecef';
  };

  const obtenerColorTextoEstado = (estado: string) => {
    const colores = {
      PENDIENTE: '#856404',
      CONFIRMADA: '#084298',
      COMPLETADA: '#0f5132',
      CANCELADA: '#842029'
    };
    return colores[estado as keyof typeof colores] || '#495057';
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '400px' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: '#666' }}>Cargando citas...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', margin: '0 0 8px 0' }}>
          📅 Mi Agenda
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>Gestiona tus citas y consultas</p>
      </div>

      {/* Filtros */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
        padding: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px' 
        }}>
          {/* Filtro por Estado */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#333',
              marginBottom: '8px'
            }}>
              Estado
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="">Todos</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="CONFIRMADA">Confirmada</option>
              <option value="COMPLETADA">Completada</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
          </div>

          {/* Filtro Fecha Inicio */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#333',
              marginBottom: '8px'
            }}>
              Desde
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Filtro Fecha Fin */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#333',
              marginBottom: '8px'
            }}>
              Hasta
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Lista de Citas */}
      {citas.length === 0 ? (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#999', fontSize: '18px' }}>📭 No hay citas para mostrar</p>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={estiloHeader}>Paciente</th>
                  <th style={estiloHeader}>Fecha y Hora</th>
                  <th style={estiloHeader}>Motivo</th>
                  <th style={estiloHeader}>Estado</th>
                  <th style={estiloHeader}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {citas.map((cita) => (
                  <tr key={cita.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={estiloCelda}>
                      <div>
                        <div style={{ fontWeight: '500', color: '#333', marginBottom: '4px' }}>
                          {cita.paciente_nombre || 'Paciente'}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          {cita.paciente_email || 'Sin email'}
                        </div>
                      </div>
                    </td>
                    <td style={estiloCelda}>
                      <div>
                        <div style={{ color: '#333', marginBottom: '4px' }}>
                          {formatearFecha(cita.fecha_hora)}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          {cita.duracion || 30} minutos
                        </div>
                      </div>
                    </td>
                    <td style={estiloCelda}>
                      <div style={{ color: '#333', marginBottom: '4px' }}>{cita.motivo}</div>
                      {cita.notas && (
                        <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                          {cita.notas}
                        </div>
                      )}
                    </td>
                    <td style={estiloCelda}>
                      <span style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: '12px',
                        backgroundColor: obtenerColorEstado(cita.estado),
                        color: obtenerColorTextoEstado(cita.estado),
                        display: 'inline-block'
                      }}>
                        {cita.estado}
                      </span>
                    </td>
                    <td style={estiloCelda}>
                      {(cita.estado === 'CONFIRMADA' || cita.estado === 'PENDIENTE') && (
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleAtenderCita(cita)}
                            style={{
                              color: 'white',
                              background: '#27ae60',
                              padding: '8px 16px',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '600'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#229954'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#27ae60'}
                          >
                            🩺 Atender
                          </button>
                          <button
                            onClick={() => handleCancelar(cita.id)}
                            style={{
                              color: '#dc3545',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                          >
                            ✗ Cancelar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CSS para animación de loading */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Modal para registrar episodio */}
      {citaSeleccionada && (
        <ModalRegistrarEpisodio
          isOpen={modalAbierto}
          onClose={() => {
            setModalAbierto(false);
            setCitaSeleccionada(null);
          }}
          pacienteId={citaSeleccionada.paciente}
          pacienteNombre={citaSeleccionada.paciente_nombre || citaSeleccionada.paciente_email}
          motivoCita={citaSeleccionada.motivo}
          onEpisodioCreado={handleEpisodioCreado}
          esCitaPlan={citaSeleccionada.es_cita_plan ?? false}
          servicioId={citaSeleccionada.item_plan_info?.servicio_id ?? citaSeleccionada.servicio ?? null}
          itemPlanId={citaSeleccionada.item_plan ?? null}
          citaId={citaSeleccionada.id}
          itemPlanInfo={citaSeleccionada.item_plan_info ?? null}
        />
      )}
    </div>
  );
}

const estiloHeader = {
  padding: '16px',
  textAlign: 'left' as const,
  fontSize: '12px',
  fontWeight: '600' as const,
  color: '#666',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px'
};

const estiloCelda = {
  padding: '16px',
  fontSize: '14px'
};
