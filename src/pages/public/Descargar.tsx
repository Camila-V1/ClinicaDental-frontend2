/**
 * 📥 PÁGINA DE DESCARGA - PWA Installer
 * Página dedicada para instalar la aplicación como PWA
 */

import { useState, useEffect } from 'react';
import { Download, Monitor, CheckCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function DescargarPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Detectar si la app ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Capturar el evento beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Detectar cuando se instala
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      toast.success('¡Aplicación instalada correctamente!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      toast.error('La instalación no está disponible en este momento');
      return;
    }

    // Mostrar el prompt de instalación
    deferredPrompt.prompt();

    // Esperar la respuesta del usuario
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      toast.success('¡Instalando aplicación!');
    } else {
      toast.error('Instalación cancelada');
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: 'white',
        borderRadius: '24px',
        padding: '48px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          margin: '0 auto 24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
        }}>
          <Monitor size={48} color="white" />
        </div>

        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '16px'
        }}>
          Instalar Clínica Dental
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          marginBottom: '32px',
          lineHeight: '1.6'
        }}>
          Instala nuestra aplicación en tu computadora para acceder más rápido
          y trabajar sin conexión cuando sea necesario.
        </p>

        {isInstalled ? (
          <div style={{
            background: '#d1fae5',
            border: '2px solid #10b981',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ color: '#065f46', fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
              ¡Ya está instalada!
            </h3>
            <p style={{ color: '#047857', fontSize: '14px' }}>
              La aplicación ya está instalada en tu dispositivo
            </p>
          </div>
        ) : isInstallable ? (
          <button
            onClick={handleInstall}
            style={{
              width: '100%',
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'transform 0.2s',
              marginBottom: '24px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Download size={24} />
            Instalar Aplicación
          </button>
        ) : (
          <div style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <Info size={48} color="#f59e0b" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ color: '#92400e', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              Instalación no disponible
            </h3>
            <p style={{ color: '#b45309', fontSize: '14px' }}>
              Esta función solo está disponible en navegadores compatibles (Chrome, Edge, Opera)
            </p>
          </div>
        )}

        <div style={{
          background: '#f3f4f6',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'left'
        }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#374151',
            marginBottom: '12px'
          }}>
            ✨ Beneficios de instalar:
          </h4>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0,
            fontSize: '14px',
            color: '#6b7280',
            lineHeight: '2'
          }}>
            <li>⚡ Acceso más rápido desde tu escritorio</li>
            <li>📴 Funciona sin conexión (algunas funciones)</li>
            <li>🔔 Recibe notificaciones importantes</li>
            <li>💾 Ocupa poco espacio en tu PC</li>
            <li>🔒 Datos seguros y encriptados</li>
          </ul>
        </div>

        <div style={{ marginTop: '24px' }}>
          <a 
            href="/"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
