import { Cog6ToothIcon, LockClosedIcon, ChartBarIcon } from '@heroicons/react/24/solid';

const SideMenu = ({ isOpen, onToggle, onSelect }) => {
  return (
    <aside className={`fixed top-0 left-0 h-screen bg-gray-900 text-white shadow-lg z-40 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {isOpen && <h2 className="text-lg font-bold text-purple-400">Configuración</h2>}
        <button onClick={onToggle} className="text-gray-300 hover:text-white transition">
          {isOpen ? '⮜' : '⮞'}
        </button>
      </div>
      {/* ELIMNINAR 
      <ul className="mt-4 space-y-2 px-2">
        <li onClick={() => onSelect('password')} className="cursor-pointer bg-gray-800 hover:bg-gray-700 transition rounded-lg p-3 text-sm flex items-center gap-3">
          <LockClosedIcon className="h-6 w-6 text-purple-400" />
          {isOpen && 'Cambio de contraseña'}
        </li>

        <li onClick={() => onSelect('mis-simulacros')} className="cursor-pointer bg-gray-800 hover:bg-gray-700 transition rounded-lg p-3 text-sm flex items-center gap-3">
          <ChartBarIcon className="h-6 w-6 text-purple-400" />
          {isOpen && 'Mis simulacros'}
        </li>

        <li onClick={() => onSelect('settings')} className="cursor-pointer bg-gray-800 hover:bg-gray-700 transition rounded-lg p-3 text-sm flex items-center gap-3">
          <Cog6ToothIcon className="h-6 w-6 text-purple-400" />
          {isOpen && 'Ajustes'}
        </li>
      </ul>*/}
    </aside>
  );
};

export default SideMenu;