import { useState, useEffect, useMemo } from "react";
import Button from '../../../components/Button';
import useQuestions from '../hooks/useQuestions';
import preguntaService from '../../../api/preguntaService'; 
import { Capacitor } from '@capacitor/core';

const QuestionsPage = ({ user, onLogout, selectedConvocatoria, onNavigateBack }) => {
    
    const { questionsData, isLoading, error, hasMoreQuestions, getQuestions } = useQuestions(selectedConvocatoria?.id, user?.id, selectedConvocatoria?.ultima_pregunta, selectedConvocatoria?.moduloId);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [apiErrorMessage, setApiErrorMessage] = useState(null);
    const [validationMessage, setValidationMessage] = useState(null);
    const [isApp, setIsApp] = useState(false);
    const questionsArray = questionsData?.data || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [checked, setChecked] = useState(false);
    const [lastCheckResult, setLastCheckResult] = useState(null);
    const [totalAnsweredGlobal, setTotalAnsweredGlobal] = useState(0);

    const handleAnswerChange = (questionKey, option) => {
        if (checked) return;

        setSelectedAnswers(prev => ({
            ...prev,
            [questionKey]: option,
        }));
    };

    useEffect(() => {
        const native = Capacitor.isNativePlatform();
        console.log("¿Es app nativa?", native);
        setIsApp(native);
    }, []);
    useEffect(() => {
        setSelectedAnswers({});
        setCurrentIndex(0);
        setChecked(false);
        setLastCheckResult(null);
        setApiErrorMessage(null);
        setValidationMessage(null);
    }, [selectedConvocatoria?.id, selectedConvocatoria?.moduloId]);

    const flatQuestions = useMemo(() => {
        return (questionsArray || []).flatMap((item) => {
            const idModulo = item?.modulo?.id_modulo;
            const encabezado = item?.encabezado?.encabezado;

            return (item?.preguntas || []).map((preguntaItem) => ({
            idModulo,
            encabezado,
            pregunta: preguntaItem.pregunta,   // {id_pregunta, pregunta}
            opciones: preguntaItem.opciones    // [{opcion, descripcion_opcion, correcta}]
            }));
        });
    }, [questionsArray]);

     const buildSummary = () => {
        return flatQuestions.map((q) => {
            const qid = q.pregunta.id_pregunta;
            const selected = selectedAnswers[qid];
            const correct = q.opciones.find(o => o.correcta === true);

            return {
            id_pregunta: qid,
            idModulo: q.idModulo,
            pregunta: q.pregunta.pregunta,
            encabezado: q.encabezado,
            selected,
            correct,
            opciones: q.opciones
            };
        });
    };

    const current = flatQuestions[currentIndex];
    const totalLoaded = flatQuestions.length;
    const isLast = currentIndex === totalLoaded - 1;
    const currentQuestionId = current?.pregunta?.id_pregunta;
    const selectedOption = currentQuestionId ? selectedAnswers[currentQuestionId] : null;
    const hasSelected = Boolean(selectedOption);

    const isCurrentAnswered = currentQuestionId
    ? Boolean(selectedAnswers[currentQuestionId])
    : false;

    const progress = totalLoaded > 0 ? Math.round(((currentIndex + 1) / totalLoaded) * 100) : 0

    const handleCheck = () => {
        if (!hasSelected) {
            setValidationMessage("Selecciona una opción para comprobar.");
            return;
        }

        setValidationMessage(null);
        setChecked(true);
        setLastCheckResult(Boolean(selectedOption.correcta)); // true si es correcta
    };

   const handleContinue = async () => {
        setValidationMessage(null);
        setApiErrorMessage(null);

        if (!hasSelected) {
            setValidationMessage("Selecciona una opción para continuar.");
            return;
        }

        if (isLast) {
            await finishBlock();
            return;
        }
        
        setCurrentIndex(prev => prev + 1);
        setChecked(false);
        setLastCheckResult(null);
    };

    const handlePrev = () => {
        setChecked(false);
        setLastCheckResult(null);
        
        setValidationMessage(null);
        if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
    };

    const finishBlock = async () => {
        setApiErrorMessage(null);
        setValidationMessage(null);

        const summary = buildSummary();

        const answersToSubmit = summary
            .filter(x => x.selected)
            .map(x => ({
            id_pregunta: x.id_pregunta,
            id_usuario: user.id,
            opcion: x.selected.opcion,
            descripcion_opcion: x.selected.descripcion_opcion,
            correcta: x.selected.correcta,
            id_modulo: x.idModulo
            }));

        if (answersToSubmit.length === 0) {
            setValidationMessage("No hay respuestas para enviar.");
            return;
        }
   
        const result = await preguntaService.submitAnswers(answersToSubmit);

        if (!result.success) {
            setApiErrorMessage(result.message);
            return;
        }

        // ✅ Progreso global (usa lo que realmente enviaste)
        setTotalAnsweredGlobal(prev => prev + answersToSubmit.length);

        // ✅ continuar normal: cargar siguiente bloque
        getQuestions(true);

        // ✅ reset UI
        setSelectedAnswers({});
        setCurrentIndex(0);
        setChecked(false);
        setLastCheckResult(null);
        };



    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center p-2 text-white"> {/* p-2 para reducir el padding general */}
            <header className="w-full bg-gray-900 shadow-md py-3 px-3 md:px-6 flex flex-col sm:flex-row items-center justify-between rounded-b-xl mb-4 md:mb-6"> {/* py-3, px-3, mb-4 para reducir espacios */}
                <div className="flex flex-col sm:flex-row items-center justify-between w-full">
                    <h1 className="text-lg font-bold mb-2 sm:mb-0">
                        Bienvenido, {user.nombres}
                    </h1>
                    <div className="flex items-center space-x-2 md:space-x-4 mt-2 sm:mt-0"> {/* mt-2 para los botones si están en una nueva línea */}
                        <button
                            onClick={onNavigateBack}
                            className="py-1 px-3 rounded-lg font-bold text-white transition duration-300 bg-gray-600 hover:bg-gray-700 text-sm" // py-1 px-3 para botones más pequeños
                        >
                            Volver
                        </button>
                        <button
                            onClick={onLogout}
                            className="py-1 px-3 rounded-lg font-bold text-white transition duration-300 bg-red-600 hover:bg-red-700 text-sm" // py-1 px-3 para botones más pequeños
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            <div className="w-full max-w-4xl bg-gray-900 rounded-lg shadow-lg p-4 md:p-6"> {/* max-w-4xl y p-4 para más espacio horizontal */}
                {isLoading && questionsArray.length === 0 && (
                    <p className="text-center text-gray-400 text-sm">Cargando preguntas...</p>
                )}
                
                {(apiErrorMessage || validationMessage || error) && (
                    <div className="bg-red-800 text-white p-3 rounded-lg text-center mb-4">
                        <p>{apiErrorMessage || validationMessage || error}</p>
                    </div>
                )}

                {questionsData && (
                    <>
                    {!isApp && (
                    <>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2">
                            {questionsData?.convocatoria?.nombre}
                        </h2>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-center text-purple-400 mb-4 md:mb-6">
                            {questionsData?.modulo?.nombre}
                        </h3>
                    </>
                )}
                    {current ? (
                        <div className="bg-gray-900 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-800">

                            {/* Header: Pregunta X de N + % */}
                            <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                            <span className="tracking-widest uppercase">
                                Pregunta {currentIndex + 1} de {totalLoaded}
                            </span>
                            <span className="font-semibold">{progress}%</span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-6">
                            <div className="h-full bg-purple-600" style={{ width: `${progress}%` }} />
                            </div>

                            {/* Encabezado */}
                            {current.encabezado && (
                            <div className="border-l-4 border-purple-600 pl-4 mb-5">
                                <p className="text-gray-300 text-sm md:text-base">
                                {current.encabezado}
                                </p>
                            </div>
                            )}

                            {/* Pregunta */}
                            <h2
                                className={`
                                    font-bold text-white leading-snug mb-6
                                    ${isApp 
                                    ? "text-base md:text-lg" 
                                    : "text-lg md:text-2xl"   
                                    }
                                `}
                                >
                                {current.pregunta?.pregunta}
                            </h2>

                            {/* Opciones */}
                            <div className="space-y-3">
                            {current.opciones?.map((opcion, idx) => {
                                const letters = ["A", "B", "C", "D", "E"];
                                const letter = letters[idx] || String(idx + 1);
                                const selected = selectedAnswers[currentQuestionId]?.opcion === opcion.opcion;

                                return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleAnswerChange(currentQuestionId, opcion)}
                                    className={[
                                    "w-full text-left rounded-2xl border px-4 py-4 md:py-5 transition",
                                    "flex items-center gap-4",
                                    selected
                                        ? "bg-purple-700/90 border-purple-500"
                                        : "bg-gray-900 border-gray-700 hover:border-purple-600 hover:bg-gray-800/60"
                                    ].join(" ")}
                                >
                                    <div
                                    className={[
                                        "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                                        selected ? "bg-white text-purple-700" : "bg-gray-800 text-gray-200 border border-gray-600"
                                    ].join(" ")}
                                    >
                                    {letter}
                                    </div>

                                    <div className="flex-1">
                                    <p className="text-gray-100 text-sm md:text-base">
                                        {opcion.descripcion_opcion}
                                    </p>
                                    </div>
                                </button>
                                );
                            })}
                            
                            {checked  && selectedOption && (
                            <div className={`mt-4 rounded-xl border p-4 ${
                                lastCheckResult ? "bg-green-900/20 border-green-700" : "bg-red-900/20 border-red-700"
                            }`}>
                                <p className={`font-bold ${lastCheckResult ? "text-green-300" : "text-red-300"}`}>
                                {lastCheckResult ? "✅ Correcta" : "❌ Incorrecta"}
                                </p>

                                {selectedOption?.retroalimentacion && (
                                <p className="text-gray-200 mt-2 text-sm leading-relaxed">
                                    {selectedOption.retroalimentacion}
                                </p>
                                )}
                            </div>
                            )}
                            </div>

                            {/* Mensajes */}
                            {(apiErrorMessage || validationMessage || error) && (
                            <div className="mt-5 bg-red-800/60 border border-red-700 text-white p-3 rounded-xl text-center text-sm">
                                {apiErrorMessage || validationMessage || error}
                            </div>
                            )}

                            {/* Botones */}
                            <div className="mt-8 flex items-center gap-4">
                            <button
                                type="button"
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                className={[
                                "flex-1 py-3 rounded-xl font-semibold border transition",
                                currentIndex === 0
                                    ? "opacity-50 cursor-not-allowed border-gray-700 bg-gray-900 text-gray-400"
                                    : "border-gray-700 bg-gray-900 hover:bg-gray-800 text-white"
                                ].join(" ")}
                            >
                                Anterior
                            </button>

                            {/* Botón principal */}
                            {!checked ? (
                                <button
                                type="button"
                                onClick={handleCheck}
                                disabled={!hasSelected}
                                className={`flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2
                                    ${!hasSelected ? "opacity-50 cursor-not-allowed bg-purple-700" : "bg-purple-700 hover:bg-purple-800"}`}
                                >
                                Comprobar
                                </button>
                            ) : (
                                <button
                                type="button"
                                onClick={handleContinue}
                                disabled={!hasSelected}
                                className={`flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2
                                    ${!hasSelected ? "opacity-50 cursor-not-allowed bg-purple-700" : "bg-purple-700 hover:bg-purple-800"}`}
                                >
                                Continuar <span className="text-lg">→</span>
                                </button>
                            )}
                            </div>

                        </div>
                        ) : (
                        <p className="text-center text-gray-400 mt-6 text-sm">
                            No se encontraron preguntas para esta convocatoria.
                        </p>
                        )}

                        
                        {/* MODIFICACIÓN: Se elimina el `questionsArray.length > 0` para mostrar solo el mensaje */}
                        {!hasMoreQuestions && (
                            <p className="text-center text-gray-400 mt-6 text-sm">Has llegado al final. No hay más preguntas.</p>
                        )}

                        {isLoading && questionsArray.length > 0 && (
                            <p className="text-center text-gray-400 text-sm mt-6">Cargando más preguntas...</p>
                        )}

                        
                    </>
                )}
            </div>
        </div>
    );
};

export default QuestionsPage;