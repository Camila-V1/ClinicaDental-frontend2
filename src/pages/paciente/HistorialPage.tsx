import React, { useState, useEffect } from 'react';
import { ResumenHistorial } from '../../components/paciente/historial/ResumenHistorialPaciente';
import { ListaEpisodios } from '../../components/paciente/historial/ListaEpisodios';
import type { HistorialClinicoPaciente } from '../../services/historialService';
import { obtenerMiHistorial } from '../../services/historialService';
import { Activity, AlertCircle, FileText } from 'lucide-react';

export const HistorialPage: React.FC = () => {
  const [historial, setHistorial] = useState<HistorialClinicoPaciente | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await obtenerMiHistorial();
      setHistorial(data);
    } catch (err: any) {
      console.error('❌ Error al cargar historial:', err);
      setError(err.response?.data?.detail || 'Error al cargar el historial clínico');
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '60px 80px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <Activity size={40} strokeWidth={1.5} style={{ color: '#0d9488', margin: '0 auto 16px' }} className="animate-spin" />
          <p style={{ fontSize: '15px', color: '#64748b', fontWeight: '500' }}>Cargando historial clínico...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ backgroundColor: '#fee2e2', borderLeft: '3px solid #dc2626', borderRadius: '6px', padding: '24px', display: 'flex', alignItems: 'start', gap: '12px' }}>
          <AlertCircle size={24} strokeWidth={1.5} style={{ color: '#991b1b', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#991b1b', fontWeight: '600', marginBottom: '4px', fontSize: '16px' }}>Error al cargar historial</h3>
            <p style={{ color: '#dc2626', fontSize: '14px', marginBottom: '16px' }}>{error}</p>
            <button
              onClick={cargarHistorial}
              style={{
                padding: '10px 16px',
                backgroundColor: '#dc2626',
                color: 'white',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 150ms'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            >
              Intentar nuevamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!historial) {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ backgroundColor: '#fef3c7', borderLeft: '3px solid #f59e0b', borderRadius: '6px', padding: '24px', textAlign: 'center' }}>
          <AlertCircle size={24} strokeWidth={1.5} style={{ color: '#92400e', margin: '0 auto 8px' }} />
          <p style={{ color: '#92400e', fontSize: '14px' }}>No se encontró historial clínico</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 16px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <FileText size={28} strokeWidth={1.5} style={{ color: '#0d9488' }} />
        <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#0f172a', margin: 0 }}>
          Mi Historial Clínico
        </h1>
      </div>

      <div style={{ display: 'grid', gap: '24px' }}>
        {/* Resumen general */}
        <ResumenHistorial historial={historial} />

        {/* Lista de episodios */}
        <ListaEpisodios episodios={historial.episodios} />
      </div>
    </div>
  );
};
