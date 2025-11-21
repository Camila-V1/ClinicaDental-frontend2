/**
 * 👤 Formulario de Preferencias de Usuario
 */

import React, { useState } from 'react';
import type { ConfiguracionUsuario } from '@/services/configuracionService';

interface ConfiguracionUsuarioFormProps {
  config: ConfiguracionUsuario;
  onSave: (config: ConfiguracionUsuario) => void;
}

export default function ConfiguracionUsuarioForm({ config, onSave }: ConfiguracionUsuarioFormProps) {
  const [formData, setFormData] = useState<ConfiguracionUsuario>(config);

  const handleToggle = (field: keyof ConfiguracionUsuario) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field: keyof ConfiguracionUsuario, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
        Preferencias de Usuario
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Notificaciones */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
            📧 Notificaciones
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Email */}
            <div
              style={{
                padding: '16px',
                background: '#f9fafb',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: '0 0 4px 0' }}>
                  Notificaciones por Email
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                  Recibir notificaciones importantes por correo electrónico
                </p>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                <input
                  type="checkbox"
                  checked={formData.notificaciones_email}
                  onChange={() => handleToggle('notificaciones_email')}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: formData.notificaciones_email ? '#8b5cf6' : '#d1d5db',
                    borderRadius: '26px',
                    transition: '0.3s',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      content: '""',
                      height: '20px',
                      width: '20px',
                      left: formData.notificaciones_email ? '27px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: '0.3s',
                    }}
                  />
                </span>
              </label>
            </div>

            {/* Sistema */}
            <div
              style={{
                padding: '16px',
                background: '#f9fafb',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: '0 0 4px 0' }}>
                  Notificaciones del Sistema
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                  Mostrar notificaciones en el sistema
                </p>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                <input
                  type="checkbox"
                  checked={formData.notificaciones_sistema}
                  onChange={() => handleToggle('notificaciones_sistema')}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: formData.notificaciones_sistema ? '#8b5cf6' : '#d1d5db',
                    borderRadius: '26px',
                    transition: '0.3s',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      content: '""',
                      height: '20px',
                      width: '20px',
                      left: formData.notificaciones_sistema ? '27px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: '0.3s',
                    }}
                  />
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Apariencia */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
            🎨 Apariencia
          </h3>
          
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
              Tema
            </label>
            <select
              value={formData.tema}
              onChange={(e) => handleChange('tema', e.target.value)}
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
            >
              <option value="light">☀️ Claro</option>
              <option value="dark">🌙 Oscuro</option>
              <option value="auto">🔄 Automático</option>
            </select>
          </div>
        </div>

        {/* Idioma */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
            🌍 Idioma
          </h3>
          
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
              Idioma de Interfaz
            </label>
            <select
              value={formData.idioma}
              onChange={(e) => handleChange('idioma', e.target.value)}
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
            >
              <option value="es-BO">Español (Bolivia)</option>
              <option value="es-ES">Español (España)</option>
              <option value="en-US">English (US)</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button
            type="submit"
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            💾 Guardar Preferencias
          </button>
        </div>
      </form>
    </div>
  );
}
