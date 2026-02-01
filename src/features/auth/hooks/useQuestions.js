import { useState, useEffect, useRef } from 'react';
import preguntaService from '../../../api/preguntaService'; 

const useQuestions = (convocatoriaId, userId, initialLastQuestionId, moduloId) => {
    
    const [questionsData, setQuestionsData] = useState(null);
    const [lastQuestionId, setLastQuestionId] = useState(initialLastQuestionId);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMoreQuestions, setHasMoreQuestions] = useState(true);

    const firstLoad = useRef(true);

    const getQuestions = async (cleanList = false) => {
        setIsLoading(true);
        setError(null);
        
        try {
         console.log('datos: '); console.log(moduloId);
            const data = await preguntaService.getQuestions(convocatoriaId, userId, lastQuestionId, moduloId);

            if (data?.data && Array.isArray(data.data.data) && data.data.data.length > 0) {
          
                setQuestionsData(prevData => {

                    if (cleanList) {
                      return data.data;
                    }
                    if (!prevData) {
                        return data.data;
                    }

                    const newData = { ...prevData };
                    newData.data = [...prevData.data, ...data.data.data];
                    return newData;
                });
                setLastQuestionId(data.data.ultima_pregunta_enviada);
                setHasMoreQuestions(true);
            } else {
                setHasMoreQuestions(false);
                if(data.inactivo==true)
                {
                    setError(data.message);
                }else if (questionsData === null) {
                    setError('No se encontraron preguntas para esta convocatoria.');
                }
            }
        } catch (e) {
            setError('No se pudieron obtener las preguntas.');
            setHasMoreQuestions(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (convocatoriaId && userId && firstLoad.current) {
            firstLoad.current = false;
            setQuestionsData(null);
            getQuestions();
           
        }
    }, [convocatoriaId, userId, initialLastQuestionId]);

    return { 
        questionsData, 
        isLoading, 
        error, 
        hasMoreQuestions,
        getQuestions
    };
};

export default useQuestions;
