/**
 * RESUMEN DEL HISTORIAL - v0 Design
 * Muestra un resumen rápido del historial clínico
 * Diseño profesional con colores slate/teal
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, Activity, DollarSign } from 'lucide-react';
import { obtenerPlanes } from '../../services/planesService';
import { obtenerEstadoCuenta } from '../../services/facturacionService';
import { obtenerMiHistorial } from '../../services/historialService';

interface ResumenData {
  ultimaConsulta: string | null;
  numDocumentos: number;
  numTratamientos: number;
  deudaTotal: string;
}

const ResumenHistorial = () => {
  const navigate = useNavigate();
  const [resumen, setResumen] = useState<ResumenData>({
    ultimaConsulta: null,
    numDocumentos: 0,
    numTratamientos: 0,
    deudaTotal: '$0.00'
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarResumen();
  }, []);

  const cargarResumen = async () => {
    console.log('📋 [ResumenHistorial] Cargando resumen...');
    setCargando(true);
    
    try {
      // Cargar historial, planes activos y estado de cuenta en paralelo
      const [historial, planes, estadoCuenta] = await Promise.all([
        obtenerMiHistorial().catch((err) => {
          console.warn('⚠️ Error obteniendo historial:', err);
          return { episodios: [], documentos: [] } as any;
        }),
        obtenerPlanes({ estado: 'en_progreso' }).catch((err) => {
          console.warn('⚠️ Error obteniendo planes:', err);
          return [];
        }),
        obtenerEstadoCuenta().catch((err) => {
          console.warn('⚠️ Error obteniendo estado de cuenta:', err);
          return { 
            saldo_pendiente: '$0.00',
            total_facturas: 0,
            facturas_pendientes: 0
          } as any;
        })
      ]);
      
      console.log('✅ Historial obtenido:', {
        episodios: historial.episodios?.length || 0,
        documentos: historial.documentos?.length || 0
      });
      console.log('✅ Planes activos:', planes.length);
      console.log('✅ Estado de cuenta:', estadoCuenta);
      
      // Obtener última consulta del primer episodio
      const ultimaConsulta = historial.episodios && historial.episodios.length > 0
        ? historial.episodios[0].fecha_atencion
        : null;
      
      setResumen({
        ultimaConsulta,
        numDocumentos: historial.documentos?.length || 0,
        numTratamientos: planes.length,
        deudaTotal: estadoCuenta.saldo_pendiente || '$0.00'
      });
      
      console.log('✅ [ResumenHistorial] Resumen actualizado:', {
        ultimaConsulta,
        numDocumentos: historial.documentos?.length || 0,
        numTratamientos: planes.length,
        deudaTotal: estadoCuenta.saldo_pendiente
      });
      
    } catch (error: any) {
      console.error('❌ Error cargando resumen:', error);
      // Mostrar valores por defecto en caso de error
      setResumen({
        ultimaConsulta: null,
        numDocumentos: 0,
        numTratamientos: 0,
        deudaTotal: '$0.00'
      });
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    const opciones: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px', fontWeight: '600' }}>
          Resumen Clínico
        </h3>
        <button
          onClick={() => navigate('/paciente/historial')}
          style={{
            padding: '6px 12px',
            backgroundColor: 'white',
            color: '#475569',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '13px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 150ms'
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
          Ver completo
        </button>
      </div>

      {cargando ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
          Cargando resumen...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Última consulta */}
          <div style={{
            padding: '14px',
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Calendar size={20} strokeWidth={1.5} style={{ color: '#0d9488' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                Última consulta
              </div>
              <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>
                {resumen.ultimaConsulta 
                  ? formatearFecha(resumen.ultimaConsulta)
                  : 'No hay registros'
                }
              </div>
            </div>
          </div>

          {/* Documentos */}
          <div 
            style={{
              padding: '14px',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 150ms',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
            onClick={() => navigate('/paciente/documentos')}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <FileText size={20} strokeWidth={1.5} style={{ color: '#64748b' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                Documentos clínicos
              </div>
              <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>
                {resumen.numDocumentos} archivo{resumen.numDocumentos !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Tratamientos activos */}
          <div 
            style={{
              padding: '14px',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 150ms',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
            onClick={() => navigate('/paciente/planes')}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <Activity size={20} strokeWidth={1.5} style={{ color: '#64748b' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                Tratamientos activos
              </div>
              <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>
                {resumen.numTratamientos} plan{resumen.numTratamientos !== 1 ? 'es' : ''}
              </div>
            </div>
          </div>

          {/* Saldo pendiente */}
          <div 
            style={{
              padding: '14px',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: `1px solid ${resumen.deudaTotal !== '$0.00' ? '#fecaca' : '#e2e8f0'}`,
              cursor: 'pointer',
              transition: 'all 150ms',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
            onClick={() => navigate('/paciente/facturas')}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = resumen.deudaTotal !== '$0.00' ? '#fca5a5' : '#cbd5e1';
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = resumen.deudaTotal !== '$0.00' ? '#fecaca' : '#e2e8f0';
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <DollarSign size={20} strokeWidth={1.5} style={{ color: resumen.deudaTotal !== '$0.00' ? '#dc2626' : '#64748b' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                Saldo pendiente
              </div>
              <div style={{ fontSize: '14px', color: resumen.deudaTotal !== '$0.00' ? '#dc2626' : '#0f172a', fontWeight: '600' }}>
                {resumen.deudaTotal}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumenHistorial;
