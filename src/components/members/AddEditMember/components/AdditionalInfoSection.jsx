import React from 'react';

const AdditionalInfoSection = ({ formData, setFormData }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="text-lg font-medium text-gray-700 mb-4">Additional Information</h4>
      <div>
        <textarea
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleInputChange}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[100px]"
          placeholder="Enter any additional information about the member..."
        />
      </div>
    </div>
  );
};

export default AdditionalInfoSection; 