import { useState, useEffect } from 'react';
import { FaCamera, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/authService';
import { doctorsService } from '../../services/doctorsService';
import { uploadMedia } from '../../services/mediaService';

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    newPassword: '',
    confirmPassword: '',
    photo: null,
    profilePic: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await doctorsService.getProfile();
        console.log('Profile Response:', response); // Debug log
        
        if (response?.status === 'success' && response?.data) {
          const profile = response.data;
          setFormData(prev => ({
            ...prev,
            name: profile.name || '',
            email: profile.email || '',
            phoneNumber: profile.phone || profile.phoneNumber || '',  // Handle both phone and phoneNumber
            dateOfBirth: profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : '',
            gender: profile.gender || '',
            profilePic: profile.profilePic || null,
            newPassword: '',  // Reset password fields
            confirmPassword: ''
          }));
        } else {
          throw new Error('Failed to load profile data');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to load profile information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any error messages when user starts typing
    setError('');
    setSuccess('');
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
          throw new Error('File size should not exceed 5MB');
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error('Only JPG, JPEG and PNG files are allowed');
        }
        
        // Upload the file using mediaService
        const uploadResponse = await uploadMedia(file);
        
        if (uploadResponse && uploadResponse.imageUrl) {
          // Update form data with new image URL from response.data.imageUrl
      setFormData(prev => ({
        ...prev,
            profilePic: uploadResponse.imageUrl // This will be used in the profile update API
          }));
          setSuccess('Image uploaded successfully. Click Save Changes to update your profile.');
          
          // Clear the file input
          e.target.value = '';
        } else {
          throw new Error('Failed to upload image');
        }
      } catch (err) {
        console.error('Error uploading photo:', err);
        setError(err.message || 'Failed to upload profile picture. Please try again.');
        
        // Clear the file input on error
        e.target.value = '';
      } finally {
        setIsLoading(false);
      }
    }
  };

  const validatePasswords = () => {
    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form data
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }

    // Validate passwords if being changed
    if (formData.newPassword || formData.confirmPassword) {
      if (!validatePasswords()) {
        return;
      }
    }

    setIsLoading(true);

    try {
      // Update profile information using doctorsService
      const response = await doctorsService.updateProfile({
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        dob: formData.dateOfBirth,
        gender: formData.gender,
        profilePic: formData.profilePic
      });

      if (response?.status === 'success' && response?.data) {
        // Update form data with the response
        setFormData(prev => ({
          ...prev,
          name: response.data.name || '',
          email: response.data.email || '',
          phoneNumber: response.data.phone || response.data.phoneNumber || '',  // Handle both phone and phoneNumber
          dateOfBirth: response.data.dob ? new Date(response.data.dob).toISOString().split('T')[0] : '',
          gender: response.data.gender || '',
          profilePic: response.data.profilePic || null,
          newPassword: '',  // Reset password fields
          confirmPassword: ''
        }));

        // Update local storage with consistent data structure
        const userProfile = {
          ...response.data,
          phoneNumber: response.data.phone || response.data.phoneNumber  // Handle both phone and phoneNumber
        };
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        
        // Trigger storage event for other components to update
        window.dispatchEvent(new Event('storage'));

        setSuccess('Profile updated successfully');

        // Navigate to dashboard after showing success message
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add handlePasswordReset function
  const handlePasswordReset = async () => {
    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      await resetPassword(formData.newPassword, token);
      
      // Clear password fields after successful update
        setFormData(prev => ({
          ...prev,
          newPassword: '',
          confirmPassword: ''
        }));
      
      setSuccess('Password updated successfully');
      
      // Navigate to dashboard after short delay to show success message
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Error updating password:', err);
      setError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Go back"
        >
          <FaArrowLeft className="text-gray-600 text-xl" />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800">Profile Settings</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Show success message if any */}
        {success && (
          <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm">
            {success}
          </div>
        )}

        {/* Show error message if any */}
      {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

        {/* Profile Photo */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {formData.profilePic ? (
                <img 
                  src={formData.profilePic}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = ''; // Clear the broken image
                    console.error('Failed to load profile picture');
                  }}
                />
              ) : (
                <span className="text-4xl font-bold text-gray-400">
                  {formData.name.charAt(0)}
                </span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white cursor-pointer hover:bg-blue-600 transition-colors">
              <FaCamera />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              required
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Save Changes Button moved to top section */}
          <div className="md:col-span-2 flex justify-end mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Password Change Section */}
        <div className="pt-6 border-t mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
              <input
                  type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="Enter new password"
                minLength={6}
              />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
              <input
                  type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="Confirm new password"
                minLength={6}
              />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Set Password Button */}
            <div className="md:col-span-2 flex justify-end mt-4">
              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={isLoading || !formData.newPassword || !formData.confirmPassword}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Setting Password...' : 'Set Password'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile; 