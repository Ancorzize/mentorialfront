import { useState, useEffect, useMemo } from "react";
import Button from '../../../components/Button';
import useQuestions from '../hooks/useQuestions';
import preguntaService from '../../../api/preguntaService'; 
import { Capacitor } from '@capacitor/core';


const QuestionsPage = ({ user, onLogout, selectedConvocatoria, onNavigateBack }) => {
    
    const { questionsData, isLoading, error, hasMoreQuestions, getQuestions } =
        useQuestions(
            selectedConvocatoria?.id,
            user?.id,
            selectedConvocatoria?.ultima_pregunta,
            selectedConvocatoria?.moduloId
        );

    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [apiErrorMessage, setApiErrorMessage] = useState(null);
    const [validationMessage, setValidationMessage] = useState(null);
    const [isApp, setIsApp] = useState(false);
    const [inactiveUser, setInactiveUser] = useState(false);
    const [inactiveMessage, setInactiveMessage] = useState("");

    const questionsArray = questionsData?.data || [];
    console.log("questionsData completo:", questionsData);
console.log("questionsData.inactivo:", questionsData?.inactivo);
console.log("questionsData.message:", questionsData?.message);
    useEffect(() => {

        if (questionsData?.inactivo) {

            setInactiveUser(true);
            setInactiveMessage(
                questionsData.message ||
                "Ha alcanzado el límite gratuito."
            );

            setCurrentIndex(-1);

        }

    }, [questionsData]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [checked, setChecked] = useState(false);
    const [lastCheckResult, setLastCheckResult] = useState(null);
    const [totalAnsweredGlobal, setTotalAnsweredGlobal] = useState(0);

    useEffect(() => {
        const native = Capacitor.isNativePlatform();
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

    const handleAnswerChange = (questionKey, option) => {

        if (checked) return;

        setSelectedAnswers(prev => ({
            ...prev,
            [questionKey]: option,
        }));
    };

    const flatQuestions = useMemo(() => {

        return (questionsArray || []).flatMap((item) => {

            const idModulo = item?.modulo?.id_modulo;
            const encabezado = item?.encabezado?.encabezado;

            return (item?.preguntas || []).map((preguntaItem) => ({
                idModulo,
                encabezado,
                pregunta: preguntaItem.pregunta,
                opciones: preguntaItem.opciones
            }));
        });

    }, [questionsArray]);

    useEffect(() => {

        if (!isLoading && !hasMoreQuestions && flatQuestions.length === 0) {
            setCurrentIndex(-1);
        }

    }, [isLoading, hasMoreQuestions, flatQuestions.length]);

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

    const finishedAllQuestions = currentIndex === -1;

    const totalLoaded = flatQuestions.length;

    const isLast = currentIndex === totalLoaded - 1;

    const currentQuestionId = current?.pregunta?.id_pregunta;

    const selectedOption =
        currentQuestionId
            ? selectedAnswers[currentQuestionId]
            : null;

    const hasSelected = Boolean(selectedOption);

    const progress =
        totalLoaded > 0
            ? Math.round(((currentIndex + 1) / totalLoaded) * 100)
            : 0;

    const handleCheck = () => {

        if (!hasSelected) {
            setValidationMessage("Selecciona una opción para comprobar.");
            return;
        }

        setValidationMessage(null);
        setChecked(true);

        setLastCheckResult(
            Boolean(selectedOption.correcta)
        );
    };

    const handleContinue = async () => {

        setValidationMessage(null);
        setApiErrorMessage(null);

        if (!hasSelected) {
            setValidationMessage("Selecciona una opción.");
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

        if (currentIndex > 0)
            setCurrentIndex(prev => prev - 1);
    };

    const finishBlock = async () => {

        const summary = buildSummary();

        const answersToSubmit =
            summary
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

            setValidationMessage("No hay respuestas.");
            return;
        }

        const result =
            await preguntaService.submitAnswers(
                answersToSubmit
            );

        if (!result.success) {

            setApiErrorMessage(result.message);
            return;
        }

        setTotalAnsweredGlobal(
            prev => prev + answersToSubmit.length
        );

        const newQuestions = await getQuestions(true);

        if (!newQuestions || newQuestions.data?.length === 0) {

            setSelectedAnswers({});
            setCurrentIndex(-1);
            return;
        }

        setSelectedAnswers({});
        setCurrentIndex(0);
        setChecked(false);
        setLastCheckResult(null);
    };

    return (

        <div className="min-h-screen bg-gray-950 flex flex-col items-center p-2 md:p-4 text-white">

            <header className="w-full bg-gray-900 py-3 px-3 md:px-6 flex flex-col sm:flex-row items-center justify-between rounded-b-xl mb-4">

                <h1 className="text-sm sm:text-base md:text-lg font-bold">
                    Bienvenido, {user.nombres}
                </h1>

                <div className="flex gap-2 mt-2 sm:mt-0">

                    <button
                        onClick={onNavigateBack}
                        className="py-1 px-3 bg-gray-600 hover:bg-gray-700 rounded text-xs md:text-sm"
                    >
                        Volver
                    </button>

                    <button
                        onClick={onLogout}
                        className="py-1 px-3 bg-red-600 hover:bg-red-700 rounded text-xs md:text-sm"
                    >
                        Cerrar Sesión
                    </button>

                </div>

            </header>

            <div className="w-full max-w-4xl bg-gray-900 rounded-lg p-3 md:p-6">

            {inactiveUser && (
                <div className="text-center py-10">
                    <p className="text-red-400 font-bold mb-4">
                        {inactiveMessage}
                    </p>
                    <div className="flex justify-center mt-6">

                        <button
                            onClick={() => {

                                const numero = "573105431968";
                                const mensaje = "Hola, quiero activar mi convocatoria";

                                if (Capacitor.isNativePlatform()) {

                                    window.location.href =
                                        `whatsapp://send?phone=${numero}&text=${encodeURIComponent(mensaje)}`;

                                } else {
                                    window.open(
                                        `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,
                                        "_blank"
                                    );

                                }

                            }}
                            className="
                                flex items-center gap-3
                                bg-[#25D366] hover:bg-[#1ebe5d]
                                text-white
                                px-6 py-3
                                rounded-lg
                                font-bold
                                transition
                                shadow-lg
                            "
                        >

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 32 32"
                                className="w-5 h-5 fill-white"
                            >
                                <path d="M16.002 3C9.383 3 4 8.383 4 15.002c0 2.648.865 5.09 2.329 7.072L4 29l7.146-2.296a11.937 11.937 0 004.856 1.02h.001C22.617 27.724 28 22.34 28 15.724S22.617 3 16.002 3zm0 21.897a9.85 9.85 0 01-5.018-1.37l-.359-.214-4.243 1.365 1.386-4.135-.233-.377a9.836 9.836 0 01-1.504-5.264c0-5.438 4.424-9.861 9.861-9.861s9.861 4.423 9.861 9.861-4.424 9.861-9.861 9.861z"/>
                            </svg>

                            Activar convocatoria

                        </button>

                    </div>

                </div>
            )}

                {!isApp && (
                    <>
                        <h2 className="text-base sm:text-xl md:text-2xl font-bold text-center mb-1">
                            {questionsData?.convocatoria?.nombre}
                        </h2>

                        <h3 className="text-sm sm:text-lg md:text-xl text-purple-400 text-center mb-4">
                            {questionsData?.modulo?.nombre}
                        </h3>
                    </>
                )}

                {current && !inactiveUser && (

                    <div className="border border-gray-800 rounded-xl p-3 md:p-6">

                        <div className="flex justify-between text-xs md:text-sm text-gray-400">

                            <span>
                                Pregunta {currentIndex + 1} de {totalLoaded}
                            </span>

                            <span>
                                {progress}%
                            </span>

                        </div>

                        <div className="w-full h-2 bg-gray-800 rounded mt-2 mb-4">

                            <div
                                className="bg-purple-600 h-full rounded"
                                style={{ width: `${progress}%` }}
                            />

                        </div>

                        {current.encabezado && (

                            <div className="border-l-4 border-purple-600 pl-3 mb-4">

                                <p className="text-xs sm:text-sm md:text-base text-gray-300">

                                    {current.encabezado}

                                </p>

                            </div>

                        )}

                        <h2 className={`font-bold mb-5 leading-snug
                        
                            text-sm
                            sm:text-base
                            md:text-lg
                            lg:text-xl
                        
                        `}>

                            {current.pregunta?.pregunta}

                        </h2>

                        <div className="space-y-2">

                            {current.opciones.map((opcion, idx) => {

                                const letters = ["A", "B", "C", "D"];

                                const selected =
                                    selectedAnswers[currentQuestionId]?.opcion
                                    === opcion.opcion;

                                return (

                                    <button
                                        key={idx}
                                        onClick={() =>
                                            handleAnswerChange(
                                                currentQuestionId,
                                                opcion
                                            )
                                        }
                                        className={`w-full text-left p-3 md:p-4 rounded-xl border transition
                                        
                                        ${selected
                                                ? "bg-purple-700 border-purple-500"
                                                : "bg-gray-900 border-gray-700"
                                            }
                                        
                                        `}
                                    >

                                        <span className="font-bold mr-2">

                                            {letters[idx]}

                                        </span>

                                        <span className="text-xs sm:text-sm md:text-base">

                                            {opcion.descripcion_opcion}

                                        </span>

                                    </button>

                                );

                            })}

                        </div>

                        {checked && selectedOption && (

                            <div className={`mt-4 p-4 rounded-xl border

                                ${lastCheckResult
                                    ? "border-green-700 bg-green-900/20"
                                    : "border-red-700 bg-red-900/20"
                                }

                            `}>

                                <p className="font-bold text-sm md:text-base">

                                    {lastCheckResult
                                        ? "Correcta"
                                        : "Incorrecta"}

                                </p>

                                {selectedOption.retroalimentacion && (

                                    <p className="text-xs sm:text-sm md:text-base mt-2 text-gray-300">

                                        {selectedOption.retroalimentacion}

                                    </p>

                                )}

                            </div>

                        )}

                        <div className="flex gap-2 mt-6">

                            <button
                                onClick={handlePrev}
                                className="flex-1 bg-gray-800 hover:bg-gray-700 p-2 md:p-3 rounded text-xs md:text-sm"
                            >
                                Anterior
                            </button>

                            {!checked ? (

                                <button
                                    onClick={handleCheck}
                                    className="flex-1 bg-purple-700 hover:bg-purple-800 p-2 md:p-3 rounded text-xs md:text-sm"
                                >
                                    Comprobar
                                </button>

                            ) : (

                                <button
                                    onClick={handleContinue}
                                    className="flex-1 bg-purple-700 hover:bg-purple-800 p-2 md:p-3 rounded text-xs md:text-sm"
                                >
                                    Continuar →
                                </button>

                            )}

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

};

export default QuestionsPage;