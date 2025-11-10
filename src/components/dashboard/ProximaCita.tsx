/**
 * ⏰ PRÓXIMA CITA - Componente con countdown en tiempo real
 */

import React, { useState, useEffect } from 'react';
import type { MetricasCita } from '../../services/agendaService';

interface ProximaCitaProps {
  cita: MetricasCita | null;
}

const ProximaCita: React.FC<ProximaCitaProps> = ({ cita }) => {
  const [tiempoRestante, setTiempoRestante] = useState<string>('');

  useEffect(() => {
    if (!cita) {
      setTiempoRestante('');
      return;
    }

    const calcularTiempo = () => {
      try {
        // Obtener fecha actual
        const ahora = new Date();
        
        // Combinar fecha de hoy con la hora de la cita
        const hoy = new Date();
        const [horas, minutos] = cita.hora.split(':').map(Number);
        
        const fechaCita = new Date(
          hoy.getFullYear(),
          hoy.getMonth(),
          hoy.getDate(),
          horas,
          minutos,
          0
        );

        const diferencia = fechaCita.getTime() - ahora.getTime();

        if (diferencia < 0) {
          setTiempoRestante('Cita en curso o pasada');
          return;
        }

        const horasRestantes = Math.floor(diferencia / (1000 * 60 * 60));
        const minutosRestantes = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const segundosRestantes = Math.floor((diferencia % (1000 * 60)) / 1000);

        if (horasRestantes > 0) {
          setTiempoRestante(`${horasRestantes}h ${minutosRestantes}m ${segundosRestantes}s`);
        } else if (minutosRestantes > 0) {
          setTiempoRestante(`${minutosRestantes}m ${segundosRestantes}s`);
        } else {
          setTiempoRestante(`${segundosRestantes}s`);
        }
      } catch (error) {
        console.error('Error calculando tiempo:', error);
        setTiempoRestante('Error');
      }
    };

    // Calcular inmediatamente
    calcularTiempo();

    // Actualizar cada segundo
    const intervalo = setInterval(calcularTiempo, 1000);

    return () => clearInterval(intervalo);
  }, [cita]);

  if (!cita) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.titulo}>⏰ Próxima Cita</h3>
        </div>
        <div style={styles.sinCitas}>
          <p style={styles.mensaje}>No hay citas pendientes para hoy</p>
          <span style={styles.iconoGrande}>📅</span>
        </div>
      </div>
    );
  }

  const obtenerColorEstado = (estado: string): string => {
    switch (estado) {
      case 'CONFIRMADA':
        return '#4CAF50';
      case 'PENDIENTE':
        return '#FF9800';
      case 'ATENDIDA':
        return '#2196F3';
      case 'CANCELADA':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.titulo}>⏰ Próxima Cita</h3>
        {tiempoRestante && tiempoRestante !== 'Cita en curso o pasada' && (
          <div style={styles.countdown}>
            <span style={styles.countdownTexto}>En {tiempoRestante}</span>
          </div>
        )}
      </div>

      <div style={styles.citaInfo}>
        <div style={styles.fila}>
          <span style={styles.icono}>👤</span>
          <div style={styles.info}>
            <span style={styles.label}>Paciente</span>
            <span style={styles.dato}>{cita.paciente.full_name}</span>
          </div>
        </div>

        <div style={styles.fila}>
          <span style={styles.icono}>🕐</span>
          <div style={styles.info}>
            <span style={styles.label}>Hora</span>
            <span style={styles.dato}>{cita.hora}</span>
          </div>
        </div>

        <div style={styles.fila}>
          <span style={styles.icono}>📋</span>
          <div style={styles.info}>
            <span style={styles.label}>Motivo</span>
            <span style={styles.dato}>{cita.motivo}</span>
          </div>
        </div>

        <div style={styles.fila}>
          <span style={styles.icono}>📊</span>
          <div style={styles.info}>
            <span style={styles.label}>Estado</span>
            <span style={{
              ...styles.estadoBadge,
              backgroundColor: obtenerColorEstado(cita.estado)
            }}>
              {cita.estado}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e8e8e8',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '12px',
  },
  titulo: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 600,
    color: '#2c3e50',
  },
  countdown: {
    backgroundColor: '#e3f2fd',
    padding: '8px 16px',
    borderRadius: '20px',
  },
  countdownTexto: {
    color: '#1976d2',
    fontSize: '14px',
    fontWeight: 600,
  },
  citaInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  fila: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  icono: {
    fontSize: '20px',
    flexShrink: 0,
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  label: {
    fontSize: '12px',
    color: '#666',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  dato: {
    fontSize: '15px',
    color: '#2c3e50',
    fontWeight: 500,
  },
  estadoBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    width: 'fit-content',
  },
  sinCitas: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    gap: '16px',
  },
  mensaje: {
    margin: 0,
    fontSize: '15px',
    color: '#666',
    textAlign: 'center',
  },
  iconoGrande: {
    fontSize: '48px',
    opacity: 0.5,
  },
};

export default ProximaCita;
