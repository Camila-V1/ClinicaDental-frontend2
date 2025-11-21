/**
 * 📝 Modal de Historial Clínico
 */

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { adminUsuariosService } from '@/services/admin/adminUsuariosService';
import type { HistorialClinico } from '@/services/historialClinicoService';
import type { Usuario } from '@/types/admin';

const historialSchema = z.object({
  paciente_id: z.number().optional(),
  antecedentes_medicos: z.string().optional(),
  alergias: z.string().optional(),
  medicamentos_actuales: z.string().optional(),
  notas_generales: z.string().optional(),
});

type HistorialFormData = z.infer<typeof historialSchema>;

interface HistorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  historial: HistorialClinico | null;
  onSubmit: (data: HistorialFormData) => void;
  isLoading: boolean;
}

export default function HistorialModal({ isOpen, onClose, historial, onSubmit, isLoading }: HistorialModalProps) {
  const [pacientes, setPacientes] = useState<Usuario[]>([]);
  const [loadingPacientes, setLoadingPacientes] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<HistorialFormData>({
    resolver: zodResolver(historialSchema),
    defaultValues: historial ? {
      antecedentes_medicos: historial.antecedentes_medicos || '',
      alergias: historial.alergias || '',
      medicamentos_actuales: historial.medicamentos_actuales || '',
      notas_generales: historial.notas_generales || '',
    } : {
      antecedentes_medicos: '',
      alergias: '',
      medicamentos_actuales: '',
      notas_generales: '',
    }
  });

  // Cargar pacientes solo si es nuevo historial
  useEffect(() => {
    if (isOpen && !historial) {
      loadPacientes();
    }
  }, [isOpen, historial]);

  const loadPacientes = async () => {
    setLoadingPacientes(true);
    try {
      const data = await adminUsuariosService.getUsuarios({ tipo_usuario: 'PACIENTE', is_active: 'true' });
      setPacientes(data || []);
    } catch (error) {
      console.error('Error cargando pacientes:', error);
    } finally {
      setLoadingPacientes(false);
    }
  };

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={historial ? `Editar Historial - ${historial.paciente_nombre}` : 'Nuevo Historial Clínico'}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Paciente (solo para nuevo) */}
        {!historial && (
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
              Paciente <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              {...register('paciente_id', { valueAsNumber: true })}
              disabled={loadingPacientes}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#111827',
                backgroundColor: 'white',
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            >
              <option value="">Seleccione un paciente</option>
              {pacientes.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre || p.first_name} {p.apellido || p.last_name} - {p.email}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Antecedentes Médicos */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Antecedentes Médicos
          </label>
          <textarea
            {...register('antecedentes_medicos')}
            rows={3}
            placeholder="Enfermedades previas, cirugías, etc."
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              backgroundColor: 'white',
              outline: 'none',
              resize: 'vertical',
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        {/* Alergias */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            ⚠️ Alergias
          </label>
          <textarea
            {...register('alergias')}
            rows={2}
            placeholder="Alergias conocidas (medicamentos, materiales, etc.)"
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              backgroundColor: '#fef2f2',
              outline: 'none',
              resize: 'vertical',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#ef4444';
              e.target.style.backgroundColor = 'white';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#fecaca';
              e.target.style.backgroundColor = '#fef2f2';
            }}
          />
        </div>

        {/* Medicamentos Actuales */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            💊 Medicamentos Actuales
          </label>
          <textarea
            {...register('medicamentos_actuales')}
            rows={2}
            placeholder="Medicamentos que está tomando actualmente"
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              backgroundColor: 'white',
              outline: 'none',
              resize: 'vertical',
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        {/* Notas Generales */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Notas Generales
          </label>
          <textarea
            {...register('notas_generales')}
            rows={3}
            placeholder="Observaciones adicionales"
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              backgroundColor: 'white',
              outline: 'none',
              resize: 'vertical',
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading || loadingPacientes}
          >
            {historial ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
