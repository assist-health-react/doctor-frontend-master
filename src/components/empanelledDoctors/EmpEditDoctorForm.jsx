import { useState, useEffect, useRef } from 'react'
import { FaTimes, FaUpload, FaTrash } from 'react-icons/fa'
import Select from 'react-select'
import api from '../../services/api'
import { useSnackbar } from '../../contexts/SnackbarContext'
import empDoctorsService from '../../services/empDoctorsService'
import { uploadMedia } from '../../services/mediaService'

const EditDoctorForm = ({ doctor, onClose, onSave }) => {
  const { showSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [healthcareProviders, setHealthcareProviders] = useState([]);
  const [isLoadingHealthcare, setIsLoadingHealthcare] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    qualification: [],
    experienceInYrs: '',
    speciality: '',
    specializedIn: '',
    profilePic: null,
    workplaces: [{
      providerId: null,
      type: 'hospital',
      name: '',
      consultationFees: '',
      timeSlots: []
    }]
  });

  const specialityOptions = [
    { value: 'general-physician', label: 'General Physician' },
    { value: 'cardiologist', label: 'Cardiologist' },
    { value: 'dermatologist', label: 'Dermatologist' },
    { value: 'endocrinologist', label: 'Endocrinologist' },
    { value: 'gastroenterologist', label: 'Gastroenterologist' },
    { value: 'neurologist', label: 'Neurologist' },
    { value: 'oncologist', label: 'Oncologist' },
    { value: 'pediatrician', label: 'Pediatrician' },
    { value: 'psychiatrist', label: 'Psychiatrist' },
    { value: 'orthopedic', label: 'Orthopedic' },
    { value: 'ophthalmologist', label: 'Ophthalmologist' },
    { value: 'ent-specialist', label: 'ENT Specialist' },
    { value: 'pulmonologist', label: 'Pulmonologist' },
    { value: 'dentist', label: 'Dentist' },
    { value: 'gynecologist', label: 'Gynecologist' }
  ];

  // Fetch healthcare providers
  useEffect(() => {
    const fetchHealthcareProviders = async () => {
      try {
        setIsLoadingHealthcare(true);
        const response = await api.get('/api/v1/hc-providers');
        if (response?.status === 'success' && response?.data) {
          const providers = response.data.map(provider => ({
            value: provider._id,
            label: provider.name,
            type: provider.type,
            operationHours: provider.operationHours || []
          }));
          setHealthcareProviders(providers);
        }
      } catch (err) {
        console.error('Error fetching healthcare providers:', err);
        showSnackbar('Failed to load healthcare providers', 'error');
      } finally {
        setIsLoadingHealthcare(false);
      }
    };

    fetchHealthcareProviders();
  }, []);

  // Initialize form with doctor data
  useEffect(() => {
    if (doctor && healthcareProviders.length > 0) {
      console.log('Original doctor data:', doctor);
      const workplacesWithProviders = doctor.workplaces.map(workplace => {
        // Find the matching healthcare provider using the nested _id
        const providerId = workplace.providerId?._id || workplace.providerId;
        const provider = healthcareProviders.find(p => p.value === providerId);
        
        console.log('Found provider:', provider);
        console.log('Original workplace time slots:', workplace.timeSlots);

        // Create the provider option object for the Select component
        const healthcareProvider = provider ? {
          value: provider.value,
          label: provider.label,
          type: provider.type,
          operationHours: provider.operationHours || []
        } : null;

        // Convert timeSlots array to the format expected by the form
        const formattedTimeSlots = [];
        if (workplace.timeSlots && Array.isArray(workplace.timeSlots)) {
          workplace.timeSlots.forEach(daySlot => {
            if (daySlot.day && Array.isArray(daySlot.slots)) {
              daySlot.slots.forEach(time => {
                // Store just the start time from the slot
                const startTime = time.split('-')[0].trim();
                formattedTimeSlots.push(`${daySlot.day.toLowerCase()}-${startTime}`);
              });
            }
          });
        }

        console.log('Formatted time slots:', formattedTimeSlots);

        return {
          ...workplace,
          providerId: providerId,
          healthcareProvider,
          timeSlots: formattedTimeSlots,
          consultationFees: workplace.consultationFees?.toString() || ''
        };
      });

      console.log('Workplaces with providers:', workplacesWithProviders);

      setFormData(prev => ({
        ...doctor,
        qualification: Array.isArray(doctor.qualification) ? doctor.qualification.join(', ') : doctor.qualification || '',
        workplaces: workplacesWithProviders
      }));

      if (doctor.profilePic) {
        setProfilePreview(doctor.profilePic);
      }
    }
  }, [doctor, healthcareProviders]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleQualificationChange = (e) => {
    setFormData(prev => ({
      ...prev,
      qualification: e.target.value
    }));
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setProfilePreview(URL.createObjectURL(file));

      const response = await uploadMedia(file);
      if (response && response.imageUrl) {
        setFormData(prev => ({
          ...prev,
          profilePic: response.imageUrl
        }));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload profile picture. Please try again.');
      setProfilePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      profilePic: ''
    }));
    setProfilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleWorkPlaceChange = (index, field, value) => {
    setFormData(prev => {
      const updatedWorkPlaces = [...prev.workplaces];
      if (field === 'healthcareProvider') {
        const selectedProvider = healthcareProviders.find(p => p.value === value);
        updatedWorkPlaces[index] = {
          ...updatedWorkPlaces[index],
          providerId: selectedProvider?.value || null,
          type: selectedProvider?.type || 'hospital',
          name: selectedProvider?.label || '',
          healthcareProvider: selectedProvider,
          timeSlots: [] // Reset time slots when provider changes
        };
      } else {
        updatedWorkPlaces[index] = {
          ...updatedWorkPlaces[index],
          [field]: value
        };
      }
      return {
        ...prev,
        workplaces: updatedWorkPlaces
      };
    });
  };

  const handleTimingSelection = (index, day, slot) => {
    setFormData(prev => {
      const updatedWorkPlaces = [...prev.workplaces];
      const workplace = updatedWorkPlaces[index];
      // Extract just the start time from the slot
      const startTime = slot.split('-')[0].trim();
      const timingKey = `${day.toLowerCase()}-${startTime}`;
      const currentTimings = workplace.timeSlots || [];

      // Toggle the time slot
      const updatedTimings = currentTimings.includes(timingKey)
        ? currentTimings.filter(t => t !== timingKey)
        : [...currentTimings, timingKey];

      updatedWorkPlaces[index] = {
        ...workplace,
        timeSlots: updatedTimings
      };

      return {
        ...prev,
        workplaces: updatedWorkPlaces
      };
    });
  };

  const formatTimeSlot = (slot) => {
    return slot.replace(' | ', ' - ');
  };

  const addWorkPlace = () => {
    setFormData(prev => ({
      ...prev,
      workplaces: [
        ...prev.workplaces,
        {
          providerId: null,
          type: 'hospital',
          name: '',
          consultationFees: '',
          timeSlots: []
        }
      ]
    }));
  };

  const removeWorkPlace = (index) => {
    setFormData(prev => ({
      ...prev,
      workplaces: prev.workplaces.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Prepare workplaces data
      const workplaces = formData.workplaces.map(workplace => {
        // Convert timeSlots array back to the API format
        const timeSlotsByDay = {};
        workplace.timeSlots.forEach(slot => {
          const [day, time] = slot.split('-');
          if (!timeSlotsByDay[day]) {
            timeSlotsByDay[day] = [];
          }
          timeSlotsByDay[day].push(time.trim());
        });

        console.log('Submitting time slots:', timeSlotsByDay);

        // Convert to final format
        const timeSlots = Object.entries(timeSlotsByDay).map(([day, slots]) => ({
          day,
          slots: slots
        }));

        return {
          providerId: workplace.healthcareProvider?.value || workplace.providerId,
          type: workplace.type || 'hospital',
          name: workplace.name || workplace.healthcareProvider?.label || '',
          consultationFees: parseInt(workplace.consultationFees) || 0,
          timeSlots
        };
      });

      // Update doctor
      const response = await empDoctorsService.updateEmpDoctor(doctor._id, {
        ...formData,
        workplaces,
        qualification: formData.qualification.split(',').map(q => q.trim()).filter(q => q)
      });

      if (response.status === 'success') {
        showSnackbar('Doctor updated successfully', 'success');
        onSave(response.data);
        onClose();
      } else {
        throw new Error(response.message || 'Failed to update doctor');
      }
    } catch (err) {
      console.error('Error updating doctor:', err);
      setError(err.message || 'Failed to update doctor');
      showSnackbar(err.message || 'Failed to update doctor', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-semibold">Edit Doctor</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Upload */}
          <div className="flex items-center space-x-6">
            <div className="shrink-0">
              <div className="flex-shrink-0 w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg overflow-hidden">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaUpload className="w-8 h-8" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center space-x-2">
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <FaUpload className="mr-2 -ml-1 h-5 w-5 text-gray-400" />
                  {isUploading ? 'Uploading...' : 'Upload Photo'}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    ref={fileInputRef}
                  />
                </label>
                {profilePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speciality *
              </label>
              <Select
                options={specialityOptions}
                value={specialityOptions.find(option => option.value === formData.speciality)}
                onChange={(selected) => setFormData(prev => ({ ...prev, speciality: selected?.value || null }))}
                isClearable
                placeholder="Select or search speciality"
                className="basic-single"
                classNamePrefix="select"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialized In
              </label>
              <input
                type="text"
                name="specializedIn"
                value={formData.specializedIn}
                onChange={handleInputChange}
                placeholder="E.g., Pediatric Cardiology, Sports Medicine"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Qualification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qualifications *
            </label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleQualificationChange}
              placeholder="Enter qualifications separated by commas"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Years of Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience *
            </label>
            <input
              type="number"
              name="experienceInYrs"
              value={formData.experienceInYrs}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
            />
          </div>

          {/* Work Places */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium">Work Places</h4>
              <button
                type="button"
                onClick={addWorkPlace}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
              >
                Add Workplace
              </button>
            </div>

            {formData.workplaces.map((workplace, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <h5 className="text-md font-medium">Workplace {index + 1}</h5>
                  <button
                    type="button"
                    onClick={() => removeWorkPlace(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Healthcare Provider *
                    </label>
                    <Select
                      options={healthcareProviders}
                      value={workplace.healthcareProvider}
                      onChange={(selected) => handleWorkPlaceChange(index, 'healthcareProvider', selected?.value)}
                      isClearable
                      isLoading={isLoadingHealthcare}
                      placeholder="Select healthcare provider"
                      className="basic-single"
                      classNamePrefix="select"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Consultation Fee (₹) *
                    </label>
                    <input
                      type="number"
                      value={workplace.consultationFees}
                      onChange={(e) => handleWorkPlaceChange(index, 'consultationFees', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter consultation fee"
                      required
                    />
                  </div>
                </div>

                {workplace.healthcareProvider && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Time Slots
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {(workplace.healthcareProvider.operationHours || []).map((dayData) => {
                        const slots = dayData.slots || [];
                        
                        return (
                          <div key={dayData.day} className="border rounded-lg p-3">
                            <h6 className="font-medium text-gray-700 mb-2">
                              {dayData.day.charAt(0).toUpperCase() + dayData.day.slice(1)}
                            </h6>
                            <div className="space-y-2">
                              {slots.map((slot, slotIndex) => {
                                // Extract just the start time for comparison
                                const startTime = slot.split('-')[0].trim();
                                const timingKey = `${dayData.day.toLowerCase()}-${startTime}`;
                                const isSelected = Array.isArray(workplace.timeSlots) && 
                                  workplace.timeSlots.some(ts => ts.toLowerCase() === timingKey.toLowerCase());
                                
                                console.log('Checking slot:', {
                                  day: dayData.day,
                                  slot: slot,
                                  timingKey: timingKey,
                                  workplaceTimeSlots: workplace.timeSlots,
                                  isSelected: isSelected
                                });

                                return (
                                  <label
                                    key={slotIndex}
                                    className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors ${
                                      isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => handleTimingSelection(index, dayData.day, slot)}
                                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-600">
                                      {formatTimeSlot(slot)}
                                    </span>
                                  </label>
                                );
                              })}
                              {slots.length === 0 && (
                                <p className="text-sm text-gray-500 italic">No slots available</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDoctorForm; 