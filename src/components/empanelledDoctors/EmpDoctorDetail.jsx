import { useState, useEffect } from 'react'
import { 
  FaTimes, 
  FaEdit, 
  FaTrash, 
  FaUser, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaClock, 
  FaRupeeSign, 
  FaStar,
  FaGraduationCap,
  FaBriefcase,
  FaHospital,
  FaUserMd
} from 'react-icons/fa'
import { useSnackbar } from '../../contexts/SnackbarContext'
import ConfirmationDialog from './EmpConfirmationDialog'
import EditDoctorForm from './EmpEditDoctorForm'
import empDoctorsService from '../../services/empDoctorsService'

// Sample doctors data
export const sampleDoctors = [
  {
    id: 1,
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '+91 98765-43210',
    gender: 'Male',
    qualification: ['MBBS', 'MD - Internal Medicine', 'DM - Cardiology'],
    experienceYears: '15',
    profilePicture: null,
    workPlaces: [
      {
        name: 'Apollo Hospital',
        address: 'Plot No. 1, Sector 1, Dwarka',
        city: 'New Delhi',
        areaName: 'Dwarka',
        consultationTiming: 'morning',
        consultationFee: '800'
      },
      {
        name: 'City Clinic',
        address: 'Shop No. 5, Market Complex',
        city: 'New Delhi',
        areaName: 'Karol Bagh',
        consultationTiming: 'evening',
        consultationFee: '500'
      }
    ],
    bio: 'Experienced cardiologist with expertise in preventive cardiology and heart failure management. Specialized in interventional cardiology procedures.',
    rating: 4.8
  },
  {
    id: 2,
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765-43211',
    gender: 'Female',
    qualification: ['MBBS', 'MS - Obstetrics & Gynecology', 'Fellowship in Reproductive Medicine'],
    experienceYears: '12',
    profilePicture: null,
    workPlaces: [
      {
        name: 'Fortis Hospital',
        address: 'Sector 62, Phase 8',
        city: 'Noida',
        areaName: 'Sector 62',
        consultationTiming: 'morning',
        consultationFee: '1000'
      }
    ],
    bio: 'Specialized in high-risk pregnancies and fertility treatments. Experienced in laparoscopic gynecological surgeries.',
    rating: 4.9
  },
  {
    id: 3,
    name: 'Dr. Amit Patel',
    email: 'amit.patel@example.com',
    phone: '+91 98765-43212',
    gender: 'Male',
    qualification: ['MBBS', 'MS - Orthopedics', 'MCh - Spine Surgery'],
    experienceYears: '18',
    profilePicture: null,
    workPlaces: [
      {
        name: 'Max Hospital',
        address: 'Sector 144, Noida Expressway',
        city: 'Noida',
        areaName: 'Sector 144',
        consultationTiming: 'morning',
        consultationFee: '1200'
      }
    ],
    bio: 'Expert in spine surgery and joint replacement procedures. Specialized in minimally invasive spine surgeries.',
    rating: 4.7
  }
];

const DoctorDetail = ({ doctor: initialDoctor, onClose, onUpdate }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [doctor, setDoctor] = useState(initialDoctor)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { showSnackbar } = useSnackbar()

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (!initialDoctor?._id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await empDoctorsService.getEmpDoctorById(initialDoctor._id);
        if (response.status === 'success') {
          setDoctor(response.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch doctor details');
        console.error('Error fetching doctor details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [initialDoctor?._id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await empDoctorsService.deleteEmpDoctor(doctor._id);
      
      if (response.status === 'success') {
        // First close the confirmation dialog
        setShowDeleteConfirmation(false);
        
        // Show success message
        showSnackbar('Doctor deleted successfully', 'success');
        
        // Close the detail modal
        onClose();
        
        // Refresh the list by calling onUpdate
        if (typeof onUpdate === 'function') {
          await onUpdate();
        }
      } else {
        throw new Error(response.message || 'Failed to delete doctor');
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
      showSnackbar(error.message || 'Failed to delete doctor', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!doctor) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6">
          <div className="text-gray-600">Loading doctor details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6">
          <div className="text-red-500">{error}</div>
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return <EditDoctorForm 
      doctor={doctor}
      onClose={() => setIsEditing(false)}
      onSave={async (updatedDoctor) => {
        try {
          const response = await empDoctorsService.updateEmpDoctor(doctor._id, updatedDoctor);
          if (response.status === 'success') {
            showSnackbar('Doctor updated successfully', 'success');
            setIsEditing(false);
            // Refresh doctor details after update
            const updatedResponse = await empDoctorsService.getEmpDoctorById(doctor._id);
            if (updatedResponse.status === 'success') {
              setDoctor(updatedResponse.data);
            }
            // Call onUpdate to refresh the list
            if (typeof onUpdate === 'function') {
              await onUpdate();
            }
          } else {
            throw new Error(response.message || 'Failed to update doctor');
          }
        } catch (err) {
          console.error('Error updating doctor:', err);
          showSnackbar(err.message || 'Failed to update doctor', 'error');
        }
      }}
    />
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-semibold">Doctor Details</h3>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsEditing(true)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Edit Doctor"
            >
              <FaEdit />
            </button>
            <button 
              onClick={() => setShowDeleteConfirmation(true)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
              disabled={isDeleting}
              title="Delete Doctor"
            >
              <FaTrash />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Close"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h4 className="text-lg font-medium mb-4">Delete Doctor</h4>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this doctor? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-300"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Basic Info & Photo */}
          <div className="md:col-span-1">
            <div className="text-center mb-6">
              {doctor.profilePic ? (
                <img 
                  src={doctor.profilePic} 
                  alt={doctor.name} 
                  className="w-48 h-48 rounded-full object-cover mx-auto"
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                  <FaUser className="text-gray-400 text-4xl" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <h4 className="text-xl font-semibold text-gray-800">{doctor.name}</h4>
                <p className="text-sm text-gray-500 mb-1">ID: {doctor.empanelledDoctorId}</p>
                <p className="text-gray-600">{doctor.gender}</p>
                <p className="text-blue-600 font-medium">{doctor.experienceInYrs} years experience</p>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <FaPhoneAlt className="text-gray-400" />
                  <span>{doctor.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <FaEnvelope className="text-gray-400" />
                  <span>{doctor.email}</span>
                </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaStar className="text-yellow-400" />
                    <span>Rating: {doctor.rating}/5</span>
                  </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="md:col-span-2 space-y-6">
            {/* Qualifications */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaGraduationCap className="text-blue-500" />
                Qualifications & Specialization
              </h4>
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Specialization:</h5>
                  <p className="text-gray-600 font-medium">
                    {doctor.speciality}
                  </p>
                  {doctor.specializedIn && (
                    <p className="text-gray-600 mt-1">
                      Specialized in: {doctor.specializedIn}
                    </p>
                  )}
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Qualifications:</h5>
                  {doctor.qualification.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {doctor.qualification.map((qual, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium border border-purple-100"
                        >
                          {qual}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No qualifications listed</p>
                  )}
                </div>
              </div>
            </div>

            {/* Work Places */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaBriefcase className="text-blue-500" />
                Work Places
              </h4>
              <div className="space-y-4">
                {doctor.workplaces.map((place, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FaHospital className="text-blue-500" />
                      <h5 className="font-medium text-gray-800">{place.name}</h5>
                      <span className="text-sm text-gray-500">({place.type})</span>
                    </div>
                    <div className="space-y-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaRupeeSign className="text-gray-400" />
                        <span>Consultation Fee: ₹{place.consultationFees}</span>
                      </div>
                      <div className="space-y-2">
                        <h6 className="font-medium flex items-center gap-2">
                          <FaClock className="text-gray-400" />
                          Available Time Slots:
                        </h6>
                        {place.timeSlots.map((timeSlot, idx) => (
                          <div key={idx} className="ml-6">
                            <div className="font-medium capitalize">{timeSlot.day}:</div>
                            <div className="ml-4 text-sm">
                              {timeSlot.slots.map((slot, slotIdx) => (
                                <span key={slotIdx} className="inline-block bg-blue-50 text-blue-700 rounded px-2 py-1 mr-2 mb-2">
                                  {slot}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FaUserMd className="text-blue-500" />
                  Additional Information
                </h4>
                <div className="space-y-2 text-gray-700">
                  <p>Average Consultation Fee: ₹{doctor.average_consultation_fees}</p>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail 