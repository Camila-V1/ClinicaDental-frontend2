/**
 * 💰 Página de Facturación - Admin
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  
  const { data: facturasData, isLoading: loadingFacturas } = useQuery({
    queryKey: ['admin-facturas', searchTerm, estadoFilter, fechaDesde, fechaHasta],
    queryFn: () => facturacionService.getFacturas({
      search: searchTerm || undefined,
      estado: estadoFilter || undefined,
      fecha_desde: fechaDesde || undefined,
      fecha_hasta: fechaHasta || undefined,
    }),
  });

  const { data: pagosData, isLoading: loadingPagos } = useQuery({
    queryKey: ['admin-pagos'],
    queryFn: () => facturacionService.getPagos(),
  });

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

  const facturas = facturasData || [];
  const pagos = pagosData || [];

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

          <FacturasList
            facturas={facturas}
            loading={loadingFacturas}
            onEdit={handleEditFactura}
            onDelete={handleDeleteFactura}
            onMarcarPagada={handleMarcarPagada}
            onCancelar={handleCancelarFactura}
          />
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

          <PagosList
            pagos={pagos}
            loading={loadingPagos}
            onEdit={handleEditPago}
            onDelete={handleDeletePago}
            onAnular={handleAnularPago}
          />
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
