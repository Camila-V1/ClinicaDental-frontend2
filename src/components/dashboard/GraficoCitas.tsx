import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { BarChart3 } from 'lucide-react';

interface Props {
  datos: any[];
}

export default function GraficoCitas({ datos }: Props) {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '24px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '20px', margin: '0 0 20px 0' }}>
        Citas por Mes (Últimos 6 meses)
      </h2>
      
      {datos.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="mes" stroke="#64748b" style={{ fontSize: '13px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '13px' }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '13px', color: '#64748b' }} />
            <Bar dataKey="citas" fill="#0d9488" name="Citas Realizadas" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <div style={{ textAlign: 'center' }}>
            <BarChart3 size={64} strokeWidth={1.5} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
            <p style={{ marginTop: '16px', fontSize: '14px' }}>No hay datos suficientes para el gráfico</p>
          </div>
        </div>
      )}
    </div>
  );
}
