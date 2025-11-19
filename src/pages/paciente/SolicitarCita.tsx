/**
 * SOLICITAR CITA AVANZADA
 * Formulario completo con horarios disponibles y tipos de cita
 */

import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  User, 
  Clock, 
  FileText, 
  Activity, 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle,
  DollarSign,
  Building,
  Clipboard
} from 'lucide-react';
import { 
  solicitarCitaAvanzada,
  obtenerOdontologosDisponibles,
  obtenerHorariosDisponibles,
  obtenerPlanesActivos,
  MOTIVOS_CITA,
  type OdontologoDisponible,
  type HorarioDisponible,
  type PlanActivoSimple,
  type MotivoTipo,
  type ItemPlanDisponible
} from '../../services/agendaService';

const SolicitarCita = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ← Obtener usuario autenticado
  
  // Estado del formulario
  const [tipoCita, setTipoCita] = useState<'GENERAL' | 'PLAN'>('GENERAL');
  const [motivoTipo, setMotivoTipo] = useState<MotivoTipo>('CONSULTA');
  const [fecha, setFecha] = useState('');
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [odontologoId, setOdontologoId] = useState('');
  const [motivo, setMotivo] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [planSeleccionado, setPlanSeleccionado] = useState<number | null>(null);
  const [itemPlanSeleccionado, setItemPlanSeleccionado] = useState<number | null>(null);
  
  // Estado de datos
  const [odontologos, setOdontologos] = useState<OdontologoDisponible[]>([]);
  const [horarios, setHorarios] = useState<HorarioDisponible[]>([]);
  const [planesActivos, setPlanesActivos] = useState<PlanActivoSimple[]>([]);
  
  // Estado de carga
  const [cargando, setCargando] = useState(false);
  const [cargandoOdontologos, setCargandoOdontologos] = useState(true);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);
  const [cargandoPlanes, setCargandoPlanes] = useState(false);

  useEffect(() => {
    cargarOdontologos();
    cargarPlanes();
  }, []);

  // Cargar horarios cuando cambia fecha u odontólogo
  useEffect(() => {
    if (fecha && odontologoId) {
      cargarHorarios();
    } else {
      setHorarios([]);
      setHoraSeleccionada('');
    }
  }, [fecha, odontologoId]);

  const cargarOdontologos = async () => {
    console.log('👨‍⚕️ [Solicitar] Cargando odontólogos disponibles...');
    setCargandoOdontologos(true);
    
    try {
      const data = await obtenerOdontologosDisponibles();
      setOdontologos(data);
      console.log('✅ Odontólogos cargados:', data.length);
    } catch (error) {
      console.error('❌ Error cargando odontólogos:', error);
    } finally {
      setCargandoOdontologos(false);
    }
  };

  const cargarPlanes = async () => {
    console.log('📋 [Solicitar] Cargando planes activos...');
    setCargandoPlanes(true);
    
    try {
      const data = await obtenerPlanesActivos();
      setPlanesActivos(data);
      console.log('✅ Planes activos cargados:', data.length);
    } catch (error) {
      console.error('❌ Error cargando planes:', error);
    } finally {
      setCargandoPlanes(false);
    }
  };

  const cargarHorarios = async () => {
    if (!fecha || !odontologoId) return;
    
    console.log('🕐 [Solicitar] Cargando horarios disponibles...');
    setCargandoHorarios(true);
    setHorarios([]);
    setHoraSeleccionada('');
    
    try {
      const data = await obtenerHorariosDisponibles(parseInt(odontologoId), fecha);
      setHorarios(data.horarios);
      console.log('✅ Horarios cargados:', data.total_disponibles, 'disponibles');
    } catch (error) {
      console.error('❌ Error cargando horarios:', error);
      alert('❌ Error al cargar horarios disponibles');
    } finally {
      setCargandoHorarios(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('🚀 [SUBMIT] INICIANDO VALIDACIONES');
    console.log('═══════════════════════════════════════════════════════');
    
    // Validación crítica: ID del paciente
    // ⚠️ IMPORTANTE: user.perfil_paciente.id puede no existir según el serializer del backend
    // Fallback: usar user.id directamente (PerfilPaciente tiene OneToOneField con Usuario)
    const pacienteId = (user as any)?.perfil_paciente?.id || user?.id;
    
    console.log('👤 Usuario completo:', user);
    console.log('👤 Usuario ID:', user?.id);
    console.log('👤 Perfil paciente:', (user as any)?.perfil_paciente);
    console.log('👤 Perfil paciente ID:', (user as any)?.perfil_paciente?.id);
    console.log('👤 ID final usado (con fallback):', pacienteId);
    
    if (!pacienteId) {
      alert('❌ Error: No se pudo obtener el perfil del paciente. Por favor, cierra sesión e inicia sesión nuevamente.');
      console.error('❌ No se pudo extraer ID del paciente. user:', user);
      return;
    }
    
    console.log('✅ Paciente ID validado:', pacienteId);
    
    // Validaciones
    if (!odontologoId) {
      alert('⚠️ Debes seleccionar un odontólogo');
      return;
    }
    
    if (!fecha) {
      alert('⚠️ Debes seleccionar una fecha');
      return;
    }
    
    if (!horaSeleccionada) {
      alert('⚠️ Debes seleccionar un horario');
      return;
    }
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('📝 [SUBMIT] VALIDANDO CAMPO MOTIVO');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📝 Motivo (raw):', motivo);
    console.log('📝 Motivo (trimmed):', motivo.trim());
    console.log('📝 Longitud (raw):', motivo.length);
    console.log('📝 Longitud (trimmed):', motivo.trim().length);
    console.log('📝 Tipo:', typeof motivo);
    console.log('📝 Incluye "📝":', motivo.includes('📝'));
    console.log('📝 Incluye "Motivo de la Consulta":', motivo.includes('Motivo de la Consulta'));
    console.log('═══════════════════════════════════════════════════════');
    
    if (!motivo.trim()) {
      alert('⚠️ Debes especificar el motivo de la consulta');
      return;
    }
    
    // Validación adicional: detectar si el motivo contiene texto del placeholder/label
    if (motivo.includes('📝') || motivo.includes('Motivo de la Consulta')) {
      alert('⚠️ Por favor ingresa un motivo válido (no uses el texto del placeholder)');
      return;
    }
    
    if (tipoCita === 'PLAN' && !itemPlanSeleccionado) {
      alert('⚠️ Debes seleccionar un tratamiento del plan');
      return;
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log('📅 [SOLICITAR CITA] TODAS LAS VALIDACIONES PASADAS');
    console.log('═══════════════════════════════════════════════════════');
    console.log('👤 Usuario autenticado:', user?.email);
    console.log('📋 Paciente ID:', pacienteId);
    console.log('👨‍⚕️ Odontólogo ID:', odontologoId);
    console.log('📅 Fecha:', fecha);
    console.log('🕐 Hora seleccionada:', horaSeleccionada);
    console.log('🏷️ Tipo de cita:', tipoCita);
    console.log('📋 Motivo tipo:', motivoTipo);
    console.log('📝 Motivo (final):', motivo);
    console.log('📝 Observaciones (final):', observaciones);
    console.log('═══════════════════════════════════════════════════════');
    setCargando(true);

    try {
      // Construir fecha_hora en formato ISO 8601
      // ⚠️ IMPORTANTE: Ajuste de zona horaria para evitar error 400
      // Si el usuario selecciona "12:30", queremos enviar "12:30" al backend,
      // NO "20:30" (que sería 12:30 + 8 horas de offset UTC)
      const fechaHora = `${fecha}T${horaSeleccionada}:00`;
      const fechaLocal = new Date(fechaHora);
      
      // Compensar el offset de zona horaria
      const offsetMinutos = fechaLocal.getTimezoneOffset();
      const fechaAjustada = new Date(fechaLocal.getTime() - (offsetMinutos * 60000));
      const fechaISO = fechaAjustada.toISOString();
      
      console.log('🕐 Conversión de fecha:');
      console.log('  - Input usuario:', fechaHora);
      console.log('  - Fecha local:', fechaLocal.toLocaleString());
      console.log('  - Offset (min):', offsetMinutos);
      console.log('  - Fecha ajustada:', fechaAjustada.toLocaleString());
      console.log('  - ISO final:', fechaISO);
      
      const motivoFinal = motivo.trim();
      const observacionesFinal = observaciones.trim() || undefined;
      
      const data = {
        paciente: pacienteId, // ⚠️ CRÍTICO: ID del PerfilPaciente (requerido por backend)
        odontologo: parseInt(odontologoId),
        fecha_hora: fechaISO,
        motivo_tipo: tipoCita === 'PLAN' ? 'PLAN' as MotivoTipo : motivoTipo,
        motivo: motivoFinal,
        observaciones: observacionesFinal,
        item_plan: tipoCita === 'PLAN' ? itemPlanSeleccionado : null
      };

      console.log('═══════════════════════════════════════════════════════');
      console.log('📤 [PAYLOAD] DATOS A ENVIAR AL BACKEND');
      console.log('═══════════════════════════════════════════════════════');
      console.log('📦 Objeto completo:', data);
      console.log('───────────────────────────────────────────────────────');
      console.log('📋 Campo por campo:');
      console.log('  • paciente:', data.paciente, `(tipo: ${typeof data.paciente})`);
      console.log('  • odontologo:', data.odontologo, `(tipo: ${typeof data.odontologo})`);
      console.log('  • fecha_hora:', data.fecha_hora, `(longitud: ${data.fecha_hora.length})`);
      console.log('  • motivo_tipo:', data.motivo_tipo);
      console.log('  • motivo:', data.motivo, `(longitud: ${data.motivo.length})`);
      console.log('  • observaciones:', data.observaciones, `(longitud: ${data.observaciones?.length || 0})`);
      console.log('  • item_plan:', data.item_plan);
      console.log('───────────────────────────────────────────────────────');
      console.log('🔍 Verificación del motivo:');
      console.log('  • Motivo original:', motivo);
      console.log('  • Motivo después de trim:', motivoFinal);
      console.log('  • Longitud original:', motivo.length);
      console.log('  • Longitud después de trim:', motivoFinal.length);
      console.log('  • Caracteres (primer 20):', motivoFinal.substring(0, 20));
      console.log('  • Código ASCII primer char:', motivoFinal.charCodeAt(0));
      console.log('═══════════════════════════════════════════════════════');

      const citaCreada = await solicitarCitaAvanzada(data);
      
      console.log('═══════════════════════════════════════════════════════');
      console.log('✅ [ÉXITO] CITA CREADA CORRECTAMENTE');
      console.log('═══════════════════════════════════════════════════════');
      console.log('📦 Respuesta del backend:', citaCreada);
      console.log('🆔 ID de la cita:', citaCreada.id);
      console.log('📅 Fecha/Hora confirmada:', citaCreada.fecha_hora);
      console.log('🏷️ Estado:', citaCreada.estado);
      console.log('═══════════════════════════════════════════════════════');
      
      alert('✅ Cita agendada exitosamente!');
      navigate('/paciente/citas');
    } catch (error: any) {
      console.error('═══════════════════════════════════════════════════════');
      console.error('❌ [ERROR AL CREAR CITA]');
      console.error('═══════════════════════════════════════════════════════');
      console.error('📋 Error completo:', error);
      console.error('📋 Tipo de error:', typeof error);
      console.error('📋 Error.name:', error.name);
      console.error('📋 Error.message:', error.message);
      console.error('───────────────────────────────────────────────────────');
      
      if (error.response) {
        console.error('🌐 [RESPONSE ERROR] El backend respondió con error');
        console.error('───────────────────────────────────────────────────────');
        console.error('📊 Status HTTP:', error.response.status);
        console.error('📊 Status Text:', error.response.statusText);
        console.error('📦 Data:', error.response.data);
        console.error('📋 Headers:', error.response.headers);
        console.error('───────────────────────────────────────────────────────');
        
        const errorData = error.response.data;
        console.error('🔍 [ANÁLISIS DEL ERROR DATA]');
        console.error('  • Tipo:', typeof errorData);
        console.error('  • Es objeto:', typeof errorData === 'object');
        console.error('  • Es array:', Array.isArray(errorData));
        console.error('  • Keys:', Object.keys(errorData || {}));
        console.error('  • JSON stringified:', JSON.stringify(errorData, null, 2));
      } else if (error.request) {
        console.error('🌐 [REQUEST ERROR] La petición se envió pero no hubo respuesta');
        console.error('───────────────────────────────────────────────────────');
        console.error('📦 Request:', error.request);
      } else {
        console.error('⚙️ [SETUP ERROR] Error al configurar la petición');
        console.error('───────────────────────────────────────────────────────');
        console.error('📦 Error:', error);
      }
      console.error('═══════════════════════════════════════════════════════');
      
      // Manejar errores específicos
      const errorData = error.response?.data;
      let mensaje = 'Error al agendar la cita. Intenta nuevamente.';
      
      if (errorData) {
        // Si hay un mensaje de error general
        if (errorData.detail) {
          mensaje = errorData.detail;
        } 
        // Si hay errores de campo específicos
        else if (typeof errorData === 'object') {
          const errores = [];
          for (const [campo, mensajes] of Object.entries(errorData)) {
            if (Array.isArray(mensajes)) {
              errores.push(`${campo}: ${mensajes.join(', ')}`);
            } else {
              errores.push(`${campo}: ${mensajes}`);
            }
          }
          if (errores.length > 0) {
            mensaje = 'Errores encontrados:\n' + errores.join('\n');
          }
        }
        // Si es un string directo
        else if (typeof errorData === 'string') {
          mensaje = errorData;
        }
      }
      
      console.error('📢 Mensaje de error para usuario:', mensaje);
      alert(`❌ ${mensaje}`);
    } finally {
      setCargando(false);
    }
  };

  // Obtener plan seleccionado completo
  const planActual = planesActivos.find(p => p.id === planSeleccionado);
  
  // Obtener items disponibles del plan
  const itemsDisponibles = planActual?.items_disponibles || [];

  // Obtener fecha mínima (mañana)
  const fechaMinima = new Date();
  fechaMinima.setDate(fechaMinima.getDate() + 1);
  const fechaMinimaStr = fechaMinima.toISOString().split('T')[0];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '2px solid #e0e0e0',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>
          ➕ Solicitar Nueva Cita
        </h1>
        <button
          onClick={() => navigate('/paciente/citas')}
          style={{
            padding: '10px 20px',
            backgroundColor: 'white',
            border: '2px solid #667eea',
            color: '#667eea',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ← Cancelar
        </button>
      </div>

      {/* Contenido */}
      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Info Banner */}
        <div style={{
          backgroundColor: '#dbeafe',
          borderLeft: '3px solid #3b82f6',
          borderRadius: '6px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
            <AlertCircle size={18} strokeWidth={1.5} style={{ color: '#1e40af', marginTop: '2px', flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: '14px', color: '#1e40af', lineHeight: '1.6' }}>
              <strong style={{ fontWeight: '600' }}>Importante:</strong> Tu solicitud de cita será revisada y confirmada por la clínica. 
              Recibirás una notificación cuando sea aprobada.
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '32px'
        }}>
          <form onSubmit={handleSubmit}>
            {/* PASO 1: Tipo de Cita */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>
                Tipo de Cita
              </h3>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setTipoCita('GENERAL');
                    setPlanSeleccionado(null);
                    setItemPlanSeleccionado(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '16px',
                    border: tipoCita === 'GENERAL' ? '2px solid #0d9488' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: tipoCita === 'GENERAL' ? '#f0fdfa' : 'white',
                    cursor: 'pointer',
                    transition: 'all 150ms'
                  }}
                >
                  <Building size={32} strokeWidth={1.5} style={{ color: tipoCita === 'GENERAL' ? '#0d9488' : '#64748b', marginBottom: '8px' }} />
                  <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '4px', fontSize: '15px' }}>Cita General</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>Consulta, control o emergencia</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setTipoCita('PLAN')}
                  style={{
                    flex: 1,
                    padding: '16px',
                    border: tipoCita === 'PLAN' ? '2px solid #0d9488' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: tipoCita === 'PLAN' ? '#f0fdfa' : 'white',
                    cursor: 'pointer',
                    transition: 'all 150ms'
                  }}
                >
                  <Clipboard size={32} strokeWidth={1.5} style={{ color: tipoCita === 'PLAN' ? '#0d9488' : '#64748b', marginBottom: '8px' }} />
                  <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '4px', fontSize: '15px' }}>Cita de Plan</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>Vinculada a tratamiento activo</div>
                </button>
              </div>
            </div>

            {/* Tipo de motivo (solo si es GENERAL) */}
            {tipoCita === 'GENERAL' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: '500', color: '#0f172a', fontSize: '14px' }}>
                  <FileText size={16} strokeWidth={1.5} style={{ color: '#64748b' }} />
                  Tipo de Consulta <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={motivoTipo}
                  onChange={(e) => setMotivoTipo(e.target.value as MotivoTipo)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#0f172a',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    backgroundColor: 'white'
                  }}
                  required
                >
                  {MOTIVOS_CITA.filter(m => m.value !== 'PLAN').map(motivo => (
                    <option key={motivo.value} value={motivo.value}>
                      {motivo.label} - {motivo.precio} - {motivo.descripcion}
                    </option>
                  ))}
                </select>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                  <DollarSign size={14} strokeWidth={1.5} style={{ color: '#64748b' }} />
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                    El precio es referencial y puede variar según el diagnóstico
                  </p>
                </div>
              </div>
            )}

            {/* Selector de Plan y Item (solo si es PLAN) */}
            {tipoCita === 'PLAN' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: '500', color: '#0f172a', fontSize: '14px' }}>
                    <Clipboard size={16} strokeWidth={1.5} style={{ color: '#64748b' }} />
                    Seleccionar Plan <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  {cargandoPlanes ? (
                    <div style={{ padding: '12px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#64748b' }}>
                      <Activity size={18} strokeWidth={1.5} className="animate-spin" />
                      Cargando planes...
                    </div>
                  ) : planesActivos.length === 0 ? (
                    <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderLeft: '3px solid #f59e0b', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={18} strokeWidth={1.5} style={{ color: '#92400e' }} />
                      <span style={{ color: '#92400e', fontSize: '14px' }}>No tienes planes de tratamiento activos</span>
                    </div>
                  ) : (
                    <select
                      value={planSeleccionado || ''}
                      onChange={(e) => {
                        setPlanSeleccionado(parseInt(e.target.value));
                        setItemPlanSeleccionado(null);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: '#0f172a',
                        boxSizing: 'border-box',
                        cursor: 'pointer',
                        backgroundColor: 'white'
                      }}
                      required
                    >
                      <option value="">Selecciona un plan...</option>
                      {planesActivos.map(plan => (
                        <option key={plan.id} value={plan.id}>
                          {plan.nombre || plan.titulo} - {plan.odontologo_nombre}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Selector de Item del Plan */}
                {planSeleccionado && itemsDisponibles.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: '500', color: '#0f172a', fontSize: '14px' }}>
                      <Activity size={16} strokeWidth={1.5} style={{ color: '#64748b' }} />
                      Tratamiento a Realizar <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <select
                      value={itemPlanSeleccionado || ''}
                      onChange={(e) => {
                        const itemId = parseInt(e.target.value);
                        setItemPlanSeleccionado(itemId);
                        const item = itemsDisponibles.find(i => i.id === itemId);
                        if (item) {
                          setMotivo(item.servicio_nombre);
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: '#0f172a',
                        boxSizing: 'border-box',
                        cursor: 'pointer',
                        backgroundColor: 'white'
                      }}
                      required
                    >
                      <option value="">Selecciona un tratamiento...</option>
                      {itemsDisponibles.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.servicio_nombre} - {item.precio_total}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            {/* PASO 2: Odontólogo */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: '500', color: '#0f172a', fontSize: '14px' }}>
                <User size={16} strokeWidth={1.5} style={{ color: '#64748b' }} />
                Odontólogo <span style={{ color: '#dc2626' }}>*</span>
              </label>
              {cargandoOdontologos ? (
                <div style={{ padding: '12px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#64748b' }}>
                  <Activity size={18} strokeWidth={1.5} className="animate-spin" />
                  Cargando odontólogos...
                </div>
              ) : (
                <select
                  value={odontologoId}
                  onChange={(e) => setOdontologoId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#0f172a',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    backgroundColor: 'white'
                  }}
                  required
                >
                  <option value="">Selecciona un odontólogo...</option>
                  {odontologos.map((odontologo) => (
                    <option key={odontologo.id} value={odontologo.id}>
                      Dr(a). {odontologo.nombre}
                      {odontologo.especialidad && ` - ${odontologo.especialidad}`}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* PASO 3: Fecha */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: '500', color: '#0f172a', fontSize: '14px' }}>
                <Calendar size={16} strokeWidth={1.5} style={{ color: '#64748b' }} />
                Fecha <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
                min={fechaMinimaStr}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#0f172a',
                  boxSizing: 'border-box',
                  backgroundColor: 'white'
                }}
              />
              <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                Selecciona una fecha a partir de mañana
              </p>
            </div>

            {/* PASO 4: Horarios Disponibles */}
            {fecha && odontologoId && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: '500', color: '#0f172a', fontSize: '14px' }}>
                  <Clock size={16} strokeWidth={1.5} style={{ color: '#64748b' }} />
                  Horario <span style={{ color: '#dc2626' }}>*</span>
                </label>
                
                {cargandoHorarios ? (
                  <div style={{ padding: '24px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#f8fafc', borderRadius: '6px', color: '#64748b' }}>
                    <Activity size={18} strokeWidth={1.5} className="animate-spin" />
                    Cargando horarios disponibles...
                  </div>
                ) : horarios.length === 0 ? (
                  <div style={{ padding: '16px', backgroundColor: '#fee2e2', borderLeft: '3px solid #dc2626', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={18} strokeWidth={1.5} style={{ color: '#991b1b' }} />
                    <span style={{ color: '#991b1b', fontSize: '14px' }}>No hay horarios disponibles para esta fecha</span>
                  </div>
                ) : (
                  <>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(4, 1fr)', 
                      gap: '8px',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0'
                    }}>
                      {horarios.map((horario) => (
                        <button
                          key={horario.hora}
                          type="button"
                          disabled={!horario.disponible}
                          onClick={() => setHoraSeleccionada(horario.hora)}
                          style={{
                            padding: '10px 8px',
                            border: horaSeleccionada === horario.hora ? '2px solid #0d9488' : '1px solid #cbd5e1',
                            borderRadius: '6px',
                            backgroundColor: !horario.disponible ? '#f1f5f9' : (horaSeleccionada === horario.hora ? '#f0fdfa' : 'white'),
                            color: !horario.disponible ? '#94a3b8' : (horaSeleccionada === horario.hora ? '#0d9488' : '#0f172a'),
                            cursor: horario.disponible ? 'pointer' : 'not-allowed',
                            fontSize: '13px',
                            fontWeight: horaSeleccionada === horario.hora ? '600' : '500',
                            textDecoration: !horario.disponible ? 'line-through' : 'none',
                            transition: 'all 150ms'
                          }}
                        >
                          {horario.hora}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                      <CheckCircle size={14} strokeWidth={1.5} style={{ color: '#10b981' }} />
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                        {horarios.filter(h => h.disponible).length} horarios disponibles
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Motivo */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: '500', color: '#0f172a', fontSize: '14px' }}>
                <FileText size={16} strokeWidth={1.5} style={{ color: '#64748b' }} />
                Motivo de la Consulta <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                required
                placeholder={tipoCita === 'PLAN' ? 'Se completará automáticamente al seleccionar tratamiento' : 'Describe brevemente el motivo de tu consulta...'}
                rows={3}
                maxLength={500}
                disabled={tipoCita === 'PLAN' && itemPlanSeleccionado !== null}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#0f172a',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
              <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#64748b', textAlign: 'right' }}>
                {motivo.length}/500 caracteres
              </p>
            </div>

            {/* Observaciones */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: '500', color: '#0f172a', fontSize: '14px' }}>
                <FileText size={16} strokeWidth={1.5} style={{ color: '#64748b' }} />
                Observaciones (Opcional)
              </label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Información adicional que consideres importante..."
                rows={2}
                maxLength={300}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#0f172a',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  backgroundColor: 'white'
                }}
              />
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={cargando || cargandoOdontologos || cargandoHorarios}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: (cargando || cargandoOdontologos || cargandoHorarios) ? '#cbd5e1' : '#0d9488',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: (cargando || cargandoOdontologos || cargandoHorarios) ? 'not-allowed' : 'pointer',
                transition: 'background-color 150ms',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!cargando && !cargandoOdontologos && !cargandoHorarios) {
                  e.currentTarget.style.backgroundColor = '#0f766e';
                }
              }}
              onMouseLeave={(e) => {
                if (!cargando && !cargandoOdontologos && !cargandoHorarios) {
                  e.currentTarget.style.backgroundColor = '#0d9488';
                }
              }}
            >
              {cargando ? (
                <>
                  <Activity size={18} strokeWidth={1.5} className="animate-spin" />
                  Agendando...
                </>
              ) : (
                <>
                  <CheckCircle size={18} strokeWidth={1.5} />
                  Agendar Cita
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SolicitarCita;

