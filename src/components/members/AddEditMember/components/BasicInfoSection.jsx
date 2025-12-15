import React from 'react';
import Select from 'react-select';
import TextInput from '../shared/TextInput';
import membersService from '../../../../services/membersService';

const BasicInfoSection = ({ 
  formData, 
  setFormData, 
  isEditing, 
  parentMembers, 
  isLoadingParentMembers,
  onPincodeChange 
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const formattedPhone = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: formattedPhone
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubProfileChange = (e) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      isSubprofile: checked,
      primaryMemberId: checked ? prev.primaryMemberId : null
    }));
  };

  const handleParentMemberChange = async (selected) => {
    const selectedParentId = selected?.value || null;
    
    // Always update the primaryMemberId
    setFormData(prev => ({ 
      ...prev, 
      primaryMemberId: selectedParentId
    }));

    // If a parent is selected, fetch their complete details and pre-fill only specific fields
    if (selectedParentId) {
      try {
        const response = await membersService.getMemberById(selectedParentId);
        
        if (response?.status === 'success' && response?.data) {
          const parentMember = response.data;
          
          setFormData(prev => ({
            ...prev,
            primaryMemberId: selectedParentId,
            // Keep existing fields
            name: prev.name,
            isSubprofile: true,
            // Only pre-fill email, phone and emergency contact
            email: parentMember.email || '',
            phone: parentMember.phone?.replace('+91', '') || '',
            emergencyContact: {
              name: parentMember.emergencyContact?.name || '',
              relation: parentMember.emergencyContact?.relation || '',
              phone: parentMember.emergencyContact?.phone?.replace('+91', '') || ''
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching parent member details:', error);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TextInput
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        required
      />

      {!isEditing && (
        <div className="flex flex-col space-y-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isSubprofile}
              onChange={handleSubProfileChange}
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Is this a sub profile?</span>
          </label>

          {formData.isSubprofile && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Parent Member *
              </label>
              <Select
                value={formData.primaryMemberId ? parentMembers.find(option => option.value === formData.primaryMemberId) : null}
                onChange={handleParentMemberChange}
                options={parentMembers}
                isLoading={isLoadingParentMembers}
                isClearable
                placeholder="Search parent member..."
                className="react-select-container"
                classNamePrefix="react-select"
                noOptionsMessage={() => "No members found"}
                isDisabled={isLoadingParentMembers}
              />
            </div>
          )}
        </div>
      )}

      <TextInput
        label="Email Address"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        required={!isEditing}
        type="email"
        disabled={isEditing}
      />

      <TextInput
        label="Phone Number"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        required
        type="tel"
        placeholder="Enter 10-digit phone number"
        pattern="[0-9]{10}"
      />

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
          Date of Birth *
        </label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Blood Group
        </label>
        <select
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Height (in ft)
        </label>
        <input
          type="number"
          step="0.1"
          name="heightInFt"
          value={formData.heightInFt}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Weight (in kg)
        </label>
        <input
          type="number"
          step="0.1"
          name="weightInKg"
          value={formData.weightInKg}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default BasicInfoSection; 