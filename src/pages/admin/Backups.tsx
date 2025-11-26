/**
 * 🔄 Sistema de Backups y Restauración
 */

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import backupService, { descargarArchivo, formatFileSize, formatRelativeTime } from '@/services/backupService';
import ModalCrearBackup from '@/components/backups/ModalCrearBackup';
import type { BackupRecord } from '@/types/backups';

export default function Backups() {
  const [modalCrear, setModalCrear] = useState(false);
  const [backupEliminar, setBackupEliminar] = useState<BackupRecord | null>(null);
  const [filtro, setFiltro] = useState<'todos' | 'manual' | 'automatic'>('todos');

  const { data: backups, isLoading, refetch } = useQuery({
    queryKey: ['backups'],
    queryFn: () => backupService.getHistorial(),
  });

  const handleDescargar = async (backup: BackupRecord) => {
    try {
      toast.loading('Descargando backup...');
      const blob = await backupService.descargarBackup(backup.id);
      descargarArchivo(blob, backup.file_name);
      toast.dismiss();
      toast.success('✅ Backup descargado');
    } catch (error: any) {
      toast.dismiss();
      toast.error('Error al descargar backup');
    }
  };

  const handleEliminar = async () => {
    if (!backupEliminar) return;
    
    try {
      await backupService.eliminarBackup(backupEliminar.id);
      toast.success('✅ Backup eliminado');
      setBackupEliminar(null);
      refetch();
    } catch (error: any) {
      toast.error('Error al eliminar backup');
    }
  };

  const backupsFiltrados = backups?.filter(b => 
    filtro === 'todos' || b.backup_type === filtro
  ) || [];

  const backupsManuales = backups?.filter(b => b.backup_type === 'manual').length || 0;
  const backupsAutomaticos = backups?.filter(b => b.backup_type === 'automatic').length || 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            🔄 Backups y Restauración
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Gestiona copias de seguridad de tu base de datos
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            style={{
              padding: '10px 16px',
              background: 'white',
              color: '#111827',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            🔄 Actualizar
          </button>
          <button
            onClick={() => setModalCrear(true)}
            style={{
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            ➕ Crear Backup Manual
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setFiltro('todos')}
          style={{
            padding: '10px 20px',
            background: filtro === 'todos' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'white',
            color: filtro === 'todos' ? 'white' : '#111827',
            border: filtro === 'todos' ? 'none' : '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          📦 Todos ({backups?.length || 0})
        </button>
        <button
          onClick={() => setFiltro('manual')}
          style={{
            padding: '10px 20px',
            background: filtro === 'manual' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'white',
            color: filtro === 'manual' ? 'white' : '#111827',
            border: filtro === 'manual' ? 'none' : '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          👤 Manuales ({backupsManuales})
        </button>
        <button
          onClick={() => setFiltro('automatic')}
          style={{
            padding: '10px 20px',
            background: filtro === 'automatic' ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 'white',
            color: filtro === 'automatic' ? 'white' : '#111827',
            border: filtro === 'automatic' ? 'none' : '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          🤖 Automáticos ({backupsAutomaticos})
        </button>
      </div>

      {/* Tabla */}
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
            Cargando backups...
          </div>
        ) : backupsFiltrados.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔄</div>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>
              No hay backups
            </p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Crea tu primer backup manual
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Archivo
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Tipo
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Tamaño
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Creado por
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Fecha
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {backupsFiltrados.map((backup, index) => (
                  <tr
                    key={backup.id}
                    style={{
                      borderTop: '1px solid #e5e7eb',
                      backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb',
                    }}
                  >
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827', fontFamily: 'monospace' }}>
                      {backup.file_name}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: backup.backup_type === 'manual' ? '#dbeafe' : '#f3e8ff',
                          color: backup.backup_type === 'manual' ? '#1e40af' : '#6b21a8',
                          border: `1px solid ${backup.backup_type === 'manual' ? '#93c5fd' : '#d8b4fe'}`,
                        }}
                      >
                        {backup.backup_type === 'manual' ? '👤 Manual' : '🤖 Automático'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6b7280' }}>
                      {formatFileSize(backup.file_size)}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827' }}>
                      {backup.created_by ? backup.created_by.nombre : 'Sistema'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6b7280' }}>
                      <span title={new Date(backup.created_at).toLocaleString('es-ES')}>
                        {formatRelativeTime(backup.created_at)}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDescargar(backup)}
                        style={{
                          padding: '6px 12px',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          marginRight: '8px',
                        }}
                      >
                        📥 Descargar
                      </button>
                      <button
                        onClick={() => setBackupEliminar(backup)}
                        style={{
                          padding: '6px 12px',
                          background: 'white',
                          color: '#ef4444',
                          border: '1px solid #ef4444',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Crear */}
      {modalCrear && (
        <ModalCrearBackup
          onClose={() => setModalCrear(false)}
          onSuccess={() => refetch()}
        />
      )}

      {/* Modal Eliminar */}
      {backupEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">⚠️ Confirmar Eliminación</h2>
            
            <p className="text-gray-700 mb-4">
              ¿Estás seguro de eliminar el backup <strong>{backupEliminar.file_name}</strong>?
            </p>

            <div className="p-3 bg-red-50 rounded-lg border border-red-200 mb-6">
              <p className="text-sm text-red-700">
                ⚠️ Esta acción no se puede deshacer
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleEliminar}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-lg font-medium"
              >
                Eliminar
              </button>
              <button
                onClick={() => setBackupEliminar(null)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
