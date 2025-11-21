/**
 * 📅 Página de Agenda (Admin)
 */

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar as CalendarIcon, Clock, User, CheckCircle, XCircle, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { obtenerCitas, atenderCita, cancelarCita, solicitarCita, type Cita } from '@/services/agendaService';
import AgendaCalendar from '@/components/admin/AgendaCalendar';
import CitasList from '@/components/admin/CitasList';
import CitaModal from '@/components/admin/CitaModal';

export default function Agenda() {
  console.log('📅 [Agenda] Componente montado');
  
  const queryClient = useQueryClient();
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [filters, setFilters] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    estado: '',
  });

  // Fetch citas
  const { data: citas, isLoading, error } = useQuery({
    queryKey: ['citas-admin', filters],
    queryFn: async () => {
      console.log('📡 [Agenda] Fetching citas con filtros:', filters);
      try {
        const result = await obtenerCitas(filters);
        console.log('✅ [Agenda] Citas obtenidas:', result.length);
        return result;
      } catch (error) {
        console.error('❌ [Agenda] Error obteniendo citas:', error);
        throw error;
      }
    },
  });

  // Mutation para atender cita
  const atenderMutation = useMutation({
    mutationFn: (citaId: number) => atenderCita(citaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas-admin'] });
      toast.success('Cita marcada como atendida');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al atender cita');
    },
  });

  // Mutation para cancelar cita
  const cancelarMutation = useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo?: string }) => 
      cancelarCita(id, motivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas-admin'] });
      toast.success('Cita cancelada');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al cancelar cita');
    },
  });

  // Mutation para crear/actualizar cita
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      // Por ahora solo creamos citas, actualizar requiere endpoint adicional
      return await solicitarCita(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas-admin'] });
      toast.success(selectedCita ? 'Cita actualizada' : 'Cita creada');
      setIsModalOpen(false);
      setSelectedCita(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al guardar cita');
    },
  });

  const handleAtender = (citaId: number) => {
    if (window.confirm('¿Marcar esta cita como atendida?')) {
      atenderMutation.mutate(citaId);
    }
  };

  const handleCancelar = (citaId: number) => {
    const motivo = prompt('Ingrese el motivo de la cancelación (opcional):');
    if (motivo !== null) {
      cancelarMutation.mutate({ id: citaId, motivo });
    }
  };

  const handleNuevaCita = () => {
    setSelectedCita(null);
    setIsModalOpen(true);
  };

  const handleEditCita = (cita: Cita) => {
    setSelectedCita(cita);
    setIsModalOpen(true);
  };

  // Estadísticas
  const stats = React.useMemo(() => {
    if (!citas) return { total: 0, pendientes: 0, confirmadas: 0, atendidas: 0, canceladas: 0 };
    
    return {
      total: citas.length,
      pendientes: citas.filter(c => c.estado === 'PENDIENTE').length,
      confirmadas: citas.filter(c => c.estado === 'CONFIRMADA').length,
      atendidas: citas.filter(c => c.estado === 'ATENDIDA' || c.estado === 'COMPLETADA').length,
      canceladas: citas.filter(c => c.estado === 'CANCELADA').length,
    };
  }, [citas]);

  console.log('🎨 [Agenda] Renderizando con:', { 
    citas: citas?.length,
    isLoading,
    view,
    stats
  });

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
          Agenda de Citas
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          Gestiona las citas de todos los odontólogos
        </p>
      </div>

      {/* Estadísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '20px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CalendarIcon style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Total Citas</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '20px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              backgroundColor: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock style={{ width: '24px', height: '24px', color: '#f59e0b' }} />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Pendientes</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>
                {stats.pendientes}
              </p>
            </div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '20px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              backgroundColor: '#d1fae5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle style={{ width: '24px', height: '24px', color: '#10b981' }} />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Atendidas</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>
                {stats.atendidas}
              </p>
            </div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '20px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              backgroundColor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <XCircle style={{ width: '24px', height: '24px', color: '#ef4444' }} />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Canceladas</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>
                {stats.canceladas}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controles y Vista */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Header de controles */}
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setView('calendar')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: view === 'calendar' ? '#2563eb' : '#f3f4f6',
                color: view === 'calendar' ? 'white' : '#6b7280',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 150ms'
              }}
            >
              Vista Calendario
            </button>
            <button
              onClick={() => setView('list')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: view === 'list' ? '#2563eb' : '#f3f4f6',
                color: view === 'list' ? 'white' : '#6b7280',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 150ms'
              }}
            >
              Vista Lista
            </button>
          </div>

          <button
            onClick={handleNuevaCita}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#2563eb',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            Nueva Cita
          </button>
        </div>

        {/* Contenido */}
        <div style={{ padding: '20px' }}>
          {view === 'calendar' ? (
            <AgendaCalendar
              citas={citas || []}
              isLoading={isLoading}
              onSelectCita={handleEditCita}
              onAtender={handleAtender}
              onCancelar={handleCancelar}
            />
          ) : (
            <CitasList
              citas={citas || []}
              isLoading={isLoading}
              onEdit={handleEditCita}
              onAtender={handleAtender}
              onCancelar={handleCancelar}
            />
          )}
        </div>
      </div>

      {/* Modal de Nueva/Editar Cita */}
      <CitaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCita(null);
        }}
        cita={selectedCita}
        onSubmit={(data) => saveMutation.mutate(data)}
        isLoading={saveMutation.isPending}
      />
    </div>
  );
}
