import { useState } from 'react';

const NavigatorDropdown = ({ isOpen, onClose, onSelect, selectedStudents }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample navigators data - replace with your actual data
  const navigators = [
    { id: 1, name: 'John Smith', department: 'Student Affairs' },
    { id: 2, name: 'Lisa Anderson', department: 'Academic Support' },
    { id: 3, name: 'Robert Wilson', department: 'Counseling' },
  ];

  const filteredNavigators = navigators.filter(navigator =>
    navigator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Assign Navigator
                  {selectedStudents.length > 0 && (
                    <span className="ml-2 text-sm text-gray-500">
                      ({selectedStudents.length} students selected)
                    </span>
                  )}
                </h3>
                
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search navigators..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {filteredNavigators.map((navigator) => (
                    <button
                      key={navigator.id}
                      onClick={() => {
                        onSelect(navigator);
                        onClose();
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-900">{navigator.name}</div>
                        <div className="text-sm text-gray-500">{navigator.department}</div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100">
                        <span className="text-blue-600">Assign →</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigatorDropdown; 