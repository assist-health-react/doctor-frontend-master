import { useState, useEffect } from 'react';
import { FaTimes, FaSpinner, FaEdit, FaUser, FaTrash, FaUserMd, FaUserClock } from 'react-icons/fa';
import membersService from '../../services/membersService';
import { useSnackbar } from '../../contexts/SnackbarContext';
import ConfirmationDialog from './common/ConfirmationDialog';

const ViewMember = ({ memberId, member: initialMember, onClose, onEdit, onDelete }) => {
  const [member, setMember] = useState(initialMember);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    // Update member state when initialMember changes
    if (initialMember) {
      console.log('Member Data:', initialMember); // Debug log
      setMember(initialMember);
      setLoading(false);
      setError(null);
    }
  }, [initialMember]);

  // Helper function to safely render object values
  const renderValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value);
    return value;
  };

  // Helper function to format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleDelete = () => {
    console.log('Delete button clicked'); // Debug log
    const idToDelete = memberId || member?._id;
    if (!idToDelete) {
      showSnackbar('Member ID is missing', 'error');
      return;
    }
    console.log('Setting showDeleteConfirm to true'); // Debug log
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    console.log('Delete confirmed'); // Debug log
    const idToDelete = memberId || member?._id;
    if (!idToDelete) {
      showSnackbar('Member ID is missing', 'error');
      return;
    }

    try {
      setLoading(true);
      if (onDelete) {
        await onDelete(idToDelete);
      }
      onClose();
    } catch (error) {
      console.error('Error deleting member:', error);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      // Format the member data to match the expected structure in AddMember
      const formattedMember = {
        ...member,
        // Ensure all required fields are present
        name: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        dob: member.dob || '',
        gender: member.gender || '',
        bloodGroup: member.bloodGroup || '',
        heightInFt: member.heightInFt || '',
        weightInKg: member.weightInKg || '',
        employmentStatus: member.employmentStatus || '',
        educationLevel: member.educationLevel || '',
        maritalStatus: member.maritalStatus || '',
        additionalInfo: member.additionalInfo || '',
        isSubprofile: member.isSubprofile || false,
        primaryMemberId: member.primaryMemberId || '',
        profilePic: member.profilePic || null,
        profilePicUrl: member.profilePic || '',
        // Get the first address from the array for editing
        address: Array.isArray(member.address) && member.address.length > 0 ? member.address[0] : {
          description: '',
          pinCode: '',
          region: '',
          landmark: '',
          state: '',
          country: 'India',
          location: { latitude: null, longitude: null }
        },
        emergencyContact: {
          name: member.emergencyContact?.name || '',
          relation: member.emergencyContact?.relation || '',
          phone: member.emergencyContact?.phone || ''
        },
        subscriptions: member.subscriptions || [{
          planType: 'BASE_PLAN',
          startDate: new Date().toISOString(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
          status: 'active'
        }],
        addons: member.addons || [],
        active: member.active || true
      };
      
      onEdit(formattedMember);
    }
  };

  if (!member) {
    return null;
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
          <div className="flex justify-center items-center h-40">
            <FaSpinner className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
          <div className="text-center text-red-600">
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

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">Member Details</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEdit}
                className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                title="Edit Member"
              >
                <FaEdit className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                title="Delete Member"
              >
                <FaTrash className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-50"
                title="Close"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Profile Section */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                {member?.profilePic ? (
                  <img
                    src={member.profilePic}
                    alt={renderValue(member?.name)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div>
                <h4 className="text-xl font-semibold">{renderValue(member?.name)}</h4>
                <p className="text-gray-600">Member ID: {renderValue(member?.memberId)}</p>
                <p className="text-gray-600">{renderValue(member?.email)}</p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{renderValue(member?.phone)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{formatDate(member?.dob)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium capitalize">{renderValue(member?.gender)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Blood Group</p>
                  <p className="font-medium">{renderValue(member?.bloodGroup)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Height</p>
                  <p className="font-medium">{member?.heightInFt ? `${member.heightInFt} ft` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-medium">{member?.weightInKg ? `${member.weightInKg} kg` : 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Employment Status</p>
                  <p className="font-medium capitalize">{renderValue(member?.employmentStatus)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Education Level</p>
                  <p className="font-medium capitalize">{renderValue(member?.educationLevel)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Marital Status</p>
                  <p className="font-medium capitalize">{renderValue(member?.maritalStatus)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Additional Information</p>
                  <p className="font-medium">{renderValue(member?.additionalInfo)}</p>
                </div>
              </div>
            </div>

            {/* Assigned Healthcare Team */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assigned Navigator */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <FaUserClock className="w-5 h-5 text-blue-500" />
                  <h4 className="text-lg font-medium text-gray-900">Navigator</h4>
                </div>
                {member?.healthcareTeam?.navigator ? (
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center border border-blue-100">
                      {member.healthcareTeam.navigator._id?.profilePic ? (
                        <img 
                          src={member.healthcareTeam.navigator._id.profilePic}
                          alt={member.healthcareTeam.navigator._id.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUserClock className="w-8 h-8 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">
                        {member.healthcareTeam.navigator._id?.name || 'N/A'}
                      </h5>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          ID: {member.healthcareTeam.navigator._id?.navigatorId || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {member.healthcareTeam.navigator._id?.email || 'No email provided'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {member.healthcareTeam.navigator._id?.phone || 'No phone provided'}
                        </p>
                        <p className="text-xs text-gray-400">
                          Assigned: {formatDate(member.healthcareTeam.navigator.assignedDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <FaUserClock className="w-4 h-4 opacity-50" />
                    <p>No navigator assigned</p>
                  </div>
                )}
              </div>

              {/* Assigned Doctor */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <FaUserMd className="w-5 h-5 text-green-500" />
                  <h4 className="text-lg font-medium text-gray-900">Doctor</h4>
                </div>
                {member?.healthcareTeam?.doctor ? (
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-green-50 flex items-center justify-center border border-green-100">
                      {member.healthcareTeam.doctor._id?.profilePic ? (
                        <img 
                          src={member.healthcareTeam.doctor._id.profilePic}
                          alt={member.healthcareTeam.doctor._id.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUserMd className="w-8 h-8 text-green-400" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">
                        {member.healthcareTeam.doctor._id?.name || 'N/A'}
                      </h5>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          ID: {member.healthcareTeam.doctor._id?.doctorId || 'N/A'}
                        </p>
                        {member.healthcareTeam.doctor._id?.qualification && (
                          <p className="text-sm text-gray-600">
                            {member.healthcareTeam.doctor._id.qualification.join(', ')}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          {member.healthcareTeam.doctor._id?.email || 'No email provided'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {member.healthcareTeam.doctor._id?.phone || 'No phone provided'}
                        </p>
                        <p className="text-xs text-gray-400">
                          Assigned: {formatDate(member.healthcareTeam.doctor.assignedDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <FaUserMd className="w-4 h-4 opacity-50" />
                    <p>No doctor assigned</p>
                  </div>
                )}
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Address Information</h4>
              {member?.address && Array.isArray(member.address) && member.address.length > 0 ? (
                <div className="space-y-4">
                  {member.address.map((addr, index) => (
                    <div key={addr._id || index} className={`${index > 0 ? 'border-t pt-4' : ''}`}>
                      {index > 0 && <p className="text-sm text-gray-500 mb-2">Additional Address {index + 1}</p>}
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <div className="flex-grow">
                            <p className="font-medium text-gray-900">{addr.description || 'N/A'}</p>
                            {addr.landmark && (
                              <p className="text-gray-600 text-sm">
                                Landmark: {addr.landmark}
                              </p>
                            )}
                            <p className="text-gray-600">
                              {[
                                addr.region,
                                addr.state,
                                addr.pinCode
                              ].filter(Boolean).join(', ')}
                            </p>
                            <p className="text-gray-600">{addr.country || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No address information available</p>
              )}
            </div>

            {/* Emergency Contact */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{renderValue(member?.emergencyContact?.name)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Relation</p>
                  <p className="font-medium capitalize">{renderValue(member?.emergencyContact?.relation)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{renderValue(member?.emergencyContact?.phone)}</p>
                </div>
              </div>
            </div>

            {/* Membership Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Membership Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">{formatDate(member?.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`font-medium ${member?.active ? 'text-green-600' : 'text-red-600'}`}>
                    {member?.active ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Profile Type</p>
                  <p className="font-medium">
                    {member?.isSubprofile ? 'Sub Profile' : 'Main Profile'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Student Status</p>
                  <p className="font-medium">
                    {member?.isStudent ? 'Student' : 'Regular'}
                  </p>
                </div>
              </div>
            </div>

            {/* Subprofile Information - Only show if this is a subprofile */}
            {member?.isSubprofile && member?.primaryMemberId && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <FaUser className="w-5 h-5 text-purple-500" />
                  <h4 className="text-lg font-medium text-gray-900">Primary Member Details</h4>
                </div>
                <div className="space-y-3">
                  {member?.primaryMemberId && typeof member.primaryMemberId === 'object' ? (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{member.primaryMemberId.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Member ID</p>
                        <p className="font-medium">{member.primaryMemberId.memberId || member.primaryMemberId._id || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="font-medium">{member.primaryMemberId.phone || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{member.primaryMemberId.email || 'N/A'}</p>
                      </div>
                      {member.relation && (
                        <div>
                          <p className="text-sm text-gray-500">Relationship</p>
                          <p className="font-medium capitalize">{member.relation}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-500">Primary member details not available</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60]">
          <ConfirmationDialog
            isOpen={showDeleteConfirm}
            title="Delete Member"
            message="Are you sure you want to delete this member? This action cannot be undone."
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={handleDeleteConfirm}
            onCancel={() => setShowDeleteConfirm(false)}
            variant="danger"
          />
        </div>
      )}
    </>
  );
};

export default ViewMember; 
