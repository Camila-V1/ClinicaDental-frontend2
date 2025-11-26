/**
 * 📊 DASHBOARD PAGE - Redirige al dashboard según el rol
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import DoctorDashboard from './DoctorDashboard';

function DashboardPage() {
  const { userType, user } = useAuthContext();
  const navigate = useNavigate();

  // Debug: Ver qué datos tenemos
  console.log('🔍 DashboardPage - userType:', userType);
  console.log('🔍 DashboardPage - user:', user);

  // Normalizar el tipo de usuario a minúsculas para la comparación
  const normalizedUserType = userType?.toLowerCase();
  console.log('🔍 DashboardPage - normalizedUserType:', normalizedUserType);

  // Redirigir a pacientes a su dashboard específico
  useEffect(() => {
    if (normalizedUserType === 'paciente') {
      console.log('🔄 Redirigiendo paciente a /paciente/dashboard');
      navigate('/paciente/dashboard', { replace: true });
    }
  }, [normalizedUserType, navigate]);

  // Renderizar dashboard según el tipo de usuario
  switch (normalizedUserType) {
    case 'admin':
      console.log('✅ Renderizando AdminDashboard');
      return <AdminDashboard />;
    case 'odontologo':
      console.log('✅ Renderizando DoctorDashboard');
      return <DoctorDashboard />;
    case 'paciente':
      // Se redirige en el useEffect, mostrar loading mientras tanto
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🦷</div>
            <p style={{ color: '#666' }}>Redirigiendo a tu panel...</p>
          </div>
        </div>
      );
    default:
      console.log('⚠️ Tipo de usuario no reconocido, mostrando pantalla de carga');
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Cargando dashboard...</h2>
          <p style={{ color: '#666' }}>Tipo de usuario: {userType || 'No detectado'}</p>
          <p style={{ color: '#666' }}>Normalizado: {normalizedUserType || 'No detectado'}</p>
          <p style={{ fontSize: '12px', color: '#999' }}>
            Si este mensaje persiste, verifica los logs de la consola
          </p>
        </div>
      );
  }
}

export default DashboardPage;
