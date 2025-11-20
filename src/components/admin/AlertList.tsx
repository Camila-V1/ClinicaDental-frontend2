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
      <div className="text-center text-gray-500 py-8">
        <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
        <p>No hay alertas pendientes</p>
      </div>
    );
  }

  const getIcon = (type: Alerta['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const getBgColor = (type: Alerta['type']) => {
    switch (type) {
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-orange-50 border-orange-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      case 'success': return 'bg-green-50 border-green-200';
    }
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <div 
          key={index} 
          className={`p-4 rounded-lg border ${getBgColor(alert.type)}`}
        >
          <div className="flex items-start gap-3">
            {getIcon(alert.type)}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{alert.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
              {alert.link && (
                <Link 
                  to={alert.link}
                  className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                >
                  Ver detalles →
                </Link>
              )}
            </div>
            {alert.count !== undefined && (
              <span className="bg-white px-2 py-1 rounded text-sm font-semibold">
                {alert.count}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
