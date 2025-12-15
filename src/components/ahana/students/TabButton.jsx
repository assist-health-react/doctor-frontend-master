const TabButton = ({ children, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-colors ${
        active
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );
};

export default TabButton; 