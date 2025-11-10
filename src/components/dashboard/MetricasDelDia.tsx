/**
 * 📊 MÉTRICAS DEL DÍA - Dashboard con métricas en tiempo real
 */

import React, { useState, useEffect, useCallback } from 'react';
import TarjetaMetrica from './TarjetaMetrica';
import ProximaCita from './ProximaCita';
import { obtenerMetricasDia } from '../../services/agendaService';
import type { MetricasDelDia } from '../../services/agendaService';

const MetricasDelDiaComponent: React.FC = () => {
  console.log('🎯 Inicializando componente MetricasDelDia');
  
  const [metricas, setMetricas] = useState<MetricasDelDia | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date>(new Date());
  
  console.log('📊 Estado inicial del componente:', {
    metricas: metricas ? 'Con datos' : 'null',
    cargando,
    error,
    ultimaActualizacion: ultimaActualizacion.toLocaleTimeString('es-ES')
  });

  const cargarMetricas = useCallback(async () => {
    const tiempoInicio = performance.now();
    
    try {
      console.group('📊 CARGANDO MÉTRICAS DEL DÍA');
      console.log('🔄 Iniciando petición al backend...');
      console.log('⏰ Timestamp:', new Date().toLocaleString('es-ES'));
      console.log('⏱️ Performance mark - inicio:', tiempoInicio.toFixed(2), 'ms');
      console.log('🔐 Verificando autenticación...');
      
      const tokenInfo = localStorage.getItem('token');
      console.log('🔑 Token presente:', !!tokenInfo);
      
      if (tokenInfo) {
        try {
          const tokenData = JSON.parse(atob(tokenInfo.split('.')[1]));
          console.log('👤 Usuario en token:', tokenData.username || tokenData.user_id);
          console.log('🏥 Rol:', tokenData.rol || 'No especificado');
        } catch (e) {
          console.warn('⚠️ No se pudo decodificar el token');
        }
      }
      
      console.log('📡 Llamando a obtenerMetricasDia()...');
      const data = await obtenerMetricasDia();
      const tiempoRespuesta = performance.now() - tiempoInicio;
      
      console.log('⚡ Tiempo de respuesta:', tiempoRespuesta.toFixed(2), 'ms');
      
      console.log('✅ Respuesta recibida del backend');
      console.log('📦 Tipo de respuesta:', typeof data);
      console.log('🔍 Estructura de datos:');
      console.table({
        'Fecha': data.fecha,
        'Total citas hoy': data.citas_hoy,
        'Citas pendientes': data.citas_pendientes,
        'Citas confirmadas': data.citas_confirmadas,
        'Citas atendidas': data.citas_atendidas,
        'Pacientes atendidos': data.pacientes_atendidos,
        'Tiene próxima cita': !!data.proxima_cita
      });
      
      if (data.proxima_cita) {
        console.group('🔔 PRÓXIMA CITA DETECTADA');
        console.log('  🆔 ID:', data.proxima_cita.id);
        console.log('  ⏰ Hora:', data.proxima_cita.hora);
        console.log('  👤 Paciente:', data.proxima_cita.paciente.full_name);
        console.log('  📝 Motivo:', data.proxima_cita.motivo);
        console.log('  🎯 Estado:', data.proxima_cita.estado);
        
        // Calcular tiempo hasta la próxima cita
        const ahora = new Date();
        const horaCita = new Date();
        const [horas, minutos] = data.proxima_cita.hora.split(':');
        horaCita.setHours(parseInt(horas), parseInt(minutos), 0);
        const diffMs = horaCita.getTime() - ahora.getTime();
        const diffMinutos = Math.round(diffMs / 60000);
        
        console.log('  ⏱️ Minutos hasta la cita:', diffMinutos);
        console.log('  🚦 Urgencia:', diffMinutos < 15 ? 'ALTA' : diffMinutos < 30 ? 'MEDIA' : 'NORMAL');
        console.groupEnd();
      } else {
        console.log('ℹ️ No hay próxima cita programada para hoy');
      }
      
      // Estadísticas de productividad
      const tasaCompletitud = data.citas_hoy > 0 
        ? ((data.citas_atendidas / data.citas_hoy) * 100).toFixed(1)
        : '0';
      
      console.log('📈 Métricas de productividad:');
      console.log(`  ✅ Tasa de completitud: ${tasaCompletitud}%`);
      console.log(`  ⏰ Citas restantes: ${data.citas_pendientes}`);
      console.log(`  👥 Promedio pacientes/cita atendida: ${data.citas_atendidas > 0 ? (data.pacientes_atendidos / data.citas_atendidas).toFixed(2) : '0'}`);
      
      console.log('🔄 Actualizando estado del componente...');
      const estadoAnterior = metricas;
      setMetricas(data);
      setError(null);
      const nuevaActualizacion = new Date();
      setUltimaActualizacion(nuevaActualizacion);
      
      console.log('✅ Estado actualizado correctamente');
      console.log('📊 Cambio de estado:', {
        antes: estadoAnterior ? 'Con datos' : 'null',
        despues: 'Con datos',
        hora: nuevaActualizacion.toLocaleTimeString('es-ES')
      });
      
      const tiempoTotal = performance.now() - tiempoInicio;
      console.log('⏱️ Tiempo total del proceso:', tiempoTotal.toFixed(2), 'ms');
      console.groupEnd();
      
    } catch (err: any) {
      console.group('❌ ERROR AL CARGAR MÉTRICAS');
      console.error('Tipo de error:', err.name);
      console.error('Mensaje:', err.message);
      
      if (err.response) {
        console.error('📡 RESPUESTA DEL SERVIDOR CON ERROR:');
        console.error('  🔢 Status Code:', err.response.status);
        console.error('  📄 Status Text:', err.response.statusText);
        console.error('  📦 Data:', JSON.stringify(err.response.data, null, 2));
        console.error('  📋 Headers:', err.response.headers);
        console.error('  🌐 URL:', err.response.config?.url);
        console.error('  🔧 Method:', err.response.config?.method?.toUpperCase());
        
        // Análisis detallado según el código de error
        if (err.response.status === 403) {
          console.group('⛔ ANÁLISIS ERROR 403 - PERMISOS DENEGADOS');
          console.warn('Causa: Usuario sin rol de odontólogo');
          console.warn('Solución: Verificar rol del usuario en el sistema');
          console.warn('Usuario debe tener rol: ODONTOLOGO');
          
          const token = localStorage.getItem('token');
          if (token) {
            try {
              const decoded = JSON.parse(atob(token.split('.')[1]));
              console.warn('Rol actual del usuario:', decoded.rol);
            } catch (e) {
              console.warn('No se pudo decodificar el token');
            }
          }
          console.groupEnd();
          setError('No tienes permisos para ver estas métricas');
          
        } else if (err.response.status === 401) {
          console.group('🔐 ANÁLISIS ERROR 401 - NO AUTORIZADO');
          console.warn('Causa: Token expirado o inválido');
          console.warn('Solución: Usuario debe iniciar sesión nuevamente');
          
          const token = localStorage.getItem('token');
          console.warn('Token presente en localStorage:', !!token);
          
          if (token) {
            try {
              const decoded = JSON.parse(atob(token.split('.')[1]));
              const exp = decoded.exp ? new Date(decoded.exp * 1000) : null;
              console.warn('Token expira en:', exp?.toLocaleString('es-ES') || 'No disponible');
              console.warn('Token expirado:', exp ? exp < new Date() : 'Desconocido');
            } catch (e) {
              console.warn('Token corrupto o inválido');
            }
          }
          console.groupEnd();
          setError('Sesión expirada. Por favor, inicia sesión nuevamente');
          
        } else if (err.response.status === 500) {
          console.group('💥 ERROR 500 - ERROR INTERNO DEL SERVIDOR');
          console.error('El backend encontró un error interno');
          console.error('Detalles del error:', err.response.data);
          console.groupEnd();
          setError('Error del servidor. Contacta al administrador.');
          
        } else if (err.response.status === 404) {
          console.group('🔍 ERROR 404 - ENDPOINT NO ENCONTRADO');
          console.error('URL solicitada:', err.response.config?.url);
          console.error('El endpoint no existe o la ruta es incorrecta');
          console.groupEnd();
          setError('Servicio no disponible. Contacta al administrador.');
          
        } else {
          console.error('❌ Error del servidor no categorizado:', err.response.status);
          setError('Error al cargar las métricas. Intenta nuevamente');
        }
        
      } else if (err.request) {
        console.group('📡 ERROR DE RED - SIN RESPUESTA DEL SERVIDOR');
        console.error('No se recibió respuesta del backend');
        console.error('Posibles causas:');
        console.error('  - Servidor caído o no disponible');
        console.error('  - Problemas de red/internet');
        console.error('  - CORS mal configurado');
        console.error('  - Timeout de la petición');
        console.error('Request enviado:', {
          method: err.request.method || 'GET',
          url: err.config?.url,
          baseURL: err.config?.baseURL
        });
        console.groupEnd();
        setError('Error de conexión. Verifica tu internet.');
        
      } else {
        console.group('⚠️ ERROR DE CONFIGURACIÓN DE LA PETICIÓN');
        console.error('Error antes de enviar la petición');
        console.error('Mensaje:', err.message);
        console.error('Stack:', err.stack);
        console.groupEnd();
        setError('Error al cargar las métricas. Intenta nuevamente');
      }
      
      console.groupEnd();
    } finally {
      const tiempoFinal = performance.now() - tiempoInicio;
      console.log('🏁 PROCESO DE CARGA FINALIZADO');
      console.log('⏱️ Duración total:', tiempoFinal.toFixed(2), 'ms');
      console.log('🔄 Cambiando estado cargando a false');
      setCargando(false);
      console.log('✅ Estado cargando actualizado');
    }
  }, [metricas]);

  // Cargar métricas al montar el componente
  useEffect(() => {
    console.group('🚀 COMPONENTE MONTADO - MetricasDelDia');
    console.log('📅 Fecha/Hora:', new Date().toLocaleString('es-ES'));
    console.log('🔄 Iniciando carga inicial de métricas...');
    console.groupEnd();
    
    cargarMetricas();
  }, [cargarMetricas]);

  // Auto-refresh cada 60 segundos
  useEffect(() => {
    console.log('⏰ Configurando auto-refresh cada 60 segundos');
    
    const intervalo = setInterval(() => {
      console.group('🔄 AUTO-REFRESH PROGRAMADO');
      console.log('⏰ Hora:', new Date().toLocaleTimeString('es-ES'));
      console.log('🔄 Recargando métricas automáticamente...');
      console.groupEnd();
      
      cargarMetricas();
    }, 60000); // 60 segundos

    return () => {
      console.log('🛑 Limpiando intervalo de auto-refresh');
      clearInterval(intervalo);
    };
  }, [cargarMetricas]);

  // Log detallado de cambios en las métricas
  useEffect(() => {
    if (metricas) {
      console.group('📈 ESTADO DE MÉTRICAS ACTUALIZADO EN COMPONENTE');
      console.log('⏰ Timestamp:', new Date().toLocaleString('es-ES'));
      console.log('🔢 Snapshot completo del estado:');
      
      // Resumen de métricas
      console.table({
        'Fecha': metricas.fecha,
        'Total Citas Hoy': metricas.citas_hoy,
        'Citas Pendientes': metricas.citas_pendientes,
        'Citas Confirmadas': metricas.citas_confirmadas,
        'Citas Atendidas': metricas.citas_atendidas,
        'Pacientes Atendidos': metricas.pacientes_atendidos,
        'Tiene Próxima Cita': !!metricas.proxima_cita ? 'SÍ' : 'NO'
      });
      
      // Progreso del día
      const progresoDelDia = metricas.citas_hoy > 0
        ? ((metricas.citas_atendidas / metricas.citas_hoy) * 100).toFixed(1)
        : '0';
      
      console.log('📊 Progreso del día:', `${progresoDelDia}%`);
      console.log('⏰ Última actualización:', ultimaActualizacion.toLocaleTimeString('es-ES'));
      
      // Memoria del componente (solo en navegadores compatibles)
      const perfMemory = (performance as any).memory;
      if (perfMemory) {
        console.log('💾 Uso de memoria:', {
          usada: (perfMemory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
          total: (perfMemory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
          limite: (perfMemory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
        });
      }
      
      console.groupEnd();
    } else {
      console.log('⚠️ useEffect: Métricas es null');
    }
  }, [metricas, ultimaActualizacion]);

  const handleRefreshManual = () => {
    console.group('🔄 REFRESH MANUAL INICIADO POR USUARIO');
    console.log('👤 Acción: Usuario hizo clic en botón Actualizar');
    console.log('⏰ Hora de solicitud:', new Date().toLocaleString('es-ES'));
    console.log('📊 Estado actual antes del refresh:');
    
    if (metricas) {
      console.table({
        'Citas Totales': metricas.citas_hoy,
        'Pendientes': metricas.citas_pendientes,
        'Confirmadas': metricas.citas_confirmadas,
        'Atendidas': metricas.citas_atendidas,
        'Última Actualización': ultimaActualizacion.toLocaleTimeString('es-ES')
      });
      
      const tiempoDesdeUltimaActualizacion = Date.now() - ultimaActualizacion.getTime();
      const segundos = Math.floor(tiempoDesdeUltimaActualizacion / 1000);
      console.log(`⏱️ Han pasado ${segundos} segundos desde la última actualización`);
    } else {
      console.log('� No hay métricas cargadas aún');
    }
    
    console.log('�🔄 Cambiando estado cargando a true');
    console.log('📡 Iniciando nueva petición al backend...');
    console.groupEnd();
    
    setCargando(true);
    cargarMetricas();
  };

  if (cargando && !metricas) {
    console.log('⏳ Renderizando estado de carga inicial...');
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Cargando métricas del día...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('❌ Renderizando estado de error:', error);
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <span style={styles.errorIcono}>⚠️</span>
          <p style={styles.errorText}>{error}</p>
          <button onClick={handleRefreshManual} style={styles.retryButton}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!metricas) {
    console.log('⚠️ Métricas es null, no se renderiza nada');
    return null;
  }

  console.group('🎨 RENDERIZANDO VISTA DE MÉTRICAS');
  console.log('✅ Componente en modo: DATOS CARGADOS');
  console.log('📊 Datos a renderizar:');
  console.table({
    'Fecha': metricas.fecha,
    'Total Citas': metricas.citas_hoy,
    'Pendientes': metricas.citas_pendientes,
    'Confirmadas': metricas.citas_confirmadas,
    'Atendidas': metricas.citas_atendidas,
    'Pacientes': metricas.pacientes_atendidos,
    'Próxima Cita': !!metricas.proxima_cita ? 'SÍ' : 'NO'
  });
  
  console.log('🎯 Componentes a renderizar:');
  console.log('  - Header con botón de actualización');
  console.log('  - Grid con 4 tarjetas de métricas');
  console.log('  - Componente ProximaCita:', !!metricas.proxima_cita ? 'SÍ' : 'NO');
  console.log('⏰ Última actualización mostrada:', ultimaActualizacion.toLocaleTimeString('es-ES'));
  console.groupEnd();

  return (
    <div style={styles.container}>
      {/* Header con título y botón de refresh */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.titulo}>📊 Métricas del Día</h2>
          <p style={styles.subtitulo}>
            Última actualización: {ultimaActualizacion.toLocaleTimeString('es-ES')}
          </p>
        </div>
        <button 
          onClick={handleRefreshManual} 
          style={styles.refreshButton}
          disabled={cargando}
        >
          {cargando ? '⏳' : '🔄'} Actualizar
        </button>
      </div>

      {/* Grid de tarjetas de métricas */}
      <div style={styles.grid}>
        <TarjetaMetrica
          titulo="Citas Hoy"
          valor={metricas.citas_hoy}
          icono="📅"
          colorFondo="#e3f2fd"
          colorIcono="#1976d2"
        />
        
        <TarjetaMetrica
          titulo="Confirmadas"
          valor={metricas.citas_confirmadas}
          icono="✔️"
          colorFondo="#e1f5fe"
          colorIcono="#0288d1"
        />
        
        <TarjetaMetrica
          titulo="Pendientes"
          valor={metricas.citas_pendientes}
          icono="⏰"
          colorFondo="#fff3e0"
          colorIcono="#f57c00"
        />
        
        <TarjetaMetrica
          titulo="Atendidas"
          valor={metricas.citas_atendidas}
          icono="✅"
          colorFondo="#e8f5e9"
          colorIcono="#388e3c"
        />
        
        <TarjetaMetrica
          titulo="Pacientes Atendidos"
          valor={metricas.pacientes_atendidos}
          icono="👥"
          colorFondo="#f3e5f5"
          colorIcono="#7b1fa2"
        />
      </div>

      {/* Próxima cita */}
      <div style={styles.proximaCitaContainer}>
        <ProximaCita cita={metricas.proxima_cita} />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  titulo: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 700,
    color: '#2c3e50',
  },
  subtitulo: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: '#666',
  },
  refreshButton: {
    padding: '12px 24px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  },
  proximaCitaContainer: {
    marginBottom: '24px',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e8e8e8',
    borderTop: '4px solid #1976d2',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    margin: 0,
    fontSize: '16px',
    color: '#666',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '60px 20px',
    gap: '16px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  errorIcono: {
    fontSize: '48px',
  },
  errorText: {
    margin: 0,
    fontSize: '16px',
    color: '#d32f2f',
    textAlign: 'center',
  },
  retryButton: {
    padding: '12px 24px',
    backgroundColor: '#d32f2f',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

export default MetricasDelDiaComponent;
