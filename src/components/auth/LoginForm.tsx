/**
 * 🔑 LOGIN FORM - Formulario de inicio de sesión
 * Basado en: GUIA_FRONT/01d_componentes_auth.md
 */

import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { Smile, Mail, Lock } from 'lucide-react';

function LoginForm() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const result = await login(credentials);
      if (result.success) {
        let dashboardUrl = '/dashboard';
        if (result.user?.tipo_usuario === 'PACIENTE') {
          dashboardUrl = '/paciente/dashboard';
        } else if (result.user?.tipo_usuario === 'ODONTOLOGO') {
          dashboardUrl = '/dashboard';
        } else if (result.user?.tipo_usuario === 'ADMIN') {
          dashboardUrl = '/dashboard';
        }
        navigate(dashboardUrl, { replace: true });
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    }
    setIsLoading(false);
  };
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ marginBottom: '20px' }}>
            <Smile size={56} strokeWidth={1.5} style={{ color: '#0d9488', margin: '0 auto' }} />
          </div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#0f172a', fontWeight: '600' }}>
            Clínica Dental
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '15px' }}>
            Inicia sesión en tu cuenta
          </p>
        </div>

        {/* Error Alert */}
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
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
                disabled={isLoading}
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
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#0d9488';
                  e.currentTarget.style.outline = 'none';
                }}
                onBlur={e => e.currentTarget.style.borderColor = '#cbd5e1'}
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
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                disabled={isLoading}
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
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#0d9488';
                  e.currentTarget.style.outline = 'none';
                }}
                onBlur={e => e.currentTarget.style.borderColor = '#cbd5e1'}
              />
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: isLoading ? '#94a3b8' : '#0d9488',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 150ms',
              opacity: isLoading ? 0.7 : 1
            }}
            onMouseEnter={e => {
              if (!isLoading) e.currentTarget.style.backgroundColor = '#0f766e';
            }}
            onMouseLeave={e => {
              if (!isLoading) e.currentTarget.style.backgroundColor = '#0d9488';
            }}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Register Link */}
        <div style={{
          marginTop: '28px',
          paddingTop: '28px',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center',
          fontSize: '14px',
          color: '#64748b'
        }}>
          <p style={{ margin: 0 }}>
            ¿No tienes una cuenta?{' '}
            <Link to="/register" style={{
              color: '#0d9488',
              textDecoration: 'none',
              fontWeight: '500'
            }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
            >
// Eliminar duplicado de cierre, solo debe haber un cierre de JSX
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
