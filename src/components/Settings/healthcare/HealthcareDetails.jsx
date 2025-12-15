import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaClock, FaEdit, FaTrash } from 'react-icons/fa';
import Modal from '../Modal';
import AddHealthcareForm from './AddHealthcareForm';
import { healthcareService } from '../../../services/healthcareService';

const HealthcareDetails = ({ healthcareId, onClose, onDelete }) => {
  const [healthcare, setHealthcare] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchHealthcareDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await healthcareService.getHealthcareProviderById(healthcareId);
        
        if (response?.status === 'success' && response?.data) {
          setHealthcare(response.data);
        } else {
          throw new Error('Failed to fetch healthcare provider details');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch healthcare provider details. Please try again.');
        console.error('Error fetching healthcare provider details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (healthcareId) {
      fetchHealthcareDetails();
    }
  }, [healthcareId]);

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleUpdate = async (updatedData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await healthcareService.updateHealthcareProvider(healthcareId, updatedData);
      
      if (response?.status === 'success' && response?.data) {
        // Update local state
        setHealthcare(response.data);
        // Close edit form
        setShowEditForm(false);
        // Notify parent to refresh list
        if (onDelete) {
          await onDelete(); // Using onDelete as a refresh trigger
        }
      } else {
        throw new Error('Failed to update healthcare provider');
      }
    } catch (error) {
      console.error('Error updating healthcare provider:', error);
      setError(error.message || 'Failed to update healthcare provider. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await healthcareService.deleteHealthcareProvider(healthcareId);
      
      if (response.status === 'success') {
        // Close both modals
        setShowDeleteConfirm(false);
        onClose();
        
        // Call onDelete to refresh the parent list
        if (onDelete) {
          await onDelete({ _id: healthcareId });
        }
      }
    } catch (error) {
      console.error('Error deleting healthcare provider:', error);
      setError('Failed to delete healthcare provider. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProfileImage = () => {
    if (!healthcare.profilePic || imageError) {
      return (
        <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-gray-200">
          <span className="text-2xl font-semibold text-gray-400">
            {healthcare.name.charAt(0).toUpperCase()}
          </span>
        </div>
      );
    }

    return (
      <img
        src={healthcare.profilePic}
        alt={`${healthcare.name} profile`}
        className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
        onError={() => setImageError(true)}
        loading="lazy"
      />
    );
  };

  if (isLoading) {
    return (
      <Modal isOpen={true} onClose={onClose} title="Healthcare Provider Details">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal isOpen={true} onClose={onClose} title="Healthcare Provider Details">
        <div className="text-red-500 text-center p-4">{error}</div>
      </Modal>
    );
  }

  if (!healthcare) {
    return null;
  }

  if (showEditForm) {
    return (
      <Modal isOpen={true} onClose={onClose} title="Edit Healthcare Provider">
        <AddHealthcareForm
          initialData={healthcare}
          onSubmit={handleUpdate}
          onCancel={() => setShowEditForm(false)}
          isEditMode={true}
        />
      </Modal>
    );
  }

  if (showDeleteConfirm) {
    return (
      <Modal isOpen={true} onClose={() => {
        setShowDeleteConfirm(false);
        setError(null);
      }} title="Confirm Delete">
        <div className="p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <FaTrash className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Healthcare Provider</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete {healthcare.name}? This action cannot be undone.
            </p>
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setError(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title="Healthcare Provider Details"
      actions={
        <div className="flex items-center space-x-2">
          <button
            onClick={handleEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Edit"
          >
            <FaEdit className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Delete"
          >
            <FaTrash className="w-5 h-5" />
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start space-x-4">
          <div className="relative">
            {renderProfileImage()}
            <span className="absolute -top-2 -right-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {healthcare.type}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{healthcare.name}</h2>
                <p className="text-gray-600 mt-1">{healthcare.address.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Contact Information</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FaPhone className="text-gray-500" />
              <span className="text-gray-700">{healthcare.contactNumber}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaEnvelope className="text-gray-500" />
              <span className="text-gray-700">{healthcare.email}</span>
            </div>
            {healthcare.website && (
              <div className="flex items-center space-x-2">
                <FaGlobe className="text-gray-500" />
                <a
                  href={healthcare.website.startsWith('http') ? healthcare.website : `https://${healthcare.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {healthcare.website}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Address</h3>
          <div className="flex items-start space-x-2">
            <FaMapMarkerAlt className="text-gray-500 mt-1 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-gray-700">{healthcare.address.description}</p>
              <p className="text-gray-600">
                {healthcare.address.landmark && (
                  <span className="block">Landmark: {healthcare.address.landmark}</span>
                )}
                <span className="block">
                  {healthcare.address.region}, {healthcare.address.state}, {healthcare.address.country}
                </span>
                <span className="block">PIN: {healthcare.address.pinCode}</span>
              </p>
              {healthcare.address.location && (
                <p className="text-gray-500 text-sm">
                  Location: {healthcare.address.location.latitude}, {healthcare.address.location.longitude}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Services Offered */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Services Offered</h3>
          <div className="flex flex-wrap gap-2">
            {healthcare.servicesOffered.map((service, index) => (
              <span
                key={index}
                className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-200"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* Operation Hours */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Operation Hours</h3>
          <div className="space-y-3">
            {healthcare.operationHours.map((day) => (
              <div key={day._id} className="flex items-start space-x-2">
                <FaClock className="text-gray-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-gray-700 font-medium capitalize block mb-1">{day.day}</span>
                  <div className="flex flex-wrap gap-2">
                    {day.slots.map((slot, index) => (
                      <span 
                        key={index}
                        className="inline-flex px-2 py-1 bg-white text-sm text-gray-600 rounded border border-gray-200"
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default HealthcareDetails; 