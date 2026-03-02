import {
  Cog6ToothIcon,
  LockClosedIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/solid';

const SideMenu = ({ isOpen, onToggle, onSelect }) => {

  // Detectar si es móvil
  const isMobile = () => window.innerWidth < 768;

  // Manejar selección
  const handleSelect = (option) => {
    onSelect(option);

    // SOLO en móvil se comprime automáticamente
    if (isMobile()) {
      onToggle();
    }
  };

  return (
    <>
      {/* Botón flotante SIEMPRE visible */}
      <button
        onClick={onToggle}
        className="
          fixed
          top-4
          left-4
          z-50
          bg-gray-800 hover:bg-purple-600
          text-white
          w-10 h-10
          rounded-full
          flex items-center justify-center
          shadow-lg
          transition
          transition-transform duration-300
          md:hidden
        "
      >
        {isOpen
          ? <ChevronLeftIcon className="h-6 w-6" />
          : <ChevronRightIcon className="h-6 w-6" />
        }
      </button>

      {/* Overlay oscuro */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Menú lateral deslizante */}
      <aside
        className={`
          fixed
          top-0
          left-0
          h-[100dvh]
          w-64
          bg-gray-900
          text-white
          shadow-xl
          z-50
          transform
          transition-transform duration-300

          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="p-4 mt-14">

          <ul className="space-y-3">

            <li
              onClick={() => handleSelect('password')}
              className="cursor-pointer bg-gray-800 hover:bg-gray-700 transition rounded-lg p-3 text-sm flex items-center gap-3"
            >
              <LockClosedIcon className="h-6 w-6 text-purple-400" />
              Cambio de contraseña
            </li>

            <li
              onClick={() => handleSelect('mis-simulacros')}
              className="cursor-pointer bg-gray-800 hover:bg-gray-700 transition rounded-lg p-3 text-sm flex items-center gap-3"
            >
              <ChartBarIcon className="h-6 w-6 text-purple-400" />
              Mis simulacros
            </li>

            <li
              onClick={() => handleSelect('settings')}
              className="cursor-pointer bg-gray-800 hover:bg-gray-700 transition rounded-lg p-3 text-sm flex items-center gap-3"
            >
              <Cog6ToothIcon className="h-6 w-6 text-purple-400" />
              Ajustes
            </li>

          </ul>

        </div>
      </aside>
    </>
  );
};

export default SideMenu;