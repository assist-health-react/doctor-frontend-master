import { useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import Select from 'react-select';

const InfirmaryFilters = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFilterChange, 
  onApplyFilters,
  schoolData,
  isLoading = false
}) => {
  useEffect(() => {
    if (isOpen) {
      console.log('InfirmaryFilters Data:', {
        schoolData,
        grades: schoolData?.grades,
        filters,
        isLoading
      });
    }
  }, [isOpen, schoolData, filters, isLoading]);

  if (!isOpen) return null;

  console.log('InfirmaryFilters Props:', {
    schoolData,
    filters,
    isLoading,
    availableClasses: schoolData?.grades?.map(grade => ({
      value: grade.class,
      label: grade.class
    })) || []
  });

  // Convert grades array to react-select format
  const availableClasses = schoolData?.grades?.map(grade => ({
    value: grade.class,
    label: grade.class
  })) || [];

  console.log('Available Classes:', availableClasses);

  // Get available sections for selected class
  const getAvailableSections = (selectedClass) => {
    if (!selectedClass || !schoolData?.grades) return [];
    
    const selectedGrade = schoolData.grades.find(g => g.class === selectedClass);
    const sections = selectedGrade?.section?.map(section => ({
      value: section.name,
      label: section.name
    })) || [];

    console.log('Available Sections for', selectedClass, ':', sections);
    return sections;
  };

  const handleReset = () => {
    onFilterChange('name', '');
    onFilterChange('grade', '');
    onFilterChange('section', '');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Filter Infirmary Records</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IoMdClose className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Name Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={filters.name || ''}
              onChange={(e) => onFilterChange('name', e.target.value)}
              placeholder="Filter by name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Grade/Class Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <Select
              value={filters.grade ? { value: filters.grade, label: filters.grade } : null}
              onChange={(selected) => {
                onFilterChange('grade', selected?.value || '');
                onFilterChange('section', ''); // Reset section when class changes
              }}
              options={availableClasses}
              placeholder={isLoading ? "Loading classes..." : "Select Class"}
              isLoading={isLoading}
              isClearable
              className="basic-select"
              classNamePrefix="select"
            />
          </div>

          {/* Section Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <Select
              value={filters.section ? { value: filters.section, label: filters.section } : null}
              onChange={(selected) => onFilterChange('section', selected?.value || '')}
              options={getAvailableSections(filters.grade)}
              isDisabled={!filters.grade || isLoading}
              placeholder={!filters.grade ? "Select Class first" : isLoading ? "Loading sections..." : "Select Section"}
              isClearable
              className="basic-select"
              classNamePrefix="select"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Reset
          </button>
          <button
            onClick={onApplyFilters}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfirmaryFilters; 