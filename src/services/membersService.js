import api from './api';

export const membersService = {
  getMembers: async (params = {}) => {
    try {
      // Build query string for pagination, search and filters
      const queryParams = new URLSearchParams();
      
      // Required params
      queryParams.append('isStudent', params.isStudent === true);
      queryParams.append('sortBy', params.sortBy || 'createdAt');
      queryParams.append('sortOrder', params.sortOrder || 'asc');
      queryParams.append('page', params.page || 1);
      queryParams.append('limit', params.limit || 10);
      
      // Navigator ID should be first in the query string
      if (params.navigatorId) {
        queryParams.delete('navigatorId'); // Remove if exists
        queryParams.append('navigatorId', params.navigatorId);
      }
      
      // Optional filter params - only append if they have values
      if (params.search) queryParams.append('search', params.search);
      if (params.doctorId) queryParams.append('doctorId', params.doctorId);
      if (params.nurseId) queryParams.append('nurseId', params.nurseId);
      if (params.schoolId) queryParams.append('schoolId', params.schoolId);
      if (params.grade) queryParams.append('grade', params.grade);
      if (params.section) queryParams.append('section', params.section);
      if (params.isSubprofile !== undefined) queryParams.append('isSubprofile', params.isSubprofile);
      if (params.maritalStatus) queryParams.append('maritalStatus', params.maritalStatus);
      if (params.educationLevel) queryParams.append('educationLevel', params.educationLevel);
      if (params.from_date) queryParams.append('from_date', params.from_date);
      if (params.to_date) queryParams.append('to_date', params.to_date);
      
      const url = `/api/v1/members?${queryParams.toString()}`;
      console.log('Fetching members with URL:', url);
      
      const response = await api.get(url);
      console.log('Raw members API response:', response);

      // Get the actual response data (axios wraps the response in data)
      const responseData = response.data || response;

      // Ensure response has the correct structure
      if (responseData?.status === 'success') {
        return {
          status: 'success',
          data: responseData.data || [],
          pagination: responseData.pagination || {
            total: 0,
            page: 1,
            pages: 1
          }
        };
      }

      throw new Error(responseData?.message || 'Failed to fetch members');
    } catch (error) {
      console.error('Error fetching members:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  getMemberById: async (id) => {
    try {
      if (!id) {
        throw new Error('Member ID is required');
      }

      console.log('Fetching member with ID:', id);
      const response = await api.get(`/api/v1/members/${id}`);
      
      console.log('Raw API response:', response);

      // Get the actual response data (axios wraps the response in data)
      const responseData = response.data || response;

      // Check if response exists and has data
      if (responseData?.status === 'success' && responseData?.data) {
        // Transform profilePic field if it's "null"
        const memberData = {
          ...responseData.data,
          profilePic: responseData.data.profilePic === "null" ? null : responseData.data.profilePic,
          // Keep the original address array
          address: responseData.data.address,
          // Ensure student-specific fields are present
          memberId: responseData.data.memberId || responseData.data._id,
          educationLevel: responseData.data.educationLevel || null,
          section: responseData.data.section || null,
          schoolId: responseData.data.schoolId || null,
          // Ensure healthcareTeam fields are properly structured
          healthcareTeam: {
            navigator: responseData.data.healthcareTeam?.navigator || null,
            doctor: responseData.data.healthcareTeam?.doctor || null,
            nurse: responseData.data.healthcareTeam?.nurse || null
          }
        };

        return {
          status: 'success',
          data: memberData
        };
      }

      throw new Error('No data received from API');
    } catch (error) {
      console.error('Error fetching member by ID:', error);
      throw {
        status: 'error',
        message: error.response?.data?.message || error.message || 'Failed to fetch member details',
        error: error
      };
    }
  },

  createMember: async (data) => {
    try {
      console.log('[membersService] Creating member with data:', data);

      // Preserve the healthcareTeam data
      const { healthcareTeam, ...restData } = data;

      // Format the request data
      const requestData = {
        ...restData,
        // Ensure phone numbers have +91 prefix
        phone: restData.phone?.startsWith('+91') ? restData.phone : `+91${restData.phone?.replace(/\D/g, '')}`,
        emergencyContact: {
          ...restData.emergencyContact,
          phone: restData.emergencyContact?.phone?.startsWith('+91') 
            ? restData.emergencyContact.phone 
            : `+91${restData.emergencyContact.phone?.replace(/\D/g, '')}`
        },
        // Ensure address has location object
        address: {
          ...restData.address,
          location: {
            latitude: null,
            longitude: null
          }
        },
        // Use the profilePic URL directly
        profilePic: restData.profilePic || null,
        isStudent: restData.isStudent || false,
        isSubprofile: restData.isSubprofile || false,
        subprofileIds: [],
        active: true,
        // Add back the healthcareTeam if it exists
        ...(healthcareTeam && { healthcareTeam })
      };

      console.log('[membersService] Formatted request data:', requestData);

      // Send the request
      const response = await api.post('/api/v1/members', requestData);
      console.log('[membersService] Create member response:', response);

      // Get the actual response data (axios wraps the response in data)
      const responseData = response.data || response;

      if (responseData?.status === 'success' && responseData?.data) {
        // Transform profilePic field if it's "null"
        return {
          status: 'success',
          data: {
            ...responseData.data,
            profilePic: responseData.data.profilePic === "null" ? null : responseData.data.profilePic
          }
        };
      }

      throw new Error(responseData?.message || 'Failed to create member');
    } catch (error) {
      console.error('[membersService] Error creating member:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  updateMember: async (id, formData) => {
    try {
      console.log('Updating member with ID:', id);
      console.log('Update data:', formData);

      let submitData;
      let headers = {};

      if (formData instanceof FormData) {
        // Parse and clean the JSON data from FormData
        const jsonData = JSON.parse(formData.get('data'));
        console.log('Original JSON data:', jsonData);

        // Clean and format the data
        submitData = {
          ...jsonData,
          _id: id,
          // Only include phone if it's different from the current value
          phone: jsonData.phone !== formData.currentPhone ? 
            (jsonData.phone?.startsWith('+91') ? jsonData.phone : `+91${jsonData.phone}`) : 
            undefined,
          // Only include email if it's different from the current value
          email: jsonData.email !== formData.currentEmail ? jsonData.email : undefined,
          emergencyContact: {
            ...jsonData.emergencyContact,
            // Only include emergency contact phone if it's different
            phone: jsonData.emergencyContact?.phone !== formData.currentEmergencyPhone ?
              (jsonData.emergencyContact?.phone?.startsWith('+91') 
                ? jsonData.emergencyContact.phone 
                : `+91${jsonData.emergencyContact.phone}`) : 
              undefined
          },
          // Format address correctly
          address: jsonData.address ? {
            _id: jsonData.address._id,
            description: jsonData.address.description,
            pinCode: jsonData.address.pinCode,
            region: jsonData.address.region,
            landmark: jsonData.address.landmark,
            state: jsonData.address.state,
            country: jsonData.address.country,
            location: {
              latitude: null,
              longitude: null
            }
          } : undefined,
          profilePic: jsonData.profilePic || null
        };

        // Create a new FormData instance
        const cleanedFormData = new FormData();
        
        // Add the cleaned JSON data
        cleanedFormData.append('data', JSON.stringify(submitData));
        
        // Add the profile picture if it exists
        if (formData.has('profilePic')) {
          cleanedFormData.append('profilePic', formData.get('profilePic'));
        }
        
        submitData = cleanedFormData;
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        submitData = {
          ...formData,
          _id: id,
          // Only include phone if it's different from the current value
          phone: formData.phone !== formData.currentPhone ? 
            (formData.phone?.startsWith('+91') ? formData.phone : `+91${formData.phone}`) : 
            undefined,
          // Only include email if it's different from the current value
          email: formData.email !== formData.currentEmail ? formData.email : undefined,
          emergencyContact: {
            ...formData.emergencyContact,
            // Only include emergency contact phone if it's different
            phone: formData.emergencyContact?.phone !== formData.currentEmergencyPhone ?
              (formData.emergencyContact?.phone?.startsWith('+91') 
                ? formData.emergencyContact.phone 
                : `+91${formData.emergencyContact.phone}`) : 
              undefined
          },
          // Format address correctly
          address: formData.address ? {
            _id: formData.address._id,
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
          } : undefined,
          profilePic: formData.profilePic || null
        };
        headers['Content-Type'] = 'application/json';
      }

      console.log('Submitting update data:', submitData);
      const response = await api.put(`/api/v1/members/${id}`, submitData, { headers });
      console.log('Update member response:', response);

      // Get the actual response data (axios wraps the response in data)
      const responseData = response.data || response;

      // Check if response has the expected format
      if (responseData?.status === 'success' && responseData?.data) {
        return {
          status: 'success',
          data: {
            ...responseData.data,
            profilePic: responseData.data.profilePic === "null" ? null : responseData.data.profilePic
          }
        };
      }

      throw new Error(responseData?.message || 'Failed to update member');
    } catch (error) {
      console.error('Error updating member:', error);
      throw {
        status: 'error',
        message: error.response?.data?.message || error.message || 'Failed to update member'
      };
    }
  },

  deleteMember: async (id) => {
    try {
      console.log('Deleting member with ID:', id);
      
      const response = await api.delete(`/api/v1/members/${id}`);
      console.log('Delete member response:', response);

      // Get the actual response data from the Axios response
      const responseData = response.data;

      // Check if the response has the expected format
      if (responseData && responseData.status === 'success') {
        return {
          status: 'success',
          message: responseData.message || 'Member deleted successfully'
        };
      } else {
        throw new Error(responseData?.message || 'Failed to delete member');
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      
      // Handle different error scenarios
      if (error.response?.status === 404) {
        throw {
          status: 'error',
          message: 'Student not found. They may have already been deleted.'
        };
      } else if (error.response?.status === 403) {
        throw {
          status: 'error',
          message: 'You do not have permission to delete this student.'
        };
      } else {
        throw {
          status: 'error',
          message: error.response?.data?.message || error.message || 'Failed to delete member'
        };
      }
    }
  },

  assignNavigator: async (memberIds, navigatorId) => {
    try {
      console.log('Assigning navigator to members:', { memberIds, navigatorId });
      const response = await api.patch('/api/v1/members/assign/navigator', {
        memberIds,
        navigatorId
      });
      
      if (response.status === 'success') {
        return response;
      } else {
        throw new Error(response.message || 'Failed to assign navigator');
      }
    } catch (error) {
      console.error('Error assigning navigator:', error);
      throw error;
    }
  },

  assignDoctor: async (memberIds, doctorId) => {
    try {
      console.log('Assigning doctor to members:', { memberIds, doctorId });
      const { data: response } = await api.patch('/api/v1/members/assign/doctor', {
        memberIds,
        doctorId
      });
      
      if (response?.status === 'success') {
        return response;
      } else {
        throw new Error(response?.message || 'Failed to assign doctor');
      }
    } catch (error) {
      console.error('Error assigning doctor:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  assignNurse: async (memberIds, nurseId) => {
    try {
      console.log('Assigning nurse to members:', { memberIds, nurseId });
      const response = await api.patch('/api/v1/members/assign/nurse', {
        memberIds,
        nurseId
      });
      
      if (response.status === 'success') {
        return response;
      } else {
        throw new Error(response.message || 'Failed to assign nurse');
      }
    } catch (error) {
      console.error('Error assigning nurse:', error);
      throw error;
    }
  },

  bulkUpload: async (formData) => {
    try {
      console.log('Uploading members in bulk');
      const response = await api.post('/api/v1/members/bulk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.status === 'success') {
        return response;
      } else {
        throw new Error(response.message || 'Failed to upload members');
      }
    } catch (error) {
      console.error('Error uploading members:', error);
      throw error;
    }
  },

  bulkUploadStudents: async (formData) => {
    try {
      const response = await api.post('/api/v1/members/bulk-upload-students', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error in bulkUploadStudents:', error);
      throw error.response?.data || error;
    }
  },

  getMemberNotes: async (memberId) => {
    try {
      if (!memberId) {
        throw new Error('Member ID is required');
      }

      console.log('Fetching notes for member:', memberId);
      const response = await api.get(`/api/v1/members/${memberId}/notes`);
      
      // Get the actual response data (axios wraps the response in data)
      const responseData = response.data || response;

      // If we get a 2xx status code, consider it a success
      if (response.status >= 200 && response.status < 300) {
        return {
          status: 'success',
          data: responseData.notes || []
        };
      }

      throw new Error(responseData?.message || 'Failed to fetch member notes');
    } catch (error) {
      console.error('Error fetching member notes:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  createMemberNote: async (memberId, noteText) => {
    try {
      if (!memberId) {
        throw new Error('Member ID is required');
      }

      console.log('Creating note for member:', memberId);
      const response = await api.post(`/api/v1/members/${memberId}/notes`, {
        note: noteText
      });

      // If we get a 2xx status code, consider it a success
      if (response.status >= 200 && response.status < 300) {
        return {
          status: 'success',
          data: response.data
        };
      }

      throw new Error(response?.data?.message || 'Failed to create note');
    } catch (error) {
      console.error('Error creating note:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  updateMemberNote: async (memberId, noteId, noteText) => {
    try {
      if (!memberId || !noteId) {
        throw new Error('Member ID and Note ID are required');
      }

      console.log('Updating note for member:', memberId);
      const response = await api.patch(`/api/v1/members/${memberId}/notes/${noteId}`, {
        note: noteText
      });

      // If we get a 2xx status code, consider it a success
      if (response.status >= 200 && response.status < 300) {
        return {
          status: 'success',
          data: response.data
        };
      }

      throw new Error(response?.data?.message || 'Failed to update note');
    } catch (error) {
      console.error('Error updating note:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  deleteMemberNote: async (memberId, noteId) => {
    try {
      if (!memberId || !noteId) {
        throw new Error('Member ID and Note ID are required');
      }

      console.log('Deleting note for member:', memberId);
      const response = await api.delete(`/api/v1/members/${memberId}/notes/${noteId}`);

      // If we get a 2xx status code, consider it a success
      if (response.status >= 200 && response.status < 300) {
        return {
          status: 'success',
          message: 'Note deleted successfully'
        };
      }

      throw new Error(response?.data?.message || 'Failed to delete note');
    } catch (error) {
      console.error('Error deleting note:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  downloadMembershipCard: async (memberId) => {
    try {
      if (!memberId) {
        throw new Error('Member ID is required');
      }

      console.log('Downloading membership card for member:', memberId);
      const response = await api.get(`/api/v1/members/${memberId}/membership-card`);
      
      // Get the actual response data
      const responseData = response.data || response;

      if (responseData?.status === 'success' && responseData?.data?.s3Url) {
        // Open the S3 URL in a new tab
        window.open(responseData.data.s3Url, '_blank');
        return {
          status: 'success',
          message: 'Membership card opened successfully'
        };
      }

      throw new Error(responseData?.message || 'Failed to download membership card');
    } catch (error) {
      console.error('Error downloading membership card:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
};

export default membersService; 