/**
 * ODONTOGRAMA - Mapa dental completo del paciente
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerOdontograma } from '../../services/historialService';
import { Activity, AlertCircle, Smile, RotateCcw } from 'lucide-react';

// Componentes
import ArcadaDental from '../../components/odontograma/ArcadaDental';
import DetalleDiente from '../../components/odontograma/DetalleDiente';
import LeyendaOdontograma from '../../components/odontograma/LeyendaOdontograma';
import EstadisticasDentales from '../../components/odontograma/EstadisticasDentales';
import GraficoSaludDental from '../../components/odontograma/GraficoSaludDental';
import TabsCuadrantes from '../../components/odontograma/TabsCuadrantes';

export default function Odontograma() {
  const navigate = useNavigate();

  const [odontograma, setOdontograma] = useState<any>(null);
  const [dienteSeleccionado, setDienteSeleccionado] = useState<any>(null);
  const [vistaActual, setVistaActual] = useState<string>('completo');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarOdontograma();
  }, []);

  const cargarOdontograma = async () => {
    try {
      setCargando(true);
      setError(null);

      const data = await obtenerOdontograma();
      setOdontograma(data);
    } catch (err: any) {
      console.error('❌ Error cargando odontograma:', err);
      setError('Error al cargar el odontograma');
    } finally {
      setCargando(false);
    }
  };

  const handleSeleccionarDiente = (numero: string) => {
    const diente = odontograma[numero];
    setDienteSeleccionado(diente);
  };

  if (cargando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '60px 80px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <Activity size={40} strokeWidth={1.5} style={{ color: '#0d9488', margin: '0 auto 16px' }} className="animate-spin" />
          <p style={{ fontSize: '15px', color: '#64748b', fontWeight: '500' }}>Cargando odontograma...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ backgroundColor: '#fee2e2', borderLeft: '3px solid #dc2626', borderRadius: '6px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
            <AlertCircle size={24} strokeWidth={1.5} style={{ color: '#991b1b', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#991b1b', fontWeight: '600', fontSize: '16px', margin: '0 0 8px 0' }}>Error</h3>
              <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>{error}</p>
            </div>
          </div>
          <button
            onClick={cargarOdontograma}
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
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

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
        <div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '24px', 
            color: '#0f172a',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Smile size={28} strokeWidth={1.5} style={{ color: '#0d9488' }} />
            Odontograma Interactivo
          </h1>
          <p style={{ 
            margin: '6px 0 0 0', 
            fontSize: '14px', 
            color: '#64748b' 
          }}>
            Mapa completo de tu salud dental
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={cargarOdontograma}
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
      
      {/* Estilos de impresión */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @media print {
          .no-print { display: none !important; }
          body { print-color-adjust: exact; }
        }
      `}</style>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }} className="no-print">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Smile size={28} strokeWidth={1.5} style={{ color: '#0d9488' }} />
            <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#0f172a', margin: 0 }}>
              Mi Odontograma
            </h1>
          </div>
          <p style={{ fontSize: '15px', color: '#64748b' }}>
            Mapa visual del estado de tus dientes
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => window.print()}
            style={{
              padding: '10px 16px',
              backgroundColor: '#10b981',
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
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
          >
            Imprimir
          </button>
          <button
            onClick={() => navigate('/paciente/historial')}
            style={{
              padding: '10px 16px',
              backgroundColor: 'white',
              color: '#64748b',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 150ms'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#94a3b8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
          >
            ← Volver al Historial
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <EstadisticasDentales odontograma={odontograma} />

      {/* Gráfico de Salud Dental */}
      <GraficoSaludDental odontograma={odontograma} />

      {/* Tabs de Cuadrantes */}
      <TabsCuadrantes vistaActual={vistaActual} cambiarVista={setVistaActual} />

      {/* Odontograma Completo - Layout tipo "Boca Abierta" */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        padding: '32px',
        marginBottom: '24px'
      }}>
        
        {/* Arcada Superior */}
        {(vistaActual === 'completo' || vistaActual === 'superior') && (
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '2px solid #e2e8f0'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '700',
                color: '#0f172a',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                ⬆️ Arcada Superior
              </h2>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '40px',
              flexWrap: 'wrap'
            }}>
              {/* Superior Derecho */}
              {(vistaActual === 'completo' || vistaActual === 'superior' || vistaActual === 'derecho') && (
                <ArcadaDental
                  dientes={getDientesCuadrante(odontograma, '1')}
                  onSeleccionar={handleSeleccionarDiente}
                  invertir={false}
                  etiqueta="Derecho"
                />
              )}
              {/* Superior Izquierdo */}
              {(vistaActual === 'completo' || vistaActual === 'superior' || vistaActual === 'izquierdo') && (
                <ArcadaDental
                  dientes={getDientesCuadrante(odontograma, '2')}
                  onSeleccionar={handleSeleccionarDiente}
                  invertir={true}
                  etiqueta="Izquierdo"
                />
              )}
            </div>
          </div>
        )}

        {/* Separador visual */}
        {vistaActual === 'completo' && (
          <div style={{
            position: 'relative',
            height: '30px',
            margin: '20px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '3px',
              background: 'linear-gradient(to right, transparent, #cbd5e1 20%, #cbd5e1 80%, transparent)',
              borderRadius: '2px'
            }} />
            <div style={{
              backgroundColor: 'white',
              padding: '6px 20px',
              borderRadius: '20px',
              border: '2px solid #cbd5e1',
              fontSize: '11px',
              fontWeight: '700',
              color: '#64748b',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              position: 'relative',
              zIndex: 1
            }}>
              ━━━ Línea de Mordida ━━━
            </div>
          </div>
        )}

        {/* Arcada Inferior */}
        {(vistaActual === 'completo' || vistaActual === 'inferior') && (
          <div>
            <div style={{
              textAlign: 'center',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '2px solid #e2e8f0'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '700',
                color: '#0f172a',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                ⬇️ Arcada Inferior
              </h2>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '40px',
              flexWrap: 'wrap'
            }}>
              {/* Inferior Derecho */}
              {(vistaActual === 'completo' || vistaActual === 'inferior' || vistaActual === 'derecho') && (
                <ArcadaDental
                  dientes={getDientesCuadrante(odontograma, '4')}
                  onSeleccionar={handleSeleccionarDiente}
                  invertir={false}
                  etiqueta="Derecho"
                />
              )}
              {/* Inferior Izquierdo */}
              {(vistaActual === 'completo' || vistaActual === 'inferior' || vistaActual === 'izquierdo') && (
                <ArcadaDental
                  dientes={getDientesCuadrante(odontograma, '3')}
                  onSeleccionar={handleSeleccionarDiente}
                  invertir={true}
                  etiqueta="Izquierdo"
                />
              )}
            </div>
          </div>
        )}

      </div>

      {/* Leyenda */}
      <LeyendaOdontograma />

      {/* Detalle del Diente Seleccionado */}
      {dienteSeleccionado && (
        <DetalleDiente
          diente={dienteSeleccionado}
          onCerrar={() => setDienteSeleccionado(null)}
        />
      )}

      </div>
    </div>
  );
}

// Helper: Obtiene dientes de un cuadrante
function getDientesCuadrante(odontograma: any, cuadrante: string): any[] {
  const dientes = [];
  for (let i = 1; i <= 8; i++) {
    const numero = `${cuadrante}${i}`;
    if (odontograma[numero]) {
      dientes.push(odontograma[numero]);
    }
  }
  return dientes;
}
