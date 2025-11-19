/**
 * 🩺 MODAL REGISTRAR EPISODIO MEJORADO
 * Con acceso a Historial y Odontogramas mientras se atiende
 */

import { useState, useEffect } from 'react';
import { crearEpisodio, obtenerHistorialCompleto, type CrearEpisodioDTO, type EpisodioAtencion } from '../../services/historialService';
import { obtenerServicios, type Servicio } from '../../services/serviciosService';
import { getOdontogramas, createOdontograma, updateOdontograma } from '../../services/odontogramaService';
import type { Odontograma as OdontogramaType } from '../../types/odontograma.types';
import type { PiezaFDI, EstadoPiezaDental } from '../../types/odontograma.types';
import { Odontograma, ModalEditarPieza } from '../odontograma';
import GestionDocumentos from './GestionDocumentos';

interface ModalRegistrarEpisodioMejoradoProps {
  abierto: boolean;
  onCerrar: () => void;
  pacienteId: number;
  pacienteNombre: string;
  historialId: number;
  onEpisodioCreado: () => void;
  citaId?: number;
  // 🆕 Guía 20: Props para citas vinculadas a planes
  esCitaPlan?: boolean;
  servicioId?: number | null;
  itemPlanId?: number | null;
  itemPlanInfo?: {
    id: number;
    servicio_id: number;
    servicio_nombre: string;
    servicio_descripcion: string;
    plan_id: number;
    plan_nombre: string;
    estado: string;
    notas: string;
  } | null;
}

export default function ModalRegistrarEpisodioMejorado({
  abierto,
  onCerrar,
  pacienteId,
  pacienteNombre,
  historialId,
  onEpisodioCreado,
  citaId,
  // 🆕 Guía 20: Nuevos props
  esCitaPlan = false,
  servicioId: servicioIdInicial = null,
  itemPlanId = null,
  itemPlanInfo = null
}: ModalRegistrarEpisodioMejoradoProps) {
  console.group('🏥 [ModalEpisodioMejorado] RENDER');
  console.log('📋 Props recibidas:');
  console.log('  - abierto:', abierto);
  console.log('  - pacienteId:', pacienteId);
  console.log('  - pacienteNombre:', pacienteNombre);
  console.log('  - historialId:', historialId, '⚠️ CRÍTICO: debe ser > 0');
  console.log('  - citaId:', citaId);
  // 🆕 Guía 20: Logs para citas de plan
  console.log('  - esCitaPlan:', esCitaPlan);
  console.log('  - servicioId:', servicioIdInicial);
  console.log('  - itemPlanId:', itemPlanId);
  console.log('  - itemPlanInfo:', itemPlanInfo);
  console.log('⚠️ Si historialId = 0, habrá error 404 al cargar odontogramas');
  console.groupEnd();

  // Estados de navegación
  const [tabActiva, setTabActiva] = useState<'episodio' | 'historial' | 'odontogramas' | 'documentos'>('episodio');
  
  // Estados del formulario de episodio
  const [motivoConsulta, setMotivoConsulta] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [descripcionProcedimiento, setDescripcionProcedimiento] = useState('');
  const [notasPrivadas, setNotasPrivadas] = useState('');
  const [servicioSeleccionado, setServicioSeleccionado] = useState<number | null>(servicioIdInicial);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  
  // Estados de historial
  const [episodios, setEpisodios] = useState<EpisodioAtencion[]>([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  
  // Estados de odontogramas
  const [odontogramas, setOdontogramas] = useState<OdontogramaType[]>([]);
  const [odontogramaActual, setOdontogramaActual] = useState<OdontogramaType | null>(null);
  const [odontogramaModificado, setOdontogramaModificado] = useState(false);
  const [cargandoOdontogramas, setCargandoOdontogramas] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false); // Nuevo: controla si está editando
  
  // Modal de edición de pieza
  const [modalPiezaAbierto, setModalPiezaAbierto] = useState(false);
  const [piezaSeleccionada, setPiezaSeleccionada] = useState<PiezaFDI | null>(null);
  
  // Estados generales
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar servicios al montar
  useEffect(() => {
    console.group('🔄 [Modal] useEffect - Modal abierto/cerrado');
    console.log('📋 abierto:', abierto);
    console.log('📋 historialId:', historialId);
    
    if (abierto) {
      console.log('✅ Modal ABIERTO - Cargando datos iniciales...');
      console.log('🔄 Llamando a cargarServicios()');
      cargarServicios();
      console.log('🔄 Llamando a cargarEpisodios()');
      cargarEpisodios();
      console.log('🔄 Llamando a cargarOdontogramas() con historialId:', historialId);
      cargarOdontogramas();
    } else {
      console.log('ℹ️ Modal CERRADO - No se cargan datos');
    }
    console.groupEnd();
  }, [abierto]);

  // 🆕 Guía 20: Pre-llenar campos cuando es cita de plan
  useEffect(() => {
    if (abierto && esCitaPlan && servicioIdInicial && itemPlanId) {
      console.log('✅ Cita vinculada a plan detectada');
      console.log('📋 Plan:', itemPlanInfo?.plan_nombre);
      console.log('🦷 Servicio:', itemPlanInfo?.servicio_nombre);
      
      setServicioSeleccionado(servicioIdInicial);
      
      // Pre-llenar descripción con notas del plan si existen
      if (itemPlanInfo?.notas) {
        setDescripcionProcedimiento(itemPlanInfo.notas);
      }
    }
  }, [abierto, esCitaPlan, servicioIdInicial, itemPlanId, itemPlanInfo]);

  const cargarServicios = async () => {
    try {
      const data = await obtenerServicios();
      setServicios(data);
    } catch (err) {
      console.error('Error cargando servicios:', err);
    }
  };

  const cargarEpisodios = async () => {
    console.group('📋 [Modal] cargarEpisodios()');
    console.log('📋 pacienteId:', pacienteId);
    console.log('📋 historialId:', historialId);
    
    setCargandoHistorial(true);
    try {
      console.log('📡 Obteniendo historial completo del paciente...');
      const historial = await obtenerHistorialCompleto(pacienteId);
      
      console.log('✅ Historial obtenido');
      console.log('📊 Total de episodios:', historial.total_episodios);
      console.log('📋 Episodios:', historial.episodios);
      
      setEpisodios(historial.episodios || []);
      
      console.log('✅ Episodios cargados en estado:', historial.episodios?.length || 0);
    } catch (err: any) {
      console.error('❌ Error cargando episodios:', err);
      console.error('📊 Detalles:', {
        mensaje: err.message,
        response: err.response?.data
      });
      setEpisodios([]);
    } finally {
      setCargandoHistorial(false);
      console.groupEnd();
    }
  };

  const cargarOdontogramas = async () => {
    console.group('🦷 [Modal] cargarOdontogramas()');
    console.log('📋 historialId recibido:', historialId);
    console.log('⚠️ Si historialId = 0, esto generará 404');
    console.log('🔄 Iniciando carga...');
    
    setCargandoOdontogramas(true);
    try {
      console.log('📡 Llamando a getOdontogramas(' + historialId + ')');
      const datos = await getOdontogramas(historialId);
      console.log('✅ getOdontogramas completado');
      console.log('📊 Cantidad de odontogramas:', datos.length);
      console.log('📋 Datos:', datos);
      
      setOdontogramas(datos);
      
      // NO seleccionar automáticamente - dejar en modo vista
      // El usuario debe hacer clic en "Nuevo" para editar
      if (datos.length > 0) {
        console.log('📋 Odontogramas cargados:', datos.length);
        console.log('💡 El usuario debe hacer clic en "Nuevo" o seleccionar uno histórico');
        setOdontogramaActual(null); // Empezar sin selección
      } else {
        console.log('ℹ️ No hay odontogramas previos');
        setOdontogramaActual(null);
      }
      
      console.log('✅ Odontogramas cargados correctamente:', datos.length);
    } catch (err: any) {
      console.error('❌ ERROR cargando odontogramas:', err);
      console.error('📊 Detalles del error:', {
        mensaje: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config?.url
      });
    } finally {
      setCargandoOdontogramas(false);
      console.groupEnd();
    }
  };

  // Handlers de odontograma
  const handleCrearOdontograma = () => {
    console.group('➕ [Modal] handleCrearOdontograma()');
    console.log('📋 historialId:', historialId);
    console.log('📋 Odontogramas disponibles:', odontogramas.length);
    
    // Copiar estado del odontograma más reciente si existe
    let estadoPiezasInicial = {};
    if (odontogramas.length > 0) {
      // Ordenar por ID descendente para obtener el más reciente (ID más alto)
      const odontogramasOrdenados = [...odontogramas].sort((a, b) => (b.id || 0) - (a.id || 0));
      const masReciente = odontogramasOrdenados[0];
      estadoPiezasInicial = { ...masReciente.estado_piezas };
      console.log('📋 Copiando estado del odontograma más reciente:', masReciente.id);
      console.log('📊 Estado copiado:', estadoPiezasInicial);
      console.log('🔍 Todos los IDs disponibles:', odontogramas.map(o => o.id));
    } else {
      console.log('ℹ️ No hay odontogramas previos, empezando vacío');
    }
    
    const nuevoOdontograma: OdontogramaType = {
      historial_clinico: historialId,
      fecha: new Date().toISOString().split('T')[0],
      tipo_denticion: 'ADULTO',
      estado_piezas: estadoPiezasInicial, // Copiar estado anterior
      notas_generales: `Odontograma - Atención del ${new Date().toLocaleDateString()}`
    };

    console.log('✅ Nuevo odontograma creado con estado copiado:', nuevoOdontograma);
    setOdontogramaActual(nuevoOdontograma);
    setOdontogramaModificado(true);
    setModoEdicion(true); // Activar modo edición
    console.log('✅ Estado actualizado - Odontograma listo para edición');
    console.groupEnd();
  };

  const handleCancelarEdicion = () => {
    console.log('❌ Cancelando edición de odontograma');
    if (odontogramas.length > 0) {
      // Volver al más reciente
      setOdontogramaActual(odontogramas[odontogramas.length - 1]);
    } else {
      setOdontogramaActual(null);
    }
    setOdontogramaModificado(false);
    setModoEdicion(false);
  };

  const handlePiezaClick = (pieza: PiezaFDI) => {
    console.log('👆 [Modal] Click en pieza:', pieza.numero, pieza.nombre);
    console.log('📋 odontogramaActual existe:', !!odontogramaActual);
    console.log('📋 modoEdicion:', modoEdicion);
    
    if (!odontogramaActual) {
      console.error('❌ No hay odontograma actual - crear uno primero');
      alert('⚠️ Debes crear un odontograma primero');
      return;
    }
    
    // Solo permitir edición si está en modo edición
    if (!modoEdicion) {
      console.warn('⚠️ No se puede editar - modo solo lectura');
      console.log('💡 Haz clic en "Nuevo Odontograma" para editar');
      return; // No abrir modal si no está en modo edición
    }
    
    setPiezaSeleccionada(pieza);
    setModalPiezaAbierto(true);
    console.log('✅ Modal de pieza abierto para:', pieza.numero);
  };

  const handleGuardarPieza = (estado: EstadoPiezaDental) => {
    console.group('💾 [Modal] handleGuardarPieza()');
    console.log('📋 Pieza seleccionada:', piezaSeleccionada);
    console.log('📋 Estado a guardar:', estado);
    console.log('📋 odontogramaActual existe:', !!odontogramaActual);
    
    if (!piezaSeleccionada || !odontogramaActual) {
      console.error('❌ Faltan datos para guardar');
      console.groupEnd();
      return;
    }

    console.log('🔄 Actualizando estado del odontograma...');
    setOdontogramaActual(prev => {
      if (!prev) {
        console.error('❌ prev es null');
        return prev;
      }
      
      const nuevoEstado = {
        ...prev,
        estado_piezas: {
          ...prev.estado_piezas,
          [piezaSeleccionada.numero]: estado
        }
      };
      
      console.log('✅ Nuevo estado del odontograma:', nuevoEstado);
      return nuevoEstado;
    });

    setOdontogramaModificado(true);
    setModalPiezaAbierto(false);
    setPiezaSeleccionada(null);
    console.log('✅ Pieza guardada exitosamente');
    console.groupEnd();
  };

  const handleGuardarOdontograma = async () => {
    if (!odontogramaActual || !odontogramaModificado) return;

    try {
      if (odontogramaActual.id) {
        await updateOdontograma(historialId, odontogramaActual.id, odontogramaActual);
        console.log('✅ Odontograma actualizado');
      } else {
        const nuevo = await createOdontograma(historialId, odontogramaActual);
        setOdontogramaActual(nuevo);
        console.log('✅ Odontograma creado');
      }
      
      setOdontogramaModificado(false);
      await cargarOdontogramas();
      setModoEdicion(false); // Salir del modo edición
      alert('✅ Odontograma guardado');
    } catch (err) {
      console.error('Error guardando odontograma:', err);
      alert('❌ Error al guardar odontograma');
    }
  };

  // Handler de envío
  const handleSubmit = async () => {
    if (!motivoConsulta.trim()) {
      alert('⚠️ El motivo de consulta es obligatorio');
      return;
    }

    if (!confirm('¿Registrar este episodio de atención?')) return;

    setGuardando(true);
    setError(null);

    try {
      const datos: CrearEpisodioDTO = {
        historial_clinico: historialId,
        motivo_consulta: motivoConsulta,
        diagnostico: diagnostico || undefined,
        descripcion_procedimiento: descripcionProcedimiento || undefined,
        notas_privadas: notasPrivadas || undefined,
        servicio: servicioSeleccionado || undefined,
        // 🆕 Guía 20: Vincular con item de plan si corresponde
        item_plan_tratamiento: itemPlanId || undefined,
      };

      await crearEpisodio(datos);
      
      // Guardar odontograma si fue modificado
      if (odontogramaModificado && odontogramaActual) {
        await handleGuardarOdontograma();
      }

      alert('✅ Episodio registrado exitosamente');
      onEpisodioCreado();
      handleCerrar();
    } catch (err: any) {
      console.error('Error registrando episodio:', err);
      setError(err.response?.data?.message || err.message);
      alert('❌ Error al registrar episodio');
    } finally {
      setGuardando(false);
    }
  };

  const handleCerrar = () => {
    if (odontogramaModificado) {
      if (!confirm('Hay cambios sin guardar en el odontograma. ¿Cerrar de todos modos?')) {
        return;
      }
    }
    
    setTabActiva('episodio');
    setMotivoConsulta('');
    setDiagnostico('');
    setDescripcionProcedimiento('');
    setNotasPrivadas('');
    setServicioSeleccionado(null);
    setOdontogramaActual(null);
    setOdontogramaModificado(false);
    onCerrar();
  };

  if (!abierto) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}
        onClick={handleCerrar}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '95%',
            maxWidth: '1400px',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            padding: '24px',
            borderBottom: '2px solid #e0e0e0',
            backgroundColor: '#f8f9fa'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#333' }}>
                  🩺 Registrar Episodio de Atención
                </h2>
                <p style={{ margin: '8px 0 0 0', fontSize: '16px', color: '#666' }}>
                  Paciente: <strong>{pacienteNombre}</strong>
                </p>
              </div>
              <button
                onClick={handleCerrar}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                ✕ Cerrar
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setTabActiva('episodio')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: tabActiva === 'episodio' ? '#1976d2' : 'white',
                  color: tabActiva === 'episodio' ? 'white' : '#666',
                  border: '2px solid #1976d2',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                🩺 Episodio
              </button>
              <button
                onClick={() => setTabActiva('historial')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: tabActiva === 'historial' ? '#1976d2' : 'white',
                  color: tabActiva === 'historial' ? 'white' : '#666',
                  border: '2px solid #1976d2',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                📝 Historial ({episodios.length})
              </button>
              <button
                onClick={() => setTabActiva('odontogramas')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: tabActiva === 'odontogramas' ? '#1976d2' : 'white',
                  color: tabActiva === 'odontogramas' ? 'white' : '#666',
                  border: '2px solid #1976d2',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  position: 'relative'
                }}
              >
                🦷 Odontogramas ({odontogramas.length})
                {odontogramaModificado && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#ff9800',
                    borderRadius: '50%',
                    fontSize: '12px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    •
                  </span>
                )}
              </button>
              <button
                onClick={() => setTabActiva('documentos')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: tabActiva === 'documentos' ? '#2196F3' : 'white',
                  color: tabActiva === 'documentos' ? 'white' : '#333',
                  border: `2px solid ${tabActiva === 'documentos' ? '#2196F3' : '#ddd'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
              >
                📎 Documentos
              </button>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
            {/* TAB: EPISODIO */}
            {tabActiva === 'episodio' && (
              <div>
                <h3 style={{ marginTop: 0, color: '#333' }}>Datos del Episodio</h3>

                {/* Motivo de Consulta */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                    Motivo de Consulta *
                  </label>
                  <input
                    type="text"
                    value={motivoConsulta}
                    onChange={(e) => setMotivoConsulta(e.target.value)}
                    placeholder="Ej: Dolor en muela inferior derecha"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* Diagnóstico */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                    Diagnóstico
                  </label>
                  <textarea
                    value={diagnostico}
                    onChange={(e) => setDiagnostico(e.target.value)}
                    placeholder="Ej: Caries profunda pieza 16. Pulpitis irreversible."
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Descripción del Procedimiento */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                    Descripción del Procedimiento
                  </label>
                  <textarea
                    value={descripcionProcedimiento}
                    onChange={(e) => setDescripcionProcedimiento(e.target.value)}
                    placeholder="Ej: Se realizó limpieza de la cavidad, aplicación de óxido de zinc, adhesivo y obturación con resina compuesta..."
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Servicio */}
                <div style={{ marginBottom: '20px' }}>
                  {esCitaPlan && itemPlanInfo ? (
                    // ============================================================
                    // MODO 1: CITA VINCULADA A PLAN (Solo Lectura)
                    // ============================================================
                    <div style={{
                      backgroundColor: '#d1fae5',
                      border: '2px solid #10b981',
                      borderRadius: '8px',
                      padding: '16px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginBottom: '12px'
                      }}>
                        <span style={{ fontSize: '20px' }}>✅</span>
                        <strong style={{ color: '#065f46' }}>
                          Cita Vinculada a Plan de Tratamiento
                        </strong>
                      </div>

                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '12px',
                        marginTop: '12px'
                      }}>
                        {/* Plan */}
                        <div>
                          <label style={{ 
                            fontSize: '12px', 
                            color: '#065f46',
                            fontWeight: '600',
                            display: 'block',
                            marginBottom: '4px'
                          }}>
                            📋 Plan de Tratamiento
                          </label>
                          <div style={{
                            backgroundColor: 'white',
                            padding: '10px 12px',
                            borderRadius: '6px',
                            border: '1px solid #10b981',
                            fontSize: '14px',
                            color: '#111827'
                          }}>
                            {itemPlanInfo.plan_nombre}
                          </div>
                        </div>

                        {/* Servicio */}
                        <div>
                          <label style={{ 
                            fontSize: '12px', 
                            color: '#065f46',
                            fontWeight: '600',
                            display: 'block',
                            marginBottom: '4px'
                          }}>
                            🦷 Tratamiento
                          </label>
                          <div style={{
                            backgroundColor: 'white',
                            padding: '10px 12px',
                            borderRadius: '6px',
                            border: '1px solid #10b981',
                            fontSize: '14px',
                            color: '#111827'
                          }}>
                            {itemPlanInfo.servicio_nombre}
                          </div>
                        </div>
                      </div>

                      {/* Notas del Plan */}
                      {itemPlanInfo.notas && (
                        <div style={{ marginTop: '12px' }}>
                          <label style={{ 
                            fontSize: '12px', 
                            color: '#065f46',
                            fontWeight: '600',
                            display: 'block',
                            marginBottom: '4px'
                          }}>
                            📝 Notas del Plan
                          </label>
                          <div style={{
                            backgroundColor: 'white',
                            padding: '10px 12px',
                            borderRadius: '6px',
                            border: '1px solid #10b981',
                            fontSize: '13px',
                            color: '#6b7280',
                            fontStyle: 'italic'
                          }}>
                            {itemPlanInfo.notas}
                          </div>
                        </div>
                      )}

                      <p style={{ 
                        fontSize: '12px', 
                        color: '#065f46',
                        marginTop: '12px',
                        marginBottom: 0 
                      }}>
                        ℹ️ El tratamiento y plan ya están vinculados. No es necesario seleccionarlos.
                      </p>
                    </div>
                  ) : (
                    // ============================================================
                    // MODO 2: CITA NORMAL (Campo Editable)
                    // ============================================================
                    <>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                        Servicio Realizado
                      </label>
                      <select
                        value={servicioSeleccionado || ''}
                        onChange={(e) => setServicioSeleccionado(e.target.value ? Number(e.target.value) : null)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="">Seleccionar servicio...</option>
                        {servicios.map(servicio => (
                          <option key={servicio.id} value={servicio.id}>
                            {servicio.nombre}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>

                {/* Notas Privadas */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                    Notas Privadas (solo para equipo médico)
                  </label>
                  <textarea
                    value={notasPrivadas}
                    onChange={(e) => setNotasPrivadas(e.target.value)}
                    placeholder="Notas internas, recordatorios, observaciones..."
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {error && (
                  <div style={{
                    backgroundColor: '#ffebee',
                    padding: '12px',
                    borderRadius: '8px',
                    borderLeft: '4px solid #f44336',
                    marginBottom: '20px',
                    color: '#c62828'
                  }}>
                    ❌ {error}
                  </div>
                )}
              </div>
            )}

            {/* TAB: HISTORIAL */}
            {tabActiva === 'historial' && (
              <div>
                <h3 style={{ marginTop: 0, color: '#333' }}>Episodios Anteriores</h3>

                {cargandoHistorial ? (
                  <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    ⏳ Cargando historial...
                  </p>
                ) : episodios.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '12px',
                    border: '2px dashed #bdbdbd'
                  }}>
                    <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>📭</p>
                    <p style={{ fontSize: '18px', color: '#666', margin: 0 }}>
                      No hay episodios registrados
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {episodios.map((episodio, idx) => (
                      <div
                        key={episodio.id || idx}
                        style={{
                          backgroundColor: 'white',
                          border: '2px solid #e0e0e0',
                          borderRadius: '12px',
                          padding: '16px'
                        }}
                      >
                        <div style={{ marginBottom: '8px' }}>
                          <strong style={{ color: '#1976d2', fontSize: '16px' }}>
                            {episodio.motivo_consulta}
                          </strong>
                        </div>
                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                          📅 {new Date(episodio.fecha_atencion).toLocaleString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })} • 👨‍⚕️ {episodio.odontologo_nombre || 'No especificado'}
                        </div>
                        {episodio.diagnostico && (
                          <div style={{ 
                            backgroundColor: '#fff3e0', 
                            padding: '8px 12px', 
                            borderRadius: '6px',
                            marginTop: '8px',
                            fontSize: '14px'
                          }}>
                            <strong>Diagnóstico:</strong> {episodio.diagnostico}
                          </div>
                        )}
                        {episodio.descripcion_procedimiento && (
                          <div style={{ 
                            backgroundColor: '#e3f2fd', 
                            padding: '8px 12px', 
                            borderRadius: '6px',
                            marginTop: '8px',
                            fontSize: '14px'
                          }}>
                            <strong>Procedimiento:</strong> {episodio.descripcion_procedimiento}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: ODONTOGRAMAS */}
            {tabActiva === 'odontogramas' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, color: '#333' }}>
                    Odontogramas {modoEdicion && <span style={{ color: '#ff9800' }}>• (editando)</span>}
                  </h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {modoEdicion ? (
                      // Modo edición: mostrar Guardar y Cancelar
                      <>
                        <button
                          onClick={handleGuardarOdontograma}
                          disabled={!odontogramaModificado}
                          style={{
                            padding: '10px 20px',
                            backgroundColor: odontogramaModificado ? '#4caf50' : '#ccc',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: odontogramaModificado ? 'pointer' : 'not-allowed',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}
                        >
                          💾 Guardar Odontograma
                        </button>
                        <button
                          onClick={handleCancelarEdicion}
                          style={{
                            padding: '10px 20px',
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}
                        >
                          ✕ Cancelar
                        </button>
                      </>
                    ) : (
                      // Modo solo lectura: mostrar Nuevo
                      <button
                        onClick={handleCrearOdontograma}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#1976d2',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}
                      >
                        + Nuevo Odontograma
                      </button>
                    )}
                  </div>
                </div>

                {cargandoOdontogramas ? (
                  <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    ⏳ Cargando odontogramas...
                  </p>
                ) : !odontogramaActual ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '12px',
                    border: '2px dashed #bdbdbd'
                  }}>
                    <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>🦷</p>
                    <p style={{ fontSize: '18px', color: '#666', margin: '0 0 8px 0' }}>
                      {odontogramas.length === 0 
                        ? 'No hay odontogramas registrados' 
                        : 'Selecciona un odontograma para visualizar'}
                    </p>
                    <p style={{ fontSize: '14px', color: '#999' }}>
                      {odontogramas.length === 0
                        ? 'Haz clic en "Nuevo Odontograma" para crear el primero'
                        : 'Haz clic en "Nuevo" para editar o selecciona uno histórico abajo'}
                    </p>
                    {odontogramas.length > 0 && (
                      <div style={{ marginTop: '24px' }}>
                        <h4 style={{ color: '#333', marginBottom: '12px' }}>
                          Odontogramas Disponibles ({odontogramas.length})
                        </h4>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                          {odontogramas
                            .slice()
                            .reverse()
                            .map((odonto) => (
                              <button
                                key={odonto.id}
                                onClick={() => {
                                  console.log('📅 Cargando odontograma:', odonto.id);
                                  console.log('📊 Estado de piezas:', odonto.estado_piezas);
                                  setOdontogramaActual(odonto);
                                  setOdontogramaModificado(false);
                                  setModoEdicion(false);
                                }}
                                style={{
                                  padding: '12px 16px',
                                  backgroundColor: 'white',
                                  border: '2px solid #1976d2',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#e3f2fd';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'white';
                                }}
                              >
                                📅 {odonto.fecha}
                                <br />
                                <span style={{ fontSize: '12px', color: '#666' }}>
                                  {Object.keys(odonto.estado_piezas || {}).length} piezas
                                </span>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Indicador del odontograma actual */}
                    {odontogramaActual && (
                      <div style={{
                        backgroundColor: '#e3f2fd',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        border: '2px solid #1976d2'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong style={{ color: '#1976d2' }}>
                              {odontogramaActual.id ? '📋 Visualizando:' : '🆕 Nuevo Odontograma'}
                            </strong>
                            {odontogramaActual.id && (
                              <span style={{ marginLeft: '8px', color: '#666' }}>
                                {odontogramaActual.fecha}
                              </span>
                            )}
                          </div>
                          <span style={{ color: '#666', fontSize: '14px' }}>
                            {Object.keys(odontogramaActual.estado_piezas || {}).length} piezas registradas
                          </span>
                        </div>
                      </div>
                    )}

                    <div style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '2px solid #e0e0e0',
                      marginBottom: '20px'
                    }}>
                      <Odontograma
                        odontograma={odontogramaActual}
                        onPiezaClick={modoEdicion ? handlePiezaClick : undefined}
                        readonly={!modoEdicion}
                      />
                    </div>

                    {/* Lista de odontogramas anteriores */}
                    {odontogramas.length > 0 && (
                      <div>
                        <h4 style={{ color: '#333', marginBottom: '12px' }}>
                          {odontogramaActual?.id 
                            ? `Otros Odontogramas (${odontogramas.filter(o => o.id !== odontogramaActual.id).length})`
                            : `Odontogramas Registrados (${odontogramas.length})`
                          }
                        </h4>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          {odontogramas
                            .filter(o => o.id !== odontogramaActual?.id)
                            .reverse()
                            .map((odonto) => (
                              <button
                                key={odonto.id}
                                onClick={() => {
                                  console.log('📅 Cargando odontograma anterior:', odonto.id);
                                  console.log('📊 Estado de piezas:', odonto.estado_piezas);
                                  setOdontogramaActual(odonto);
                                  setOdontogramaModificado(false);
                                  setModoEdicion(false); // Salir del modo edición al ver histórico
                                }}
                                style={{
                                  padding: '12px 16px',
                                  backgroundColor: 'white',
                                  border: '2px solid #1976d2',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#e3f2fd';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'white';
                                }}
                              >
                                📅 {odonto.fecha}
                                <br />
                                <span style={{ fontSize: '12px', color: '#666' }}>
                                  {Object.keys(odonto.estado_piezas || {}).length} piezas
                                </span>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* TAB: DOCUMENTOS */}
            {tabActiva === 'documentos' && (
              <div>
                {(() => {
                  console.log('📎 [Modal] Renderizando tab Documentos');
                  console.log('  - historialId pasado a GestionDocumentos:', historialId);
                  console.log('  - episodioId pasado a GestionDocumentos:', undefined);
                  return null;
                })()}
                <GestionDocumentos 
                  historialId={historialId}
                  episodioId={undefined}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '20px 24px',
            borderTop: '2px solid #e0e0e0',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {odontogramaModificado && tabActiva === 'episodio' && (
                <span style={{ color: '#ff9800', fontWeight: 'bold' }}>
                  ⚠️ Hay cambios sin guardar en odontograma
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleCerrar}
                disabled={guardando}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'white',
                  color: '#666',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  cursor: guardando ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  opacity: guardando ? 0.5 : 1
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={guardando || !motivoConsulta.trim()}
                style={{
                  padding: '12px 24px',
                  backgroundColor: guardando || !motivoConsulta.trim() ? '#ccc' : '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: guardando || !motivoConsulta.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                {guardando ? '⏳ Guardando...' : '✅ Registrar Episodio'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición de pieza */}
      {odontogramaActual && (
        <ModalEditarPieza
          abierto={modalPiezaAbierto}
          pieza={piezaSeleccionada}
          estadoActual={piezaSeleccionada ? odontogramaActual.estado_piezas[piezaSeleccionada.numero] : undefined}
          onCerrar={() => {
            setModalPiezaAbierto(false);
            setPiezaSeleccionada(null);
          }}
          onGuardar={handleGuardarPieza}
        />
      )}
    </>
  );
}
