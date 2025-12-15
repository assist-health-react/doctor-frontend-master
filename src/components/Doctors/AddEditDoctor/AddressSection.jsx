import Select from 'react-select';

const AddressSection = ({ 
  formData, 
  handleAddressChange,
  regionOptions,
  handlePincodeChange
}) => {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <h4 className="text-base font-medium text-gray-900 mb-3">Address Information</h4>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            value={formData.address.street}
            onChange={(e) => handleAddressChange('street', e.target.value)}
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
              value={formData.address.pincode}
              onChange={(e) => {
                handlePincodeChange(e);
                handleAddressChange('pincode', e.target.value);
              }}
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
              isDisabled={!formData.address.pincode || regionOptions.length === 0}
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
              onChange={(e) => handleAddressChange('city', e.target.value)}
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
              onChange={(e) => handleAddressChange('state', e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              required
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSection; 