/**
 * 🦷 Página de Tratamientos (Admin)
 * Gestión de categorías, servicios y planes de tratamiento
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FolderTree, Stethoscope, FileText, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { tratamientosService } from '@/services/tratamientosService';
import CategoriasList from '@/components/admin/CategoriasList';
import ServiciosList from '@/components/admin/ServiciosList';
import PlanesList from '@/components/admin/PlanesList';
import CategoriaModal from '@/components/admin/CategoriaModal';
import ServicioModal from '@/components/admin/ServicioModal';

export default function Tratamientos() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'categorias' | 'servicios' | 'planes'>('servicios');
  const [isCategoriaModalOpen, setIsCategoriaModalOpen] = useState(false);
  const [isServicioModalOpen, setIsServicioModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<any>(null);
  const [selectedServicio, setSelectedServicio] = useState<any>(null);

  // Queries
  const { data: categorias, isLoading: loadingCategorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => tratamientosService.getCategorias(),
  });

  const { data: servicios, isLoading: loadingServicios } = useQuery({
    queryKey: ['servicios'],
    queryFn: () => tratamientosService.getServicios(),
  });

  const { data: planes, isLoading: loadingPlanes } = useQuery({
    queryKey: ['planes'],
    queryFn: () => tratamientosService.getPlanes(),
  });

  // Mutations para Categorías
  const saveCatMutation = useMutation({
    mutationFn: (data: any) => {
      if (selectedCategoria) {
        return tratamientosService.updateCategoria(selectedCategoria.id, data);
      }
      return tratamientosService.createCategoria(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      toast.success(selectedCategoria ? 'Categoría actualizada' : 'Categoría creada');
      setIsCategoriaModalOpen(false);
      setSelectedCategoria(null);
    },
    onError: () => {
      toast.error('Error al guardar categoría');
    },
  });

  const deleteCatMutation = useMutation({
    mutationFn: (id: number) => tratamientosService.deleteCategoria(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      toast.success('Categoría eliminada');
    },
    onError: () => {
      toast.error('Error al eliminar categoría');
    },
  });

  // Mutations para Servicios
  const saveServMutation = useMutation({
    mutationFn: (data: any) => {
      if (selectedServicio) {
        return tratamientosService.updateServicio(selectedServicio.id, data);
      }
      return tratamientosService.createServicio(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      toast.success(selectedServicio ? 'Servicio actualizado' : 'Servicio creado');
      setIsServicioModalOpen(false);
      setSelectedServicio(null);
    },
    onError: () => {
      toast.error('Error al guardar servicio');
    },
  });

  const deleteServMutation = useMutation({
    mutationFn: (id: number) => tratamientosService.deleteServicio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      toast.success('Servicio eliminado');
    },
    onError: () => {
      toast.error('Error al eliminar servicio');
    },
  });

  // Handlers
  const handleNuevaCategoria = () => {
    setSelectedCategoria(null);
    setIsCategoriaModalOpen(true);
  };

  const handleEditCategoria = (cat: any) => {
    setSelectedCategoria(cat);
    setIsCategoriaModalOpen(true);
  };

  const handleDeleteCategoria = (id: number) => {
    if (window.confirm('¿Eliminar esta categoría?')) {
      deleteCatMutation.mutate(id);
    }
  };

  const handleNuevoServicio = () => {
    setSelectedServicio(null);
    setIsServicioModalOpen(true);
  };

  const handleEditServicio = (serv: any) => {
    setSelectedServicio(serv);
    setIsServicioModalOpen(true);
  };

  const handleDeleteServicio = (id: number) => {
    if (window.confirm('¿Eliminar este servicio?')) {
      deleteServMutation.mutate(id);
    }
  };

  const tabs = [
    { id: 'categorias', label: 'Categorías', icon: FolderTree },
    { id: 'servicios', label: 'Servicios', icon: Stethoscope },
    { id: 'planes', label: 'Planes de Tratamiento', icon: FileText },
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
          Tratamientos
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          Gestiona categorías, servicios y planes de tratamiento
        </p>
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
          {/* Categorías */}
          {activeTab === 'categorias' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Categorías de Servicios
                </h2>
                <button
                  onClick={handleNuevaCategoria}
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
                  Nueva Categoría
                </button>
              </div>
              <CategoriasList
                categorias={categorias || []}
                isLoading={loadingCategorias}
                onEdit={handleEditCategoria}
                onDelete={handleDeleteCategoria}
              />
            </div>
          )}

          {/* Servicios */}
          {activeTab === 'servicios' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Servicios Dentales
                </h2>
                <button
                  onClick={handleNuevoServicio}
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
                  Nuevo Servicio
                </button>
              </div>
              <ServiciosList
                servicios={servicios || []}
                categorias={categorias || []}
                isLoading={loadingServicios}
                onEdit={handleEditServicio}
                onDelete={handleDeleteServicio}
              />
            </div>
          )}

          {/* Planes */}
          {activeTab === 'planes' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Planes de Tratamiento
                </h2>
              </div>
              <PlanesList
                planes={planes || []}
                isLoading={loadingPlanes}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CategoriaModal
        isOpen={isCategoriaModalOpen}
        onClose={() => {
          setIsCategoriaModalOpen(false);
          setSelectedCategoria(null);
        }}
        categoria={selectedCategoria}
        onSubmit={(data) => saveCatMutation.mutate(data)}
        isLoading={saveCatMutation.isPending}
      />

      <ServicioModal
        isOpen={isServicioModalOpen}
        onClose={() => {
          setIsServicioModalOpen(false);
          setSelectedServicio(null);
        }}
        servicio={selectedServicio}
        categorias={categorias || []}
        onSubmit={(data) => saveServMutation.mutate(data)}
        isLoading={saveServMutation.isPending}
      />
    </div>
  );
}
