import React, { useState, useEffect } from "react";
import {
  getConvocatoriasByUsuario,
  getRespuestasByConvocatoria,
  deleteHistorial,
} from "../../../api/historialService";

import ConvocatoriaDetail from "../../../components/ConvocatoriaDetail";
import Button from "../../../components/Button";

const HistoryPage = ({ user }) => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    const fetchConvocatorias = async () => {
      setIsLoading(true);
      setMessage("");

      try {
        const data = await getConvocatoriasByUsuario(user.id);

        if (data.length === 0) {
          setMessage("No tienes convocatorias en tu historial.");
        }

        setConvocatorias(data);
      } catch (error) {
        setMessage("Error al cargar el historial.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConvocatorias();
  }, [user.id]);

  const handleConvocatoriaClick = async (convocatoria) => {
    setIsLoading(true);
    setMessage("");

    try {
      const data = await getRespuestasByConvocatoria(
        user.id,
        convocatoria.id_convocatoria,
      );

      setSelectedConvocatoria({
        ...convocatoria,
        detail: data,
      });
    } catch {
      setMessage("Error al cargar los detalles.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    setSelectedConvocatoria(null);
    setMessage("");
  };

  const handleConfirmDelete = () => {
    setIsConfirmingDelete(true);
  };

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  const handleFinalDelete = async () => {
    setIsConfirmingDelete(false);

    setIsLoading(true);

    try {
      const response = await deleteHistorial(
        user.id,
        selectedConvocatoria.id_convocatoria,
      );

      if (response.status === "success") {
        setMessage(response.message);

        setConvocatorias((prev) =>
          prev.filter(
            (c) => c.id_convocatoria !== selectedConvocatoria.id_convocatoria,
          ),
        );

        setSelectedConvocatoria(null);
      } else {
        setMessage(response.message);
      }
    } catch {
      setMessage("Error al eliminar el historial.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <p className="text-gray-400 text-xs sm:text-sm md:text-base">
          Cargando...
        </p>
      </div>
    );
  }

  if (message && !convocatorias.length && !selectedConvocatoria) {
    return (
      <div className="flex justify-center mt-10">
        <p className="text-red-400 text-xs sm:text-sm md:text-base text-center">
          {message}
        </p>
      </div>
    );
  }

  if (selectedConvocatoria) {
    return (
      <>
        <ConvocatoriaDetail
          convocatoria={selectedConvocatoria}
          onBack={handleBackClick}
          onDelete={handleConfirmDelete}
        />

        {isConfirmingDelete && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-4 sm:p-6">
              <p className="text-white font-bold text-xs sm:text-sm md:text-base mb-4 text-center">
                Esto eliminará sus respuestas y deberá empezar el simulacro
                desde cero.
                <br />
                <br />
                ¿Desea continuar?
              </p>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <Button
                  onClick={handleFinalDelete}
                  className="w-full bg-red-600 hover:bg-red-700 text-xs sm:text-sm md:text-base"
                >
                  Sí, continuar
                </Button>

                <Button
                  onClick={handleCancelDelete}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-xs sm:text-sm md:text-base"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="w-full max-w-2xl px-2 sm:px-4">
      <h3 className="text-sm sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 text-center">
        Historial de Convocatorias
      </h3>

      <div className="bg-gray-900 rounded-lg p-3 sm:p-4 md:p-6 shadow-lg">
        <ul className="space-y-2 sm:space-y-3 md:space-y-4">
          {convocatorias.map((convocatoria) => (
            <li
              key={convocatoria.id_convocatoria}
              onClick={() => handleConvocatoriaClick(convocatoria)}
              className="
                                bg-gray-800
                                p-3 sm:p-4 md:p-5
                                rounded-lg
                                cursor-pointer
                                hover:bg-gray-700
                                transition
                            "
            >
              <p
                className="
                                text-purple-400
                                font-bold
                                text-xs sm:text-base md:text-lg
                                mb-1
                            "
              >
                {convocatoria.codigo_convocatoria}
              </p>

              <p
                className="
                                text-gray-300
                                text-xs sm:text-sm md:text-base
                            "
              >
                {convocatoria.nombre_convocatoria}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {message && (
        <p
          className="
                    text-center
                    text-green-400
                    text-xs sm:text-sm md:text-base
                    mt-3
                "
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default HistoryPage;
