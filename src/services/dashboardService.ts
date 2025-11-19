import api from '../config/apiConfig';

export const obtenerEstadisticasDashboard = async (): Promise<any> => {
  console.log('📊 Obteniendo estadísticas del dashboard...');
  
  try {
    const [
      citasResponse,
      historialResponse,
      planesActivosResponse,
      planesPropuestosResponse,
      estadoCuentaResponse
    ] = await Promise.all([
      api.get('/api/agenda/citas/', {
        params: { 
          fecha_inicio: new Date().toISOString().split('T')[0],
          ordering: 'fecha_hora',
          limit: 5
        }
      }).catch(() => ({ data: [] })),
      api.get('/api/historial/historiales/mi_historial/').catch(() => ({ data: {} })),
      api.get('/api/tratamientos/planes/', { 
        params: { estado: 'en_progreso' } 
      }).catch(() => ({ data: [] })),
      api.get('/api/tratamientos/planes/propuestos/', { 
        params: { estado: 'propuesto' } 
      }).catch(() => ({ data: [] })),
      api.get('/api/facturacion/facturas/estado_cuenta/').catch(() => ({ data: {} }))
    ]);

    const estadisticas = {
      proximasCitas: citasResponse.data || [],
      totalCitasProximas: (citasResponse.data || []).length,
      historial: historialResponse.data || {},
      totalDocumentos: historialResponse.data?.documentos?.length || 0,
      totalEpisodios: historialResponse.data?.episodios_count || 0,
      planesActivos: planesActivosResponse.data || [],
      totalPlanesActivos: (planesActivosResponse.data || []).length,
      planesPropuestos: planesPropuestosResponse.data?.results || planesPropuestosResponse.data || [],
      totalPlanesPropuestos: (planesPropuestosResponse.data?.results || planesPropuestosResponse.data || []).length,
      estadoCuenta: estadoCuentaResponse.data || {},
      saldoPendiente: estadoCuentaResponse.data?.saldo_pendiente || 0,
      totalFacturado: estadoCuentaResponse.data?.monto_total || 0,
      totalPagado: estadoCuentaResponse.data?.monto_pagado || 0,
      facturasPendientes: estadoCuentaResponse.data?.facturas_pendientes || 0
    };

    console.log('✅ Estadísticas obtenidas exitosamente');
    return estadisticas;
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    throw error;
  }
};

export const obtenerGraficoCitas = async (): Promise<any[]> => {
  console.log('📈 Obteniendo datos para gráfico de citas...');
  
  try {
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 6);

    const response = await api.get('/api/agenda/citas/', {
      params: {
        fecha_inicio: fechaInicio.toISOString().split('T')[0],
        fecha_fin: fechaFin.toISOString().split('T')[0]
      }
    });

    const citas = response.data || [];
    const citasPorMes = agruparCitasPorMes(citas);
    
    console.log('✅ Datos del gráfico obtenidos');
    return citasPorMes;
  } catch (error) {
    console.error('❌ Error obteniendo gráfico:', error);
    return [];
  }
};

const agruparCitasPorMes = (citas: any[]): any[] => {
  const mesesMap = new Map<string, number>();
  const meses = [];
  
  for (let i = 5; i >= 0; i--) {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() - i);
    const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    const mesNombre = fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    mesesMap.set(mesKey, 0);
    meses.push({ mes: mesNombre, key: mesKey });
  }
  
  citas.forEach(cita => {
    const fecha = new Date(cita.fecha_hora);
    const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    if (mesesMap.has(mesKey)) {
      mesesMap.set(mesKey, (mesesMap.get(mesKey) || 0) + 1);
    }
  });
  
  return meses.map(m => ({
    mes: m.mes,
    citas: mesesMap.get(m.key) || 0
  }));
};

export const obtenerTimelineActividad = async (): Promise<any[]> => {
  console.log('📜 Obteniendo timeline de actividad...');
  
  try {
    const [citasResponse, planesResponse, facturasResponse] = await Promise.all([
      api.get('/api/agenda/citas/', { params: { limit: 5 } }).catch(() => ({ data: [] })),
      api.get('/api/tratamientos/planes/', { params: { limit: 3 } }).catch(() => ({ data: [] })),
      api.get('/api/facturacion/facturas/mis_facturas/', { params: { limit: 3 } }).catch(() => ({ data: [] }))
    ]);

    const actividades: any[] = [];

    (citasResponse.data || []).forEach((cita: any) => {
      actividades.push({
        tipo: 'cita',
        icono: '📅',
        titulo: `Cita: ${cita.motivo || 'Consulta'}`,
        descripcion: `Dr. ${cita.odontologo_nombre || 'Desconocido'}`,
        fecha: cita.fecha_hora,
        estado: cita.estado
      });
    });

    (planesResponse.data || []).forEach((plan: any) => {
      actividades.push({
        tipo: 'plan',
        icono: '🦷',
        titulo: plan.titulo || 'Plan de Tratamiento',
        descripcion: `${plan.estado_display || plan.estado}`,
        fecha: plan.fecha_creacion,
        estado: plan.estado
      });
    });

    (facturasResponse.data || []).forEach((factura: any) => {
      actividades.push({
        tipo: 'factura',
        icono: '💰',
        titulo: `Factura #${factura.numero}`,
        descripcion: `${factura.estado_display || factura.estado} - $${factura.monto_total || factura.total}`,
        fecha: factura.fecha_emision,
        estado: factura.estado
      });
    });

    actividades.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    console.log('✅ Timeline obtenido:', actividades.length, 'actividades');
    return actividades.slice(0, 10);
  } catch (error) {
    console.error('❌ Error obteniendo timeline:', error);
    return [];
  }
};

export const formatearFechaRelativa = (fechaISO: string): string => {
  const fecha = new Date(fechaISO);
  const ahora = new Date();
  const diffMs = ahora.getTime() - fecha.getTime();
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDias === 0) return 'Hoy';
  if (diffDias === 1) return 'Ayer';
  if (diffDias < 7) return `Hace ${diffDias} días`;
  if (diffDias < 30) return `Hace ${Math.floor(diffDias / 7)} semanas`;
  return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};
