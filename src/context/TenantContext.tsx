/**
 * 🏢 CONTEXT DE TENANT
 * Maneja el estado global del tenant actual
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getCurrentTenant, getApiBaseUrl, isPublicSchema, switchTenant as switchToTenant } from '../config/tenantConfig';

interface TenantContextType {
  tenant: string;
  isPublic: boolean;
  apiBaseUrl: string;
  loading: boolean;
  switchTenant: (newTenant: string) => void;
  refreshTenant: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

export function TenantProvider({ children }: TenantProviderProps) {
  const [tenant, setTenant] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const refreshTenant = () => {
    const currentTenant = getCurrentTenant();
    setTenant(currentTenant);
    console.log('🏢 Tenant detectado:', currentTenant);
    console.log('🌐 API Base URL:', getApiBaseUrl());
  };

  useEffect(() => {
    refreshTenant();
    setLoading(false);
  }, []);

  const value: TenantContextType = {
    tenant,
    isPublic: isPublicSchema(),
    apiBaseUrl: getApiBaseUrl(),
    loading,
    switchTenant: switchToTenant,
    refreshTenant,
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            border: '4px solid #e0e0e0',
            borderTop: '4px solid #333',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#666', fontSize: '14px' }}>Cargando tenant...</p>
        </div>
      </div>
    );
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

/**
 * 🪝 Hook para usar el contexto de tenant
 */
export function useTenant() {
  const context = useContext(TenantContext);
  
  if (!context) {
    throw new Error('useTenant debe usarse dentro de TenantProvider');
  }
  
  return context;
}
