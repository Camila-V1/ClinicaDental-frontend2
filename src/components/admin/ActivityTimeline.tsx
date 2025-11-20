/**
 * 📜 Componente ActivityTimeline - Timeline de actividad
 */

import React from 'react';
import { Calendar, User, FileText, DollarSign, Clock } from 'lucide-react';
import { timeAgo } from '@/lib/utils';
import type { EventoBitacora } from '@/types/admin';

interface ActivityTimelineProps {
  activities: EventoBitacora[];
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Clock className="w-12 h-12 mx-auto mb-2" />
        <p>No hay actividad reciente</p>
      </div>
    );
  }

  const getIcon = (accion: string) => {
    if (accion.includes('Cita')) return Calendar;
    if (accion.includes('Usuario') || accion.includes('Paciente')) return User;
    if (accion.includes('Factura') || accion.includes('Pago')) return DollarSign;
    return FileText;
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = getIcon(activity.accion_display);
        
        return (
          <div key={activity.id} className="flex gap-4">
            {/* Icono */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            {/* Contenido */}
            <div className="flex-1 pb-4 border-b border-gray-100 last:border-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{activity.descripcion}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Por: {activity.usuario_nombre}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {timeAgo(activity.fecha_hora)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
