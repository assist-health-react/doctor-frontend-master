import api from './api';

export const nursesService = {
  // Get all nurses with pagination and search
  getNurses: async ({ search = '', page = 1, limit = 10 } = {}) => {
    try {
      const response = await api.get('/api/v1/nurses', {
        params: { search, page, limit }
      });

      // If the response is successful but doesn't have the expected structure,
      // format it to match what the component expects
      if (response.data) {
        return {
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
      console.error('Error fetching nurses:', error);
      throw error.response?.data || error;
    }
  },

  // Get a single nurse by ID
  getNurseById: async (id) => {
    try {
      const response = await api.get(`/api/v1/nurses/${id}`);
      
      // Format the response to match the expected structure
      if (response.data) {
        return {
          status: 'success',
          data: response.data
        };
      }
      
      throw new Error('Nurse not found');
    } catch (error) {
      console.error('Error fetching nurse details:', error);
      throw error.response?.data || error;
    }
  },

  // Create a new nurse
  createNurse: async (nurseData) => {
    try {
      const response = await api.post('/api/v1/nurses', nurseData);
      
      // Format the response to match the expected structure
      if (response.data) {
        return {
          status: 'success',
          data: response.data
        };
      }
      
      throw new Error('Failed to create nurse');
    } catch (error) {
      console.error('Error creating nurse:', error);
      throw error.response?.data || error;
    }
  },

  // Update an existing nurse
  updateNurse: async (id, nurseData) => {
    try {
      const response = await api.put(`/api/v1/nurses/${id}`, nurseData);
      
      // Format the response to match the expected structure
      if (response.data) {
        return {
          status: 'success',
          data: response.data
        };
      }
      
      throw new Error('Failed to update nurse');
    } catch (error) {
      console.error('Error updating nurse:', error);
      throw error.response?.data || error;
    }
  },

  // Delete a nurse
  deleteNurse: async (id) => {
    try {
      const response = await api.delete(`/api/v1/nurses/${id}`);
      
      // Format the response to match the expected structure
      if (response.data) {
        return {
          status: 'success',
          data: response.data
        };
      }
      
      throw new Error('Failed to delete nurse');
    } catch (error) {
      console.error('Error deleting nurse:', error);
      throw error.response?.data || error;
    }
  }
};

export default nursesService; 