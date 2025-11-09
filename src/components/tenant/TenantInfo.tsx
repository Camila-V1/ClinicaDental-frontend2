/**
 * 🏢 TENANT INFO - Componente que muestra información del tenant actual
 */

import { useTenant } from '../../context/TenantContext';

interface TenantInfoProps {
  showDetails?: boolean;
}

export default function TenantInfo({ showDetails = false }: TenantInfoProps) {
  const { tenant, isPublic, apiBaseUrl } = useTenant();

  if (!showDetails) {
    return (
      <div style={{
        display: 'inline-block',
        padding: '6px 12px',
        backgroundColor: isPublic ? '#f0f0f0' : '#e3f2fd',
        border: `2px solid ${isPublic ? '#bdbdbd' : '#2196f3'}`,
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        color: isPublic ? '#666' : '#1976d2'
      }}>
        {isPublic ? '🌐 Schema Público' : `🏢 ${tenant}`}
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '20px'
    }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#333' }}>
        ℹ️ Información del Tenant
      </h4>
      <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.8' }}>
        <div><strong>Tenant:</strong> {isPublic ? 'Público (Admin)' : tenant}</div>
        <div><strong>Schema:</strong> {isPublic ? 'public' : tenant.replace('-', '_')}</div>
        <div><strong>API URL:</strong> {apiBaseUrl}</div>
        <div><strong>Hostname:</strong> {window.location.hostname}</div>
      </div>
    </div>
  );
}
