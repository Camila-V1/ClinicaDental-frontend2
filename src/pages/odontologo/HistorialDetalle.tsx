/**
 * 📋 DETALLE DEL HISTORIAL CLÍNICO
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerHistorialCompleto, type HistorialCompleto } from '../../services/historialService';
import GestionDocumentos from '../../components/historial/GestionDocumentos';

export default function HistorialDetalle() {
  const { pacienteId } = useParams<{ pacienteId: string }>();
  const [historial, setHistorial] = useState<HistorialCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabActiva, setTabActiva] = useState<'general' | 'episodios' | 'odontogramas' | 'documentos'>('general');
  const navigate = useNavigate();

  useEffect(() => {
    if (pacienteId) {
      cargarHistorial(parseInt(pacienteId));
    }
  }, [pacienteId]);

  const cargarHistorial = async (id: number) => {
    try {
      setLoading(true);
      const data = await obtenerHistorialCompleto(id);
      setHistorial(data);
    } catch (error) {
      console.error('Error al cargar historial:', error);
      alert('Error al cargar historial');
    } finally {
      setLoading(false);
    }
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
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Cargando historial...</p>
      </div>
    );
  }

  if (!historial) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ 
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          padding: '16px',
          borderRadius: '4px'
        }}>
          ⚠️ No se encontró el historial
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header Simple */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/odontologo/historiales')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '16px'
          }}
        >
          ← Volver a la lista
        </button>
        
        <h1 style={{ margin: '0 0 8px 0', color: '#333' }}>
          {historial.paciente_nombre}
        </h1>
        <p style={{ margin: 0, color: '#666' }}>{historial.paciente_email}</p>
      </div>

      {/* Datos del Paciente - Simple y Legible */}
      <div style={{ 
        backgroundColor: 'white', 
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: '0 0 16px 0', color: '#333' }}>
          👤 Datos del Paciente
        </h2>
        
        <div style={{ marginBottom: '12px' }}>
          <strong>CI:</strong> {historial.paciente_ci || 'N/A'}
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <strong>Teléfono:</strong> {historial.paciente_telefono || 'N/A'}
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <strong>Fecha de Nacimiento:</strong> {historial.paciente_fecha_nacimiento || 'N/A'}
        </div>
        
        <div>
          <strong>Dirección:</strong> {historial.paciente_direccion || 'N/A'}
        </div>
      </div>

      {/* Alertas Médicas - Simple */}
      {(historial.alergias || historial.medicamentos_actuales || historial.antecedentes_medicos) && (
        <div style={{ 
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '4px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#856404' }}>
            ⚠️ Información Médica Importante
          </h3>
          
          {historial.alergias && (
            <div style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#dc3545' }}>Alergias:</strong> {historial.alergias}
            </div>
          )}
          
          {historial.medicamentos_actuales && (
            <div style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#0d6efd' }}>Medicamentos:</strong> {historial.medicamentos_actuales}
            </div>
          )}
          
          {historial.antecedentes_medicos && (
            <div>
              <strong style={{ color: '#6f42c1' }}>Antecedentes:</strong> {historial.antecedentes_medicos}
            </div>
          )}
        </div>
      )}

      {/* Estadísticas - Simple */}
      <div style={{ 
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ 
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '20px',
          flex: '1',
          minWidth: '150px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3498db' }}>
            {historial.total_episodios}
          </div>
          <div style={{ marginTop: '8px', color: '#666' }}>
            Episodios
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '20px',
          flex: '1',
          minWidth: '150px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#27ae60' }}>
            {historial.total_odontogramas}
          </div>
          <div style={{ marginTop: '8px', color: '#666' }}>
            Odontogramas
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '20px',
          flex: '1',
          minWidth: '150px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#9b59b6' }}>
            {historial.total_documentos}
          </div>
          <div style={{ marginTop: '8px', color: '#666' }}>
            Documentos
          </div>
        </div>
      </div>

      {/* Tabs - Simple */}
      <div style={{ 
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px'
      }}>
        {/* Botones de tabs */}
        <div style={{ 
          borderBottom: '1px solid #ddd',
          display: 'flex',
          gap: '4px',
          padding: '8px'
        }}>
          <button
            onClick={() => setTabActiva('general')}
            style={{
              padding: '12px 20px',
              border: 'none',
              backgroundColor: tabActiva === 'general' ? '#3498db' : '#f5f5f5',
              color: tabActiva === 'general' ? 'white' : '#333',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            📊 General
          </button>
          
          <button
            onClick={() => setTabActiva('episodios')}
            style={{
              padding: '12px 20px',
              border: 'none',
              backgroundColor: tabActiva === 'episodios' ? '#3498db' : '#f5f5f5',
              color: tabActiva === 'episodios' ? 'white' : '#333',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            🩺 Episodios ({historial.episodios.length})
          </button>
          
          <button
            onClick={() => setTabActiva('odontogramas')}
            style={{
              padding: '12px 20px',
              border: 'none',
              backgroundColor: tabActiva === 'odontogramas' ? '#3498db' : '#f5f5f5',
              color: tabActiva === 'odontogramas' ? 'white' : '#333',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            🦷 Odontogramas ({historial.odontogramas.length})
          </button>
          
          <button
            onClick={() => setTabActiva('documentos')}
            style={{
              padding: '12px 20px',
              border: 'none',
              backgroundColor: tabActiva === 'documentos' ? '#3498db' : '#f5f5f5',
              color: tabActiva === 'documentos' ? 'white' : '#333',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            📄 Documentos ({historial.total_documentos})
          </button>
        </div>

        {/* Contenido de tabs */}
        <div style={{ padding: '20px' }}>
          {/* Tab General */}
          {tabActiva === 'general' && (
            <div>
              <p style={{ marginBottom: '8px', color: '#333' }}>
                <strong>Última actualización:</strong> {formatearFecha(historial.actualizado)}
              </p>
              {historial.ultimo_episodio && (
                <p style={{ margin: 0, color: '#333' }}>
                  <strong>Última atención:</strong> {formatearFecha(historial.ultimo_episodio)}
                </p>
              )}
            </div>
          )}

          {/* Tab Episodios */}
          {tabActiva === 'episodios' && (
            <div>
              {historial.episodios.length === 0 ? (
                <p style={{ color: '#999' }}>📭 No hay episodios registrados</p>
              ) : (
                <div>
                  {historial.episodios.map((episodio) => (
                    <div 
                      key={episodio.id} 
                      style={{ 
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '16px',
                        marginBottom: '12px',
                        backgroundColor: '#fafafa'
                      }}
                    >
                      <h4 style={{ margin: '0 0 4px 0', color: '#2c3e50' }}>
                        {episodio.motivo_consulta}
                      </h4>
                      <p style={{ fontSize: '14px', color: '#666', margin: '0 0 8px 0' }}>
                        {formatearFecha(episodio.fecha_atencion)} - {episodio.odontologo_nombre}
                      </p>
                      
                      {episodio.diagnostico && (
                        <div style={{ marginTop: '12px' }}>
                          <strong style={{ color: '#333' }}>Diagnóstico:</strong>
                          <p style={{ margin: '4px 0 0 0', color: '#333' }}>{episodio.diagnostico}</p>
                        </div>
                      )}
                      
                      {episodio.descripcion_procedimiento && (
                        <div style={{ marginTop: '12px' }}>
                          <strong style={{ color: '#333' }}>Procedimiento:</strong>
                          <p style={{ margin: '4px 0 0 0', color: '#333' }}>{episodio.descripcion_procedimiento}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Odontogramas */}
          {tabActiva === 'odontogramas' && (
            <div>
              {historial.odontogramas.length === 0 ? (
                <p style={{ color: '#999' }}>📭 No hay odontogramas registrados</p>
              ) : (
                <div>
                  {historial.odontogramas.map((odontograma) => (
                    <div 
                      key={odontograma.id} 
                      style={{ 
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '16px',
                        marginBottom: '12px',
                        backgroundColor: '#fafafa'
                      }}
                    >
                      <h4 style={{ margin: '0 0 4px 0', color: '#2c3e50' }}>
                        Odontograma {formatearFecha(odontograma.fecha_snapshot)}
                      </h4>
                      <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                        {Object.keys(odontograma.estado_piezas).length} piezas registradas
                      </p>
                      
                      {odontograma.notas && (
                        <div style={{ marginTop: '12px' }}>
                          <strong style={{ color: '#333' }}>Notas:</strong>
                          <p style={{ margin: '4px 0 0 0', color: '#333' }}>{odontograma.notas}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Documentos */}
          {tabActiva === 'documentos' && (
            <div>
              <GestionDocumentos 
                historialId={historial.paciente} 
                episodioId={undefined}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
