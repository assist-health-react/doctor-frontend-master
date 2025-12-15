import React from 'react'

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors
      ${active 
        ? 'bg-blue-500 text-white' 
        : 'text-gray-600 hover:bg-gray-100'}`}
  >
    {children}
  </button>
)

export default TabButton 