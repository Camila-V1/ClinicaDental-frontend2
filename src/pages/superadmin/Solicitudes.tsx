/**
 * 📋 SOLICITUDES DE REGISTRO - Super Admin
 * Aprobar/rechazar solicitudes de nuevas clínicas
 */

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import tenantsService, { SolicitudRegistro } from '../../services/tenantsService';

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState<SolicitudRegistro[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'TODAS' | 'PENDIENTE' | 'PROCESADA' | 'RECHAZADA'>('PENDIENTE');
  const [procesando, setProcesando] = useState<number | null>(null);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      const data = await tenantsService.getSolicitudes();
      setSolicitudes(data);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      toast.error('Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async (solicitud: SolicitudRegistro) => {
    if (!confirm(`¿Aprobar solicitud de "${solicitud.nombre_clinica}" y crear la clínica?`)) return;
    
    setProcesando(solicitud.id);
    try {
      const response = await tenantsService.aprobarSolicitud(solicitud.id);
      toast.success(`✅ Clínica "${solicitud.nombre_clinica}" creada exitosamente`);
      
      // Mostrar información de acceso si está disponible
      if (response.credenciales) {
        alert(`Clínica creada:\nDominio: ${response.dominio}\nUsuario: ${response.credenciales.email}\nContraseña temporal: ${response.credenciales.password}`);
      }
      
      cargarSolicitudes();
    } catch (error: any) {
      console.error('Error al aprobar solicitud:', error);
      const mensaje = error.response?.data?.error || error.response?.data?.detail || 'Error al aprobar solicitud';
      toast.error(mensaje);
    } finally {
      setProcesando(null);
    }
  };

  const handleRechazar = async (solicitud: SolicitudRegistro) => {
    const motivo = prompt('Motivo del rechazo:');
    if (!motivo || motivo.trim() === '') {
      toast.error('Debes especificar un motivo');
      return;
    }
    
    setProcesando(solicitud.id);
    try {
      await tenantsService.rechazarSolicitud(solicitud.id, motivo);
      toast.success('Solicitud rechazada');
      cargarSolicitudes();
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
      toast.error('Error al rechazar solicitud');
    } finally {
      setProcesando(null);
    }
  };

  const solicitudesFiltradas = filtro === 'TODAS' 
    ? solicitudes 
    : solicitudes.filter(s => s.estado === filtro);

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'PROCESADA': return 'bg-green-100 text-green-800 border-green-300';
      case 'RECHAZADA': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const contarPorEstado = (estado: string) => {
    if (estado === 'TODAS') return solicitudes.length;
    return solicitudes.filter(s => s.estado === estado).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-500">Cargando solicitudes...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          📋 Solicitudes de Registro
        </h1>
        <p className="text-gray-600">
          Gestiona las solicitudes de nuevas clínicas
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {(['TODAS', 'PENDIENTE', 'PROCESADA', 'RECHAZADA'] as const).map(estado => (
          <button
            key={estado}
            onClick={() => setFiltro(estado)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtro === estado 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {estado.charAt(0) + estado.slice(1).toLowerCase()}
            <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
              {contarPorEstado(estado)}
            </span>
          </button>
        ))}
      </div>

      {/* Lista de solicitudes */}
      <div className="grid gap-4">
        {solicitudesFiltradas.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No hay solicitudes {filtro !== 'TODAS' && filtro.toLowerCase()}
            </h3>
            <p className="text-gray-500">
              {filtro === 'PENDIENTE' && 'Todas las solicitudes han sido procesadas'}
              {filtro === 'PROCESADA' && 'No hay solicitudes aprobadas aún'}
              {filtro === 'RECHAZADA' && 'No hay solicitudes rechazadas'}
              {filtro === 'TODAS' && 'No hay solicitudes registradas'}
            </p>
          </div>
        ) : (
          solicitudesFiltradas.map(solicitud => (
            <div key={solicitud.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {solicitud.nombre_clinica}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getBadgeColor(solicitud.estado)}`}>
                        {solicitud.estado}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      🌐 Dominio: <span className="font-medium">{solicitud.dominio_deseado}.clinica.com</span>
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Solicitado</p>
                    <p className="font-medium">
                      {new Date(solicitud.fecha_solicitud).toLocaleDateString('es-BO', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Contacto</p>
                    <p className="font-medium">{solicitud.nombre_contacto}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Email</p>
                    <p className="font-medium text-sm">{solicitud.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Teléfono</p>
                    <p className="font-medium">{solicitud.telefono}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Plan Solicitado</p>
                    <p className="font-medium">{solicitud.plan_solicitado?.nombre || 'N/A'}</p>
                  </div>
                </div>

                {/* Ubicación */}
                {(solicitud.ciudad || solicitud.pais) && (
                  <div className="mb-4 text-sm text-gray-600">
                    📍 {solicitud.ciudad && `${solicitud.ciudad}, `}{solicitud.pais}
                  </div>
                )}

                {/* Motivo de rechazo */}
                {solicitud.estado === 'RECHAZADA' && solicitud.motivo_rechazo && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm font-medium text-red-800">Motivo del rechazo:</p>
                    <p className="text-sm text-red-700">{solicitud.motivo_rechazo}</p>
                  </div>
                )}

                {/* Acciones */}
                {solicitud.estado === 'PENDIENTE' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => handleAprobar(solicitud)}
                      disabled={procesando === solicitud.id}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                    >
                      {procesando === solicitud.id ? '⏳ Procesando...' : '✓ Aprobar y Crear Clínica'}
                    </button>
                    <button
                      onClick={() => handleRechazar(solicitud)}
                      disabled={procesando === solicitud.id}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                    >
                      {procesando === solicitud.id ? '⏳ Procesando...' : '✕ Rechazar'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
