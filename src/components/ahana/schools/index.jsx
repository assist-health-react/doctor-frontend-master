import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaIdCard } from 'react-icons/fa';
import { getAllSchools } from '../../../services/schoolsService';

const SchoolsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllSchools();
      
      if (Array.isArray(response)) {
        setSchools(response);
      } else if (response && response.status === 'success' && Array.isArray(response.data)) {
        setSchools(response.data);
      } else {
        console.error('Invalid response format:', response);
        setError('Failed to load schools');
        setSchools([]);
      }
    } catch (err) {
      console.error('Error fetching schools:', err);
      setError(err.message || 'Failed to fetch schools');
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSchoolClick = (schoolId) => {
    navigate(`/ahana/${schoolId}/students`);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Schools</h1>
        </div>
        
        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="w-96">
            <input
              type="text"
              placeholder="Search schools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school) => (
              <div
                key={school._id}
                onClick={() => handleSchoolClick(school._id)}
                className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-2xl font-bold text-gray-400">
                        {school.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{school.name}</h3>
                      <p className="text-sm text-gray-500">{school.address?.region || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaIdCard className="text-blue-500" />
                    <span className="text-sm">
                      ID: {school.schoolId || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredSchools.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No schools found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolsList; 