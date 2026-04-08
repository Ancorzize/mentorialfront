import React, { useEffect, useState } from 'react';
import convocatoriaService from '../../../api/convocatoriaService';
import AvanceChart from '../components/AvanceChart';

const MySimulacros = ({ user }) => {
  const [simulacros, setSimulacros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimulacros = async () => {
      try {
        const response =
          await convocatoriaService.obtenerConvocatoriasPorUsuario(user.id);

        setSimulacros(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Error cargando simulacros', error);
        setSimulacros([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimulacros();
  }, [user.id]);

  if (loading) {
    return <p className="text-gray-400">Cargando simulacros...</p>;
  }

  if (simulacros.length === 0) {
    return <p className="text-gray-400">No tienes simulacros registrados.</p>;
  }

  return (
    <div className="grid gap-6">
      {simulacros.map((sim) => (
        <div
          key={sim.id_convocatoria}
          className="bg-gray-900 p-5 rounded-xl shadow
                     grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="md:col-span-3">
            <h3 className="text-purple-400 font-bold text-lg">
              {sim.codigo_convocatoria}
            </h3>
            <p className="text-gray-300 text-sm">
              {sim.nombre_convocatoria}
            </p>
          </div>

          {sim.avance && (
            <>
              <div className="md:col-span-1">
                <AvanceChart avance={sim.avance} />
              </div>

              <div className="md:col-span-2 text-sm text-gray-300 space-y-1">
                <p><strong>Total preguntas:</strong> {sim.avance.total_preguntas}</p>
                <p><strong>Contestadas:</strong> {sim.avance.total_contestadas}</p>
                <p className="text-green-400">
                  <strong>Correctas:</strong> {sim.avance.total_correctas}
                </p>
                <p className="text-red-400">
                  <strong>Incorrectas:</strong> {sim.avance.total_incorrectas}
                </p>
                <p className="text-gray-400">
                  <strong>Pendientes:</strong>{' '}
                  {sim.avance.total_preguntas - sim.avance.total_contestadas}
                </p>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default MySimulacros;