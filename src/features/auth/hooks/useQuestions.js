import { useState, useEffect, useRef } from 'react';
import preguntaService from '../../../api/preguntaService';

const useQuestions = (convocatoriaId, userId, initialLastQuestionId, moduloId) => {
  const [questionsData, setQuestionsData] = useState(null);
  const [lastQuestionId, setLastQuestionId] = useState(initialLastQuestionId ?? 0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMoreQuestions, setHasMoreQuestions] = useState(true);

  const firstLoad = useRef(true);

  const getQuestions = async (cleanList = false) => {

    setIsLoading(true);
    setError(null);

    try {

      const response = await preguntaService.getQuestions(
        convocatoriaId,
        userId,
        lastQuestionId,
        moduloId
      );

      console.log("Respuesta API preguntas:", response);

      if (response?.inactivo === true) {

        setQuestionsData(response);

        setHasMoreQuestions(false);

        setError(response.message);

        return response;
      }

      if (
        response?.data &&
        Array.isArray(response.data.data) &&
        response.data.data.length > 0
      ) {

        setQuestionsData(prevData => {

          if (cleanList) return response.data;

          if (!prevData) return response.data;

          return {
            ...prevData,
            data: [
              ...prevData.data,
              ...response.data.data
            ]
          };

        });

        setLastQuestionId(response.data.ultima_pregunta_enviada);

        setHasMoreQuestions(true);

        return response.data;
      }

      setHasMoreQuestions(false);

      if (cleanList) {
        setQuestionsData({
          data: [],
          message: "No hay más preguntas disponibles"
        });
      }

      return response;

    }
    catch (e) {

      console.error(e);

      setError('No se pudieron obtener las preguntas.');

      setHasMoreQuestions(false);

      return null;

    }
    finally {

      setIsLoading(false);

    }

  };

  useEffect(() => {
    firstLoad.current = true;
    setQuestionsData(null);
    setHasMoreQuestions(true);
    setError(null);
    setLastQuestionId(initialLastQuestionId ?? 0);
  }, [convocatoriaId, userId, moduloId, initialLastQuestionId]);

  useEffect(() => {
    if (convocatoriaId && userId && moduloId && firstLoad.current) {
      firstLoad.current = false;
      getQuestions(true);
    }
  }, [convocatoriaId, userId, moduloId]); 

  return { questionsData, isLoading, error, hasMoreQuestions, getQuestions };
};

export default useQuestions;
