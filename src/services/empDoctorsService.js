import api from './api';

export const empDoctorsService = {
  getAllEmpDoctors: async (page = 1, filters = {}) => {
    try {
      let url = `/api/v1/emp-doctors?page=${page}`;
      
      // Add filters to URL if they exist
      if (Object.keys(filters).length > 0) {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
        url += `&${queryParams.toString()}`;
      }

      const response = await api.get(url);
      console.log('Raw API response:', response);
      
      // Handle the standard API response format
      if (response?.data?.status === 'success') {
        return {
          status: 'success',
          data: response.data.data || [],
          pagination: response.data.pagination
        };
      }
      
      // If response.data is the array directly
      if (Array.isArray(response?.data)) {
        return {
          status: 'success',
          data: response.data,
          pagination: {
            total: response.data.length,
            page: page,
            limit: 10
          }
        };
      }
      
      throw new Error('Invalid response structure from API');
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  },

  getEmpDoctorById: async (id) => {
    try {
      const response = await api.get(`/api/v1/emp-doctors/${id}`);
      
      if (response?.status === 'success' && response?.data) {
        return response;
      }
      throw new Error('Invalid response structure from API');
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Doctor not found');
      }
      throw error;
    }
  },

  createEmpDoctor: async (data) => {
    try {
      const response = await api.post('/api/v1/emp-doctors', {
        name: data.name,
        profilePic: data.profilePic || "",
        email: data.email,
        phone: data.phone,
        gender: data.gender.toLowerCase(),
        qualification: data.qualification,
        experienceInYrs: parseInt(data.experienceInYrs),
        speciality: data.speciality,
        specializedIn: data.specializedIn,
        workplaces: data.workplaces.map(workplace => ({
          providerId: workplace.providerId,
          type: workplace.type,
          name: workplace.name,
          consultationFees: parseInt(workplace.consultationFees),
          timeSlots: workplace.timeSlots
        }))
      });
      
      if (response?.status === 'success' && response?.data) {
        return response;
      }
      throw new Error('Failed to create empanelled doctor');
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  updateEmpDoctor: async (id, data) => {
    try {
      // Remove any MongoDB specific fields if they exist
      const { _id, __v, createdAt, updatedAt, ...cleanData } = data;
      
      const response = await api.put(`/api/v1/emp-doctors/${id}`, cleanData);
      
      if (response?.status === 'success') {
        return response;
      } else {
        throw new Error(response?.message || 'Failed to update empanelled doctor');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  deleteEmpDoctor: async (doctorId) => {
    try {
      await api.delete(`/api/v1/emp-doctors/${doctorId}`);
      // Since response is empty, return a success status
      return { status: 'success', message: 'Doctor deleted successfully' };
    } catch (error) {
      console.error('Error deleting doctor:', error);
      throw error.response?.data || { status: 'error', message: 'Failed to delete doctor' };
    }
  },

  // Additional utility methods

  updateEmpDoctorStatus: async (id, status) => {
    try {
      const response = await api.patch(`/api/v1/emp-doctors/${id}/status`, { status });
      
      if (response?.status === 'success') {
        return response;
      } else {
        throw new Error(response?.message || 'Failed to update doctor status');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  uploadDoctorDocument: async (id, file, documentType) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);

      const response = await api.post(`/api/v1/emp-doctors/${id}/documents`, formData);
      
      if (response?.status === 'success') {
        return response;
      } else {
        throw new Error(response?.message || 'Failed to upload document');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  getDoctorsBySpecialization: async (specialization) => {
    try {
      const response = await api.get(`/api/v1/emp-doctors/specialization/${specialization}`);
      
      if (response?.status === 'success') {
        return response;
      } else {
        throw new Error('Failed to fetch doctors by specialization');
      }
    } catch (error) {
      throw error;
    }
  },

  searchDoctors: async (params) => {
    try {
      const { search, page = 1, limit = 20, sortBy = 'experienceInYrs', sortOrder = 'desc' } = params;
      const queryParams = new URLSearchParams({
        search,
        page,
        limit,
        sortBy,
        sortOrder
      });
      
      const response = await api.get(`/api/v1/emp-doctors?${queryParams.toString()}`);
      
      if (response?.status === 'success') {
        return response;
      } else {
        throw new Error('Failed to search doctors');
      }
    } catch (error) {
      throw error;
    }
  }
};

export default empDoctorsService; 