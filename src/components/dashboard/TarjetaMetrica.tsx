/**
 * 📊 TARJETA MÉTRICA - Componente para mostrar una métrica individual
 */

import React from 'react';

interface TarjetaMetricaProps {
  titulo: string;
  valor: number | string;
  icono: string;
  colorFondo: string;
  colorIcono: string;
}

const TarjetaMetrica: React.FC<TarjetaMetricaProps> = ({
  titulo,
  valor,
  icono,
  colorFondo,
  colorIcono
}) => {
  return (
    <div style={styles.tarjeta}>
      <div style={styles.contenido}>
        <div style={styles.textos}>
          <h3 style={styles.titulo}>{titulo}</h3>
          <p style={styles.valor}>{valor}</p>
        </div>
        <div style={{
          ...styles.iconoContainer,
          backgroundColor: colorFondo
        }}>
          <span style={{
            ...styles.icono,
            color: colorIcono
          }}>{icono}</span>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    cursor: 'default',
    border: '1px solid #e8e8e8',
  },
  contenido: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textos: {
    flex: 1,
  },
  titulo: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 500,
    color: '#666',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  valor: {
    margin: 0,
    fontSize: '32px',
    fontWeight: 700,
    color: '#2c3e50',
  },
  iconoContainer: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icono: {
    fontSize: '28px',
  },
};

export default TarjetaMetrica;
