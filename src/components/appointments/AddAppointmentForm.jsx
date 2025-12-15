import { useState, useEffect } from 'react'
import { FaTimes, FaDownload } from 'react-icons/fa'
import Select from 'react-select'
import { doctorsService } from '../../services/doctorsService';
import { appointmentsService } from '../../services/appointmentsService';
import { toast } from 'react-toastify';
import { membersService } from '../../services/membersService';

const AddAppointmentForm = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [isCustomService, setIsCustomService] = useState(false);
  const [isCustomDoctor, setIsCustomDoctor] = useState(false);
  const [isCustomSpecialization, setIsCustomSpecialization] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [specializations, setSpecializations] = useState([
    { value: 'custom', label: '+ Add Custom Specialization' },
    { value: 'General Medicine', label: 'General Medicine' },
    { value: 'Cardiology', label: 'Cardiology' },
    { value: 'Pediatrics', label: 'Pediatrics' },
    { value: 'Orthopedics', label: 'Orthopedics' },
    { value: 'Dermatology', label: 'Dermatology' },
    { value: 'Neurology', label: 'Neurology' },
    { value: 'Ophthalmology', label: 'Ophthalmology' }
  ]);

  const [formData, setFormData] = useState({
    service: null,
    customService: '',
    doctorName: null,
    customDoctorName: '',
    specialization: null,
    customSpecialization: '',
    appointmentDateTime: '',
    additionalInfo: '',
    comments: '',
    paymentStatus: 'pending',
    clinicName: '',
    clinicAddress: '',
    memberId: null
  });

  useEffect(() => {
    fetchDoctors();
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoadingMembers(true);
      // Get user from localStorage to get navigatorId
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.userId) {
        throw new Error('User not authenticated');
      }

      const response = await membersService.getMembers({
        navigatorId: user.userId,
        limit: 100, // Get more members for better search
        isStudent: false // Only get main profiles
      });

      if (response?.status === 'success' && Array.isArray(response.data)) {
        const formattedMembers = response.data.map(member => ({
          value: member._id,
          label: `${member.name} (${member.memberId || 'No ID'})`,
          memberDetails: member
        }));
        setMembers(formattedMembers);
      } else {
        console.error('Invalid members response format:', response);
        toast.error('Failed to load members list');
      }
    } catch (err) {
      console.error('Error fetching members:', err);
      toast.error('Failed to load members list');
    } finally {
      setLoadingMembers(false);
    }
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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
          const doctorSpecializations = selectedOption.doctorDetails.specializations.map(spec => ({
            value: spec,
            label: spec.charAt(0).toUpperCase() + spec.slice(1)
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
          clinicAddress: ''
        })
      }));
    }

    checkFormCompletion();
  };

  const handleMemberSelect = (selectedOption) => {
    const memberData = selectedOption?.memberDetails || null;
    // Get the primary address (first address in the array)
    const primaryAddress = memberData?.address?.[0] || null;
    
    setSelectedMember({
      ...memberData,
      address: primaryAddress
    });
    setFormData(prev => ({
      ...prev,
      memberId: selectedOption?.value || null
    }));
    checkFormCompletion();
  };

  const checkFormCompletion = () => {
    const hasService = isCustomService ? formData.customService?.trim() : formData.service;
    const hasDoctor = isCustomDoctor ? formData.customDoctorName?.trim() : formData.doctorName;
    const hasSpecialization = isCustomSpecialization ? formData.customSpecialization?.trim() : formData.specialization;
    const hasDateTime = formData.appointmentDateTime?.trim();
    const hasMember = formData.memberId;
    
    const isComplete = hasService && hasDoctor && hasSpecialization && hasDateTime && formData.clinicName?.trim() && hasMember;
    setIsFormComplete(isComplete);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.userId) {
        throw new Error('User not authenticated');
      }

      // Prepare the appointment data
      const appointmentData = {
        memberId: formData.memberId,
        doctorId: isCustomDoctor ? null : formData.doctorName.value,
        navigatorId: user.userId,
        appointedBy: user.userId,
        appointmentDateTime: new Date(formData.appointmentDateTime).toISOString(),
        additionalInfo: formData.additionalInfo,
        notes: formData.comments,
        specialization: isCustomSpecialization 
          ? formData.customSpecialization 
          : (formData.specialization?.value || ''),
        payment: formData.paymentStatus,
        hospitalName: formData.clinicName,
        hospitalAddress: formData.clinicAddress,
        memberAddress: selectedMember?.address || null
      };

      const response = await appointmentsService.createAppointment(appointmentData);
      
      if (response?.data?.status === 'success') {
        toast.success('Appointment created successfully');
        onSuccess();
      } else {
        throw new Error('Failed to create appointment');
      }
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError(err.message || 'Failed to create appointment. Please try again.');
      toast.error(err.message || 'Failed to create appointment');
    } finally {
      setLoading(false);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Book New Appointment</h3>
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

        {/* Member Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Member *
          </label>
          <Select
            name="member"
            value={members.find(m => m.value === formData.memberId)}
            onChange={handleMemberSelect}
            options={members}
            isLoading={loadingMembers}
            placeholder={loadingMembers ? "Loading members..." : "Search and select a member..."}
            isClearable
            isSearchable
            className="react-select-container"
            classNamePrefix="react-select"
            styles={selectStyles}
            noOptionsMessage={() => "No members found"}
          />
        </div>

        {/* Selected Member Details */}
        {selectedMember && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="text-lg font-medium text-gray-700 mb-3">Member Details</h4>
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0">
                <img
                  src={selectedMember.profilePic || 'https://via.placeholder.com/100?text=No+Image'}
                  alt={selectedMember.name}
                  className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                  }}
                />
              </div>
              <div className="flex-grow grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{selectedMember.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member ID</p>
                  <p className="font-medium">{selectedMember.memberId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium">{selectedMember.gender || 'Not Specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mobile Number</p>
                  <p className="font-medium">{selectedMember.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
            {selectedMember.address && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Address</p>
                <div className="space-y-1">
                  <p className="font-medium">{selectedMember.address.description}</p>
                  {selectedMember.address.landmark && (
                    <p className="font-medium">Landmark: {selectedMember.address.landmark}</p>
                  )}
                  <p className="font-medium">
                    {selectedMember.address.region}, {selectedMember.address.state}, {selectedMember.address.country}
                  </p>
                  <p className="font-medium">PIN: {selectedMember.address.pinCode}</p>
                </div>
              </div>
            )}
          </div>
        )}

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
                min={new Date().toISOString().slice(0, 16)}
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

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
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
                  Creating...
                </>
              ) : (
                'Create Appointment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppointmentForm; 