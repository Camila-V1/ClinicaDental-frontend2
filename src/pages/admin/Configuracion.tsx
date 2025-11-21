/**
 * ⚙️ Página de Configuración - Admin
 */

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import configuracionService, { type ConfiguracionGeneral, type ConfiguracionUsuario } from '@/services/configuracionService';
import ConfiguracionGeneralForm from '@/components/admin/ConfiguracionGeneralForm';
import ConfiguracionUsuarioForm from '@/components/admin/ConfiguracionUsuarioForm';
import TenantInfo from '@/components/admin/TenantInfo';
import AuditoriaLogs from '@/components/admin/AuditoriaLogs';

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState<'general' | 'usuario' | 'tenant' | 'auditoria'>('general');
  const [configGeneral, setConfigGeneral] = useState<ConfiguracionGeneral>(
    configuracionService.getConfiguracionGeneral()
  );
  const [configUsuario, setConfigUsuario] = useState<ConfiguracionUsuario>(
    configuracionService.getConfiguracionUsuario()
  );

  const tenantInfo = configuracionService.getTenantInfo();

  // ==================== HANDLERS ====================

  const handleSaveGeneral = (config: ConfiguracionGeneral) => {
    configuracionService.setConfiguracionGeneral(config);
    setConfigGeneral(config);
    toast.success('Configuración general guardada');
  };

  const handleSaveUsuario = (config: ConfiguracionUsuario) => {
    configuracionService.setConfiguracionUsuario(config);
    setConfigUsuario(config);
    toast.success('Preferencias de usuario guardadas');
  };

  const handleExportarConfig = () => {
    const json = configuracionService.exportarConfiguracion();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `configuracion_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Configuración exportada');
  };

  const handleImportarConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = configuracionService.importarConfiguracion(content);
      if (success) {
        setConfigGeneral(configuracionService.getConfiguracionGeneral());
        setConfigUsuario(configuracionService.getConfiguracionUsuario());
        toast.success('Configuración importada correctamente');
      } else {
        toast.error('Error al importar configuración');
      }
    };
    reader.readAsText(file);
  };

  const handleLimpiarCache = () => {
    if (window.confirm('¿Está seguro de limpiar el caché? Esto cerrará su sesión.')) {
      configuracionService.clearCache();
      toast.success('Caché limpiado');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          ⚙️ Configuración del Sistema
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Administración y configuración avanzada
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={handleExportarConfig}
          style={{
            padding: '10px 20px',
            background: '#f3f4f6',
            color: '#111827',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          📥 Exportar Configuración
        </button>
        
        <label
          style={{
            padding: '10px 20px',
            background: '#f3f4f6',
            color: '#111827',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          📤 Importar Configuración
          <input
            type="file"
            accept=".json"
            onChange={handleImportarConfig}
            style={{ display: 'none' }}
          />
        </label>

        <button
          onClick={handleLimpiarCache}
          style={{
            padding: '10px 20px',
            background: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🗑️ Limpiar Caché
        </button>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '2px solid #e5e7eb', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('general')}
            style={{
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: '500',
              color: activeTab === 'general' ? '#8b5cf6' : '#6b7280',
              borderBottom: activeTab === 'general' ? '3px solid #8b5cf6' : '3px solid transparent',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            ⚙️ General
          </button>
          <button
            onClick={() => setActiveTab('usuario')}
            style={{
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: '500',
              color: activeTab === 'usuario' ? '#8b5cf6' : '#6b7280',
              borderBottom: activeTab === 'usuario' ? '3px solid #8b5cf6' : '3px solid transparent',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            👤 Preferencias
          </button>
          <button
            onClick={() => setActiveTab('tenant')}
            style={{
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: '500',
              color: activeTab === 'tenant' ? '#8b5cf6' : '#6b7280',
              borderBottom: activeTab === 'tenant' ? '3px solid #8b5cf6' : '3px solid transparent',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            🏢 Información
          </button>
          <button
            onClick={() => setActiveTab('auditoria')}
            style={{
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: '500',
              color: activeTab === 'auditoria' ? '#8b5cf6' : '#6b7280',
              borderBottom: activeTab === 'auditoria' ? '3px solid #8b5cf6' : '3px solid transparent',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            📋 Auditoría
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'general' && (
          <ConfiguracionGeneralForm
            config={configGeneral}
            onSave={handleSaveGeneral}
          />
        )}

        {activeTab === 'usuario' && (
          <ConfiguracionUsuarioForm
            config={configUsuario}
            onSave={handleSaveUsuario}
          />
        )}

        {activeTab === 'tenant' && (
          <TenantInfo tenant={tenantInfo} />
        )}

        {activeTab === 'auditoria' && (
          <AuditoriaLogs />
        )}
      </div>

      {/* Info Notice */}
      <div style={{ marginTop: '32px', padding: '16px', background: '#fffbeb', border: '1px solid #fbbf24', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ fontSize: '20px' }}>ℹ️</div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#92400e', margin: '0 0 8px 0' }}>
              Nota sobre Configuración Avanzada
            </h3>
            <p style={{ fontSize: '13px', color: '#92400e', margin: 0, lineHeight: 1.5 }}>
              Esta es una versión simplificada del módulo de configuración. Las configuraciones se almacenan localmente
              en el navegador. Para funcionalidades avanzadas (roles personalizados, backups, logs de auditoría),
              es necesario implementar el módulo de configuración en el backend Django.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
