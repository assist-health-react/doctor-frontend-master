import { useState, useEffect } from 'react';
import { FaTimes, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import membersService from '../../../services/membersService';
import { navigatorsService } from '../../../services/navigatorsService';
import BasicInfoSection from './components/BasicInfoSection';
import PersonalHistorySection from './components/PersonalHistorySection';
import AddressSection from './components/AddressSection';
import EmergencyContactSection from './components/EmergencyContactSection';
import AdditionalInfoSection from './components/AdditionalInfoSection';
import ProfilePictureSection from './components/ProfilePictureSection';

const AddEditMember = ({ onClose, onSubmit, initialData = null, isEditing = false, mainMembers = [] }) => {
  const { showSnackbar } = useSnackbar();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    heightInFt: '',
    weightInKg: '',
    employmentStatus: '',
    educationLevel: '',
    maritalStatus: '',
    additionalInfo: '',
    isSubprofile: false,
    primaryMemberId: null,
    profilePic: null,
    address: {
      description: '',
      pinCode: '',
      region: '',
      landmark: '',
      state: '',
      country: 'India',
      location: {
        latitude: null,
        longitude: null
      }
    },
    emergencyContact: {
      name: '',
      relation: '',
      phone: ''
    },
    subscriptions: [{
      planType: 'BASE_PLAN',
      startDate: new Date().toISOString(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      status: 'active'
    }],
    addons: [],
    active: true,
    isStudent: false,
    subprofileIds: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [regionOptions, setRegionOptions] = useState([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [parentMembers, setParentMembers] = useState([]);
  const [isLoadingParentMembers, setIsLoadingParentMembers] = useState(false);
  const [isFetchingMember, setIsFetchingMember] = useState(false);

  // Get current user from localStorage when component mounts
  useEffect(() => {
    const fetchNavigatorDetails = async () => {
      try {
        const userStr = localStorage.getItem('user');
        console.log('[Navigator Setup] User data from localStorage:', userStr);
        
        if (userStr) {
          const user = JSON.parse(userStr);
          console.log('[Navigator Setup] Parsed user data:', user);
          
          if (user && user.userType === 'navigator' && user.userId) {
            try {
              // First try to get complete details from API
              const response = await navigatorsService.getNavigatorById(user.userId);
              console.log('[Navigator Setup] Navigator API response:', response);
              
              if (response?.status === 'success' && response.data) {
                const navigatorData = response.data;
                const formattedUser = {
                  _id: user.userId,
                  name: navigatorData.name || user.name || '',
                  email: navigatorData.email || user.email || '',
                  phone: navigatorData.phone || user.phoneNumber || '',
                  profilePic: navigatorData.profilePic || null,
                  navigatorId: navigatorData.navigatorId || user.userId
                };
                console.log('[Navigator Setup] Setting formatted navigator user from API:', formattedUser);
                setCurrentUser(formattedUser);
              } else {
                throw new Error('Invalid response from navigator API');
              }
            } catch (apiError) {
              console.error('[Navigator Setup] Error fetching navigator details from API:', apiError);
              // Fallback to localStorage data
              const formattedUser = {
                _id: user.userId,
                name: user.name || '',
                email: user.email || '',
                phone: user.phoneNumber || '',
                profilePic: null,
                navigatorId: user.userId
              };
              console.log('[Navigator Setup] Setting fallback navigator user from localStorage:', formattedUser);
              setCurrentUser(formattedUser);
            }
          } else {
            console.log('[Navigator Setup] User is not a navigator or missing required fields:', user?.userType);
          }
        } else {
          console.log('[Navigator Setup] No user data found in localStorage');
        }
      } catch (err) {
        console.error('[Navigator Setup] Error in navigator setup:', err);
      }
    };

    fetchNavigatorDetails();
  }, []);

  // Fetch member details when in edit mode
  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (!isEditing || !initialData?._id) return;

      setIsFetchingMember(true);
      try {
        const response = await membersService.getMemberById(initialData._id);
        if (response?.status === 'success' && response.data) {
          const memberData = response.data;
          const formattedPhone = memberData.phone?.replace('+91', '') || '';
          const formattedEmergencyPhone = memberData.emergencyContact?.phone?.replace('+91', '') || '';
          const formattedDob = memberData.dob ? new Date(memberData.dob).toISOString().split('T')[0] : '';
          
          // Get the first address from the address array
          const primaryAddress = memberData.address && Array.isArray(memberData.address) && memberData.address.length > 0 
            ? memberData.address[0] 
            : null;

          setFormData({
            ...memberData,
            phone: formattedPhone,
            emergencyContact: {
              ...memberData.emergencyContact,
              phone: formattedEmergencyPhone
            },
            address: primaryAddress ? {
              _id: primaryAddress._id,
              description: primaryAddress.description || '',
              pinCode: primaryAddress.pinCode || '',
              region: primaryAddress.region || '',
              landmark: primaryAddress.landmark || '',
              state: primaryAddress.state || '',
              country: primaryAddress.country || 'India',
              location: primaryAddress.location || { latitude: null, longitude: null }
            } : {
              description: '',
              pinCode: '',
              region: '',
              landmark: '',
              state: '',
              country: 'India',
              location: { latitude: null, longitude: null }
            },
            dob: formattedDob,
            profilePic: memberData.profilePic || null,
            profilePicUrl: memberData.profilePic || null
          });
        } else {
          throw new Error('Failed to fetch member details');
        }
      } catch (error) {
        console.error('Error fetching member details:', error);
        showSnackbar('Failed to fetch member details. Please try again.', 'error');
        onClose(); // Close the modal if we can't fetch the member details
      } finally {
        setIsFetchingMember(false);
      }
    };

    fetchMemberDetails();
  }, [isEditing, initialData?._id]);

  // Fetch parent members when component mounts or when isSubprofile changes
  useEffect(() => {
    if (formData.isSubprofile) {
      fetchParentMembers();
    }
  }, [formData.isSubprofile]);

  const fetchParentMembers = async () => {
    try {
      setIsLoadingParentMembers(true);
      const response = await membersService.getMembers({ 
        page: 1, 
        limit: 100,
        isSubprofile: false // Only fetch main profiles
      });
      
      if (response?.status === 'success' && Array.isArray(response.data)) {
        const memberOptions = response.data.map(member => ({
          value: member._id,
          label: `${member.name} (${member.phone || 'No phone'})`
        }));
        setParentMembers(memberOptions);
      } else {
        console.error('Invalid response structure:', response);
        showSnackbar('Failed to fetch parent members', 'error');
      }
    } catch (error) {
      console.error('Error fetching parent members:', error);
      showSnackbar('Failed to fetch parent members', 'error');
    } finally {
      setIsLoadingParentMembers(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const submitData = { ...formData };
      delete submitData.profilePicUrl;

      if (!submitData.isSubprofile) {
        delete submitData.primaryMemberId;
      }

      // Format the address object correctly
      const addressData = {
        description: formData.address.description,
        pinCode: formData.address.pinCode,
        region: formData.address.region,
        landmark: formData.address.landmark,
        state: formData.address.state,
        country: formData.address.country,
        location: {
          latitude: null,
          longitude: null
        }
      };

      // Only include _id in the address if it exists
      if (formData.address._id) {
        addressData._id = formData.address._id;
      }

      submitData.address = addressData;

      // Format phone numbers - strip any existing +91 prefix first
      const cleanedPhone = formData.phone?.replace(/^\+91/, '').replace(/\D/g, '');
      submitData.phone = cleanedPhone ? `+91${cleanedPhone}` : '';

      const cleanedEmergencyPhone = formData.emergencyContact?.phone?.replace(/^\+91/, '').replace(/\D/g, '');
      submitData.emergencyContact = {
        ...formData.emergencyContact,
        phone: cleanedEmergencyPhone ? `+91${cleanedEmergencyPhone}` : ''
      };

      // Only include personal history fields if they have values
      if (!submitData.employmentStatus) delete submitData.employmentStatus;
      if (!submitData.educationLevel) delete submitData.educationLevel;
      if (!submitData.maritalStatus) delete submitData.maritalStatus;
      if (!submitData.bloodGroup) delete submitData.bloodGroup;

      // Add navigator details if available
      console.log('[Submit] Current user before adding to payload:', currentUser);
      
      if (currentUser && currentUser._id) {
        submitData.healthcareTeam = {
          navigator: {
            _id: {
              _id: currentUser._id,
              name: currentUser.name || '',
              email: currentUser.email,
              phone: currentUser.phone,
              profilePic: currentUser.profilePic || null,
              navigatorId: currentUser.navigatorId
            },
            name: currentUser.name || '',
            assignedDate: new Date().toISOString()
          }
        };
        console.log('[Submit] Added navigator details to payload:', submitData.healthcareTeam);
      } else {
        console.log('[Submit] No navigator details available to add to payload');
      }

      console.log('[Submit] Final submit data:', submitData);

      // Validation
      const errors = validateFormData(submitData);
      if (errors.length > 0) {
        setError(errors.join('\n'));
        setLoading(false);
        return;
      }

      if (isEditing) {
        const memberId = initialData._id || initialData.id;
        if (!memberId) {
          throw new Error('Member ID is required for update');
        }
        
        if (onSubmit) {
          onSubmit(submitData);
        }
        onClose();
        return;
      } else {
        console.log('[Submit] Calling membersService.createMember with data:', submitData);
        const response = await membersService.createMember(submitData);
        console.log('[Submit] Create member response:', response);
        
        if (response?.status === 'success' && response.data) {
          showSnackbar('Member added successfully!', 'success');
          if (onSubmit) {
            // Pass the response data to parent instead of submitting again
            onSubmit(response.data);
          }
          onClose();
          return;
        } else {
          throw new Error(response?.message || 'Failed to create member');
        }
      }
    } catch (error) {
      console.error('[Submit] Error creating/updating member:', error);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.details?.join('\n')
        || error.message 
        || `Failed to ${isEditing ? 'update' : 'create'} member. Please try again.`;
      
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateFormData = (data) => {
    const errors = [];
    const name = data.name?.trim();
    const email = data.email?.trim().toLowerCase();
    const phone = data.phone?.replace(/^\+91/, '').replace(/\D/g, '');
    const gender = data.gender?.toLowerCase();
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) errors.push('Name is required');
    if (!email || !emailRegex.test(email)) errors.push('Please provide a valid email');
    if (!phone || !phoneRegex.test(phone)) errors.push('Please provide a valid 10-digit phone number');
    if (!gender || !['male', 'female', 'other'].includes(gender)) errors.push('Invalid gender');
    if (!data.dob) errors.push('Date of birth is required');

    const emergencyContact = {
      name: data.emergencyContact?.name?.trim(),
      relation: data.emergencyContact?.relation?.trim(),
      phone: data.emergencyContact?.phone?.replace(/^\+91/, '').replace(/\D/g, '')
    };

    if (!emergencyContact.name) errors.push('Emergency contact name is required');
    if (!emergencyContact.relation) errors.push('Emergency contact relation is required');
    if (!emergencyContact.phone || !phoneRegex.test(emergencyContact.phone)) {
      errors.push('Please provide a valid 10-digit emergency contact phone number');
    }

    if (data.isSubprofile && !data.primaryMemberId) {
      errors.push('Please select a parent member');
    }

    return errors;
  };

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    
    // Update pincode in form data
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        pincode
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
          
          // Auto-fill city and state
          if (postOffices.length > 0) {
            setFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                city: postOffices[0].District,
                state: postOffices[0].State,
                country: 'India'
              }
            }));
          }
        } else {
          showSnackbar('Invalid PIN code. Please check and try again.', 'error');
          setRegionOptions([]);
        }
      } catch (error) {
        console.error('Error fetching location details:', error);
        showSnackbar('Error fetching location details. Please try again.', 'error');
      } finally {
        setIsLoadingRegions(false);
      }
    } else {
      setRegionOptions([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">
            {isEditing ? 'Edit Member' : 'Add New Member'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <FaExclamationCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {isFetchingMember ? (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-3 text-gray-600">Loading member details...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <ProfilePictureSection 
              formData={formData}
              setFormData={setFormData}
              isUploadingImage={isUploadingImage}
              setIsUploadingImage={setIsUploadingImage}
              setError={setError}
            />

            <BasicInfoSection 
              formData={formData}
              setFormData={setFormData}
              isEditing={isEditing}
              parentMembers={parentMembers}
              isLoadingParentMembers={isLoadingParentMembers}
            />

            <PersonalHistorySection 
              formData={formData}
              setFormData={setFormData}
            />

            <AddressSection 
              formData={formData}
              setFormData={setFormData}
              regionOptions={regionOptions}
              setRegionOptions={setRegionOptions}
              isLoadingRegions={isLoadingRegions}
              setIsLoadingRegions={setIsLoadingRegions}
            />

            <EmergencyContactSection 
              formData={formData}
              setFormData={setFormData}
            />

            <AdditionalInfoSection 
              formData={formData}
              setFormData={setFormData}
            />

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{isEditing ? 'Save Changes' : 'Add Member'}</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddEditMember; 