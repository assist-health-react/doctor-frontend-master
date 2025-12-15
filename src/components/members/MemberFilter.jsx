import React, { useState, useEffect } from 'react';
import { FaTimes, FaSearch, FaCalendar } from 'react-icons/fa';
import { doctorsService } from '../../services/doctorsService';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const SearchableDropdown = ({ options, value, onChange, placeholder, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <div
        className="w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value ? value.label : placeholder}
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-2">
            <div className="relative">
              <input
                type="text"
                className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="p-2 text-center text-gray-500">Loading...</div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="p-2 text-center text-gray-500">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const MemberFilter = ({ isOpen, onClose, onApply, currentFilters }) => {
  const [filters, setFilters] = useState({
    doctor: null,
    fromDate: null,
    toDate: null
  });

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState({
    doctors: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(prev => ({ ...prev, doctors: true }));
        const doctorsResponse = await doctorsService.getAllDoctors();
        
        // Create array with NOT_ASSIGNED option
        const doctorOptions = [
          { value: 'NOT_ASSIGNED', label: 'Not Assigned' }
        ];
        
        // Add fetched doctors
        if (doctorsResponse && Array.isArray(doctorsResponse)) {
          doctorOptions.push(...doctorsResponse.map(doc => ({
            value: doc._id,
            label: `${doc.name}${doc.specialization ? ` (${doc.specialization})` : ''}`
          })));
        } else if (doctorsResponse?.data && Array.isArray(doctorsResponse.data)) {
          doctorOptions.push(...doctorsResponse.data.map(doc => ({
            value: doc._id,
            label: `${doc.name}${doc.specialization ? ` (${doc.specialization})` : ''}`
          })));
        }
        
        setDoctors(doctorOptions);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setDoctors([{ value: 'NOT_ASSIGNED', label: 'Not Assigned' }]);
      } finally {
        setLoading(prev => ({ ...prev, doctors: false }));
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && currentFilters) {
      setFilters({
        doctor: currentFilters.doctorId ? 
          doctors.find(doc => doc.value === currentFilters.doctorId) || 
          { value: currentFilters.doctorId, label: 'Not Assigned' } : null,
        fromDate: currentFilters.startDate ? new Date(currentFilters.startDate) : null,
        toDate: currentFilters.endDate ? new Date(currentFilters.endDate) : null
      });
    }
  }, [isOpen, currentFilters, doctors]);

  const handleApplyFilters = () => {
    const queryParams = {
      isStudent: false,
      limit: 100,
      page: 1,
      sortBy: 'createdAt',
      sortOrder: 'asc',
      doctorId: filters.doctor?.value || 'NOT_ASSIGNED',
      startDate: filters.fromDate ? filters.fromDate.toISOString().split('T')[0] : undefined,
      endDate: filters.toDate ? filters.toDate.toISOString().split('T')[0] : undefined
    };

    onApply(queryParams);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      doctor: null,
      fromDate: null,
      toDate: null
    });
    onApply({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Filter Members</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {/* Doctor Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doctor
            </label>
            <SearchableDropdown
              options={doctors}
              value={filters.doctor}
              onChange={(value) => setFilters(prev => ({ ...prev, doctor: value }))}
              placeholder="Select Doctor"
              loading={loading.doctors}
            />
          </div>

          {/* Date Range Filters */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <DatePicker
                    selected={filters.fromDate}
                    onChange={(date) => setFilters(prev => ({ ...prev, fromDate: date }))}
                    className="w-full px-3 py-2 pl-3 pr-8 border border-gray-300 rounded-lg"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="From date"
                  />
                  <FaCalendar className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="relative">
                  <DatePicker
                    selected={filters.toDate}
                    onChange={(date) => setFilters(prev => ({ ...prev, toDate: date }))}
                    className="w-full px-3 py-2 pl-3 pr-8 border border-gray-300 rounded-lg"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="To date"
                    minDate={filters.fromDate}
                  />
                  <FaCalendar className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Apply and Reset Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// Add custom styles for the date picker
const styles = `
  .react-datepicker {
    font-family: inherit;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .react-datepicker__header {
    background-color: #f3f4f6;
    border-bottom: 1px solid #e5e7eb;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    padding-top: 0.5rem;
  }
  
  .react-datepicker__current-month {
    font-weight: 600;
    font-size: 0.875rem;
    color: #374151;
  }
  
  .react-datepicker__day {
    width: 2rem;
    line-height: 2rem;
    margin: 0.166rem;
    border-radius: 0.375rem;
    color: #374151;
  }
  
  .react-datepicker__day:hover {
    background-color: #e5e7eb;
  }
  
  .react-datepicker__day--selected {
    background-color: #3b82f6 !important;
    color: white;
  }
  
  .react-datepicker__day--keyboard-selected {
    background-color: #93c5fd;
    color: white;
  }
  
  .react-datepicker__day--disabled {
    color: #9ca3af;
  }
  
  .react-datepicker__navigation {
    top: 0.75rem;
  }
  
  .react-datepicker__navigation--previous {
    left: 1rem;
  }
  
  .react-datepicker__navigation--next {
    right: 1rem;
  }
  
  .react-datepicker__input-container input {
    width: 100%;
    padding: 0.5rem 1rem;
    padding-left: 2.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #374151;
  }
  
  .react-datepicker__input-container input:focus {
    outline: none;
    ring: 2px;
    ring-color: #3b82f6;
    border-color: #3b82f6;
  }
  
  .react-datepicker__close-icon {
    right: 0.5rem;
  }
  
  .react-datepicker__close-icon::after {
    background-color: #9ca3af;
    border-radius: 50%;
    padding: 0.25rem;
    font-size: 0.75rem;
  }
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default MemberFilter; 