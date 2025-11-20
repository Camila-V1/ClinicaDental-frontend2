/**
 * 📊 Componente KPICard - Tarjeta de indicador clave
 */

import React from 'react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  label: string;
  value: string | number;
  icon: keyof typeof Icons;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function KPICard({ 
  label, 
  value, 
  icon, 
  color = 'blue',
  trend 
}: KPICardProps) {
  const Icon = Icons[icon] as React.ElementType;

  const colorStyles = {
    blue: { bg: '#dbeafe', text: '#2563eb' },
    green: { bg: '#dcfce7', text: '#16a34a' },
    purple: { bg: '#f3e8ff', text: '#9333ea' },
    orange: { bg: '#ffedd5', text: '#ea580c' },
    red: { bg: '#fee2e2', text: '#dc2626' },
  };

  const currentStyle = colorStyles[color];

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '8px', 
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', 
      padding: '24px' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', margin: 0 }}>{label}</p>
          <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', marginTop: '8px', marginBottom: 0 }}>{value}</p>
          
          {trend && (
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '500',
                color: trend.isPositive ? '#16a34a' : '#dc2626'
              }}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>vs mes anterior</span>
            </div>
          )}
        </div>

        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: currentStyle.bg,
          color: currentStyle.text
        }}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
