import { IoMdClose } from 'react-icons/io';
import { useState, useEffect } from 'react';
import { getInfirmaryRecordById } from '../../../services/infirmaryService';

const ViewInfirmaryDetails = ({ isOpen, onClose, recordId, student }) => {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecordDetails = async () => {
      if (!isOpen || !recordId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await getInfirmaryRecordById(recordId);
        if (response.data) {
          setRecord(response.data);
        }
      } catch (err) {
        setError('Failed to fetch record details');
        console.error('Error fetching record details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecordDetails();
  }, [isOpen, recordId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (date, time) => {
    if (!date || !time) return '';
    return `${formatDate(date)} ${time}`;
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!record) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Infirmary Record Details</h2>
            <p className="text-sm text-gray-500 mt-1">Created: {formatDate(record.createdAt)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Visit Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Visit Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Visit Date & Time</label>
                <div className="mt-1 text-sm text-gray-900">
                  {formatDateTime(record.date, record.time)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Consent From</label>
                <div className="mt-1 text-sm text-gray-900 capitalize">{record.consentFrom}</div>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Complaints</label>
                <div className="mt-1 text-sm text-gray-900">{record.complaints}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Details</label>
                <div className="mt-1 text-sm text-gray-900">{record.details}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Treatment Given</label>
                <div className="mt-1 text-sm text-gray-900">{record.treatmentGiven}</div>
              </div>
            </div>
          </div>

          {/* Medicine Information */}
          {record.medicineProvided && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Medicine Provided</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Medicine Name</label>
                  <div className="mt-1 text-sm text-gray-900">{record.medicineProvided.inventoryId.item_name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Quantity</label>
                  <div className="mt-1 text-sm text-gray-900">{record.medicineProvided.quantity}</div>
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Record Timeline</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Created At</label>
                <div className="mt-1 text-sm text-gray-900">{formatDate(record.createdAt)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                <div className="mt-1 text-sm text-gray-900">{formatDate(record.updatedAt)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewInfirmaryDetails; 