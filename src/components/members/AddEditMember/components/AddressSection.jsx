import React from 'react';
import Select from 'react-select';
import TextInput from '../shared/TextInput';
import { useSnackbar } from '../../../../contexts/SnackbarContext';

const AddressSection = ({ 
  formData, 
  setFormData, 
  regionOptions, 
  setRegionOptions,
  isLoadingRegions,
  setIsLoadingRegions 
}) => {
  const { showSnackbar } = useSnackbar();

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    
    // Update pincode in form data
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        pinCode: pincode // Note: using pinCode instead of pincode to match the API
      }
    }));

    // Only fetch location details if pincode is 6 digits
    if (pincode.length === 6) {
      setIsLoadingRegions(true);
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        
        if (data[0].Status === 'Success') {
          const postOffices = data[0].PostOffice;
          
          // Set region options
          const options = postOffices.map(po => ({
            value: po.Name,
            label: po.Name
          }));
          setRegionOptions(options);
          
          // Auto-fill state
          if (postOffices.length > 0) {
            setFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                state: postOffices[0].State,
                country: 'India',
                pinCode: pincode // Ensure pincode is set in the correct format
              }
            }));
          }
        } else {
          showSnackbar('Invalid PIN code. Please check and try again.', 'error');
          setRegionOptions([]);
          // Clear state when PIN is invalid
          setFormData(prev => ({
            ...prev,
            address: {
              ...prev.address,
              state: '',
              region: ''
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching location details:', error);
        showSnackbar('Error fetching location details. Please try again.', 'error');
      } finally {
        setIsLoadingRegions(false);
      }
    } else {
      setRegionOptions([]);
      // Clear state when PIN is incomplete
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          state: '',
          region: ''
        }
      }));
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Address Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          label="Address"
          name="description"
          value={formData.address?.description || ''}
          onChange={handleAddressChange}
          required
          className="md:col-span-2"
          placeholder="Enter complete address"
        />
        
        <TextInput
          label="Landmark"
          name="landmark"
          value={formData.address?.landmark || ''}
          onChange={handleAddressChange}
          placeholder="Enter nearby landmark (optional)"
        />
        
        <TextInput
          label="PIN Code"
          name="pinCode"
          value={formData.address?.pinCode || ''}
          onChange={handlePincodeChange}
          required
          type="text"
          pattern="[0-9]*"
          maxLength={6}
          placeholder="Enter 6-digit PIN code"
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Region *
          </label>
          <Select
            value={
              formData.address?.region
                ? { value: formData.address.region, label: formData.address.region }
                : null
            }
            onChange={(option) => {
              setFormData(prev => ({
                ...prev,
                address: {
                  ...prev.address,
                  region: option?.value || ''
                }
              }));
            }}
            options={regionOptions}
            isLoading={isLoadingRegions}
            isDisabled={!formData.address?.pinCode || formData.address.pinCode.length !== 6}
            placeholder="Select region"
            className="w-full"
          />
        </div>
        
        <TextInput
          label="State"
          name="state"
          value={formData.address?.state || ''}
          onChange={handleAddressChange}
          required
          readOnly
          className="bg-gray-50"
          placeholder="State will be auto-filled based on PIN code"
        />
        
        <TextInput
          label="Country"
          name="country"
          value={formData.address?.country || 'India'}
          onChange={handleAddressChange}
          required
          readOnly
          className="bg-gray-50"
          placeholder="India"
        />
      </div>
    </div>
  );
};

export default AddressSection; 