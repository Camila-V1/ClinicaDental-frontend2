/**
 * 👑 DASHBOARD ADMIN - Redirige al nuevo panel de administración
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir al nuevo dashboard admin
    navigate('/admin/dashboard', { replace: true });
  }, [navigate]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔄</div>
        <p style={{ color: '#666', fontSize: '16px' }}>Redirigiendo al panel de administración...</p>
      </div>
    </div>
  );
}

export default AdminDashboard;
