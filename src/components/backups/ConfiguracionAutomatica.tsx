/**
 * ⏰ Configuración de Backups Automáticos
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import backupService from '@/services/backupService';

export default function ConfiguracionAutomatica() {
  const queryClient = useQueryClient();
  
  const [schedule, setSchedule] = useState('disabled');
  const [hora, setHora] = useState('02:00');
  const [diaSemana, setDiaSemana] = useState(0);
  const [diaMes, setDiaMes] = useState(1);
  const [fechaProgramada, setFechaProgramada] = useState('');
  const [horaProgramada, setHoraProgramada] = useState('02:00');

  // Obtener configuración actual
  const { data: config, isLoading } = useQuery({
    queryKey: ['backup-config'],
    queryFn: () => backupService.getConfiguracion(),
  });

  // Actualizar estado cuando se carga la config
  useEffect(() => {
    if (config) {
      setSchedule(config.backup_schedule || 'disabled');
      // Aquí podrías parsear otros campos si el backend los devuelve
    }
  }, [config]);

  // Mutación para actualizar configuración
  const mutation = useMutation({
    mutationFn: (newConfig: any) => backupService.actualizarConfiguracion(newConfig),
    onSuccess: () => {
      toast.success('✅ Configuración actualizada');
      queryClient.invalidateQueries({ queryKey: ['backup-config'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar configuración');
    },
  });

  const handleGuardar = () => {
    const configData: any = {
      backup_schedule: schedule,
    };

    // Agregar campos según el tipo de schedule
    if (schedule === 'daily' || schedule === 'every_12h' || schedule === 'every_6h') {
      configData.backup_time = hora + ':00';
    } else if (schedule === 'weekly') {
      configData.backup_time = hora + ':00';
      configData.backup_weekday = diaSemana;
    } else if (schedule === 'monthly') {
      configData.backup_time = hora + ':00';
      configData.backup_day_of_month = diaMes;
    } else if (schedule === 'scheduled') {
      configData.next_scheduled_backup = `${fechaProgramada}T${horaProgramada}:00`;
    }

    mutation.mutate(configData);
  };

  if (isLoading) {
    return (
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
        <p style={{ color: '#6b7280' }}>Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
          ⏰ Backups Automáticos
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          Configura la frecuencia de backups automáticos
        </p>
      </div>

      {/* Estado actual */}
      {config?.last_backup_at && (
        <div style={{ padding: '12px 16px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ fontSize: '13px', color: '#166534', margin: 0 }}>
            <strong>Último backup:</strong> {new Date(config.last_backup_at).toLocaleString('es-ES')}
          </p>
        </div>
      )}

      {config?.next_scheduled_backup && schedule === 'scheduled' && (
        <div style={{ padding: '12px 16px', background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ fontSize: '13px', color: '#1e40af', margin: 0 }}>
            <strong>Próximo backup programado:</strong> {new Date(config.next_scheduled_backup).toLocaleString('es-ES')}
          </p>
        </div>
      )}

      {/* Selector de frecuencia */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>
          Frecuencia *
        </label>
        <select
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#111827',
            backgroundColor: 'white',
            outline: 'none',
          }}
        >
          <option value="disabled">🚫 Desactivado</option>
          <option value="daily">📅 Diario</option>
          <option value="every_12h">🕐 Cada 12 horas</option>
          <option value="every_6h">⏰ Cada 6 horas</option>
          <option value="weekly">📆 Semanal</option>
          <option value="monthly">📊 Mensual</option>
          <option value="scheduled">🗓️ Fecha específica (una vez)</option>
        </select>
      </div>

      {/* Campos condicionales según frecuencia */}
      {(schedule === 'daily' || schedule === 'every_12h' || schedule === 'every_6h') && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>
            Hora {schedule === 'every_12h' && '(hora base)'}
            {schedule === 'every_6h' && '(hora base)'}
          </label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              backgroundColor: 'white',
              outline: 'none',
            }}
          />
          {schedule === 'every_12h' && (
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              Se ejecutará a las {hora} y 12 horas después
            </p>
          )}
          {schedule === 'every_6h' && (
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              Se ejecutará cada 6 horas comenzando a las {hora}
            </p>
          )}
        </div>
      )}

      {schedule === 'weekly' && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>
              Día de la semana
            </label>
            <select
              value={diaSemana}
              onChange={(e) => setDiaSemana(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#111827',
                backgroundColor: 'white',
                outline: 'none',
              }}
            >
              <option value={0}>Lunes</option>
              <option value={1}>Martes</option>
              <option value={2}>Miércoles</option>
              <option value={3}>Jueves</option>
              <option value={4}>Viernes</option>
              <option value={5}>Sábado</option>
              <option value={6}>Domingo</option>
            </select>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>
              Hora
            </label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#111827',
                backgroundColor: 'white',
                outline: 'none',
              }}
            />
          </div>
        </>
      )}

      {schedule === 'monthly' && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>
              Día del mes
            </label>
            <input
              type="number"
              min={1}
              max={28}
              value={diaMes}
              onChange={(e) => setDiaMes(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#111827',
                backgroundColor: 'white',
                outline: 'none',
              }}
            />
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              Rango: 1-28 (para evitar problemas con febrero)
            </p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>
              Hora
            </label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#111827',
                backgroundColor: 'white',
                outline: 'none',
              }}
            />
          </div>
        </>
      )}

      {schedule === 'scheduled' && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>
              Fecha
            </label>
            <input
              type="date"
              value={fechaProgramada}
              onChange={(e) => setFechaProgramada(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#111827',
                backgroundColor: 'white',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>
              Hora
            </label>
            <input
              type="time"
              value={horaProgramada}
              onChange={(e) => setHoraProgramada(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#111827',
                backgroundColor: 'white',
                outline: 'none',
              }}
            />
          </div>
        </>
      )}

      {/* Información adicional */}
      {schedule !== 'disabled' && (
        <div style={{ padding: '12px 16px', background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ fontSize: '13px', color: '#92400e', margin: 0 }}>
            ℹ️ Los backups automáticos se ejecutan en el servidor. Asegúrate de tener espacio suficiente en Supabase.
          </p>
        </div>
      )}

      {/* Botones */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={handleGuardar}
          disabled={mutation.isPending}
          style={{
            flex: 1,
            padding: '12px 20px',
            background: mutation.isPending 
              ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: mutation.isPending ? 'not-allowed' : 'pointer',
          }}
        >
          {mutation.isPending ? '⏳ Guardando...' : '💾 Guardar Configuración'}
        </button>
      </div>
    </div>
  );
}
