/**
 * 🏢 Información del Tenant
 */

import React from 'react';
import type { TenantInfo as TenantInfoType } from '@/services/configuracionService';
import { useAuth } from '@/context/AuthContext';

interface TenantInfoProps {
  tenant: TenantInfoType;
}

export default function TenantInfo({ tenant }: TenantInfoProps) {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Información del Tenant */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
          Información de la Clínica
        </h2>

        <div style={{ display: 'grid', gap: '16px' }}>
          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Subdominio</p>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>
              {tenant.subdomain}
            </p>
          </div>

          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Schema</p>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>
              {tenant.schema_name}
            </p>
          </div>

          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Nombre</p>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>
              {tenant.nombre}
            </p>
          </div>

          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Estado</p>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                backgroundColor: tenant.activo ? '#d1fae5' : '#fee2e2',
                color: tenant.activo ? '#065f46' : '#991b1b',
                border: tenant.activo ? '1px solid #86efac' : '1px solid #fca5a5',
              }}
            >
              {tenant.activo ? '✅ Activo' : '❌ Inactivo'}
            </span>
          </div>
        </div>
      </div>

      {/* Información del Usuario Actual */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
          Información del Usuario Actual
        </h2>

        <div style={{ display: 'grid', gap: '16px' }}>
          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Nombre Completo</p>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>
              {user ? `${user.nombre} ${user.apellido}` : 'N/A'}
            </p>
          </div>

          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Email</p>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>
              {user?.email || 'N/A'}
            </p>
          </div>

          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Rol</p>
            <span
              style={{
                display: 'inline-block',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                backgroundColor: '#e0e7ff',
                color: '#3730a3',
                border: '1px solid #c7d2fe',
              }}
            >
              {user?.tipo_usuario || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Información del Sistema */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
          Información del Sistema
        </h2>

        <div style={{ display: 'grid', gap: '16px' }}>
          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Navegador</p>
            <p style={{ fontSize: '14px', color: '#111827', margin: 0 }}>
              {navigator.userAgent}
            </p>
          </div>

          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Idioma</p>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>
              {navigator.language}
            </p>
          </div>

          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>URL Actual</p>
            <p style={{ fontSize: '14px', color: '#111827', margin: 0, wordBreak: 'break-all' }}>
              {window.location.href}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
