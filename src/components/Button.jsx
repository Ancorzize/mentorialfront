
export const Button = ({ children, onClick, disabled }) => (
  <button
    className={`w-full py-3 px-4 rounded-lg font-bold text-white transition duration-300 ${
      disabled ? 'bg-gray-700 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
    }`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;