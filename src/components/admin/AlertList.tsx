/**
 * ⚠️ Componente AlertList - Lista de alertas
 */

import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Alerta } from '@/types/admin';

interface AlertListProps {
  alerts: Alerta[];
}

export default function AlertList({ alerts }: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#6b7280', padding: '32px 0' }}>
        <CheckCircle size={48} style={{ margin: '0 auto 8px auto', color: '#22c55e' }} />
        <p style={{ margin: 0 }}>No hay alertas pendientes</p>
      </div>
    );
  }

  const getIcon = (type: Alerta['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle size={20} style={{ color: '#dc2626' }} />;
      case 'warning':
        return <AlertCircle size={20} style={{ color: '#ea580c' }} />;
      case 'info':
        return <Info size={20} style={{ color: '#2563eb' }} />;
      case 'success':
        return <CheckCircle size={20} style={{ color: '#16a34a' }} />;
    }
  };

  const getStyles = (type: Alerta['type']) => {
    switch (type) {
      case 'error': return { bg: '#fef2f2', border: '#fecaca' };
      case 'warning': return { bg: '#fff7ed', border: '#fed7aa' };
      case 'info': return { bg: '#eff6ff', border: '#bfdbfe' };
      case 'success': return { bg: '#f0fdf4', border: '#bbf7d0' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {alerts.map((alert, index) => {
        const styles = getStyles(alert.type);
        return (
          <div 
            key={index} 
            style={{
              padding: '16px',
              borderRadius: '8px',
              border: `1px solid ${styles.border}`,
              backgroundColor: styles.bg
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              {getIcon(alert.type)}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: '600', color: '#111827', margin: 0 }}>{alert.title}</h3>
                <p style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px', marginBottom: 0 }}>{alert.message}</p>
                {alert.link && (
                  <Link 
                    to={alert.link}
                    style={{
                      fontSize: '14px',
                      color: '#2563eb',
                      textDecoration: 'none',
                      marginTop: '8px',
                      display: 'inline-block'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    Ver detalles →
                  </Link>
                )}
              </div>
              {alert.count !== undefined && (
                <span style={{
                  backgroundColor: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {alert.count}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
