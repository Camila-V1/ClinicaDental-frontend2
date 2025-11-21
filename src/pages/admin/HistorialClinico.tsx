/**
 * 🏥 Página de Historial Clínico (Admin)
 * Gestión de historiales, episodios y documentos clínicos
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Clipboard, Image, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { historialClinicoService } from '@/services/historialClinicoService';
import HistorialesList from '@/components/admin/HistorialesList';
import EpisodiosList from '@/components/admin/EpisodiosList';
import HistorialModal from '@/components/admin/HistorialModal';
import EpisodioModal from '@/components/admin/EpisodioModal';

export default function HistorialClinico() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'historiales' | 'episodios'>('historiales');
  const [searchTerm, setSearchTerm] = useState('');
  const [isHistorialModalOpen, setIsHistorialModalOpen] = useState(false);
  const [isEpisodioModalOpen, setIsEpisodioModalOpen] = useState(false);
  const [selectedHistorial, setSelectedHistorial] = useState<any>(null);
  const [selectedEpisodio, setSelectedEpisodio] = useState<any>(null);

  // Queries
  const { data: historiales, isLoading: loadingHistoriales } = useQuery({
    queryKey: ['historiales', searchTerm],
    queryFn: () => historialClinicoService.getHistoriales({ search: searchTerm }),
  });

  const { data: episodios, isLoading: loadingEpisodios } = useQuery({
    queryKey: ['episodios', searchTerm],
    queryFn: () => historialClinicoService.getEpisodios({ search: searchTerm }),
  });

  // Mutations para Historiales
  const saveHistorialMutation = useMutation({
    mutationFn: (data: any) => {
      if (selectedHistorial) {
        return historialClinicoService.updateHistorial(selectedHistorial.id, data);
      }
      return historialClinicoService.createHistorial(data.paciente_id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historiales'] });
      toast.success(selectedHistorial ? 'Historial actualizado' : 'Historial creado');
      setIsHistorialModalOpen(false);
      setSelectedHistorial(null);
    },
    onError: () => {
      toast.error('Error al guardar historial');
    },
  });

  // Mutations para Episodios
  const saveEpisodioMutation = useMutation({
    mutationFn: (data: any) => {
      if (selectedEpisodio) {
        return historialClinicoService.updateEpisodio(selectedEpisodio.id, data);
      }
      return historialClinicoService.createEpisodio(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['episodios'] });
      toast.success(selectedEpisodio ? 'Episodio actualizado' : 'Episodio creado');
      setIsEpisodioModalOpen(false);
      setSelectedEpisodio(null);
    },
    onError: () => {
      toast.error('Error al guardar episodio');
    },
  });

  const deleteEpisodioMutation = useMutation({
    mutationFn: (id: number) => historialClinicoService.deleteEpisodio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['episodios'] });
      toast.success('Episodio eliminado');
    },
    onError: () => {
      toast.error('Error al eliminar episodio');
    },
  });

  // Handlers
  const handleEditHistorial = (historial: any) => {
    setSelectedHistorial(historial);
    setIsHistorialModalOpen(true);
  };

  const handleNuevoEpisodio = () => {
    setSelectedEpisodio(null);
    setIsEpisodioModalOpen(true);
  };

  const handleEditEpisodio = (episodio: any) => {
    setSelectedEpisodio(episodio);
    setIsEpisodioModalOpen(true);
  };

  const handleDeleteEpisodio = (id: number) => {
    if (window.confirm('¿Eliminar este episodio?')) {
      deleteEpisodioMutation.mutate(id);
    }
  };

  const tabs = [
    { id: 'historiales', label: 'Historiales Clínicos', icon: FileText },
    { id: 'episodios', label: 'Episodios de Atención', icon: Clipboard },
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
          Historial Clínico
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          Gestiona historiales médicos y episodios de atención
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search style={{ 
            position: 'absolute', 
            left: '14px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            width: '18px', 
            height: '18px', 
            color: '#6b7280' 
          }} />
          <input
            type="text"
            placeholder="Buscar paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 42px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              backgroundColor: 'white',
              outline: 'none',
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          borderBottom: '1px solid #e5e7eb', 
          display: 'flex', 
          gap: '8px',
          padding: '16px 20px'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isActive ? '#2563eb' : '#f3f4f6',
                  color: isActive ? 'white' : '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 150ms'
                }}
              >
                <Icon style={{ width: '16px', height: '16px' }} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '24px' }}>
          {/* Historiales */}
          {activeTab === 'historiales' && (
            <HistorialesList
              historiales={historiales || []}
              isLoading={loadingHistoriales}
              onEdit={handleEditHistorial}
            />
          )}

          {/* Episodios */}
          {activeTab === 'episodios' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <button
                  onClick={handleNuevoEpisodio}
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
                  <Clipboard style={{ width: '16px', height: '16px' }} />
                  Nuevo Episodio
                </button>
              </div>
              <EpisodiosList
                episodios={episodios || []}
                isLoading={loadingEpisodios}
                onEdit={handleEditEpisodio}
                onDelete={handleDeleteEpisodio}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <HistorialModal
        isOpen={isHistorialModalOpen}
        onClose={() => {
          setIsHistorialModalOpen(false);
          setSelectedHistorial(null);
        }}
        historial={selectedHistorial}
        onSubmit={(data) => saveHistorialMutation.mutate(data)}
        isLoading={saveHistorialMutation.isPending}
      />

      <EpisodioModal
        isOpen={isEpisodioModalOpen}
        onClose={() => {
          setIsEpisodioModalOpen(false);
          setSelectedEpisodio(null);
        }}
        episodio={selectedEpisodio}
        historiales={historiales || []}
        onSubmit={(data) => saveEpisodioMutation.mutate(data)}
        isLoading={saveEpisodioMutation.isPending}
      />
    </div>
  );
}
