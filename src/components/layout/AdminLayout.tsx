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
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 text-gray-700 transition-all duration-300 flex flex-col shadow-sm`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-blue-800">Admin Panel</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 border-l-4 ${
                  active
                    ? 'bg-blue-50 border-blue-600 text-blue-700 font-medium'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className={`flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
              <span className="text-sm font-bold text-blue-700">
                {user?.nombre?.[0] || 'A'}
              </span>
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{user?.nombre || 'Admin'}</p>
                <p className="text-xs text-gray-500 font-medium">{user?.tipo_usuario || 'ADMIN'}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-white border border-red-100 rounded-lg hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span className="text-sm font-medium">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Header */}
        <header className="h-16 bg-white border-b-2 border-blue-600 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Admin'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full relative transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
