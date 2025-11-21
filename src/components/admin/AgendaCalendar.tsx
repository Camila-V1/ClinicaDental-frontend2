/**
 * 📅 Calendario Simple de Agenda (Admin)
 */

import React from 'react';
import { Loader } from 'lucide-react';
import type { Cita } from '@/services/agendaService';

interface AgendaCalendarProps {
  citas: Cita[];
  isLoading: boolean;
  onSelectCita: (cita: Cita) => void;
  onAtender: (citaId: number) => void;
  onCancelar: (citaId: number) => void;
}

export default function AgendaCalendar({
  citas,
  isLoading,
  onSelectCita,
  onAtender,
  onCancelar
}: AgendaCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Días del mes anterior
    for (let i = startingDayOfWeek; i > 0; i--) {
      const day = new Date(year, month, -i + 1);
      days.push({ date: day, isCurrentMonth: false });
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      days.push({ date: dayDate, isCurrentMonth: true });
    }
    
    // Completar la última semana
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const dayDate = new Date(year, month + 1, day);
      days.push({ date: dayDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const getCitasForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return citas.filter(cita => {
      const citaDate = new Date(cita.fecha_hora).toISOString().split('T')[0];
      return citaDate === dateStr;
    });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return '#f59e0b';
      case 'CONFIRMADA': return '#3b82f6';
      case 'ATENDIDA':
      case 'COMPLETADA': return '#10b981';
      case 'CANCELADA': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const monthDays = getDaysInMonth(currentDate);
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  if (isLoading) {
    return (
      <div style={{ padding: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: '#2563eb' }} />
      </div>
    );
  }

  return (
    <div>
      {/* Controles del calendario */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigateMonth(-1)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              backgroundColor: 'white',
              color: '#374151',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            ← Anterior
          </button>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              backgroundColor: 'white',
              color: '#374151',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Siguiente →
          </button>
        </div>
        
        <button 
          onClick={() => setCurrentDate(new Date())}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            backgroundColor: 'white',
            color: '#374151',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Hoy
        </button>
      </div>

      {/* Calendario */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        {/* Días de la semana */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>
              {day}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {monthDays.map((day, index) => {
            const dayCitas = getCitasForDate(day.date);
            const isToday = day.date.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                style={{
                  minHeight: '100px',
                  padding: '8px',
                  borderRight: index % 7 !== 6 ? '1px solid #f3f4f6' : 'none',
                  borderBottom: index < 35 ? '1px solid #f3f4f6' : 'none',
                  backgroundColor: !day.isCurrentMonth ? '#fafafa' : isToday ? '#eff6ff' : 'white',
                  cursor: 'pointer'
                }}
              >
                <div style={{ 
                  fontSize: '13px', 
                  fontWeight: isToday ? '600' : '500', 
                  color: !day.isCurrentMonth ? '#d1d5db' : isToday ? '#2563eb' : '#374151',
                  marginBottom: '4px'
                }}>
                  {day.date.getDate()}
                </div>
                
                {/* Citas del día */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {dayCitas.slice(0, 3).map((cita) => (
                    <div
                      key={cita.id}
                      onClick={() => onSelectCita(cita)}
                      style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: getEstadoColor(cita.estado),
                        color: 'white',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={`${new Date(cita.fecha_hora).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })} - ${cita.paciente_nombre}`}
                    >
                      {new Date(cita.fecha_hora).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })} {cita.paciente_nombre}
                    </div>
                  ))}
                  
                  {dayCitas.length > 3 && (
                    <div style={{ fontSize: '11px', color: '#6b7280', textAlign: 'center', padding: '2px' }}>
                      +{dayCitas.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
