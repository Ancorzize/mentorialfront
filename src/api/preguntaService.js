const API_BASE_URL = import.meta.env.VITE_API_URL

const preguntaService = {
  getQuestions: async (convocatoriaId, userId, lastQuestionId, moduloId) => {
    try {
      const id_ultima_pregunta = lastQuestionId ?? 0;
      const queryParams = new URLSearchParams({
        id_convocatoria: convocatoriaId,
        id_usuario: userId,
        id_ultima_pregunta: id_ultima_pregunta,
        id_modulo: moduloId
      }).toString();

     const response = await fetch(`${API_BASE_URL}/api/preguntas?${queryParams}`, {
        method: 'GET',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener preguntas.');
      }

      // Devuelve el objeto completo para que el componente acceda a los datos anidados
      return data;
    } catch (error) {
      console.error('Get questions error:', error);
      return null;
    }
  },
  submitAnswers: async (answers) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/respuestas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(answers),
        });

        const data = await response.json();

        if (data.status === 'success') {
            return { success: true, data };
        } else {
            return { success: false, message: data.message || 'Error desconocido al guardar respuestas.' };
        }
    } catch (error) {
        console.error("Error en el servicio de preguntas:", error);
        return { success: false, message: 'No se pudo conectar con el servidor.' };
    }
  },
};

export default preguntaService;