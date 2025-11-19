import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  obtenerDetalleEpisodio,
  obtenerEpisodiosNavegacion,
  formatearFecha,
  getTipoEpisodioColor,
  getTipoEpisodioIcono
} from '../../services/historialService';
import { Activity, AlertCircle, ArrowLeft, RotateCcw } from 'lucide-react';

import InfoPrincipal from '../../components/historial/detalle/InfoPrincipal';
import DocumentosDetalle from '../../components/historial/detalle/DocumentosDetalle';
import CitaRelacionada from '../../components/historial/detalle/CitaRelacionada';
import InfoOdontologo from '../../components/historial/detalle/InfoOdontologo';

export default function DetalleEpisodio() {
  const { episodioId } = useParams<{ episodioId: string }>();
  const navigate = useNavigate();

  const [episodio, setEpisodio] = useState<any>(null);
  const [navegacion, setNavegacion] = useState<{ anterior: number | null; siguiente: number | null }>({
    anterior: null,
    siguiente: null
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (episodioId) {
      cargarEpisodio(parseInt(episodioId));
    }
  }, [episodioId]);

  const cargarEpisodio = async (id: number) => {
    try {
      setCargando(true);
      setError(null);

      const [detalleData, navData] = await Promise.all([
        obtenerDetalleEpisodio(id),
        obtenerEpisodiosNavegacion(id)
      ]);

      setEpisodio(detalleData);
      setNavegacion(navData);
    } catch (err: any) {
      console.error('❌ Error cargando episodio:', err);
      setError('Error al cargar el detalle del episodio');
    } finally {
      setCargando(false);
    }
  };

  const navegarAEpisodio = (id: number | null) => {
    if (id) {
      navigate(`/paciente/historial/episodio/${id}`);
    }
  };

  if (cargando) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '60px 80px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <Activity size={40} strokeWidth={1.5} style={{ color: '#0d9488', margin: '0 auto 16px' }} className="animate-spin" />
          <p style={{ fontSize: '15px', color: '#64748b', fontWeight: '500' }}>Cargando episodio...</p>
        </div>
      </div>
    );
  }

  if (error || !episodio) {
    return (
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '32px 16px'
      }}>
        <div style={{
          backgroundColor: '#fee2e2',
          borderLeft: '3px solid #dc2626',
          borderRadius: '6px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
            <AlertCircle size={24} strokeWidth={1.5} style={{ color: '#991b1b', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#991b1b', fontWeight: '600', fontSize: '16px', margin: '0 0 8px 0' }}>Error</h3>
              <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>
                {error || 'Episodio no encontrado'}
              </p>
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('/paciente/historial')}
              style={{
                padding: '10px 16px',
                backgroundColor: '#64748b',
                color: 'white',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 150ms'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#475569'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#64748b'}
            >
              <ArrowLeft size={16} strokeWidth={1.5} />
              Volver al Historial
            </button>
            <button
              onClick={() => cargarEpisodio(parseInt(episodioId!))}
              style={{
                padding: '10px 16px',
                backgroundColor: '#dc2626',
                color: 'white',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 150ms'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            >
              <RotateCcw size={16} strokeWidth={1.5} />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '32px 16px'
    }}>
      
      {/* Header con Navegación */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <button
          onClick={() => navigate('/paciente/historial')}
          style={{
            padding: '10px 16px',
            backgroundColor: '#e5e7eb',
            color: '#374151',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#d1d5db';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#e5e7eb';
          }}
        >
          ← Volver al Historial
        </button>

        {/* Navegación Anterior/Siguiente */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => navegarAEpisodio(navegacion.anterior)}
            disabled={!navegacion.anterior}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '500',
              cursor: navegacion.anterior ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: navegacion.anterior ? '#2563eb' : '#e5e7eb',
              color: navegacion.anterior ? 'white' : '#9ca3af'
            }}
          >
            ← Anterior
          </button>
          <button
            onClick={() => navegarAEpisodio(navegacion.siguiente)}
            disabled={!navegacion.siguiente}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '500',
              cursor: navegacion.siguiente ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: navegacion.siguiente ? '#2563eb' : '#e5e7eb',
              color: navegacion.siguiente ? 'white' : '#9ca3af'
            }}
          >
            Siguiente →
          </button>
        </div>
      </div>

      {/* Título y Badge */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ fontSize: '64px' }}>
            {getTipoEpisodioIcono(episodio.tipo || 'CONSULTA')}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
              flexWrap: 'wrap'
            }}>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getTipoEpisodioColor(episodio.tipo || 'CONSULTA')}`}>
                {episodio.tipo || 'CONSULTA'}
              </span>
              <span style={{ color: '#6b7280' }}>
                {formatearFecha(episodio.fecha_atencion || episodio.fecha)}
              </span>
            </div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>
              {episodio.diagnostico || episodio.motivo_consulta}
            </h1>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Episodio #{episodio.id} - Registrado el {new Date(episodio.created_at || episodio.fecha_atencion).toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Contenido */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        
        {/* Columna Principal */}
        <div style={{
          gridColumn: window.innerWidth >= 1024 ? 'span 2' : 'span 1',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          
          <InfoPrincipal episodio={episodio} />

          {episodio.documentos?.length > 0 && (
            <DocumentosDetalle documentos={episodio.documentos} />
          )}

          {episodio.cita && (
            <CitaRelacionada cita={episodio.cita} />
          )}

        </div>

        {/* Columna Lateral */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <InfoOdontologo episodio={episodio} />

          {/* Metadata */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '24px'
          }}>
            <h3 style={{
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '16px',
              margin: '0 0 16px 0'
            }}>
              📅 Información Adicional
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div>
                <p style={{ color: '#6b7280', margin: '0 0 4px 0' }}>Creado:</p>
                <p style={{ fontWeight: '500', color: '#111827', margin: 0 }}>
                  {new Date(episodio.created_at || episodio.fecha_atencion).toLocaleString('es-ES')}
                </p>
              </div>
              {episodio.updated_at && episodio.updated_at !== episodio.created_at && (
                <div>
                  <p style={{ color: '#6b7280', margin: '0 0 4px 0' }}>Última actualización:</p>
                  <p style={{ fontWeight: '500', color: '#111827', margin: 0 }}>
                    {new Date(episodio.updated_at).toLocaleString('es-ES')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '24px'
          }}>
            <h3 style={{
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '16px',
              margin: '0 0 16px 0'
            }}>
              ⚡ Acciones
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => window.print()}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }}
              >
                🖨️ Imprimir Episodio
              </button>
              <button
                onClick={() => navigate('/paciente/citas')}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#15803d';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#16a34a';
                }}
              >
                📅 Agendar Consulta
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
