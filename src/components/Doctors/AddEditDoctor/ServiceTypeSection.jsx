import { FaTimes } from 'react-icons/fa';
import Select from 'react-select';
import { useState, useEffect } from 'react';

const ServiceTypeSection = ({ 
  formData, 
  handleServiceTypeChange,
  handleServiceAreaChange,
  regionOptions,
  isLoadingRegions,
  handleRegionChange,
  handlePincodeChange
}) => {
  const [servicePincode, setServicePincode] = useState('');
  const [currentRegions, setCurrentRegions] = useState([]);

  useEffect(() => {
    // Update current regions when formData.areas changes
    if (formData.areas.length > 0) {
      const currentPincode = document.querySelector('input[name="servicePincode"]').value;
      const regions = formData.areas
        .filter(area => area.pincode === currentPincode)
        .map(area => ({
          value: area.region,
          label: area.region
        }));
      setCurrentRegions(regions);
    } else {
      setCurrentRegions([]);
    }
  }, [formData.areas]);

  const handleServicePincodeInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setServicePincode(value);
    handlePincodeChange(e);
    
    // Clear region selection when pincode changes
    if (value !== servicePincode) {
      setCurrentRegions([]);
    }
  };

  return (
    <>
      {/* Service Types */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Types *
        </label>
        <div className="flex gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.serviceTypes.includes('online')}
              onChange={() => handleServiceTypeChange('online')}
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <span>Online Consultation</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.serviceTypes.includes('offline')}
              onChange={() => handleServiceTypeChange('offline')}
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <span>Offline Consultation</span>
          </label>
        </div>
      </div>

      {/* Service Areas */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Areas
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pincode
            </label>
            <input
              type="text"
              name="servicePincode"
              value={servicePincode}
              onChange={handleServicePincodeInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter 6-digit pincode"
              maxLength="6"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <Select
              isMulti
              options={regionOptions}
              onChange={handleRegionChange}
              isLoading={isLoadingRegions}
              value={currentRegions}
              className="w-full"
            />
          </div>
        </div>

        {/* Display selected areas */}
        {formData.areas.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Areas:</h4>
            <div className="flex flex-wrap gap-2">
              {formData.areas.map((area, index) => (
                <div
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  <span>{area.pincode} - {area.region}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newAreas = formData.areas.filter((_, i) => i !== index);
                      handleServiceAreaChange(newAreas);
                      if (newAreas.length === 0) {
                        setServicePincode('');
                        setCurrentRegions([]);
                      }
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ServiceTypeSection; 