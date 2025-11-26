/**
 * 🔄 Modal para Crear Backup Manual
 */

import { useState } from 'react';
import toast from 'react-hot-toast';
import backupService, { descargarArchivo } from '@/services/backupService';
import type { CreateBackupResponse } from '@/types/backups';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalCrearBackup({ onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [descargarDirecto, setDescargarDirecto] = useState(false);

  const handleCrear = async () => {
    setLoading(true);
    try {
      if (descargarDirecto) {
        const blob = await backupService.crearBackupManual(true) as Blob;
        const fileName = `backup-${new Date().toISOString().split('T')[0]}.sql`;
        descargarArchivo(blob, fileName);
        toast.success('✅ Backup creado y descargado');
      } else {
        const response = await backupService.crearBackupManual(false) as CreateBackupResponse;
        toast.success(`✅ ${response.message}`);
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al crear backup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">🔄 Crear Backup Manual</h2>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900 mb-2">
            <strong>Se creará un backup completo con:</strong>
          </p>
          <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">
            <li>Usuarios y pacientes</li>
            <li>Agenda y citas</li>
            <li>Historial clínico</li>
            <li>Tratamientos y presupuestos</li>
            <li>Facturación e inventario</li>
          </ul>
        </div>

        <label className="flex items-center gap-2 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={descargarDirecto}
            onChange={(e) => setDescargarDirecto(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-700">Descargar backup inmediatamente</span>
        </label>

        <div className="flex gap-2">
          <button
            onClick={handleCrear}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? '⏳ Creando...' : '✓ Crear Backup'}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
