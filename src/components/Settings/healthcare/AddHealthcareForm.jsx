import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaMapMarkerAlt, FaClock, FaUpload, FaImage, FaPlus, FaMinus } from 'react-icons/fa';
import { healthcareService } from '../../../services/healthcareService';
import { uploadMedia } from '../../../services/mediaService';
import Select from 'react-select';

const AddHealthcareForm = ({ initialData, onSubmit, onClose, onCancel, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    profilePic: '',
    contactNumber: '',
    email: '',
    website: '',
    address: {
      description: '',
      landmark: '',
      pinCode: '',
      region: '',
      state: '',
      city: '',
      country: 'India',
      location: {
        latitude: 0,
        longitude: 0
      }
    },
    servicesOffered: [],
    operationHours: [
      { day: 'monday', slots: [] },
      { day: 'tuesday', slots: [] },
      { day: 'wednesday', slots: [] },
      { day: 'thursday', slots: [] },
      { day: 'friday', slots: [] },
      { day: 'saturday', slots: [] },
      { day: 'sunday', slots: [] }
    ]
  });

  const [regionOptions, setRegionOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const submitLock = useRef(false);

  useEffect(() => {
    if (initialData?.profilePic) {
      setPreviewImage(initialData.profilePic);
    }
  }, [initialData]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        address: {
          description: initialData.address?.description || '',
          landmark: initialData.address?.landmark || '',
          pinCode: initialData.address?.pinCode || '',
          region: initialData.address?.region || '',
          state: initialData.address?.state || '',
          city: initialData.address?.city || '',
          country: initialData.address?.country || 'India',
          location: initialData.address?.location || { latitude: 0, longitude: 0 }
        },
        servicesOffered: initialData.servicesOffered || [],
        operationHours: initialData.operationHours || [
          { day: 'monday', slots: [] },
          { day: 'tuesday', slots: [] },
          { day: 'wednesday', slots: [] },
          { day: 'thursday', slots: [] },
          { day: 'friday', slots: [] },
          { day: 'saturday', slots: [] },
          { day: 'sunday', slots: [] }
        ]
      });

      if (initialData.address?.pinCode) {
        handlePincodeChange({ target: { value: initialData.address.pinCode } });
      }
    }
  }, [initialData]);

  const [newService, setNewService] = useState('');
  const [timeInputs, setTimeInputs] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setPreviewImage(URL.createObjectURL(file));

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
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      profilePic: ''
    }));
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleServiceKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (newService.trim()) {
        setFormData(prev => ({
          ...prev,
          servicesOffered: [...prev.servicesOffered, newService.trim()]
        }));
        setNewService('');
      }
    }
  };

  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      servicesOffered: prev.servicesOffered.filter((_, i) => i !== index)
    }));
  };

  const handleTimeInputChange = (dayIndex, field, value) => {
    setTimeInputs(prev => ({
      ...prev,
      [`${dayIndex}-${field}`]: value
    }));
  };

  const handleAddTime = (dayIndex) => {
    const startTime = timeInputs[`${dayIndex}-start`];
    const endTime = timeInputs[`${dayIndex}-end`];

    if (startTime && endTime) {
      const timeString = `${startTime} - ${endTime}`;
      const existingSlots = formData.operationHours[dayIndex].slots || [];
      
      if (existingSlots.includes(timeString)) {
        return;
      }

      setFormData(prev => ({
        ...prev,
        operationHours: prev.operationHours.map((hour, index) => {
          if (index === dayIndex) {
            return {
              ...hour,
              slots: [...hour.slots, timeString]
            };
          }
          return hour;
        })
      }));

      setTimeInputs(prev => ({
        ...prev,
        [`${dayIndex}-start`]: '',
        [`${dayIndex}-end`]: ''
      }));
    }
  };

  const handleRemoveTimeFromSlot = (dayIndex, timeIndex) => {
    setFormData(prev => ({
      ...prev,
      operationHours: prev.operationHours.map((hour, index) => {
        if (index === dayIndex) {
          return {
            ...hour,
            slots: hour.slots.filter((_, i) => i !== timeIndex)
          };
        }
        return hour;
      })
    }));
  };

  const handleRemoveDaySlots = (dayIndex) => {
    setFormData(prev => ({
      ...prev,
      operationHours: prev.operationHours.map((hour, index) => {
        if (index === dayIndex) {
          return {
            ...hour,
            slots: []
          };
        }
        return hour;
      })
    }));
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

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    handleAddressChange('pinCode', pincode);
    
    if (pincode.length === 6) {
      try {
        const response = await healthcareService.getRegionsByPincode(pincode);
        if (response.status === 'success' && response.data) {
          setRegionOptions(response.data.regions);
          
          if (response.data.state) {
            handleAddressChange('state', response.data.state);
          }
          if (response.data.city) {
            handleAddressChange('city', response.data.city);
          }
        } else {
          setError('Invalid response from server');
        }
      } catch (error) {
        console.error('Error fetching regions:', error);
        setError('Failed to fetch region information. Please try again.');
        setRegionOptions([]);
      }
    } else {
      setRegionOptions([]);
    }
  };

  const handleClose = () => {
    if (isEditMode && onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting || submitLock.current) {
      return;
    }

    setIsSubmitting(true);
    submitLock.current = true;
    setError(null);

    try {
      if (!formData.name || !formData.type) {
        throw new Error('Name and type are required fields');
      }

      const cleanData = {
        name: formData.name,
        type: formData.type,
        profilePic: formData.profilePic,
        contactNumber: formData.contactNumber,
        email: formData.email,
        website: formData.website,
        address: {
          description: formData.address.description,
          landmark: formData.address.landmark,
          pinCode: formData.address.pinCode,
          region: formData.address.region,
          state: formData.address.state,
          country: formData.address.country,
          location: formData.address.location
        },
        servicesOffered: formData.servicesOffered,
        operationHours: formData.operationHours.map(day => ({
          day: day.day,
          slots: day.slots || []
        }))
      };

      let response;
      if (isEditMode && initialData?._id) {
        response = await healthcareService.updateHealthcareProvider(initialData._id, cleanData);
      } else {
        response = await healthcareService.createHealthcareProvider(cleanData);
      }
      
      if (response?.status === 'success') {
        if (onSubmit) {
          await onSubmit(response.data);
        }
        handleClose();
      } else {
        throw new Error(response?.message || `Failed to ${isEditMode ? 'update' : 'create'} healthcare provider`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} healthcare provider:`, error);
      setError(error.message || `Failed to ${isEditMode ? 'update' : 'add'} healthcare provider`);
    } finally {
      setIsSubmitting(false);
      submitLock.current = false;
    }
  };

  useEffect(() => {
    return () => {
      submitLock.current = false;
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEditMode ? 'Edit Healthcare Provider' : 'Add Healthcare Provider'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-base font-medium text-gray-900 mb-3">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="hospital">Hospital</option>
                  <option value="clinic">Clinic</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="laboratory">Laboratory</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-24 h-24 border-2 border-gray-300 border-dashed rounded-lg overflow-hidden">
                  {previewImage ? (
                    <img
                      src={previewImage}
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
                    {isUploading ? 'Uploading...' : 'Upload Photo'}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                      ref={fileInputRef}
                    />
                  </label>
                  {previewImage && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="ml-2 px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Remove
                    </button>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-base font-medium text-gray-900 mb-3">Address Information</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.address.description}
                  onChange={(e) => handleAddressChange('description', e.target.value)}
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
                    value={formData.address.pinCode}
                    onChange={handlePincodeChange}
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
                    isDisabled={!formData.address.pinCode || regionOptions.length === 0}
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
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    required
                    readOnly
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    value="India"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    required
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-base font-medium text-gray-900 mb-3">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter contact number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="example@domain.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>
          </div>

          {/* Services Offered */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-base font-medium text-gray-900 mb-3">Services Offered</h4>
            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyDown={handleServiceKeyDown}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type service name and press Enter"
                />
                <div className="flex flex-wrap gap-2">
                  {formData.servicesOffered.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                    >
                      <span className="text-sm">{service}</span>
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Press Enter to add a service
              </p>
            </div>
          </div>

          {/* Operation Hours */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-base font-medium text-gray-900 mb-3">Operation Hours</h4>
            <div className="space-y-4">
              {formData.operationHours.map((day, dayIndex) => (
                <div key={day.day} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium text-gray-700 capitalize">{day.day}</h5>
                    <button
                      type="button"
                      onClick={() => handleRemoveDaySlots(dayIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-2">
                    {day.slots.map((slot, slotIndex) => (
                      <div key={slotIndex} className="flex items-center gap-2">
                        <span className="px-3 py-1.5 bg-gray-100 rounded-lg">{slot}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTimeFromSlot(dayIndex, slotIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FaMinus size={16} />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        type="time"
                        value={timeInputs[`${dayIndex}-start`] || ''}
                        onChange={(e) => handleTimeInputChange(dayIndex, 'start', e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="time"
                        value={timeInputs[`${dayIndex}-end`] || ''}
                        onChange={(e) => handleTimeInputChange(dayIndex, 'end', e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddTime(dayIndex)}
                        className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update' : 'Add Healthcare Provider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHealthcareForm; 