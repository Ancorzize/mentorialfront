import React, { useState, useEffect } from 'react';
import { BookOpenCheck, DownloadCloud, Menu, Smartphone, Facebook, Twitter, Instagram, Linkedin, Rocket, Eye } from 'lucide-react';
import { FaAndroid, FaWhatsapp } from "react-icons/fa";
import sendContactEmail from '../../../api/sendContactEmailService';
import getConvocatorias from '../../../api/getConvocatoriasService'; 

const LandingPage = ({ onLoginClick }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [convocatorias, setConvocatorias] = useState([]); 
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        const fetchConvocatorias = async () => {
            const result = await getConvocatorias();
            if (result.success) {
                setConvocatorias(result.convocatorias);
            } else {
                console.error(result.message);
            }
        };

        fetchConvocatorias();
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);

        const result = await sendContactEmail(formData);

        if (result.success) {
            setFeedback({ type: "success", message: result.message });
            setFormData({ name: "", email: "", message: "" });
        } else {
            setFeedback({ type: "error", message: result.message });
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-dark-bg text-gray-200 font-sans">
            {/* Encabezado y Navegación */}
            <header className="bg-dark-card/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-700">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <a href="#" className="flex items-center space-x-2 text-2xl font-bold text-white">
                        <span>
                           
                            <span className="text-white">Mentorial</span>
                            <span className="text-purple-600">PRO</span>
                        </span>
                    </a>

                    {/* Menú de Navegación (Escritorio) */}
                    <ul className="hidden md:flex items-center space-x-8">
                        <li><a href="#inicio" className="text-gray-300 hover:text-purple-500 transition-colors">Inicio</a></li>
                        <li><a href="#cursos" className="text-gray-300 hover:text-purple-500 transition-colors">Simulacros</a></li>
                        <li><a href="#acerca" className="text-gray-300 hover:text-purple-500 transition-colors">Acerca de la App</a></li>
                        <li><a href="#mision" className="text-gray-300 hover:text-purple-500 transition-colors">Misión</a></li>
                        <li><a href="#vision" className="text-gray-300 hover:text-purple-500 transition-colors">Visión</a></li>
                        <li><a href="#planes" className="text-gray-300 hover:text-purple-500 transition-colors">Planes</a></li>
                        <li><a href="#contacto" className="text-gray-300 hover:text-purple-500 transition-colors">Contacto</a></li>
                    </ul>

                    {/* Botones (Escritorio) */}
                    <div className="hidden md:flex items-center space-x-4">
                        <a 
                            href="https://github.com/ancorzize0250/MentorialAPKAndroid/releases/download/v1.0/mentorial.apk" 
                            download 
                            className="flex items-center space-x-2 bg-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold 
                                     hover:bg-purple-800 transition-transform hover:scale-105 shadow-lg shadow-purple-500/40"
                        >
                            <DownloadCloud />
                            <span>Descargar App</span>
                        </a>
                        <a href="https://wa.me/3013587610" className="flex items-center space-x-2 bg-[#25D366] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#20b85a] transition-transform hover:scale-105" aria-label="Contactar por WhatsApp">
                            <FaWhatsapp size={20} />
                            <span>WhatsApp</span>
                        </a>
                        <button onClick={onLoginClick} className="flex items-center space-x-2 bg-white text-gray-800 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-transform hover:scale-105">
                            Login
                        </button>
                    </div>

                    {/* Botón de Menú (Móvil) */}
                    <button onClick={toggleMobileMenu} className="md:hidden text-white">
                        <Menu className="w-6 h-6" />
                    </button>
                </nav>

                {/* Menú de Navegación (Móvil) */}
                <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:hidden flex-col items-center p-4 space-y-4 bg-dark-card border-t border-gray-700`}>
                    <ul className="flex flex-col items-center p-4 space-y-4 w-full">
                        <li><a href="#inicio" className="text-gray-300 hover:text-purple-500">Inicio</a></li>
                        <li><a href="#cursos" className="text-gray-300 hover:text-purple-500">Simulacros</a></li>
                        <li><a href="#acerca" className="text-gray-300 hover:text-purple-500">Acerca de la App</a></li>
                        <li><a href="#mision" className="text-gray-300 hover:text-purple-500">Misión</a></li>
                        <li><a href="#vision" className="text-gray-300 hover:text-purple-500">Visión</a></li>
                        <li><a href="#planes" className="text-gray-300 hover:text-purple-500">Planes</a></li>
                        <li><a href="#contacto" className="text-gray-300 hover:text-purple-500">Contacto</a></li>
                        <li className="w-full">
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full">
                                <a 
                                    href="https://github.com/ancorzize0250/MentorialAPKAndroid/releases/download/v1.0/mentorial.apk" 
                                    className="flex items-center justify-center space-x-2 bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold 
                                             hover:bg-purple-800 transition-transform hover:scale-105 shadow-lg shadow-purple-500/40 w-full text-center"
                                >
                                    <FaAndroid size={20} />
                                    <span>Descargar App</span>
                                </a>
                                
                                <a 
                                    href="https://wa.me/3013587610" 
                                    className="flex items-center justify-center space-x-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold 
                                             hover:bg-[#20b85a] transition-transform hover:scale-105 w-full text-center" 
                                    aria-label="Contactar por WhatsApp"
                                >
                                    <FaWhatsapp size={20} />
                                    <span>WhatsApp</span>
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </header>

            {/* Contenido Principal */}
            <main>
                {/* Sección de Inicio (Hero) */}
                <section id="inicio" className="py-20 md:py-32">
                    <div className="container mx-auto px-6 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">Tu Futuro Profesional Comienza Aquí.</h1>
                        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                            Potencia tu preparación con simulacros en línea de alta calidad creados por expertos, y da el siguiente paso para ganar tu concurso de mérito
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <button 
                                onClick={onLoginClick} 
                                className="bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold 
                                         hover:bg-purple-800 transition-transform hover:scale-105 
                                         shadow-lg shadow-purple-500/40 w-full sm:w-auto"
                            >
                                Explorar Simulacros
                            </button>
                            <a 
                                href="https://github.com/ancorzize0250/MentorialAPKAndroid/releases/download/v1.0/mentorial.apk" 
                                className="bg-dark-card text-white px-8 py-4 rounded-lg font-semibold 
                                         hover:bg-gray-700 transition-transform hover:scale-105 
                                         w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                <FaAndroid size={22} />
                                <span>Descargar la App</span>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Sección de Cursos */}
                <section id="cursos" className="py-20 bg-dark-card">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Simulacros Populares</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* <-- Mapeo dinámico de las convocatorias */}
                            {convocatorias.length > 0 ? (
                                convocatorias.map((convocatoria) => {
                                // Validación adicional para asegurar que 'convocatoria' no es null o undefined
                                if (!convocatoria) {
                                    return null; // Si es nulo, no renderiza nada para este elemento
                                }
                                
                                return (
                                    <div 
                                        key={convocatoria.id} 
                                        className="bg-dark-bg rounded-lg border border-gray-700 overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 hover:border-purple-500"
                                    >
                                        <img 
                                            src={convocatoria.logotipo || 'URL_DE_IMAGEN_POR_DEFECTO'} 
                                            alt={`Logo de ${convocatoria.nombre}`} 
                                            className="w-full h-40 object-contain p-4" 
                                        />
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-white mb-2">{convocatoria.nombre}</h3>
                                            <p className="text-gray-400 mb-4">{convocatoria.descripcion}</p>
                                            <a href={convocatoria.enlace || '#'} target="_blank" rel="noopener noreferrer" className="text-purple-500 font-semibold hover:underline">Ver detalles de la convocatoria &rarr;</a>
                                        </div>
                                    </div>
                                );
                            })
                            ) : (
                                <p className="text-center text-gray-400 col-span-full">Cargando simulacros...</p>
                            )}
                        </div>
                    </div>
                </section>
                
                {/* Sección: Acerca de la App */}
                <section id="acerca" className="py-20 bg-dark-card">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Acerca de la App</h2>
                        <div className="max-w-4xl mx-auto text-center md:text-left">
                            <h3 className="text-2xl font-bold text-white mb-4">Tu Futuro Profesional Comienza Aquí.</h3>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                En MentorialPRO, te ayudamos a prepararte para los concursos de mérito con una metodología que va más allá de la memorización. Nuestra app con 600 preguntas, disponible en versión web y móvil, te permite estudiar las pruebas de manera efectiva.
                            </p>
                            <p className="text-lg font-semibold text-purple-400 mb-2">¿Cómo Funciona?</p>
                            <ul className="list-disc list-inside space-y-4 text-gray-400">
                                <li>
                                    <span className="font-bold text-white">Contexto y Análisis:</span> Cada simulacro comienza con una introducción detallada. Este "encabezado" te proporciona el contexto necesario para comprender y analizar las preguntas que vienen a continuación. Esto imita la estructura de las pruebas reales, donde la comprensión lectora y el análisis de la información son cruciales.
                                </li>
                                <li>
                                    <span className="font-bold text-white">Preguntas y Respuestas en Tiempo Real:</span> A medida que avanzas, la aplicación te presenta preguntas relacionadas con el encabezado, el total de preguntas son 600 por convocatoria. Al seleccionar una opción, recibes retroalimentación inmediata. Sabrás al instante si tu respuesta es correcta o incorrecta. Esto te permite corregir errores y reforzar conceptos al momento.
                                </li>
                                <li>
                                    <span className="font-bold text-white">Análisis de la Respuesta Correcta:</span> Lo más importante es el análisis. Después de cada pregunta, la aplicación te muestra la respuesta correcta y una explicación detallada de por qué esa es la opción adecuada. Este paso es fundamental para que no solo memorices, sino que realmente comprendas los temas.
                                </li>
                                <li>
                                    <span className="font-bold text-white">Acceso Flexible:</span> Nuestra aplicación está diseñada para que estudies en cualquier momento y lugar. Ya sea desde la comodidad de tu casa en la versión web o en tus trayectos diarios con la aplicación móvil, MentorialPRO se adapta a tu ritmo de vida.
                                </li>
                                <li>
                                    <span className="font-bold text-white">Práctica Ilimitada:</span> Una vez que adquieres un paquete, tienes acceso a simulacros que puedes repetir infinitas veces. Esta práctica constante te ayuda a dominar el temario y a reducir la ansiedad frente a la prueba real.
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
                
                {/* Sección de Misión y Visión */}
                <section id="mision" className="py-20 bg-dark-bg">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            {/* Misión */}
                            <div className="text-center md:text-left">
                                <div className="flex justify-center md:justify-start mb-4">
                                    <div className="bg-purple-500/10 text-purple-500 p-4 rounded-full">
                                        <Rocket className="w-8 h-8" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-4">Nuestra Misión</h2>
                                <p className="text-gray-400 leading-relaxed">
                                    Brindar a los aspirantes a concursos de mérito en Colombia una plataforma web innovadora, accesible y confiable que ofrezca simulacros en línea de alta calidad, diseñados para fortalecer sus conocimientos, medir su nivel de preparación y aumentar sus posibilidades de éxito en procesos de entidades como la Fiscalía, la Contraloría, el SENA y demás instituciones públicas.
                                </p>
                            </div>
                            {/* Visión */}
                            <div id="vision" className="text-center md:text-left">
                                <div className="flex justify-center md:justify-start mb-4">
                                    <div className="bg-purple-500/10 text-purple-500 p-4 rounded-full">
                                        <Eye className="w-8 h-8" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-4">Nuestra Visión</h2>
                                <p className="text-gray-400 leading-relaxed">
                                    Ser la plataforma líder en Colombia en preparación virtual para concursos de mérito, reconocida por la calidad de sus simulacros, el uso de tecnología educativa avanzada y el compromiso con el logro profesional de nuestros usuarios, contribuyendo a la formación de servidores públicos altamente capacitados.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Nueva Sección: Planes y Métodos de Pago */}
                <section id="planes" className="py-20">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Planes y Métodos de Pago</h2>
                        <div className="bg-dark-card rounded-lg shadow-lg p-8 md:p-10 border border-gray-700 max-w-2xl mx-auto">
                            <p className="text-lg md:text-xl text-gray-400 mb-6">
                                Con MentorialPRO, obtienes acceso ilimitado a nuestros simulacros de alta calidad.
                            </p>
                            <div className="bg-purple-700 text-white p-4 rounded-lg mb-6 shadow-md">
                                <h3 className="text-2xl font-bold">
                                    Precio por Paquete desde: **$25.000 COP**
                                </h3>
                                <p className="text-sm mt-1">¡**Promoción por tiempo limitado o hasta agotar cupos**!</p>
                            </div>
                            
                            <h4 className="text-lg font-semibold text-white mb-4">Métodos de Pago:</h4>
                            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8 mb-6">
                                <div className="bg-gray-800 p-4 rounded-lg flex-1">
                                    <h5 className="font-bold text-purple-400 mb-1">Nequi</h5>
                                    <p className="text-white">**3106011864**</p>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-lg flex-1">
                                    <h5 className="font-bold text-purple-400 mb-1">Bancolombia Ahorros</h5>
                                    <p className="text-white">**23619356454**</p>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-lg flex-1">
                                    <h5 className="font-bold text-purple-400 mb-1">Daviplata</h5>
                                    <p className="text-white">**3205016566**</p>
                                </div>
                            </div>
                            
                            <p className="text-gray-400 leading-relaxed mb-6">
                                Una vez realizado el pago, por favor envía la confirmación de la transacción a nuestro WhatsApp para la activación de tu cuenta.
                            </p>
                            
                            <a href="https://wa.me/3013587610" className="bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#20b85a] transition-colors flex items-center justify-center space-x-2 w-full md:w-auto mx-auto shadow-lg">
                                <FaWhatsapp size={20} />
                                <span>Activar mi Cuenta (WhatsApp)</span>
                            </a>
                            
                            <div className="mt-8 pt-6 border-t border-gray-700">
                                <h4 className="text-lg font-semibold text-white mb-2">Versión Gratuita para Empezar</h4>
                                <p className="text-gray-400 leading-relaxed">
                                    ¿Quieres probarlo antes de comprar? Nuestra plataforma te ofrece preguntas y simulacros gratuitos para que experimentes de primera mano nuestra metodología. De esta manera, puedes evaluar la calidad de nuestro contenido y el valor que te ofrecemos en tu preparación.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sección de Contacto */}
                <section id="contacto" className="py-20 bg-dark-bg">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">Ponte en Contacto</h2>
                        <p className="text-lg text-gray-400 text-center max-w-2xl mx-auto mb-12">
                            ¿Tienes alguna pregunta o quieres colaborar con nosotros? Envíanos un mensaje y te responderemos lo antes posible.
                        </p>
                        <div className="max-w-xl mx-auto bg-dark-card p-8 rounded-lg border border-gray-700">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label htmlFor="name" className="block text-gray-300 font-semibold mb-2">Nombre</label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                                        placeholder="Tu nombre completo" 
                                        required 
                                    />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="email" className="block text-gray-300 font-semibold mb-2">Correo Electrónico</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                                        placeholder="tu@email.com" 
                                        required 
                                    />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="message" className="block text-gray-300 font-semibold mb-2">Mensaje</label>
                                    <textarea 
                                        id="message" 
                                        name="message"
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                                        placeholder="Escribe tu mensaje aquí..." 
                                        required
                                    ></textarea>
                                </div>
                                <div className="text-center">
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-800 transition-colors w-full shadow-lg shadow-purple-500/40 disabled:opacity-50"
                                    >
                                        {loading ? "Enviando..." : "Enviar Mensaje"}
                                    </button>
                                </div>
                            </form>

                            {/* 👇 Feedback al usuario */}
                            {feedback && (
                                <p className={`mt-4 text-center font-semibold ${feedback.type === "success" ? "text-green-400" : "text-red-400"}`}>
                                    {feedback.message}
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* Pie de Página */}
            <footer className="bg-dark-bg border-t border-gray-700 py-12">
                <div className="container mx-auto px-6 text-center">
                    <a href="#" className="flex items-center justify-center space-x-2 text-2xl font-bold text-white mb-0">
                        <img src="/mentoriallogo.png" alt="Mentorial Logo" className="w-[150px] h-[150px]" />
                    </a>
                    <p className="mb-6 text-gray-400">Transformando el aprendizaje, una habilidad a la vez.</p>
                    <div className="flex justify-center space-x-6 mb-8 text-gray-400">
                        <a href="https://www.facebook.com/profile.php?id=61581187410299" className="hover:text-purple-500"><Facebook /></a>
                        <a href="#" className="hover:text-purple-500"><Instagram /></a>
                    </div>
                    <p className="text-gray-500">&copy; 2025 MentorialPRO. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;