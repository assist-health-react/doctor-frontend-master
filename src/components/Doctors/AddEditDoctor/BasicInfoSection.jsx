import Select from 'react-select';
import { specialityOptions } from './constants';

const BasicInfoSection = ({ 
  formData, 
  handleInputChange, 
  handleSpecialityChange 
}) => {
  return (
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
        <div className="flex">
          <span className="inline-flex items-center px-3 py-2.5 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg">
            +91
          </span>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            pattern="[0-9]{10}"
            maxLength="10"
            placeholder="Enter 10-digit phone number"
            title="Please enter a valid 10-digit phone number"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">Enter a 10-digit phone number</p>
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
    </div>
  );
};

export default BasicInfoSection; 