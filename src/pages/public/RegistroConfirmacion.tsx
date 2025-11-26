/**
 * ✅ CONFIRMACIÓN DE PAGO - Registro de Clínica
 * Guía 46: Verificación de pago y descarga de credenciales
 */

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import registroService, { EstadoSolicitud } from '@/services/registroService';
import toast from 'react-hot-toast';

export default function RegistroConfirmacion() {
  const { solicitudId } = useParams<{ solicitudId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [estado, setEstado] = useState<EstadoSolicitud | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [descargando, setDescargando] = useState(false);

  useEffect(() => {
    verificarPago();
  }, []);

  const verificarPago = async () => {
    const sessionId = searchParams.get('session_id') || searchParams.get('payment_id');
    
    if (!solicitudId) {
      setError('No se encontró el ID de solicitud');
      setLoading(false);
      return;
    }

    try {
      // Confirmar pago
      await registroService.confirmarPago(Number(solicitudId), sessionId || undefined);

      // Verificar estado
      const estadoActual = await registroService.verificarEstado(Number(solicitudId));
      setEstado(estadoActual);

      if (estadoActual.pago_exitoso) {
        toast.success('¡Pago procesado exitosamente!');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Error verificando pago';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDescargar = async () => {
    if (!estado?.token || !solicitudId) return;

    setDescargando(true);
    try {
      const blob = await registroService.descargarCredenciales(Number(solicitudId), estado.token);

      // Crear link de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fecha = new Date().toISOString().split('T')[0].replace(/-/g, '');
      link.download = `credenciales_${estado.dominio}_${fecha}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('✅ Credenciales descargadas');
    } catch (error) {
      toast.error('Error descargando credenciales');
    } finally {
      setDescargando(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            border: '4px solid #e5e7eb', 
            borderTop: '4px solid #3b82f6', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Verificando pago y creando tu clínica...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', padding: '40px 16px', background: '#f9fafb' }}>
        <div style={{ maxWidth: '600px', margin: '80px auto', padding: '32px', background: '#fee2e2', border: '2px solid #fecaca', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#991b1b', marginBottom: '12px' }}>
            ⚠️ Error
          </h2>
          <p style={{ color: '#dc2626', marginBottom: '24px' }}>{error}</p>
          <button
            onClick={() => navigate('/registro')}
            style={{
              width: '100%',
              padding: '12px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Volver al Registro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px 16px', background: 'linear-gradient(135deg, #dbeafe 0%, #f0fdf4 100%)' }}>
      <div style={{ maxWidth: '700px', margin: '40px auto' }}>
        {/* Header de Éxito */}
        <div style={{ 
          background: '#f0fdf4', 
          border: '2px solid #86efac', 
          borderRadius: '16px', 
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: '#22c55e',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px'
            }}>
              <svg style={{ width: '40px', height: '40px', color: 'white' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#065f46', margin: '0 0 8px 0' }}>
                ¡Pago Exitoso!
              </h2>
              <p style={{ fontSize: '16px', color: '#059669', margin: 0 }}>
                Tu clínica ha sido creada automáticamente
              </p>
            </div>
          </div>

          <div style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '12px', 
            border: '1px solid #d1fae5'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#065f46', marginBottom: '16px' }}>
              📋 Detalles de la Clínica
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>Clínica:</span>
                <strong style={{ color: '#111827', fontSize: '14px' }}>{estado?.clinica_nombre}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>Dominio:</span>
                <strong style={{ color: '#111827', fontSize: '14px' }}>{estado?.dominio}.clinica.com</strong>
              </div>
              {estado?.fecha_pago && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Fecha de pago:</span>
                  <strong style={{ color: '#111827', fontSize: '14px' }}>
                    {new Date(estado.fecha_pago).toLocaleString('es-ES')}
                  </strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Descarga de Credenciales */}
        {estado?.credenciales_disponibles && (
          <div style={{ 
            background: 'white', 
            border: '2px solid #93c5fd', 
            borderRadius: '16px', 
            padding: '32px',
            marginBottom: '24px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1e40af' }}>
              📥 Descarga tus Credenciales
            </h3>
            <p style={{ color: '#4b5563', marginBottom: '20px', lineHeight: '1.6' }}>
              Hemos generado automáticamente un usuario administrador con una contraseña segura.
              Descarga el archivo TXT con tus credenciales de acceso.
            </p>
            
            <button
              onClick={handleDescargar}
              disabled={descargando}
              style={{
                width: '100%',
                padding: '16px',
                background: descargando ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: descargando ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                transition: 'all 0.2s'
              }}
            >
              <svg style={{ width: '24px', height: '24px' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              {descargando ? 'Descargando...' : 'Descargar Credenciales (TXT)'}
            </button>

            <div style={{ 
              marginTop: '20px', 
              padding: '16px', 
              background: '#fef3c7', 
              border: '1px solid #fbbf24', 
              borderRadius: '8px'
            }}>
              <p style={{ fontSize: '14px', color: '#92400e', margin: 0, lineHeight: '1.6' }}>
                ⚠️ <strong>Importante:</strong> Guarda este archivo en un lugar seguro y cambia la contraseña
                después del primer inicio de sesión. El enlace de descarga es válido por 7 días.
              </p>
            </div>
          </div>
        )}

        {/* Siguiente Paso */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '14px' }}>
            También recibirás un email con el enlace de descarga y más información.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '14px 32px',
              background: 'white',
              color: '#3b82f6',
              border: '2px solid #3b82f6',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Ir al Inicio de Sesión →
          </button>
        </div>
      </div>
    </div>
  );
}
