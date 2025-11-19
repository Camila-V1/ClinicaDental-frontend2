import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerDetalleFactura, obtenerPagosFactura } from '../../services/facturacionService';
import { Activity, AlertCircle, ArrowLeft, Receipt, Calendar, DollarSign, CheckCircle, Clock } from 'lucide-react';

export default function DetalleFactura() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [factura, setFactura] = useState<any>(null);
  const [pagos, setPagos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);

      const facturaId = parseInt(id || '0');
      
      const [facturaData, pagosData] = await Promise.all([
        obtenerDetalleFactura(facturaId),
        obtenerPagosFactura(facturaId).catch(() => [])
      ]);

      setFactura(facturaData);
      setPagos(Array.isArray(pagosData) ? pagosData : (pagosData as any).pagos || []);
    } catch (err: any) {
      console.error('❌ Error cargando factura:', err);
      setError(err.response?.data?.detail || 'Error al cargar los datos de la factura');
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fechaISO: string) => {
    return new Date(fechaISO).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatearMonto = (monto: string | number) => {
    const numero = typeof monto === 'string' ? parseFloat(monto) : monto;
    return `Bs. ${numero.toFixed(2)}`;
  };

  const getEstadoColor = (estado: string) => {
    const colores: any = {
      'PENDIENTE': { bg: '#fef3c7', text: '#92400e' },
      'PAGADA': { bg: '#d1fae5', text: '#065f46' },
      'CANCELADA': { bg: '#fee2e2', text: '#991b1b' },
      'PARCIAL': { bg: '#dbeafe', text: '#1e40af' }
    };
    return colores[estado.toUpperCase()] || colores['PENDIENTE'];
  };

  const getMetodoPagoIcono = (metodo: string) => {
    const iconos: any = {
      'EFECTIVO': '💵',
      'TRANSFERENCIA': '🏦',
      'TARJETA': '💳',
      'CHEQUE': '📝'
    };
    return iconos[metodo.toUpperCase()] || '💰';
  };

  const getMetodoPagoColor = (metodo: string) => {
    const colores: any = {
      'EFECTIVO': { bg: '#d1fae5', text: '#065f46' },
      'TRANSFERENCIA': { bg: '#dbeafe', text: '#1e40af' },
      'TARJETA': { bg: '#e9d5ff', text: '#6b21a8' },
      'CHEQUE': { bg: '#fef3c7', text: '#92400e' }
    };
    return colores[metodo.toUpperCase()] || { bg: '#f3f4f6', text: '#374151' };
  };

  if (cargando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '60px 80px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <Activity size={40} strokeWidth={1.5} style={{ color: '#0d9488', margin: '0 auto 16px' }} className="animate-spin" />
          <p style={{ fontSize: '15px', color: '#64748b', fontWeight: '500' }}>Cargando factura...</p>
        </div>
      </div>
    );
  }

  if (error || !factura) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ backgroundColor: '#fee2e2', borderLeft: '3px solid #dc2626', borderRadius: '6px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
            <AlertCircle size={24} strokeWidth={1.5} style={{ color: '#991b1b', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#991b1b', fontWeight: '600', fontSize: '16px', margin: '0 0 8px 0' }}>Error</h3>
              <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>{error || 'Factura no encontrada'}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/paciente/facturas')}
            style={{
              marginTop: '16px',
              padding: '10px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 150ms'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            Volver a Facturas
          </button>
        </div>
      </div>
    );
  }

  const estadoColor = getEstadoColor(factura.estado);
  
  // Obtener valores correctos de la factura
  const total = parseFloat(factura.total || factura.monto_total || '0');
  const pagado = parseFloat(factura.pagado || factura.monto_pagado || '0');
  const saldo = parseFloat(factura.saldo || factura.saldo_pendiente || (total - pagado).toString());
  const porcentajePagado = total > 0 ? (pagado / total) * 100 : 0;

  return (
    <div style={{ width: '100%', padding: '32px', boxSizing: 'border-box', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => navigate('/paciente/facturas')}
          style={{
            color: '#64748b',
            fontWeight: '500',
            marginBottom: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: 0,
            transition: 'color 150ms'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#0d9488'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Volver a Facturas
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
              Factura #{factura.numero || factura.id}
            </h1>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Emitida el {formatearFecha(factura.fecha_emision || factura.created_at)}
            </p>
          </div>
          <span style={{
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            backgroundColor: estadoColor.bg,
            color: estadoColor.text
          }}>
            {factura.estado}
          </span>
        </div>
      </div>

      {/* Información del Paciente */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px', padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
          👤 Datos del Paciente
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Nombre Completo</p>
            <p style={{ fontWeight: '500', color: '#111827', margin: 0 }}>{factura.paciente_nombre}</p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>CI/NIT</p>
            <p style={{ fontWeight: '500', color: '#111827', margin: 0 }}>{factura.nit_ci || factura.paciente_ci || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Resumen Financiero */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px', padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
          💰 Resumen Financiero
        </h2>
        
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb', marginBottom: '12px' }}>
            <span style={{ color: '#374151' }}>Total de la Factura</span>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>
              {formatearMonto(total)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#374151' }}>Monto Pagado</span>
            <span style={{ fontSize: '18px', fontWeight: '600', color: '#059669' }}>
              {formatearMonto(pagado)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
            <span style={{ color: '#374151', fontWeight: '500' }}>Saldo Pendiente</span>
            <span style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: saldo > 0 ? '#dc2626' : '#059669' 
            }}>
              {formatearMonto(saldo)}
            </span>
          </div>
        </div>

        {/* Barra de Progreso */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            <span>Progreso de Pago</span>
            <span>{porcentajePagado.toFixed(1)}%</span>
          </div>
          <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '12px' }}>
            <div
              style={{
                backgroundColor: '#059669',
                height: '12px',
                borderRadius: '9999px',
                width: `${porcentajePagado}%`,
                transition: 'width 0.5s'
              }}
            />
          </div>
        </div>
      </div>

      {/* Historial de Pagos */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
            📋 Historial de Pagos
          </h2>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            {pagos.length} {pagos.length === 1 ? 'pago' : 'pagos'}
          </span>
        </div>

        {pagos.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pagos.map((pago: any) => {
              const metodoCo = getMetodoPagoColor(pago.metodo_pago || pago.metodo);
              return (
                <div
                  key={pago.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '28px' }}>
                      {getMetodoPagoIcono(pago.metodo_pago || pago.metodo)}
                    </span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <p style={{ fontWeight: '600', color: '#111827', margin: 0 }}>
                          {formatearMonto(pago.monto || pago.monto_pagado)}
                        </p>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: metodoCo.bg,
                          color: metodoCo.text
                        }}>
                          {pago.metodo_pago || pago.metodo}
                        </span>
                      </div>
                      <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
                        {formatearFecha(pago.fecha_pago)}
                      </p>
                      {pago.referencia && (
                        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', marginBottom: 0 }}>
                          Ref: {pago.referencia}
                        </p>
                      )}
                      {pago.notas && (
                        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px', fontStyle: 'italic', marginBottom: 0 }}>
                          "{pago.notas}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
            <span style={{ fontSize: '48px' }}>📭</span>
            <p style={{ marginTop: '8px' }}>No hay pagos registrados aún</p>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => navigate('/paciente/facturas')}
          style={{
            flex: 1,
            padding: '12px 24px',
            backgroundColor: '#e5e7eb',
            color: '#374151',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '14px'
          }}
        >
          ← Volver
        </button>
        
        {parseFloat(factura.saldo || factura.saldo_pendiente || '0') > 0 && (
          <button
            onClick={() => alert('Funcionalidad de pago en desarrollo')}
            style={{
              flex: 1,
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            💳 Realizar Pago
          </button>
        )}
      </div>

    </div>
  );
}
