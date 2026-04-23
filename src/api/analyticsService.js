const API_BASE_URL = import.meta.env.VITE_API_URL;

export const registerVisitService = async () => {
  try {
    const tipo = 'visitapagina';
    
    const url = `${API_BASE_URL}/api/visitas?tipo=${tipo}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return await response.json();
  } catch (error) {
    console.error("Error al registrar la visita:", error);
  }
};