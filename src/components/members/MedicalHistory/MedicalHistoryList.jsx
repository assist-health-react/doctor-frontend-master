import React, { useState, useEffect } from 'react';
import { FaSpinner, FaTimes } from 'react-icons/fa';
import api from '../../../services/api';
import ViewMedicalHistory from './ViewMedicalHistory';

const MedicalHistoryList = ({ member, onClose }) => {
  const [medicalHistories, setMedicalHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const fetchMedicalHistories = async () => {
    try {
      console.log('Fetching medical histories for member:', member);
      setLoading(true);
      const response = await api.get(`/api/v1/medical-history/${member.id || member._id}`);
      console.log('API Response:', response);

      if (response?.data?.status === 'success' && Array.isArray(response.data.data)) {
        console.log('Setting medical histories:', response.data.data);
        setMedicalHistories(response.data.data);
      } else {
        console.log('No valid medical histories found in response');
        setMedicalHistories([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching medical history:', err);
      setError('Failed to fetch medical history');
      setMedicalHistories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (member) {
      fetchMedicalHistories();
    }
  }, [member]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const mainDate = date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    const time = date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    return `${mainDate} at ${time}`;
  };

  const handleHistoryClick = (history) => {
    setSelectedHistory(history);
  };

  const handleHistoryDeleted = () => {
    setSelectedHistory(null);
    fetchMedicalHistories();
  };

 //16.1.26
  const handleHistoryUpdated = () => {
  setSelectedHistory(null);
  fetchMedicalHistories();
  onRefresh && onRefresh(); // 🔥 IMPORTANT
};

  if (selectedHistory) {
    return (
      <ViewMedicalHistory
        member={member}
        initialData={selectedHistory}
        onClose={() => setSelectedHistory(null)}
        onDelete={handleHistoryDeleted}
         onSaveSuccess={handleHistoryUpdated}//16.1.26
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Medical History - {member?.name || member?.fullName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              {error}
            </div>
          ) : medicalHistories && medicalHistories.length > 0 ? (
            <div className="grid gap-4">
              {medicalHistories.map((history, index) => (
                <div
                  key={history._id || index}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors mb-3"
                  onClick={() => handleHistoryClick(history)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {formatDate(history.updatedAt)}
                    </h3>
                    <div className="text-sm text-gray-500">
                      Created: {formatDate(history.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No medical history records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryList;