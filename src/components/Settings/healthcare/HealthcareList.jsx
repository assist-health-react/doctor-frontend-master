import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import HealthcareDetails from './HealthcareDetails';
import AddHealthcareForm from './AddHealthcareForm';
import { healthcareService } from '../../../services/healthcareService';

const HealthcareList = () => {
  const [healthcareProviders, setHealthcareProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedHealthcareId, setSelectedHealthcareId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [failedImages, setFailedImages] = useState({});

  useEffect(() => {
    fetchHealthcareProviders();
  }, [pagination.currentPage]);

  const fetchHealthcareProviders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await healthcareService.getAllHealthcareProviders(pagination.currentPage);
      
      if (response?.status === 'success' && Array.isArray(response.data)) {
        setHealthcareProviders(response.data);
        setPagination(prev => ({
          ...prev,
          totalPages: Math.ceil(response.results / 10) || 1
        }));
      } else {
        throw new Error('Invalid response structure: Expected an array of healthcare providers');
      }
    } catch (err) {
      setError('Failed to fetch healthcare providers. Please try again.');
      console.error('Error fetching healthcare providers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = (providerId) => {
    setFailedImages(prev => ({
      ...prev,
      [providerId]: true
    }));
  };

  const renderProviderImage = (provider) => {
    if (failedImages[provider._id] || !provider.profilePic) {
      return (
        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
          <span className="text-2xl font-semibold text-gray-400">
            {provider.name.charAt(0).toUpperCase()}
          </span>
        </div>
      );
    }

    return (
      <img
        src={provider.profilePic}
        alt={`${provider.name} profile`}
        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
        onError={() => handleImageError(provider._id)}
        loading="lazy"
      />
    );
  };

  const handleViewDetails = (healthcare) => {
    setSelectedHealthcareId(healthcare._id);
    setShowDetails(true);
  };

  const handleRefreshList = async () => {
    await fetchHealthcareProviders();
  };

  const handleEdit = async (healthcare) => {
    try {
      // Handle edit functionality
      console.log('Edit healthcare:', healthcare);
    } catch (err) {
      console.error('Error editing healthcare provider:', err);
    }
  };

  const handleDelete = async (healthcare) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Optimistically remove the item from the list
      setHealthcareProviders(prev => prev.filter(p => p._id !== healthcare._id));
      
      const response = await healthcareService.deleteHealthcareProvider(healthcare._id);
      
      if (response.status === 'success') {
        // Close the details modal if open
        setShowDetails(false);
        setSelectedHealthcareId(null);
        
        // Refresh the list to ensure we're in sync with the server
        await fetchHealthcareProviders();
      } else {
        // If delete failed, revert the optimistic update
        await fetchHealthcareProviders();
        throw new Error('Failed to delete healthcare provider');
      }
    } catch (err) {
      // On error, refresh the list and show error message
      await fetchHealthcareProviders();
      setError('Failed to delete healthcare provider. Please try again.');
      console.error('Error deleting healthcare provider:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddHealthcare = async (newHealthcare) => {
    try {
      // Only refresh the list after the form has created the provider
      await fetchHealthcareProviders();
      setShowAddForm(false);
    } catch (err) {
      console.error('Error refreshing healthcare providers:', err);
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  return (
    <div className="p-4">
      <div className="flex justify-end items-center mb-6">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <FaPlus size={16} />
          <span>Add Healthcare Provider</span>
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading healthcare providers...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => fetchHealthcareProviders()}
                className="mt-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : healthcareProviders.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600">No healthcare providers found.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
              >
                Add Healthcare Provider
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {healthcareProviders.map((provider) => (
                <div 
                  key={provider._id} 
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewDetails(provider)}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {renderProviderImage(provider)}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-800 truncate">{provider.name}</h3>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                          {provider.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {provider.address?.streetAddress || 'No address'}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                          {provider.servicesOffered?.length || 0} services
                        </span>
                        {provider.website && (
                          <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full">
                            Has Website
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded ${
                      pagination.currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {showDetails && selectedHealthcareId && (
        <HealthcareDetails
          healthcareId={selectedHealthcareId}
          onClose={() => {
            setShowDetails(false);
            setSelectedHealthcareId(null);
            handleRefreshList();
          }}
          onDelete={handleRefreshList}
        />
      )}

      {showAddForm && (
        <AddHealthcareForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddHealthcare}
        />
      )}
    </div>
  );
};

export default HealthcareList; 