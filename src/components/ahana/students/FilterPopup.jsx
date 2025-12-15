import { IoMdClose } from 'react-icons/io';

const FilterPopup = ({ 
  isOpen, 
  onClose, 
  selectedSchool, 
  selectedClass, 
  selectedSection,
  setSelectedSchool,
  setSelectedClass,
  setSelectedSection 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Filter Students</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">School</label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Schools</option>
              <option value="Delhi Public School">Delhi Public School</option>
              <option value="St. Mary School">St. Mary School</option>
              <option value="Modern School">Modern School</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Classes</option>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="higher_secondary">Higher Secondary</option>
              <option value="graduate">Graduate</option>
              <option value="post_graduate">Post Graduate</option>
              <option value="doctorate">Doctorate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
              <option value="D">Section D</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup; 