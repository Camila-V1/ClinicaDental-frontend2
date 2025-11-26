/**
 * 📝 REGISTRO DE CLÍNICA - Página Pública con Pago
 * Guía 46: Formulario de registro con pago automático
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import tenantsService, { Plan } from '../../services/tenantsService';
import registroService from '../../services/registroService';

export default function RegistroClinica() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1); // 1: Formulario, 2: Seleccionar Pago
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPlanes, setLoadingPlanes] = useState(true);
  const [solicitudId, setSolicitudId] = useState<number | null>(null);
  const [tokenSolicitud, setTokenSolicitud] = useState<string>('');
  const [formData, setFormData] = useState({
    nombre_clinica: '',
    dominio_deseado: '',
    nombre_contacto: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: 'Bolivia',
    plan_solicitado: ''
  });

  useEffect(() => {
    cargarPlanes();
  }, []);

  const cargarPlanes = async () => {
    try {
      const data = await tenantsService.getPlanes();
      setPlanes(data.filter(p => p.activo));
    } catch (error) {
      console.error('Error al cargar planes:', error);
      toast.error('Error al cargar planes disponibles');
    } finally {
      setLoadingPlanes(false);
    }
  };

  const validarDominio = (dominio: string): boolean => {
    const regex = /^[a-z0-9-]+$/;
    return regex.test(dominio);
  };

  const handleDominioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData({ ...formData, dominio_deseado: valor });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarDominio(formData.dominio_deseado)) {
      toast.error('El dominio solo puede contener letras minúsculas, números y guiones');
      return;
    }

    if (formData.dominio_deseado.length < 3) {
      toast.error('El dominio debe tener al menos 3 caracteres');
      return;
    }
    
    setLoading(true);
    try {
      const response = await registroService.crearSolicitud({
        ...formData,
        plan_solicitado: parseInt(formData.plan_solicitado)
      });
      
      setSolicitudId(response.solicitud_id);
      setTokenSolicitud(response.token);
      setStep(2);
      toast.success('✅ Solicitud creada. Selecciona tu método de pago.');
    } catch (error: any) {
      console.error('Error al enviar solicitud:', error);
      const mensaje = error.response?.data?.error || 
                     error.response?.data?.dominio_deseado?.[0] ||
                     'Error al enviar solicitud';
      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const handlePagar = async (metodoPago: 'STRIPE' | 'PAYPAL' | 'MERCADOPAGO') => {
    if (!solicitudId) return;

    setLoading(true);
    try {
      const returnUrl = `${window.location.origin}/registro/confirmacion/${solicitudId}`;
      const cancelUrl = `${window.location.origin}/registro`;

      const response = await registroService.iniciarPago(
        solicitudId,
        metodoPago,
        returnUrl,
        cancelUrl
      );

      // Redirigir a la pasarela de pago
      window.location.href = response.payment_url;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error iniciando pago');
      setLoading(false);
    }
  };

  const planSeleccionado = planes.find(p => p.id === parseInt(formData.plan_solicitado));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            🦷 Registra tu Clínica Dental
          </h1>
          <p className="text-lg text-gray-600">
            Completa el formulario y comienza a digitalizar tu clínica
          </p>
        </div>

        {/* Card del formulario */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información de la Clínica */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                📋 Información de la Clínica
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Clínica *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre_clinica}
                    onChange={(e) => setFormData({ ...formData, nombre_clinica: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Clínica Dental Santa Cruz"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dominio Web Deseado *
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      required
                      pattern="[a-z0-9-]{3,}"
                      value={formData.dominio_deseado}
                      onChange={handleDominioChange}
                      className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="mi-clinica"
                    />
                    <span className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg px-4 py-2 text-sm text-gray-600 font-medium">
                      .clinica.com
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Solo letras minúsculas, números y guiones. Mínimo 3 caracteres.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ciudad}
                    onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Santa Cruz"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País *
                  </label>
                  <select
                    required
                    value={formData.pais}
                    onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Bolivia">Bolivia</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Chile">Chile</option>
                    <option value="Perú">Perú</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Av. Principal #123"
                  />
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                👤 Información de Contacto
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre_contacto}
                    onChange={(e) => setFormData({ ...formData, nombre_contacto: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dr. Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+591 7012345678"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="contacto@clinica.com"
                  />
                </div>
              </div>
            </div>

            {/* Selección de Plan */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                💎 Selecciona tu Plan
              </h2>
              
              {loadingPlanes ? (
                <div className="text-center py-4 text-gray-500">Cargando planes...</div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {planes.map(plan => (
                    <label
                      key={plan.id}
                      className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.plan_solicitado === plan.id.toString()
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="plan"
                        value={plan.id}
                        checked={formData.plan_solicitado === plan.id.toString()}
                        onChange={(e) => setFormData({ ...formData, plan_solicitado: e.target.value })}
                        required
                        className="mt-1"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-lg">{plan.nombre}</p>
                            <p className="text-sm text-gray-600 mt-1">{plan.descripcion}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">
                              Bs. {parseFloat(plan.precio).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">/mes</p>
                          </div>
                        </div>
                        <div className="mt-2 flex gap-4 text-sm text-gray-600">
                          <span>👥 Hasta {plan.max_usuarios} usuarios</span>
                          <span>👨‍⚕️ Hasta {plan.max_pacientes} pacientes</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Botón de envío */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading || loadingPlanes}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-green-700 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all"
              >
                {loading ? '⏳ Enviando solicitud...' : '🚀 Enviar Solicitud'}
              </button>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                Al enviar la solicitud, recibirás un correo de confirmación y nos pondremos en contacto contigo pronto.
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline font-medium"
          >
            ← Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
}
