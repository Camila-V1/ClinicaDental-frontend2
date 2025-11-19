/**
 * PERFIL DEL PACIENTE - v0 Design
 * Visualización de datos personales y médicos (solo lectura)
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, AlertCircle, Pill, FileText, ArrowLeft } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

interface PerfilPaciente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  ci?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  direccion?: string;
  alergias?: string;
  medicamentos_actuales?: string;
  antecedentes_medicos?: string;
}

const PerfilPaciente = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [perfil, setPerfil] = useState<PerfilPaciente | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    console.log('👤 [Perfil] Cargando datos del perfil desde AuthContext...');
    setCargando(true);

    try {
      // ✅ Usar datos del usuario autenticado desde AuthContext
      if (user) {
        setPerfil({
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          ci: user.ci || undefined,
          telefono: user.telefono || undefined,
          fecha_nacimiento: undefined,
          direccion: user.direccion || undefined,
          alergias: undefined,
          medicamentos_actuales: undefined,
          antecedentes_medicos: undefined
        });
        console.log('✅ Perfil cargado:', { nombre: user.nombre, apellido: user.apellido });
      } else {
        throw new Error('Usuario no autenticado');
      }
    } catch (error) {
      console.error('❌ Error cargando perfil:', error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '24px' }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          border: '1px solid #e2e8f0',
          padding: '80px', 
          textAlign: 'center' 
        }}>
          <User size={48} strokeWidth={1.5} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
          <p style={{ fontSize: '15px', color: '#94a3b8' }}>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '24px' }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          border: '1px solid #e2e8f0',
          padding: '80px', 
          textAlign: 'center' 
        }}>
          <AlertCircle size={48} strokeWidth={1.5} style={{ color: '#ef4444', margin: '0 auto 16px' }} />
          <p style={{ fontSize: '15px', color: '#94a3b8' }}>Error al cargar el perfil</p>
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
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <User size={28} strokeWidth={1.5} style={{ color: '#0d9488' }} />
          <h1 style={{ margin: 0, fontSize: '28px', color: '#0f172a', fontWeight: '600' }}>
            Mi Perfil
          </h1>
        </div>
        <button
          onClick={() => navigate('/paciente/dashboard')}
          style={{
            padding: '10px 20px',
            backgroundColor: 'white',
            border: '1px solid #cbd5e1',
            color: '#475569',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
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
          <ArrowLeft size={18} strokeWidth={1.5} />
          Volver
        </button>
      </div>

      {/* Contenido */}
      <div style={{ padding: '32px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Información Personal */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            transition: 'border-color 150ms'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <FileText size={20} strokeWidth={1.5} style={{ color: '#0d9488' }} />
              <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: '600' }}>
                Información Personal
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Campo label="Nombre" valor={perfil.nombre} />
              <Campo label="Apellido" valor={perfil.apellido} />
              <Campo label="Email" valor={perfil.email} />
              <Campo label="Cédula" valor={perfil.ci} />
              <Campo label="Teléfono" valor={perfil.telefono} />
              <Campo label="Fecha de Nacimiento" valor={perfil.fecha_nacimiento} />
            </div>

            <div style={{ marginTop: '16px' }}>
              <Campo label="Dirección" valor={perfil.direccion} fullWidth />
            </div>
          </div>

          {/* Información Médica */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            transition: 'border-color 150ms'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Pill size={20} strokeWidth={1.5} style={{ color: '#0d9488' }} />
              <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: '600' }}>
                Información Médica
              </h2>
            </div>

            <Campo
              label="Alergias"
              valor={perfil.alergias}
              fullWidth
              destacado
              colorDestacado="#fef3c7"
            />

            <Campo
              label="Medicamentos Actuales"
              valor={perfil.medicamentos_actuales}
              fullWidth
              style={{ marginTop: '16px' }}
            />

            <Campo
              label="Antecedentes Médicos"
              valor={perfil.antecedentes_medicos}
              fullWidth
              multiline
              style={{ marginTop: '16px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para mostrar campos
interface CampoProps {
  label: string;
  valor?: string;
  fullWidth?: boolean;
  destacado?: boolean;
  colorDestacado?: string;
  multiline?: boolean;
  style?: React.CSSProperties;
}

const Campo = ({ label, valor, fullWidth, destacado, colorDestacado, multiline, style }: CampoProps) => (
  <div style={fullWidth ? { gridColumn: '1 / -1', ...style } : style}>
    <label style={{
      display: 'block',
      fontSize: '13px',
      fontWeight: '500',
      color: '#475569',
      marginBottom: '8px',
      letterSpacing: '0.3px'
    }}>
      {label}
    </label>
    <div style={{
      padding: '12px 16px',
      backgroundColor: destacado ? colorDestacado : '#f8fafc',
      borderRadius: '6px',
      border: destacado ? '1px solid #f59e0b' : '1px solid #e2e8f0',
      color: '#1e293b',
      minHeight: multiline ? '80px' : 'auto',
      whiteSpace: multiline ? 'pre-wrap' : 'normal',
      fontSize: '14px',
      lineHeight: '1.6',
      transition: 'all 150ms'
    }}>
      {valor || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No especificado</span>}
    </div>
  </div>
);

export default PerfilPaciente;
