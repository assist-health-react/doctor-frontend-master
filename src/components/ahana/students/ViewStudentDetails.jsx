import { useState, useEffect } from 'react';
import { FaTimes, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import { membersService } from '../../../services/membersService';

const ViewStudentDetails = ({ isOpen, onClose, studentId, onEdit, onDelete }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!studentId) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await membersService.getMemberById(studentId);
        
        if (response.status === 'success' && response.data) {
          const studentData = {
            id: response.data._id,
            studentId: response.data.memberId,
            name: response.data.name,
            mobile: response.data.phone,
            email: response.data.email,
            dob: response.data.dob,
            gender: response.data.gender,
            bloodGroup: response.data.bloodGroup,
            heightInFt: response.data.heightInFt || '',
            weightInKg: response.data.weightInKg || '',
            class: response.data.studentDetails?.grade || '',
            section: response.data.studentDetails?.section || '',
            school: response.data.studentDetails?.institution || '',
            addressDescription: response.data.address?.[0]?.description || '',
            addressPinCode: response.data.address?.[0]?.pinCode || '',
            addressRegion: response.data.address?.[0]?.region || '',
            addressLandmark: response.data.address?.[0]?.landmark || '',
            addressState: response.data.address?.[0]?.state || '',
            addressCountry: response.data.address?.[0]?.country || '',
            emergencyContactName: response.data.emergencyContact?.name || '',
            emergencyContactRelation: response.data.emergencyContact?.relation || '',
            emergencyContactPhone: response.data.emergencyContact?.phone || '',
            profilePic: response.data.profilePic || '',
            employmentStatus: response.data.employmentStatus || '',
            isStudent: response.data.isStudent,
            isSubprofile: response.data.isSubprofile,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt
          };
          setStudent(studentData);
        } else {
          throw new Error('Failed to fetch student details');
        }
      } catch (error) {
        console.error('Error fetching student details:', error);
        setError(error.message || 'Failed to fetch student details');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && studentId) {
      fetchStudentDetails();
    }
  }, [isOpen, studentId]);

  const handleEdit = () => {
    if (student) {
      const editData = {
        _id: student.id,
        name: student.name,
        phone: student.mobile,
        email: student.email,
        dob: student.dob,
        gender: student.gender,
        bloodGroup: student.bloodGroup,
        heightInFt: student.heightInFt,
        weightInKg: student.weightInKg,
        employmentStatus: student.employmentStatus,
        studentDetails: {
          grade: student.class,
          section: student.section,
          institution: student.school
        }
      };

      // Update address to be an array with a single address object
      if (student.addressDescription || student.addressPinCode || student.addressRegion || 
          student.addressLandmark || student.addressState || student.addressCountry) {
        editData.address = [{
          description: student.addressDescription || '',
          pinCode: student.addressPinCode || '',
          region: student.addressRegion || '',
          landmark: student.addressLandmark || '',
          state: student.addressState || '',
          country: student.addressCountry || '',
          location: {
            latitude: null,
            longitude: null
          }
        }];
      }

      // Only add emergency contact if any contact field exists
      if (student.emergencyContactName || student.emergencyContactRelation || student.emergencyContactPhone) {
        editData.emergencyContact = {
          name: student.emergencyContactName || '',
          relation: student.emergencyContactRelation || '',
          phone: student.emergencyContactPhone || ''
        };
      }

      onEdit(editData);
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
          <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
            <div className="flex items-center justify-center p-8">
              <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-gray-600">Loading student details...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
          <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
            <div className="text-center">
              <h3 className="text-lg font-medium text-red-600 mb-2">Error</h3>
              <p className="text-gray-500">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl px-0 pt-0 pb-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
          {/* Header */}
          <div className="px-6 py-4 bg-blue-600">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Student Details</h3>
              <button onClick={onClose} className="text-white hover:text-gray-200">
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Action Buttons */}
            <div className="flex justify-between items-start">
              {/* Profile Image */}
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                  {student.profilePic ? (
                    <img
                      src={student.profilePic}
                      alt={student.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-2xl text-gray-400">
                        {student.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{student.name}</h4>
                  <p className="text-sm text-gray-500">ID: {student.studentId}</p>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleEdit}
                  className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                >
                  <FaEdit className="w-4 h-4 mr-2" />
                  Edit Student
                </button>
                {onDelete && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this student?')) {
                        onDelete(student.id);
                        onClose();
                      }
                    }}
                    className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                  >
                    <FaTrash className="w-4 h-4 mr-2" />
                    Delete Student
                  </button>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Student ID</p>
                  <p className="mt-1 text-sm text-gray-900">{student.studentId || student.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="mt-1 text-sm text-gray-900">{student.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p className="mt-1 text-sm text-gray-900">{student.dob || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="mt-1 text-sm text-gray-900">{student.gender || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Mobile Number</p>
                  <p className="mt-1 text-sm text-gray-900">{student.mobile || student.contactNumber || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-1 text-sm text-gray-900">{student.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Blood Group</p>
                  <p className="mt-1 text-sm text-gray-900">{student.bloodGroup || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="mt-1 text-sm text-gray-900">{student.addressDescription || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Landmark</p>
                  <p className="mt-1 text-sm text-gray-900">{student.addressLandmark || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Region</p>
                  <p className="mt-1 text-sm text-gray-900">{student.addressRegion || student.school || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Pin Code</p>
                  <p className="mt-1 text-sm text-gray-900">{student.addressPinCode || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">State</p>
                  <p className="mt-1 text-sm text-gray-900">{student.addressState || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Country</p>
                  <p className="mt-1 text-sm text-gray-900">{student.addressCountry || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">School</p>
                  <p className="mt-1 text-sm text-gray-900">{student.school || student.addressRegion || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Class</p>
                  <p className="mt-1 text-sm text-gray-900">{student.class || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Section</p>
                  <p className="mt-1 text-sm text-gray-900">{student.section || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact Name</p>
                  <p className="mt-1 text-sm text-gray-900">{student.emergencyContactName || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Relationship</p>
                  <p className="mt-1 text-sm text-gray-900">{student.emergencyContactRelation || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact Number</p>
                  <p className="mt-1 text-sm text-gray-900">{student.emergencyContactPhone || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Health Information */}
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Health Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Blood Group</p>
                  <p className="mt-1 text-sm text-gray-900">{student.bloodGroup || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Height (in feet)</p>
                  <p className="mt-1 text-sm text-gray-900">{student.heightInFt || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Weight (in kg)</p>
                  <p className="mt-1 text-sm text-gray-900">{student.weightInKg || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Employment Status</p>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{student.employmentStatus || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created At</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {student.updatedAt ? new Date(student.updatedAt).toLocaleDateString() : 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentDetails; 