import api from './api';

export const navigatorsService = {
  // getProfile: async () => {
  //   try {
  //     // Get user ID from auth details
  //     const user = JSON.parse(localStorage.getItem('user') || '{}');
  //     const userId = user.userId;
      
  //     if (!userId) {
  //       throw new Error('User ID not found. Please login again.');
  //     }

  //     // Use getNavigatorById endpoint
  //     const response = await api.get(`/api/v1/navigators/${userId}`);
  //     console.log('Raw API Response:', response.data);
      
  //     // Format the response to match expected structure
  //     if (response.data?.status === 'success' && response.data?.data) {
  //       const profileData = response.data.data;
        
  //       return {
  //         status: 'success',
  //         data: {
  //           name: profileData.name || '',
  //           email: profileData.email || '',
  //           phone: profileData.phone || '',
  //           dob: profileData.dob || '',
  //           gender: profileData.gender || '',
  //           profilePic: profileData.profilePic === "null" ? null : profileData.profilePic,
  //           isFirstLogin: profileData.isFirstLogin || false,
  //           passwordResetRequired: profileData.passwordResetRequired || false,
  //           userType: profileData.userType,
  //           id: profileData._id || profileData.id,
  //           userId: userId
  //         }
  //       };
  //     }
      
  //     throw new Error('Failed to fetch profile');
  //   } catch (error) {
  //     console.error('Error fetching profile:', error);
  //     throw error.response?.data || error;
  //   }
  // },

  // updateProfile: async (data) => {
  //   try {
  //     // Get user ID from auth details
  //     const user = JSON.parse(localStorage.getItem('user') || '{}');
  //     const userId = user.userId;
      
  //     if (!userId) {
  //       throw new Error('User ID not found. Please login again.');
  //     }

  //     // Format the data according to API requirements
  //     const formattedData = {
  //       name: data.name,
  //       phoneNumber: data.phoneNumber,
  //       dob: data.dob,
  //       gender: data.gender,
  //       profilePic: data.profilePic
  //     };

  //     // Remove undefined fields
  //     Object.keys(formattedData).forEach(key => 
  //       formattedData[key] === undefined && delete formattedData[key]
  //     );

  //     // Use the navigators update endpoint
  //     const response = await api.put(`/api/v1/navigators/${userId}`, formattedData);
      
  //     if (response.data?.status === 'success' && response.data?.data) {
  //       const profileData = response.data.data;
        
  //       // Update user data in localStorage
  //       const userData = {
  //         ...user,
  //         name: profileData.name,
  //         email: profileData.email,
  //         profilePic: profileData.profilePic,
  //         id: profileData._id || profileData.id,
  //         userId: userId
  //       };
  //       localStorage.setItem('user', JSON.stringify(userData));

  //       return {
  //         status: 'success',
  //         data: {
  //           name: profileData.name || '',
  //           email: profileData.email || '',
  //           phone: profileData.phoneNumber || '',
  //           dob: profileData.dob || '',
  //           gender: profileData.gender || '',
  //           profilePic: profileData.profilePic === "null" ? null : profileData.profilePic,
  //           isFirstLogin: profileData.isFirstLogin || false,
  //           passwordResetRequired: profileData.passwordResetRequired || false,
  //           userType: profileData.userType,
  //           id: profileData._id || profileData.id,
  //           userId: userId
  //         }
  //       };
  //     }
      
  //     throw new Error('Failed to update profile');
  //   } catch (error) {
  //     console.error('Error updating profile:', error);
  //     throw error.response?.data || error;
  //   }
  // },

  // uploadProfilePic: async (formData) => {
  //   try {
  //     const response = await api.post('/api/v1/upload', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
      
  //     if (response.data) {
  //       return {
  //         status: 'success',
  //         data: response.data
  //       };
  //     }
      
  //     throw new Error('Failed to upload profile picture');
  //   } catch (error) {
  //     console.error('Error uploading profile picture:', error);
  //     throw error.response?.data || error;
  //   }
  // },

  getNavigators: async (params = {}) => {
    try {
      const { page = 1, limit = 10, search, role = 'navigator' } = params;
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      queryParams.append('role', role);
      
      if (search) queryParams.append('search', search);
      
      const response = await api.get(`/api/v1/navigators?${queryParams.toString()}`);
      
      // Format the response to match expected structure
      if (response.data) {
        return {
          status: 'success',
          data: Array.isArray(response.data) ? response.data : [response.data],
          pagination: {
            total: response.data.length || 0,
            page: page,
            pages: Math.ceil((response.data.length || 0) / limit),
            limit: limit
          }
        };
      }
      
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Error fetching navigators:', error);
      throw error.response?.data || error;
    }
  },

  getNavigatorById: async (id) => {
    try {
      const response = await api.get(`/api/v1/navigators/${id}`);
      
      if (response.data?.status === 'success' && response.data?.data) {
        return {
          status: 'success',
          data: response.data.data
        };
      }
      
      throw new Error('Navigator not found');
    } catch (error) {
      console.error('Error fetching navigator details:', error);
      throw error.response?.data || error;
    }
  },

  createNavigator: async (data) => {
    try {
      // Create the request data
      const requestData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        dob: data.dob,
        gender: data.gender,
        languagesSpoken: data.languagesSpoken,
        introduction: data.introduction
      };

      // If there's a profile picture, handle it separately
      if (data.profilePic instanceof File) {
        const formData = new FormData();
        formData.append('profilePic', data.profilePic);
        
        // First upload the profile picture
        const uploadResponse = await api.post('/api/v1/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // If upload successful, add the URL to the request data
        if (uploadResponse?.data?.url) {
          requestData.profilePic = uploadResponse.data.url;
        }
      }

      // Send the data as JSON
      const response = await api.post('/api/v1/navigators', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Format the response to match expected structure
      if (response.data) {
        return {
          status: 'success',
          data: {
            ...response.data,
            profilePic: response.data.profilePic === "null" ? null : response.data.profilePic
          }
        };
      }

      throw new Error('Failed to create navigator');
    } catch (error) {
      console.error('Error creating navigator:', error);
      throw error.response?.data || error;
    }
  }
}; 