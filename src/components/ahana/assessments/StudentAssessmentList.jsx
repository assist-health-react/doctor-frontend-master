import { IoMdClose } from 'react-icons/io';
import { FaDownload, FaFileAlt } from 'react-icons/fa';
import ViewAssessmentDetails from './ViewAssessmentDetails';
import AddAssessmentForm from './AddAssessmentForm';
import { useState, useEffect, createContext, useContext } from 'react';
import { getAllAssessments, getAssessmentById, deleteAssessment } from '../../../services/assessmentService';
import { toast } from 'react-toastify';
import { useOutletContext } from 'react-router-dom';
import api from '../../../services/api';

// Create contexts
const StudentContext = createContext();
const SchoolContext = createContext();

const StudentAssessmentList = ({ isOpen, onClose, student }) => {
  const context = useOutletContext();
  const { school } = context || {};
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [generatingReports, setGeneratingReports] = useState(false);
  const [reportsGenerated, setReportsGenerated] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [expirationTime, setExpirationTime] = useState(null);

  // Create student and school context values
  const studentContextValue = {
    ...student,
    id: student?.id, // MongoDB ID
    identifier: student?.identifier || 'AAA019', // Student identifier
    _id: student?._id // MongoDB ID (if using _id format)
  };

  const schoolContextValue = {
    ...school,
    identifier: context?.schoolId // Using schoolId from context
  };

  // Check if the download URL has expired
  useEffect(() => {
    if (expirationTime) {
      const checkExpiration = () => {
        const now = new Date().getTime();
        if (now >= expirationTime) {
          setDownloadUrl(null);
          setExpirationTime(null);
          setReportsGenerated(false);
        }
      };

      // Check immediately
      checkExpiration();

      // Set up interval to check every minute
      const interval = setInterval(checkExpiration, 60000);

      return () => clearInterval(interval);
    }
  }, [expirationTime]);

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!isOpen || !student) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await getAllAssessments({ studentId: student.id });
        if (response.data) {
          setAssessments(response.data);
        }
      } catch (err) {
        setError('Failed to fetch assessments');
        console.error('Error fetching assessments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [isOpen, student]);

  if (!isOpen || !student) return null;

  const handleDownload = (pdfUrl) => {
    if (!pdfUrl) {
      toast.error('PDF report is not available for this assessment');
      return;
    }

    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.target = '_blank';
      link.download = `assessment-report-${new Date().toISOString()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download the assessment report');
    }
  };

  const handleGenerateReports = async () => {
    if (!studentContextValue?.identifier) {
      toast.error('Student identifier is required');
      return;
    }

    if (!schoolContextValue?.identifier) {
      toast.error('School identifier is required');
      return;
    }

    try {
      setGeneratingReports(true);
      setReportsGenerated(false);

      console.log('Generating reports with:', {
        studentId: studentContextValue.identifier,
        schoolId: schoolContextValue.identifier
      });

      const response = await api.post('/api/v1/assessments/pdf', {
        studentId: studentContextValue.identifier,
        schoolId: schoolContextValue.identifier
      });

      console.log('API Response:', response);

      if (response?.data?.status === 'success') {
        const { downloadUrl: url, expiresIn } = response.data.data;
        
        // Set download URL
        setDownloadUrl(url);
        
        // Calculate expiration time (24 hours from now)
        const expirationTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        setExpirationTime(expirationTime);
        
        setReportsGenerated(true);
        toast.success('Reports generated successfully. You can now download them.');
        
        // Refresh the assessments list to get updated PDF URLs
        const updatedAssessments = await getAllAssessments({ studentId: student.id });
        if (updatedAssessments.data) {
          setAssessments(updatedAssessments.data);
        }
      } else {
        throw new Error(response?.data?.message || 'Failed to generate reports');
      }
    } catch (error) {
      console.error('Error generating reports:', error);
      handleApiError(error);
      setReportsGenerated(false);
    } finally {
      setGeneratingReports(false);
    }
  };

  const handleApiError = (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          toast.error('No assessments found for this student. Please create an assessment first.');
          break;
        case 400:
          toast.error('Invalid request. Please check student information.');
          break;
        case 401:
          toast.error('Session expired. Please login again.');
          break;
        case 403:
          toast.error('You do not have permission to generate reports.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(error.message || 'Failed to generate reports. Please try again.');
      }
    } else if (error.request) {
      toast.error('No response from server. Please check your internet connection.');
    } else {
      toast.error('Failed to send request. Please try again.');
    }
  };

  const handleDownloadAll = () => {
    if (!downloadUrl) {
      toast.warning('Please generate the reports first');
      return;
    }

    if (!reportsGenerated) {
      toast.warning('Reports are not ready yet');
      return;
    }

    // Check if URL has expired
    if (expirationTime && new Date().getTime() >= expirationTime) {
      toast.error('Download link has expired. Please generate reports again.');
      setDownloadUrl(null);
      setExpirationTime(null);
      setReportsGenerated(false);
      return;
    }

    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.target = '_blank';
      link.download = `assessment-reports-${new Date().toISOString()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading reports:', error);
      toast.error('Failed to download the reports');
    }
  };

  const handleRowClick = async (assessment) => {
    try {
      setLoadingDetails(true);
      const response = await getAssessmentById(assessment._id);
      if (response.data) {
        setSelectedAssessment(response.data);
        setShowDetails(true);
      }
    } catch (err) {
      console.error('Error fetching assessment details:', err);
      // Show error in a toast or alert
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleEditSuccess = (updatedAssessment) => {
    // Update the assessments list with the edited assessment
    setAssessments(prevAssessments => 
      prevAssessments.map(assessment => 
        assessment._id === updatedAssessment._id ? updatedAssessment : assessment
      )
    );
    setShowEditForm(false);
    setSelectedAssessment(null);
    setShowDetails(false);
  };

  const handleEdit = (assessment) => {
    setSelectedAssessment(assessment);
    setShowEditForm(true);
    setShowDetails(false);
  };

  const handleDelete = (assessment) => {
    setSelectedAssessment(assessment);
    setShowDeleteConfirm(true);
    setShowDetails(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAssessment?._id) return;

    try {
      setIsDeleting(true);
      await deleteAssessment(selectedAssessment._id);
      
      // Update the assessments list by filtering out the deleted assessment
      setAssessments(prevAssessments => 
        prevAssessments.filter(assessment => assessment._id !== selectedAssessment._id)
      );
      
      // Show success message
      toast.success('Assessment deleted successfully');
      
      // Reset states
      setShowDeleteConfirm(false);
      setSelectedAssessment(null);
      setShowDetails(false);  // Close the details modal if open
      
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast.error(error.response?.data?.message || 'Failed to delete assessment');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Assessment History</h2>
              <div className="mt-1 text-sm text-gray-500">
                <p>Student Name: {student.name}</p>
                {expirationTime && (
                  <p className="text-xs text-gray-400">
                    Reports expire in: {Math.max(0, Math.floor((expirationTime - new Date().getTime()) / (1000 * 60 * 60)))} hours
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateReports}
                disabled={generatingReports || loading}
                className={`flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors ${
                  (generatingReports || loading) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Generate Reports"
                type="button"
              >
                {generatingReports ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <FaFileAlt className="w-4 h-4" />
                    Generate Reports
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadAll}
                disabled={!downloadUrl || !reportsGenerated || generatingReports || loading}
                className={`flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors ${
                  (!downloadUrl || !reportsGenerated || generatingReports || loading) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title={!downloadUrl ? "Generate reports first" : "Download All Reports"}
              >
                <FaDownload className="w-4 h-4" />
                Download All
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoMdClose className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Assessment List */}
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
          ) : assessments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No assessments found for this student</p>
            </div>
          ) : (
            <div className="overflow-hidden border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assessments.map((assessment) => (
                    <tr 
                      key={assessment._id} 
                      className={`hover:bg-gray-50 cursor-pointer ${loadingDetails ? 'pointer-events-none opacity-50' : ''}`}
                      onClick={() => handleRowClick(assessment)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(assessment.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(assessment.pdfUrl);
                          }}
                          className={`text-blue-600 hover:text-blue-800 ${!assessment.pdfUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title={assessment.pdfUrl ? "Download Report" : "Report not available"}
                          disabled={loadingDetails || !assessment.pdfUrl}
                        >
                          <FaDownload className="w-4 h-4" />
                        </button>
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

      {/* Assessment Details Modal */}
      <ViewAssessmentDetails
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedAssessment(null);
        }}
        assessment={selectedAssessment}
        student={student}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Edit Assessment Form Modal */}
      {showEditForm && selectedAssessment && (
        <AddAssessmentForm
          isOpen={showEditForm}
          onClose={() => {
            setShowEditForm(false);
            setSelectedAssessment(null);
          }}
          student={student}
          onSuccess={handleEditSuccess}
          initialData={selectedAssessment}
          isEditing={true}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h4>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this assessment? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedAssessment(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssessmentList; 