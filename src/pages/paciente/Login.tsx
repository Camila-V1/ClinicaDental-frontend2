/**
 * LOGIN DEL PACIENTE - v0 Design
 * Formulario de autenticación específico para pacientes
 * Diseño profesional clínico
 */

import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Smile } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

const LoginPaciente = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    console.group('🔐 [LoginPaciente] Iniciando login');
    console.log('📧 Email:', email);

    try {
      const userData: any = await login({ email, password });
      
      console.log('✅ Login exitoso');
      console.log('👤 Usuario:', userData);
      console.log('🏷️ Tipo:', userData.tipo_usuario);

      // Validar que sea paciente
      if (userData.tipo_usuario !== 'PACIENTE') {
        console.error('❌ Usuario no es paciente:', userData.tipo_usuario);
        setError('Esta área es exclusiva para pacientes');
        setCargando(false);
        return;
      }

      console.log('✅ Validación exitosa - Redirigiendo a dashboard');
      navigate('/paciente/dashboard');
      
    } catch (err: any) {
      console.group('❌ Error en login');
      console.error('Error completo:', err);
      console.error('Response:', err.response?.data);
      console.groupEnd();
      
      const mensaje = err.response?.data?.detail || 
                      err.response?.data?.error || 
                      'Error al iniciar sesión. Verifica tus credenciales.';
      setError(mensaje);
    } finally {
      setCargando(false);
      console.groupEnd();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ marginBottom: '20px' }}>
            <Smile size={56} strokeWidth={1.5} style={{ color: '#0d9488', margin: '0 auto' }} />
          </div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#0f172a', fontWeight: '600' }}>
            Portal del Paciente
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '15px' }}>
            Accede a tu historial médico y citas
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#1e293b'
            }}>
              Correo Electrónico
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} strokeWidth={1.5} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                disabled={cargando}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  transition: 'all 150ms',
                  color: '#1e293b'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#0d9488';
                  e.currentTarget.style.outline = 'none';
                }}
                onBlur={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#1e293b'
            }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} strokeWidth={1.5} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                disabled={cargando}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  transition: 'all 150ms',
                  color: '#1e293b'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#0d9488';
                  e.currentTarget.style.outline = 'none';
                }}
                onBlur={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              padding: '12px 16px',
              marginBottom: '20px',
              color: '#991b1b',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={cargando}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: cargando ? '#94a3b8' : '#0d9488',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: cargando ? 'not-allowed' : 'pointer',
              transition: 'background-color 150ms',
              opacity: cargando ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!cargando) e.currentTarget.style.backgroundColor = '#0f766e';
            }}
            onMouseLeave={(e) => {
              if (!cargando) e.currentTarget.style.backgroundColor = '#0d9488';
            }}
          >
            {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: '28px',
          paddingTop: '28px',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center',
          fontSize: '14px',
          color: '#64748b'
        }}>
          <p style={{ margin: 0 }}>
            ¿Eres profesional de la salud?{' '}
            <a
              href="/login"
              style={{
                color: '#0d9488',
                textDecoration: 'none',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              Ingresa aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPaciente;
