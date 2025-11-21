/**
 * 🏥 Página Gestión de Pacientes (Admin)
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminUsuariosService } from '@/services/admin/adminUsuariosService';
import PacienteTable from '@/components/admin/PacienteTable';
import PacienteModal from '@/components/admin/PacienteModal';
import Button from '@/components/ui/Button';
import type { Usuario, UsuarioFormData } from '@/types/admin';

export default function Pacientes() {
  console.log('🏥 [Pacientes] Componente montado');
  
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<Usuario | null>(null);
  const [filters, setFilters] = useState({
    tipo_usuario: 'PACIENTE',
    is_active: 'true',
    search: '',
  });

  // Log de cambios en filtros
  React.useEffect(() => {
    console.log('🔍 [Pacientes] Filtros actualizados:', filters);
  }, [filters]);

  // Fetch pacientes
  const { data, isLoading, error } = useQuery({
    queryKey: ['pacientes-admin', filters],
    queryFn: async () => {
      console.log('📡 [Pacientes] Fetching pacientes con filtros:', filters);
      try {
        const result = await adminUsuariosService.getUsuarios(filters);
        console.log('✅ [Pacientes] Pacientes obtenidos:', result);
        return result;
      } catch (error) {
        console.error('❌ [Pacientes] Error obteniendo pacientes:', error);
        throw error;
      }
    },
  });

  // Log de errores
  React.useEffect(() => {
    if (error) {
      console.error('🔴 [Pacientes] Error en query:', error);
    }
  }, [error]);

  // Crear/Editar paciente
  const mutation = useMutation({
    mutationFn: (pacienteData: UsuarioFormData) => {
      console.log('💾 [Pacientes] Guardando paciente:', { selectedPaciente: selectedPaciente?.id, pacienteData });
      return selectedPaciente 
        ? adminUsuariosService.updateUsuario(selectedPaciente.id, pacienteData, 'PACIENTE')
        : adminUsuariosService.createUsuario(pacienteData);
    },
    onSuccess: (data) => {
      console.log('✅ [Pacientes] Paciente guardado exitosamente:', data);
      queryClient.invalidateQueries({ queryKey: ['pacientes-admin'] });
      setIsModalOpen(false);
      setSelectedPaciente(null);
      toast.success(selectedPaciente ? 'Paciente actualizado' : 'Paciente creado');
    },
    onError: (error: any) => {
      console.error('❌ [Pacientes] Error guardando paciente:', error);
      console.error('❌ [Pacientes] Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Error al guardar paciente');
    },
  });

  // Toggle activo/inactivo
  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) => {
      console.log('🔄 [Pacientes] Toggle activo:', { id, is_active });
      return adminUsuariosService.toggleActivo(id, is_active, 'PACIENTE');
    },
    onSuccess: (data) => {
      console.log('✅ [Pacientes] Estado actualizado:', data);
      queryClient.invalidateQueries({ queryKey: ['pacientes-admin'] });
      toast.success('Estado actualizado');
    },
    onError: (error: any) => {
      console.error('❌ [Pacientes] Error en toggle activo:', error);
      toast.error('Error al cambiar estado');
    },
  });

  const handleEdit = (paciente: Usuario) => {
    console.log('✏️ [Pacientes] Editando paciente:', paciente);
    setSelectedPaciente(paciente);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    console.log('➕ [Pacientes] Creando nuevo paciente');
    setSelectedPaciente(null);
    setIsModalOpen(true);
  };

  const handleToggleActive = (paciente: Usuario) => {
    console.log('🔄 [Pacientes] Iniciando toggle para paciente:', paciente);
    toggleActiveMutation.mutate({
      id: paciente.id,
      is_active: !paciente.is_active,
    });
  };

  console.log('🎨 [Pacientes] Renderizando página con:', { 
    data, 
    cantidad: data?.length,
    isLoading,
    filters 
  });

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
          Gestión de Pacientes
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          Administra los pacientes registrados en el sistema
        </p>
      </div>

      {/* Filtros y Acciones */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', 
        padding: '20px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Filtros</h2>
          <Button onClick={handleCreate} size="sm">
            <Plus style={{ width: '16px', height: '16px', marginRight: '6px' }} />
            Nuevo Paciente
          </Button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {/* Búsqueda */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Buscar
            </label>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Nombre, email o CI..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                style={{ 
                  width: '100%', 
                  paddingLeft: '38px', 
                  paddingRight: '12px', 
                  paddingTop: '10px', 
                  paddingBottom: '10px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px', 
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 150ms',
                  color: '#111827',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Estado */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Estado
            </label>
            <select
              value={filters.is_active}
              onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
              style={{ 
                width: '100%',
                padding: '10px 12px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                fontSize: '14px', 
                outline: 'none', 
                backgroundColor: 'white', 
                color: '#111827',
                cursor: 'pointer',
                transition: 'border-color 150ms'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>

          {/* Botón Limpiar */}
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => setFilters({ tipo_usuario: 'PACIENTE', is_active: 'true', search: '' })}
              style={{ 
                width: '100%',
                padding: '10px 16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                fontSize: '14px', 
                fontWeight: '500',
                backgroundColor: 'white', 
                color: '#6b7280',
                cursor: 'pointer', 
                transition: 'all 150ms'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
            Pacientes Registrados
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
            {data?.length || 0} paciente{data?.length !== 1 ? 's' : ''} encontrado{data?.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <PacienteTable
          pacientes={data || []}
          isLoading={isLoading}
          onEdit={handleEdit}
          onToggleActive={handleToggleActive}
        />
      </div>

      {/* Modal */}
      <PacienteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPaciente(null);
        }}
        paciente={selectedPaciente}
        onSubmit={(data) => mutation.mutate(data)}
        isLoading={mutation.isPending}
      />
    </div>
  );
}
