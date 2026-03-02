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

  // menú lateral
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuOption, setMenuOption] = useState(null);

  // convocatoria / módulos
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);
  const [modulos, setModulos] = useState([]);
  const [isLoadingModulos, setIsLoadingModulos] = useState(false);
  const [modulosMessage, setModulosMessage] = useState('');

  const handleMenuSelect = (option) => {
    setViewMode(null);
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

    if (viewMode === 'search' || viewMode === null) {
    
      return (
        <>

          {/* Título */}
          <div className="
            w-full
            max-w-2xl
            text-center
            mb-4 sm:mb-6
            px-2 sm:px-0
          ">

            <h2 className="
              text-lg
              sm:text-xl
              md:text-3xl
              font-bold
              mb-2
              leading-tight
            ">
              Prepárate con MentorialPRO
            </h2>

            <p className="
              text-xs
              sm:text-sm
              md:text-base
              text-gray-400
            ">
              Busca y encuentra las convocatorias de tu interés.
            </p>

          </div>


          {/* Buscador */}
          <form
            onSubmit={handleSubmit}
            className="
              w-full
              max-w-2xl
              mb-4 sm:mb-6
              flex flex-col
              sm:flex-row
              gap-2 sm:gap-3
            "
          >

            <div className="flex-grow w-full">

              <p className="
                text-xs
                sm:text-sm
                font-medium
                text-gray-400
                mb-1 sm:mb-2
              ">
                Nombre de la convocatoria
              </p>

              <Input
                type="text"
                placeholder="Buscar convocatorias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-0"
              />

            </div>

            <div className="w-full sm:w-auto sm:self-end">

              <Button
                disabled={isLoading}
                type="submit"
                className="min-h-[44px] w-full sm:w-auto"
              >
                {isLoading ? 'Buscando...' : 'Buscar'}
              </Button>

            </div>

          </form>


          {/* Resultados */}
          <div className="w-full max-w-2xl">

            {isLoading && (
              <p className="text-center text-gray-400 text-sm">
                Cargando...
              </p>
            )}

            {message && (
              <p className="text-center text-red-400 text-sm">
                {message}
              </p>
            )}


            {/* Lista convocatorias */}
            {!selectedConvocatoria && searchResults.length > 0 && (

              <div className="
                bg-gray-900
                rounded-lg
                p-4 sm:p-6
                shadow-lg
              ">

                <h3 className="
                  text-base
                  sm:text-lg
                  md:text-xl
                  font-bold
                  mb-4
                ">
                  Resultados de la búsqueda
                </h3>

                <ul className="space-y-3 sm:space-y-4">

                  {searchResults.map((c) => (

                    <li
                      key={c.id}
                      onClick={() => handleConvocatoriaClick(c)}
                      className="
                        bg-gray-800
                        p-3 sm:p-4
                        rounded-lg
                        cursor-pointer
                        active:bg-gray-700
                        sm:hover:bg-gray-700
                        transition
                        min-h-[44px]
                        flex flex-col justify-center
                      "
                    >

                      <p className="text-purple-400 font-bold text-sm sm:text-base">
                        {c.codigo}
                      </p>

                      <p className="text-gray-300 text-xs sm:text-sm">
                        {c.nombre}
                      </p>

                    </li>

                  ))}

                </ul>

              </div>

            )}


            {/* Módulos */}
            {selectedConvocatoria && (

              <div className="
                bg-gray-900
                rounded-lg
                p-4 sm:p-6
                shadow-lg
              ">

                <div className="flex justify-between items-center mb-4 gap-3">

                  <div>

                    <p className="text-purple-400 font-bold text-sm sm:text-base">
                      {selectedConvocatoria.codigo}
                    </p>

                    <p className="text-gray-300 text-xs sm:text-sm">
                      {selectedConvocatoria.nombre}
                    </p>

                  </div>

                  <button
                    onClick={handleBackToResults}
                    className="
                      bg-gray-700
                      active:bg-gray-600
                      sm:hover:bg-gray-600
                      px-3 py-2
                      rounded-lg
                      text-xs sm:text-sm
                      min-h-[44px]
                    "
                  >
                    Volver
                  </button>

                </div>


                <h3 className="
                  text-base
                  sm:text-lg
                  md:text-xl
                  font-bold
                  mb-4
                ">
                  Selecciona un módulo
                </h3>


                {isLoadingModulos && (
                  <p className="text-gray-400 text-center text-sm">
                    Cargando módulos...
                  </p>
                )}

                {!isLoadingModulos && modulosMessage && (
                  <p className="text-gray-400 text-center text-sm">
                    {modulosMessage}
                  </p>
                )}


                {!isLoadingModulos && modulos.length > 0 && (

                  <ul className="space-y-3">

                    {modulos.map((m) => (

                      <li
                        key={m.id}
                        onClick={() => handleModuloClick(m)}
                        className="
                          bg-gray-800
                          p-3 sm:p-4
                          rounded-lg
                          cursor-pointer
                          active:bg-gray-700
                          sm:hover:bg-gray-700
                          transition
                          min-h-[44px]
                          flex items-center
                          text-sm sm:text-base
                        "
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
    }
  };


  return (
    <>

      {/* SideMenu */}
      <SideMenu
        isOpen={isMenuOpen}
        onToggle={() => setIsMenuOpen(!isMenuOpen)}
        onSelect={handleMenuSelect}
      />


      {/* Layout */}
      <div className="
        min-h-[100dvh]
        bg-gray-950
        text-white
        transition-all duration-300
        ml-0
        md:ml-64
        overflow-x-hidden
      ">


        {/* Header */}
        <header className="
          bg-gray-900 shadow-md
          py-3 px-3 sm:px-4 md:px-6
          flex flex-col sm:flex-row
          items-start sm:items-center
          justify-between
          gap-3
          rounded-b-xl mb-4 sm:mb-6
        ">

          <h1 className="
            text-sm
            sm:text-base
            md:text-xl
            font-bold
            leading-tight
          ">
            Bienvenido, {user.nombres}
          </h1>


          <div className="flex gap-2 w-full sm:w-auto">


            {/* Buscar */}
            <button
              onClick={() => {
                setMenuOption(null);
                setViewMode('search');
              }}
              className={`
                flex items-center justify-center gap-2
                flex-1 sm:flex-none
                min-h-[44px]
                px-3 sm:px-4
                py-2
                rounded-lg
                text-xs sm:text-sm
                font-semibold
                transition-all duration-200

                ${viewMode === 'search'
                  ? 'bg-purple-600'
                  : 'bg-gray-700 active:bg-purple-600 sm:hover:bg-purple-600'}
              `}
            >
              <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5"/>
              Buscar
            </button>


            {/* Histórico */}
            <button
             onClick={() => {
              setMenuOption(null);
              setViewMode('history');
            }}
              className={`
                flex items-center justify-center gap-2
                flex-1 sm:flex-none
                min-h-[44px]
                px-3 sm:px-4
                py-2
                rounded-lg
                text-xs sm:text-sm
                font-semibold
                transition-all duration-200

                ${viewMode === 'history'
                  ? 'bg-purple-600'
                  : 'bg-gray-700 active:bg-purple-600 sm:hover:bg-purple-600'}
              `}
            >
              <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5"/>
              Histórico
            </button>


            {/* Logout */}
            <button
              onClick={onLogout}
              className="
                flex items-center justify-center gap-2
                flex-1 sm:flex-none
                min-h-[44px]
                px-3 sm:px-4
                py-2
                rounded-lg
                text-xs sm:text-sm
                font-semibold
                bg-red-600
                active:bg-red-700
                sm:hover:bg-red-700
                transition-all duration-200
              "
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 sm:h-5 sm:w-5"/>
              Salir
            </button>


          </div>

        </header>


        {/* Contenido */}
        <div className="
          flex flex-col
          items-center
          justify-start
          px-3 sm:px-4
          pb-6 sm:pb-8
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