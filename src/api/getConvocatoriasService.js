const API_BASE_URL = import.meta.env.VITE_API_URL

const getConvocatorias = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/convocatoriasall`, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error en la respuesta del servidor:', response.status, errorText);
            return { 
                success: false, 
                message: `Error del servidor: ${response.status} - ${response.statusText}` 
            };
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            return { success: true, convocatorias: data };
        } else {
            return { success: true, convocatorias: [data] };
        }

    } catch (error) {
        console.error("Error al obtener las convocatorias:", error);
        return { success: false, message: "Error al obtener las convocatorias. Por favor, revisa tu conexión." };
    }
};

export default getConvocatorias;