import api from './api';

export const doctorsService = {
    getProfile: async () => {
    try {
      // Get user ID from auth details
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.userId;
      
      if (!userId) {
        throw new Error('User ID not found. Please login again.');
      }

      // Use getNavigatorById endpoint
      const response = await api.get(`/api/v1/doctors/${userId}`);
      console.log('Raw API Response:', response.data);
      
      // Format the response to match expected structure
      if (response.data?.status === 'success' && response.data?.data) {
        const profileData = response.data.data;
        
        return {
          status: 'success',
          data: {
            name: profileData.name || '',
            email: profileData.email || '',
            phone: profileData.phone || '',
            dob: profileData.dob || '',
            gender: profileData.gender || '',
            profilePic: profileData.profilePic === "null" ? null : profileData.profilePic,
            isFirstLogin: profileData.isFirstLogin || false,
            passwordResetRequired: profileData.passwordResetRequired || false,
            userType: profileData.userType,
            id: profileData._id || profileData.id,
            userId: userId
          }
        };
      }
      
      throw new Error('Failed to fetch profile');
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error.response?.data || error;
    }
  },

  updateProfile: async (data) => {
    try {
      // Get user ID from auth details
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.userId;
      
      if (!userId) {
        throw new Error('User ID not found. Please login again.');
      }

      // Format the data according to API requirements
      const formattedData = {
        name: data.name,
        phoneNumber: data.phoneNumber,
        dob: data.dob,
        gender: data.gender,
        profilePic: data.profilePic
      };

      // Remove undefined fields
      Object.keys(formattedData).forEach(key => 
        formattedData[key] === undefined && delete formattedData[key]
      );

      // Use the doctors update endpoint
      const response = await api.put(`/api/v1/doctors/${userId}`, formattedData);
      
      if (response.data?.status === 'success' && response.data?.data) {
        const profileData = response.data.data;
        
        // Update user data in localStorage
        const userData = {
          ...user,
          name: profileData.name,
          email: profileData.email,
          profilePic: profileData.profilePic,
          id: profileData._id || profileData.id,
          userId: userId
        };
        localStorage.setItem('user', JSON.stringify(userData));

        return {
          status: 'success',
          data: {
            name: profileData.name || '',
            email: profileData.email || '',
            phone: profileData.phoneNumber || '',
            dob: profileData.dob || '',
            gender: profileData.gender || '',
            profilePic: profileData.profilePic === "null" ? null : profileData.profilePic,
            isFirstLogin: profileData.isFirstLogin || false,
            passwordResetRequired: profileData.passwordResetRequired || false,
            userType: profileData.userType,
            id: profileData._id || profileData.id,
            userId: userId
          }
        };
      }
      
      throw new Error('Failed to update profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error.response?.data || error;
    }
  },

  uploadProfilePic: async (formData) => {
    try {
      const response = await api.post('/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data) {
        return {
          status: 'success',
          data: response.data
        };
      }
      
      throw new Error('Failed to upload profile picture');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error.response?.data || error;
    }
  },
  getAllDoctors: async () => {
    try {
      const response = await api.get('/doctors');
      console.log('Raw API response:', response);
      
      // Handle the standard API response format
      if (response?.data?.status === 'success' && Array.isArray(response.data.data)) {
        return {
          status: 'success',
          data: response.data.data
        };
      }
      
      // If response.data is the array directly
      if (Array.isArray(response?.data)) {
        return {
          status: 'success',
          data: response.data
        };
      }
      
      console.error('Unexpected doctor response format:', response);
      return {
        status: 'error',
        data: []
      };
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return {
        status: 'error',
        data: []
      };
    }
  },

  getDoctors: async (params = {}) => {
    try {
      const { page = 1, limit = 10, search, serviceType, languages, areas } = params;
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      if (search) queryParams.append('search', search);
      if (serviceType && serviceType !== 'all') queryParams.append('serviceType', serviceType);
      if (languages?.length) queryParams.append('languages', languages.join(','));
      if (areas?.length) queryParams.append('areas', areas.join(','));
      
      const response = await api.get(`/api/v1/doctors?${queryParams.toString()}`);
      
      // Transform the response to match expected format
      if (response?.data?.status === 'success' && Array.isArray(response.data.data)) {
        return {
          status: 'success',
          data: response.data.data,
          pagination: response.data.pagination
        };
      }
      
      // If response.data is the array directly
      if (Array.isArray(response?.data)) {
        return {
          status: 'success',
          data: response.data,
          pagination: response.data.pagination || {
            total: response.data.length,
            page: page,
            pages: Math.ceil(response.data.length / limit),
            limit: limit
          }
        };
      }
      
      throw new Error('Invalid response structure from API');
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  },

  getDoctorById: async (id) => {
    try {
      console.log('Fetching doctor details for ID:', id);
      const response = await api.get(`/api/v1/doctors/${id}`);
      
      // Get the actual response data (axios wraps the response in data)
      const responseData = response.data || response;
      console.log('Raw API response:', responseData);
      
      if (responseData?.status === 'success' && responseData?.data) {
        console.log('Successfully fetched doctor details:', responseData.data);
        return {
          status: 'success',
          data: responseData.data
        };
      } else {
        console.error('Invalid response structure:', responseData);
        throw new Error('Invalid response structure from doctor API');
      }
    } catch (error) {
      console.error('Get doctor by ID error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch doctor details');
    }
  },

  uploadMedia: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', file.name, file.type, file.size);

      const response = await api.post('/api/v1/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response);

      // Check if response exists and has the expected structure
      if (response && response.success && response.imageUrl) {
        console.log('Successfully uploaded file. URL:', response.imageUrl);
        return response.imageUrl;
      }

      // If we get here, the response structure is unexpected
      console.error('Unexpected response structure:', response);
      throw new Error('Invalid response structure from upload API');
    } catch (error) {
      console.error('Upload error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to upload file');
    }
  },

  createDoctor: async (doctorData) => {
    try {
      console.log('Creating doctor with data:', doctorData);
      const response = await api.post('/api/v1/doctors', doctorData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Check if the response has the expected structure
      if (response && response.status === 'success' && response.data) {
        return response;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Create doctor error:', error);
      if (error.response?.data?.message) {
        // Check for specific error messages
        const errorMessage = error.response.data.message;
        if (errorMessage.includes('already exists')) {
          throw new Error('A doctor with this email or phone number already exists. Please use different contact details.');
        }
        throw new Error(errorMessage);
      }
      throw new Error('Failed to create doctor');
    }
  },

  deleteDoctor: async (doctorId) => {
    try {
      console.log('Deleting doctor with ID:', doctorId);
      const response = await api.delete(`/api/v1/doctors/${doctorId}`);
      console.log('Delete API response:', response);
      
      if (response.status === 'success') {
        console.log('Successfully deleted doctor:', response.message);
        return response;
      } else {
        console.error('Invalid response structure:', response);
        throw new Error(response.message || 'Failed to delete doctor');
      }
    } catch (error) {
      console.error('Delete doctor error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to delete doctor');
    }
  },

  updateDoctor: async (doctorId, doctorData) => {
    try {
      console.log('Updating doctor with ID:', doctorId);
      console.log('Update data:', doctorData);
      
      const response = await api.put(`/api/v1/doctors/${doctorId}`, doctorData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Update API response:', response);
      
      if (response && response.status === 'success') {
        console.log('Successfully updated doctor:', response.message);
        return response;
      } else {
        console.error('Invalid response structure:', response);
        throw new Error(response?.message || 'Failed to update doctor');
      }
    } catch (error) {
      console.error('Update doctor error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to update doctor');
    }
  },

  assignNavigator: async (doctorId, navigatorId) => {
    try {
      console.log('Assigning navigator to doctor:', { doctorId, navigatorId });
      
      const response = await api.post(`/api/v1/doctors/${doctorId}/assign-navigator`, {
        navigatorId
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Assign navigator API response:', response);
      
      if (response && response.status === 'success') {
        console.log('Successfully assigned navigator:', response.message);
        return response;
      } else {
        console.error('Invalid response structure:', response);
        throw new Error(response?.message || 'Failed to assign navigator');
      }
    } catch (error) {
      console.error('Assign navigator error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to assign navigator');
    }
  },

  downloadProfilePdf: async (doctorId) => {
    try {
      const response = await api.get(`/api/v1/doctors/${doctorId}/profile-pdf`);
      
      if (response?.data?.status === 'success' && response?.data?.data?.s3Url) {
        return response.data.data.s3Url;
      }
      
      throw new Error('Failed to generate PDF');
    } catch (error) {
      console.error('Download profile PDF error:', error);
      throw error;
    }
  }
}; 