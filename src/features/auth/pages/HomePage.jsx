

// src/components/HomePage.jsx

import React, { useState } from 'react';
import useSearch from "../hooks/useSearch";
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import HistoryPage from './HistoryPage'; // Importa el nuevo componente

const HomePage = ({ user, onLogout, onConvocatoriaSelect }) => {
    const [viewMode, setViewMode] = useState('search'); // 'search' o 'history'
    
    const { 
        searchTerm, 
        setSearchTerm, 
        searchResults, 
        isLoading, 
        message, 
        handleSearch 
    } = useSearch(user.id);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearch();
    };

    const handleConvocatoriaClick = (convocatoriaId, convocatoriaNombre, ultima_pregunta) => {
        onConvocatoriaSelect({ id: convocatoriaId, nombre: convocatoriaNombre, ultima_pregunta: ultima_pregunta });
    };

    const renderContent = () => {
        if (viewMode === 'history') {
            return <HistoryPage user={user} />;
        }
        
        return (
            <>
                <div className="w-full max-w-2xl text-center mb-6 md:mb-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Prepárate con MentorialPRO</h2>
                    <p className="text-gray-400 text-sm sm:text-base">Busca y encuentra las convocatorias de tu interés.</p>
                </div>
                <form className="w-full max-w-2xl mb-6 md:mb-8 flex flex-col sm:flex-row gap-2 sm:items-end" onSubmit={handleSubmit}>
                    <div className="flex-grow w-full">
                        <p className="block text-sm font-medium text-gray-400 mb-2">Nombre de la convocatoria</p>
                        <Input
                            type="text"
                            placeholder="Buscar convocatorias..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mb-0"
                        />
                    </div>
                    <div className="w-full sm:w-auto sm:self-end">
                        <Button onClick={handleSearch} disabled={isLoading}>
                            {isLoading ? 'Buscando...' : 'Buscar'}
                        </Button>
                    </div>
                </form>
                <div className="w-full max-w-2xl">
                    {isLoading && <p className="text-center text-gray-400 text-sm">Cargando...</p>}
                    {message && <p className="text-center text-red-400 text-sm">{message}</p>}
                    {!isLoading && searchResults.length > 0 && (
                        <div className="bg-gray-900 rounded-lg p-4 md:p-6 shadow-lg">
                            <h3 className="text-lg sm:text-xl font-bold mb-4">Resultados de la búsqueda:</h3>
                            <ul className="space-y-4">
                                {searchResults.map((convocatoria) => (
                                    <li
                                        key={convocatoria.id}
                                        className="bg-gray-800 p-3 sm:p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition duration-300"
                                        onClick={() => handleConvocatoriaClick(convocatoria.id, convocatoria.nombre, convocatoria.ultima_pregunta)}
                                    >
                                        <p className="text-purple-400 font-bold text-base sm:text-lg mb-1">{convocatoria.codigo}</p>
                                        <p className="text-gray-300 text-sm">{convocatoria.nombre}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center p-4 text-white">
            <header className="w-full bg-gray-900 shadow-md py-4 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between rounded-b-xl mb-6 md:mb-8">
                <h1 className="text-lg font-bold mb-2 md:mb-0">
                    Bienvenido, {user.nombres}
                </h1>
                <div className="flex items-center space-x-2 md:space-x-4">
                    <button
                        onClick={() => setViewMode('search')}
                        className={`py-2 px-4 rounded-lg font-bold transition duration-300 ${viewMode === 'search' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-purple-600'} text-sm`}
                    >
                        Buscar
                    </button>
                    <button
                        onClick={() => setViewMode('history')}
                        className={`py-2 px-4 rounded-lg font-bold transition duration-300 ${viewMode === 'history' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-purple-600'} text-sm`}
                    >
                        Histórico
                    </button>
                    <button
                        onClick={onLogout}
                        className="py-2 px-4 rounded-lg font-bold text-white transition duration-300 bg-red-600 hover:bg-red-700 w-full md:w-auto text-sm"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </header>
            
            {renderContent()}
        </div>
    );
};

export default HomePage;
