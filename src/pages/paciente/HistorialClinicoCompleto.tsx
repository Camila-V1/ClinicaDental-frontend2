import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  obtenerMiHistorial,
  agruparEpisodiosPorMes
} from '../../services/historialService';
import { Activity, AlertCircle, FileText, RotateCcw } from 'lucide-react';

import EpisodioCard from '../../components/historial/EpisodioCard';
import DocumentosGaleria from '../../components/historial/DocumentosGaleria';
import LineaTiempo from '../../components/historial/LineaTiempo';
import FiltrosHistorial from '../../components/historial/FiltrosHistorial';
import EstadisticasHistorial from '../../components/historial/EstadisticasHistorial';

export default function HistorialClinicoCompleto() {
  const navigate = useNavigate();

  const [historial, setHistorial] = useState<any>(null);
  const [episodiosFiltrados, setEpisodiosFiltrados] = useState<any[]>([]);
  const [vistaActual, setVistaActual] = useState<'lista' | 'timeline'>('lista');
  const [filtros, setFiltros] = useState({
    tipo: '',
    fechaInicio: '',
    fechaFin: '',
    busqueda: ''
  });
  
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarHistorial();
  }, []);

  useEffect(() => {
    if (historial?.episodios) {
      aplicarFiltros();
    }
  }, [historial, filtros]);

  const cargarHistorial = async () => {
    try {
      setCargando(true);
      setError(null);

      const data = await obtenerMiHistorial();
      setHistorial(data);
      setEpisodiosFiltrados(data.episodios || []);
    } catch (err: any) {
      console.error('❌ Error cargando historial:', err);
      setError('Error al cargar el historial clínico');
    } finally {
      setCargando(false);
    }
  };

  const aplicarFiltros = () => {
    let episodios = [...(historial?.episodios || [])];

    // Filtrar por tipo
    if (filtros.tipo) {
      episodios = episodios.filter(e => 
        e.tipo?.toUpperCase() === filtros.tipo.toUpperCase()
      );
    }

    // Filtrar por fecha inicio
    if (filtros.fechaInicio) {
      episodios = episodios.filter(e => 
        new Date(e.fecha_atencion || e.fecha) >= new Date(filtros.fechaInicio)
      );
    }

    // Filtrar por fecha fin
    if (filtros.fechaFin) {
      episodios = episodios.filter(e => 
        new Date(e.fecha_atencion || e.fecha) <= new Date(filtros.fechaFin)
      );
    }

    // Filtrar por búsqueda
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      episodios = episodios.filter(e =>
        e.diagnostico?.toLowerCase().includes(busqueda) ||
        e.tratamiento_realizado?.toLowerCase().includes(busqueda) ||
        e.notas_privadas?.toLowerCase().includes(busqueda) ||
        e.odontologo_nombre?.toLowerCase().includes(busqueda) ||
        e.motivo_consulta?.toLowerCase().includes(busqueda)
      );
    }

    setEpisodiosFiltrados(episodios);
  };

  const cambiarFiltro = (campo: string, valor: any) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      tipo: '',
      fechaInicio: '',
      fechaFin: '',
      busqueda: ''
    });
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
          <p style={{ fontSize: '15px', color: '#64748b', fontWeight: '500' }}>Cargando historial clínico...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        maxWidth: '1400px',
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
              <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>{error}</p>
            </div>
          </div>
          <button
            onClick={cargarHistorial}
            style={{
              marginTop: '16px',
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
    );
  }

  const episodiosAgrupados = agruparEpisodiosPorMes(episodiosFiltrados);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '20px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FileText size={28} strokeWidth={1.5} style={{ color: '#0d9488' }} />
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#0f172a',
              margin: 0
            }}>
              Historial Clínico Completo
            </h1>
            <p style={{ 
              margin: '6px 0 0 0', 
              fontSize: '14px', 
              color: '#64748b' 
            }}>
              Registro completo de atenciones médicas
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={cargarHistorial}
            style={{
              padding: '8px 16px',
              backgroundColor: 'white',
              border: '1px solid #cbd5e1',
              color: '#475569',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 150ms',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
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
            <RotateCcw size={16} strokeWidth={1.5} />
            Actualizar
          </button>
          
          <button
            onClick={() => navigate('/paciente/dashboard')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0d9488',
              border: 'none',
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 150ms'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f766e'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
          >
            Volver
          </button>
        </div>
      </div>

      <div style={{ width: '100%', padding: '32px', boxSizing: 'border-box' }}>
      
      {/* Vista de botones */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#0f172a',
            margin: 0
          }}>
            Mis Episodios Clínicos
          </h2>
          <p style={{
            color: '#6b7280',
            marginTop: '8px',
            margin: '8px 0 0 0'
          }}>
            Todos tus registros médicos dentales
          </p>
        </div>
        <button
          onClick={() => navigate('/paciente/dashboard')}
          style={{
            padding: '10px 16px',
            backgroundColor: '#e5e7eb',
            color: '#374151',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#d1d5db';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#e5e7eb';
          }}
        >
          ← Volver
        </button>
      </div>

      {/* Estadísticas */}
      <EstadisticasHistorial historial={historial} />

      {/* Filtros */}
      <FiltrosHistorial
        filtros={filtros}
        cambiarFiltro={cambiarFiltro}
        limpiarFiltros={limpiarFiltros}
      />

      {/* Toggle Vista */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setVistaActual('lista')}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              backgroundColor: vistaActual === 'lista' ? '#2563eb' : '#e5e7eb',
              color: vistaActual === 'lista' ? 'white' : '#374151'
            }}
          >
            📋 Lista
          </button>
          <button
            onClick={() => setVistaActual('timeline')}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              backgroundColor: vistaActual === 'timeline' ? '#2563eb' : '#e5e7eb',
              color: vistaActual === 'timeline' ? 'white' : '#374151'
            }}
          >
            ⏱️ Línea de Tiempo
          </button>
        </div>

        <p style={{ color: '#6b7280', margin: 0 }}>
          {episodiosFiltrados.length} de {historial?.episodios?.length || 0} episodios
        </p>
      </div>

      {/* Contenido según vista */}
      {episodiosFiltrados.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '48px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '64px' }}>🔍</span>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#111827',
            marginTop: '16px',
            margin: '16px 0 0 0'
          }}>
            No se encontraron episodios
          </h3>
          <p style={{
            color: '#6b7280',
            marginTop: '8px',
            margin: '8px 0 0 0'
          }}>
            Intenta ajustar los filtros de búsqueda
          </p>
          {(filtros.tipo || filtros.fechaInicio || filtros.fechaFin || filtros.busqueda) && (
            <button
              onClick={limpiarFiltros}
              style={{
                marginTop: '16px',
                padding: '10px 24px',
                backgroundColor: '#2563eb',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '500',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }}
            >
              Limpiar Filtros
            </button>
          )}
        </div>
      ) : vistaActual === 'lista' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {episodiosAgrupados.map((grupo: any, index: number) => (
            <div key={index}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '16px',
                position: 'sticky',
                top: 0,
                backgroundColor: '#f9fafb',
                padding: '8px 0',
                zIndex: 10,
                margin: '0 0 16px 0'
              }}>
                📅 {grupo.nombre}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {grupo.episodios.map((episodio: any) => (
                  <EpisodioCard key={episodio.id} episodio={episodio} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <LineaTiempo episodios={episodiosFiltrados} />
      )}

      {/* Galería de Documentos (si hay) */}
      {historial?.documentos?.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <DocumentosGaleria documentos={historial.documentos} />
        </div>
      )}

      </div>
    </div>
  );
}
