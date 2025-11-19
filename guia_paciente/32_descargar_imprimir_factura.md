# 32 - Descargar e Imprimir Factura (Generación Frontend)

## 🎯 Objetivo
Implementar la funcionalidad para que el paciente pueda descargar e imprimir sus facturas en formato PDF, con un diseño profesional generado completamente en el frontend usando `jsPDF`.

---

## 📋 Prerequisitos
- ✅ Login funcional (Guía 01)
- ✅ Ver lista de facturas (Guía 12)
- ✅ Ver detalle de factura (Guía 13)
- ✅ Service `facturacionService.ts` configurado

---

## 🔌 Backend

**Nota Importante**: El backend actual **NO** tiene endpoint de generación de PDF (`generar-pdf/`), por lo que implementaremos la generación **completamente en el frontend** usando la librería `jsPDF`.

### Endpoint Usado (existente)
```
GET /api/facturacion/facturas/{id}/
```

Este endpoint ya existe y devuelve la factura completa con:
- Información de la factura
- Items facturados
- Pagos realizados
- Totales y saldo

---

## 💻 Implementación Frontend

### **Paso 1: Instalar Dependencias**

```bash
npm install jspdf jspdf-autotable
npm install --save-dev @types/jspdf
```

---

### **Paso 2: Crear Utilidad de Generación de PDF**

**Archivo:** `src/utils/generadorFacturaPDF.ts` (nuevo)

```typescript
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Factura } from '../services/facturacionService';

interface ClinicaInfo {
  nombre?: string;
  ruc?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
}

/**
 * Genera un PDF de la factura con diseño profesional
 */
export const generarFacturaPDF = (factura: Factura, clinicaInfo?: ClinicaInfo): jsPDF => {
  
  const doc = new jsPDF();
  
  // ============================================================================
  // CONFIGURACIÓN DE COLORES Y FUENTES
  // ============================================================================
  
  const colorPrimario = [16, 185, 129]; // #10b981 verde
  const colorSecundario = [107, 114, 128]; // #6b7280 gris
  const colorTexto = [17, 24, 39]; // #111827 negro
  
  let yPos = 20;
  
  // ============================================================================
  // HEADER: Logo y Datos de la Clínica
  // ============================================================================
  
  doc.setFillColor(...colorPrimario);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(clinicaInfo?.nombre || 'CLÍNICA DENTAL', 20, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  if (clinicaInfo?.ruc) doc.text(`RUC: ${clinicaInfo.ruc}`, 20, 27);
  if (clinicaInfo?.direccion) doc.text(clinicaInfo.direccion, 20, 32);
  if (clinicaInfo?.telefono || clinicaInfo?.email) {
    doc.text(`${clinicaInfo?.telefono || ''} | ${clinicaInfo?.email || ''}`, 20, 37);
  }
  
  yPos = 50;
  
  // ============================================================================
  // INFORMACIÓN DE LA FACTURA
  // ============================================================================
  
  doc.setTextColor(...colorTexto);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURA', 150, yPos);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`No. ${factura.numero}`, 150, yPos + 7);
  
  // Estado
  const estadoTexto = factura.estado.toUpperCase();
  const estadoColor = factura.estado === 'PAGADA' ? [16, 185, 129] 
                    : factura.estado === 'VENCIDA' ? [239, 68, 68]
                    : factura.estado === 'PARCIAL' ? [245, 158, 11]
                    : [107, 114, 128];
  
  doc.setFillColor(...estadoColor);
  doc.roundedRect(148, yPos + 10, 40, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(estadoTexto, 168, yPos + 15.5, { align: 'center' });
  
  yPos += 30;
  
  // ============================================================================
  // INFORMACIÓN DEL PACIENTE
  // ============================================================================
  
  doc.setTextColor(...colorTexto);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DEL PACIENTE', 20, yPos);
  
  yPos += 7;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nombre: ${factura.paciente_nombre}`, 20, yPos);
  doc.text(`ID: ${factura.paciente_id}`, 20, yPos + 5);
  
  yPos += 15;
  
  // ============================================================================
  // FECHAS
  // ============================================================================
  
  doc.setFontSize(10);
  doc.text(`Fecha de Emisión: ${new Date(factura.fecha_emision).toLocaleDateString('es-ES')}`, 20, yPos);
  doc.text(`Fecha de Vencimiento: ${new Date(factura.fecha_vencimiento).toLocaleDateString('es-ES')}`, 20, yPos + 5);
  
  yPos += 15;
  
  // ============================================================================
  // TABLA DE SERVICIOS FACTURADOS
  // ============================================================================
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('SERVICIOS FACTURADOS', 20, yPos);
  
  yPos += 5;
  
  const tableData = factura.items.map((item, index) => [
    String(index + 1),
    item.servicio_nombre,
    item.descripcion || '-',
    String(item.cantidad),
    `$${parseFloat(item.precio_unitario).toFixed(2)}`,
    `$${parseFloat(item.subtotal).toFixed(2)}`
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Servicio', 'Descripción', 'Cant.', 'Precio Unit.', 'Subtotal']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: colorPrimario,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 9,
      textColor: colorTexto
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 50 },
      2: { cellWidth: 50 },
      3: { cellWidth: 15, halign: 'center' },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 25, halign: 'right' }
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // ============================================================================
  // RESUMEN DE TOTALES
  // ============================================================================
  
  const xRight = 130;
  const labelWidth = 50;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  
  // Subtotal
  doc.setTextColor(...colorTexto);
  doc.text('SUBTOTAL:', xRight, yPos);
  doc.text(`$${parseFloat(factura.subtotal).toFixed(2)}`, xRight + labelWidth, yPos, { align: 'right' });
  
  yPos += 7;
  
  // Descuento (si existe)
  if (parseFloat(factura.descuento) > 0) {
    doc.setTextColor(245, 158, 11);
    doc.text('DESCUENTO:', xRight, yPos);
    doc.text(`-$${parseFloat(factura.descuento).toFixed(2)}`, xRight + labelWidth, yPos, { align: 'right' });
    yPos += 7;
  }
  
  // Total
  doc.setTextColor(...colorTexto);
  doc.text('TOTAL:', xRight, yPos);
  doc.text(`$${parseFloat(factura.total).toFixed(2)}`, xRight + labelWidth, yPos, { align: 'right' });
  
  yPos += 7;
  
  // Monto Pagado
  doc.setTextColor(16, 185, 129);
  doc.text('PAGADO:', xRight, yPos);
  doc.text(`-$${parseFloat(factura.pagado).toFixed(2)}`, xRight + labelWidth, yPos, { align: 'right' });
  
  yPos += 10;
  
  // Línea separadora
  doc.setDrawColor(...colorPrimario);
  doc.setLineWidth(0.5);
  doc.line(xRight, yPos, xRight + labelWidth, yPos);
  
  yPos += 7;
  
  // Saldo Pendiente
  doc.setTextColor(...colorTexto);
  doc.setFontSize(14);
  doc.text('SALDO PENDIENTE:', xRight, yPos);
  
  const saldo = factura.saldo_pendiente || factura.saldo;
  const saldoColor = parseFloat(saldo) > 0 ? [245, 158, 11] : [16, 185, 129];
  doc.setTextColor(...saldoColor);
  doc.text(`$${parseFloat(saldo).toFixed(2)}`, xRight + labelWidth, yPos, { align: 'right' });
  
  yPos += 15;
  
  // ============================================================================
  // HISTORIAL DE PAGOS
  // ============================================================================
  
  if (factura.pagos && factura.pagos.length > 0) {
    doc.setTextColor(...colorTexto);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('HISTORIAL DE PAGOS', 20, yPos);
    
    yPos += 5;
    
    const pagosData = factura.pagos.map((pago, index) => {
      const metodoPagoTexto = pago.metodo_pago === 'EFECTIVO' ? 'Efectivo'
                             : pago.metodo_pago === 'TARJETA' ? 'Tarjeta'
                             : pago.metodo_pago === 'TRANSFERENCIA' ? 'Transferencia'
                             : pago.metodo_pago === 'CHEQUE' ? 'Cheque'
                             : 'Otro';
      
      return [
        String(index + 1),
        new Date(pago.fecha_pago).toLocaleDateString('es-ES'),
        metodoPagoTexto,
        pago.referencia || '-',
        `$${parseFloat(pago.monto).toFixed(2)}`,
        pago.notas || '-'
      ];
    });
    
    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Fecha', 'Método', 'Referencia', 'Monto', 'Notas']],
      body: pagosData,
      theme: 'striped',
      headStyles: {
        fillColor: colorPrimario,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: colorTexto
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 30 },
        4: { cellWidth: 20, halign: 'right' },
        5: { cellWidth: 60 }
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }
  
  // ============================================================================
  // NOTAS
  // ============================================================================
  
  if (factura.notas) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colorTexto);
    doc.text('NOTAS:', 20, yPos);
    
    yPos += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const splitNotas = doc.splitTextToSize(factura.notas, 170);
    doc.text(splitNotas, 20, yPos);
    
    yPos += splitNotas.length * 5 + 10;
  }
  
  // ============================================================================
  // FOOTER
  // ============================================================================
  
  const pageHeight = doc.internal.pageSize.height;
  
  doc.setFillColor(...colorPrimario);
  doc.rect(0, pageHeight - 20, 210, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Factura generada el ${new Date().toLocaleDateString('es-ES')} - Sistema de Gestión Clínica Dental`,
    105,
    pageHeight - 12,
    { align: 'center' }
  );
  
  return doc;
};

/**
 * Descarga el PDF generado
 */
export const descargarPDF = (factura: Factura, clinicaInfo?: ClinicaInfo): void => {
  const doc = generarFacturaPDF(factura, clinicaInfo);
  doc.save(`factura_${factura.numero}.pdf`);
};

/**
 * Abre el PDF en nueva ventana para impresión
 */
export const imprimirPDF = (factura: Factura, clinicaInfo?: ClinicaInfo): void => {
  const doc = generarFacturaPDF(factura, clinicaInfo);
  
  // Abrir en nueva ventana
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  
  const printWindow = window.open(pdfUrl, '_blank');
  
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
      URL.revokeObjectURL(pdfUrl);
    };
  } else {
    console.warn('Popup bloqueado, descargando en su lugar');
    descargarPDF(factura, clinicaInfo);
  }
};
```

---

### **Paso 3: Agregar Funciones al Service**

**Archivo:** `src/services/facturacionService.ts`

Agregar al final del archivo:

```typescript
/**
 * 📥 Generar y descargar PDF de factura (Frontend)
 * Nota: No requiere llamada al backend
 */
import { descargarPDF, imprimirPDF } from '../utils/generadorFacturaPDF';

export const descargarFacturaPDF = async (facturaId: number): Promise<void> => {
  console.log('📥 Generando PDF de factura:', facturaId);
  
  try {
    // Obtener detalle completo de la factura
    const factura = await obtenerDetalleFactura(facturaId);
    
    // Información de la clínica (personalizar según tu tenant)
    const clinicaInfo = {
      nombre: 'CLÍNICA DENTAL SONRISAS',
      ruc: '1234567890001',
      direccion: 'Av. Principal #123, Ciudad',
      telefono: '(04) 123-4567',
      email: 'contacto@clinicadental.com'
    };
    
    // Generar y descargar PDF
    descargarPDF(factura, clinicaInfo);
    
    console.log('✅ PDF descargado exitosamente');
  } catch (error) {
    console.error('❌ Error generando PDF:', error);
    throw new Error('Error al generar el PDF de la factura');
  }
};

export const imprimirFacturaPDF = async (facturaId: number): Promise<void> => {
  console.log('🖨️ Abriendo PDF para impresión:', facturaId);
  
  try {
    const factura = await obtenerDetalleFactura(facturaId);
    
    const clinicaInfo = {
      nombre: 'CLÍNICA DENTAL SONRISAS',
      ruc: '1234567890001',
      direccion: 'Av. Principal #123, Ciudad',
      telefono: '(04) 123-4567',
      email: 'contacto@clinicadental.com'
    };
    
    imprimirPDF(factura, clinicaInfo);
    
    console.log('✅ PDF abierto para impresión');
  } catch (error) {
    console.error('❌ Error imprimiendo PDF:', error);
    throw new Error('Error al imprimir la factura');
  }
};
```

---

### **Paso 4: Agregar Botones en DetalleFactura**

**Archivo:** Página de detalle de factura (donde se muestra la factura completa)

Agregar estados:

```typescript
const [descargando, setDescargando] = useState(false);
const [imprimiendo, setImprimiendo] = useState(false);
```

Agregar funciones:

```typescript
const handleDescargarPDF = async () => {
  if (!factura) return;

  try {
    setDescargando(true);
    await descargarFacturaPDF(factura.id);
  } catch (error: any) {
    console.error('Error descargando PDF:', error);
    alert('❌ Error al descargar la factura: ' + error.message);
  } finally {
    setTimeout(() => setDescargando(false), 500);
  }
};

const handleImprimirPDF = async () => {
  if (!factura) return;

  try {
    setImprimiendo(true);
    await imprimirFacturaPDF(factura.id);
  } catch (error: any) {
    console.error('Error imprimiendo PDF:', error);
    alert('❌ Error al imprimir la factura: ' + error.message);
  } finally {
    setTimeout(() => setImprimiendo(false), 500);
  }
};
```

Agregar botones en el UI (inline styles):

```typescript
{/* Botones de Descarga e Impresión */}
<div style={{
  display: 'flex',
  gap: '12px',
  marginTop: '20px'
}}>
  <button
    onClick={handleDescargarPDF}
    disabled={descargando}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      backgroundColor: descargando ? '#d1d5db' : '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: descargando ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s'
    }}
    onMouseEnter={(e) => {
      if (!descargando) e.currentTarget.style.backgroundColor = '#059669';
    }}
    onMouseLeave={(e) => {
      if (!descargando) e.currentTarget.style.backgroundColor = '#10b981';
    }}
  >
    {descargando ? (
      <>
        <span style={{ 
          display: 'inline-block', 
          width: '14px', 
          height: '14px', 
          border: '2px solid white',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 0.6s linear infinite'
        }} />
        Descargando...
      </>
    ) : (
      <>
        📥 Descargar PDF
      </>
    )}
  </button>

  <button
    onClick={handleImprimirPDF}
    disabled={imprimiendo}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      backgroundColor: imprimiendo ? '#d1d5db' : 'white',
      color: imprimiendo ? '#6b7280' : '#3b82f6',
      border: imprimiendo ? '1px solid #d1d5db' : '1px solid #3b82f6',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: imprimiendo ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s'
    }}
    onMouseEnter={(e) => {
      if (!imprimiendo) {
        e.currentTarget.style.backgroundColor = '#eff6ff';
      }
    }}
    onMouseLeave={(e) => {
      if (!imprimiendo) {
        e.currentTarget.style.backgroundColor = 'white';
      }
    }}
  >
    {imprimiendo ? (
      <>
        <span style={{ 
          display: 'inline-block', 
          width: '14px', 
          height: '14px', 
          border: '2px solid #6b7280',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 0.6s linear infinite'
        }} />
        Abriendo...
      </>
    ) : (
      <>
        🖨️ Imprimir
      </>
    )}
  </button>
</div>

<style>{`
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`}</style>
```

---

## 🎨 Diseño del PDF Generado

El PDF incluye:

### **Header**
- ✅ Fondo verde con logo de la clínica
- ✅ Datos de la clínica (RUC, dirección, teléfono, email)

### **Información de la Factura**
- ✅ Número de factura
- ✅ Estado con color (verde=pagada, naranja=parcial/pendiente, rojo=vencida)

### **Datos del Paciente**
- ✅ Nombre completo
- ✅ ID del paciente

### **Fechas**
- ✅ Fecha de emisión
- ✅ Fecha de vencimiento

### **Tabla de Servicios**
- ✅ Número de ítem
- ✅ Nombre del servicio
- ✅ Descripción
- ✅ Cantidad
- ✅ Precio unitario
- ✅ Subtotal

### **Resumen de Totales**
- ✅ Subtotal
- ✅ Descuento (si existe)
- ✅ Total
- ✅ Monto pagado (en verde)
- ✅ Saldo pendiente (en naranja si > 0, verde si = 0)

### **Historial de Pagos** (si existen)
- ✅ Fecha de pago
- ✅ Método de pago
- ✅ Referencia
- ✅ Monto
- ✅ Notas

### **Notas** (si existen)
- ✅ Texto completo de notas

### **Footer**
- ✅ Fecha de generación
- ✅ Texto: "Sistema de Gestión Clínica Dental"

---

## 🧪 Pruebas

### **Caso 1: Descargar PDF**
1. Login con `paciente1@test.com`
2. Ir a lista de facturas
3. Abrir detalle de una factura
4. Click en "📥 Descargar PDF"
5. **Esperado**:
   - Botón muestra "Descargando..."
   - Se descarga archivo `factura_XXX.pdf`
   - PDF abre con visor del sistema
   - PDF contiene toda la información

### **Caso 2: Imprimir PDF**
1. En detalle de factura
2. Click en "🖨️ Imprimir"
3. **Esperado**:
   - Se abre nueva pestaña con PDF
   - Ventana de impresión aparece automáticamente
   - Puede cancelar e imprimir después

### **Caso 3: PDF con Múltiples Items**
1. Factura con 5+ servicios
2. Descargar PDF
3. **Esperado**:
   - Tabla con todos los items
   - Totales correctos
   - Sin desbordamiento

### **Caso 4: PDF con Múltiples Pagos**
1. Factura con 3+ pagos
2. Descargar PDF
3. **Esperado**:
   - Tabla de pagos completa
   - Suma de pagos = monto pagado

### **Caso 5: PDF de Factura Pagada**
1. Factura con estado "PAGADA"
2. Descargar PDF
3. **Esperado**:
   - Badge verde "PAGADA"
   - Saldo pendiente = $0.00 en verde

### **Caso 6: Popup Bloqueado**
1. Configurar navegador para bloquear popups
2. Click en "🖨️ Imprimir"
3. **Esperado**:
   - Fallback a descarga
   - Mensaje en consola

---

## ✅ Checklist de Verificación

- [ ] Dependencias instaladas (`jspdf`, `jspdf-autotable`)
- [ ] Utilidad `generadorFacturaPDF.ts` creada
- [ ] Funciones agregadas a `facturacionService.ts`
- [ ] Botones agregados en página de detalle
- [ ] Botón "Descargar PDF" funciona
- [ ] Botón "Imprimir" funciona
- [ ] Estados de carga se muestran
- [ ] PDF descarga con nombre correcto
- [ ] PDF contiene header con datos de clínica
- [ ] PDF muestra información del paciente
- [ ] PDF incluye tabla de servicios completa
- [ ] PDF muestra totales correctos
- [ ] PDF incluye historial de pagos
- [ ] PDF muestra notas
- [ ] PDF tiene footer con fecha
- [ ] Impresión abre en nueva pestaña
- [ ] Fallback de descarga funciona si popup bloqueado
- [ ] Diseño del PDF es profesional
- [ ] PDF es legible

---

## 🐛 Errores Comunes

### **Error 1: PDF vacío**
**Síntoma**: PDF descarga pero está en blanco
**Causa**: Error al generar tabla con `jspdf-autotable`
**Solución**: Verificar que los datos de `factura.items` no sean undefined

### **Error 2: Popup bloqueado**
**Síntoma**: Nueva pestaña no abre
**Causa**: Navegador bloquea popups
**Solución**: Usar fallback de descarga (ya implementado en el código)

### **Error 3: PDF cortado**
**Síntoma**: Contenido del PDF se corta
**Causa**: Contenido excede una página
**Solución**: `jspdf-autotable` maneja automáticamente múltiples páginas

### **Error 4: Datos de clínica incorrectos**
**Síntoma**: Header del PDF muestra datos genéricos
**Causa**: `clinicaInfo` no configurada
**Solución**: Actualizar objeto `clinicaInfo` en `facturacionService.ts` con datos reales

---

## 📝 Notas Importantes

### **1. Información de la Clínica**

Los datos de la clínica están hardcodeados en el service. Para un sistema multi-tenant real, deberías:

```typescript
// Opción 1: Obtener desde contexto
const { tenant } = useAuthContext();
const clinicaInfo = {
  nombre: tenant.nombre,
  ruc: tenant.ruc,
  // ...
};

// Opción 2: Endpoint del backend
const clinicaInfo = await api.get('/api/configuracion/clinica/');
```

### **2. Personalización del PDF**

Puedes personalizar:
- Colores (línea 18-20 en `generadorFacturaPDF.ts`)
- Fuentes (usando `doc.setFont()`)
- Logo (agregando imagen con `doc.addImage()`)
- Estructura de la tabla

### **3. Bundle Size**

`jsPDF` agrega ~100KB al bundle. Si no es crítico, es aceptable. Para optimizar:
```typescript
// Lazy load
const jsPDF = await import('jspdf');
const autoTable = await import('jspdf-autotable');
```

### **4. Compatibilidad**

La solución funciona en todos los navegadores modernos. Para navegadores antiguos, usar polyfills para `Blob` y `URL.createObjectURL`.

---

## 🎯 Ventajas de Generación Frontend

| Aspecto | Frontend (jsPDF) | Backend (endpoint) |
|---------|------------------|-------------------|
| **Implementación** | Completa (ya está lista) | Requiere desarrollo backend |
| **Performance** | Procesamiento en cliente | Carga en servidor |
| **Personalización** | Total control | Limitado a backend |
| **Mantenimiento** | Solo frontend | Backend + frontend |
| **Latencia** | Sin llamadas HTTP | Requiere request |

---

## 🔄 Siguiente Paso

✅ **Factura con descarga/impresión completa** → Has completado el módulo de facturación del paciente. 

**Progreso actual: 14/24 guías (58.3%)**

Las siguientes guías son opcionales según necesidades del proyecto.
