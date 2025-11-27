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
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'teal' | 'cyan' | 'yellow' | 'lime';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  prefix?: string;
  format?: 'currency' | 'number';
}

export default function KPICard({ 
  label, 
  value, 
  icon, 
  color = 'blue',
  trend,
  prefix = '',
  format = 'number'
}: KPICardProps) {
  const Icon = Icons[icon] as React.ElementType;

  const colorStyles = {
    blue: { bg: '#dbeafe', text: '#2563eb' },
    green: { bg: '#dcfce7', text: '#16a34a' },
    purple: { bg: '#f3e8ff', text: '#9333ea' },
    orange: { bg: '#ffedd5', text: '#ea580c' },
    red: { bg: '#fee2e2', text: '#dc2626' },
    indigo: { bg: '#e0e7ff', text: '#4f46e5' },
    teal: { bg: '#ccfbf1', text: '#0d9488' },
    cyan: { bg: '#cffafe', text: '#0891b2' },
    yellow: { bg: '#fef9c3', text: '#ca8a04' },
    lime: { bg: '#ecfccb', text: '#65a30d' },
  };

  const currentStyle = colorStyles[color];

  // Formatear el valor
  const formatValue = (val: string | number): string => {
    const numVal = typeof val === 'string' ? parseFloat(val) : val;
    
    if (format === 'currency') {
      return prefix + numVal.toFixed(2);
    }
    
    return prefix + numVal.toString();
  };

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
          <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', marginTop: '8px', marginBottom: 0 }}>
            {formatValue(value)}
          </p>
          
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
