/**
 * 📊 DASHBOARD PAGE - Redirige al dashboard según el rol
 */

import { useAuthContext } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import DoctorDashboard from './DoctorDashboard';
import PacienteDashboard from './PacienteDashboard';

function DashboardPage() {
  const { userType, user } = useAuthContext();

  // Debug: Ver qué datos tenemos
  console.log('🔍 DashboardPage - userType:', userType);
  console.log('🔍 DashboardPage - user:', user);

  // Normalizar el tipo de usuario a minúsculas para la comparación
  const normalizedUserType = userType?.toLowerCase();
  console.log('🔍 DashboardPage - normalizedUserType:', normalizedUserType);

  // Renderizar dashboard según el tipo de usuario
  switch (normalizedUserType) {
    case 'admin':
      console.log('✅ Renderizando AdminDashboard');
      return <AdminDashboard />;
    case 'odontologo':
      console.log('✅ Renderizando DoctorDashboard');
      return <DoctorDashboard />;
    case 'paciente':
      console.log('✅ Renderizando PacienteDashboard');
      return <PacienteDashboard />;
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
