import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Button from './Button'; 

const ConvocatoriaDetail = ({ convocatoria, onBack, onDelete }) => {
    const { detail } = convocatoria;
    const { convocatoria: convoData, modulo, data } = detail;

    return (
        <div className="w-full max-w-3xl">
             <div className="flex flex-col sm:flex-row gap-2 items-center mb-1">
                <Button 
                    onClick={onBack}
                    className="bg-gray-600 hover:bg-gray-700 w-full sm:w-auto text-sm py-0 px-3"
                >
                    Volver
                </Button>
                <Button 
                    onClick={onDelete}
                    className="bg-red-600 hover:bg-red-700 w-full sm:w-auto text-sm py-0 px-3"
                >
                    Eliminar Histórico
                </Button>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 md:p-6 shadow-lg">
                <h3 className="text-lg sm:text-2xl font-bold mb-2">{convoData.nombre}</h3>
                <p className="text-sm text-gray-400 sm:text-base mb-4">Módulo: {modulo.nombre}</p>

                {data.map((bloque) => (
                    <div key={bloque.encabezado.id_encabezado} className="mb-8">
                        {bloque.encabezado.encabezado && (
                            <p className="font-bold text-base mb-4 text-purple-400 sm:text-lg">{bloque.encabezado.encabezado}</p>
                        )}
                        {bloque.preguntas.map((preguntaData) => (
                            <div key={preguntaData.pregunta.id_pregunta} className="bg-gray-800 p-4 rounded-lg mb-4">
                                <p className="font-semibold text-base mb-2 sm:text-lg">{preguntaData.pregunta.pregunta}</p>
                                <ul className="space-y-2">
                                    {preguntaData.opciones.map((opcion) => (
                                        <li key={opcion.opcion} className="flex items-start text-sm sm:text-base">
                                            {opcion.opcion === preguntaData.respuesta_usuario ? (
                                                preguntaData.respuesta_usuario_correcta ? (
                                                    <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-1" />
                                                ) : (
                                                    <FaTimesCircle className="text-red-500 mr-2 flex-shrink-0 mt-1" />
                                                )
                                            ) : (
                                                <div className="w-4 h-4 mr-2 flex-shrink-0 mt-1"></div>
                                            )}
                                            <span className={`${opcion.correcta ? 'font-bold text-green-400' : ''}`}>
                                                {opcion.opcion}) {opcion.descripcion_opcion}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConvocatoriaDetail;