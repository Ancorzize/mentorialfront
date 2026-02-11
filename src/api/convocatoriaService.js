const API_BASE_URL = import.meta.env.VITE_API_URL

const convocatoriaService = {
  search: async (searchTerm, userId) => {
    try {
      // Usamos URLSearchParams para manejar correctamente los parámetros de la URL
      const queryParams = new URLSearchParams({
        convocatoria: searchTerm,
        id_usuario: userId,
      }).toString();

      const response = await fetch(`${API_BASE_URL}/api/convocatorias?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al buscar convocatorias.');
      }
      return await response.json();
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  },
   getModulosByConvocatoria: async (convocatoriaId, userId) => {
    try {
      const queryParams = new URLSearchParams({
        id_convocatoria: convocatoriaId,
        id_usuario: userId,
      }).toString();

      const response = await fetch(`${API_BASE_URL}/api/modulosbyconvocatoria?${queryParams}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Error al cargar módulos.');
      return await response.json(); // esperado: array
    } catch (error) {
      console.error('getModulosByConvocatoria error:', error);
      return [];
    }
  }
};

export default convocatoriaService;