// src/components/chatbot/ChatResponseRenderer.jsx
import React from 'react';

const ChatResponseRenderer = ({ datos, tipoRespuesta, onEnviarMensaje }) => {
  if (!datos) return null;

  switch (tipoRespuesta) {
    case 'lista_citas':
      return <ListaCitas citas={datos} />;
    
    case 'proxima_cita':
      return <ProximaCita cita={datos} />;
    
    case 'tratamientos':
      return <ListaTratamientos tratamientos={datos} />;
    
    case 'facturas_pendientes':
      return <ListaFacturas facturas={datos} />;
    
    case 'historial_pagos':
      return <ListaPagos pagos={datos} />;
    
    case 'historial_clinico':
      return <ListaEpisodios episodios={datos} />;
    
    case 'cancelar_cita':
      return <CitasCancelables citas={datos} onEnviarMensaje={onEnviarMensaje} />;
    
    case 'ayuda':
      return <ListaComandos comandos={datos} onEnviarMensaje={onEnviarMensaje} />;
    
    default:
      return null;
  }
};

// Componente para lista de citas
const ListaCitas = ({ citas }) => (
  <div className="data-list">
    {citas.map((cita) => (
      <div key={cita.id} className="data-card">
        <div className="card-header">
          <span className="card-icon">📅</span>
          <strong>{cita.fecha} - {cita.hora}</strong>
        </div>
        <div className="card-body">
          <p>🏥 {cita.odontologo}</p>
          <p>📝 {cita.motivo_tipo}</p>
          <span className={`badge ${cita.estado.toLowerCase()}`}>
            {cita.estado}
          </span>
        </div>
      </div>
    ))}
  </div>
);

// Componente para próxima cita
const ProximaCita = ({ cita }) => (
  <div className="data-card highlight">
    <div className="card-header">
      <span className="card-icon">📆</span>
      <strong>{cita.fecha} a las {cita.hora}</strong>
    </div>
    <div className="card-body">
      <p>⏰ {cita.tiempo_restante}</p>
      <p>🏥 {cita.odontologo}</p>
      <p>📝 {cita.motivo_tipo}</p>
    </div>
  </div>
);

// Componente para tratamientos
const ListaTratamientos = ({ tratamientos }) => (
  <div className="data-list">
    {tratamientos.map((tratamiento) => (
      <div key={tratamiento.id} className="data-card">
        <div className="card-header">
          <span className="card-icon">🦷</span>
          <strong>{tratamiento.titulo}</strong>
        </div>
        <div className="card-body">
          <p>🏥 {tratamiento.odontologo}</p>
          <p>💰 Bs. {tratamiento.total.toFixed(2)}</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${tratamiento.porcentaje_completado}%` }}
            />
          </div>
          <p className="progress-text">{tratamiento.porcentaje_completado}% completado</p>
        </div>
      </div>
    ))}
  </div>
);

// Componente para facturas
const ListaFacturas = ({ facturas }) => (
  <div className="data-list">
    {facturas.map((factura) => (
      <div key={factura.id} className="data-card">
        <div className="card-header">
          <span className="card-icon">💰</span>
          <strong>{factura.numero}</strong>
        </div>
        <div className="card-body">
          <p>📅 {factura.fecha}</p>
          <p>Total: Bs. {factura.monto_total.toFixed(2)}</p>
          <p className="text-danger">Saldo: Bs. {factura.saldo.toFixed(2)}</p>
        </div>
      </div>
    ))}
  </div>
);

// Componente para pagos
const ListaPagos = ({ pagos }) => (
  <div className="data-list">
    {pagos.map((pago) => (
      <div key={pago.id} className="data-card">
        <div className="card-header">
          <span className="card-icon">✅</span>
          <strong>Bs. {pago.monto.toFixed(2)}</strong>
        </div>
        <div className="card-body">
          <p>📅 {pago.fecha}</p>
          <p>💳 {pago.metodo}</p>
          <p>📄 {pago.factura}</p>
        </div>
      </div>
    ))}
  </div>
);

// Componente para episodios clínicos
const ListaEpisodios = ({ episodios }) => (
  <div className="data-list">
    {episodios.map((episodio) => (
      <div key={episodio.id} className="data-card">
        <div className="card-header">
          <span className="card-icon">📄</span>
          <strong>{episodio.tipo}</strong>
        </div>
        <div className="card-body">
          <p>📅 {episodio.fecha}</p>
          <p>🏥 {episodio.odontologo}</p>
          <p className="text-small">{episodio.diagnostico}</p>
        </div>
      </div>
    ))}
  </div>
);

// Componente para lista de comandos (ayuda)
const ListaComandos = ({ comandos, onEnviarMensaje }) => (
  <div className="commands-list">
    {comandos.map((comando, index) => (
      <div 
        key={index} 
        className="command-item"
        onClick={() => onEnviarMensaje(comando.ejemplo.split('"')[1])}
      >
        <strong>{comando.descripcion}</strong>
        <p className="text-small">{comando.ejemplo}</p>
      </div>
    ))}
  </div>
);

// Componente para cancelar citas
const CitasCancelables = ({ citas, onEnviarMensaje }) => (
  <div className="data-list">
    {citas.map((cita) => (
      <div key={cita.id} className="data-card cancelable">
        <div className="card-body">
          <p>📅 {cita.fecha} - {cita.hora}</p>
          <p>🏥 {cita.odontologo}</p>
          <p>📝 {cita.motivo_tipo}</p>
          <button 
            className="btn-cancel"
            onClick={() => alert(`Confirmar cancelación de cita ${cita.id}`)}
          >
            ❌ Cancelar esta cita
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default ChatResponseRenderer;
