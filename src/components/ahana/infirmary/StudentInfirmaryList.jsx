import { IoMdClose } from 'react-icons/io';
import { useState, useEffect } from 'react';
import { getAllInfirmaryRecords, deleteInfirmaryRecord, getInfirmaryRecordById } from '../../../services/infirmaryService';
import { toast } from 'react-hot-toast';
import ViewInfirmaryDetails from './ViewInfirmaryDetails';
import EditInfirmaryRecord from './EditInfirmaryRecord';

const StudentInfirmaryList = ({ isOpen, onClose, student }) => {
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecords = async () => {
    if (!isOpen || !student) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await getAllInfirmaryRecords(`?studentId=${student.id}`);
      if (response.data) {
        setRecords(response.data);
      }
    } catch (err) {
      setError('Failed to fetch infirmary records');
      console.error('Error fetching infirmary records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [isOpen, student]);

  const handleEdit = async (record) => {
    try {
      // Get full record details before editing
      const response = await getInfirmaryRecordById(record._id);
      if (response.data) {
        setEditRecord(response.data);
        setShowEditForm(true);
      }
    } catch (err) {
      console.error('Error fetching record details:', err);
      alert('Failed to fetch record details for editing');
    }
  };

  const handleDelete = async (recordId) => {
    try {
      const response = await deleteInfirmaryRecord(recordId);
      if (response.data) {
        toast.success('Record deleted successfully');
        // Close any open modals
        setShowDetails(false);
        setSelectedRecordId(null);
        // Refresh the records list
        await fetchRecords();
      }
    } catch (err) {
      console.error('Error deleting record:', err);
      toast.error(err.response?.data?.message || 'Failed to delete record');
    }
  };

  const handleEditClose = () => {
    setShowEditForm(false);
    setEditRecord(null);
  };

  const handleEditSuccess = () => {
    handleEditClose();
    fetchRecords();
  };

  if (!isOpen || !student) return null;

  const handleRowClick = async (record) => {
    setSelectedRecordId(record._id);
    setShowDetails(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
          {/* Header */}
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Infirmary History</h2>
                <div className="mt-1 text-sm text-gray-500">
                  <p>Student Name: {student?.name}</p>
                            </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoMdClose className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Records List */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                <p>{error}</p>
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No infirmary records found for this student</p>
              </div>
            ) : (
              <div className="overflow-hidden border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Complaint
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {records.map((record) => (
                      <tr 
                        key={record._id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(record)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.complaints}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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

      {/* Record Details Modal */}
      <ViewInfirmaryDetails
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedRecordId(null);
        }}
        recordId={selectedRecordId}
        student={student}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Edit Record Modal */}
      {showEditForm && editRecord && (
        <EditInfirmaryRecord
          isOpen={showEditForm}
          onClose={handleEditClose}
          onSuccess={handleEditSuccess}
          editData={editRecord}
        />
      )}
    </>
  );
};

export default StudentInfirmaryList; 