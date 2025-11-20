/**
 * 🎨 Layout del Panel de Administración
 */

import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCog, Calendar, FileText, 
  DollarSign, Package, BarChart3, Shield, Settings,
  Menu, X, LogOut, Bell
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
    { path: '/admin/configuracion', icon: Settings, label: 'Configuración' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          {sidebarOpen && (
            <h1 className="text-xl font-bold">Admin Panel</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-800 p-4">
          <div className={`flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-sm font-medium">
                {user?.nombre?.[0] || 'A'}
              </span>
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium">{user?.nombre || 'Admin'}</p>
                <p className="text-xs text-gray-400">{user?.tipo_usuario || 'ADMIN'}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span className="text-sm">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Admin'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
