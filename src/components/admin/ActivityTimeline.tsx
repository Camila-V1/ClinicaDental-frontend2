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
      <div style={{ textAlign: 'center', color: '#6b7280', padding: '32px 0' }}>
        <Clock size={48} style={{ margin: '0 auto 8px auto', color: '#9ca3af' }} />
        <p style={{ margin: 0 }}>No hay actividad reciente</p>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {activities.map((activity, index) => {
        const Icon = getIcon(activity.accion_display);
        const isLast = index === activities.length - 1;
        
        return (
          <div key={activity.id} style={{ display: 'flex', gap: '16px' }}>
            {/* Icono */}
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={20} style={{ color: '#2563eb' }} />
              </div>
            </div>

            {/* Contenido */}
            <div style={{
              flex: 1,
              paddingBottom: '16px',
              borderBottom: isLast ? 'none' : '1px solid #f3f4f6'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontWeight: '500', color: '#111827', margin: 0 }}>{activity.descripcion}</p>
                  <p style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px', margin: 0 }}>
                    Por: {activity.usuario_nombre}
                  </p>
                </div>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
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
