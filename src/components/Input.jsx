
const Input = ({ label, type, value, onChange, placeholder, className = 'mb-4' }) => (
  <div className={`${className}`}>
    <label className="block text-gray-400 text-sm font-bold mb-2">
      {label}
    </label>
    <input
      className="shadow appearance-none border border-gray-700 rounded-lg w-full py-3 px-4 bg-gray-800 text-gray-200 leading-tight focus:outline-none focus:shadow-outline transition duration-300"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

export default Input;