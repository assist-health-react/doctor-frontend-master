import React from 'react';
import { FaTimesCircle } from 'react-icons/fa';

const TextInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  required = false, 
  className = '', 
  type = 'text',
  placeholder,
  ...props 
}) => {
  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const event = {
      target: {
        name,
        value: ''
      }
    };
    onChange(event);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required={required}
          placeholder={placeholder}
          {...props}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            tabIndex="-1"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FaTimesCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TextInput; 