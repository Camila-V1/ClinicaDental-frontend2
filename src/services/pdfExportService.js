// src/services/pdfExportService.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const pdfExportService = {
  /**
   * Exporta datos de reporte de voz a PDF
   */
  exportVoiceReportToPDF(data, titulo = 'Reporte Generado por Voz') {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // === ENCABEZADO ===
    // Logo o título principal
    doc.setFillColor(16, 185, 129); // Verde
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('🦷 Clínica Dental', 14, 15);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(titulo, 14, 25);

    // Fecha de generación
    doc.setFontSize(9);
    doc.setTextColor(240, 240, 240);
    const fechaHoy = format(new Date(), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
    doc.text(`Generado: ${fechaHoy}`, pageWidth - 14, 15, { align: 'right' });

    // === INTERPRETACIÓN DEL COMANDO ===
    let yPos = 45;
    
    if (data.interpretacion) {
      doc.setFillColor(239, 246, 255);
      doc.rect(14, yPos, pageWidth - 28, 25, 'F');
      
      doc.setTextColor(30, 64, 175);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('🎤 Comando interpretado:', 18, yPos + 7);
      
      doc.setTextColor(30, 58, 138);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const comando = data.interpretacion.comando_original || 'N/A';
      const tipoReporte = data.interpretacion.tipo_reporte || 'general';
      
      doc.text(`Texto: "${comando}"`, 18, yPos + 14);
      doc.text(`Tipo: ${tipoReporte.toUpperCase()}`, 18, yPos + 20);
      
      yPos += 32;
    }

    // === RESUMEN ===
    if (data.resumen) {
      doc.setFillColor(254, 243, 199);
      doc.rect(14, yPos, pageWidth - 28, 30, 'F');
      
      doc.setTextColor(146, 64, 14);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('📊 Resumen:', 18, yPos + 7);
      
      doc.setTextColor(120, 53, 15);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      
      let resumenY = yPos + 14;
      if (data.resumen.total_registros !== undefined) {
        doc.text(`Total de registros: ${data.resumen.total_registros}`, 18, resumenY);
        resumenY += 6;
      }
      if (data.resumen.total_monto) {
        doc.text(`Monto total: Bs. ${parseFloat(data.resumen.total_monto).toFixed(2)}`, 18, resumenY);
        resumenY += 6;
      }
      if (data.resumen.promedio) {
        doc.text(`Promedio: Bs. ${parseFloat(data.resumen.promedio).toFixed(2)}`, 18, resumenY);
      }
      
      yPos += 37;
    }

    // === TABLA DE DATOS ===
    if (data.datos && Array.isArray(data.datos) && data.datos.length > 0) {
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('📋 Datos del Reporte:', 14, yPos);
      
      yPos += 8;

      // Preparar columnas y filas
      const primeraFila = data.datos[0];
      const columnas = Object.keys(primeraFila).map(key => ({
        header: this._formatColumnName(key),
        dataKey: key
      }));

      const filas = data.datos.map(item => {
        const fila = {};
        Object.keys(item).forEach(key => {
          fila[key] = this._formatCellValue(key, item[key]);
        });
        return fila;
      });

      // Generar tabla
      doc.autoTable({
        startY: yPos,
        head: [columnas.map(col => col.header)],
        body: filas.map(fila => columnas.map(col => fila[col.dataKey])),
        theme: 'grid',
        headStyles: {
          fillColor: [16, 185, 129],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9,
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [31, 41, 55]
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251]
        },
        columnStyles: this._getColumnStyles(columnas),
        margin: { left: 14, right: 14 },
        didDrawPage: (data) => {
          // Pie de página
          const pageCount = doc.internal.getNumberOfPages();
          const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
          
          doc.setFontSize(8);
          doc.setTextColor(107, 114, 128);
          doc.text(
            `Página ${currentPage} de ${pageCount}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
          );
        }
      });
    } else {
      doc.setTextColor(153, 27, 27);
      doc.setFontSize(10);
      doc.text('⚠️ No hay datos para mostrar', 14, yPos);
    }

    // === PIE DE PÁGINA FINAL ===
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : yPos + 20;
    
    if (finalY < pageHeight - 30) {
      doc.setDrawColor(229, 231, 235);
      doc.line(14, finalY, pageWidth - 14, finalY);
      
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text('Sistema de Gestión Clínica Dental', 14, finalY + 7);
      doc.text('Generado automáticamente por comando de voz', 14, finalY + 12);
    }

    // Guardar PDF
    const nombreArchivo = `reporte_voz_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.pdf`;
    doc.save(nombreArchivo);

    return nombreArchivo;
  },

  /**
   * Formatea el nombre de columna para mostrar
   */
  _formatColumnName(key) {
    const nombres = {
      id: 'ID',
      fecha: 'Fecha',
      paciente: 'Paciente',
      odontologo: 'Odontólogo',
      tratamiento: 'Tratamiento',
      monto: 'Monto',
      estado: 'Estado',
      tipo: 'Tipo',
      descripcion: 'Descripción',
      cantidad: 'Cantidad',
      total: 'Total',
      fecha_emision: 'Fecha Emisión',
      fecha_vencimiento: 'Vencimiento',
      saldo: 'Saldo',
      pagado: 'Pagado',
      pendiente: 'Pendiente',
      total_facturado: 'Total Facturado',
      completadas: 'Completadas',
      canceladas: 'Canceladas',
      nombre: 'Nombre',
      email: 'Email',
      telefono: 'Teléfono',
      ci: 'CI'
    };
    
    return nombres[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  },

  /**
   * Formatea el valor de una celda
   */
  _formatCellValue(key, value) {
    if (value === null || value === undefined) return '-';
    
    // Fechas
    if (key.includes('fecha') && typeof value === 'string') {
      try {
        return format(new Date(value), 'dd/MM/yyyy', { locale: es });
      } catch {
        return value;
      }
    }
    
    // Montos
    if (key.includes('monto') || key.includes('total') || key.includes('saldo') || key.includes('pagado')) {
      const num = parseFloat(value);
      return isNaN(num) ? value : `Bs. ${num.toFixed(2)}`;
    }
    
    // Booleanos
    if (typeof value === 'boolean') {
      return value ? '✓' : '✗';
    }
    
    return String(value);
  },

  /**
   * Obtiene estilos de columna según el tipo
   */
  _getColumnStyles(columnas) {
    const styles = {};
    
    columnas.forEach((col, index) => {
      const key = col.dataKey.toLowerCase();
      
      // Montos alineados a la derecha
      if (key.includes('monto') || key.includes('total') || key.includes('saldo') || key.includes('precio')) {
        styles[index] = { halign: 'right', cellWidth: 25 };
      }
      // Fechas centradas
      else if (key.includes('fecha')) {
        styles[index] = { halign: 'center', cellWidth: 25 };
      }
      // IDs pequeños
      else if (key === 'id') {
        styles[index] = { halign: 'center', cellWidth: 15 };
      }
      // Estados centrados
      else if (key === 'estado') {
        styles[index] = { halign: 'center', cellWidth: 22 };
      }
    });
    
    return styles;
  },

  /**
   * Exporta a Excel (CSV simple)
   */
  exportVoiceReportToExcel(data, titulo = 'Reporte') {
    if (!data.datos || !Array.isArray(data.datos) || data.datos.length === 0) {
      throw new Error('No hay datos para exportar');
    }

    // Crear CSV
    const primeraFila = data.datos[0];
    const headers = Object.keys(primeraFila).map(key => this._formatColumnName(key));
    
    const rows = data.datos.map(item => {
      return Object.keys(primeraFila).map(key => {
        const value = item[key];
        if (value === null || value === undefined) return '';
        
        // Si contiene comas o comillas, escapar
        const strValue = String(value);
        if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
          return `"${strValue.replace(/"/g, '""')}"`;
        }
        return strValue;
      });
    });

    // Crear contenido CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // BOM para UTF-8
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Descargar
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${titulo.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
