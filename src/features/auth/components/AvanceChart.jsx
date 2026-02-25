import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const COLORS = {
  correctas: '#22c55e',    // verde
  incorrectas: '#ef4444',  // rojo
  pendientes: '#facc15'    // amarillo
};

const AvanceChart = ({ avance }) => {
  if (!avance) return null;

  const pendientes =
    avance.total_preguntas - avance.total_contestadas;

  const data = [
    { name: 'Correctas', value: avance.total_correctas },
    { name: 'Incorrectas', value: avance.total_incorrectas },
    { name: 'Pendientes', value: pendientes }
  ];

  const porcentaje =
    Math.round(
      (avance.total_contestadas / avance.total_preguntas) * 100
    );

  return (
    <div className="bg-gray-800 rounded-xl p-4 flex flex-col items-center">
      <p className="text-sm text-gray-400 mb-2">Avance del simulacro</p>

      <div className="w-full h-52 relative">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              <Cell fill={COLORS.correctas} />
              <Cell fill={COLORS.incorrectas} />
              <Cell fill={COLORS.pendientes} />
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: 'none',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Texto central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">
            {porcentaje}%
          </span>
          <span className="text-xs text-gray-400">
            completado
          </span>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex gap-4 mt-4 text-xs text-gray-300">
        <div className="flex items-center gap-1">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: COLORS.correctas }}
          />
          Correctas
        </div>
        <div className="flex items-center gap-1">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: COLORS.incorrectas }}
          />
          Incorrectas
        </div>
        <div className="flex items-center gap-1">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: COLORS.pendientes }}
          />
          Pendientes
        </div>
      </div>
    </div>
  );
};

export default AvanceChart;