import { useState, useEffect } from 'react'
import { FaTimes, FaDownload } from 'react-icons/fa'
import Select from 'react-select'
import { doctorsService } from '../../services/doctorsService';
import { appointmentsService } from '../../services/appointmentsService';
import { toast } from 'react-toastify';

const EditAppointmentForm = ({ onClose, onSuccess, appointment }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormComplete, setIsFormComplete] = useState(true);
  const [isCustomService, setIsCustomService] = useState(false);
  const [isCustomSpecialization, setIsCustomSpecialization] = useState(false);
  const [isCustomDoctor, setIsCustomDoctor] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [isPdfAvailable, setIsPdfAvailable] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  // const [specializations, setSpecializations] = useState([
  //   { value: 'custom', label: '+ Add Custom Specialization' },
  //   { value: 'General Medicine', label: 'General Medicine' },
  //   { value: 'Cardiology', label: 'Cardiology' },
  //   { value: 'Pediatrics', label: 'Pediatrics' },
  //   { value: 'Orthopedics', label: 'Orthopedics' },
  //   { value: 'Dermatology', label: 'Dermatology' },
  //   { value: 'Neurology', label: 'Neurology' },
  //   { value: 'Ophthalmology', label: 'Ophthalmology' }
  // ]);
  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    fetchDoctors();
    checkPdfAvailability();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const response = await doctorsService.getAllDoctors();
      console.log('Doctors API Response:', response);

      if (response?.status === 'success' && Array.isArray(response.data)) {
        console.log('Processing doctors data:', response.data);
        const formattedDoctors = response.data.map(doctor => ({
          value: doctor._id,
          label: `${doctor.name} (${doctor.doctorId})`,
          specializations: doctor.specializations || [],
          doctorDetails: doctor
        }));
        console.log('Formatted doctors:', formattedDoctors);
        
        setDoctors([
          { value: 'custom', label: '+ Add Custom Doctor' },
          ...formattedDoctors
        ]);
      } else {
        console.error('Invalid doctors response format:', response);
        toast.error('Failed to load doctors list');
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
      toast.error('Failed to load doctors list');
    } finally {
      setLoadingDoctors(false);
    }
  };

  const checkPdfAvailability = async () => {
    try {
      const response = await appointmentsService.getAppointmentById(appointment._id);
      setIsPdfAvailable(!!response?.data?.data?.pdfUrl);
    } catch (err) {
      console.error('Error checking PDF availability:', err);
      setIsPdfAvailable(false);
    }
  };

  const [formData, setFormData] = useState({
    service: { value: appointment.service, label: appointment.service },
    customService: '',
    appointmentDateTime: new Date(appointment.appointmentDateTime).toISOString().slice(0, 16),
    additionalInfo: appointment.additionalInfo || '',
    comments: appointment.notes || '',
    paymentStatus: appointment.payment || 'pending',
    appointmentStatus: appointment.status,
    doctorName: appointment.doctorId ? {
      value: appointment.doctorId._id,
      label: `${appointment.doctorId.name} (${appointment.doctorId.doctorId})`,
      specializations: appointment.doctorId.specializations || [],
      doctorDetails: appointment.doctorId
    } : null,
    customDoctorName: '',
  // specialization: appointment.specialization ? { 
    //   value: appointment.specialization, 
    //   label: appointment.specialization.charAt(0).toUpperCase() + appointment.specialization.slice(1) 
    // } : null,
    //2026
    specialization:
      appointment.specialization && appointment.doctorId?.specializations
        ? (() => {
            const match = appointment.doctorId.specializations.find(
              s => s._id === appointment.specialization
            );
            return match ? { value: match._id, label: match.name } : null;
          })()
        : null,
    customSpecialization: '',
    clinicName: appointment.hospitalName || '',
    clinicAddress: appointment.hospitalAddress || ''
  });

  // Member details from API response
  const memberDetails = {
    name: appointment.memberId?.name || 'N/A',
    memberId: appointment.memberId?.memberId || 'N/A',
    gender: appointment.memberId?.gender || 'Not Specified',
    phone: appointment.memberId?.phone || 'N/A',
    address: appointment.memberAddress || null
  };

  // Available services
  const services = [
    { value: 'custom', label: '+ Add Custom Service' },
    { value: 'General Checkup', label: 'General Checkup' },
    { value: 'Dental Care', label: 'Dental Care' },
    { value: 'Eye Care', label: 'Eye Care' },
    { value: 'Physiotherapy', label: 'Physiotherapy' },
    { value: 'Mental Health', label: 'Mental Health' },
    { value: 'Vaccination', label: 'Vaccination' },
    { value: 'Laboratory Tests', label: 'Laboratory Tests' }
  ];

  // Payment status options
  const paymentStatusOptions = [
    'pending',
    'paid'
  ];

  // Appointment status options
  const appointmentStatusOptions = [
    'pending',
    'ongoing',
    'completed',
    'cancelled'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check if all required fields are filled
    checkFormCompletion();
  };

  const handleSelectChange = (selectedOption, name) => {
    if (name === 'service' && selectedOption?.value === 'custom') {
      setIsCustomService(true);
      setFormData(prev => ({ ...prev, service: null }));
    } else if (name === 'specialization' && selectedOption?.value === 'custom') {
      setIsCustomSpecialization(true);
      setFormData(prev => ({ ...prev, specialization: null }));
    } else if (name === 'doctorName' && selectedOption?.value === 'custom') {
      setIsCustomDoctor(true);
      setFormData(prev => ({ 
        ...prev, 
        doctorName: null,
        clinicName: '',
        clinicAddress: ''
      }));
      // Reset specializations when custom doctor is selected
      setSpecializations([{ value: 'custom', label: '+ Add Custom Specialization' }]);
    } else {
      if (name === 'service') setIsCustomService(false);
      if (name === 'specialization') setIsCustomSpecialization(false);
      
      if (name === 'doctorName') {
        setIsCustomDoctor(false);
        // Update specializations when a doctor is selected
        if (selectedOption?.doctorDetails?.specializations?.length > 0) {
         // const doctorSpecializations = selectedOption.doctorDetails.specializations.map(spec => ({
          //   value: spec,
          //   label: spec.charAt(0).toUpperCase() + spec.slice(1)
          // }));
          //2026
          const doctorSpecializations =
            selectedOption.doctorDetails.specializations.map(spec => ({
              value: spec._id,
              label: spec.name
            }));
          setSpecializations([
            { value: 'custom', label: '+ Add Custom Specialization' },
            ...doctorSpecializations
          ]);
        } else {
          setSpecializations([{ value: 'custom', label: '+ Add Custom Specialization' }]);
        }

        // Set clinic/hospital address from doctor's offlineAddress
        const offlineAddress = selectedOption?.doctorDetails?.offlineAddress;
        if (offlineAddress) {
          const formattedAddress = [
            offlineAddress.description,
            offlineAddress.landmark && `Landmark: ${offlineAddress.landmark}`,
            `${offlineAddress.region}, ${offlineAddress.state}, ${offlineAddress.country}`,
            `PIN: ${offlineAddress.pinCode}`
          ].filter(Boolean).join('\n');

          setFormData(prev => ({
            ...prev,
            doctorName: selectedOption,
            customDoctorName: '',
            specialization: null,
            clinicAddress: formattedAddress
          }));
          return; // Return early since we've already updated formData
        }
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: selectedOption,
        ...(name === 'service' && { customService: '' }),
        ...(name === 'specialization' && { customSpecialization: '' }),
        ...(name === 'doctorName' && { 
          customDoctorName: '',
          specialization: null,
          clinicAddress: ''  // Only clear the address, not the name
        })
      }));
    }

    checkFormCompletion();
  };

  const checkFormCompletion = () => {
    const hasService = isCustomService ? formData.customService?.trim() : formData.service;
    const hasDoctor = isCustomDoctor ? formData.customDoctorName?.trim() : formData.doctorName;
    const hasSpecialization = isCustomSpecialization ? formData.customSpecialization?.trim() : formData.specialization;
    
    const isComplete = hasService && hasDoctor && hasSpecialization && formData.clinicName?.trim();
    setIsFormComplete(isComplete);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Prepare the update data
      const updateData = {
        memberId: appointment.memberId._id,
        doctorId: isCustomDoctor ? null : formData.doctorName.value,
        navigatorId: appointment.navigatorId._id,
        appointedBy: appointment.appointedBy,
        appointmentDateTime: new Date(formData.appointmentDateTime).toISOString(),
        additionalInfo: formData.additionalInfo,
        notes: formData.comments,
        specialization: isCustomSpecialization 
          ? formData.customSpecialization 
          : (formData.specialization?.value || ''),
        payment: formData.paymentStatus,
        hospitalName: formData.clinicName,
        hospitalAddress: formData.clinicAddress,
        status: formData.appointmentStatus,
        service: isCustomService ? formData.customService : formData.service.value,
        appointmentType: appointment.appointmentType || 'offline'  // Preserve the original appointmentType
      };

      const response = await appointmentsService.updateAppointment(appointment._id, updateData);
      
      if (response?.data?.status === 'success') {
        toast.success('Appointment updated successfully');
        onSuccess();
      } else {
        throw new Error('Failed to update appointment');
      }
    } catch (err) {
      console.error('Error updating appointment:', err);
      setError(err.message || 'Failed to update appointment. Please try again.');
      toast.error(err.message || 'Failed to update appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloadLoading(true);
      const response = await appointmentsService.getAppointmentById(appointment._id);
      
      if (response?.data?.status === 'success' && response.data.data?.pdfUrl) {
        const pdfUrl = response.data.data.pdfUrl;
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.target = '_blank';
        link.download = `appointment-${appointment.memberId?.name || 'unknown'}.pdf`;
        
        // Append to body, click and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error('PDF not available for this appointment');
      }
    } catch (err) {
      console.error('Error downloading appointment PDF:', err);
      toast.error(err.message || 'Failed to download appointment PDF');
    } finally {
      setDownloadLoading(false);
    }
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      minHeight: '42px',
      borderColor: 'rgb(209 213 219)',
      '&:hover': {
        borderColor: 'rgb(209 213 219)'
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#EFF6FF' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: state.isSelected ? '#2563EB' : '#EFF6FF'
      }
    })
  };
  //18.1.2026
  const BASE_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetchSpecialties();
  }, []);
 const fetchSpecialties = async () => {
  try {
    const token = localStorage.getItem('token');

    const res = await fetch(`/api/v1/doctors/specialties`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const json = await res.json();

    if (json.status !== 'success') {
      throw new Error(json.message);
    }

    const options = json.data.map(s => ({
      value: s._id,
      label: s.name
    }));

    setSpecializations([
      { value: 'custom', label: '+ Add Custom Specialization' },
      ...options
    ]);
  } catch (err) {
    console.error('Failed to load specialties', err);
  }
};
// ✅ FIX: Load specialization list when Edit form opens
useEffect(() => {
  if (appointment?.doctorId?.specializations?.length) {
    const doctorSpecializations = appointment.doctorId.specializations.map(spec => ({
      value: spec._id,
      label: spec.name
    }));

    setSpecializations([
      { value: 'custom', label: '+ Add Custom Specialization' },
      ...doctorSpecializations
    ]);
  }
}, [appointment]);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Edit Appointment</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Static Member Details */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="text-lg font-medium text-gray-700 mb-3">Member Details</h4>
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0">
              <img
                src={appointment.memberId?.profilePic || 'https://via.placeholder.com/100?text=No+Image'}
                alt={memberDetails.name}
                className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                }}
              />
            </div>
            <div className="flex-grow grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{memberDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Member ID</p>
                <p className="font-medium">{memberDetails.memberId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{memberDetails.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mobile Number</p>
                <p className="font-medium">{memberDetails.phone}</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Address</p>
            {memberDetails.address ? (
              <div className="space-y-1">
                <p className="font-medium">{memberDetails.address.description}</p>
                {memberDetails.address.landmark && (
                  <p className="font-medium">Landmark: {memberDetails.address.landmark}</p>
                )}
                <p className="font-medium">
                  {memberDetails.address.region}, {memberDetails.address.state}, {memberDetails.address.country}
                </p>
                <p className="font-medium">PIN: {memberDetails.address.pinCode}</p>
              </div>
            ) : (
              <p className="font-medium">Address not available</p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service *
              </label>
              {!isCustomService ? (
                <Select
                  name="service"
                  value={formData.service}
                  onChange={(option) => handleSelectChange(option, 'service')}
                  options={services}
                  placeholder="Search and select a service..."
                  isClearable
                  isSearchable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  required
                  styles={selectStyles}
                />
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="customService"
                    value={formData.customService}
                    onChange={handleInputChange}
                    placeholder="Enter custom service..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomService(false);
                      setFormData(prev => ({ ...prev, customService: '' }));
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Back to service list
                  </button>
                </div>
              )}
            </div>

            {/* Appointment Date & Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                name="appointmentDateTime"
                value={formData.appointmentDateTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Doctor's Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor's Name *
              </label>
              {!isCustomDoctor ? (
                <Select
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={(option) => handleSelectChange(option, 'doctorName')}
                  options={doctors}
                  placeholder={loadingDoctors ? "Loading doctors..." : "Search and select a doctor..."}
                  isClearable
                  isSearchable
                  isLoading={loadingDoctors}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  required
                  styles={selectStyles}
                  noOptionsMessage={() => "No doctors found"}
                />
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="customDoctorName"
                    value={formData.customDoctorName}
                    onChange={handleInputChange}
                    placeholder="Enter doctor's name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomDoctor(false);
                      setFormData(prev => ({ ...prev, customDoctorName: '' }));
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Back to doctors list
                  </button>
                </div>
              )}
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization *
              </label>
              {!isCustomSpecialization ? (
                <Select
                  name="specialization"
                  value={formData.specialization}
                  onChange={(option) => handleSelectChange(option, 'specialization')}
                  options={specializations}
                  placeholder={!formData.doctorName ? "Select a doctor first" : "Search and select specialization..."}
                  isClearable
                  isSearchable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  required
                  styles={selectStyles}
                  isDisabled={!formData.doctorName || isCustomDoctor}
                  noOptionsMessage={() => formData.doctorName ? "No specializations available" : "Please select a doctor first"}
                />
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="customSpecialization"
                    value={formData.customSpecialization}
                    onChange={handleInputChange}
                    placeholder="Enter specialization..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomSpecialization(false);
                      setFormData(prev => ({ ...prev, customSpecialization: '' }));
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Back to specializations list
                  </button>
                </div>
              )}
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {paymentStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Appointment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Status
              </label>
              <select
                name="appointmentStatus"
                value={formData.appointmentStatus}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {appointmentStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clinic/Hospital Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clinic/Hospital Name *
              </label>
              <input
                type="text"
                name="clinicName"
                value={formData.clinicName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clinic/Hospital Address
              </label>
              <textarea
                name="clinicAddress"
                value={formData.clinicAddress}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[120px]"
              />
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comments
            </label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Add any comments or notes about the appointment..."
            />
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Information
            </label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter any additional information or special requirements..."
            />
          </div>

          {/* Submit and Download Buttons */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!isPdfAvailable || downloadLoading}
              className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {downloadLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                  Downloading...
                </>
              ) : (
                <>
                  <FaDownload />
                  Download Appointment
                </>
              )}
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !isFormComplete}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAppointmentForm; 