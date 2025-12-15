import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useSnackbar } from '../../../contexts/SnackbarContext'
import { doctorsService } from '../../../services/doctorsService'
import FileUploadSection from './FileUploadSection'
import BasicInfoSection from './BasicInfoSection'
import QualificationSection from './QualificationSection'
import ServiceTypeSection from './ServiceTypeSection'
import AddressSection from './AddressSection'
import TimeSlotSection from './TimeSlotSection'
import IntroductionSection from './IntroductionSection'

const AddEditDoctor = ({ onClose, initialData, isEditing, onSuccess }) => {
  const { showSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    gender: initialData?.gender || '',
    speciality: initialData?.specializations?.map(spec => ({ value: spec, label: spec })) || [],
    qualification: initialData?.qualification || [],
    medicalCouncilRegistrationNumber: initialData?.medicalCouncilRegistrationNumber || '',
    experienceYears: initialData?.experienceYears || '',
    languagesSpoken: initialData?.languagesSpoken || [],
    serviceTypes: initialData?.serviceTypes || [],
    areas: initialData?.areas?.map(area => ({
      pincode: area.pincode,
      region: area.region,
      _id: area._id || area.region
    })) || [],
    introduction: initialData?.introduction || '',
    onlineConsultationTimeSlots: initialData?.onlineConsultationTimeSlots || [],
    offlineConsultationTimeSlots: initialData?.offlineConsultationTimeSlots || [],
    profilePic: initialData?.profilePic || null,
    digitalSignature: initialData?.digitalSignature || null,
    address: initialData?.offlineAddress ? {
      street: initialData.offlineAddress.description || '',
      landmark: initialData.offlineAddress.landmark || '',
      pincode: initialData.offlineAddress.pinCode || '',
      region: initialData.offlineAddress.region || '',
      city: initialData.offlineAddress.city || '',
      state: initialData.offlineAddress.state || '',
      country: initialData.offlineAddress.country || 'India'
    } : {
      street: '',
      landmark: '',
      pincode: '',
      region: '',
      city: '',
      state: '',
      country: 'India'
    }
  });

  // Update the formatTimeSlots function
  const formatTimeSlots = (slots) => {
    return slots.map(slot => ({
      day: slot.day.toLowerCase(),
      slots: slot.slots.map(timeSlot => {
        // Handle both formats: "HH:mm - HH:mm" and "HH:mm | HH:mm"
        const [start, end] = timeSlot.includes('|') 
          ? timeSlot.split('|').map(t => t.trim())
          : timeSlot.split('-').map(t => t.trim());
        return `${start} | ${end}`;
      })
    }));
  };

  // Update the initial state for time slots
  const [onlineTimeSlots, setOnlineTimeSlots] = useState(
    initialData?.onlineConsultationTimeSlots?.map(slot => ({
      day: slot.day,
      slots: slot.slots.map(timeSlot => {
        const [start, end] = timeSlot.split('|').map(t => t.trim());
        return `${start} - ${end}`;
      })
    })) || []
  );

  const [offlineTimeSlots, setOfflineTimeSlots] = useState(
    initialData?.offlineConsultationTimeSlots?.map(slot => ({
      day: slot.day,
      slots: slot.slots.map(timeSlot => {
        const [start, end] = timeSlot.split('|').map(t => t.trim());
        return `${start} - ${end}`;
      })
    })) || []
  );

  const [profilePreview, setProfilePreview] = useState(initialData?.profilePic || null);
  const [signaturePreview, setSignaturePreview] = useState(initialData?.digitalSignature || null);
  const [regionOptions, setRegionOptions] = useState([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);

  // Add useEffect to handle body scroll lock
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Only allow digits and limit to 10 characters
      const phoneValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: phoneValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  const handleQualificationChange = (qualifications) => {
    setFormData(prev => ({
      ...prev,
      qualification: qualifications
    }));
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

      // Initialize with empty slots array instead of a default time slot
      const updatedTimeSlots = isSelected ? [] : [{ day: 'monday', slots: [] }];

      return {
        ...prev,
        serviceTypes: updatedServiceTypes,
        [`${type}ConsultationTimeSlots`]: updatedTimeSlots
      };
    });

    // Also update the time slots state
    if (type === 'online') {
      setOnlineTimeSlots(prev => {
        const isSelected = prev.length > 0;
        return isSelected ? [] : [{ day: 'monday', slots: [] }];
      });
    } else {
      setOfflineTimeSlots(prev => {
        const isSelected = prev.length > 0;
        return isSelected ? [] : [{ day: 'monday', slots: [] }];
      });
    }
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

  // Update the handleAddTimeToSlot function
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
    
    // Check for exact duplicates
    if (daySlots.includes(timeString)) {
      showSnackbar('This time slot already exists', 'error');
      return;
    }

    // Check for overlapping time slots
    const newStart = start.getTime();
    const newEnd = end.getTime();
    
    const hasOverlap = daySlots.some(slot => {
      const [existingStart, existingEnd] = slot.split(' - ').map(time => 
        new Date(`1970-01-01T${time}`).getTime()
      );
      return (newStart >= existingStart && newStart < existingEnd) ||
             (newEnd > existingStart && newEnd <= existingEnd) ||
             (newStart <= existingStart && newEnd >= existingEnd);
    });

    if (hasOverlap) {
      showSnackbar('This time slot overlaps with an existing slot', 'error');
      return;
    }
    
    // Create a new array to avoid mutating state directly
    const updatedSlots = [...existingSlots];
    if (!updatedSlots[dayIndex].slots) {
      updatedSlots[dayIndex].slots = [];
    }
    updatedSlots[dayIndex].slots = [...updatedSlots[dayIndex].slots, timeString];
    
    if (type === 'online') {
      setOnlineTimeSlots(updatedSlots);
    } else {
      setOfflineTimeSlots(updatedSlots);
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

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showSnackbar('Please upload an image file', 'error');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      showSnackbar('File size should be less than 5MB', 'error');
      return;
    }

    try {
      // Set loading state
      if (type === 'profile') {
        setIsUploadingProfile(true);
      } else {
        setIsUploadingSignature(true);
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Upload the file
      const response = await doctorsService.uploadMedia(file);
      
      // Update form data with the uploaded URL
      if (type === 'profile') {
        setProfilePreview(previewUrl);
        setFormData(prev => ({ ...prev, profilePic: response }));
      } else if (type === 'signature') {
        setSignaturePreview(previewUrl);
        setFormData(prev => ({ ...prev, digitalSignature: response }));
      }

      showSnackbar(`${type === 'profile' ? 'Profile picture' : 'Signature'} uploaded successfully`, 'success');
    } catch (error) {
      console.error('Error uploading file:', error);
      showSnackbar(`Failed to upload ${type === 'profile' ? 'profile picture' : 'signature'}: ${error.message}`, 'error');
      
      // Clear the preview if upload fails
      if (type === 'profile') {
        setProfilePreview(null);
        setFormData(prev => ({ ...prev, profilePic: null }));
      } else {
        setSignaturePreview(null);
        setFormData(prev => ({ ...prev, digitalSignature: null }));
      }
    } finally {
      // Reset loading state
      if (type === 'profile') {
        setIsUploadingProfile(false);
      } else {
        setIsUploadingSignature(false);
      }
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (profilePreview && !initialData?.profilePic) URL.revokeObjectURL(profilePreview);
      if (signaturePreview && !initialData?.digitalSignature) URL.revokeObjectURL(signaturePreview);
    };
  }, [profilePreview, signaturePreview, initialData]);

  // Update fetchLocationDetails function to handle different sections
  const fetchLocationDetails = async (pincode, section) => {
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

        // Only update address fields if this is for the address section
        if (section === 'address') {
          const firstOffice = data[0].PostOffice[0];
          handleAddressChange('city', firstOffice.District);
          handleAddressChange('state', firstOffice.State);
        }
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

  const handleAddressPincodeChange = (e) => {
    const pincode = e.target.value;
    handleAddressChange('pincode', pincode);
    
    if (pincode.length === 6) {
      fetchLocationDetails(pincode, 'address');
    } else {
      setRegionOptions([]);
      handleAddressChange('region', '');
      handleAddressChange('city', '');
      handleAddressChange('state', '');
    }
  };

  const handleServicePincodeChange = (e) => {
    const pincode = e.target.value;
    
    if (pincode.length === 6) {
      fetchLocationDetails(pincode, 'service');
    } else {
      setRegionOptions([]);
    }
  };

  const handleServiceAreaChange = (newAreas) => {
    setFormData(prev => ({
      ...prev,
      areas: newAreas.map(area => ({
        pincode: area.pincode,
        region: area.region,
        _id: area._id || area.region
      }))
    }));
  };

  const handleRegionChange = (selectedOptions) => {
    const currentPincode = formData.areas.length > 0 ? formData.areas[0].pincode : '';
    const selectedPincode = document.querySelector('input[name="servicePincode"]').value;
    
    // Get existing areas that don't have the current pincode
    const existingAreas = formData.areas.filter(area => area.pincode !== selectedPincode);
    
    // Add new areas with the current pincode
    const newAreas = selectedOptions.map(option => ({
      pincode: selectedPincode,
      region: option.value,
      _id: option.value
    }));

    // Combine existing areas with new areas
    setFormData(prev => ({
      ...prev,
      areas: [...existingAreas, ...newAreas]
    }));
  };

  const handleSpecialityChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      speciality: selectedOptions || []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);

      // Validation checks
      if (!formData.name?.trim()) {
        throw new Error('Name is required');
      }

      if (!formData.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Please provide a valid email');
      }

      if (!formData.phone?.trim() || formData.phone.length !== 10) {
        throw new Error('Please provide a valid 10-digit phone number');
      }

      if (!formData.gender) {
        throw new Error('Please select a gender');
      }

      if (!formData.speciality?.length) {
        throw new Error('Please select at least one speciality');
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
      const formattedTimeSlots = formatTimeSlots(formData.onlineConsultationTimeSlots);

      // Format phone number with +91 prefix if not already present
      const formattedPhone = formData.phone.startsWith('+91') ? formData.phone : `+91${formData.phone}`;

      // Prepare the data object according to API requirements
      const data = {
        name: formData.name,
        email: formData.email,
        phone: formattedPhone,
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
          areaName: area.region
        })),
        profilePic: formData.profilePic,
        digitalSignature: formData.digitalSignature
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

      // Check if response exists and has a success status
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
      // Show the error message in a more user-friendly way
      const errorMessage = error.message.includes('already exists') 
        ? 'A doctor with this email or phone number already exists. Please use different contact details.'
        : error.message || 'Failed to add doctor. Please try again.';
      showSnackbar(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <FileUploadSection
            profilePreview={profilePreview}
            signaturePreview={signaturePreview}
            handleFileChange={handleFileChange}
            isUploadingProfile={isUploadingProfile}
            isUploadingSignature={isUploadingSignature}
          />

          <BasicInfoSection
            formData={formData}
            handleInputChange={handleInputChange}
            handleSpecialityChange={handleSpecialityChange}
          />

          <QualificationSection
            formData={formData}
            handleQualificationChange={handleQualificationChange}
            handleLanguageChange={handleLanguageChange}
          />

          <ServiceTypeSection
            formData={formData}
            handleServiceTypeChange={handleServiceTypeChange}
            handleServiceAreaChange={handleServiceAreaChange}
            regionOptions={regionOptions}
            isLoadingRegions={isLoadingRegions}
            handleRegionChange={handleRegionChange}
            handlePincodeChange={handleServicePincodeChange}
          />

          {formData.serviceTypes.includes('offline') && (
            <AddressSection
              formData={formData}
              handleAddressChange={handleAddressChange}
              regionOptions={regionOptions}
              handlePincodeChange={handleAddressPincodeChange}
            />
          )}

          {formData.serviceTypes.includes('online') && (
            <TimeSlotSection
              type="online"
              timeSlots={onlineTimeSlots}
              handleAddTimeSlot={handleAddTimeSlot}
              handleAddTimeToSlot={handleAddTimeToSlot}
              handleRemoveTimeFromSlot={handleRemoveTimeFromSlot}
              handleRemoveDaySlots={handleRemoveDaySlots}
            />
          )}

          {formData.serviceTypes.includes('offline') && (
            <TimeSlotSection
              type="offline"
              timeSlots={offlineTimeSlots}
              handleAddTimeSlot={handleAddTimeSlot}
              handleAddTimeToSlot={handleAddTimeToSlot}
              handleRemoveTimeFromSlot={handleRemoveTimeFromSlot}
              handleRemoveDaySlots={handleRemoveDaySlots}
            />
          )}

          <IntroductionSection
            formData={formData}
            handleInputChange={handleInputChange}
          />

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