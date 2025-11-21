/**
 * ⚙️ Formulario de Configuración General
 */

import React, { useState } from 'react';
import type { ConfiguracionGeneral } from '@/services/configuracionService';

interface ConfiguracionGeneralFormProps {
  config: ConfiguracionGeneral;
  onSave: (config: ConfiguracionGeneral) => void;
}

export default function ConfiguracionGeneralForm({ config, onSave }: ConfiguracionGeneralFormProps) {
  const [formData, setFormData] = useState<ConfiguracionGeneral>(config);

  const handleChange = (field: keyof ConfiguracionGeneral, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
        Configuración General del Sistema
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Nombre del Sistema */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Nombre del Sistema
          </label>
          <input
            type="text"
            value={formData.nombre_sistema}
            onChange={(e) => handleChange('nombre_sistema', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              outline: 'none',
            }}
          />
        </div>

        {/* Versión */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Versión
          </label>
          <input
            type="text"
            value={formData.version}
            onChange={(e) => handleChange('version', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              outline: 'none',
            }}
          />
        </div>

        {/* Timezone */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Zona Horaria
          </label>
          <select
            value={formData.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
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
            <option value="America/La_Paz">America/La Paz (Bolivia)</option>
            <option value="America/Lima">America/Lima (Perú)</option>
            <option value="America/Santiago">America/Santiago (Chile)</option>
            <option value="America/Buenos_Aires">America/Buenos Aires (Argentina)</option>
            <option value="America/Bogota">America/Bogotá (Colombia)</option>
          </select>
        </div>

        {/* Idioma */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Idioma del Sistema
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
            <option value="es-MX">Español (México)</option>
            <option value="en-US">English (US)</option>
          </select>
        </div>

        {/* Moneda */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Moneda
          </label>
          <select
            value={formData.moneda}
            onChange={(e) => handleChange('moneda', e.target.value)}
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
            <option value="BOB">BOB - Boliviano</option>
            <option value="USD">USD - Dólar</option>
            <option value="PEN">PEN - Sol Peruano</option>
            <option value="CLP">CLP - Peso Chileno</option>
            <option value="ARS">ARS - Peso Argentino</option>
          </select>
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
            💾 Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
