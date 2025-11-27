/**
 * 🎨 Layout del Panel de Administración
 */

import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCog, Calendar, FileText, 
  DollarSign, Package, BarChart3, Shield, Settings,
  Menu, X, LogOut, Bell, Database
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/usuarios', icon: Users, label: 'Equipo' },
    { path: '/admin/pacientes', icon: UserCog, label: 'Pacientes' },
    { path: '/admin/agenda', icon: Calendar, label: 'Agenda' },
    { path: '/admin/tratamientos', icon: FileText, label: 'Tratamientos' },
    { path: '/admin/facturacion', icon: DollarSign, label: 'Facturación' },
    { path: '/admin/inventario', icon: Package, label: 'Inventario' },
    { path: '/admin/reportes', icon: BarChart3, label: 'Reportes' },
    { path: '/admin/bitacora', icon: Shield, label: 'Bitácora' },
    { path: '/admin/backups', icon: Database, label: 'Backups' },
    { path: '/admin/configuracion', icon: Settings, label: 'Configuración' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden', backgroundColor: '#f9fafb' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '256px' : '80px',
        backgroundColor: 'white',
        borderRight: '1px solid #e5e7eb',
        color: '#374151',
        transition: 'all 0.3s',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      }}>
        {/* Logo */}
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          borderBottom: '1px solid #f3f4f6'
        }}>
          {sidebarOpen && (
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e40af', margin: 0 }}>Admin Panel</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  borderLeft: active ? '4px solid #2563eb' : '4px solid transparent',
                  backgroundColor: active ? '#eff6ff' : 'transparent',
                  color: active ? '#1d4ed8' : '#4b5563',
                  fontWeight: active ? '500' : 'normal'
                }}
                onMouseOver={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    e.currentTarget.style.color = '#2563eb';
                  }
                }}
                onMouseOut={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#4b5563';
                  }
                }}
              >
                <Icon size={20} style={{ flexShrink: 0, color: active ? '#2563eb' : 'inherit' }} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div style={{ borderTop: '1px solid #f3f4f6', padding: '16px', backgroundColor: '#f9fafb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? '12px' : '0', justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #bfdbfe'
            }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1d4ed8' }}>
                {user?.nombre?.[0] || 'A'}
              </span>
            </div>
            {sidebarOpen && (
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: 0 }}>{user?.nombre || 'Admin'}</p>
                <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', margin: 0 }}>{user?.tipo_usuario || 'ADMIN'}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            style={{
              marginTop: '12px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px 16px',
              color: '#dc2626',
              backgroundColor: 'white',
              border: '1px solid #fee2e2',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#fef2f2';
              e.currentTarget.style.borderColor = '#fecaca';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#fee2e2';
            }}
          >
            <LogOut size={16} />
            {sidebarOpen && <span style={{ fontSize: '14px', fontWeight: '500' }}>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#f9fafb' }}>
        {/* Header */}
        <header style={{
          height: '64px',
          backgroundColor: 'white',
          borderBottom: '2px solid #2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              {menuItems.find(item => item.path === location.pathname)?.label || 'Admin'}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{
              padding: '8px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Bell size={20} style={{ color: '#4b5563' }} />
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                backgroundColor: '#ef4444',
                borderRadius: '50%',
                border: '2px solid white'
              }}></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
