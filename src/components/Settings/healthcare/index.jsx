import React from 'react';
import HealthcareList from './HealthcareList';

const HealthcareManagement = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => window.history.back()}
          className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="flex-1 ml-4">
          <h2 className="text-xl font-semibold text-gray-800">Healthcare Providers</h2>
        </div>
      </div>
      <HealthcareList />
    </div>
  );
};

export default HealthcareManagement; 