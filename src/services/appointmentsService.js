import api from './api';

export const appointmentsService = {
  // Get all appointments with pagination and filters
  getAppointments: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Pagination params
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Search params - can search across multiple fields
      if (params.search) queryParams.append('search', params.search); // General search term
      if (params.hospitalName) queryParams.append('hospitalName', params.hospitalName);
      if (params.hospitalAddress) queryParams.append('hospitalAddress', params.hospitalAddress);
      if (params.service) queryParams.append('service', params.service);
      if (params.specialization) queryParams.append('specialization', params.specialization);
      if (params.memberName) queryParams.append('memberName', params.memberName);
      if (params.memberEmail) queryParams.append('memberEmail', params.memberEmail);
      if (params.memberPhone) queryParams.append('memberPhone', params.memberPhone);
      
      // Status and navigator filters
      if (params.status && params.status !== 'all') queryParams.append('status', params.status);
      if (params.navigatorId) queryParams.append('navigatorId', params.navigatorId);

      const response = await api.get(`/api/v1/appointments?${queryParams}`);
      
      // Ensure response has the expected structure
      if (response?.data?.status === 'success') {
        return {
          status: 'success',
          data: response.data.data || [],
          pagination: response.data.pagination || {
            total: 0,
            page: 1,
            pages: 1
          }
        };
      }

      throw new Error(response?.data?.message || 'Failed to fetch appointments');
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw {
        status: 'error',
        message: error.response?.data?.message || error.message || 'Failed to fetch appointments',
        error: error
      };
    }
  },

  // Get single appointment by ID
  getAppointmentById: async (id) => {
    try {
      if (!id) {
        throw new Error('Appointment ID is required');
      }

      const response = await api.get(`/api/v1/appointments/${id}`);
      
      // Check if response has the expected structure
      if (response?.data?.status === 'success' && response.data.data) {
        return response;
      }
      
      throw new Error('Invalid response structure from API');
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      
      // Handle specific error cases
      if (error.response?.status === 404) {
        throw {
          ...error,
          message: 'Appointment not found. It may have been deleted.'
        };
      }
      
      if (error.response?.data?.message) {
        throw {
          ...error,
          message: error.response.data.message
        };
      }
      
      throw error;
    }
  },

  // Create new appointment
  createAppointment: async (data) => {
    try {
      const response = await api.post('/api/v1/appointments', data);
      return response;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (id, status) => {
    try {
      const response = await api.patch(`/api/v1/appointments/${id}`, { status });
      return response;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  },

  // Update appointment
  updateAppointment: async (appointmentId, data) => {
    try {
      const response = await api.put(`/api/v1/appointments/${appointmentId}`, data);
      return response;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  // Delete appointment
  deleteAppointment: async (appointmentId) => {
    try {
      const response = await api.delete(`/api/v1/appointments/${appointmentId}`);
      return response;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }
};

export default appointmentsService; 