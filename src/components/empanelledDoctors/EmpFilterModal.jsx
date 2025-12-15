import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { empDoctorsService } from '../../services/empDoctorsService';

const EmpFilterModal = ({ isOpen, onClose, onApply, currentFilters }) => {
  const [filters, setFilters] = useState(currentFilters || {
    specialization: '',
    experience: '',
    availability: '',
    location: '',
    gender: '',
    consultationType: '',
    status: '',
    day: '',
    timeSlot: ''
  });

  const specializations = [
    'Cardiologist',
    'Dermatologist',
    'Endocrinologist',
    'Gastroenterologist',
    'General Physician',
    'Neurologist',
    'Orthopedic',
    'Pediatrician',
    'Psychiatrist',
    'Pulmonologist'
  ];

  const experienceRanges = [
    '0-5 years',
    '5-10 years',
    '10-15 years',
    '15-20 years',
    '20+ years'
  ];

  const availabilityOptions = [
    'Available',
    'Not Available',
    'On Leave'
  ];

  const consultationTypes = [
    'In-Person',
    'Online',
    'Both'
  ];

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const timeSlots = [
    'Morning (9 AM - 12 PM)',
    'Afternoon (12 PM - 4 PM)',
    'Evening (4 PM - 8 PM)'
  ];

  const handleChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = async () => {
    // Remove empty filters
    const nonEmptyFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {});

    // Map the filter values to API parameters
    const apiParams = {
      page: 1,
      limit: 10,
      sortBy: 'name',
      sortOrder: 'asc'
    };

    // Map specialization to speciality
    if (nonEmptyFilters.specialization) {
      apiParams.speciality = nonEmptyFilters.specialization.toLowerCase();
    }

    // Map gender
    if (nonEmptyFilters.gender) {
      apiParams.gender = nonEmptyFilters.gender.toLowerCase();
    }

    // Map experience range
    if (nonEmptyFilters.experience) {
      const expRange = nonEmptyFilters.experience.split('-');
      if (expRange[0] !== '') {
        apiParams.minExperience = parseInt(expRange[0]);
        if (expRange[1]?.includes('+')) {
          apiParams.maxExperience = 100; // Set a high number for 20+ years
        } else {
          apiParams.maxExperience = parseInt(expRange[1]);
        }
      }
    }

    // Map day
    if (nonEmptyFilters.day) {
      apiParams.day = nonEmptyFilters.day.toLowerCase();
    }

    // Map time slot to timeFrom and timeTo
    if (nonEmptyFilters.timeSlot) {
      const timeMapping = {
        'Morning (9 AM - 12 PM)': { from: '9:00', to: '12:00' },
        'Afternoon (12 PM - 4 PM)': { from: '12:00', to: '16:00' },
        'Evening (4 PM - 8 PM)': { from: '16:00', to: '20:00' }
      };
      
      const selectedTime = timeMapping[nonEmptyFilters.timeSlot];
      if (selectedTime) {
        apiParams.timeFrom = selectedTime.from;
        apiParams.timeTo = selectedTime.to;
      }
    }

    try {
      const response = await empDoctorsService.getAllEmpDoctors(1, apiParams);
      onApply(nonEmptyFilters, response);
    } catch (error) {
      console.error('Error fetching filtered doctors:', error);
    }
  };

  const handleReset = () => {
    setFilters({
      specialization: '',
      experience: '',
      availability: '',
      location: '',
      gender: '',
      consultationType: '',
      status: '',
      day: '',
      timeSlot: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Filter Doctors</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialization
            </label>
            <select
              value={filters.specialization}
              onChange={(e) => handleChange('specialization', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience
            </label>
            <select
              value={filters.experience}
              onChange={(e) => handleChange('experience', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any Experience</option>
              {experienceRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <select
              value={filters.availability}
              onChange={(e) => handleChange('availability', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Availability</option>
              {availabilityOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Enter location"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={filters.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Consultation Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consultation Type
            </label>
            <select
              value={filters.consultationType}
              onChange={(e) => handleChange('consultationType', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              {consultationTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Day of Week */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Day
            </label>
            <select
              value={filters.day}
              onChange={(e) => handleChange('day', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any Day</option>
              {daysOfWeek.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          {/* Time Slot */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Slot
            </label>
            <select
              value={filters.timeSlot}
              onChange={(e) => handleChange('timeSlot', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any Time</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmpFilterModal; 