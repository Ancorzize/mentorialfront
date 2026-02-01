// src/components/HomePage.jsx
import React, { useState } from 'react';
import useSearch from "../hooks/useSearch";
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import HistoryPage from './HistoryPage';
import convocatoriaService from '../../../api/convocatoriaService'; // ✅ ajusta ruta real

const HomePage = ({ user, onLogout, onConvocatoriaSelect }) => {
  const [viewMode, setViewMode] = useState('search');

  // ✅ Paso intermedio módulos
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null); // {id,nombre,codigo,ultima_pregunta}
  const [modulos, setModulos] = useState([]);
  const [isLoadingModulos, setIsLoadingModulos] = useState(false);
  const [modulosMessage, setModulosMessage] = useState('');

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

  const handleConvocatoriaClick = async (convocatoria) => {
    setSelectedConvocatoria({
      id: convocatoria.id,
      nombre: convocatoria.nombre,
      codigo: convocatoria.codigo,
      ultima_pregunta: convocatoria.ultima_pregunta
    });

    setIsLoadingModulos(true);
    setModulos([]);
    setModulosMessage('');

    const data = await convocatoriaService.getModulosByConvocatoria(convocatoria.id);

    if (!data || data.length === 0) {
      setModulosMessage('Esta convocatoria no tiene módulos disponibles.');
      setModulos([]);
    } else {
      setModulos(data);
    }

    setIsLoadingModulos(false);
  };

  const handleModuloClick = (modulo) => {
    // ✅ Aquí continúa el flujo normal (ahora con moduloId)
    onConvocatoriaSelect({
      id: selectedConvocatoria.id,
      nombre: selectedConvocatoria.nombre,
      ultima_pregunta: selectedConvocatoria.ultima_pregunta,
      moduloId: modulo.id,
      moduloNombre: modulo.nombre
    });
  };

  const handleBackToResults = () => {
    setSelectedConvocatoria(null);
    setModulos([]);
    setModulosMessage('');
    setIsLoadingModulos(false);
  };

  const renderContent = () => {
    if (viewMode === 'history') return <HistoryPage user={user} />;

    return (
      <>
        <div className="w-full max-w-2xl text-center mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Prepárate con MentorialPRO</h2>
          <p className="text-gray-400 text-sm sm:text-base">Busca y encuentra las convocatorias de tu interés.</p>
        </div>

        <form
          className="w-full max-w-2xl mb-6 md:mb-8 flex flex-col sm:flex-row gap-2 sm:items-end"
          onSubmit={handleSubmit}
        >
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
            {/* Mejor submit para evitar doble disparo */}
            <Button disabled={isLoading} type="submit">
              {isLoading ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
        </form>

        <div className="w-full max-w-2xl">
          {isLoading && <p className="text-center text-gray-400 text-sm">Cargando...</p>}
          {message && <p className="text-center text-red-400 text-sm">{message}</p>}

          {/* ✅ Vista resultados */}
          {!selectedConvocatoria && !isLoading && searchResults.length > 0 && (
            <div className="bg-gray-900 rounded-lg p-4 md:p-6 shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Resultados de la búsqueda:</h3>
              <ul className="space-y-4">
                {searchResults.map((convocatoria) => (
                  <li
                    key={convocatoria.id}
                    className="bg-gray-800 p-3 sm:p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition duration-300"
                    onClick={() => handleConvocatoriaClick(convocatoria)}
                  >
                    <p className="text-purple-400 font-bold text-base sm:text-lg mb-1">{convocatoria.codigo}</p>
                    <p className="text-gray-300 text-sm">{convocatoria.nombre}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ✅ Vista módulos */}
          {selectedConvocatoria && (
            <div className="bg-gray-900 rounded-lg p-4 md:p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-purple-400 font-bold text-base sm:text-lg">{selectedConvocatoria.codigo}</p>
                  <p className="text-gray-300 text-sm">{selectedConvocatoria.nombre}</p>
                </div>
                <button
                  onClick={handleBackToResults}
                  className="py-2 px-3 rounded-lg font-bold transition duration-300 bg-gray-700 hover:bg-gray-600 text-sm"
                >
                  Volver
                </button>
              </div>

              <h3 className="text-lg sm:text-xl font-bold mb-4">Selecciona un módulo</h3>

              {isLoadingModulos && (
                <p className="text-center text-gray-400 text-sm">Cargando módulos...</p>
              )}

              {!isLoadingModulos && modulosMessage && (
                <p className="text-center text-gray-400 text-sm">{modulosMessage}</p>
              )}

              {!isLoadingModulos && !modulosMessage && modulos.length > 0 && (
                <ul className="space-y-3">
                  {modulos.map((m) => (
                    <li
                      key={m.id}
                      className="bg-gray-800 p-3 sm:p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition duration-300"
                      onClick={() => handleModuloClick(m)}
                    >
                      <p className="text-gray-200 font-bold text-sm sm:text-base">{m.nombre}</p>
                    </li>
                  ))}
                </ul>
              )}
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
