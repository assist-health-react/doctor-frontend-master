import { useState, useEffect } from 'react'
import { FaTrash, FaEdit, FaTimes, FaUserCircle, FaSearch, FaDownload } from 'react-icons/fa'
import ConfirmationDialog from './ConfirmationDialog'
import AddEditDoctor from './AddEditDoctor'
import { doctorsService } from '../../services/doctorsService'
import { navigatorsService } from '../../services/navigatorsService'
import { membersService } from '../../services/membersService'
import { useSnackbar } from '../../contexts/SnackbarContext'

const DoctorDetail = ({ doctor, onClose, onDeleteSuccess }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { showSnackbar } = useSnackbar()
  const [showNavigatorDropdown, setShowNavigatorDropdown] = useState(false)
  const [showMembersDropdown, setShowMembersDropdown] = useState(false)
  const [membersList, setMembersList] = useState([])
  const [memberSearch, setMemberSearch] = useState('')
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)
  const [navigatorsList, setNavigatorsList] = useState([])
  const [navigatorSearch, setNavigatorSearch] = useState('')
  const [isLoadingNavigators, setIsLoadingNavigators] = useState(false)
  const [showShareSuccess, setShowShareSuccess] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState(null)

  const fetchMembers = async (searchQuery = '') => {
    try {
      setIsLoadingMembers(true);
      const response = await membersService.getMembers({ search: searchQuery });
      if (response?.status === 'success' && response?.data) {
        setMembersList(response.data);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
      showSnackbar('Failed to fetch members', 'error');
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const fetchNavigators = async (searchQuery = '') => {
    try {
      setIsLoadingNavigators(true);
      const response = await navigatorsService.getNavigators({ search: searchQuery });
      if (response?.status === 'success' && response?.data) {
        setNavigatorsList(response.data);
      }
    } catch (err) {
      console.error('Error fetching navigators:', err);
      showSnackbar('Failed to fetch navigators', 'error');
    } finally {
      setIsLoadingNavigators(false);
    }
  };

  const handleAssignNavigator = async (selectedNavigator) => {
    try {
      const response = await doctorsService.assignNavigator(doctor._id, selectedNavigator._id);
      if (response?.status === 'success') {
        showSnackbar('Navigator assigned successfully', 'success');
        // Update the local doctor state with the new navigator
        doctor.navigatorId = {
          _id: selectedNavigator._id,
          name: selectedNavigator.name,
          profilePic: selectedNavigator.profilePic,
          navigatorId: selectedNavigator.navigatorId
        };
        setShowNavigatorDropdown(false);
      } else {
        throw new Error(response?.message || 'Failed to assign navigator');
      }
    } catch (err) {
      console.error('Error assigning navigator:', err);
      showSnackbar(err.message || 'Failed to assign navigator', 'error');
    }
  };

  // Add useEffect for searching navigators
  useEffect(() => {
    if (showNavigatorDropdown) {
      const delayDebounceFn = setTimeout(() => {
        fetchNavigators(navigatorSearch);
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [navigatorSearch, showNavigatorDropdown]);

  // Add useEffect for searching members
  useEffect(() => {
    if (showMembersDropdown) {
      const delayDebounceFn = setTimeout(() => {
        fetchMembers(memberSearch);
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [memberSearch, showMembersDropdown]);

  const handleDelete = async () => {
    try {
      if (!doctor._id) {
        showSnackbar('Invalid doctor ID. Please try again.', 'error');
        return;
      }
      
      setIsDeleting(true)
      const response = await doctorsService.deleteDoctor(doctor._id)
      console.log('Delete response:', response)
      
      // Check for success status in response
      if (response && response.status === 'success') {
        showSnackbar(response.message || 'Doctor deleted successfully!', 'success')
        onDeleteSuccess()
        onClose()
      } else {
        throw new Error(response?.message || 'Failed to delete doctor')
      }
    } catch (error) {
      console.error('Error deleting doctor:', error)
      showSnackbar(error.message || 'Failed to delete doctor', 'error')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleEdit = () => {
    const doctorData = {
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      gender: doctor.gender,
      qualification: doctor.qualification,
      medicalCouncilRegistrationNumber: doctor.medicalCouncilRegistrationNumber,
      experienceYears: doctor.experienceYears,
      languagesSpoken: doctor.languagesSpoken,
      serviceTypes: doctor.serviceTypes,
      specializations: doctor.specializations,
      introduction: doctor.introduction,
      onlineConsultationTimeSlots: doctor.onlineConsultationTimeSlots,
      offlineConsultationTimeSlots: doctor.offlineConsultationTimeSlots,
      offlineAddress: doctor.offlineAddress,
      areas: doctor.areas,
      profilePic: doctor.profilePic,
      digitalSignature: doctor.digitalSignature
    };
    setIsEditing(true);
  };

  const handleDownload = async () => {
    try {
      const response = await doctorsService.getDoctorProfilePdf(doctor._id);
      
      if (response?.s3Url) {
        // Open the PDF in a new tab
        window.open(response.s3Url, '_blank');
      } else {
        throw new Error('Failed to generate profile PDF');
      }
    } catch (error) {
      console.error('Error generating profile PDF:', error);
      showSnackbar(error.message || 'Failed to generate profile PDF', 'error');
    }
  };

  const handleMemberClick = (memberId) => {
    setSelectedMemberId(selectedMemberId === memberId ? null : memberId);
  };

  const handleShareWithMember = async (member) => {
    try {
      // Create the text to be shared
      const shareText = `
Doctor Profile:
Name: ${doctor.name}
Doctor ID: ${doctor.doctorId}
Specializations: ${doctor.specializations?.join(', ')}
Service Types: ${doctor.serviceTypes?.join(', ')}
Languages: ${doctor.languagesSpoken?.join(', ')}
Education: ${doctor.qualification?.join(', ')}
Medical Council Number: ${doctor.medicalCouncilRegistrationNumber}
Contact: ${doctor.phone}
Email: ${doctor.email}
      `.trim();

      // Here you would typically make an API call to share with the member
      // For now, we'll just show a success message
      showSnackbar(`Profile shared with ${member.name}`, 'success');
      setShowMembersDropdown(false);
    } catch (error) {
      console.error('Error sharing profile:', error);
      showSnackbar('Failed to share profile', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Fixed Header */}
          <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-gray-900">Doctor Details</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaDownload className="w-4 h-4 mr-2" />
                    Download
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaEdit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FaTrash className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                  <button
                    onClick={onClose}
                    className="inline-flex items-center p-2 text-gray-400 hover:text-gray-500"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(100vh-12rem)] p-6">
            <div className="space-y-6">
              {/* Profile Picture & Signature */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h5 className="text-lg font-semibold text-gray-800 mb-4">Profile Picture</h5>
                  <div className="flex justify-center">
                    {doctor.profilePic ? (
                      <img 
                        src={doctor.profilePic} 
                        alt={doctor.name}
                        className="w-40 h-40 rounded-full object-cover shadow-lg"
                      />
                    ) : (
                      <FaUserCircle className="w-40 h-40 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h5 className="text-lg font-semibold text-gray-800 mb-4">Digital Signature</h5>
                  <div className="flex justify-center">
                    {doctor.digitalSignature ? (
                      <img 
                        src={doctor.digitalSignature} 
                        alt="Digital Signature" 
                        className="max-h-20 object-contain"
                      />
                    ) : (
                      <p className="text-gray-500">No signature uploaded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium mt-1">{doctor.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Doctor ID</p>
                    <p className="font-medium mt-1">{doctor.doctorId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-medium mt-1">{doctor.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium mt-1">{doctor.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-medium mt-1">{doctor.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Speciality</p>
                    <p className="font-medium mt-1">{doctor.specializations?.join(', ') || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-medium mt-1">{doctor.experienceYears} Years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Medical Council Registration Number</p>
                    <p className="font-medium mt-1">{doctor.medicalCouncilNumber}</p>
                  </div>
                </div>
              </div>

              {/* Qualifications */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">Qualifications</h5>
                <div className="space-y-2">
                  {doctor.qualification?.map((qual, index) => (
                    <p key={index} className="text-gray-600">{qual}</p>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">Languages Spoken</h5>
                <div className="flex flex-wrap gap-2">
                  {doctor.languagesSpoken?.map((language, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              {/* Service Types */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">Service Types</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg border-2 transition-all ${
                    doctor.serviceTypes?.includes('online') 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 bg-white opacity-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        doctor.serviceTypes?.includes('online') 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h6 className={`font-medium ${
                          doctor.serviceTypes?.includes('online') 
                            ? 'text-blue-900' 
                            : 'text-gray-500'
                        }`}>Online Consultation</h6>
                        <p className={`text-sm ${
                          doctor.serviceTypes?.includes('online') 
                            ? 'text-blue-600' 
                            : 'text-gray-400'
                        }`}>Virtual appointments</p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border-2 transition-all ${
                    doctor.serviceTypes?.includes('offline') 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-white opacity-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        doctor.serviceTypes?.includes('offline') 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h6 className={`font-medium ${
                          doctor.serviceTypes?.includes('offline') 
                            ? 'text-green-900' 
                            : 'text-gray-500'
                        }`}>Offline Consultation</h6>
                        <p className={`text-sm ${
                          doctor.serviceTypes?.includes('offline') 
                            ? 'text-green-600' 
                            : 'text-gray-400'
                        }`}>In-person visits</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Navigator Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">Navigator</h5>
                {doctor.navigatorId ? (
                  <div className="flex items-center gap-4">
                    {doctor.navigatorId.profilePic ? (
                      <img 
                        src={doctor.navigatorId.profilePic} 
                        alt={doctor.navigatorId.name}
                        className="w-16 h-16 rounded-full object-cover shadow-md"
                      />
                    ) : (
                      <FaUserCircle className="w-16 h-16 text-gray-400" />
                    )}
                    <div className="flex-1">
                      <h6 className="text-lg font-medium text-gray-800">{doctor.navigatorId.name}</h6>
                      <p className="text-sm text-gray-500">Navigator ID: {doctor.navigatorId.navigatorId || 'N/A'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500">No navigator assigned</p>
                    <button 
                      onClick={() => {
                        setShowNavigatorDropdown(true);
                        fetchNavigators();
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <FaUserCircle />
                      Assign Navigator
                    </button>
                  </div>
                )}
              </div>

              {/* Address Information */}
              {doctor.serviceTypes?.includes('offline') && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h5 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h5>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="font-medium mt-1">{doctor.offlineAddress?.description || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Landmark</p>
                      <p className="font-medium mt-1">{doctor.offlineAddress?.landmark || 'Not specified'}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">PIN Code</p>
                        <p className="font-medium mt-1">{doctor.offlineAddress?.pinCode || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Region</p>
                        <p className="font-medium mt-1">{doctor.offlineAddress?.region || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">State</p>
                        <p className="font-medium mt-1">{doctor.offlineAddress?.state || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Country</p>
                        <p className="font-medium mt-1">{doctor.offlineAddress?.country || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Areas */}
              {doctor.areas && doctor.areas.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h5 className="text-lg font-semibold text-gray-800 mb-4">Service Areas</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {doctor.areas.map((area, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-600">Area Name</p>
                        <p className="font-medium mt-1">{area?.areaName || 'N/A'}</p>
                        <p className="text-sm text-gray-600 mt-2">Region</p>
                        <p className="font-medium mt-1">{area?.region || 'N/A'}</p>
                        <p className="text-sm text-gray-600 mt-2">PIN Code</p>
                        <p className="font-medium mt-1">{area?.pincode || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Time Slots */}
              {doctor.serviceTypes?.includes('online') && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h5 className="text-lg font-semibold text-gray-800 mb-4">Online Consultation Time Slots</h5>
                  <div className="space-y-4">
                    {doctor.onlineConsultationTimeSlots?.map((slot, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="font-medium capitalize">{slot.day}</p>
                        <div className="mt-2 space-y-1">
                          {slot.slots.map((timeSlot, idx) => (
                            <p key={idx} className="text-gray-600">{timeSlot}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {doctor.serviceTypes?.includes('offline') && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h5 className="text-lg font-semibold text-gray-800 mb-4">Offline Consultation Time Slots</h5>
                  <div className="space-y-4">
                    {doctor.offlineConsultationTimeSlots?.map((slot, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="font-medium capitalize">{slot.day}</p>
                        <div className="mt-2 space-y-1">
                          {slot.slots.map((timeSlot, idx) => (
                            <p key={idx} className="text-gray-600">{timeSlot}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Introduction */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">Introduction</h5>
                <p className="text-gray-600 leading-relaxed">{doctor.introduction}</p>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <p className="text-blue-600 text-sm font-medium">Total Members</p>
                  <p className="text-3xl font-bold text-blue-700 mt-1">{doctor.total_assigned_members || 0}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-6 text-center">
                  <p className="text-green-600 text-sm font-medium">Rating</p>
                  <p className="text-3xl font-bold text-green-700 mt-1">{doctor.rating || 0} ★</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigator Selection Modal */}
          {showNavigatorDropdown && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
              <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Assign Navigator</h3>
                  <button 
                    onClick={() => setShowNavigatorDropdown(false)}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>

                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search navigators..."
                    value={navigatorSearch}
                    onChange={(e) => setNavigatorSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>

                <div className="max-h-[60vh] overflow-y-auto">
                  {isLoadingNavigators ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : navigatorsList.length > 0 ? (
                    <div className="grid gap-2">
                      {navigatorsList.map((nav) => (
                        <button
                          key={nav._id}
                          onClick={() => handleAssignNavigator(nav)}
                          className="w-full p-4 hover:bg-gray-50 rounded-lg flex items-center gap-4 transition-colors border border-gray-200"
                        >
                          {nav.profilePic ? (
                            <img 
                              src={nav.profilePic} 
                              alt={nav.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <FaUserCircle className="w-12 h-12 text-gray-400" />
                          )}
                          <div className="text-left flex-1">
                            <p className="font-medium text-gray-800">{nav.name}</p>
                            <p className="text-sm text-gray-500">ID: {nav.navigatorId || 'N/A'}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        {navigatorSearch ? 'No navigators found' : 'Start typing to search navigators'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {showDeleteConfirm && (
            <ConfirmationDialog
              isOpen={showDeleteConfirm}
              onClose={() => setShowDeleteConfirm(false)}
              onConfirm={handleDelete}
              title="Delete Doctor"
              message="Are you sure you want to delete this doctor? This action cannot be undone."
              isLoading={isDeleting}
            />
          )}

          {isEditing && (
            <AddEditDoctor
              onClose={() => setIsEditing(false)}
              initialData={doctor}
              isEditing={true}
              onSuccess={() => {
                setIsEditing(false);
                onDeleteSuccess();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail; 