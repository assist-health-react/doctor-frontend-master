import { useState, useEffect } from 'react';
import { FaTimes, FaCamera, FaSpinner } from 'react-icons/fa';
import { membersService } from '../../../services/membersService';
import { uploadMedia } from '../../../services/mediaService';
import Select from 'react-select';
import api from '../../../services/api';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AddStudentForm = ({ isOpen, onClose, initialData = null, onSuccess }) => {
  const { schoolId, schoolData, isLoading: isLoadingSchool } = useOutletContext();
  
  useEffect(() => {
    if (isOpen) {
      console.log('AddStudentForm Data:', {
        schoolId,
        schoolData,
        grades: schoolData?.grades,
        isLoadingSchool
      });
    }
  }, [isOpen, schoolId, schoolData, isLoadingSchool]);

  const initialFormState = {
    name: '',
    dateOfBirth: '',
    gender: '',
    mobile: '',
    email: '',
    class: '',
    section: '',
    guardianName: '',
    guardianMobile: '',
    guardianRelation: '',
    bloodGroup: '',
    heightInFt: '',
    weightInKg: '',
    profilePic: '',
    address: {
      description: '',
      pinCode: '',
      region: '',
      landmark: '',
      state: '',
      country: 'India',
      location: {
        latitude: null,
        longitude: null
      }
    }
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regionOptions, setRegionOptions] = useState([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Get available classes and sections from school data
  const availableClasses = schoolData?.grades?.map(grade => ({
    value: grade.class,
    label: grade.class
  })) || [];

  const getAvailableSections = (selectedClass) => {
    if (!selectedClass || !schoolData?.grades) return [];
    
    const selectedGrade = schoolData.grades.find(g => g.class === selectedClass);
    const sections = selectedGrade?.section?.map(section => ({
      value: section.name,
      label: section.name
    })) || [];

    console.log('Available Sections for', selectedClass, ':', sections);
    return sections;
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const guardianRelations = [
    { value: 'father', label: 'Father' },
    { value: 'mother', label: 'Mother' },
    { value: 'guardian', label: 'Guardian' }
  ];

  // Handle form close
  const handleClose = () => {
    setFormData(initialFormState);
    setErrors({});
    setRegionOptions([]);
    onClose();
  };

  // Effect to populate form data when initialData changes
  useEffect(() => {
    if (initialData) {
      // Get the primary address (first address in the array)
      const primaryAddress = Array.isArray(initialData.address) && initialData.address.length > 0 
        ? initialData.address[0] 
        : null;

      setFormData({
        name: initialData.name || '',
        dateOfBirth: initialData.dob ? new Date(initialData.dob).toISOString().split('T')[0] : '',
        gender: initialData.gender || '',
        mobile: initialData.phone?.replace('+91', '') || '',
        email: initialData.email || '',
        class: initialData.studentDetails?.grade || '',
        section: initialData.studentDetails?.section || '',
        guardianName: initialData.emergencyContact?.name || '',
        guardianMobile: initialData.emergencyContact?.phone?.replace('+91', '') || '',
        guardianRelation: initialData.emergencyContact?.relation || '',
        bloodGroup: initialData.bloodGroup || '',
        heightInFt: initialData.heightInFt || '',
        weightInKg: initialData.weightInKg || '',
        profilePic: initialData.profilePic || '',
        address: {
          description: primaryAddress?.description || '',
          pinCode: primaryAddress?.pinCode || '',
          region: primaryAddress?.region || '',
          landmark: primaryAddress?.landmark || '',
          state: primaryAddress?.state || '',
          country: primaryAddress?.country || 'India',
          location: primaryAddress?.location || {
            latitude: null,
            longitude: null
          }
        }
      });

      // If there's a pincode, fetch the region options
      if (primaryAddress?.pinCode) {
        handlePincodeChange({ target: { value: primaryAddress.pinCode } });
      }
    } else {
      setFormData(initialFormState);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    // Date of Birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    // Mobile validation
    if (!formData.mobile?.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    // Email validation
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // School validation
    if (!formData.class) {
      newErrors.class = 'Class is required';
    }

    // Section validation
    if (!formData.section) {
      newErrors.section = 'Section is required';
    }

    // Blood Group validation
    if (!formData.bloodGroup) {
      newErrors.bloodGroup = 'Blood group is required';
    }

    // Optional field validations
    // Guardian Mobile validation (only if provided)
    if (formData.guardianMobile?.trim() && !/^[0-9]{10}$/.test(formData.guardianMobile.replace(/\D/g, ''))) {
      newErrors.guardianMobile = 'Please enter a valid 10-digit mobile number';
    }

    // PIN code validation (only if provided)
    if (formData.address.pinCode?.trim() && !/^[0-9]{6}$/.test(formData.address.pinCode)) {
      newErrors.pinCode = 'Please enter a valid 6-digit PIN code';
    }

    // Height validation
    if (formData.heightInFt && (isNaN(formData.heightInFt) || formData.heightInFt <= 0)) {
      newErrors.heightInFt = 'Please enter a valid height';
    }

    // Weight validation
    if (formData.weightInKg && (isNaN(formData.weightInKg) || formData.weightInKg <= 0)) {
      newErrors.weightInKg = 'Please enter a valid weight';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPEG, PNG, etc.)');
      e.target.value = '';
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert('File size should be less than 5MB');
      e.target.value = '';
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/api/v1/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Check if response has the expected structure
      if (response?.success && response?.imageUrl) {
        setFormData(prev => ({
          ...prev,
          profilePic: response.imageUrl
        }));
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error.response?.data?.message || 'Failed to upload image. Please try again.');
      e.target.value = ''; // Reset file input
    } finally {
      setIsUploadingImage(false);
    }
  };
  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (formData.profilePic && !initialData?.imageUrl) {
        URL.revokeObjectURL(formData.profilePic);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (!schoolData?._id) {
      toast.error('School information is missing');
      return;
    }

    setIsSubmitting(true);
    try {
      // Format phone numbers to ensure exactly 10 digits
      const formattedPhone = formData.mobile.replace(/\D/g, '').slice(0, 10);
      const formattedGuardianPhone = formData.guardianMobile ? formData.guardianMobile.replace(/\D/g, '').slice(0, 10) : '';

      // Prepare data for API
      const studentData = {
        isStudent: true,
        name: formData.name.trim(),
        phone: formattedPhone,
        email: formData.email.trim(),
        dob: formData.dateOfBirth,
        gender: formData.gender.toLowerCase(),
        bloodGroup: formData.bloodGroup,
        heightInFt: parseFloat(formData.heightInFt) || 0,
        weightInKg: parseFloat(formData.weightInKg) || 0,
        employmentStatus: "student",
        studentDetails: {
          schoolId: schoolData.schoolId, 
          grade: formData.class,
          section: formData.section
        }
      };

      // Only add address if any address field is filled
      if (formData.address.description || formData.address.pinCode || formData.address.landmark) {
        studentData.address = {
          description: formData.address.description.trim(),
          pinCode: formData.address.pinCode.trim(),
          region: formData.address.region.trim(),
          landmark: formData.address.landmark.trim(),
          state: formData.address.state.trim(),
          country: formData.address.country,
          location: {
            latitude: null,
            longitude: null
          }
        };
      }

      // Only add emergency contact if any contact field is filled
      if (formData.guardianName || formattedGuardianPhone || formData.guardianRelation) {
        studentData.emergencyContact = {
          name: formData.guardianName.trim(),
          relation: formData.guardianRelation,
          phone: formattedGuardianPhone
        };
      }

      // Add profile pic if available
      if (formData.profilePic) {
        studentData.profilePic = formData.profilePic;
      }

      let response;
      if (initialData?._id) {
        // Update existing student
        response = await membersService.updateMember(initialData._id, studentData);
      } else {
        // Create new student
        response = await membersService.createMember(studentData);
      }
      
      if (response.status === 'success') {
        alert(initialData ? 'Student updated successfully!' : 'Student added successfully!');
        onClose();
        if (onSuccess) onSuccess();
      } else {
        throw new Error('Failed to save student');
      }
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error(error.message || 'Error saving student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update mobile number validation to ensure exactly 10 digits
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For mobile and guardian mobile fields, restrict to 10 digits
    if (name === 'mobile' || name === 'guardianMobile' || name === 'alternateMobile') {
      const numbersOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: numbersOnly
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePincodeChange = async (e) => {
    const pinCode = e.target.value;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        pinCode
      }
    }));

    if (pinCode.length === 6) {
      setIsLoadingRegions(true);
      try {
        const responseData = await api.get(`/api/v1/common/pincode/${pinCode}`);
        console.log('Pincode API Response:', responseData);
        
        if (!responseData || !Array.isArray(responseData) || responseData.length === 0) {
          throw new Error('No data received from pincode service');
        }

        // Get the first item from the array which contains our pincode data
        const pincodeData = responseData[0];
        
        if (pincodeData?.Status === 'Success' && Array.isArray(pincodeData?.PostOffice) && pincodeData.PostOffice.length > 0) {
          const postOffices = pincodeData.PostOffice;
          
          // Create region options from all post offices
          const regions = postOffices.map(office => ({
            value: office.Name,
            label: `${office.Name}${office.Description ? ` - ${office.Description}` : ''} (${office.BranchType})`
          }));
          
          // Remove duplicates
          const uniqueRegions = Array.from(new Set(regions.map(r => r.value)))
            .map(value => regions.find(r => r.value === value));
          
          setRegionOptions(uniqueRegions);

          // Set the first post office as default
          const defaultPostOffice = postOffices[0];
          setFormData(prev => ({
            ...prev,
            address: {
              ...prev.address,
              region: defaultPostOffice.Name,
              state: defaultPostOffice.State,
              city: defaultPostOffice.District,
              country: defaultPostOffice.Country
            }
          }));
        } else {
          console.log('No valid post office data found');
          setRegionOptions([]);
          toast.error('No locations found for this pincode');
        }
      } catch (error) {
        console.error('Error fetching pincode details:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        setRegionOptions([]);
        toast.error('Failed to fetch location details. Please try again.');
      } finally {
        setIsLoadingRegions(false);
      }
    } else {
      setRegionOptions([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Form Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            {initialData ? 'Edit Student' : 'Add New Student'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Picture Section */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Profile Picture</h4>
            <div className="flex items-center space-x-6">
              <div className="relative w-32 h-32">
                {formData.profilePic ? (
                  <div className="relative w-32 h-32 rounded-full overflow-hidden">
                    <img 
                      src={formData.profilePic} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`;
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          profilePic: ''
                        }));
                      }}
                      className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-4xl text-gray-400">
                      {formData.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                {isUploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <FaSpinner className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <label className="relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="hidden"
                  />
                  <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {formData.profilePic ? 'Change Photo' : 'Upload Photo'}
                  </span>
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  JPG, PNG up to 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Student Details Section */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Student Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth*
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender*
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.gender ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number*
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.mobile ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter mobile number"
                />
                {errors.mobile && (
                  <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternate Mobile Number
                </label>
                <input
                  type="tel"
                  name="alternateMobile"
                  value={formData.alternateMobile}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.alternateMobile ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter alternate mobile number"
                />
                {errors.alternateMobile && (
                  <p className="mt-1 text-sm text-red-600">{errors.alternateMobile}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Academic Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Academic Details</h3>
            <div className="grid grid-cols-1 gap-4">
              {/* School Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School
                </label>
                <input
                  type="text"
                  value={schoolData?.name || 'Loading...'}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
              </div>

              {/* Class and Section Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Class/Grade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class/Grade <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.class ? { value: formData.class, label: formData.class } : null}
                    onChange={(selected) => {
                      setFormData(prev => ({
                        ...prev,
                        class: selected?.value || '',
                        section: '' // Reset section when class changes
                      }));
                      setErrors(prev => ({
                        ...prev,
                        class: '',
                        section: ''
                      }));
                    }}
                    options={availableClasses}
                    placeholder={isLoadingSchool ? "Loading classes..." : "Select Class"}
                    isLoading={isLoadingSchool}
                    isClearable
                    className="basic-select"
                    classNamePrefix="select"
                    isDisabled={isSubmitting}
                  />
                  {errors.class && (
                    <p className="mt-1 text-sm text-red-600">{errors.class}</p>
                  )}
                </div>

                {/* Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.section ? { value: formData.section, label: formData.section } : null}
                    onChange={(selected) => {
                      setFormData(prev => ({
                        ...prev,
                        section: selected?.value || ''
                      }));
                      setErrors(prev => ({
                        ...prev,
                        section: ''
                      }));
                    }}
                    options={getAvailableSections(formData.class)}
                    isDisabled={!formData.class || isLoadingSchool || isSubmitting}
                    placeholder={!formData.class ? "Select Class first" : isLoadingSchool ? "Loading sections..." : "Select Section"}
                    isClearable
                    className="basic-select"
                    classNamePrefix="select"
                  />
                  {errors.section && (
                    <p className="mt-1 text-sm text-red-600">{errors.section}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Address Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Description
                </label>
                <textarea
                  name="description"
                  value={formData.address.description}
                  onChange={handleAddressChange}
                  rows={3}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter complete address"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIN Code
                </label>
                <input
                  type="text"
                  name="pinCode"
                  value={formData.address.pinCode}
                  onChange={handlePincodeChange}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.pinCode ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter PIN code"
                />
                {errors.pinCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.pinCode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region
                </label>
                <Select
                  value={formData.address.region ? { value: formData.address.region, label: formData.address.region } : null}
                  onChange={(selected) => setFormData(prev => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      region: selected?.value || ''
                    }
                  }))}
                  options={regionOptions}
                  className={`w-full ${
                    errors.region ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={isLoadingRegions ? "Loading regions..." : "Select region"}
                  isLoading={isLoadingRegions}
                  isDisabled={!formData.address.pinCode || regionOptions.length === 0}
                />
                {errors.region && (
                  <p className="mt-1 text-sm text-red-600">{errors.region}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.address.landmark}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter landmark"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.address.state}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter state"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.address.country}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter country"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Guardian Details Section */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Guardian Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guardian Name
                </label>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.guardianName ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter guardian name"
                />
                {errors.guardianName && (
                  <p className="mt-1 text-sm text-red-600">{errors.guardianName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guardian Mobile
                </label>
                <input
                  type="tel"
                  name="guardianMobile"
                  value={formData.guardianMobile}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.guardianMobile ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter guardian mobile"
                />
                {errors.guardianMobile && (
                  <p className="mt-1 text-sm text-red-600">{errors.guardianMobile}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relation with Guardian
                </label>
                <Select
                  value={guardianRelations.find(relation => relation.value === formData.guardianRelation)}
                  onChange={(selected) => setFormData(prev => ({
                    ...prev,
                    guardianRelation: selected?.value || ''
                  }))}
                  options={guardianRelations}
                  className={`w-full ${
                    errors.guardianRelation ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Select relation"
                />
                {errors.guardianRelation && (
                  <p className="mt-1 text-sm text-red-600">{errors.guardianRelation}</p>
                )}
              </div>
            </div>
          </div>

          {/* Health Information Section */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Health Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group*
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.bloodGroup ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Select blood group</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
                {errors.bloodGroup && (
                  <p className="mt-1 text-sm text-red-600">{errors.bloodGroup}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (in feet)
                </label>
                <input
                  type="number"
                  name="heightInFt"
                  value={formData.heightInFt}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter height"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (in kg)
                </label>
                <input
                  type="number"
                  name="weightInKg"
                  value={formData.weightInKg}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter weight"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentForm; 