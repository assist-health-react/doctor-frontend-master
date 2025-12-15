import React from 'react';

const PersonalHistorySection = ({ formData, setFormData }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="text-lg font-medium text-gray-700 mb-4">Personal History</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employment Status
          </label>
          <select
            name="employmentStatus"
            value={formData.employmentStatus}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Status</option>
            <option value="employed">Employed</option>
            <option value="unemployed">Unemployed</option>
            <option value="self_employed">Self-Employed</option>
            <option value="retired">Retired</option>
            <option value="student">Student</option>
            <option value="homemaker">Homemaker</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Education Level
          </label>
          <select
            name="educationLevel"
            value={formData.educationLevel}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Level</option>
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="higher_secondary">Higher Secondary</option>
            <option value="graduate">Graduate</option>
            <option value="post_graduate">Post Graduate</option>
            <option value="doctorate">Doctorate</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marital Status
          </label>
          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PersonalHistorySection; 