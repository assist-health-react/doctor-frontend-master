import { useState, useEffect } from 'react'
import { FaTimes, FaUpload, FaImage, FaSignature, FaPlus } from 'react-icons/fa'
import Select from 'react-select'
import { languageOptions, areaOptions, formatTime } from './utils'
import { doctorsService } from '../../services/doctorsService'
import { useSnackbar } from '../../contexts/SnackbarContext'

// Add speciality options
const specialityOptions = [
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'dermatology', label: 'Dermatology' },
  { value: 'endocrinology', label: 'Endocrinology' },
  { value: 'gastroenterology', label: 'Gastroenterology' },
  { value: 'general_medicine', label: 'General Medicine' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'oncology', label: 'Oncology' },
  { value: 'ophthalmology', label: 'Ophthalmology' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'psychiatry', label: 'Psychiatry' },
  { value: 'pulmonology', label: 'Pulmonology' },
  { value: 'urology', label: 'Urology' },
  { value: 'gynecology', label: 'Gynecology' },
  { value: 'ent', label: 'ENT' },
  { value: 'dental', label: 'Dental' },
  { value: 'physiotherapy', label: 'Physiotherapy' },
  { value: 'ayurveda', label: 'Ayurveda' },
  { value: 'homeopathy', label: 'Homeopathy' },
  { value: 'other', label: 'Other' }
];

const AddEditDoctor = ({ onClose, initialData, isEditing, onSuccess }) => {
  const { showSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    gender: initialData?.gender || '',
    speciality: initialData?.speciality || [],
    qualification: initialData?.qualification || [],
    medicalCouncilRegistrationNumber: initialData?.medicalCouncilRegistrationNumber || '',
    experienceYears: initialData?.experienceYears || '',
    languagesSpoken: initialData?.languagesSpoken || [],
    serviceTypes: initialData?.serviceTypes || [],
    areas: initialData?.areas || [],
    introduction: initialData?.introduction || '',
    onlineConsultationTimeSlots: initialData?.onlineConsultationTimeSlots || [],
    offlineConsultationTimeSlots: initialData?.offlineConsultationTimeSlots || [],
    profilePicture: initialData?.profilePicture || null,
    signature: initialData?.signature || null,
    address: initialData?.address || {
      street: '',
      landmark: '',
      pincode: '',
      region: '',
      city: '',
      state: '',
      country: 'India'
    }
  });

  // Add state for managing time slots
  const [onlineTimeSlots, setOnlineTimeSlots] = useState(
    initialData?.onlineConsultationTimeSlots || []
  );
  const [offlineTimeSlots, setOfflineTimeSlots] = useState(
    initialData?.offlineConsultationTimeSlots || []
  );

  const [profilePreview, setProfilePreview] = useState(initialData?.profilePicture || null);
  const [signaturePreview, setSignaturePreview] = useState(initialData?.signature || null);
  const [regionOptions, setRegionOptions] = useState([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);

  const [areaSearchTerm, setAreaSearchTerm] = useState('');
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);

  // Add useEffect to handle body scroll lock
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleQualificationChange = (e) => {
    const qualifications = e.target.value.split('\n').filter(q => q.trim() !== '')
    setFormData(prev => ({ ...prev, qualification: qualifications }))
  }

  const handleLanguageChange = (language) => {
    setFormData(prev => {
      const isSelected = prev.languagesSpoken.includes(language);
      return {
        ...prev,
        languagesSpoken: isSelected
          ? prev.languagesSpoken.filter(lang => lang !== language)
          : [...prev.languagesSpoken, language]
      };
    });
  };

  const handleServiceTypeChange = (type) => {
    setFormData(prev => {
      const isSelected = prev.serviceTypes.includes(type);
      const updatedServiceTypes = isSelected 
        ? prev.serviceTypes.filter(t => t !== type) 
        : [...prev.serviceTypes, type];

      return {
        ...prev,
        serviceTypes: updatedServiceTypes,
        [`${type}ConsultationTimeSlots`]: isSelected ? [] : [{ day: 'Monday', from: '09:00', to: '17:00' }]
      };
    });
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  // Add days of the week array
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // Function to handle adding time slots
  const handleAddTimeSlot = (type) => {
    // Get existing days for the selected type
    const existingSlots = type === 'online' ? onlineTimeSlots : offlineTimeSlots;
    const existingDays = existingSlots.map(slot => slot.day.toLowerCase());
    
    // Find the first day that's not already added
    const nextDay = daysOfWeek.find(day => !existingDays.includes(day));
    
    if (!nextDay) {
      showSnackbar('All days of the week have been added', 'info');
      return;
    }

    const newSlot = {
      day: nextDay,
      slots: []
    };

    if (type === 'online') {
      setOnlineTimeSlots(prev => [...prev, newSlot]);
    } else {
      setOfflineTimeSlots(prev => [...prev, newSlot]);
    }
  };

  // Function to handle adding time to a slot
  const handleAddTimeToSlot = (type, dayIndex, startTime, endTime) => {
    // Validate time range
    if (!startTime || !endTime) {
      showSnackbar('Please select both start and end times', 'error');
      return;
    }

    // Convert times to comparable format
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);

    if (start >= end) {
      showSnackbar('End time must be after start time', 'error');
      return;
    }

    const timeString = `${startTime} - ${endTime}`;
    
    // Check for duplicate time slots
    const existingSlots = type === 'online' ? onlineTimeSlots : offlineTimeSlots;
    const daySlots = existingSlots[dayIndex].slots || [];
    
    if (daySlots.includes(timeString)) {
      showSnackbar('This time slot already exists', 'error');
      return;
    }
    
    if (type === 'online') {
      setOnlineTimeSlots(prev => {
        const updated = [...prev];
        if (!updated[dayIndex].slots) {
          updated[dayIndex].slots = [];
        }
        updated[dayIndex].slots.push(timeString);
        return updated;
      });
    } else {
      setOfflineTimeSlots(prev => {
        const updated = [...prev];
        if (!updated[dayIndex].slots) {
          updated[dayIndex].slots = [];
        }
        updated[dayIndex].slots.push(timeString);
        return updated;
      });
    }
  };

  // Function to handle removing time from a slot
  const handleRemoveTimeFromSlot = (type, dayIndex, timeIndex) => {
    if (type === 'online') {
      setOnlineTimeSlots(prev => {
        const updated = [...prev];
        updated[dayIndex].slots.splice(timeIndex, 1);
        return updated;
      });
    } else {
      setOfflineTimeSlots(prev => {
        const updated = [...prev];
        updated[dayIndex].slots.splice(timeIndex, 1);
        return updated;
      });
    }
  };

  // Function to handle removing a day's slots
  const handleRemoveDaySlots = (type, dayIndex) => {
    if (type === 'online') {
      setOnlineTimeSlots(prev => prev.filter((_, index) => index !== dayIndex));
    } else {
      setOfflineTimeSlots(prev => prev.filter((_, index) => index !== dayIndex));
    }
  };

  // Update formData when time slots change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      onlineConsultationTimeSlots: onlineTimeSlots,
      offlineConsultationTimeSlots: offlineTimeSlots
    }));
  }, [onlineTimeSlots, offlineTimeSlots]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showSnackbar('Please upload an image file', 'error')
        return
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showSnackbar('File size should be less than 5MB', 'error')
        return
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      
      if (type === 'profile') {
        setProfilePreview(previewUrl)
        setFormData(prev => ({ ...prev, profilePicture: file }))
      } else if (type === 'signature') {
        setSignaturePreview(previewUrl)
        setFormData(prev => ({ ...prev, signature: file }))
      }
    }
  }

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (profilePreview && !initialData?.profilePicture) URL.revokeObjectURL(profilePreview)
      if (signaturePreview && !initialData?.signature) URL.revokeObjectURL(signaturePreview)
    }
  }, [])

  // Update fetchLocationDetails function to handle region options
  const fetchLocationDetails = async (pincode) => {
    try {
      setIsLoadingRegions(true);
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      
      if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        // Create region options from all post offices using Name field
        const regions = data[0].PostOffice.map(office => ({
          value: office.Name,
          label: `${office.Name} (${office.District})`
        }));
        
        // Remove duplicates
        const uniqueRegions = Array.from(new Set(regions.map(r => r.value)))
          .map(value => regions.find(r => r.value === value));
        
        setRegionOptions(uniqueRegions);

        // Update address fields with the first post office data
        const firstOffice = data[0].PostOffice[0];
        handleAddressChange('city', firstOffice.District);
        handleAddressChange('state', firstOffice.State);
      } else {
        setRegionOptions([]);
        showSnackbar('No regions found for this pincode', 'error');
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
      showSnackbar('Failed to fetch location details', 'error');
      setRegionOptions([]);
    } finally {
      setIsLoadingRegions(false);
    }
  };

  const handlePincodeChange = (e) => {
    const pincode = e.target.value;
    handleAddressChange('pincode', pincode);
    
    if (pincode.length === 6) {
      fetchLocationDetails(pincode);
    } else {
      setRegionOptions([]);
      handleAddressChange('region', '');
      handleAddressChange('city', '');
      handleAddressChange('state', '');
    }
  };

  const handleRegionChange = (selectedOptions) => {
    const pincode = formData.address.pincode;
    if (!pincode) {
      showSnackbar('Please enter a pincode first', 'error');
      return;
    }

    const newAreas = selectedOptions.map(option => ({
      pincode,
      region: option.value,
      _id: option.value // Using region as _id for now, will be replaced by backend
    }));

    setFormData(prev => ({
      ...prev,
      areas: newAreas
    }));
  };

  const handleSpecialityChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      speciality: selectedOptions || []
    }));
  };

  const handleServiceAreaChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      areas: selectedOptions || []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.gender || 
          !formData.qualification.length || !formData.medicalCouncilRegistrationNumber || 
          !formData.languagesSpoken.length || !formData.serviceTypes.length || 
          !formData.introduction || !formData.experienceYears || !formData.speciality.length) {
        throw new Error('Please fill in all required fields');
      }

      // Validate service areas for offline consultation
      if (formData.serviceTypes.includes('offline') && formData.areas.length === 0) {
        throw new Error('Please select at least one service area for offline consultation');
      }

      // Validate time slots if service types are selected
      if (formData.serviceTypes.includes('online') && formData.onlineConsultationTimeSlots.length === 0) {
        throw new Error('Please add at least one online consultation time slot');
      }
      if (formData.serviceTypes.includes('offline') && formData.offlineConsultationTimeSlots.length === 0) {
        throw new Error('Please add at least one offline consultation time slot');
      }

      // Format time slots according to API requirements
      const formatTimeSlots = (slots) => {
        const groupedSlots = slots.reduce((acc, slot) => {
          const day = slot.day.toLowerCase();
          const timeSlot = `${slot.from} | ${slot.to}`;
          
          const existingDay = acc.find(d => d.day === day);
          if (existingDay) {
            existingDay.slots.push(timeSlot);
          } else {
            acc.push({
              day,
              slots: [timeSlot]
            });
          }
          return acc;
        }, []);
        
        return groupedSlots;
      };

      // Upload files if they exist
      let profilePicUrl = null;
      let digitalSignatureUrl = null;

      try {
        if (formData.profilePicture instanceof File) {
          console.log('Uploading profile picture...');
          profilePicUrl = await doctorsService.uploadMedia(formData.profilePicture);
          console.log('Profile picture uploaded:', profilePicUrl);
        }
        if (formData.signature instanceof File) {
          console.log('Uploading signature...');
          digitalSignatureUrl = await doctorsService.uploadMedia(formData.signature);
          console.log('Signature uploaded:', digitalSignatureUrl);
        }
      } catch (uploadError) {
        console.error('Error uploading files:', uploadError);
        throw new Error(`Failed to upload files: ${uploadError.message}`);
      }

      // Prepare the data object according to API requirements
      const data = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        qualification: formData.qualification,
        medicalCouncilRegistrationNumber: formData.medicalCouncilRegistrationNumber,
        experienceYears: parseInt(formData.experienceYears),
        languagesSpoken: formData.languagesSpoken,
        serviceTypes: formData.serviceTypes,
        specializations: formData.speciality.map(s => s.value),
        introduction: formData.introduction,
        onlineConsultationTimeSlots: formData.serviceTypes.includes('online') 
          ? formatTimeSlots(formData.onlineConsultationTimeSlots) 
          : [],
        offlineConsultationTimeSlots: formData.serviceTypes.includes('offline') 
          ? formatTimeSlots(formData.offlineConsultationTimeSlots) 
          : [],
        offlineAddress: formData.serviceTypes.includes('offline') ? {
          description: formData.address.street,
          landmark: formData.address.landmark,
          region: formData.address.region,
          state: formData.address.state,
          pinCode: formData.address.pincode,
          country: formData.address.country
        } : null,
        areas: formData.areas.map(area => ({
          pincode: area.pincode,
          region: area.region,
          areaName: area.region // Using region as areaName since we're using post office names
        })),
        profilePic: profilePicUrl,
        digitalSignature: digitalSignatureUrl
      };

      console.log('Submitting doctor data:', data);

      let response;
      if (isEditing) {
        response = await doctorsService.updateDoctor(initialData._id, data);
        console.log('Update response:', response);
      } else {
        response = await doctorsService.createDoctor(data);
        console.log('Create response:', response);
      }

      if (response && response.status === 'success') {
        showSnackbar(isEditing ? 'Doctor updated successfully!' : 'Doctor added successfully!', 'success');
        if (typeof onSuccess === 'function') {
          onSuccess();
        } else if (typeof onClose === 'function') {
        onClose();
        }
      } else {
        throw new Error(response?.message || (isEditing ? 'Failed to update doctor' : 'Failed to add doctor'));
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      showSnackbar(error.message || (isEditing ? 'Failed to update doctor' : 'Failed to add doctor'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter areas based on search term
  const filteredAreas = areaOptions.filter(area =>
    area.label.toLowerCase().includes(areaSearchTerm.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-xl p-6 lg:p-8 w-[95%] max-w-5xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">
            {isEditing ? 'Edit Doctor' : 'Add New Doctor'}
          </h3>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit(e);
          }} 
          className="space-y-6"
        >
          {/* File Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Profile Picture Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-24 h-24 border-2 border-gray-300 border-dashed rounded-lg overflow-hidden">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FaImage className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <FaUpload className="mr-2 -ml-1 h-5 w-5 text-gray-400" />
                    Upload Photo
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'profile')}
                    />
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Signature Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Signature
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-24 h-24 border-2 border-gray-300 border-dashed rounded-lg overflow-hidden">
                  {signaturePreview ? (
                    <img
                      src={signaturePreview}
                      alt="Signature preview"
                      className="w-full h-full object-contain bg-white"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FaSignature className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <FaUpload className="mr-2 -ml-1 h-5 w-5 text-gray-400" />
                    Upload Signature
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'signature')}
                    />
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speciality *
              </label>
              <Select
                value={formData.speciality}
                onChange={handleSpecialityChange}
                options={specialityOptions}
                isMulti
                isSearchable
                isClearable
                placeholder="Select Specialities"
                className="react-select-container"
                classNamePrefix="react-select"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                Experience (Years) *
              </label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Council Registration Number *
              </label>
              <input
                type="text"
                name="medicalCouncilRegistrationNumber"
                value={formData.medicalCouncilRegistrationNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Service Areas */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Areas
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.address.pincode}
                    onChange={(e) => {
                      handlePincodeChange(e);
                      handleAddressChange('pincode', e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter 6-digit pincode"
                    maxLength="6"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Region
                  </label>
                  <Select
                    isMulti
                    options={regionOptions}
                    onChange={handleRegionChange}
                    isLoading={isLoadingRegions}
                    value={formData.areas.map(area => ({
                      value: area.region,
                      label: area.region
                    }))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Display selected areas */}
              {formData.areas.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Areas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.areas.map((area, index) => (
                      <div
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        <span>{area.pincode} - {area.region}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              areas: prev.areas.filter((_, i) => i !== index)
                            }));
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Qualifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qualifications * (One per line)
            </label>
            <textarea
              name="qualification"
              value={formData.qualification.join('\n')}
              onChange={handleQualificationChange}
              rows="3"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Languages Spoken *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-gray-300 rounded-lg">
              {languageOptions.map(language => (
                <button
                  key={language}
                  type="button"
                  onClick={() => handleLanguageChange(language)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    formData.languagesSpoken.includes(language)
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>

          {/* Service Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Types *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.serviceTypes.includes('online')}
                  onChange={() => handleServiceTypeChange('online')}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span>Online Consultation</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.serviceTypes.includes('offline')}
                  onChange={() => handleServiceTypeChange('offline')}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span>Offline Consultation</span>
              </label>
            </div>
          </div>

          {/* Address Information - Show only when offline service is selected */}
          {formData.serviceTypes.includes('offline') && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-base font-medium text-gray-900 mb-3">Address Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={formData.address.landmark}
                    onChange={(e) => handleAddressChange('landmark', e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Near hospital, school, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      value={formData.address.pincode}
                      onChange={(e) => {
                        handlePincodeChange(e);
                        handleAddressChange('pincode', e.target.value);
                      }}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      maxLength="6"
                      pattern="[0-9]{6}"
                      placeholder="Enter 6-digit PIN code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Region *
                    </label>
                    <Select
                      value={formData.address.region ? { value: formData.address.region, label: formData.address.region } : null}
                      onChange={(selected) => handleAddressChange('region', selected.value)}
                      options={regionOptions}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      required
                      isDisabled={!formData.address.pincode || regionOptions.length === 0}
                      placeholder="Enter PIN code to load regions"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                      required
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      value={formData.address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                      required
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Time Slots */}
          {formData.serviceTypes.includes('online') && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h5 className="text-lg font-semibold text-gray-800 mb-4">Online Consultation Time Slots</h5>
              <div className="space-y-4">
                {onlineTimeSlots.map((daySlot, dayIndex) => (
                  <div key={dayIndex} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h6 className="font-medium capitalize">{daySlot.day}</h6>
                      <button
                        type="button"
                        onClick={() => handleRemoveDaySlots('online', dayIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {daySlot.slots.map((timeSlot, timeIndex) => (
                        <div key={timeIndex} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">{timeSlot}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTimeFromSlot('online', dayIndex, timeIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2 items-center mt-2">
                  <input
                    type="time"
                          className="border rounded px-2 py-1"
                          id={`online-start-${dayIndex}`}
                  />
                        <span>to</span>
                  <input
                    type="time"
                          id={`online-end-${dayIndex}`}
                          className="border rounded px-2 py-1"
                  />
                  <button
                    type="button"
                          onClick={() => {
                            const startInput = document.getElementById(`online-start-${dayIndex}`);
                            const endInput = document.getElementById(`online-end-${dayIndex}`);
                            if (startInput && endInput && startInput.value && endInput.value) {
                              handleAddTimeToSlot('online', dayIndex, startInput.value, endInput.value);
                              startInput.value = '';
                              endInput.value = '';
                            }
                          }}
                          className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Add Time
                  </button>
                      </div>
                    </div>
                </div>
              ))}
              <button
                type="button"
                  onClick={() => handleAddTimeSlot('online')}
                  className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
              >
                  <FaPlus /> Add Day
              </button>
              </div>
            </div>
          )}

          {formData.serviceTypes.includes('offline') && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h5 className="text-lg font-semibold text-gray-800 mb-4">Offline Consultation Time Slots</h5>
              <div className="space-y-4">
                {offlineTimeSlots.map((daySlot, dayIndex) => (
                  <div key={dayIndex} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h6 className="font-medium capitalize">{daySlot.day}</h6>
                      <button
                        type="button"
                        onClick={() => handleRemoveDaySlots('offline', dayIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {daySlot.slots.map((timeSlot, timeIndex) => (
                        <div key={timeIndex} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">{timeSlot}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTimeFromSlot('offline', dayIndex, timeIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2 items-center mt-2">
                  <input
                    type="time"
                          className="border rounded px-2 py-1"
                          id={`offline-start-${dayIndex}`}
                  />
                        <span>to</span>
                  <input
                    type="time"
                          id={`offline-end-${dayIndex}`}
                          className="border rounded px-2 py-1"
                  />
                  <button
                    type="button"
                          onClick={() => {
                            const startInput = document.getElementById(`offline-start-${dayIndex}`);
                            const endInput = document.getElementById(`offline-end-${dayIndex}`);
                            if (startInput && endInput && startInput.value && endInput.value) {
                              handleAddTimeToSlot('offline', dayIndex, startInput.value, endInput.value);
                              startInput.value = '';
                              endInput.value = '';
                            }
                          }}
                          className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Add Time
                  </button>
                      </div>
                    </div>
                </div>
              ))}
              <button
                type="button"
                  onClick={() => handleAddTimeSlot('offline')}
                  className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
              >
                  <FaPlus /> Add Day
              </button>
              </div>
            </div>
          )}

          {/* Introduction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Introduction *
            </label>
            <textarea
              name="introduction"
              value={formData.introduction}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : (isEditing ? 'Save Changes' : 'Add Doctor')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditDoctor; 