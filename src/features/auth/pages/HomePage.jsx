// src/components/HomePage.jsx
import React, { useState } from 'react';
import useSearch from "../hooks/useSearch";
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import HistoryPage from './HistoryPage';
import convocatoriaService from '../../../api/convocatoriaService';
import SideMenu from '../components/SideMenu';
import MySimulacros from '../components/MySimulacros';

import {
  MagnifyingGlassIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/solid';

const HomePage = ({ user, onLogout, onConvocatoriaSelect }) => {
  const [viewMode, setViewMode] = useState('search');
  // Menú lateral (comprimido por defecto)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuOption, setMenuOption] = useState(null);

  // Convocatoria / módulos
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);
  const [modulos, setModulos] = useState([]);
  const [isLoadingModulos, setIsLoadingModulos] = useState(false);
  const [modulosMessage, setModulosMessage] = useState('');

  const handleMenuSelect = (option) => {
    setMenuOption(option);
  };
  

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
      codigo: convocatoria.codigo
    });

    setIsLoadingModulos(true);
    setModulos([]);
    setModulosMessage('');

    const data = await convocatoriaService.getModulosByConvocatoria(
      convocatoria.id,
      user.id
    );

    if (!data || data.length === 0) {
      setModulosMessage('Esta convocatoria no tiene módulos disponibles.');
    } else {
      setModulos(data);
    }

    setIsLoadingModulos(false);
  };

  const handleModuloClick = (modulo) => {
    onConvocatoriaSelect({
      id: selectedConvocatoria.id,
      nombre: selectedConvocatoria.nombre,
      ultima_pregunta: modulo.ultima_pregunta ?? 0,
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
    if (menuOption === 'mis-simulacros') {
      return <MySimulacros user={user} />;
    }

    if (viewMode === 'history') {
      return <HistoryPage user={user} />;
    }

    return (
      <>
        {/* Título */}
        <div className="w-full max-w-2xl text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">
            Prepárate con MentorialPRO
          </h2>
          <p className="text-gray-400">
            Busca y encuentra las convocatorias de tu interés.
          </p>
        </div>

        {/* Buscador */}
        <form
          className="w-full max-w-2xl mb-6 flex flex-col sm:flex-row gap-2"
          onSubmit={handleSubmit}
        >
          <div className="flex-grow w-full"> 
            <p className="block text-sm font-medium text-gray-400 mb-2">Nombre de la convocatoria</p> 
            <Input type="text" placeholder="Buscar convocatorias..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="mb-0" /> </div> 
            <div className="w-full sm:w-auto sm:self-end"> 

              <Button disabled={isLoading} type="submit" > {isLoading ? 'Buscando...' : 'Buscar'} </Button> 
            </div>
        </form>

        {/* Resultados */}
        <div className="w-full max-w-2xl">
          {isLoading && (
            <p className="text-center text-gray-400">Cargando...</p>
          )}

          {message && (
            <p className="text-center text-red-400">{message}</p>
          )}

          {!selectedConvocatoria && searchResults.length > 0 && (
            <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">
                Resultados de la búsqueda
              </h3>
              <ul className="space-y-4">
                {searchResults.map((c) => (
                  <li
                    key={c.id}
                    onClick={() => handleConvocatoriaClick(c)}
                    className="bg-gray-800 p-4 rounded-lg cursor-pointer
                    hover:bg-gray-700 transform hover:scale-[1.02]
                    transition"
                  >
                    <p className="text-purple-400 font-bold">
                      {c.codigo}
                    </p>
                    <p className="text-gray-300 text-sm">
                      {c.nombre}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedConvocatoria && (
            <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-purple-400 font-bold">
                    {selectedConvocatoria.codigo}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {selectedConvocatoria.nombre}
                  </p>
                </div>
                <button
                  onClick={handleBackToResults}
                  className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm"
                >
                  Volver
                </button>
              </div>

              <h3 className="text-xl font-bold mb-4">
                Selecciona un módulo
              </h3>

              {isLoadingModulos && (
                <p className="text-gray-400 text-center">
                  Cargando módulos...
                </p>
              )}

              {!isLoadingModulos && modulosMessage && (
                <p className="text-gray-400 text-center">
                  {modulosMessage}
                </p>
              )}

              {!isLoadingModulos && modulos.length > 0 && (
                <ul className="space-y-3">
                  {modulos.map((m) => (
                    <li
                      key={m.id}
                      onClick={() => handleModuloClick(m)}
                      className="bg-gray-800 p-4 rounded-lg cursor-pointer
                      hover:bg-gray-700 transition"
                    >
                      {m.nombre}
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
    <>
      {/* Menú lateral */}
      <SideMenu
        isOpen={isMenuOpen}
        onToggle={() => setIsMenuOpen(!isMenuOpen)}
        onSelect={handleMenuSelect}
      />

      {/* Layout principal */}
        <div
          className={`
            min-h-[100dvh]
            bg-gray-950
            text-white
            transition-all duration-300

            ml-0
            md:ml-16
            ${isMenuOpen ? 'md:ml-64' : ''}
          `}
        >
        {/* Header */}
        <header className="
            bg-gray-900 shadow-md py-4 px-4 md:px-6
            flex flex-col md:flex-row
            items-start md:items-center
            justify-between
            gap-3
            rounded-b-xl mb-6
          ">
          <h1 className="text-lg font-bold whitespace-nowrap">
            Bienvenido, {user.nombres}
          </h1>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setViewMode('search')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold
              ${viewMode === 'search'
                ? 'bg-purple-600'
                : 'bg-gray-700 hover:bg-purple-600'}`}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              Buscar
            </button>

            <button
              onClick={() => setViewMode('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold
              ${viewMode === 'history'
                ? 'bg-purple-600'
                : 'bg-gray-700 hover:bg-purple-600'}`}
            >
              <ClockIcon className="h-5 w-5" />
              Histórico
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg
              bg-red-600 hover:bg-red-700 text-sm font-bold"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Cerrar sesión
            </button>
          </div>
        </header>

        {/* Contenido */}
        <div className="
            flex flex-col
            items-center
            justify-start
            px-4
            pb-8
            w-full
            max-w-4xl
            mx-auto
          ">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default HomePage;