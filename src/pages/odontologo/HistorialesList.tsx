/**
 * 📋 LISTA DE HISTORIALES CLÍNICOS
 */

import { useState, useEffect } from 'react';
import { obtenerHistoriales, type HistorialResumen } from '../../services/historialService';
import { useNavigate } from 'react-router-dom';

export default function HistorialesList() {
  const [historiales, setHistoriales] = useState<HistorialResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarHistoriales();
  }, []);

  const cargarHistoriales = async () => {
    try {
      setLoading(true);
      const data = await obtenerHistoriales();
      setHistoriales(data);
    } catch (error) {
      console.error('Error al cargar historiales:', error);
      alert('Error al cargar historiales');
    } finally {
      setLoading(false);
    }
  };

  const historialesFiltrados = historiales.filter(h =>
    h.paciente_nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    h.paciente_email.toLowerCase().includes(filtro.toLowerCase())
  );

  const formatearFecha = (fecha: string) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
          <p style={{ color: '#666' }}>Cargando historiales...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', margin: '0 0 8px 0' }}>
          📋 Historiales Clínicos
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>Gestiona los historiales de tus pacientes</p>
      </div>

      {/* Búsqueda */}
      <div style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="🔍 Buscar por nombre o email..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '15px',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3498db'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
      </div>

      {/* Lista de Historiales */}
      {historialesFiltrados.length === 0 ? (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#999', fontSize: '18px' }}>
            📭 No se encontraron historiales
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '24px' 
        }}>
          {historialesFiltrados.map((historial) => (
            <div
              key={historial.paciente}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onClick={() => navigate(`/odontologo/historiales/${historial.paciente}`)}
            >
              <div style={{ padding: '24px' }}>
                {/* Nombre del Paciente */}
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: '600', 
                    color: '#333',
                    margin: '0 0 4px 0' 
                  }}>
                    {historial.paciente_nombre}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                    {historial.paciente_email}
                  </p>
                </div>

                {/* Información Relevante */}
                <div style={{ marginBottom: '16px', minHeight: '80px' }}>
                  {historial.alergias && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      fontSize: '13px',
                      marginBottom: '8px',
                      padding: '8px',
                      backgroundColor: '#fff3cd',
                      borderRadius: '6px'
                    }}>
                      <span style={{ color: '#dc3545', fontWeight: '600', marginRight: '8px' }}>
                        ⚠️ Alergias:
                      </span>
                      <span style={{ color: '#333', flex: 1 }}>{historial.alergias}</span>
                    </div>
                  )}
                  
                  {historial.medicamentos_actuales && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      fontSize: '13px',
                      padding: '8px',
                      backgroundColor: '#cfe2ff',
                      borderRadius: '6px'
                    }}>
                      <span style={{ color: '#0d6efd', fontWeight: '600', marginRight: '8px' }}>
                        💊 Medicamentos:
                      </span>
                      <span style={{ 
                        color: '#333', 
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {historial.medicamentos_actuales}
                      </span>
                    </div>
                  )}
                </div>

                {/* Estadísticas */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  borderTop: '1px solid #e9ecef'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '28px', 
                      fontWeight: 'bold', 
                      color: '#3498db' 
                    }}>
                      {historial.total_episodios}
                    </div>
                    <div style={{ fontSize: '11px', color: '#666' }}>Episodios</div>
                  </div>
                  
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '2px' }}>
                      Última atención
                    </div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      {formatearFecha(historial.ultimo_episodio || '')}
                    </div>
                  </div>
                </div>

                {/* Botón Ver Detalle */}
                <button
                  style={{
                    marginTop: '16px',
                    width: '100%',
                    backgroundColor: '#3498db',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/odontologo/historiales/${historial.paciente}`);
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
                >
                  Ver Historial Completo →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CSS para animación de loading */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
