import React from 'react';
import Select from 'react-select';
import TextInput from '../shared/TextInput';

const emergencyContactRelations = [
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'guardian', label: 'Guardian' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'other', label: 'Other' },
  { value: 'son', label: 'Son' },
  { value: 'daughter', label: 'Daughter' }
];

const EmergencyContactSection = ({ formData, setFormData }) => {
  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    
    // Handle phone number formatting
    if (name === 'phone') {
      const formattedPhone = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          phone: formattedPhone
        }
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [name]: value
      }
    }));
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="text-lg font-medium text-gray-700 mb-4">Emergency Contact</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TextInput
          label="Name"
          name="name"
          value={formData.emergencyContact.name}
          onChange={handleEmergencyContactChange}
          required
          placeholder="Emergency contact name"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relation *
          </label>
          <Select
            value={emergencyContactRelations.find(option => option.value === formData.emergencyContact.relation)}
            onChange={(selected) => setFormData(prev => ({
              ...prev,
              emergencyContact: {
                ...prev.emergencyContact,
                relation: selected?.value || ''
              }
            }))}
            options={emergencyContactRelations}
            placeholder="Select relation..."
            className="react-select-container"
            classNamePrefix="react-select"
            isRequired
          />
        </div>

        <TextInput
          label="Phone"
          name="phone"
          value={formData.emergencyContact.phone}
          onChange={handleEmergencyContactChange}
          required
          type="tel"
          placeholder="Enter 10-digit phone number"
          pattern="[0-9]{10}"
        />
      </div>
    </div>
  );
};

export default EmergencyContactSection; 