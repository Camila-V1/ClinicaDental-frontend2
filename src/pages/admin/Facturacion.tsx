/**
 * 💰 Página de Facturación - Admin
 * Corregido: Manejo de errores y persistencia de datos
 */

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import facturacionService, { type Factura, type Pago, type FacturaCreateData, type PagoCreateData } from '@/services/facturacionAdminService';
import FacturasList from '@/components/admin/FacturasList';
import FacturaModal from '@/components/admin/FacturaModal';
import PagosList from '@/components/admin/PagosList';
import PagoModal from '@/components/admin/PagoModal';

export default function Facturacion() {
  const [activeTab, setActiveTab] = useState<'facturas' | 'pagos'>('facturas');
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  
  // Modals
  const [facturaModalOpen, setFacturaModalOpen] = useState(false);
  const [pagoModalOpen, setPagoModalOpen] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [selectedPago, setSelectedPago] = useState<Pago | null>(null);

  const queryClient = useQueryClient();

  // ==================== QUERIES ====================
  
  const { 
    data: facturasData, 
    isLoading: loadingFacturas,
    isError: isErrorFacturas,
    error: errorFacturas
  } = useQuery({
    queryKey: ['admin-facturas', searchTerm, estadoFilter, fechaDesde, fechaHasta],
    queryFn: async () => {
      console.log("📡 Fetching facturas con filtros:", { searchTerm, estadoFilter });
      const res = await facturacionService.getFacturas({
        search: searchTerm || undefined,
        estado: estadoFilter || undefined,
        fecha_desde: fechaDesde || undefined,
        fecha_hasta: fechaHasta || undefined,
      });
      return res;
    },
    placeholderData: keepPreviousData, // Mantiene los datos anteriores mientras carga los nuevos
    retry: 1,
  });

  const { 
    data: pagosData, 
    isLoading: loadingPagos,
    isError: isErrorPagos
  } = useQuery({
    queryKey: ['admin-pagos'],
    queryFn: () => facturacionService.getPagos(),
  });

  // Debugging: Ver qué llega realmente
  useEffect(() => {
    if (facturasData) {
      console.log("✅ Facturas Data en Componente:", facturasData);
      console.log("📏 Cantidad:", Array.isArray(facturasData) ? facturasData.length : 'No es array');
    }
    if (isErrorFacturas) {
      console.error("❌ Error cargando facturas:", errorFacturas);
    }
  }, [facturasData, isErrorFacturas, errorFacturas]);

  // ==================== MUTATIONS ====================

  const saveFacturaMutation = useMutation({
    mutationFn: (data: FacturaCreateData) => 
      selectedFactura 
        ? facturacionService.updateFactura(selectedFactura.id, data)
        : facturacionService.createFactura(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-facturas'] });
      toast.success(selectedFactura ? 'Factura actualizada' : 'Factura creada');
      setFacturaModalOpen(false);
      setSelectedFactura(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al guardar factura');
    },
  });

  const deleteFacturaMutation = useMutation({
    mutationFn: (id: number) => facturacionService.deleteFactura(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-facturas'] });
      toast.success('Factura eliminada');
    },
    onError: () => toast.error('Error al eliminar factura'),
  });

  const marcarPagadaMutation = useMutation({
    mutationFn: (id: number) => facturacionService.marcarPagada(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-facturas'] });
      toast.success('Factura marcada como pagada');
    },
    onError: () => toast.error('Error al marcar factura como pagada'),
  });

  const cancelarFacturaMutation = useMutation({
    mutationFn: (id: number) => facturacionService.cancelarFactura(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-facturas'] });
      toast.success('Factura cancelada');
    },
    onError: () => toast.error('Error al cancelar factura'),
  });

  const savePagoMutation = useMutation({
    mutationFn: (data: PagoCreateData) => 
      selectedPago 
        ? facturacionService.updatePago(selectedPago.id, data)
        : facturacionService.createPago(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pagos'] });
      queryClient.invalidateQueries({ queryKey: ['admin-facturas'] });
      toast.success(selectedPago ? 'Pago actualizado' : 'Pago registrado');
      setPagoModalOpen(false);
      setSelectedPago(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al guardar pago');
    },
  });

  const deletePagoMutation = useMutation({
    mutationFn: (id: number) => facturacionService.deletePago(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pagos'] });
      queryClient.invalidateQueries({ queryKey: ['admin-facturas'] });
      toast.success('Pago eliminado');
    },
    onError: () => toast.error('Error al eliminar pago'),
  });

  const anularPagoMutation = useMutation({
    mutationFn: (id: number) => facturacionService.anularPago(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pagos'] });
      queryClient.invalidateQueries({ queryKey: ['admin-facturas'] });
      toast.success('Pago anulado');
    },
    onError: () => toast.error('Error al anular pago'),
  });

  // ==================== HANDLERS ====================

  const handleEditFactura = (factura: Factura) => {
    setSelectedFactura(factura);
    setFacturaModalOpen(true);
  };

  const handleDeleteFactura = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta factura?')) {
      deleteFacturaMutation.mutate(id);
    }
  };

  const handleMarcarPagada = (id: number) => {
    if (window.confirm('¿Marcar esta factura como pagada?')) {
      marcarPagadaMutation.mutate(id);
    }
  };

  const handleCancelarFactura = (id: number) => {
    if (window.confirm('¿Está seguro de cancelar esta factura?')) {
      cancelarFacturaMutation.mutate(id);
    }
  };

  const handleEditPago = (pago: Pago) => {
    setSelectedPago(pago);
    setPagoModalOpen(true);
  };

  const handleDeletePago = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este pago?')) {
      deletePagoMutation.mutate(id);
    }
  };

  const handleAnularPago = (id: number) => {
    if (window.confirm('¿Está seguro de anular este pago?')) {
      anularPagoMutation.mutate(id);
    }
  };

  // Safe default
  const facturas = Array.isArray(facturasData) ? facturasData : [];
  const pagos = Array.isArray(pagosData) ? pagosData : [];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          💰 Facturación y Pagos
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Gestión financiera de la clínica
        </p>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '2px solid #e5e7eb', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('facturas')}
            style={{
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: '500',
              color: activeTab === 'facturas' ? '#10b981' : '#6b7280',
              borderBottom: activeTab === 'facturas' ? '3px solid #10b981' : '3px solid transparent',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            📄 Facturas
          </button>
          <button
            onClick={() => setActiveTab('pagos')}
            style={{
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: '500',
              color: activeTab === 'pagos' ? '#10b981' : '#6b7280',
              borderBottom: activeTab === 'pagos' ? '3px solid #10b981' : '3px solid transparent',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            💳 Pagos
          </button>
        </div>
      </div>

      {/* Facturas Tab */}
      {activeTab === 'facturas' && (
        <>
          {/* Search and Filters */}
          <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 300px' }}>
              <input
                type="text"
                placeholder="🔍 Buscar por paciente o número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#111827',
                  outline: 'none',
                }}
              />
            </div>
            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              style={{
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#111827',
                backgroundColor: 'white',
                outline: 'none',
                minWidth: '150px',
              }}
            >
              <option value="">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="PAGADA">Pagada</option>
              <option value="VENCIDA">Vencida</option>
              <option value="ANULADA">Anulada</option>
            </select>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              style={{
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#111827',
                outline: 'none',
              }}
            />
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              style={{
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#111827',
                outline: 'none',
              }}
            />
            <button
              onClick={() => {
                setSelectedFactura(null);
                setFacturaModalOpen(true);
              }}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              ➕ Nueva Factura
            </button>
          </div>

          {/* ERROR HANDLING DISPLAY */}
          {isErrorFacturas ? (
            <div style={{ padding: '20px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', textAlign: 'center' }}>
              ❌ Error cargando facturas. Intente recargar la página.
            </div>
          ) : (
            <FacturasList
              facturas={facturas}
              loading={loadingFacturas}
              onEdit={handleEditFactura}
              onDelete={handleDeleteFactura}
              onMarcarPagada={handleMarcarPagada}
              onCancelar={handleCancelarFactura}
            />
          )}
        </>
      )}

      {/* Pagos Tab */}
      {activeTab === 'pagos' && (
        <>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                setSelectedPago(null);
                setPagoModalOpen(true);
              }}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              ➕ Registrar Pago
            </button>
          </div>

          {isErrorPagos ? (
             <div style={{ padding: '20px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', textAlign: 'center' }}>
               ❌ Error cargando pagos.
             </div>
          ) : (
            <PagosList
              pagos={pagos}
              loading={loadingPagos}
              onEdit={handleEditPago}
              onDelete={handleDeletePago}
              onAnular={handleAnularPago}
            />
          )}
        </>
      )}

      {/* Modals */}
      <FacturaModal
        isOpen={facturaModalOpen}
        onClose={() => {
          setFacturaModalOpen(false);
          setSelectedFactura(null);
        }}
        factura={selectedFactura}
        onSubmit={(data) => saveFacturaMutation.mutate(data)}
        isLoading={saveFacturaMutation.isPending}
      />

      <PagoModal
        isOpen={pagoModalOpen}
        onClose={() => {
          setPagoModalOpen(false);
          setSelectedPago(null);
        }}
        pago={selectedPago}
        facturas={facturas}
        onSubmit={(data) => savePagoMutation.mutate(data)}
        isLoading={savePagoMutation.isPending}
      />
    </div>
  );
}
