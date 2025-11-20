/**
 * 🐛 Componente de Debug para Multi-Tenancy
 * Muestra información del tenant actual en desarrollo
 * 
 * Uso:
 * import { TenantDebugInfo } from './components/TenantDebugInfo';
 * 
 * // En tu App.tsx o layout principal:
 * {import.meta.env.DEV && <TenantDebugInfo />}
 */

import { useEffect, useState } from 'react';
import { getTenantInfo } from '../config/tenantConfig';

export function TenantDebugInfo() {
  const [tenantInfo, setTenantInfo] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Solo en desarrollo
    if (import.meta.env.DEV) {
      const info = getTenantInfo();
      setTenantInfo(info);
      console.log('🏥 Información del Tenant:', info);
    }
  }, []);

  if (!import.meta.env.DEV || !tenantInfo) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      zIndex: 9999,
    }}>
      {/* Botón toggle */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        style={{
          padding: '8px 12px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold',
        }}
      >
        🏥 Tenant Info
      </button>

      {/* Panel de información */}
      {isVisible && (
        <div style={{
          position: 'absolute',
          bottom: 40,
          right: 0,
          background: 'white',
          border: '2px solid #4CAF50',
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          minWidth: '300px',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#4CAF50' }}>
            🏥 Multi-Tenant Debug Info
          </h4>
          
          <div style={{ marginBottom: '10px' }}>
            <strong>Tenant ID:</strong>
            <div style={{ 
              background: '#f0f0f0', 
              padding: '5px', 
              borderRadius: '4px',
              marginTop: '3px',
            }}>
              {tenantInfo.tenantId}
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <strong>Subdominio:</strong>
            <div style={{ 
              background: '#f0f0f0', 
              padding: '5px', 
              borderRadius: '4px',
              marginTop: '3px',
            }}>
              {tenantInfo.subdomain}
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <strong>Nombre Clínica:</strong>
            <div style={{ 
              background: '#f0f0f0', 
              padding: '5px', 
              borderRadius: '4px',
              marginTop: '3px',
            }}>
              {tenantInfo.tenantName}
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <strong>API Base URL:</strong>
            <div style={{ 
              background: '#f0f0f0', 
              padding: '5px', 
              borderRadius: '4px',
              marginTop: '3px',
              wordBreak: 'break-all',
            }}>
              {tenantInfo.apiBaseUrl}
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <strong>Hostname:</strong>
            <div style={{ 
              background: '#f0f0f0', 
              padding: '5px', 
              borderRadius: '4px',
              marginTop: '3px',
            }}>
              {tenantInfo.hostname}
            </div>
          </div>

          <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #ddd' }}>
            <small style={{ color: '#666' }}>
              💡 Este panel solo es visible en modo desarrollo
            </small>
          </div>
        </div>
      )}
    </div>
  );
}
