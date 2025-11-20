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

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          
          {trend && (
            <div className="flex items-center mt-2">
              <span className={cn(
                'text-sm font-medium',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs mes anterior</span>
            </div>
          )}
        </div>

        <div className={cn(
          'w-12 h-12 rounded-lg flex items-center justify-center',
          colorClasses[color]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
