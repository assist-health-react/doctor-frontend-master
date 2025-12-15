import { useState, useEffect } from 'react';
import { FaSearch, FaTimes, FaUserMd, FaSpinner } from 'react-icons/fa';
import api from '../../../services/api';

const DoctorDropdown = ({ isOpen, onClose, onAssign, selectedMembers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data: response } = await api.get('/api/v1/doctors');
        
        if (response?.status === 'success' && Array.isArray(response?.data)) {
          setDoctors(response.data);
        } else {
          throw new Error('Invalid response format from server');
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError(err.message || 'Failed to fetch doctors');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchDoctors();
    }
  }, [isOpen]);

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specializations?.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAssign = () => {
    if (selectedDoctor) {
      onAssign(selectedDoctor);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Assign Doctor
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search doctors by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Selected Members Count */}
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <div className="flex items-center text-blue-700">
            <FaUserMd className="mr-2" />
            <span>{selectedMembers.length} members selected</span>
          </div>
        </div>

        {/* Doctors List */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p>{error}</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No doctors found</p>
            </div>
          ) : (
            filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                onClick={() => setSelectedDoctor(doctor)}
                className={`p-4 border rounded-lg mb-2 cursor-pointer transition-colors ${
                  selectedDoctor?._id === doctor._id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{doctor.name}</h4>
                    <p className="text-sm text-gray-600">{doctor.specializations?.join(', ') || 'No specialization listed'}</p>
                    <p className="text-sm text-gray-500 mt-1">{doctor.experienceYears} years experience</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Current Patients</p>
                    <p className="text-lg font-semibold text-gray-900">{doctor.total_assigned_members || 0}</p>
                    <span className="text-sm text-green-600">Available</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedDoctor || loading}
            className={`px-4 py-2 rounded-md text-white ${
              selectedDoctor && !loading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <FaSpinner className="animate-spin" />
                Loading...
              </span>
            ) : (
              'Assign Doctor'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDropdown; 