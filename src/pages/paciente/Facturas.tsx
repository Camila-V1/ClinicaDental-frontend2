/** FACTURAS - v0 Design */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, DollarSign, Calendar, ArrowLeft, AlertCircle, FileText } from 'lucide-react';
import { 
  obtenerMisFacturas, 
  obtenerEstadoCuenta,
  type Factura,
  type EstadoCuenta 
} from '../../services/facturacionService';

const Facturas = () => {
  const navigate = useNavigate();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [estadoCuenta, setEstadoCuenta] = useState<EstadoCuenta | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    console.log('💳 [Facturas] Cargando datos financieros...');
    setCargando(true);
    setError(false);

    try {
      const [facturasData, estadoData] = await Promise.all([
        obtenerMisFacturas(),
        obtenerEstadoCuenta()
      ]);
      
      console.log('📊 [Facturas] Datos recibidos del backend:');
      console.log('  → Número de facturas:', facturasData.length);
      console.log('  → Primera factura completa:', facturasData[0]);
      console.log('  → Campos de primera factura:', facturasData[0] ? Object.keys(facturasData[0]) : 'N/A');
      console.log('  → Estado de cuenta:', estadoData);
      
      if (facturasData.length > 0) {
        console.log('🔍 [Facturas] Analizando campos de cada factura:');
        facturasData.forEach((factura, index) => {
          console.log(`  Factura #${index + 1}:`, {
            id: factura.id,
            numero: factura.numero,
            total: factura.total,
            total_tipo: typeof factura.total,
            saldo_pendiente: factura.saldo_pendiente,
            saldo_pendiente_tipo: typeof factura.saldo_pendiente,
            estado: factura.estado,
            fecha_emision: factura.fecha_emision
          });
        });
      }
      
      setFacturas(facturasData);
      setEstadoCuenta(estadoData);
      console.log('✅ [Facturas] Datos cargados exitosamente');
    } catch (err) {
      console.error('❌ [Facturas] Error cargando datos:', err);
      console.error('❌ [Facturas] Error completo:', JSON.stringify(err, null, 2));
      setError(true);
    } finally {
      setCargando(false);
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatMonto = (monto: string | number | null | undefined) => {
    console.log('💰 [formatMonto] Formateando:', { monto, tipo: typeof monto });
    
    if (monto === null || monto === undefined || monto === '') {
      console.log('⚠️ [formatMonto] Valor vacío, retornando $0.00');
      return '$0.00';
    }
    
    const valor = typeof monto === 'string' ? parseFloat(monto) : monto;
    console.log('💰 [formatMonto] Valor parseado:', valor, 'Es NaN?', isNaN(valor));
    
    if (isNaN(valor)) {
      console.log('⚠️ [formatMonto] Valor NaN, retornando $0.00');
      return '$0.00';
    }
    
    const resultado = `$${valor.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    console.log('✅ [formatMonto] Resultado:', resultado);
    return resultado;
  };

  const getBadgeEstado = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return { bg: '#fef3c7', color: '#92400e', text: 'Pendiente' };
      case 'PAGADA':
        return { bg: '#d1fae5', color: '#065f46', text: 'Pagada' };
      case 'VENCIDA':
        return { bg: '#fee2e2', color: '#991b1b', text: 'Vencida' };
      case 'PARCIAL':
        return { bg: '#dbeafe', color: '#1e40af', text: 'Parcial' };
      default:
        return { bg: '#f1f5f9', color: '#475569', text: estado };
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e2e8f0', 
        padding: '24px 32px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Receipt size={28} strokeWidth={1.5} style={{ color: '#0d9488' }} />
          <h1 style={{ margin: 0, fontSize: '28px', color: '#0f172a', fontWeight: '600' }}>
            Mis Facturas
          </h1>
        </div>
        <button 
          onClick={() => navigate('/paciente/dashboard')} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: 'white', 
            border: '1px solid #cbd5e1', 
            color: '#475569', 
            borderRadius: '6px', 
            cursor: 'pointer', 
            fontWeight: '500',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 150ms'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
            e.currentTarget.style.borderColor = '#94a3b8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
          Volver
        </button>
      </div>

      {/* Contenido */}
      <div style={{ padding: '24px 32px', width: '100%', boxSizing: 'border-box' }}>
        {/* Loading */}
        {cargando && (
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            border: '1px solid #e2e8f0',
            padding: '80px', 
            textAlign: 'center' 
          }}>
            <Receipt size={48} strokeWidth={1.5} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
            <p style={{ fontSize: '15px', color: '#94a3b8' }}>Cargando facturas...</p>
          </div>
        )}

        {/* Error */}
        {error && !cargando && (
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            border: '1px solid #e2e8f0',
            padding: '80px', 
            textAlign: 'center' 
          }}>
            <AlertCircle size={48} strokeWidth={1.5} style={{ color: '#ef4444', margin: '0 auto 16px' }} />
            <p style={{ fontSize: '18px', color: '#475569', marginBottom: '20px', fontWeight: '500' }}>
              Error al cargar las facturas
            </p>
            <button
              onClick={cargarDatos}
              style={{
                padding: '10px 20px',
                backgroundColor: '#0d9488',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                transition: 'background-color 150ms'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f766e'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Resumen de Estado de Cuenta */}
        {!cargando && !error && estadoCuenta && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <DollarSign size={20} strokeWidth={1.5} style={{ color: '#0d9488' }} />
              <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: '600' }}>
                Estado de Cuenta
              </h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#f8fafc', 
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                transition: 'border-color 150ms'
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#94a3b8', fontWeight: '500', letterSpacing: '0.3px' }}>
                  Total Facturado
                </p>
                <p style={{ margin: 0, fontSize: '24px', color: '#1e293b', fontWeight: '700' }}>
                  {formatMonto(estadoCuenta.total_facturado)}
                </p>
              </div>

              <div style={{ 
                padding: '16px', 
                backgroundColor: '#d1fae5', 
                borderRadius: '6px',
                border: '1px solid #10b981',
                transition: 'border-color 150ms'
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#065f46', fontWeight: '500', letterSpacing: '0.3px' }}>
                  Total Pagado
                </p>
                <p style={{ margin: 0, fontSize: '24px', color: '#065f46', fontWeight: '700' }}>
                  {formatMonto(estadoCuenta.total_pagado)}
                </p>
              </div>

              <div style={{ 
                padding: '16px', 
                backgroundColor: parseFloat(estadoCuenta.saldo_pendiente) > 0 ? '#fef3c7' : '#d1fae5', 
                borderRadius: '6px',
                border: `1px solid ${parseFloat(estadoCuenta.saldo_pendiente) > 0 ? '#f59e0b' : '#10b981'}`,
                transition: 'border-color 150ms'
              }}>
                <p style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '12px', 
                  color: parseFloat(estadoCuenta.saldo_pendiente) > 0 ? '#92400e' : '#065f46', 
                  fontWeight: '500',
                  letterSpacing: '0.3px'
                }}>
                  Saldo Pendiente
                </p>
                <p style={{ 
                  margin: 0, 
                  fontSize: '24px', 
                  color: parseFloat(estadoCuenta.saldo_pendiente) > 0 ? '#92400e' : '#065f46', 
                  fontWeight: '700' 
                }}>
                  {formatMonto(estadoCuenta.saldo_pendiente)}
                </p>
              </div>

              <div style={{ 
                padding: '16px', 
                backgroundColor: '#f8fafc', 
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                transition: 'border-color 150ms'
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#94a3b8', fontWeight: '500', letterSpacing: '0.3px' }}>
                  Facturas
                </p>
                <p style={{ margin: 0, fontSize: '24px', color: '#1e293b', fontWeight: '700' }}>
                  {estadoCuenta.total_facturas}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#64748b' }}>
                  {estadoCuenta.facturas_pendientes} pendientes
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Facturas */}
        {!cargando && !error && (
          <>
            {facturas.length === 0 ? (
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0',
                padding: '80px', 
                textAlign: 'center' 
              }}>
                <Receipt size={64} strokeWidth={1.5} style={{ color: '#cbd5e1', margin: '0 auto 20px' }} />
                <p style={{ fontSize: '18px', color: '#475569', fontWeight: '500' }}>
                  No tienes facturas registradas
                </p>
              </div>
            ) : (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <FileText size={20} strokeWidth={1.5} style={{ color: '#0d9488' }} />
                  <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: '600' }}>
                    Historial de Facturas
                  </h2>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {facturas.map((factura) => {
                    const badge = getBadgeEstado(factura.estado);
                    
                    return (
                      <div
                        key={factura.id}
                        style={{
                          padding: '16px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 150ms',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                        onClick={() => navigate(`/paciente/facturas/${factura.id}`)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#cbd5e1';
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.backgroundColor = 'white';
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <Receipt size={18} strokeWidth={1.5} style={{ color: '#64748b' }} />
                            <span style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                              {factura.numero}
                            </span>
                            <span
                              style={{
                                padding: '4px 12px',
                                backgroundColor: badge.bg,
                                color: badge.color,
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                border: `1px solid ${badge.color}30`
                              }}
                            >
                              {badge.text}
                            </span>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#64748b' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={14} strokeWidth={1.5} />
                              <span>{formatFecha(factura.fecha_emision)}</span>
                            </div>
                            {factura.fecha_vencimiento && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Calendar size={14} strokeWidth={1.5} />
                                <span>Vence: {formatFecha(factura.fecha_vencimiento)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
                            Total
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                            <DollarSign size={18} strokeWidth={1.5} style={{ color: '#0d9488' }} />
                            <p style={{ margin: 0, fontSize: '20px', color: '#0d9488', fontWeight: '700' }}>
                              {formatMonto(factura.total)}
                            </p>
                          </div>
                          {factura.saldo_pendiente && parseFloat(factura.saldo_pendiente.toString()) > 0 && (
                            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#dc2626', fontWeight: '500' }}>
                              Pendiente: {formatMonto(factura.saldo_pendiente)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Facturas;

