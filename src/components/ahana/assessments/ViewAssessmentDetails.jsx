import { IoMdClose } from 'react-icons/io';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useState } from 'react';

const ViewAssessmentDetails = ({ isOpen, onClose, assessment, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleDelete = () => {
    onDelete(assessment);
  };

  const handleEdit = () => {
    onEdit(assessment);
  };

  if (!assessment) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Format date
  const assessmentDate = new Date(assessment.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Assessment Details</h2>
            <p className="text-sm text-gray-500 mt-1">Date: {assessmentDate}</p>
          </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 p-1.5 hover:bg-gray-50 rounded-full transition-colors"
            >
              <IoMdClose className="h-6 w-6" />
            </button>
        </div>
        
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h4>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this assessment? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDelete(assessment);
                    setShowDeleteConfirm(false);
                    onClose();
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student & School Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Student Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.studentId?.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.studentId?.email}</div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-500">Assessment Type</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.name}</div>
              </div>
            </div>
          </div>

          {/* School Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">School Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-500">School Name</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.schoolId?.name}</div>
              </div>
            </div>
          </div>

          {/* Physical Measurements */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Physical Measurements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Height</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.heightInFt} ft</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Weight</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.weightInKg} kg</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">BMI</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.bmi}</div>
              </div>
            </div>
          </div>

          {/* Vital Signs */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Vital Signs</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Temperature</label>
                <div className="mt-1 text-sm text-gray-900">
                  {assessment.temperatureInCelsius}°C / {assessment.temperatureInFahrenheit}°F
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Pulse Rate</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.pulseRateBpm} bpm</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">SpO2</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.spo2Percentage}%</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Blood Pressure</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.bp} mmHg</div>
              </div>
            </div>
          </div>

          {/* Vision Assessment */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Vision Assessment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Vision (Right)</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.visionRight}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Vision (Left)</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.visionLeft}</div>
              </div>
            </div>
          </div>

          {/* Dental Assessment */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Dental Assessment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Oral Health</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.oralHealth}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Dental Issues</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.dentalIssues}</div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Hearing Comments</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.hearingComments || 'No comments'}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Additional Comments</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.additionalComments || 'No comments'}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Doctor's Signature</label>
                <div className="mt-1">
                  {assessment.doctorSignature ? (
                    <img 
                      src={assessment.doctorSignature} 
                      alt="Doctor's Signature" 
                      className="h-16 object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0yNCAyNGgtMjR2LTI0aDI0djI0em0tMi0yMmgtMjB2MjBoMjB2LTIwem0tNC41IDEzLjVoLTExdi0xaDExdjF6Ii8+PC9zdmc+';
                      }}
                    />
                  ) : (
                    <div className="text-sm text-gray-500">No signature available</div>
                  )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Nurse's Signature</label>
                  <div className="mt-1">
                    {assessment.nurseSignature ? (
                      <img 
                        src={assessment.nurseSignature} 
                        alt="Nurse's Signature" 
                        className="h-16 object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0yNCAyNGgtMjR2LTI0aDI0djI0em0tMi0yMmgtMjB2MjBoMjB2LTIwem0tNC41IDEzLjVoLTExdi0xaDExdjF6Ii8+PC9zdmc+';
                        }}
                      />
                    ) : (
                      <div className="text-sm text-gray-500">No signature available</div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Guardian's Signature</label>
                  <div className="mt-1">
                    {assessment.guardianSignature ? (
                      <img 
                        src={assessment.guardianSignature} 
                        alt="Guardian's Signature" 
                        className="h-16 object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0yNCAyNGgtMjR2LTI0aDI0djI0em0tMi0yMmgtMjB2MjBoMjB2LTIwem0tNC41IDEzLjVoLTExdi0xaDExdjF6Ii8+PC9zdmc+';
                        }}
                      />
                    ) : (
                      <div className="text-sm text-gray-500">No signature available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAssessmentDetails; 