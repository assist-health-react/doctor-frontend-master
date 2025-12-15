const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium ${
      active
        ? 'bg-indigo-100 text-indigo-700'
        : 'text-gray-500 hover:text-gray-700'
    } rounded-md`}
  >
    {children}
  </button>
);

export default TabButton; 